# 📋 Implemented Schema Markup Reference

## Category Pages Schema

### CollectionPage Schema
```json
{
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "name": "Breaking News - Latest Updates & Stories",
  "description": "Collection of news articles about Breaking in Nepal",
  "url": "https://theeverestnews.com/category/breaking",
  "image": "https://theeverestnews.com/images/categories/breaking.jpg",
  "publisher": {
    "@type": "Organization",
    "name": "The Everest News",
    "logo": {
      "@type": "ImageObject",
      "url": "https://theeverestnews.com/logo.png",
      "width": 250,
      "height": 250
    }
  },
  "mainEntity": {
    "@type": "NewsCollection",
    "name": "Latest Breaking News",
    "description": "Recent news stories about Breaking from Nepal",
    "headline": "Breaking News Coverage"
  }
}
```

### BreadcrumbList Schema (Categories)
```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://theeverestnews.com"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Categories",
      "item": "https://theeverestnews.com/categories"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "Breaking",
      "item": "https://theeverestnews.com/category/breaking"
    }
  ]
}
```

---

## Article Pages Schema

### NewsArticle Schema
```json
{
  "@context": "https://schema.org",
  "@type": "NewsArticle",
  "headline": "Government Announces New Tourism Policy for Nepal",
  "description": "The government has announced a revolutionary new tourism policy...",
  "image": [
    "https://theeverestnews.com/uploads/articles/image1.jpg",
    "https://theeverestnews.com/uploads/articles/image2.jpg"
  ],
  "datePublished": "2024-01-15T10:30:00Z",
  "dateModified": "2024-01-15T10:30:00Z",
  "author": [
    {
      "@type": "Person",
      "name": "Ram Shrestha",
      "url": "https://theeverestnews.com/author/ram-shrestha",
      "image": "https://theeverestnews.com/uploads/authors/ram.jpg"
    },
    {
      "@type": "Person",
      "name": "Priya Neupane",
      "url": "https://theeverestnews.com/author/priya-neupane",
      "image": "https://theeverestnews.com/uploads/authors/priya.jpg"
    }
  ],
  "publisher": {
    "@type": "Organization",
    "name": "The Everest News",
    "logo": {
      "@type": "ImageObject",
      "url": "https://theeverestnews.com/logo.png",
      "width": 250,
      "height": 250
    },
    "url": "https://theeverestnews.com"
  },
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": "https://theeverestnews.com/articless/507d2f3b9c4e5a6f8b2c1a9d"
  },
  "url": "https://theeverestnews.com/articless/507d2f3b9c4e5a6f8b2c1a9d",
  "articleSection": "Tourism",
  "keywords": ["tourism", "nepal", "policy", "government", "travel"],
  "isAccessibleForFree": true
}
```

### BreadcrumbList Schema (Articles)
```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://theeverestnews.com"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Tourism",
      "item": "https://theeverestnews.com/category/tourism"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "Government Announces New Tourism Policy for Nepal",
      "item": "https://theeverestnews.com/articless/507d2f3b9c4e5a6f8b2c1a9d"
    }
  ]
}
```

---

## Google News Sitemap Format

### Sample from `/news-sitemap.xml`
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
  <url>
    <loc>https://theeverestnews.com/articless/507d2f3b9c4e5a6f8b2c1a9d</loc>
    <news:news>
      <news:publication>
        <news:name>The Everest News</news:name>
        <news:language>en</news:language>
      </news:publication>
      <news:publication_date>2024-01-15T10:30:00Z</news:publication_date>
      <news:title>Government Announces New Tourism Policy for Nepal</news:title>
      <news:keywords>tourism, nepal, policy, government</news:keywords>
    </news:news>
    <image:image>
      <image:loc>https://theeverestnews.com/uploads/articles/image1.jpg</image:loc>
      <image:title>Government Announces New Tourism Policy for Nepal</image:title>
      <image:caption>The government has announced a revolutionary new tourism policy...</image:caption>
    </image:image>
  </url>
  <!-- More articles... -->
</urlset>
```

---

## robots.txt Content

```
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/
Disallow: /private/
Disallow: /*.json$
Disallow: /login
Disallow: /signup

# Allow crawling of search parameters
Allow: /?*

# Sitemaps
Sitemap: https://theeverestnews.com/sitemap.xml
Sitemap: https://theeverestnews.com/news-sitemap.xml

# Google-specific directives
User-agent: Googlebot
Allow: /
Crawl-delay: 0

# Bing-specific directives
User-agent: Bingbot
Allow: /
Crawl-delay: 1

# Other search engines
User-agent: Slurp
Allow: /

User-agent: DuckDuckBot
Allow: /

# Block bad bots
User-agent: AhrefsBot
Disallow: /

User-agent: SemrushBot
Disallow: /

User-agent: DotBot
Disallow: /
```

---

## Open Graph Tags (Category Pages)

```html
<meta property="og:title" content="Breaking News | The Everest News" />
<meta property="og:description" content="Stay updated with the latest Breaking news, trends and developments in Nepal" />
<meta property="og:url" content="https://theeverestnews.com/category/breaking" />
<meta property="og:type" content="website" />
<meta property="og:image" content="https://theeverestnews.com/images/categories/breaking.jpg" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:site_name" content="The Everest News" />
<meta property="og:locale" content="en_US" />
```

---

## Open Graph Tags (Article Pages)

```html
<meta property="og:title" content="Government Announces New Tourism Policy for Nepal" />
<meta property="og:description" content="The government has announced a revolutionary new tourism policy..." />
<meta property="og:url" content="https://theeverestnews.com/articless/507d2f3b9c4e5a6f8b2c1a9d" />
<meta property="og:type" content="article" />
<meta property="og:image" content="https://theeverestnews.com/uploads/articles/image1.jpg" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:site_name" content="The Everest News" />
<meta property="article:published_time" content="2024-01-15T10:30:00Z" />
<meta property="article:modified_time" content="2024-01-15T10:30:00Z" />
<meta property="article:author" content="Ram Shrestha" />
<meta property="article:author" content="Priya Neupane" />
<meta property="article:tag" content="tourism" />
<meta property="article:tag" content="nepal" />
<meta property="article:section" content="Tourism" />
```

---

## Twitter Card Tags

```html
<!-- Category Pages -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="Breaking News | The Everest News" />
<meta name="twitter:description" content="Latest Breaking news updates and stories from Nepal" />
<meta name="twitter:image" content="https://theeverestnews.com/images/categories/breaking.jpg" />
<meta name="twitter:creator" content="@TheEverestNews" />

<!-- Article Pages -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="Government Announces New Tourism Policy for Nepal" />
<meta name="twitter:description" content="The government has announced a revolutionary new tourism policy..." />
<meta name="twitter:image" content="https://theeverestnews.com/uploads/articles/image1.jpg" />
<meta name="twitter:creator" content="@TheEverestNews" />
```

---

## Canonical URL Tags

```html
<!-- Category Pages -->
<link rel="canonical" href="https://theeverestnews.com/category/breaking" />

<!-- Article Pages -->
<link rel="canonical" href="https://theeverestnews.com/articless/507d2f3b9c4e5a6f8b2c1a9d" />
```

---

## Alternate Language Links

```html
<!-- For Nepali Articles -->
<link rel="alternate" hreflang="ne-NP" href="https://theeverestnews.com/ne/category/breaking" />
<link rel="alternate" hreflang="en-US" href="https://theeverestnews.com/category/breaking" />
<link rel="alternate" hreflang="x-default" href="https://theeverestnews.com/category/breaking" />
```

---

## Robots Meta Tags

```html
<meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
<meta name="googlebot" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
```

---

## JSON-LD Placement in HTML

These JSON-LD scripts are automatically generated by Next.js and placed in the `<head>`:

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "NewsArticle",
  "headline": "Article Title",
  ... (full schema)
}
</script>

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  ... (full schema)
}
</script>
```

---

## How to Verify Markup in Browser

1. **Right-click** on any page
2. **Select** "View Page Source" (or press Ctrl+U / Cmd+U)
3. **Search** for `ld+json` to find JSON-LD scripts
4. **Verify** the structure matches above examples

---

## Common Troubleshooting

| Issue | Solution |
|-------|----------|
| Schema not showing | Clear browser cache, refresh page |
| Image not in schema | Ensure image URL is absolute (not relative) |
| Author not showing | Verify authors array has names and URLs |
| Date format wrong | Should be ISO 8601: `2024-01-15T10:30:00Z` |
| News sitemap empty | Articles must be less than 7 days old |

---

**Reference Date**: January 2024
**Schema.org Version**: Latest (v13+)
**Compatible with**: Google, Bing, Yandex, DuckDuckGo
