import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import CustomChatbot from "./components/chatbot/CustomChatbot";

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

// Admin
import AdminRoutes from "./admin/AdminRoutes";
import { AdminProvider } from "./admin/context/AdminContext";
import Shop from "./pages/Shop";
import ScrollToTop from "./ScrollToTop";
import ExitIntentPopup from "./ExitIntentPopup";
import BlogPage from "./pages/BlogPage";
import BlogDetail from "./pages/BlogDetail";

// ✅ Separate component to use useLocation inside Router
function AppContent() {
const location = useLocation();
const isAdminRoute = location.pathname.startsWith("/admin");

return (
<div className="flex flex-col min-h-screen bg-gray-50 font-sans">
{/* Hide Navbar on admin routes */}
{!isAdminRoute && <Navbar />}
<ScrollToTop />
<ExitIntentPopup />



  <main className="flex-grow">
    <Routes>
      {/* ========== PUBLIC ROUTES ========== */}
      <Route path="/" element={<Home />} />
      <Route path="/deals/:id" element={<DealDetails />} />
      <Route path="/category/:id" element={<Category />} />
      <Route path="/category2/:id" element={<Category2 />} />
      <Route path="/services/:id" element={<Services />} />
      <Route path="/ourproducts/:id" element={<OurProducts />} />
      <Route path="/prefooter/:id" element={<PreFooter />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/shop" element={<Shop />} />
      <Route path="/blog" element={<BlogPage />} />
      <Route path="/blog/:id" element={<BlogDetail />} />

      {/* ========== ADMIN ROUTES ========== */}
      {/* ✅ This one route handles ALL admin pages */}
      <Route path="/admin/*" element={<AdminRoutes />} />
    </Routes>
  </main>

  {/* Hide Chatbot on admin routes */}
  {!isAdminRoute && <CustomChatbot />}
</div>
);
}

export default function App() {
return (
<AdminProvider>
<Router>
<AppContent />
</Router>
</AdminProvider>
);
}