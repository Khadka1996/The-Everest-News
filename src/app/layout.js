import { Inter, Noto_Sans_Devanagari } from "next/font/google";
import "./globals.css";

const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-inter',
  display: 'swap',
  preload: true
});

const notoSans = Noto_Sans_Devanagari({
  subsets: ["devanagari"],
  variable: '--font-noto-sans',
  display: 'swap',
  preload: true,
  weight: ['400', '500', '600', '700'] // Include all needed weights
});

export const metadata = {
  title: {
    default: "The Everest News | नेपालको प्रमुख समाचार पोर्टल",
    template: "%s | The Everest News",
  },
  description: "नेपालको ताजा समाचार, पर्यटन, अर्थतन्त्र, उड्डयन, खेलकुद र राजनीतिक अपडेट। एभरेस्ट क्षेत्रको विश्वसनीय समाचार स्रोत।",
  metadataBase: new URL('https://theeverestnews.com'),
  alternates: {
    canonical: "/",
    languages: {
      'ne-NP': '/',
      'en-US': '/en',
    },
  },
  openGraph: {
    title: "The Everest News | नेपालको प्रमुख समाचार पोर्टल",
    description: "नेपालको ताजा समाचार, पर्यटन, अर्थतन्त्र, उड्डयन, खेलकुद र राजनीतिक अपडेट",
    url: "https://theeverestnews.com/",
    siteName: "The Everest News",
    locale: "ne_NP",
    type: "website",
    images: [
      {
        url: "https://theeverestnews.com/logo.png",
        width: 1200,
        height: 630,
        alt: "The Everest News - नेपालको विश्वसनीय समाचार स्रोत",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "The Everest News | नेपालको प्रमुख समाचार",
    description: "नेपालको ताजा समाचार, पर्यटन, अर्थतन्त्र, उड्डयन, खेलकुद र राजनीतिक अपडेट",
    creator: "@EverestNewsNP",
    site: "@EverestNewsNP",
    images: ["https://theeverestnews.com/images/twitter-card.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180' },
    ],
    other: [
      {
        rel: 'mask-icon',
        url: '/safari-pinned-tab.svg',
        color: '#25609A',
      },
    ],
  },
  manifest: '/site.webmanifest',
  themeColor: '#25609A',
  colorScheme: 'light',
  appleWebApp: {
    capable: true,
    title: "The Everest News",
    statusBarStyle: "black-translucent",
  },
  verification: {
    google: "AIzaSyBxWzr_4tP9-dC_Zg7utqk-ODeUmlD--yo",
    yandex: "yandex-verification-key",
    bing: "BingVerificationKey",
    me: "ee5f3b4a8b8d4e4b8d4e4b8d4e4b8d4e",
  },
  other: {
    "google-news": "enable",
    "news_keywords": "नेपाल, समाचार, पर्यटन, अर्थतन्त्र, खेलकुद, उड्डयन, राजनीति, एभरेस्ट",
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="ne" dir="ltr" className={`${inter.variable} ${notoSans.variable}`}>
      <head>
        {/* Preload Critical Resources */}
        <link rel="preload" href="/images/logo.svg" as="image" type="image/svg+xml" />
        <link rel="preload" href="/fonts/NotoSansDevanagari-Regular.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        
        {/* Canonical URL */}
        <link rel="canonical" href="https://theeverestnews.com/" />
        
        {/* Sitemaps */}
        <link rel="sitemap" type="application/xml" title="Main Sitemap" href="/sitemap.xml" />
        
        {/* Google News Meta */}
        <meta name="google-news" content="enable" />
        <meta name="news_keywords" content="नेपाल, समाचार, पर्यटन, अर्थतन्त्र, खेलकुद, उड्डयन, राजनीति, एभरेस्ट" />
        
        {/* Structured Data */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "The Everest News",
            "url": "https://theeverestnews.com/",
            "potentialAction": {
              "@type": "SearchAction",
              "target": "https://theeverestnews.com/search?q={search_term_string}",
              "query-input": "required name=search_term_string"
            },
            "inLanguage": "ne-NP"
          })}} />

        <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "NewsMediaOrganization",
            "name": "The Everest News",
            "url": "https://theeverestnews.com/",
            "logo": {
              "@type": "ImageObject",
              "url": "https://theeverestnews.com/images/logo.png",
              "width": 600,
              "height": 60
            },
            "sameAs": [
              "https://www.facebook.com/profile.php?id=61557594452068",
              "https://x.com/TheEverestNews",
              "https://www.instagram.com/everestportal/",
              "https://www.youtube.com/channel/UC6bTt6eddfNfh6q1m0QxG1A",
              "https://www.linkedin.com/company/the-everest-news",
              "https://www.pinterest.com/theeverestnews/"
            ],
            "contactPoint": [{
              "@type": "ContactPoint",
              "contactType": "customer service",
              "email": "info@theeverestnews.com",
              "url": "https://theeverestnews.com/contact",
              "telephone": "+977-1-1234567"
            }],
            "publishingPrinciples": "https://theeverestnews.com/phurpasherpa",
            "foundingDate": "2023",
            "founder": {
              "@type": "Person",
              "name": "Phurba Sherpa"
            }
          })}} />

        {/* Breadcrumb Schema */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [{
              "@type": "ListItem",
              "position": 1,
              "name": "गृहपृष्ठ",
              "item": "https://theeverestnews.com/"
            }, {
              "@type": "ListItem",
              "position": 2,
              "name": "समाचार",
              "item": "https://theeverestnews.com/news"
            }, {
              "@type": "ListItem",
              "position": 3,
              "name": "categories",
              "item": "https://theeverestnews.com/categories"
            }]
          })}} />

        {/* Category Page Schema (Example for Tourism) */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "name": "पर्यटन समाचार",
            "description": "नेपालको पर्यटन क्षेत्रका ताजा समाचार, यात्रा गाइड र एभरेस्ट क्षेत्रका अपडेटहरू",
            "url": "https://theeverestnews.com/category/tourism",
            "breadcrumb": {
              "@type": "BreadcrumbList",
              "itemListElement": [{
                "@type": "ListItem",
                "position": 1,
                "name": "गृहपृष्ठ",
                "item": "https://theeverestnews.com/"
              }, {
                "@type": "ListItem",
                "position": 2,
                "name": "पर्यटन",
                "item": "https://theeverestnews.com/category/पर्यटन"
              }]
            }
          })}} />
      </head>
      <body className={`font-sans ${inter.className}`}>
        {children}
        
        {/* Structured Data for Footer */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WPFooter",
            "copyrightYear": new Date().getFullYear(),
            "copyrightHolder": {
              "@type": "Organization",
              "name": "The Everest News",
              "url": "https://theeverestnews.com"
            }
          })}} />
      </body>
    </html>
  );
}