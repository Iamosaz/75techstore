// backend/routes/sitemap.js
import express from "express";
import Product from "../models/Product.js";
import Blog from "../models/Blog.js";

const router = express.Router();
const SITE_URL = "https://www.75techstore.com.ng";

router.get("/sitemap-products.xml", async (req, res) => {
  try {
    const products = await Product.find({ isActive: true }).select(
      "_id updatedAt images name"
    );

    const urls = products
      .map(
        (p) => `
      <url>
        <loc>${SITE_URL}/shop/${p._id}</loc>
        <lastmod>${p.updatedAt.toISOString()}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.8</priority>
        ${
          p.images?.[0]
            ? `
        <image:image>
          <image:loc>${p.images[0]}</image:loc>
          <image:title>${p.name}</image:title>
        </image:image>`
            : ""
        }
      </url>
    `
      )
      .join("");

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urls}
</urlset>`;

    res.header("Content-Type", "application/xml");
    res.send(xml);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

router.get("/sitemap-blog.xml", async (req, res) => {
  try {
    const blogs = await Blog.find({ published: true }).select(
      "_id slug updatedAt"
    );

    const urls = blogs
      .map(
        (b) => `
      <url>
        <loc>${SITE_URL}/blog/${b.slug || b._id}</loc>
        <lastmod>${b.updatedAt.toISOString()}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.7</priority>
      </url>
    `
      )
      .join("");

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

    res.header("Content-Type", "application/xml");
    res.send(xml);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

export default router;