import { useState, useEffect, useCallback } from 'react';

const API_URL = 'http://localhost:5000';

export function useDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboard = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // ✅ Added Authorization header for admin access (optional but recommended)
      const headers = {};
      const token = localStorage.getItem('adminToken');
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const res = await fetch(`${API_URL}/api/dashboard/stats`, { headers });
      
      // Safety check for non-JSON responses (prevents crash if server errors)
      const contentType = res.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Server returned invalid response');
      }

      const json = await res.json();

      if (!json.success) throw new Error(json.error || 'Dashboard fetch failed');

      setData(json.data);
    } catch (err) {
      console.error('Dashboard fetch error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []); // ✅ Empty dependency array — runs ONLY ONCE when Dashboard mounts

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  return { data, loading, error, refetch: fetchDashboard };
}