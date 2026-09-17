// backend/routes/seasonalProducts.js
import express from "express";
import SeasonalProduct from "../models/SeasonalProduct.js";
import { notifyGoogleIndexing } from "../utils/googleIndexHelper.js"; // ✅ Auto-Index

const router = express.Router();

// @route   GET /api/seasonal-products
router.get("/", async (req, res) => {
  try {
    const { season, category } = req.query;
    const filter = { isActive: true };

    if (season && season !== "all") {
      filter.$or = [{ seasonTag: season }, { seasonTag: "all" }];
    }

    if (category && category !== "all") {
      filter.category = category;
    }

    const products = await SeasonalProduct.find(filter).sort({ createdAt: -1 });
    return res.status(200).json(products);
  } catch (error) {
    return res.status(500).json({
      message: "Error fetching seasonal gadgets",
      error: error.message,
    });
  }
});

// @route   POST /api/seasonal-products
router.post("/", async (req, res) => {
  try {
    const {
      name, brand, category,
      originalPrice, dealPrice, images, stock,
      seasonTag, description, features,
    } = req.body;

    if (!name || !originalPrice || !dealPrice || !images || images.length === 0) {
      return res.status(400).json({
        message: "Please fill in all required fields and upload at least one image.",
      });
    }

    const newProduct = await SeasonalProduct.create({
      name,
      brand: brand || "",
      category,
      originalPrice: Number(originalPrice),
      dealPrice: Number(dealPrice),
      images,
      stock: Number(stock) || 1,
      seasonTag: seasonTag || "all",
      description: description || "",
      features: features || [],
      isActive: true,
    });

    // ✅ Notify search engines immediately for real-time indexing
    notifyGoogleIndexing(`/shop/${newProduct._id}`);

    return res.status(201).json({ success: true, product: newProduct });
  } catch (error) {
    return res.status(500).json({
      message: "Upload failed",
      error: error.message,
    });
  }
});

// @route   PUT /api/seasonal-products/:id
router.put("/:id", async (req, res) => {
  try {
    const updated = await SeasonalProduct.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    // ✅ Re-notify Google of updated content
    if (updated) notifyGoogleIndexing(`/shop/${updated._id}`);

    return res.status(200).json({ success: true, product: updated });
  } catch (error) {
    return res.status(500).json({
      message: "Update failed",
      error: error.message,
    });
  }
});

// @route   DELETE /api/seasonal-products/:id
router.delete("/:id", async (req, res) => {
  try {
    await SeasonalProduct.findByIdAndDelete(req.params.id);
    return res.status(200).json({
      success: true,
      message: "Device removed from seasonal shop",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Delete failed",
      error: error.message,
    });
  }
});

export default router;