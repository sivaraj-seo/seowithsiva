---
title: "Technical SEO Checks: 25-Point Website Checklist"
excerpt: "Run these technical SEO checks to fix crawling, indexing, Core Web Vitals, and AI crawler access. A practical 25-point checklist with tools and code. Start now."
date: "2026-11-05"
category: "Technical SEO"
readTime: "10 min read"
image: "/images/technical-seo-checks.webp"
imageAlt: "Technical SEO Checks: 25-Point Website Checklist banner"
featured: false
keyTakeaways:
  - "Work in order: crawlability, indexability, performance, architecture, then structured data and AI readiness."
  - "Check AI crawler access deliberately. A robots.txt that allows a bot means nothing if your CDN or firewall returns a 403 to it."
  - "Core Web Vitals \"good\" thresholds are LCP ≤ 2.5s, INP ≤ 200ms, and CLS ≤ 0.1, measured on real-user field data."
  - "Many AI crawlers read raw HTML only, so critical content must not depend on JavaScript."
  - "Run robots.txt, noindex, canonical, and rendering checks on staging before every release."
faqs:
  - question: "What is the most important technical SEO check?"
    answer: "Crawlability. Confirm robots.txt isn't blocking key pages and that no stray noindex tags exist. If search engines can't crawl or index a page, no other optimization will help it rank."
  - question: "How long does a technical SEO audit take?"
    answer: "For a site under 500 pages, a thorough technical SEO audit takes 1–2 days with tools like Screaming Frog and Search Console. Enterprise sites with millions of URLs can take several weeks, mainly for log file analysis and template-level review."
  - question: "Are Core Web Vitals a ranking factor?"
    answer: "Yes. Google uses Core Web Vitals as part of its page experience signals. They work more as a tiebreaker than a dominant factor: great content with average speed usually beats fast but thin content. Failing badly on mobile still costs you."
  - question: "Should I block AI crawlers in robots.txt?"
    answer: "It depends on your goals. Blocking AI search crawlers like OAI-SearchBot or PerplexityBot can remove you from AI-generated answers. Many sites allow search/retrieval bots while making a separate decision about training crawlers like GPTBot."
  - question: "Can I do technical SEO checks without a developer?"
    answer: "Many of them, yes. Reviewing robots.txt, sitemaps, Search Console reports, and structured data needs no coding. Fixes like SSR, INP optimization, and redirect logic usually need developer help."
---

## What Are Technical SEO Checks?

Technical SEO checks audit your website's infrastructure: the server, code, and configuration beneath your content. Unlike on-page SEO (keywords, headings, copy) or off-page SEO (links, mentions), technical SEO answers one question: *can machines access and understand this site efficiently?*

A good technical SEO audit catches the issues that silently suppress rankings: a stray noindex tag, a redirect chain, a JavaScript-rendered product grid that crawlers never see.

### Tools you'll need

| Tool | What it's best for | Cost |
| ----- | ----- | ----- |
| Google Search Console | Indexing status, Core Web Vitals field data, crawl stats | Free |
| PageSpeed Insights | Lab + real-user (CrUX) performance data | Free |
| Screaming Frog SEO Spider | Full-site crawl: status codes, canonicals, redirects | Free up to 500 URLs |
| Bing Webmaster Tools | Bing indexing, IndexNow, Copilot visibility signals | Free |
| Rich Results Test | Structured data validation | Free |
| Server log analyzer | What bots actually crawl (Googlebot, GPTBot, etc.) | Varies |

## 1. Crawlability Checks

If crawlers can't reach a page, nothing else on this list matters.

### Check 1: Review robots.txt for accidental blocks

Open `yourdomain.com/robots.txt` and read it line by line. The classic disaster is a staging rule that survived launch:

```
User-agent: *
Disallow: /
```

**Good looks like:** Only admin, cart, internal search, and parameter-driven URLs are disallowed. CSS and JS files are never blocked, because Google needs them to render the page.

### Check 2: Decide your AI crawler policy explicitly

Your robots.txt now governs AI bots too. Many sites block them by accident through a blanket rule or a CDN "bot protection" setting. Decide deliberately which you allow:

```
# Search engines
User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

# AI search / answer engines
User-agent: OAI-SearchBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: ClaudeBot
Allow: /

# AI training crawler (allow or block based on your policy)
User-agent: GPTBot
Allow: /

User-agent: *
Disallow: /admin/
Disallow: /cart/

Sitemap: https://www.example.com/sitemap.xml
```

**Tip:** Also check your CDN or firewall (Cloudflare, Akamai). A robots.txt that allows a bot means nothing if the WAF returns a 403 to it.

### Check 3: Validate the XML sitemap

Your sitemap should be a clean list of URLs you *want* indexed:

* Only 200-status, indexable, canonical URLs
* No redirects, 404s, or noindex pages
* Accurate `<lastmod>` dates (don't set every page to today)
* Under 50,000 URLs / 50MB per file; use a sitemap index beyond that
* Submitted in both Google Search Console and Bing Webmaster Tools

### Check 4: Find crawl traps and wasted crawl budget

Faceted navigation, calendar widgets, session IDs, and sort parameters can generate near-infinite URLs. Check **Search Console → Settings → Crawl stats** and your server logs. If bots spend most of their time on `?sort=` and `?filter=` URLs, you have a crawl budget leak.

### Check 5: Fix server errors and response times

Look for 5xx errors in Crawl stats. Repeated server errors make Googlebot slow its crawl rate. Average response time under ~500ms is a healthy target for most sites.

## 2. Indexability Checks

Crawled doesn't mean indexed. These technical SEO checks confirm that the right pages make it into the index and the wrong ones stay out.

### Check 6: Audit the Page Indexing report

In Search Console, open **Indexing → Pages** and review every "Why pages aren't indexed" reason. Prioritize:

* **Crawled – currently not indexed:** often thin or duplicate content
* **Duplicate without user-selected canonical:** canonical signals missing or conflicting
* **Excluded by 'noindex' tag:** confirm every one is intentional

### Check 7: Hunt for stray noindex directives

noindex can live in two places: the meta robots tag *and* the `X-Robots-Tag` HTTP header. Crawlers that skip the header leave the second one invisible to most quick checks. Test both:

```sh
curl -sI https://www.example.com/page/ | grep -i x-robots-tag
```

### Check 8: Verify canonical tags

Every indexable page should have a self-referencing canonical, and duplicates should point to the preferred version:

```html
<link rel="canonical" href="https://www.example.com/technical-seo-checks/" />
```

**Common failures:** canonicals pointing to redirected or 404 URLs, HTTP canonicals on HTTPS pages, and canonicals that conflict with the sitemap or hreflang.

### Check 9: Consolidate URL variants

Only one version of your site should resolve. All others should 301 to it:

| Variant | Should do |
| ----- | ----- |
| `http://example.com` | 301 → `https://www.example.com` |
| `https://example.com` | 301 → `https://www.example.com` |
| `https://www.example.com/page` vs `/page/` | Pick one, 301 the other |
| Uppercase URLs | 301 to lowercase |

### Check 10: Check hreflang (multilingual sites only)

Hreflang tags must be reciprocal, use valid ISO codes (`en-in`, not `en-india`), and point to canonical, 200-status URLs. Include an `x-default`.

## 3. Site Speed and Core Web Vitals Checks

Core Web Vitals are Google's real-user experience metrics. Per Google's own documentation, the "good" thresholds, measured at the 75th percentile of page loads, are:

| Metric | Measures | Good | Poor |
| ----- | ----- | ----- | ----- |
| **LCP** (Largest Contentful Paint) | Loading | ≤ 2.5s | > 4.0s |
| **INP** (Interaction to Next Paint) | Responsiveness | ≤ 200ms | > 500ms |
| **CLS** (Cumulative Layout Shift) | Visual stability | ≤ 0.1 | > 0.25 |

**Note:** Several 2026 blog posts claim Google tightened LCP to 2.0s. Google's official documentation still lists 2.5s. Go by the source.

### Check 11: Use field data, not just lab scores

A Lighthouse score of 95 means little if real users on mid-range Android phones fail. Check the **Core Web Vitals report** in Search Console and the "Discover what your real users are experiencing" section in PageSpeed Insights. A page fails if *any one* metric fails.

### Check 12: Fix LCP

* Don't lazy-load the hero image; add `fetchpriority="high"`
* Serve images in WebP/AVIF at the correct dimensions
* Reduce TTFB with caching and a CDN
* Inline critical CSS; defer the rest

### Check 13: Fix INP

INP replaced First Input Delay in March 2024 and is harder to pass because it measures *every* interaction, not just the first. Break up long JavaScript tasks, defer third-party scripts (chat widgets, tag managers, heatmaps), and avoid heavy work in click handlers.

### Check 14: Fix CLS

Set explicit width and height on images and embeds, reserve space for ads, and use `font-display: optional` or preloaded fonts to prevent text reflow.

### Check 15: Confirm mobile parity

Google indexes the mobile version of your site. Check that mobile shows the same main content, structured data, internal links, and meta tags as desktop. Hidden-on-mobile content may as well not exist.

## 4. Site Architecture and Security Checks

### Check 16: Enforce HTTPS everywhere

Check for mixed content (HTTP images or scripts on HTTPS pages), a valid SSL certificate, and an HSTS header.

### Check 17: Eliminate redirect chains and loops

Each URL should redirect in one hop. A → B → C → D wastes crawl budget and dilutes signals. Update internal links to point directly to the final destination.

### Check 18: Fix broken internal links

Crawl the site with Screaming Frog and filter for 4xx responses on internal links. Fix the link at the source; don't just redirect the 404.

### Check 19: Keep important pages within 3 clicks

Pages buried deep in the architecture get crawled less often and receive less internal link equity. Check crawl depth in your crawler and surface priority pages through navigation, hub pages, and contextual links.

### Check 20: Find orphan pages

Orphan pages have no internal links pointing to them. Compare the URLs in your sitemap and analytics against the URLs your crawler discovered. Anything in the first list but not the second is an orphan.

## 5. Structured Data and AI Readiness Checks

This is where technical SEO checks now overlap with GEO (Generative Engine Optimization). AI systems extract facts; your job is to make extraction easy.

### Check 21: Validate structured data

Run key templates through Google's Rich Results Test and the Schema.org validator. Fix all errors, then review warnings. Common high-value types: Organization, Article, Product, BreadcrumbList, LocalBusiness, and FAQPage.

**Rule:** Schema must match visible content. Marking up reviews or FAQs that users can't see violates Google's guidelines.

### Check 22: Ensure critical content is in the raw HTML

Google renders JavaScript, but many AI crawlers fetch raw HTML only and don't execute JS. Test it:

```sh
curl -s https://www.example.com/page/ | grep -i "your key product name"
```

If your main content, prices, or headings only appear after JavaScript runs, move to server-side rendering (SSR) or static generation for those templates.

### Check 23: Check heading structure and semantic HTML

One `<h1>` per page, logical H2/H3 nesting, real `<table>`, `<ul>`, and `<ol>` elements instead of styled divs. Clean semantic HTML is easier for both Google's passage ranking and LLM extraction.

### Check 24: Consider llms.txt (optional)

llms.txt is a proposed file that gives AI agents a curated map of your key content. It's cheap to add, but treat it as experimental: it's a community proposal rather than an official standard, and you shouldn't expect it to replace robots.txt, sitemaps, or good HTML.

### Check 25: Enable IndexNow

IndexNow pings Bing, Yandex, and other participating engines the moment you publish or update a URL. Since Bing's index feeds Microsoft Copilot, faster Bing indexing can mean faster AI visibility. Most major CMS platforms and CDNs offer a plugin or toggle.

## How Often Should You Run Technical SEO Checks?

| Frequency | What to check |
| ----- | ----- |
| **Weekly** | Search Console coverage errors, Core Web Vitals report, 5xx spikes |
| **Monthly** | Full site crawl (status codes, canonicals, redirects, orphan pages) |
| **Quarterly** | Full technical SEO audit, log file analysis, AI crawler access review |
| **Every release** | robots.txt, noindex tags, canonicals, and rendering on staging *before* deploy |

The "every release" row prevents more disasters than the other three combined. Most catastrophic technical SEO issues ship with a site migration or redesign.

## Conclusion

Technical SEO isn't glamorous, but it's the foundation everything else stands on. Work through these 25 technical SEO checks in order: **crawlability → indexability → performance → architecture → structured data and AI readiness**. Fix what blocks access first, then what dilutes signals, then what slows users down.

Start today with the three highest-leverage checks: read your robots.txt, open the Page Indexing report in Search Console, and check your Core Web Vitals field data. Those 30 minutes will tell you where your biggest problems are.

## Frequently Asked Questions

### What is the most important technical SEO check?

Crawlability. Confirm robots.txt isn't blocking key pages and that no stray noindex tags exist. If search engines can't crawl or index a page, no other optimization will help it rank.

### How long does a technical SEO audit take?

For a site under 500 pages, a thorough technical SEO audit takes 1–2 days with tools like Screaming Frog and Search Console. Enterprise sites with millions of URLs can take several weeks, mainly for log file analysis and template-level review.

### Are Core Web Vitals a ranking factor?

Yes. Google uses Core Web Vitals as part of its page experience signals. They work more as a tiebreaker than a dominant factor: great content with average speed usually beats fast but thin content. Failing badly on mobile still costs you.

### Should I block AI crawlers in robots.txt?

It depends on your goals. Blocking AI search crawlers like OAI-SearchBot or PerplexityBot can remove you from AI-generated answers. Many sites allow search/retrieval bots while making a separate decision about training crawlers like GPTBot.

### Can I do technical SEO checks without a developer?

Many of them, yes. Reviewing robots.txt, sitemaps, Search Console reports, and structured data needs no coding. Fixes like SSR, INP optimization, and redirect logic usually need developer help.
