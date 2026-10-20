import express from "express";
import { Product } from "../models/Product.js";

const router = express.Router();

// ── SITEMAP.XML ──────────────────────────────────────────
router.get("/sitemap.xml", async (req, res) => {
  try {
    const baseUrl = "https://75techstore.com.ng";
    const products = await Product.find({}).select("slug updatedAt");

    const staticPages = [
      { url: "/", priority: "1.0", changefreq: "daily" },
      { url: "/products", priority: "0.9", changefreq: "daily" },
      { url: "/deals", priority: "0.8", changefreq: "daily" },
      { url: "/new-arrivals", priority: "0.8", changefreq: "daily" },
      { url: "/best-selling", priority: "0.8", changefreq: "weekly" },
      { url: "/about", priority: "0.6", changefreq: "monthly" },
      { url: "/contact", priority: "0.6", changefreq: "monthly" },
      { url: "/blog", priority: "0.7", changefreq: "weekly" },
      { url: "/repairs", priority: "0.7", changefreq: "monthly" },
      { url: "/swap", priority: "0.7", changefreq: "monthly" },
      { url: "/membership", priority: "0.6", changefreq: "monthly" },
    ];

    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

    for (const page of staticPages) {
      xml += `  <url>\n`;
      xml += `    <loc>${baseUrl}${page.url}</loc>\n`;
      xml += `    <changefreq>${page.changefreq}</changefreq>\n`;
      xml += `    <priority>${page.priority}</priority>\n`;
      xml += `  </url>\n`;
    }

    for (const product of products) {
      const lastMod = product.updatedAt
        ? new Date(product.updatedAt).toISOString().split("T")[0]
        : new Date().toISOString().split("T")[0];
      xml += `  <url>\n`;
      xml += `    <loc>${baseUrl}/products/${product.slug || product._id}</loc>\n`;
      xml += `    <lastmod>${lastMod}</lastmod>\n`;
      xml += `    <changefreq>weekly</changefreq>\n`;
      xml += `    <priority>0.7</priority>\n`;
      xml += `  </url>\n`;
    }

    xml += `</urlset>`;
    res.header("Content-Type", "application/xml");
    res.send(xml);
  } catch (error) {
    res.status(500).send("Error generating sitemap");
  }
});

// ── ROBOTS.TXT ───────────────────────────────────────────
router.get("/robots.txt", (req, res) => {
  const robots = `User-agent: *
Allow: /
Disallow: /api/
Disallow: /admin/
Disallow: /dashboard/

Sitemap: https://75techstore.com.ng/api/seo/sitemap.xml
`;
  res.type("text/plain").send(robots);
});

export default router;