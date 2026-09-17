// src/App.jsx
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

// Layout & Global Components
import Navbar from "./components/Navbar";
import CustomChatbot from "./components/chatbot/CustomChatbot";
import ScrollToTop from "./ScrollToTop";
import ExitIntentPopup from "./ExitIntentPopup";
import SEOTracker from "./SEOTracker"; // ✅ Fixed import from src/SEOTracker.jsx

// Public Pages
import Home from "./pages/Home";
import DealDetails from "./pages/DealDetails";
import Category from "./components/category/Category";
import Category2 from "./components/category/Category2";
import Services from "./components/Services/Services";
import OurProducts from "./components/ourproducts/OurProducts";
import PreFooter from "./components/prefooter/PreFooter";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Shop from "./pages/Shop";
import ProductDetail from "./pages/ProductDetail";
import BlogPage from "./pages/BlogPage";
import BlogDetail from "./pages/BlogDetail";
import RequestEngineer from "./pages/RequestEngineer";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Repairs from "./pages/Repairs";
import DigitalServices from "./pages/DigitalServices";
import ServicesPage from "./pages/ServicesPage";
import SwapDeals from "./pages/SwapDeals";
import SeasonalShop from "./pages/SeasonalShop";
import MarketplaceHome from "./pages/marketplace/MarketplaceHome";

// Membership Pages
import MembershipBenefits from "./pages/MembershipBenefits";
import MembershipPlan from "./pages/MembershipPlan";
import MembershipVerify from "./pages/MembershipVerify";

// Commerce Pages
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrderSuccessPage from "./pages/OrderSuccessPage";
import OrderTrackingPage from "./pages/OrderTrackingPage";

// Admin Routing
import AdminRoutes from "./admin/AdminRoutes";

// Context Providers
import { AdminProvider } from "./admin/context/AdminContext";
import { UserProvider } from "./context/UserContext";
import { CartProvider } from "./context/CartContext";
import { SeasonalProvider } from "./context/SeasonalContext";

function AppContent() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 font-sans">
      {/* 🚀 SEO & Traffic Auto Tracker */}
      <SEOTracker />

      {/* Show Navbar on customer-facing routes */}
      {!isAdminRoute && <Navbar />}

      <ScrollToTop />
      <ExitIntentPopup />

      <main className="flex-grow">
        <Routes>
          {/* ── Public Core Pages ── */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/shop/:id" element={<ProductDetail />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/marketplace" element={<MarketplaceHome />} />

          {/* ── Deals & Categories ── */}
          <Route path="/deals" element={<SeasonalShop />} />
          <Route path="/deals/:id" element={<DealDetails />} />
          <Route path="/seasonal-deals" element={<SeasonalShop />} />
          <Route path="/category/:id" element={<Category />} />
          <Route path="/category2/:id" element={<Category2 />} />
          <Route path="/ourproducts/:id" element={<OurProducts />} />
          <Route path="/prefooter/:id" element={<PreFooter />} />

          {/* ── Services ── */}
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/services/:id" element={<Services />} />
          <Route path="/repairs" element={<Repairs />} />
          <Route path="/requestengineer" element={<RequestEngineer />} />
          <Route path="/digital-services" element={<DigitalServices />} />
          <Route path="/swap-deals" element={<SwapDeals />} />

          {/* ── Blog ── */}
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:id" element={<BlogDetail />} />

          {/* ── Auth & Account ── */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* ── Membership (✅ All Route Formats Supported) ── */}
          <Route path="/membership" element={<MembershipBenefits />} />
          <Route path="/membership-benefits" element={<MembershipBenefits />} />
          <Route path="/membership-plan" element={<MembershipPlan />} />
          <Route path="/membership-verify" element={<MembershipVerify />} />
          <Route path="/membership/verify" element={<MembershipVerify />} />

          {/* ── Commerce & Orders ── */}
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/order-success" element={<OrderSuccessPage />} />
          <Route path="/track-order" element={<OrderTrackingPage />} />

          {/* ── Admin Dashboard ── */}
          <Route path="/admin/*" element={<AdminRoutes />} />

          {/* ── Fallback Catch-All (Prevents White Screens) ── */}
          <Route path="*" element={<Home />} />
        </Routes>
      </main>

      {/* Show Support Chatbot on customer-facing routes */}
      {!isAdminRoute && <CustomChatbot />}
    </div>
  );
}

export default function App() {
  return (
    <AdminProvider>
      <UserProvider>
        <CartProvider>
          <SeasonalProvider>
            <Router>
              <AppContent />
            </Router>
          </SeasonalProvider>
        </CartProvider>
      </UserProvider>
    </AdminProvider>
  );
}