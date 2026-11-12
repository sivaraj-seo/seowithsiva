import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';
import { handleSitemapRequest } from './src/utils/sitemapProxy.mjs';

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
  '/courses/': 'src/pages/courses/index.astro',
  '/tools/': 'src/pages/tools/index.astro',
  '/tools/regex-builder/': 'src/pages/tools/regex-builder.astro',
  '/tools/search-intent-classifier/': 'src/pages/tools/search-intent-classifier.astro',
  '/tools/sitemap-extractor/': 'src/pages/tools/sitemap-extractor.astro',
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

// Serves /api/sitemap in `astro dev` the same way api/sitemap.js does on Vercel.
const sitemapApiDev = {
  name: 'sitemap-api-dev',
  configureServer(server) {
    server.middlewares.use('/api/sitemap', (req, res) => handleSitemapRequest(req, res));
  },
};

export default defineConfig({
  site: 'https://www.seowithsiva.com',
  output: 'static',
  vite: { plugins: [sitemapApiDev] },
  integrations: [
    sitemap({
      // No changefreq / priority: Google ignores both. Only lastmod is emitted.
      serialize(item) {
        const path = new URL(item.url).pathname;
        if (pageLastmod[path]) item = { ...item, lastmod: pageLastmod[path] };
        if (path.startsWith('/blog/')) {
          const slug = path.replace('/blog/', '').replace(/\/$/, '');
          const lastmod = articleLastmod[slug];
          if (lastmod) item = { ...item, lastmod };
        }
        return item;
      },
    }),
  ],
});
