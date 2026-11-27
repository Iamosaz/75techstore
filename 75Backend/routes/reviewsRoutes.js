
// import express from "express";

// const router = express.Router();

// // 75TechStore Google Business Details
// const PLACE_ID =
//   process.env.GOOGLE_PLACE_ID || "ChIJQdAW5HOTOxARVIW_HEaGLJQ";

// const API_KEY = process.env.GOOGLE_MAPS_API_KEY;

// let cache = { data: null, ts: 0 };
// const TTL_MS = 1000 * 60 * 60 * 6; 

// router.get("/", async (req, res) => {
//   if (!PLACE_ID || !API_KEY) {
//     return res.status(500).json({
//       error: "GOOGLE_PLACE_ID or GOOGLE_MAPS_API_KEY not configured",
//     });
//   }

//   if (cache.data && Date.now() - cache.ts < TTL_MS) {
//     return res.json(cache.data);
//   }

//   try {
//     const url = `https://places.googleapis.com/v1/places/${encodeURIComponent(
//       PLACE_ID
//     )}`;

//     const r = await fetch(url, {
//       method: "GET",
//       headers: {
//         "Content-Type": "application/json",
//         "X-Goog-Api-Key": API_KEY,
//         "X-Goog-FieldMask":
//           "id,displayName,rating,userRatingCount,reviews",
//       },
//     });

//     const json = await r.json();

//     if (!r.ok) {
//       if (cache.data) return res.json(cache.data);

//       return res.status(502).json({
//         error: json.error?.message || "Google Places API request failed",
//       });
//     }

//     const data = {
//       name: json.displayName?.text || "75techstore Limited",
//       rating: json.rating || 0,
//       total: json.userRatingCount || 0,
//       reviews: (json.reviews || []).map((rev, index) => ({
//         id: rev.name || index,
//         author: rev.authorAttribution?.displayName || "Google User",
//         avatar: rev.authorAttribution?.photoUri || "",
//         rating: rev.rating || 0,
//         text: rev.text?.text || "",
//         relativeTime: rev.relativePublishTimeDescription || "",
//         date: rev.publishTime || "",
//       })),
//       fetchedAt: Date.now(),
//     };

//     cache = { data, ts: Date.now() };

//     return res.json(data);
//   } catch (err) {
//     console.error("Google Reviews Error:", err);

//     if (cache.data) return res.json(cache.data);

//     return res.status(502).json({
//       error: "Failed to fetch Google reviews",
//     });
//   }
// });

// export default router;
