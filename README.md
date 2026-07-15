# SEO With Siva - Astro Project

A modern, SEO-optimized website built with Astro for optimal performance and search engine visibility.

## 🚀 Features

- **SEO-First Architecture**: Optimized meta tags, structured data, and semantic HTML
- **Performance**: Static site generation for fast load times
- **Accessibility**: WCAG compliant with proper ARIA labels and semantic markup
- **Responsive Design**: Mobile-first approach with adaptive layouts
- **Sitemap Generation**: Automatic XML sitemap for search engines
- **Open Graph Tags**: Social media optimization
- **Schema.org Markup**: Rich snippets for better SERP appearance

## 📋 SEO Optimizations Included

1. **Meta Tags**
   - Title and meta descriptions
   - Open Graph (OG) tags for social sharing
   - Twitter Card tags
   - Keywords and author information

2. **Technical SEO**
   - Canonical URLs
   - Sitemap generation
   - Robots meta tag
   - XML sitemap at `/sitemap-index.xml`

3. **Performance**
   - Static site generation
   - Minimal JavaScript
   - Image optimization ready
   - CSS scoped and optimized

4. **Accessibility**
   - Semantic HTML structure
   - ARIA labels
   - Keyboard navigation support
   - Reduced motion support

5. **Mobile Optimization**
   - Viewport meta tag
   - Responsive design
   - Mobile-friendly layout
   - Touch-friendly buttons

## 🛠 Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set your site URL in `astro.config.mjs`:
   ```javascript
   export default defineConfig({
     site: 'https://yourdomain.com',
     // ...
   });
   ```

## 🚀 Development

Start the development server:
```bash
npm run dev
```

Visit `http://localhost:3000` to view your site.

## 📦 Build

Build for production:
```bash
npm run build
```

The built site will be in the `dist/` directory.

## 👀 Preview

Preview the production build locally:
```bash
npm run preview
```

## 📄 Project Structure

```
src/
├── layouts/
│   └── BaseLayout.astro      # Main layout with SEO meta tags
├── pages/
│   └── index.astro           # Home page
└── components/               # Reusable components

public/                        # Static assets
dist/                          # Production build (generated)
```

## 🔍 SEO Best Practices Implemented

- ✅ Unique meta titles and descriptions
- ✅ Canonical URLs
- ✅ Sitemap.xml generation
- ✅ Mobile-responsive design
- ✅ Fast page load times
- ✅ Semantic HTML5 structure
- ✅ Open Graph tags for social sharing
- ✅ Schema.org structured data ready
- ✅ Proper heading hierarchy (H1 > H2 > H3)
- ✅ Alt text attributes for images
- ✅ Internal linking structure
- ✅ Robots meta tag
- ✅ Keywords meta tag
- ✅ Author information

## 🎨 Customization

### Update Site Information
Edit `astro.config.mjs` to update your site URL and other configuration.

### Modify Colors
Update the color scheme in `src/pages/index.astro` and `src/layouts/BaseLayout.astro`.

### Add New Pages
Create new `.astro` files in `src/pages/` directory. They'll automatically become routes.

### Add React Components
Use the `@astrojs/react` integration to include interactive React components.

## 📊 Performance Tips

1. Use Astro's built-in Image component for optimized images
2. Leverage static generation for faster builds
3. Minimize JavaScript bundles
4. Use CSS scoped styles
5. Preload critical resources
6. Optimize images before deployment

## 🚀 Deployment

Deploy to any static hosting provider:
- **Vercel** - Zero-config deployment
- **Netlify** - GitHub integration
- **GitHub Pages** - Free hosting
- **Cloudflare Pages** - Global CDN

## 📞 Support

For Astro documentation, visit [astro.build](https://astro.build)

## 📄 License

MIT License - feel free to use this template for your projects!
