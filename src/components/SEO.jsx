import { Helmet } from 'react-helmet-async'

const SEO = ({
  title,
  description,
  keywords,
  image,
  url,
  type = 'website',
  price,
  brand,
  category,
  inStock
}) => {
  const siteName = '75TechStore'
  const siteUrl = 'https://www.75techstore.com'
  const defaultImage = 'https://www.75techstore.com/og-image.jpg'
  const defaultDescription = 'Shop the latest phones, laptops, gaming consoles and accessories at the best prices in Nigeria. Fast delivery nationwide.'

  const fullTitle = title
    ? `${title} | ${siteName}`
    : `${siteName} - Best Tech Store in Nigeria`

  const fullUrl = url ? `${siteUrl}${url}` : siteUrl
  const fullImage = image || defaultImage
  const fullDescription = description || defaultDescription

  return (
    <Helmet>
      {/* Basic SEO */}
      <title>{fullTitle}</title>
      <meta name="description" content={fullDescription} />
      <meta name="keywords" content={keywords ||
        'tech store nigeria, buy phones nigeria, laptops nigeria'} />
      <link rel="canonical" href={fullUrl} />
      <meta name="robots" content="index, follow" />
      <meta name="author" content="75TechStore" />

      {/* Open Graph - Facebook & WhatsApp */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={fullDescription} />
      <meta property="og:image" content={fullImage} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content="en_NG" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={fullDescription} />
      <meta name="twitter:image" content={fullImage} />

      {/* Product Schema - shows price in Google */}
      {price && (
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            "name": title,
            "description": fullDescription,
            "image": fullImage,
            "brand": {
              "@type": "Brand",
              "name": brand || "75TechStore"
            },
            "category": category,
            "offers": {
              "@type": "Offer",
              "price": price,
              "priceCurrency": "NGN",
              "availability": inStock
                ? "https://schema.org/InStock"
                : "https://schema.org/OutOfStock",
              "seller": {
                "@type": "Organization",
                "name": siteName
              },
              "url": fullUrl
            }
          })}
        </script>
      )}

      {/* Organization Schema */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": siteName,
          "url": siteUrl,
          "logo": `${siteUrl}/logo.png`,
          "contactPoint": {
            "@type": "ContactPoint",
            "telephone": "+234-000-000-0000",
            "contactType": "customer service",
            "areaServed": "NG",
            "availableLanguage": "English"
          }
        })}
      </script>
    </Helmet>
  )
}

export default SEO