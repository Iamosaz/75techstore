import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useSeasonalTheme } from "../../context/SeasonalContext";
import { getTheme } from "../../utils/seasonalThemes";

export default function HeroSeasonal() {
  const { event } = useSeasonalTheme();

  const themeId = event?.theme || "";
  const theme = getTheme(themeId);

  const title = event?.customTitle || theme.title;
  const subtitle = event?.customSubtitle || theme.subtitle;
  const image = event?.customImage || theme.image;

  const discount =
    event?.showBadge && event?.customDiscount
      ? event.customDiscount
      : null;

  if (!event) return null;

  return (
    <Link
      to="/shop"
      className="block w-full h-full group cursor-pointer"
      aria-label={"Shop " + title + " deals"}
    >
      <div className="relative w-full h-full overflow-hidden bg-zinc-950">

        {discount && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
            className="absolute top-4 left-4 sm:top-6 sm:left-6 z-20"
          >
            <span
              className="bg-red-600 text-white text-xs sm:text-sm font-black
                         px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full shadow-lg
                         ring-2 ring-red-500/30"
            >
              {discount} OFF
            </span>
          </motion.div>
        )}

        <motion.div
          className="absolute inset-0"
          initial={{ scale: 1.08 }}
          animate={{ scale: 1 }}
          transition={{ duration: 18, ease: "linear" }}
        >
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105
                       transition-transform duration-700 ease-out"
            loading="eager"
          />
        </motion.div>

        <div className={"absolute inset-0 bg-gradient-to-r " + theme.overlay} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4 sm:px-6 gap-4 sm:gap-6">

          <motion.div
            initial={{ scale: 0, rotate: -15, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 180, damping: 15, delay: 0.2 }}
            className={"w-16 h-16 sm:w-20 sm:h-20 rounded-3xl " + theme.glass + " flex items-center justify-center border border-white/10 shadow-2xl"}
          >
            <img
              src={theme.icon}
              alt=""
              className="w-8 h-8 sm:w-10 sm:h-10"
              style={{
                filter: "brightness(0) saturate(100%) invert(1) drop-shadow(0 0 12px " + theme.iconColor + ") drop-shadow(0 0 24px " + theme.iconColor + "66)",
              }}
              onError={function(e){ e.target.style.display = "none"; }}
            />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.6 }}
            className="text-white text-3xl sm:text-5xl md:text-6xl font-light tracking-tight leading-tight max-w-3xl"
            style={{ textShadow: "0 2px 20px rgba(0,0,0,0.3)" }}
          >
            {title}
          </motion.h1>

          {subtitle && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="text-white/70 text-sm sm:text-base md:text-lg font-light max-w-xl leading-relaxed"
              style={{ textShadow: "0 1px 10px rgba(0,0,0,0.3)" }}
            >
              {subtitle}
            </motion.p>
          )}

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65, duration: 0.6 }}
            className="mt-2 sm:mt-4"
          >
            <span
              className={"inline-flex items-center gap-2 px-8 sm:px-10 py-3 sm:py-4 rounded-full font-bold text-sm sm:text-base " + theme.accent + " shadow-2xl group-hover:shadow-[0_8px_30px_rgba(0,0,0,0.4)] transition-all duration-300"}
            >
              {theme.cta || "Shop Now"}
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5 transform group-hover:translate-x-1 transition-transform duration-300"
                fill="none" stroke="currentColor" viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </span>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="text-white/40 text-[10px] sm:text-xs font-light mt-2 tracking-wide uppercase"
          >
            Tap anywhere to browse deals
          </motion.p>
        </div>

        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100
                     transition-opacity duration-500 pointer-events-none"
        />
      </div>
    </Link>
  );
}