// 75Backend/routes/indexing.js
import express from "express";

const router = express.Router();
const SITE_URL = "https://www.75techstore.com.ng";

// Helper: Ping search engines with all sitemaps
async function pingSearchEngines() {
  const sitemaps = [
    `${SITE_URL}/sitemap.xml`,
    `${SITE_URL}/sitemap-products.xml`,
    `${SITE_URL}/sitemap-blog.xml`,
  ];

  const searchEngines = [
    "https://www.google.com/ping?sitemap=",
    "https://www.bing.com/ping?sitemap=",
  ];

  const pings = [];

  for (const engine of searchEngines) {
    for (const sitemap of sitemaps) {
      pings.push(
        fetch(`${engine}${encodeURIComponent(sitemap)}`).catch(() => {})
      );
    }
  }

  await Promise.allSettled(pings);
}

// @route   POST /api/indexing/push
// @desc    Push notification to search engines (Google & Bing)
router.post("/push", async (req, res) => {
  const { url } = req.body;

  try {
    // Ping search engines
    await pingSearchEngines();

    return res.status(200).json({
      success: true,
      message: `Search engines notified for: ${url || SITE_URL}`,
    });
  } catch (err) {
    console.error("Indexing push error:", err.message);
    return res.status(500).json({ message: "Indexing notice failed", error: err.message });
  }
});

// @route   POST /api/indexing/ping-sitemaps
// @desc    Manually ping search engines
router.post("/ping-sitemaps", async (req, res) => {
  try {
    await pingSearchEngines();
    return res.status(200).json({
      success: true,
      message: "Google and Bing sitemaps pinged successfully!",
    });
  } catch (err) {
    return res.status(500).json({ message: "Ping failed", error: err.message });
  }
});

export default router;