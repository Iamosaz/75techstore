// src/components/AutoSEO.jsx
import React from "react";
import SEO from "../SEO";
import { useProductSEO, useBlogSEO } from "../hooks/useAutoSEO";

export function ProductAutoSEO({ product }) {
  const seoData = useProductSEO(product);
  if (!seoData) return null;
  return <SEO {...seoData} />;
}

export function BlogAutoSEO({ blog }) {
  const seoData = useBlogSEO(blog);
  if (!seoData) return null;
  return <SEO {...seoData} />;
}