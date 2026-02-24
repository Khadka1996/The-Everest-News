export async function generateMetadata({ params }) {
  const category = decodeURIComponent(params.categoryName);
  const capitalized = category.charAt(0).toUpperCase() + category.slice(1);
  const categoryImageUrl = `https://theeverestnews.com/images/categories/${category}.jpg`;
  const defaultImageUrl = 'https://theeverestnews.com/logo.png';

  return {
    title: `${capitalized} News - Latest Updates & Stories | The Everest News`,
    description: `Comprehensive ${capitalized} news coverage in Nepal. Breaking stories, in-depth analysis, and expert opinions on ${capitalized} from The Everest News.`,
    
    alternates: {
      canonical: `https://theeverestnews.com/category/${encodeURIComponent(category)}`,
    },
    
    openGraph: {
      title: `${capitalized} News | The Everest News`,
      description: `Stay updated with the latest ${capitalized} news, trends and developments in Nepal`,
      url: `https://theeverestnews.com/category/${encodeURIComponent(category)}`,
      images: [
        {
          url: categoryImageUrl,
          width: 1200,
          height: 630,
          alt: `${capitalized} News Coverage`,
        },
        {
          url: defaultImageUrl,
          width: 1200,
          height: 630,
          alt: 'The Everest News Logo',
        }
      ],
      siteName: "The Everest News",
      locale: "en_US",
      type: "website",
    },

    twitter: {
      card: 'summary_large_image',
      title: `${capitalized} News | The Everest News`,
      description: `Latest ${capitalized} news updates and stories from Nepal`,
      images: [categoryImageUrl],
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

    // Additional SEO meta tags
    metadataBase: new URL('https://theeverestnews.com'),
    keywords: [
      `${capitalized} news`,
      `${capitalized} Nepal`,
      `Latest ${capitalized} updates`,
      `Nepal ${capitalized} stories`,
      `${capitalized} news in Nepali`
    ],

    // JSON-LD Schema Data for Rich Results
    other: {
      // CollectionPage Schema (for Google Rich Results)
      'script:ld+json:collection': JSON.stringify({
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "name": `${capitalized} News - Latest Updates & Stories`,
        "description": `Collection of news articles about ${capitalized} in Nepal`,
        "url": `https://theeverestnews.com/category/${encodeURIComponent(category)}`,
        "image": categoryImageUrl,
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
          "name": `Latest ${capitalized} News`,
          "description": `Recent news stories about ${capitalized} from Nepal`,
          "headline": `${capitalized} News Coverage`
        }
      }),
      
      // BreadcrumbList Schema (for navigation hierarchy)
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
            "name": "Categories",
            "item": "https://theeverestnews.com/categories"
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": capitalized,
            "item": `https://theeverestnews.com/category/${encodeURIComponent(category)}`
          }
        ]
      })
    }
  };
}