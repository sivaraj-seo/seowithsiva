import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

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

export default defineConfig({
  site: 'https://www.seowithsiva.com',
  output: 'static',
  integrations: [
    sitemap({
      serialize(item) {
        const path = new URL(item.url).pathname;
        if (path === '/') {
          return { ...item, changefreq: 'weekly', priority: 1.0 };
        }
        if (path === '/articles/') {
          return { ...item, changefreq: 'weekly', priority: 0.9 };
        }
        if (path.startsWith('/articles/')) {
          const slug = path.replace('/articles/', '').replace(/\/$/, '');
          const lastmod = articleLastmod[slug];
          return { ...item, changefreq: 'monthly', priority: 0.8, ...(lastmod ? { lastmod } : {}) };
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
