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
    <div className="relative overflow-hidden h-[400px] md:h-[600px] lg:h-[700px] bg-brand-dark">
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
              {slide.component}
            </motion.div>
          ) : null
        )}
      </AnimatePresence>

      {/* nav dots */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-3 z-10">
        {slides.map((s, i) => (
          <button
            key={s.id}
            onClick={() => setIndex(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`h-3 w-3 rounded-full transition-colors duration-300 ${
              index === i ? "bg-white" : "bg-white/40"
            }`}
          />
        ))}
      </div>
    </div>
  );
}