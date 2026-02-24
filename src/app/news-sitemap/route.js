/**
 * Google News Sitemap Generator
 * Route: /news-sitemap.xml
 * 
 * Generates a Google News sitemap for indexing in Google News section
 * Updates daily with recently published articles
 */

export async function GET() {
  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    
    // Fetch recent articles from the last 7 days
    const response = await fetch(
      `${API_URL}/api/articles/status/published?limit=500&sortBy=createdAt&sortOrder=-1`,
      {
        next: { revalidate: 3600 }, // Revalidate every hour
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch articles');
    }

    const data = await response.json();
    const articles = Array.isArray(data.data) ? data.data : [];

    // Filter articles from the last 7 days for Google News
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentArticles = articles.filter(article => {
      const articleDate = new Date(article.createdAt);
      return articleDate >= sevenDaysAgo;
    });

    // Generate Google News Sitemap XML
    const sitemapXml = generateNewsSitemapXml(recentArticles);

    return new Response(sitemapXml, {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200',
      },
    });
  } catch (error) {
    console.error('Error generating news sitemap:', error);
    
    // Return a minimal valid sitemap on error
    return new Response(
      `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
  <url>
    <loc>https://theeverestnews.com</loc>
    <news:news>
      <news:publication>
        <news:name>The Everest News</news:name>
        <news:language>en</news:language>
      </news:publication>
      <news:publication_date>${new Date().toISOString()}</news:publication_date>
      <news:title>The Everest News</news:title>
    </news:news>
  </url>
</urlset>`,
      {
        headers: {
          'Content-Type': 'application/xml; charset=utf-8',
          'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200',
        },
      }
    );
  }
}

function generateNewsSitemapXml(articles) {
  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
`;

  articles.forEach(article => {
    const {
      _id,
      headline,
      description,
      category,
      createdAt,
      photos = [],
      selectedTags = [],
    } = article;

    const articleUrl = `https://theeverestnews.com/articless/${_id}`;
    const primaryImage = photos?.[0] || '';
    const imageUrl = primaryImage.startsWith('http')
      ? primaryImage
      : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/uploads/articles/${primaryImage}`;
    
    const publicationDate = new Date(createdAt).toISOString();
    const keywords = selectedTags
      .map(tag => tag.tagName || tag.name || tag)
      .filter(Boolean)
      .slice(0, 5)
      .join(', ');

    // Escape XML special characters
    const safeHeadline = escapeXml(headline);
    const safeDescription = escapeXml(description || headline);
    const safeCategory = escapeXml(category || 'News');
    const safeKeywords = escapeXml(keywords);

    xml += `  <url>
    <loc>${escapeXml(articleUrl)}</loc>
    <news:news>
      <news:publication>
        <news:name>The Everest News</news:name>
        <news:language>en</news:language>
      </news:publication>
      <news:publication_date>${publicationDate}</news:publication_date>
      <news:title>${safeHeadline}</news:title>
      <news:keywords>${safeKeywords}</news:keywords>
    </news:news>
    ${imageUrl ? `<image:image>
      <image:loc>${escapeXml(imageUrl)}</image:loc>
      <image:title>${safeHeadline}</image:title>
      <image:caption>${safeDescription}</image:caption>
    </image:image>` : ''}
  </url>
`;
  });

  xml += `</urlset>`;
  return xml;
}

function escapeXml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
