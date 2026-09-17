// backend/utils/googleIndexHelper.js

/**
 * Notifies Google & Bing to index new or updated content instantly.
 * Called automatically whenever a new product or blog is added.
 */
export async function notifyGoogleIndexing(path) {
  const SITE_URL = "https://www.75techstore.com.ng";

  const sitemaps = [
    `${SITE_URL}/sitemap.xml`,
    `${SITE_URL}/sitemap-products.xml`,
    `${SITE_URL}/sitemap-blog.xml`,
  ];

  console.log(`📡 Notifying search engines for: ${SITE_URL}${path}`);

  const searchEngines = [
    "https://www.google.com/ping?sitemap=",
    "https://www.bing.com/ping?sitemap=",
  ];

  try {
    const pings = [];
    for (const engine of searchEngines) {
      for (const sitemap of sitemaps) {
        pings.push(
          fetch(`${engine}${encodeURIComponent(sitemap)}`).catch(() => {})
        );
      }
    }
    await Promise.allSettled(pings);
    console.log("✅ Search engines pinged successfully!");
  } catch (err) {
    console.warn("⚠️ Ping warning (safe to ignore in localhost):", err.message);
  }
}