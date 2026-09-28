// src/hooks/useProducts.js
import { useState, useEffect } from 'react';
import { fetchAllProducts, fetchFeaturedProducts } from '../services/productService';

export const useProducts = (params = {}) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Serialize params so the hook only refetches if parameters actually change
  const serializedParams = JSON.stringify(params);

  useEffect(() => {
    const getProducts = async () => {
      try {
        setLoading(true);
        const parsedParams = JSON.parse(serializedParams);
        const data = await fetchAllProducts(parsedParams);
        setProducts(data.products || data || []);
      } catch (err) {
        setError('Failed to load products');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    getProducts();
  }, [serializedParams]);

  return { products, loading, error };
};

export const useFeaturedProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const getProducts = async () => {
      try {
        setLoading(true);
        const data = await fetchFeaturedProducts();
        setProducts(data.products || data || []);
      } catch (err) {
        setError('Failed to load featured products');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    getProducts();
  }, []);

  return { products, loading, error };
};