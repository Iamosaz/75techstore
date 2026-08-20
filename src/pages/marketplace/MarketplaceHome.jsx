import React, { useState, useEffect, useContext } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { UserContext } from "../../context/UserContext";
import ListingCard from "../../components/marketplace/ListingCard";
import {
  FiTrendingUp,
  FiSearch,
  FiSliders,
  FiChevronDown,
  FiX,
  FiLoader,
  FiPlus,
  FiShoppingBag,
  FiMapPin,
  FiInfo,
  FiShield,
  FiCpu,
  FiZap,
  FiCheckCircle,
} from "react-icons/fi";

const CATEGORIES = [
  { label: "Electronics", slug: "electronics-gadgets",
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=100&h=100&fit=crop" },
  { label: "Vehicles", slug: "vehicles",
    image: "https://images.unsplash.com/photo-1549924231-f129b911e442?w=100&h=100&fit=crop" },
  { label: "Property", slug: "property-housing",
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=100&h=100&fit=crop" },
  { label: "Fashion", slug: "fashion-clothing",
    image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=100&h=100&fit=crop" },
  { label: "Furniture", slug: "furniture-home",
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=100&h=100&fit=crop" },
  { label: "Services", slug: "jobs-services",
    image: "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=100&h=100&fit=crop" },
  { label: "Education", slug: "education-tutoring",
    image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=100&h=100&fit=crop" },
  { label: "Food", slug: "food-catering",
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=100&h=100&fit=crop" },
  { label: "Sports", slug: "sports-fitness",
    image: "https://images.unsplash.com/photo-1461896836934-bd45ba8fcf9b?w=100&h=100&fit=crop" },
  { label: "Gaming", slug: "gaming",
    image: "https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?w=100&h=100&fit=crop" },
  { label: "Beauty", slug: "beauty-health",
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=100&h=100&fit=crop" },
  { label: "Pets", slug: "pets",
    image: "https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=100&h=100&fit=crop" },
  { label: "Other", slug: "other",
    image: "https://images.unsplash.com/photo-1586880244406-556ebe35f282?w=100&h=100&fit=crop" },
];

const STATES = [
  "All Nigeria", "Abia", "Adamawa", "Akwa Ibom", "Anambra",
  "Bauchi", "Bayelsa", "Benue", "Borno", "Cross River",
  "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu",
  "FCT - Abuja", "Gombe", "Imo", "Jigawa", "Kaduna",
  "Kano", "Katsina", "Kebbi", "Kogi", "Kwara",
  "Lagos", "Nasarawa", "Niger", "Ogun", "Ondo",
  "Osun", "Oyo", "Plateau", "Rivers", "Sokoto",
  "Taraba", "Yobe", "Zamfara",
];

const SORT_OPTIONS = [
  { label: "Newest First",        value: "newest" },
  { label: "Price: Low → High",   value: "price-asc" },
  { label: "Price: High → Low",   value: "price-desc" },
  { label: "Most Popular",        value: "popular" },
];

const CONDITIONS = [
  { label: "All",         value: "all" },
  { label: "Brand New",   value: "new" },
  { label: "Fairly Used", value: "fairly-used" },
  { label: "Used",        value: "used" },
  { label: "Refurbished", value: "refurbished" },
];

export default function MarketplaceHome() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useContext(UserContext);

  const [listings,         setListings]         = useState([]);
  const [featuredListings, setFeaturedListings] = useState([]);
  const [loading,          setLoading]          = useState(false);
  const [totalListings,    setTotalListings]    = useState(0);
  const [currentPage,      setCurrentPage]      = useState(1);
  const [totalPages,       setTotalPages]       = useState(1);
  const [showFilters,      setShowFilters]      = useState(false);
  const [showSortMenu,     setShowSortMenu]     = useState(false);
  const [localMinPrice,    setLocalMinPrice]    = useState("");
  const [localMaxPrice,    setLocalMaxPrice]    = useState("");
  const [selectedState,    setSelectedState]    = useState("All Nigeria");
  const [marketSearch,     setMarketSearch]     = useState("");

  // Coming Soon Teaser state
  const [showTeaser, setShowTeaser] = useState(false);

  const activeCategory  = searchParams.get("category")  || "";
  const activeSearch    = searchParams.get("search")    || "";
  const activeSort      = searchParams.get("sort")      || "newest";
  const activeCondition = searchParams.get("condition")  || "all";
  const activeState     = searchParams.get("state")     || "";
  const minPrice        = searchParams.get("minPrice")  || "";
  const maxPrice        = searchParams.get("maxPrice")  || "";

  useEffect(() => {
    fetchListings();
    // eslint-disable-next-line
  }, [activeCategory, activeSearch, activeSort, activeCondition,
      activeState, minPrice, maxPrice, currentPage]);

  const fetchListings = async () => {
    setLoading(true);
    try {
      // Intentionally empty for pre-launch preview mode
      setListings([]);
      setFeaturedListings([]);
      setTotalListings(0);
      setTotalPages(1);
    } catch (err) {
      console.error("Error fetching listings:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateFilter = (key, value) => {
    // Intercept with teaser modal
    setShowTeaser(true);
  };

  const applyPriceFilter = () => {
    setShowTeaser(true);
  };

  const clearAllFilters = () => {
    setSearchParams({});
    setLocalMinPrice("");
    setLocalMaxPrice("");
    setCurrentPage(1);
  };

  const handleMarketSearch = (e) => {
    e.preventDefault();
    setShowTeaser(true);
  };

  const hasActiveFilters =
    activeCategory || activeSearch ||
    (activeCondition && activeCondition !== "all") ||
    activeState || minPrice || maxPrice;

  const activeCategoryLabel =
    CATEGORIES.find((c) => c.slug === activeCategory)?.label || "";

  return (
    <div className="min-h-screen bg-gray-50 relative">

      {/* ─── Coming Soon Top Banner ─── */}
      <div className="bg-gradient-to-r from-orange-600 to-amber-500 text-white text-center py-2.5 px-4 text-xs font-bold tracking-wide flex items-center justify-center gap-2 shadow-inner">
        <FiInfo className="text-sm shrink-0 animate-bounce" />
        <span>75TECHSTORE MARKETPLACE PREVIEW: This section will be activated in our upcoming Phase 2 release!</span>
      </div>

      {/* ══════════════════════════════════════════════════
          MARKETPLACE SEARCH BAR — Page level, not navbar
      ══════════════════════════════════════════════════ */}
      <div className="bg-[#1a1a2e]">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">

            {/* Location */}
            <div className="hidden md:flex items-center gap-1.5 flex-shrink-0">
              <FiMapPin size={14} className="text-orange-400" />
              <select
                value={selectedState}
                onChange={(e) => {
                  setSelectedState(e.target.value);
                  setShowTeaser(true);
                }}
                className="bg-white/10 text-gray-300 text-sm outline-none
                           border border-gray-700 rounded-lg px-3 py-2
                           hover:border-orange-500 transition-colors cursor-pointer"
              >
                {STATES.map((state) => (
                  <option key={state} value={state}
                    className="bg-[#1a1a2e] text-white">
                    {state}
                  </option>
                ))}
              </select>
            </div>

            {/* Search */}
            <form onSubmit={handleMarketSearch} className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  value={marketSearch}
                  onChange={(e) => setMarketSearch(e.target.value)}
                  placeholder="Search marketplace for anything..."
                  className="w-full bg-white/10 hover:bg-white/15
                             focus:bg-white text-white focus:text-gray-900
                             placeholder-gray-500 focus:placeholder-gray-400
                             rounded-xl px-4 py-3 pr-12 text-sm
                             outline-none border border-gray-700
                             focus:border-orange-400 transition-all duration-200"
                />
                <button type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2
                             w-8 h-8 bg-orange-500 hover:bg-orange-600
                             rounded-lg flex items-center justify-center
                             transition-colors">
                  <FiSearch size={15} className="text-white" />
                </button>
              </div>
            </form>

            {/* Post Ad */}
            <button
              onClick={() => setShowTeaser(true)}
              className="flex items-center gap-2 bg-orange-500
                         hover:bg-orange-600 text-white font-bold
                         px-5 py-3 rounded-xl text-sm transition-all
                         hover:scale-105 active:scale-95 flex-shrink-0
                         shadow-lg shadow-orange-500/25"
            >
              <FiPlus size={16} />
              <span>Post Ad</span>
            </button>
          </div>

          {/* Category Chips */}
          <div className="flex items-center gap-2 mt-3 overflow-x-auto pb-1"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
            {CATEGORIES.map((cat) => (
              <button key={cat.slug}
                onClick={() => setShowTeaser(true)}
                className={`flex items-center gap-1.5 px-3 py-1.5
                            rounded-full text-xs font-medium whitespace-nowrap
                            transition-all border text-gray-400 border-gray-700 hover:border-orange-500 hover:text-orange-400`}>
                <img src={cat.image} alt={cat.label}
                  className="w-5 h-5 rounded-full object-cover flex-shrink-0" />
                <span>{cat.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════
          HERO
      ══════════════════════════════════════════════════ */}
      {!activeSearch && !activeCategory && (
        <section className="bg-gradient-to-br from-[#0f3460] via-[#16213e]
                            to-[#1a1a2e] text-white">
          <div className="max-w-7xl mx-auto px-4 py-12 md:py-16">
            <div className="max-w-2xl">
              <h1 className="text-3xl md:text-5xl font-black leading-tight mb-4">
                Buy & Sell
                <span className="text-orange-400"> Anything</span>
                <br />In Nigeria
              </h1>
              <p className="text-gray-300 text-base md:text-lg mb-8 leading-relaxed">
                From gadgets to laptops, accessories to swap deals — find the best
                deals near you or sell to thousands of buyers.
                <span className="text-orange-400 font-semibold">
                  {" "}Verified sellers. Secure escrow transactions.
                </span>
              </p>
              <div className="flex items-center gap-6 md:gap-10">
                <div>
                  <p className="text-2xl md:text-3xl font-black text-orange-400">LAUNCHING</p>
                  <p className="text-gray-400 text-xs md:text-sm">Soon in Phase 2</p>
                </div>
                <div className="w-px h-10 bg-gray-700" />
                <div>
                  <p className="text-2xl md:text-3xl font-black text-orange-400">37</p>
                  <p className="text-gray-400 text-xs md:text-sm">States Covered</p>
                </div>
                <div className="w-px h-10 bg-gray-700" />
                <div>
                  <p className="text-2xl md:text-3xl font-black text-orange-400">Free</p>
                  <p className="text-gray-400 text-xs md:text-sm">Standard Listing</p>
                </div>
              </div>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-4 pb-8">
            <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-7 gap-2">
              {CATEGORIES.map((cat) => (
                <button key={cat.slug}
                  onClick={() => setShowTeaser(true)}
                  className="flex flex-col items-center gap-2 p-3 rounded-xl transition-all duration-200 hover:scale-105 bg-white/10 hover:bg-white/20">
                  <img src={cat.image} alt={cat.label}
                    className="w-10 h-10 md:w-12 md:h-12 rounded-xl object-cover" />
                  <span className="text-xs font-medium text-gray-200 leading-tight text-center">
                    {cat.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Toolbar */}
      <section className="max-w-7xl mx-auto px-4 py-4 mt-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => setShowTeaser(true)}
              className="flex items-center gap-2 px-4 py-2.5 border rounded-xl text-sm font-medium transition-all border-gray-300 text-gray-600 hover:border-gray-400">
              <FiSliders size={15} /> Filters
            </button>
            <p className="text-sm text-gray-500 hidden sm:block">
              Marketplace Preview Mode Active
            </p>
          </div>

          <button onClick={() => setShowTeaser(true)}
            className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-xl text-sm text-gray-600 hover:border-gray-400">
            <span className="hidden sm:inline">Sort:</span>
            <span className="font-medium text-gray-800">Newest First</span>
            <FiChevronDown size={14} />
          </button>
        </div>
      </section>

      {/* ─── Beautiful Marketplace Roadmap Empty State ─── */}
      <section className="max-w-4xl mx-auto px-4 py-12 pb-24">
        <div className="bg-white rounded-3xl border border-gray-100 p-8 md:p-12 text-center shadow-xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-400"></div>

          <div className="w-20 h-20 bg-orange-50 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner">
            <FiShoppingBag size={40} className="text-orange-500" />
          </div>

          <h3 className="text-2xl md:text-3xl font-black text-gray-900 mb-3">
            75Techstore Marketplace is Launching Soon!
          </h3>
          <p className="text-gray-500 max-w-xl mx-auto text-sm leading-relaxed mb-8">
            We are currently fine-tuning our peer-to-peer trading algorithms, safety escrows, and logistics frameworks to bring you the safest and fastest gadget marketplace in Nigeria.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left mb-8">
            <div className="p-5 rounded-2xl bg-gray-50 border border-gray-100">
              <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center mb-4">
                <FiShield size={18} />
              </div>
              <h4 className="font-extrabold text-sm text-gray-900 mb-1">Escrow Protection</h4>
              <p className="text-xs text-gray-500">Payments are held securely in escrow until you receive and verify the item.</p>
            </div>

            <div className="p-5 rounded-2xl bg-gray-50 border border-gray-100">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-4">
                <FiCpu size={18} />
              </div>
              <h4 className="font-extrabold text-sm text-gray-900 mb-1">Hardware Testing</h4>
              <p className="text-xs text-gray-500">Option to request certified 75Tech hardware diagnostic checks before delivery.</p>
            </div>

            <div className="p-5 rounded-2xl bg-gray-50 border border-gray-100">
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center mb-4">
                <FiZap size={18} />
              </div>
              <h4 className="font-extrabold text-sm text-gray-900 mb-1">Instant Swap Deals</h4>
              <p className="text-xs text-gray-500">Direct integration to trade your old phones and computers seamlessly.</p>
            </div>
          </div>

          <button
            onClick={() => setShowTeaser(true)}
            className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-8 py-3.5 rounded-xl transition-all shadow-lg shadow-orange-500/30"
          >
            Get Notified On Launch
          </button>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────
          GORGEOUS coming soon GLASSMORPHISM DIALOG MODAL
      ────────────────────────────────────────────────── */}
      {showTeaser && (
        <div className="fixed inset-0 bg-gray-950/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden border border-gray-100 animate-in fade-in zoom-in-95 duration-200">
            <div className="h-2 bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-400"></div>
            
            <div className="p-6 md:p-8">
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center text-orange-500 text-xl font-bold shadow-inner">
                  🛍️
                </div>
                <button
                  onClick={() => setShowTeaser(false)}
                  className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600 transition"
                >
                  <FiX size={20} />
                </button>
              </div>

              <h3 className="text-xl md:text-2xl font-black text-gray-900 leading-tight">
                Peer-To-Peer Marketplace Launching Soon
              </h3>
              <p className="text-xs text-orange-600 font-extrabold tracking-wider uppercase mt-1">
                Coming in Phase 2 Release
              </p>

              <p className="text-gray-500 text-sm leading-relaxed mt-4">
                We're actively onboarding trusted local tech vendors and configuring our escrow transaction safety protocols. 
              </p>

              <div className="mt-6 space-y-3">
                <div className="flex items-center gap-3 text-xs text-gray-600 font-medium">
                  <FiCheckCircle className="text-emerald-500 text-lg shrink-0" />
                  <span>Escrow system configured</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-gray-600 font-medium">
                  <FiCheckCircle className="text-emerald-500 text-lg shrink-0" />
                  <span>Interactive city/state filters mapped</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-gray-600 font-medium">
                  <span className="w-2.5 h-2.5 bg-orange-500 rounded-full animate-ping shrink-0" />
                  <span>Vendor onboarding starting next month</span>
                </div>
              </div>

              <div className="mt-8 flex gap-3">
                <button
                  onClick={() => setShowTeaser(false)}
                  className="w-full bg-gray-900 hover:bg-black text-white font-bold py-3.5 rounded-xl text-sm transition-all shadow-md"
                >
                  Got it, thank you!
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}