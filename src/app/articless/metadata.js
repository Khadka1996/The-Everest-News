export async function generateMetadata({ params }) {
  /**
   * Dynamic metadata generator for article detail pages
   * Extracts article ID from URL params and generates SEO-optimized metadata
   * with NewsArticle schema for Google Rich Results
   */
  
  const { id } = params;
  
  if (!id) {
    return {
      title: 'Article | The Everest News',
      description: 'Read the latest news articles from The Everest News',
    };
  }

  // Fetch article data from API for server-side metadata generation
  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://potal.theeverestnews.com/';
    const articleResponse = await fetch(`${API_URL}/api/articles/${id}`, {
      next: { revalidate: 3600 } // Cache for 1 hour
    });

    if (!articleResponse.ok) {
      throw new Error('Failed to fetch article');
    }

    const articleData = articleResponse.json();
    const article = articleData?.data || null;

    if (!article) {
      return {
        title: 'Article | The Everest News',
        description: 'Read news articles from The Everest News',
      };
    }

    const {
      headline = 'Untitled Article',
      description = '',
      photos = [],
      category = '',
      createdAt = new Date().toISOString(),
      authors = [],
      selectedTags = [],
      _id = id,
    } = article;

    const primaryImage = photos?.[0] || 'https://theeverestnews.com/logo.png';
    const imageUrl = primaryImage.startsWith('http') 
      ? primaryImage 
      : `${process.env.NEXT_PUBLIC_API_URL}/uploads/articles/${primaryImage}`;

    const articleUrl = `https://theeverestnews.com/articless/${_id}`;
    const authorsArray = Array.isArray(authors) ? authors : [];
    const tagsArray = Array.isArray(selectedTags) ? selectedTags : [];

    return {
      title: `${headline} | The Everest News`,
      description: description.substring(0, 160) || `Read: ${headline} on The Everest News`,
      
      alternates: {
        canonical: articleUrl,
      },

      openGraph: {
        title: headline,
        description: description.substring(0, 160) || `Breaking news: ${headline}`,
        url: articleUrl,
        type: 'article',
        images: [
          {
            url: imageUrl,
            width: 1200,
            height: 630,
            alt: headline,
          },
          {
            url: 'https://theeverestnews.com/logo.png',
            width: 1200,
            height: 630,
            alt: 'The Everest News',
          }
        ],
        siteName: 'The Everest News',
        locale: 'en_US',
        publishedTime: createdAt,
        authors: authorsArray.map(a => a.fullName || a.name || a).filter(Boolean),
        tags: tagsArray.map(t => t.tagName || t.name || t).filter(Boolean),
      },

      twitter: {
        card: 'summary_large_image',
        title: headline,
        description: description.substring(0, 160) || `Breaking: ${headline}`,
        images: [imageUrl],
        creator: '@TheEverestNews',
      },

      robots: {
        index: true,
        follow: true,
        nocache: false,
        googleBot: {
          index: true,
          follow: true,
          'max-video-preview': -1,
          'max-image-preview': 'large',
          'max-snippet': -1,
        }
      },

      // SEO Keywords with category and tags
      keywords: [
        headline,
        category,
        ...tagsArray.map(t => t.tagName || t.name || t),
        'Nepal news',
        'Latest news',
        'Breaking news'
      ].filter(Boolean),

      metadataBase: new URL('https://theeverestnews.com'),
      
      // JSON-LD Structured Data for Rich Results
      other: {
        // NewsArticle Schema (Critical for Google News and search results)
        'script:ld+json:article': JSON.stringify({
          "@context": "https://schema.org",
          "@type": "NewsArticle",
          "headline": headline,
          "description": description,
          "image": [imageUrl],
          "datePublished": createdAt,
          "dateModified": createdAt,
          "author": authorsArray.length > 0 ? authorsArray.map(author => ({
            "@type": "Person",
            "name": author.fullName || author.name || "Unknown Author",
            "url": author.authorUrl || undefined,
            "image": author.photo ? 
              (author.photo.startsWith('http') 
                ? author.photo 
                : `${process.env.NEXT_PUBLIC_API_URL}/uploads/authors/${author.photo}`)
              : undefined
          })).filter(a => a.name !== "Unknown Author") : [{
            "@type": "Organization",
            "name": "The Everest News"
          }],
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
            "@id": articleUrl
          },
          "url": articleUrl,
          "articleSection": category || "News",
          "keywords": tagsArray.map(t => t.tagName || t.name || t).filter(Boolean),
          "isAccessibleForFree": true
        }),

        // Article Breadcrumb Schema
        'script:ld+json:breadcrumb': JSON.stringify({
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
              "name": category || "News",
              "item": `https://theeverestnews.com/category/${encodeURIComponent(category || 'news')}`
            },
            {
              "@type": "ListItem",
              "position": 3,
              "name": headline,
              "item": articleUrl
            }
          ]
        })
      }
    };
  } catch (error) {
    console.error('Error generating metadata for article:', error);
    
    // Return default metadata if API fails
    return {
      title: 'Article | The Everest News',
      description: 'Read the latest news articles from The Everest News',
      robots: {
        index: true,
        follow: true,
      }
    };
  }
}
