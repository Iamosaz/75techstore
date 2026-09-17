import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import HeroWelcome from "./HeroWelcome";
import HeroHolidayPromo from "./HeroPromo";
import Brandnewgadget from "./Brandnewgadget";
import HeroSeasonal from "./HeroSeasonal";
import { useSeasonalTheme } from "../../context/SeasonalContext";

export default function HeroCarousel() {
  const { event } = useSeasonalTheme();

  // Seasonal slide is always first and auto-updates
  const slides = [
    { id: "welcome", component: <HeroWelcome /> },
    { id: "seasonal", component: <HeroSeasonal /> },
    { id: "promo", component: <HeroHolidayPromo /> },
    { id: "gadget", component: <Brandnewgadget /> },
  ];

  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1);
      setIndex((prev) => (prev + 1) % slides.length);
    }, 8000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const goTo = (newIndex) => {
    setDirection(newIndex > index ? 1 : -1);
    setIndex(newIndex);
  };

  const goPrev = () => {
    setDirection(-1);
    setIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goNext = () => {
    setDirection(1);
    setIndex((prev) => (prev + 1) % slides.length);
  };

  const slideVariants = {
    enter: (dir) => ({ x: dir > 0 ? "100%" : "-100%", opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir) => ({ x: dir > 0 ? "-100%" : "100%", opacity: 0 }),
  };

  return (
    <div className="relative overflow-hidden bg-brand-dark
                    h-[520px] sm:h-[500px] md:h-[580px] lg:h-[650px] xl:h-[700px]">

      <AnimatePresence mode="sync" custom={direction}>
        <motion.div
          key={slides[index].id}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="absolute inset-0 w-full h-full"
        >
          <div className="w-full" style={{ height: "calc(100% - 50px)" }}>
            {slides[index].component}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Arrows */}
      <button
        onClick={goPrev}
        aria-label="Previous slide"
        className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 z-20
                   bg-black/30 hover:bg-black/60 text-white
                   w-8 h-8 sm:w-10 sm:h-10 rounded-full
                   flex items-center justify-center
                   transition-all duration-300 hover:scale-110
                   backdrop-blur-sm"
      >
        ‹
      </button>

      <button
        onClick={goNext}
        aria-label="Next slide"
        className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 z-20
                   bg-black/30 hover:bg-black/60 text-white
                   w-8 h-8 sm:w-10 sm:h-10 rounded-full
                   flex items-center justify-center
                   transition-all duration-300 hover:scale-110
                   backdrop-blur-sm"
      >
        ›
      </button>

      {/* Dots with labels */}
      <div className="absolute bottom-0 left-0 right-0 z-20
                      flex items-center justify-center
                      h-[50px] bg-gradient-to-t from-black/50 to-transparent">
        <div className="flex gap-2 sm:gap-3">
          {slides.map((s, i) => (
            <button
              key={s.id}
              onClick={() => goTo(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`transition-all duration-300 rounded-full ${
                index === i
                  ? "bg-yellow-500 w-6 sm:w-8 h-3"
                  : "bg-white/50 hover:bg-white/80 w-3 h-3"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}