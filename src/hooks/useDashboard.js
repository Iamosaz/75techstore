// src/hooks/useDashboard.js (or src/admin/hooks/useDashboard.js)
import { useState, useEffect, useCallback } from 'react';

// ── 🛡️ PRODUCTION TRAILING SLASH & ENDPOINT SAFEGUARD ──
const getCleanApiUrl = () => {
  const rawUrl =
    import.meta.env?.VITE_API_URL ||
    (typeof process !== 'undefined' && (process.env?.REACT_APP_API_URL || process.env?.NEXT_PUBLIC_API_URL)) ||
    'http://localhost:5000/api';

  // 1. Remove any trailing slashes
  let clean = rawUrl.trim().replace(/\/+$/, '');

  // 2. Safely ensure /api suffix is present without doubling
  if (!clean.endsWith('/api')) {
    clean = `${clean}/api`;
  }

  return clean;
};

const API_URL = getCleanApiUrl();

export function useDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);  
  const [error, setError] = useState(null);

  const fetchDashboard = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // 🛡️ Safe Token Extraction for Admin Authorization
      let token = localStorage.getItem('adminToken') || localStorage.getItem('token');
      if (!token) {
        try {
          const userObj = JSON.parse(localStorage.getItem('user') || '{}');
          token = userObj?.token || null;
        } catch {
          token = null;
        }
      }

      const headers = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      };

      const res = await fetch(`${API_URL}/dashboard/stats`, { headers });
      
      // Safety check for non-JSON responses (prevents crash if server errors/restarts)
      const contentType = res.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Server returned invalid response. Please verify backend service.');
      }

      const json = await res.json();

      if (!json.success) throw new Error(json.error || json.message || 'Dashboard fetch failed');

      setData(json.data);
    } catch (err) {
      console.error('Dashboard fetch error:', err);
      setError(err.message || 'Failed to connect to server');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  return { data, loading, error, refetch: fetchDashboard };
}