import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

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
