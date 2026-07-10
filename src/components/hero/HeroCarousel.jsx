// src/components/hero/HeroCarousel.jsx
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import HeroWelcome from "./HeroWelcome";
import HeroHolidayPromo from "./HeroPromo";
import Brandnewgadget from "./Brandnewgadget";

export default function HeroCarousel() {
  const slides = [
    { id: 0, component: <HeroWelcome /> },
    { id: 1, component: <HeroHolidayPromo /> },
    { id: 2, component: <Brandnewgadget /> },
  ];

  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 8000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <div className="relative overflow-hidden bg-brand-dark
                    h-[520px] sm:h-[500px] md:h-[580px] lg:h-[650px] xl:h-[700px]">

      {/* Slides */}
      <AnimatePresence mode="sync">
        {slides.map((slide, i) =>
          i === index ? (
            <motion.div
              key={slide.id}
              initial={{ x: "100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "-100%", opacity: 0 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              className="absolute inset-0 w-full h-full"
            >
              {/* ✅ Content area - stops ABOVE the dots */}
              <div className="w-full" style={{ height: 'calc(100% - 50px)' }}>
                {slide.component}
              </div>
            </motion.div>
          ) : null
        )}
      </AnimatePresence>

      {/* Left Arrow */}
      <button
        onClick={() => setIndex((prev) => (prev - 1 + slides.length) % slides.length)}
        aria-label="Previous slide"
        className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 z-20
                   bg-black/30 hover:bg-black/60 text-white
                   w-8 h-8 sm:w-10 sm:h-10 rounded-full
                   flex items-center justify-center
                   transition-all duration-300 hover:scale-110"
      >
        ‹
      </button>

      {/* Right Arrow */}
      <button
        onClick={() => setIndex((prev) => (prev + 1) % slides.length)}
        aria-label="Next slide"
        className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 z-20
                   bg-black/30 hover:bg-black/60 text-white
                   w-8 h-8 sm:w-10 sm:h-10 rounded-full
                   flex items-center justify-center
                   transition-all duration-300 hover:scale-110"
      >
        ›
      </button>

      {/* ✅ Nav Dots - Fixed at very bottom with own background */}
      <div className="absolute bottom-0 left-0 right-0 z-20
                      flex items-center justify-center
                      h-[50px] bg-gradient-to-t from-black/40 to-transparent">
        <div className="flex gap-2 sm:gap-3">
          {slides.map((s, i) => (
            <button
              key={s.id}
              onClick={() => setIndex(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`transition-all duration-300 rounded-full ${
                index === i
                  ? "bg-yellow-500 w-6 h-3"
                  : "bg-white/50 hover:bg-white/80 w-3 h-3"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}