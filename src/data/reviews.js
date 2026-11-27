// src/data/reviews.js  (FRONTEND)
// Live reviews come from /api/reviews. This file holds the review link + offline fallback.
export const business = {
  name: "75TechStore",
  // Your Google Business review link — powers the "Review us on Google" button.
  googleReviewUrl: "https://search.google.com/local/reviews?placeid=YOUR_PLACE_ID",
};

// Used ONLY if the API call fails (e.g. key not set yet).
export const fallbackReviews = [
  { id: 1, author: "Adaeze O.", avatar: "", rating: 5, text: "Got my iPhone screen replaced in under an hour and it looks brand new. Friendly, fast and fairly priced.", relativeTime: "" },
  { id: 2, author: "Chinedu M.", avatar: "", rating: 5, text: "They built our e-commerce site exactly how we wanted. Sales are up and the support has been great.", relativeTime: "" },
  { id: 3, author: "Funke A.", avatar: "", rating: 4, text: "Bought a UK-used laptop, clean and well priced. Delivery was quick across Lagos.", relativeTime: "" },
];