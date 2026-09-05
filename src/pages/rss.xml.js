import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
  const articles = await getCollection('articles');
  const sorted = articles.sort(
    (a, b) => new Date(b.data.date).getTime() - new Date(a.data.date).getTime()
  );

  return rss({
    title: 'SEO With Siva',
    description: 'Field notes on AI search optimisation, GEO, AEO, and enterprise SEO strategy - by C. Sivaraj.',
    site: context.site,
    items: sorted.map((article) => ({
      title: article.data.title,
      description: article.data.excerpt,
      pubDate: new Date(article.data.date),
      link: `/articles/${article.slug}/`,
      categories: [article.data.category],
    })),
    customData: '<language>en-us</language>',
  });
}
