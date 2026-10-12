import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';

const articlesDir = fileURLToPath(new URL('./src/content/articles', import.meta.url));

// Lightweight frontmatter date lookup (slug -> ISO date) without adding a YAML dependency.
const articleLastmod = {};
for (const file of readdirSync(articlesDir)) {
  if (!file.endsWith('.md')) continue;
  const slug = file.replace(/\.md$/, '');
  const raw = readFileSync(`${articlesDir}/${file}`, 'utf-8');
  const lastModified = raw.match(/^lastModified:\s*"([^"]+)"/m)?.[1];
  const date = raw.match(/^date:\s*"([^"]+)"/m)?.[1];
  const iso = lastModified || date;
  if (iso) articleLastmod[slug] = iso;
}

// Non-article pages: lastmod = last git commit touching the page file.
// Omitted when git history isn't available (e.g. a very shallow clone).
const pageFiles = {
  '/': 'src/pages/index.astro',
  '/about/': 'src/pages/about.astro',
  '/contact/': 'src/pages/contact.astro',
  '/blog/': 'src/pages/blog/index.astro',
  '/tools/': 'src/pages/tools/index.astro',
  '/tools/regex-builder/': 'src/pages/tools/regex-builder.astro',
};
function gitLastmod(file) {
  try {
    return execSync(`git log -1 --format=%cI -- "${file}"`, { encoding: 'utf-8' }).trim() || undefined;
  } catch {
    return undefined;
  }
}
const pageLastmod = Object.fromEntries(
  Object.entries(pageFiles).map(([path, file]) => [path, gitLastmod(file)])
);

export default defineConfig({
  site: 'https://www.seowithsiva.com',
  output: 'static',
  integrations: [
    sitemap({
      serialize(item) {
        const path = new URL(item.url).pathname;
        if (pageLastmod[path]) item = { ...item, lastmod: pageLastmod[path] };
        if (path === '/') {
          return { ...item, changefreq: 'weekly', priority: 1.0 };
        }
        if (path === '/blog/') {
          return { ...item, changefreq: 'weekly', priority: 0.9 };
        }
        if (path.startsWith('/blog/')) {
          const slug = path.replace('/blog/', '').replace(/\/$/, '');
          const lastmod = articleLastmod[slug];
          return { ...item, changefreq: 'monthly', priority: 0.8, ...(lastmod ? { lastmod } : {}) };
        }
        if (path === '/tools/') {
          return { ...item, changefreq: 'monthly', priority: 0.9 };
        }
        if (path.startsWith('/tools/')) {
          return { ...item, changefreq: 'monthly', priority: 0.8 };
        }
        if (path === '/about/') {
          return { ...item, changefreq: 'monthly', priority: 0.7 };
        }
        if (path === '/contact/') {
          return { ...item, changefreq: 'yearly', priority: 0.6 };
        }
        return item;
      },
    }),
  ],
});
