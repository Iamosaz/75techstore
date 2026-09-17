// src/components/SEO.jsx
import { Helmet } from 'react-helmet-async';

const SEO = ({
  // Basic
  title,
  description,
  keywords,
  image,
  url,
  type = 'website',

  // Product-specific
  price,
  originalPrice,
  currency = 'NGN',
  brand,
  category,
  inStock,
  sku,
  gtin,
  condition = 'NewCondition',
  rating,
  reviewCount,

  // Article/Blog-specific
  author,
  publishedTime,
  modifiedTime,
  articleSection,
  articleTags = [],

  // AEO/GEO — AI Answer Engine Optimization
  faqs = [],
  howToSteps = [],
  breadcrumbs = [],

  // Local SEO
  location,

  // Extra control
  noindex = false,
  hreflang = [],
}) => {
  const siteName = '75TechStore';
  const legalName = 'Seven Five Techstore Limited';
  const siteUrl = 'https://www.75techstore.com.ng';
  const defaultImage = 'https://www.75techstore.com.ng/og-image.jpg';
  const defaultDescription =
    '75TechStore — Lagos-based tech company selling brand new & UK-used iPhones, laptops, desktops, and accessories. Software development, laptop repairs, and IT consulting. Nationwide delivery. RC: 8681711.';
  const defaultKeywords =
    '75techstore, tech store nigeria, buy iPhone Lagos, laptops Computer Village Ikeja, phone repair Lagos, software development Lagos, UK used phones Nigeria, Samsung Galaxy Nigeria, MacBook Lagos, gaming console Nigeria, headphones Lagos, smartwatch Nigeria, pay on delivery Lagos, IT consulting Lagos, React developer Lagos, gadget shop Ikeja, Seven Five Techstore';

  const fullTitle = title
    ? `${title} | ${siteName} - Phones, Laptops & Tech Solutions in Lagos`
    : `${siteName} - Buy Phones, Laptops & Gadgets in Lagos | Software Development & Repairs`;

  const fullUrl = url ? `${siteUrl}${url}` : siteUrl;
  const fullImage = image || defaultImage;
  const fullDescription = description || defaultDescription;
  const fullKeywords = keywords || defaultKeywords;

  // ─── Organization Schema ───
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": siteName,
    "legalName": legalName,
    "alternateName": ["75 Tech Store", "75Tech", "Seven Five Techstore", "75techstore Limited"],
    "url": siteUrl,
    "logo": `${siteUrl}/logo.png`,
    "image": defaultImage,
    "description": defaultDescription,
    "foundingDate": "2020",
    "founder": {
      "@type": "Person",
      "name": "Kenneth Osazuwa",
      "jobTitle": "Software Engineer & Founder"
    },
    "taxID": "RC: 8681711",
    "priceRange": "₦₦",
    "currenciesAccepted": "NGN",
    "paymentAccepted": [
      "Cash",
      "Credit Card",
      "Debit Card",
      "Paystack",
      "Bank Transfer",
      "Pay on Delivery"
    ],
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "M Plaza, Adepele Street, Computer Village",
      "addressLocality": "Ikeja",
      "addressRegion": "Lagos",
      "postalCode": "100272",
      "addressCountry": "NG"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "6.5965",
      "longitude": "3.3421"
    },
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        "opens": "08:00",
        "closes": "20:00"
      }
    ],
    "contactPoint": [
      {
        "@type": "ContactPoint",
        "telephone": "+234-706-645-9689",
        "contactType": "customer service",
        "areaServed": "NG",
        "availableLanguage": ["English"],
        "hoursAvailable": {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
          "opens": "08:00",
          "closes": "20:00"
        }
      },
      {
        "@type": "ContactPoint",
        "telephone": "+234-706-645-9689",
        "contactType": "sales",
        "areaServed": "NG",
        "availableLanguage": ["English"]
      },
      {
        "@type": "ContactPoint",
        "contactType": "technical support",
        "areaServed": "NG",
        "availableLanguage": ["English"]
      }
    ],
    "sameAs": [
      "https://www.instagram.com/75techstore",
      "https://www.facebook.com/75techstore",
      "https://www.twitter.com/75techstore",
      "https://www.tiktok.com/@75techstore",
      "https://www.youtube.com/@75techstore",
      "https://techbehemoths.com/company/75techstore"
    ],
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "75TechStore Products & Services",
      "itemListElement": [
        {
          "@type": "OfferCatalog",
          "name": "Gadget Retail",
          "itemListElement": [
            { "@type": "Offer", "itemOffered": { "@type": "Product", "name": "iPhones" } },
            { "@type": "Offer", "itemOffered": { "@type": "Product", "name": "Android Phones" } },
            { "@type": "Offer", "itemOffered": { "@type": "Product", "name": "Laptops" } },
            { "@type": "Offer", "itemOffered": { "@type": "Product", "name": "Desktops" } },
            { "@type": "Offer", "itemOffered": { "@type": "Product", "name": "Tech Accessories" } }
          ]
        },
        {
          "@type": "OfferCatalog",
          "name": "Digital Services",
          "itemListElement": [
            { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Software Development" } },
            { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Website Development" } },
            { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Mobile App Development" } },
            { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "IT Consulting" } },
            { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Laptop & Gadget Repair" } }
          ]
        }
      ]
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "1247",
      "bestRating": "5",
      "worstRating": "1"
    },
    "areaServed": {
      "@type": "Country",
      "name": "Nigeria"
    },
    "knowsAbout": [
      "Consumer Electronics",
      "Software Development",
      "React.js",
      "Web Development",
      "Mobile App Development",
      "IT Consulting",
      "Laptop Repair",
      "Phone Repair",
      "E-commerce"
    ]
  };

  // ─── Local Business Schema (Computer Village, Ikeja) ───
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "ElectronicsStore",
    "name": siteName,
    "image": fullImage,
    "url": siteUrl,
    "telephone": "+234-706-645-9689",
    "priceRange": "₦₦",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "M Plaza, Adepele Street, Computer Village",
      "addressLocality": "Ikeja",
      "addressRegion": "Lagos",
      "postalCode": "100272",
      "addressCountry": "NG"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "6.5965",
      "longitude": "3.3421"
    },
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        "opens": "08:00",
        "closes": "20:00"
      }
    ],
    "sameAs": [
      "https://www.instagram.com/75techstore",
      "https://techbehemoths.com/company/75techstore"
    ],
    "currenciesAccepted": "NGN",
    "paymentAccepted": "Cash, Credit Card, Debit Card, Paystack, Bank Transfer, Pay on Delivery"
  };

  // ─── Website Schema with SearchAction ───
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": siteName,
    "alternateName": "75TechStore Nigeria",
    "url": siteUrl,
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${siteUrl}/shop?search={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    }
  };

  // ─── Product Schema ───
  const productSchema = price
    ? {
        "@context": "https://schema.org",
        "@type": "Product",
        "name": title,
        "description": fullDescription,
        "image": Array.isArray(fullImage) ? fullImage : [fullImage],
        "brand": {
          "@type": "Brand",
          "name": brand || siteName
        },
        "sku": sku || undefined,
        "gtin13": gtin || undefined,
        "category": category,
        "itemCondition": `https://schema.org/${condition}`,
        "offers": {
          "@type": "Offer",
          "price": price,
          "priceCurrency": currency,
          "priceValidUntil": new Date(
            new Date().setFullYear(new Date().getFullYear() + 1)
          )
            .toISOString()
            .split("T")[0],
          "availability": inStock
            ? "https://schema.org/InStock"
            : "https://schema.org/OutOfStock",
          "seller": {
            "@type": "Organization",
            "name": siteName,
            "url": siteUrl
          },
          "url": fullUrl,
          "shippingDetails": {
            "@type": "OfferShippingDetails",
            "shippingRate": {
              "@type": "MonetaryAmount",
              "value": "0",
              "currency": "NGN"
            },
            "shippingDestination": {
              "@type": "DefinedRegion",
              "addressCountry": "NG"
            },
            "deliveryTime": {
              "@type": "ShippingDeliveryTime",
              "handlingTime": {
                "@type": "QuantitativeValue",
                "minValue": 0,
                "maxValue": 1,
                "unitCode": "DAY"
              },
              "transitTime": {
                "@type": "QuantitativeValue",
                "minValue": 1,
                "maxValue": 3,
                "unitCode": "DAY"
              }
            }
          },
          "hasMerchantReturnPolicy": {
            "@type": "MerchantReturnPolicy",
            "applicableCountry": "NG",
            "returnPolicyCategory":
              "https://schema.org/MerchantReturnFiniteReturnWindow",
            "merchantReturnDays": 7,
            "returnMethod": "https://schema.org/ReturnByMail",
            "returnFees": "https://schema.org/FreeReturn"
          }
        },
        "aggregateRating": rating
          ? {
              "@type": "AggregateRating",
              "ratingValue": rating,
              "reviewCount": reviewCount || 1,
              "bestRating": "5",
              "worstRating": "1"
            }
          : undefined
      }
    : null;

  // ─── Article/Blog Schema ───
  const articleSchema =
    type === "article"
      ? {
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          "headline": title,
          "description": fullDescription,
          "image": fullImage,
          "author": {
            "@type": "Person",
            "name": author || "Kenneth Osazuwa",
            "url": `${siteUrl}/about`
          },
          "publisher": {
            "@type": "Organization",
            "name": siteName,
            "logo": {
              "@type": "ImageObject",
              "url": `${siteUrl}/logo.png`
            }
          },
          "datePublished": publishedTime,
          "dateModified": modifiedTime || publishedTime,
          "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": fullUrl
          },
          "articleSection": articleSection || category,
          "keywords": articleTags.join(", ")
        }
      : null;

  // ─── FAQ Schema (AEO — People Also Ask) ───
  const faqSchema =
    faqs.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": faqs.map((faq) => ({
            "@type": "Question",
            "name": faq.question,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": faq.answer
            }
          }))
        }
      : null;

  // ─── HowTo Schema ───
  const howToSchema =
    howToSteps.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "HowTo",
          "name": title,
          "description": fullDescription,
          "image": fullImage,
          "step": howToSteps.map((step, i) => ({
            "@type": "HowToStep",
            "position": i + 1,
            "name": step.name,
            "text": step.text,
            "image": step.image
          }))
        }
      : null;

  // ─── Breadcrumb Schema ───
  const breadcrumbSchema =
    breadcrumbs.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": breadcrumbs.map((b, i) => ({
            "@type": "ListItem",
            "position": i + 1,
            "name": b.name,
            "item": `${siteUrl}${b.url}`
          }))
        }
      : null;

  // ─── Service Schema (for service pages) ───
  const serviceSchema =
    type === "service"
      ? {
          "@context": "https://schema.org",
          "@type": "Service",
          "name": title,
          "description": fullDescription,
          "provider": {
            "@type": "Organization",
            "name": siteName,
            "url": siteUrl,
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "M Plaza, Adepele Street, Computer Village",
              "addressLocality": "Ikeja",
              "addressRegion": "Lagos",
              "addressCountry": "NG"
            }
          },
          "areaServed": {
            "@type": "Country",
            "name": "Nigeria"
          },
          "serviceType": category || "Technology Service"
        }
      : null;

  return (
    <Helmet>
      {/* ────── Basic SEO ────── */}
      <title>{fullTitle}</title>
      <meta name="description" content={fullDescription} />
      <meta name="keywords" content={fullKeywords} />
      <link rel="canonical" href={fullUrl} />
      <meta
        name="robots"
        content={
          noindex
            ? "noindex, nofollow"
            : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
        }
      />
      <meta
        name="googlebot"
        content={noindex ? "noindex, nofollow" : "index, follow"}
      />
      <meta
        name="bingbot"
        content={noindex ? "noindex, nofollow" : "index, follow"}
      />
      <meta name="author" content={author || "Kenneth Osazuwa"} />
      <meta name="publisher" content={siteName} />
      <meta name="copyright" content={`${legalName} (${siteName})`} />
      <meta name="language" content="English" />
      <meta name="geo.region" content="NG-LA" />
      <meta name="geo.country" content="NG" />
      <meta name="geo.placename" content="Computer Village, Ikeja, Lagos" />
      <meta name="theme-color" content="#000000" />
      <meta name="format-detection" content="telephone=yes" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-title" content={siteName} />

      {/* ────── AI Crawler Permissions (AEO/GEO) ────── */}
      <meta name="ChatGPT-User" content="index, follow" />
      <meta name="GPTBot" content="index, follow" />
      <meta name="Google-Extended" content="index, follow" />
      <meta name="anthropic-ai" content="index, follow" />
      <meta name="ClaudeBot" content="index, follow" />
      <meta name="PerplexityBot" content="index, follow" />
      <meta name="CCBot" content="index, follow" />
      <meta name="OAI-SearchBot" content="index, follow" />
      <meta name="cohere-ai" content="index, follow" />

      {/* ────── hreflang ────── */}
      {hreflang.map((h) => (
        <link key={h.lang} rel="alternate" hrefLang={h.lang} href={h.url} />
      ))}
      <link rel="alternate" hrefLang="x-default" href={siteUrl} />
      <link rel="alternate" hrefLang="en-NG" href={siteUrl} />

      {/* ────── Open Graph ────── */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={fullDescription} />
      <meta property="og:image" content={fullImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={title || siteName} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content="en_NG" />
      <meta property="og:locale:alternate" content="en_US" />

      {/* Article OG */}
      {type === "article" && publishedTime && (
        <meta property="article:published_time" content={publishedTime} />
      )}
      {type === "article" && modifiedTime && (
        <meta property="article:modified_time" content={modifiedTime} />
      )}
      {type === "article" && author && (
        <meta property="article:author" content={author} />
      )}
      {type === "article" && articleSection && (
        <meta property="article:section" content={articleSection} />
      )}
      {type === "article" &&
        articleTags.map((tag) => (
          <meta key={tag} property="article:tag" content={tag} />
        ))}

      {/* Product OG */}
      {price && (
        <>
          <meta property="product:price:amount" content={price} />
          <meta property="product:price:currency" content={currency} />
          <meta
            property="product:availability"
            content={inStock ? "in stock" : "out of stock"}
          />
          <meta property="product:condition" content="new" />
          <meta property="product:brand" content={brand || siteName} />
          <meta property="product:category" content={category} />
        </>
      )}

      {/* ────── Twitter/X Card ────── */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@75techstore" />
      <meta name="twitter:creator" content="@75techstore" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={fullDescription} />
      <meta name="twitter:image" content={fullImage} />
      <meta name="twitter:image:alt" content={title || siteName} />
      {price && (
        <>
          <meta name="twitter:label1" content="Price" />
          <meta
            name="twitter:data1"
            content={`₦${Number(price).toLocaleString()}`}
          />
          <meta name="twitter:label2" content="Availability" />
          <meta
            name="twitter:data2"
            content={inStock ? "In Stock" : "Out of Stock"}
          />
        </>
      )}

      {/* ────── Pinterest ────── */}
      <meta name="pinterest-rich-pin" content="true" />

      {/* ────── DNS Prefetch (Performance) ────── */}
      <link rel="dns-prefetch" href="https://res.cloudinary.com" />
      <link
        rel="preconnect"
        href="https://res.cloudinary.com"
        crossOrigin="anonymous"
      />
      <link rel="dns-prefetch" href="https://api.paystack.co" />
      <link rel="preconnect" href="https://fonts.googleapis.com" />

      {/* ────── Structured Data (JSON-LD) ────── */}
      <script type="application/ld+json">
        {JSON.stringify(organizationSchema)}
      </script>

      <script type="application/ld+json">
        {JSON.stringify(localBusinessSchema)}
      </script>

      <script type="application/ld+json">
        {JSON.stringify(websiteSchema)}
      </script>

      {productSchema && (
        <script type="application/ld+json">
          {JSON.stringify(productSchema)}
        </script>
      )}

      {articleSchema && (
        <script type="application/ld+json">
          {JSON.stringify(articleSchema)}
        </script>
      )}

      {faqSchema && (
        <script type="application/ld+json">
          {JSON.stringify(faqSchema)}
        </script>
      )}

      {howToSchema && (
        <script type="application/ld+json">
          {JSON.stringify(howToSchema)}
        </script>
      )}

      {breadcrumbSchema && (
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbSchema)}
        </script>
      )}

      {serviceSchema && (
        <script type="application/ld+json">
          {JSON.stringify(serviceSchema)}
        </script>
      )}
    </Helmet>
  );
};

export default SEO;