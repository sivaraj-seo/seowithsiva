# Assets Directory

Store images, fonts, and other static assets here.

## Images
Place optimized images in this directory and use Astro's Image component:

```astro
---
import { Image } from 'astro:assets';
import myImage from '../assets/image.jpg';
---

<Image src={myImage} alt="Description" />
```

## Benefits of Astro Image Component
- Automatic format optimization (AVIF, WebP)
- Responsive image generation
- Lazy loading by default
- Image dimensioning
- Reduced CLS (Cumulative Layout Shift)

## Supported Formats
- JPEG
- PNG
- WEBP
- AVIF
- GIF (static only)
- SVG

## Organization
```
assets/
├── images/
│   ├── hero/
│   ├── icons/
│   └── logos/
├── fonts/
└── videos/
```
