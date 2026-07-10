import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// ✅ Get all products
export const fetchAllProducts = async (params = {}) => {
  const { data } = await axios.get(`${API_URL}/products`, { params });
  return data;
};

// ✅ Get featured products
export const fetchFeaturedProducts = async () => {
  const { data } = await axios.get(`${API_URL}/products`, {
    params: { isFeatured: true, limit: 4 }
  });
  return data;
};

// ✅ Get products by category
export const fetchProductsByCategory = async (category) => {
  const { data } = await axios.get(`${API_sURL}/products`, {
    params: { category, limit: 8 }
  });
  return data;
};

// ✅ Get single product
export const fetchProductById = async (id) => {
  const { data } = await axios.get(`${API_URL}/products/${id}`);
  return data;
};