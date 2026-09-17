// backend/routes/seasonal.js
import express from "express";
import SeasonalOverride from "../models/SeasonalOverride.js";

const router = express.Router();

router.get("/override", async (req, res) => {
  try {
    const override = await SeasonalOverride.findOne({ key: "active_override" });

    if (!override || !override.isActive || new Date(override.expiresAt) < new Date()) {
      return res.status(200).json({ override: null });
    }

    return res.status(200).json({ override });
  } catch (error) {
    return res.status(500).json({ message: "Server Error", error: error.message });
  }
});

router.post("/override", async (req, res) => {
  const { themeId, name, customTitle, customSubtitle, customDiscount, customImage, expiresAt } = req.body;

  try {
    let override = await SeasonalOverride.findOne({ key: "active_override" });

    if (override) {
      override.themeId = themeId;
      override.name = name;
      override.customTitle = customTitle || "";
      override.customSubtitle = customSubtitle || "";
      override.customDiscount = customDiscount || "";
      override.customImage = customImage || ""; // ✅ Save Cloudinary URL
      override.expiresAt = expiresAt;
      override.isActive = true;
      await override.save();
    } else {
      override = await SeasonalOverride.create({
        key: "active_override",
        themeId,
        name,
        customTitle: customTitle || "",
        customSubtitle: customSubtitle || "",
        customDiscount: customDiscount || "",
        customImage: customImage || "", // ✅ Save Cloudinary URL
        expiresAt,
        isActive: true,
      });
    }

    return res.status(200).json({ success: true, override });
  } catch (error) {
    return res.status(500).json({ message: "Server Error", error: error.message });
  }
});

router.delete("/override", async (req, res) => {
  try {
    const override = await SeasonalOverride.findOne({ key: "active_override" });
    if (override) {
      override.isActive = false;
      await override.save();
    }
    return res.status(200).json({ success: true, message: "Override cleared successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Server Error", error: error.message });
  }
});

export default router;