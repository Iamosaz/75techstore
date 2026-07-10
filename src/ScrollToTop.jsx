// src/ScrollToTop.jsx
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  // ✅ Scroll to top on every route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);

  // ✅ Scroll to top on page refresh/reload
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual'; // ✅ Disable browser scroll memory
    }
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  return null;
};

export default ScrollToTop;