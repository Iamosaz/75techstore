// src/hooks/useAutoSEO.js
import { useMemo } from "react";

export function useProductSEO(product) {
  return useMemo(() => {
    if (!product) return null;

    const name = product.name || "";
    const brand = product.brand || "";
    const category = product.category || "";
    const price = product.dealPrice || product.price || 0;
    const originalPrice = product.originalPrice || price;
    const discount = product.discountPercentage || Math.round(((originalPrice - price) / originalPrice) * 100);
    const condition = product.condition || "brand new";
    const location = "Lagos, Nigeria";

    return {
      title: `${name} ${brand ? `- ${brand}` : ""} | Best Price in Nigeria`,
      description: `Buy ${name} ${condition} in ${location} for ₦${price.toLocaleString()}${discount > 0 ? ` (${discount}% OFF)` : ""}. ${brand} ${category} with 1-year warranty, free delivery, and pay on delivery at 75TechStore Computer Village Ikeja.`,
      keywords: `${name}, ${brand} ${category} Nigeria, buy ${category} Lagos, ${name} price Nigeria, ${brand} Computer Village, ${category} pay on delivery`,
      image: product.images?.[0] || product.image,
      url: `/shop/${product._id}`,
      type: "product",
      price: price,
      originalPrice: originalPrice,
      brand: brand,
      category: category,
      inStock: (product.stock || 0) > 0,
      sku: product.sku || product._id,
      condition: condition === "UK Used" ? "RefurbishedCondition" : "NewCondition",
      rating: product.rating || "4.8",
      reviewCount: product.reviewCount || 12,
      breadcrumbs: [
        { name: "Home", url: "/" },
        { name: "Shop", url: "/shop" },
        { name: category, url: `/shop?category=${category}` },
        { name: name, url: `/shop/${product._id}` }
      ],
      faqs: [
        {
          question: `How much is ${name} in Nigeria?`,
          answer: `${name} costs ₦${price.toLocaleString()} at 75TechStore, Computer Village, Ikeja, Lagos. ${discount > 0 ? `This is ${discount}% off the regular price of ₦${originalPrice.toLocaleString()}.` : ""} Price includes 1-year warranty.`
        },
        {
          question: `Is this ${name} brand new or UK used?`,
          answer: `This ${name} is ${condition}. ${condition === "UK Used" ? "It has been professionally tested and graded by our certified engineers at Computer Village, Ikeja." : "It comes sealed in original packaging with full manufacturer warranty."}`
        },
        {
          question: `Do you deliver ${name} outside Lagos?`,
          answer: `Yes! 75TechStore delivers ${name} nationwide across all 36 states in Nigeria. Lagos delivery is same-day, Abuja and Port Harcourt are next-day, and other states take 2-3 business days.`
        },
        {
          question: `Can I pay on delivery for ${name}?`,
          answer: `Yes, pay on delivery is available for ${name} in Lagos, Abuja, and Port Harcourt. We also accept Paystack (card, bank transfer, USSD) and cash at our Computer Village store.`
        }
      ]
    };
  }, [product]);
}

export function useBlogSEO(blog) {
  return useMemo(() => {
    if (!blog) return null;

    return {
      title: blog.title || blog.metaTitle,
      description: blog.excerpt || blog.metaDescription || blog.content?.substring(0, 160),
      keywords: blog.tags?.join(", ") || blog.focusKeyword,
      image: blog.featuredImage || blog.image,
      url: `/blog/${blog.slug || blog._id}`,
      type: "article",
      author: blog.author || "Kenneth Osazuwa",
      publishedTime: blog.publishedAt || blog.createdAt,
      modifiedTime: blog.updatedAt,
      articleSection: blog.category,
      articleTags: blog.tags || [],
      breadcrumbs: [
        { name: "Home", url: "/" },
        { name: "Blog", url: "/blog" },
        { name: blog.category || "Articles", url: `/blog?category=${blog.category}` },
        { name: blog.title, url: `/blog/${blog.slug || blog._id}` }
      ],
      faqs: blog.faqs || []
    };
  }, [blog]);
}