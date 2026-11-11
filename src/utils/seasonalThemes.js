// src/utils/seasonalThemes.js
// ─────────────────────────────────────────────────────────────
// 75TechStore — Modern Seasonal & Event Theme Engine
// All background images from Unsplash (free commercial use)
// All icons are real SVG images from Lucide (lucide.dev)
// Controlled via backend admin dashboard — keys are stable
// ─────────────────────────────────────────────────────────────

const LUCIDE = "https://unpkg.com/lucide-static@latest/icons";

export const SEASONAL_THEMES = {

  // ══════════════════════════════════════════════════════════
  //  HOLIDAYS
  // ══════════════════════════════════════════════════════════

  christmas: {
    title: "Merry Christmas Deals",
    subtitle: "Up to 60% off all gadgets",
    tagline: "The gift they'll actually love this Christmas.",
    cta: "Shop Christmas Sale",
    image: "https://images.unsplash.com/photo-1512389142860-9c449e58a814?w=1920&q=80",
    overlay: "from-red-950/70 via-red-900/30 to-emerald-950/60",
    glass: "bg-red-950/20 backdrop-blur-xl",
    accent: "bg-amber-400 hover:bg-amber-300 text-red-950",
    icon: `${LUCIDE}/gift.svg`,
    iconColor: "#fbbf24",
  },

  blackfriday: {
    title: "Black Friday",
    subtitle: "The biggest sale of the year is live",
    tagline: "Deals so good they break the internet.",
    cta: "Shop the Drop",
    image: "https://images.unsplash.com/photo-1607082349566-187342175e2f?w=1920&q=80",
    overlay: "from-black/80 via-zinc-900/40 to-red-950/50",
    glass: "bg-black/30 backdrop-blur-xl",
    accent: "bg-white hover:bg-zinc-100 text-black",
    icon: `${LUCIDE}/zap.svg`,
    iconColor: "#ffffff",
  },

  valentine: {
    title: "Valentine's Special",
    subtitle: "Gift love with tech",
    tagline: "Because love deserves the latest tech.",
    cta: "Shop Love Deals",
    image: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=1920&q=80",
    overlay: "from-rose-950/70 via-pink-900/30 to-red-900/50",
    glass: "bg-rose-950/20 backdrop-blur-xl",
    accent: "bg-white hover:bg-rose-50 text-rose-600",
    icon: `${LUCIDE}/heart.svg`,
    iconColor: "#fb7185",
  },

  newyear: {
    title: "New Year, New Tech",
    subtitle: "Start the year with an upgrade",
    tagline: "Upgrade your life. Upgrade your gadgets.",
    cta: "Start Fresh",
    image: "https://images.unsplash.com/photo-1467810563316-b5476525c0f9?w=1920&q=80",
    overlay: "from-indigo-950/75 via-violet-900/30 to-blue-950/60",
    glass: "bg-indigo-950/25 backdrop-blur-xl",
    accent: "bg-amber-300 hover:bg-amber-200 text-indigo-950",
    icon: `${LUCIDE}/sparkles.svg`,
    iconColor: "#fde68a",
  },

  halloween: {
    title: "Spooky Tech Deals",
    subtitle: "Frighteningly low prices",
    tagline: "Deals so scary, competitors are hiding.",
    cta: "Enter If You Dare",
    image: "https://images.unsplash.com/photo-1508921340878-ba53e1f016ec?w=1920&q=80",
    overlay: "from-orange-950/75 via-gray-950/40 to-black/70",
    glass: "bg-orange-950/20 backdrop-blur-xl",
    accent: "bg-orange-400 hover:bg-orange-300 text-black",
    icon: `${LUCIDE}/ghost.svg`,
    iconColor: "#fb923c",
  },

  easter: {
    title: "Easter Tech Hunt",
    subtitle: "Find incredible deals this Easter",
    tagline: "Hop into savings this Easter.",
    cta: "Start Hunting",
    image: "https://images.unsplash.com/photo-1490750967868-88aa4f44baee?w=1920&q=80",
    overlay: "from-violet-900/65 via-pink-700/25 to-amber-500/30",
    glass: "bg-violet-900/15 backdrop-blur-xl",
    accent: "bg-violet-600 hover:bg-violet-500 text-white",
    icon: `${LUCIDE}/bird.svg`,
    iconColor: "#a78bfa",
  },

  // ══════════════════════════════════════════════════════════
  //  CULTURAL & REGIONAL
  // ══════════════════════════════════════════════════════════

  nigeria: {
    title: "Proudly Nigerian Deals",
    subtitle: "Celebrate with exclusive savings",
    tagline: "Made for Nigeria. Powered by 75TechStore.",
    cta: "Shop Now",
    image: "https://images.unsplash.com/photo-1618828665011-0abd973f7bb8?w=1920&q=80",
    overlay: "from-green-950/75 via-green-800/30 to-emerald-700/40",
    glass: "bg-green-950/20 backdrop-blur-xl",
    accent: "bg-white hover:bg-green-50 text-green-800",
    icon: `${LUCIDE}/globe.svg`,
    iconColor: "#22c55e",
  },

  eid: {
    title: "Eid Mubarak",
    subtitle: "Celebrate with exclusive tech deals",
    tagline: "Blessed celebrations, blessed savings.",
    cta: "Shop Eid Sale",
    image: "https://images.unsplash.com/photo-1564769625905-50e93615e769?w=1920&q=80",
    overlay: "from-emerald-950/75 via-teal-900/30 to-amber-950/50",
    glass: "bg-emerald-950/20 backdrop-blur-xl",
    accent: "bg-amber-400 hover:bg-amber-300 text-emerald-950",
    icon: `${LUCIDE}/moon.svg`,
    iconColor: "#fbbf24",
  },

  ramadan: {
    title: "Ramadan Kareem",
    subtitle: "Special tech deals all month long",
    tagline: "Blessed month. Blessed prices.",
    cta: "View Ramadan Deals",
    image: "https://images.unsplash.com/photo-1542816417-0983c9c9ad53?w=1920&q=80",
    overlay: "from-indigo-950/80 via-purple-950/35 to-teal-950/55",
    glass: "bg-indigo-950/25 backdrop-blur-xl",
    accent: "bg-amber-300 hover:bg-amber-200 text-indigo-950",
    icon: `${LUCIDE}/moon-star.svg`,
    iconColor: "#fde68a",
  },

  diwali: {
    title: "Diwali Festival Sale",
    subtitle: "Light up your life with new tech",
    tagline: "Festival of lights. Festival of savings.",
    cta: "Shop Diwali Sale",
    image: "https://images.unsplash.com/photo-1604610233972-0a1f8e3e8b28?w=1920&q=80",
    overlay: "from-orange-950/70 via-amber-800/25 to-red-950/50",
    glass: "bg-orange-950/20 backdrop-blur-xl",
    accent: "bg-white hover:bg-orange-50 text-orange-700",
    icon: `${LUCIDE}/flame.svg`,
    iconColor: "#fdba74",
  },

  holi: {
    title: "Holi Color Sale",
    subtitle: "Splash into incredible savings",
    tagline: "Colors of joy. Colors of savings.",
    cta: "Play Holi Deals",
    image: "https://images.unsplash.com/photo-1576398345933-471d219e2e85?w=1920&q=80",
    overlay: "from-pink-800/60 via-yellow-600/20 to-blue-800/40",
    glass: "bg-pink-800/15 backdrop-blur-xl",
    accent: "bg-white hover:bg-pink-50 text-pink-600",
    icon: `${LUCIDE}/palette.svg`,
    iconColor: "#f472b6",
  },

  india: {
    title: "Jai Hind",
    subtitle: "Celebrate India with exclusive deals",
    tagline: "Proud nation. Proud deals.",
    cta: "Shop India Deals",
    image: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1920&q=80",
    overlay: "from-orange-900/70 via-white/10 to-green-950/65",
    glass: "bg-orange-900/15 backdrop-blur-xl",
    accent: "bg-blue-600 hover:bg-blue-500 text-white",
    icon: `${LUCIDE}/globe.svg`,
    iconColor: "#3b82f6",
  },

  usa: {
    title: "Stars & Stripes Sale",
    subtitle: "Patriotic savings on top tech",
    tagline: "Freedom to save. Freedom to shop.",
    cta: "Shop USA Deals",
    image: "https://images.unsplash.com/photo-1485738422785-1e4a5c79cc53?w=1920&q=80",
    overlay: "from-blue-950/75 via-red-900/25 to-blue-950/60",
    glass: "bg-blue-950/20 backdrop-blur-xl",
    accent: "bg-white hover:bg-blue-50 text-blue-900",
    icon: `${LUCIDE}/flag.svg`,
    iconColor: "#ffffff",
  },

  // ══════════════════════════════════════════════════════════
  //  MAJOR SHOPPING EVENTS
  // ══════════════════════════════════════════════════════════

  thanksgiving: {
    title: "Thanksgiving Deals",
    subtitle: "Grateful savings on premium tech",
    tagline: "Give thanks. Get deals.",
    cta: "Shop Gratitude Sale",
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=1920&q=80",
    overlay: "from-orange-950/75 via-amber-800/30 to-yellow-800/40",
    glass: "bg-orange-950/20 backdrop-blur-xl",
    accent: "bg-white hover:bg-amber-50 text-orange-800",
    icon: `${LUCIDE}/utensils-crossed.svg`,
    iconColor: "#fdba74",
  },

  cybermonday: {
    title: "Cyber Monday",
    subtitle: "Online-only mega deals are live",
    tagline: "The internet's biggest tech sale.",
    cta: "Go Cyber",
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1920&q=80",
    overlay: "from-cyan-950/80 via-blue-950/35 to-indigo-950/65",
    glass: "bg-cyan-950/25 backdrop-blur-xl",
    accent: "bg-cyan-400 hover:bg-cyan-300 text-blue-950",
    icon: `${LUCIDE}/monitor.svg`,
    iconColor: "#22d3ee",
  },

  chinesenewyear: {
    title: "Lunar New Year Sale",
    subtitle: "Prosperous deals for a new beginning",
    tagline: "New year. New fortune. New gadgets.",
    cta: "Shop Lunar Deals",
    image: "https://images.unsplash.com/photo-1517154421773-0529f29ea451?w=1920&q=80",
    overlay: "from-red-950/75 via-red-800/30 to-amber-800/45",
    glass: "bg-red-950/20 backdrop-blur-xl",
    accent: "bg-amber-300 hover:bg-amber-200 text-red-900",
    icon: `${LUCIDE}/sparkles.svg`,
    iconColor: "#fde68a",
  },

  carnival: {
    title: "Carnival Deals",
    subtitle: "Party your way to savings",
    tagline: "Samba your way to savings!",
    cta: "Join the Party",
    image: "https://images.unsplash.com/photo-1551966775-a4ddc8df052b?w=1920&q=80",
    overlay: "from-yellow-700/60 via-green-700/25 to-purple-900/50",
    glass: "bg-purple-900/15 backdrop-blur-xl",
    accent: "bg-white hover:bg-purple-50 text-purple-700",
    icon: `${LUCIDE}/music.svg`,
    iconColor: "#c084fc",
  },

  // ══════════════════════════════════════════════════════════
  //  SEASONS
  // ══════════════════════════════════════════════════════════

  harmattan: {
    title: "Harmattan Cool Deals",
    subtitle: "Warm up with hot gadgets",
    tagline: "Beat the dry season with cool tech.",
    cta: "Shop Now",
    image: "https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=1920&q=80",
    overlay: "from-amber-950/70 via-yellow-800/25 to-orange-800/40",
    glass: "bg-amber-950/15 backdrop-blur-xl",
    accent: "bg-white hover:bg-amber-50 text-amber-800",
    icon: `${LUCIDE}/wind.svg`,
    iconColor: "#fcd34d",
  },

  rainy: {
    title: "Rainy Season Sale",
    subtitle: "Indoor tech at outdoor prices",
    tagline: "Stay in. Level up. Save big.",
    cta: "Shop Indoors",
    image: "https://images.unsplash.com/photo-1515694346937-94d85e39e29e?w=1920&q=80",
    overlay: "from-slate-900/75 via-blue-950/30 to-slate-950/60",
    glass: "bg-slate-900/20 backdrop-blur-xl",
    accent: "bg-cyan-400 hover:bg-cyan-300 text-slate-900",
    icon: `${LUCIDE}/cloud-rain.svg`,
    iconColor: "#22d3ee",
  },

  spring: {
    title: "Spring Tech Refresh",
    subtitle: "Bloom into savings this season",
    tagline: "New season. New gadgets. New you.",
    cta: "Refresh Now",
    image: "https://images.unsplash.com/photo-1490750967868-88aa4f44baee?w=1920&q=80",
    overlay: "from-green-900/65 via-emerald-700/25 to-teal-700/35",
    glass: "bg-green-900/15 backdrop-blur-xl",
    accent: "bg-white hover:bg-green-50 text-green-700",
    icon: `${LUCIDE}/flower-2.svg`,
    iconColor: "#4ade80",
  },

  summer: {
    title: "Summer Hot Deals",
    subtitle: "Sizzling savings on top tech",
    tagline: "Hot summer. Hotter deals.",
    cta: "Beat the Heat",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&q=80",
    overlay: "from-amber-700/60 via-orange-700/25 to-red-800/40",
    glass: "bg-amber-700/15 backdrop-blur-xl",
    accent: "bg-white hover:bg-orange-50 text-orange-700",
    icon: `${LUCIDE}/sun.svg`,
    iconColor: "#fbbf24",
  },

  autumn: {
    title: "Autumn Mega Deals",
    subtitle: "Falling prices this season",
    tagline: "Leaves fall. Prices too.",
    cta: "Catch the Deals",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1920&q=80",
    overlay: "from-orange-950/70 via-amber-900/25 to-red-950/45",
    glass: "bg-orange-950/15 backdrop-blur-xl",
    accent: "bg-amber-300 hover:bg-amber-200 text-orange-950",
    icon: `${LUCIDE}/leaf.svg`,
    iconColor: "#fb923c",
  },

  winter: {
    title: "Winter Wonderland Sale",
    subtitle: "Chill prices on premium tech",
    tagline: "Cold outside. Hot deals inside.",
    cta: "Warm Up & Save",
    image: "https://images.unsplash.com/photo-1491002052546-bf38f186af56?w=1920&q=80",
    overlay: "from-blue-950/75 via-slate-900/30 to-blue-950/55",
    glass: "bg-blue-950/20 backdrop-blur-xl",
    accent: "bg-white hover:bg-blue-50 text-blue-800",
    icon: `${LUCIDE}/snowflake.svg`,
    iconColor: "#93c5fd",
  },

  // ══════════════════════════════════════════════════════════
  //  SPECIAL OCCASIONS
  // ══════════════════════════════════════════════════════════

  womensday: {
    title: "Celebrate Her",
    subtitle: "For every queen — exclusive deals",
    tagline: "Tech that empowers. Deals that inspire.",
    cta: "Shop Her Style",
    image: "https://images.unsplash.com/photo-1604580864964-0462f5d5b1a8?w=1920&q=80",
    overlay: "from-purple-950/70 via-pink-800/25 to-rose-700/40",
    glass: "bg-purple-950/15 backdrop-blur-xl",
    accent: "bg-amber-300 hover:bg-amber-200 text-purple-900",
    icon: `${LUCIDE}/crown.svg`,
    iconColor: "#fde68a",
  },

  workers: {
    title: "Workers' Day Deals",
    subtitle: "Hard work deserves rewards",
    tagline: "For every hustle, a reward.",
    cta: "Claim Your Reward",
    image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1920&q=80",
    overlay: "from-red-950/70 via-red-800/25 to-amber-800/40",
    glass: "bg-red-950/15 backdrop-blur-xl",
    accent: "bg-white hover:bg-red-50 text-red-700",
    icon: `${LUCIDE}/wrench.svg`,
    iconColor: "#fca5a5",
  },

  earthday: {
    title: "Earth Day Eco Deals",
    subtitle: "Go green, save green",
    tagline: "Tech for a better tomorrow.",
    cta: "Shop Eco Tech",
    image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1920&q=80",
    overlay: "from-green-950/70 via-emerald-800/25 to-teal-800/40",
    glass: "bg-green-950/15 backdrop-blur-xl",
    accent: "bg-white hover:bg-green-50 text-green-700",
    icon: `${LUCIDE}/tree-pine.svg`,
    iconColor: "#4ade80",
  },

  // ══════════════════════════════════════════════════════════
  //  DEFAULT (FALLBACK)
  // ══════════════════════════════════════════════════════════

  default: {
    title: "Welcome to 75TechStore",
    subtitle: "Your one-stop tech destination",
    tagline: "The best gadgets. The best prices. Always.",
    cta: "Explore Now",
    image: "https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=1920&q=80",
    overlay: "from-zinc-950/80 via-slate-900/35 to-black/65",
    glass: "bg-zinc-950/25 backdrop-blur-xl",
    accent: "bg-amber-400 hover:bg-amber-300 text-black",
    icon: `${LUCIDE}/smartphone.svg`,
    iconColor: "#facc15",
  },
};


// ─────────────────────────────────────────────────────────────
//  HELPERS
// ─────────────────────────────────────────────────────────────

/**
 * Get a theme by its ID. Falls back to "default" if not found.
 * @param {string} themeId - The theme key from the admin dashboard
 * @returns {object} The full theme object
 */
export function getTheme(themeId) {
  return SEASONAL_THEMES[themeId] || SEASONAL_THEMES.default;
}

/**
 * Get all available theme IDs (useful for admin dashboard dropdowns).
 * @returns {string[]}
 */
export function getThemeKeys() {
  return Object.keys(SEASONAL_THEMES);
}