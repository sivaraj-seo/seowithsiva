# Deployment Guide

## Prerequisites
- Node.js 18+ installed
- npm or yarn package manager
- GitHub account (already set up)

## Local Development

### 1. Clone and Install
```bash
git clone https://github.com/sivaraj-seo/seowithsiva.git
cd seowithsiva
npm install
```

### 2. Development Server
```bash
npm run dev
```
Visit `http://localhost:3000`

### 3. Build Locally
```bash
npm run build
npm run preview
```

## Deployment Options

### Option 1: Vercel (Recommended - Already Set Up)
Your site is already configured for Vercel deployment at `https://seowithsiva.vercel.app`

**To redeploy:**
1. Push changes to GitHub
2. Vercel automatically builds and deploys

**Manual deployment:**
```bash
npm install -g vercel
vercel
```

### Option 2: Netlify
1. Connect your GitHub repo at https://app.netlify.com/
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Deploy

### Option 3: GitHub Pages
1. Update `astro.config.mjs`:
```javascript
export default defineConfig({
  site: 'https://sivaraj-seo.github.io/seowithsiva',
  outDir: './dist',
});
```

2. Add GitHub Actions workflow (`.github/workflows/deploy.yml`):
```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: \${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

### Option 4: Cloudflare Pages
1. Connect GitHub at https://dash.cloudflare.com/
2. Framework: Astro
3. Build command: `npm run build`
4. Build output: `dist`
5. Deploy

## Pre-Deployment Checklist

- [ ] Update site URL in `astro.config.mjs`
- [ ] Update social media links in pages
- [ ] Add OG image (1200x630px) to `public/og-image.png`
- [ ] Add favicon to `public/favicon.ico`
- [ ] Update contact email
- [ ] Test all links
- [ ] Run Lighthouse audit (target: 90+)
- [ ] Test on mobile devices
- [ ] Check sitemap generation: `npm run build && cat dist/sitemap-index.xml`
- [ ] Submit sitemap to Google Search Console
- [ ] Set up Google Analytics if needed

## Environment Variables

Create `.env` file for secrets:
```
ANALYTICS_ID=your-analytics-id
CONTACT_EMAIL=contact@seowithsiva.com
```

Access in Astro components:
```astro
---
const analyticsId = import.meta.env.ANALYTICS_ID;
---
```

## Post-Deployment

### 1. Google Search Console
- Add property: https://search.google.com/search-console
- Submit sitemap: `https://seowithsiva.com/sitemap-index.xml`
- Verify domain ownership

### 2. SEO Verification
- Test with Lighthouse: https://developers.google.com/web/tools/lighthouse
- Test mobile: https://search.google.com/test/mobile-friendly
- Check schema: https://schema.org/validator
- Check security: https://www.ssllabs.com/ssltest/

### 3. Monitoring
- Set up Google Analytics
- Monitor Core Web Vitals
- Track keyword rankings
- Monitor search impressions/clicks

### 4. Backups
Regular git commits serve as backups. Consider:
- Automated backups of `public/` directory
- Regular Google Search Console exports

## Troubleshooting

### Build Fails
```bash
rm -rf node_modules dist
npm install
npm run build
```

### Sitemap Not Generating
- Ensure `site` URL in `astro.config.mjs`
- Check that pages are in `src/pages/`
- Rebuild project

### Styles Not Applying
- Clear browser cache (Ctrl+Shift+Delete)
- Check for scoped vs global styles
- Rebuild: `npm run build`

### Performance Issues
- Run audit: `npm run build && npm run preview`
- Check Lighthouse
- Optimize images
- Minimize JavaScript usage

## Support

- Astro Docs: https://docs.astro.build
- Vercel Docs: https://vercel.com/docs
- GitHub Issues: https://github.com/sivaraj-seo/seowithsiva/issues

---

Happy deploying! 🚀
