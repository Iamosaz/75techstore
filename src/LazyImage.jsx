// src/components/LazyImage.jsx
import React, { useState, useRef, useEffect } from 'react';
import { getOptimizedImage } from '../utils/cloudinary';

export default function LazyImage({ src, alt, className, type = 'product' }) {
  const [loaded, setLoaded] = useState(false);
  const [inView, setInView] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: '300px' }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const optimizedSrc = getOptimizedImage(src, type);

  return (
    <div ref={ref} className={`relative overflow-hidden bg-gray-100 ${className || ''}`}>
      {!loaded && <div className="absolute inset-0 bg-gray-200 animate-pulse" />}
      {inView && (
        <img
          src={optimizedSrc}
          alt={alt}
          loading="lazy"
          decoding="async"
          onLoad={() => setLoaded(true)}
          className={`w-full h-full object-cover transition-opacity duration-500 ${
            loaded ? 'opacity-100' : 'opacity-0'
          }`}
        />
      )}
    </div>
  );
}