// src/components/GoogleReviews.jsx
import React, { useEffect, useRef } from 'react'

const GoogleReviews = () => {
  const widgetRef = useRef(null)

  useEffect(() => {
    if (!widgetRef.current) return

    // Clear previous elements to avoid duplication on re-renders
    widgetRef.current.innerHTML = ''

    // Create script and append STRICTLY inside this component container
    const script = document.createElement('script')
    script.src = 'https://cdn.trustindex.io/loader.js?ad6e0c9852589710e936485e642'
    script.async = true
    script.defer = true

    widgetRef.current.appendChild(script)
  }, [])

  return (
    <section className="py-16 bg-slate-900 border-t border-b border-white/10 text-white my-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-8">
          <span className="text-xs font-bold text-blue-400 uppercase tracking-widest bg-blue-500/10 px-3.5 py-1.5 rounded-full border border-blue-500/20">
            Verified Customer Feedback
          </span>
          <h2 className="text-2xl md:text-4xl font-extrabold text-white mt-3">
            Real Google Reviews
          </h2>
          <p className="text-gray-400 text-sm mt-2 max-w-lg mx-auto">
            See what customers say about our gadgets, repairs, and service in Computer Village, Lagos.
          </p>
        </div>

        {/* 🔒 Locked Widget Container */}
        <div 
          ref={widgetRef} 
          className="trustindex-widget-container min-h-[160px] w-full flex justify-center items-center overflow-hidden rounded-2xl bg-white/5 border border-white/10 p-4 md:p-6 shadow-xl"
        />

      </div>
    </section>
  )
}

export default GoogleReviews