import { Helmet } from 'react-helmet-async';

/* ─────────────────────────────────────────────────────────────
   SITE CONSTANTS — edit here, nowhere else.
   Everything in the structured data must match what visitors
   actually see on the site (phone, hours, returns, delivery).
   ───────────────────────────────────────────────────────────── */
const SITE_NAME = '75TechStore';
const LEGAL_NAME = 'Seven Five Techstore Limited'; // footer says "75TechStore Limited" — use your exact CAC name
const SITE_URL = 'https://www.75techstore.com.ng';
const LOGO = `${SITE_URL}/brand-icon.png`; // exists in /public
const DEFAULT_IMAGE = `${SITE_URL}/og-image.jpg`; // exists in /public (keep it 1200x630)
const PHONE = '+234-703-562-0709'; // matches the footer
const EMAIL = '75techstore@gmail.com';
const RETURN_DAYS = 30; // site says "30 days money back guarantee"

const DEFAULT_TITLE = `${SITE_NAME} | Buy Phones, Laptops & Gadgets in Lagos`;
const DEFAULT_DESCRIPTION =
  '75TechStore is a Lagos-based tech company selling brand new and UK-used phones, laptops and accessories, with repairs, software development and IT consulting. Nationwide delivery.';

const ADDRESS = {
  '@type': 'PostalAddress',
  streetAddress: 'M Plaza, Adepele Street, Computer Village',
  addressLocality: 'Ikeja',
  addressRegion: 'Lagos',
  postalCode: '100272',
  addressCountry: 'NG',
};

const GEO = { '@type': 'GeoCoordinates', latitude: 6.5965, longitude: 3.3421 };

const HOURS = [
  {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    opens: '08:00',
    closes: '20:00',
  },
];

// Keep only profiles that really exist and are active.
const SAME_AS = [
  'https://www.instagram.com/75techstore',
  'https://www.facebook.com/75techstore',
  'https://x.com/75techstore',
  'https://www.tiktok.com/@75techstore',
  'https://www.youtube.com/@75techstore',
  'https://techbehemoths.com/company/75techstore',
];

/* ── helpers ── */
const abs = (src) => {
  if (!src) return undefined;
  if (/^https?:\/\//i.test(src)) return src;
  return `${SITE_URL}${src.startsWith('/') ? '' : '/'}${src}`;
};

const clip = (str, max) =>
  str && str.length > max ? `${str.slice(0, max - 1).trimEnd()}…` : str;

// Canonical path: no query string, no hash, no trailing slash.
const cleanPath = (u = '') => {
  const p = u.split('?')[0].split('#')[0].replace(/\/+$/, '');
  return p && !p.startsWith('/') ? `/${p}` : p;
};

const CONDITION_LABEL = {
  NewCondition: 'new',
  UsedCondition: 'used',
  RefurbishedCondition: 'refurbished',
};

const SEO = ({
  title,
  description,
  keywords, // optional — Google ignores it, so it is only emitted when you pass it
  image,
  url,
  type = 'website', // 'website' | 'article' | 'service' (product is inferred from price)
  price,
  currency = 'NGN',
  brand,
  category,
  inStock = true, // previously undefined meant "Out of stock" in the schema
  sku,
  gtin,
  condition = 'NewCondition',
  rating,
  reviewCount,
  author,
  publishedTime,
  modifiedTime,
  articleSection,
  articleTags = [],
  faqs = [],
  howToSteps = [],
  breadcrumbs = [],
  noindex = false, // use on cart, checkout, login, messages, dashboards
  hreflang = [],
}) => {
  const isProduct = Boolean(price);
  const isArticle = type === 'article';
  const isService = type === 'service';

  const fullTitle = clip(
    title ? (title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`) : DEFAULT_TITLE,
    70
  );
  const fullDescription = clip(description || DEFAULT_DESCRIPTION, 160);
  const fullUrl = `${SITE_URL}${cleanPath(url)}`;
  const images = (Array.isArray(image) ? image : [image]).map(abs).filter(Boolean);
  const mainImage = images[0] || DEFAULT_IMAGE;
  const imageList = images.length ? images : [DEFAULT_IMAGE];

  const ogType = isProduct ? 'product' : isArticle ? 'article' : 'website';
  const robots = noindex
    ? 'noindex, nofollow'
    : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';

  const orgId = `${SITE_URL}/#organization`;
  const siteId = `${SITE_URL}/#website`;

  /* ── JSON-LD: one @graph, entities linked by @id ── */
  const organization = {
    '@type': 'ElectronicsStore',
    '@id': orgId,
    name: SITE_NAME,
    legalName: LEGAL_NAME,
    alternateName: ['75 Tech Store', '75Tech', 'Seven Five Techstore'],
    url: SITE_URL,
    logo: { '@type': 'ImageObject', url: LOGO },
    image: DEFAULT_IMAGE,
    description: DEFAULT_DESCRIPTION,
    foundingDate: '2020',
    founder: { '@type': 'Person', name: 'Kenneth Osazuwa', jobTitle: 'Software Engineer & Founder' },
    identifier: { '@type': 'PropertyValue', name: 'CAC RC Number', value: '8681711' },
    telephone: PHONE,
    email: EMAIL,
    priceRange: '₦₦',
    currenciesAccepted: 'NGN',
    paymentAccepted: 'Cash, Credit Card, Debit Card, Paystack, Bank Transfer, Pay on Delivery',
    address: ADDRESS,
    geo: GEO,
    openingHoursSpecification: HOURS,
    contactPoint: [
      {
        '@type': 'ContactPoint',
        telephone: PHONE,
        contactType: 'customer service',
        areaServed: 'NG',
        availableLanguage: ['English'],
      },
      {
        '@type': 'ContactPoint',
        telephone: PHONE,
        contactType: 'sales',
        areaServed: 'NG',
        availableLanguage: ['English'],
      },
    ],
    sameAs: SAME_AS,
    areaServed: { '@type': 'Country', name: 'Nigeria' },
    knowsAbout: [
      'Consumer Electronics',
      'Laptop Repair',
      'Phone Repair',
      'Software Development',
      'Web Development',
      'Mobile App Development',
      'IT Consulting',
      'E-commerce',
    ],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: `${SITE_NAME} Products & Services`,
      itemListElement: [
        {
          '@type': 'OfferCatalog',
          name: 'Gadget Retail',
          itemListElement: ['Phones', 'Laptops', 'Tablets', 'Consoles', 'Accessories'].map((n) => ({
            '@type': 'Offer',
            itemOffered: { '@type': 'Product', name: n },
          })),
        },
        {
          '@type': 'OfferCatalog',
          name: 'Digital & Repair Services',
          itemListElement: [
            'Software Development',
            'Website Development',
            'Mobile App Development',
            'IT Consulting',
            'Laptop & Gadget Repair',
          ].map((n) => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name: n } })),
        },
      ],
    },
    // NOTE: no aggregateRating here on purpose. Only publish ratings backed by
    // real, visible customer reviews, otherwise Google can apply a manual action.
  };

  const website = {
    '@type': 'WebSite',
    '@id': siteId,
    name: SITE_NAME,
    alternateName: '75TechStore Nigeria',
    url: SITE_URL,
    publisher: { '@id': orgId },
    // Make sure /shop?search=term really filters products, or delete this block.
    potentialAction: {
      '@type': 'SearchAction',
      target: { '@type': 'EntryPoint', urlTemplate: `${SITE_URL}/shop?search={search_term_string}` },
      'query-input': 'required name=search_term_string',
    },
  };

  const product = isProduct
    ? {
        '@type': 'Product',
        '@id': `${fullUrl}#product`,
        name: title,
        description: fullDescription,
        image: imageList,
        brand: { '@type': 'Brand', name: brand || SITE_NAME },
        sku: sku || undefined,
        gtin13: gtin || undefined,
        category,
        itemCondition: `https://schema.org/${condition}`,
        offers: {
          '@type': 'Offer',
          url: fullUrl,
          price: String(price),
          priceCurrency: currency,
          priceValidUntil: `${new Date().getFullYear() + 1}-12-31`,
          availability: inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
          itemCondition: `https://schema.org/${condition}`,
          seller: { '@id': orgId },
          shippingDetails: {
            '@type': 'OfferShippingDetails',
            shippingRate: { '@type': 'MonetaryAmount', value: 0, currency: 'NGN' },
            shippingDestination: { '@type': 'DefinedRegion', addressCountry: 'NG' },
            deliveryTime: {
              '@type': 'ShippingDeliveryTime',
              handlingTime: { '@type': 'QuantitativeValue', minValue: 0, maxValue: 1, unitCode: 'DAY' },
              transitTime: { '@type': 'QuantitativeValue', minValue: 1, maxValue: 3, unitCode: 'DAY' },
            },
          },
          hasMerchantReturnPolicy: {
            '@type': 'MerchantReturnPolicy',
            applicableCountry: 'NG',
            returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
            merchantReturnDays: RETURN_DAYS,
          },
        },
        // Only added when you pass real review data
        aggregateRating:
          rating && Number(reviewCount) > 0
            ? {
                '@type': 'AggregateRating',
                ratingValue: rating,
                reviewCount,
                bestRating: 5,
                worstRating: 1,
              }
            : undefined,
      }
    : null;

  const article = isArticle
    ? {
        '@type': 'BlogPosting',
        '@id': `${fullUrl}#article`,
        headline: clip(title, 110),
        description: fullDescription,
        image: imageList,
        author: { '@type': 'Person', name: author || 'Kenneth Osazuwa', url: `${SITE_URL}/about` },
        publisher: { '@id': orgId },
        datePublished: publishedTime,
        dateModified: modifiedTime || publishedTime,
        mainEntityOfPage: { '@type': 'WebPage', '@id': fullUrl },
        articleSection: articleSection || category,
        keywords: articleTags.length ? articleTags.join(', ') : undefined,
      }
    : null;

  const service = isService
    ? {
        '@type': 'Service',
        '@id': `${fullUrl}#service`,
        name: title,
        description: fullDescription,
        provider: { '@id': orgId },
        areaServed: { '@type': 'Country', name: 'Nigeria' },
        serviceType: category || 'Technology Service',
      }
    : null;

  const faq = faqs.length
    ? {
        '@type': 'FAQPage',
        mainEntity: faqs.map((f) => ({
          '@type': 'Question',
          name: f.question,
          acceptedAnswer: { '@type': 'Answer', text: f.answer },
        })),
      }
    : null;

  // Google no longer shows HowTo rich results; kept because it is harmless and
  // still readable by other search/answer engines.
  const howTo = howToSteps.length
    ? {
        '@type': 'HowTo',
        name: title,
        description: fullDescription,
        image: mainImage,
        step: howToSteps.map((s, i) => ({
          '@type': 'HowToStep',
          position: i + 1,
          name: s.name,
          text: s.text,
          image: abs(s.image),
        })),
      }
    : null;

  const breadcrumb = breadcrumbs.length
    ? {
        '@type': 'BreadcrumbList',
        itemListElement: breadcrumbs.map((b, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: b.name,
          item: `${SITE_URL}${cleanPath(b.url)}`,
        })),
      }
    : null;

  const graph = {
    '@context': 'https://schema.org',
    '@graph': [organization, website, product, article, service, faq, howTo, breadcrumb].filter(Boolean),
  };

  return (
    <Helmet>
      {/* ── Core ── */}
      <title>{fullTitle}</title>
      <meta name="description" content={fullDescription} />
      {keywords && <meta name="keywords" content={keywords} />}
      <link rel="canonical" href={fullUrl} />
      <meta name="robots" content={robots} />
      <meta name="author" content={author || 'Kenneth Osazuwa'} />
      <meta name="copyright" content={`${LEGAL_NAME} (${SITE_NAME})`} />
      <meta name="theme-color" content="#000000" />
      <meta name="format-detection" content="telephone=yes" />
      <meta name="geo.region" content="NG-LA" />
      <meta name="geo.placename" content="Computer Village, Ikeja, Lagos" />

      {/* ── Icons (files that exist in /public) ── */}
      <link rel="icon" type="image/png" href={LOGO} />
      <link rel="apple-touch-icon" href={LOGO} />

      {/* ── hreflang: only if you add more languages/regions ── */}
      {hreflang.map((h) => (
        <link key={h.lang} rel="alternate" hrefLang={h.lang} href={h.url} />
      ))}

      {/* ── Open Graph ── */}
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={fullDescription} />
      <meta property="og:image" content={mainImage} />
      <meta property="og:image:alt" content={title || SITE_NAME} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content="en_NG" />

      {isArticle && publishedTime && <meta property="article:published_time" content={publishedTime} />}
      {isArticle && modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
      {isArticle && author && <meta property="article:author" content={author} />}
      {isArticle && articleSection && <meta property="article:section" content={articleSection} />}
      {isArticle && articleTags.map((tag) => <meta key={tag} property="article:tag" content={tag} />)}

      {isProduct && (
        <>
          <meta property="product:price:amount" content={String(price)} />
          <meta property="product:price:currency" content={currency} />
          <meta property="product:availability" content={inStock ? 'in stock' : 'out of stock'} />
          <meta property="product:condition" content={CONDITION_LABEL[condition] || 'new'} />
          <meta property="product:brand" content={brand || SITE_NAME} />
          {category && <meta property="product:category" content={category} />}
        </>
      )}

      {/* ── Twitter / X ── */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@75techstore" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={fullDescription} />
      <meta name="twitter:image" content={mainImage} />
      <meta name="twitter:image:alt" content={title || SITE_NAME} />
      {isProduct && (
        <>
          <meta name="twitter:label1" content="Price" />
          <meta name="twitter:data1" content={`₦${Number(price).toLocaleString('en-NG')}`} />
          <meta name="twitter:label2" content="Availability" />
          <meta name="twitter:data2" content={inStock ? 'In Stock' : 'Out of Stock'} />
        </>
      )}

      {/* ── Performance ── */}
      <link rel="preconnect" href="https://res.cloudinary.com" crossOrigin="anonymous" />

      {/* ── Structured data ── */}
      <script type="application/ld+json">{JSON.stringify(graph)}</script>
    </Helmet>
  );
};

export default SEO;