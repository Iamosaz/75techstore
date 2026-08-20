import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import CustomChatbot from "./components/chatbot/CustomChatbot";

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
import BlogPage from "./pages/BlogPage";
import BlogDetail from "./pages/BlogDetail";
import RequestEngineer from "./pages/RequestEngineer";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AdminRoutes from "./admin/AdminRoutes";
import { AdminProvider } from "./admin/context/AdminContext";
import { UserProvider } from "./context/UserContext";
import { CartProvider } from "./context/CartContext";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrderSuccessPage from "./pages/OrderSuccessPage";
import OrderTrackingPage from "./pages/OrderTrackingPage";
import MarketplaceHome from "./pages/marketplace/MarketplaceHome";
import ScrollToTop from "./ScrollToTop";
import ExitIntentPopup from "./ExitIntentPopup";
import Repairs from "./pages/Repairs";
import DigitalServices from "./pages/DigitalServices";
import ServicesPage from "./pages/ServicesPage";
import SwapDeals from "./pages/SwapDeals";
import ProductDetail from "./pages/ProductDetail"
import MembershipBenefits from "./pages/MembershipBenefits";
import MembershipPlan from "./pages/MembershipPlan";
import MembershipVerify from "./pages/MembershipVerify";




function AppContent() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 font-sans">
      {!isAdminRoute && <Navbar />}
      <ScrollToTop />
      <ExitIntentPopup />

      <main className="flex-grow">
        <Routes>
          <Route path="/"                  element={<Home />} />
          <Route path="/deals/:id"         element={<DealDetails />} />
          <Route path="/category/:id"      element={<Category />} />
          <Route path="/category2/:id"     element={<Category2 />} />
          <Route path="/services/:id"      element={<Services />} />
          <Route path="/ourproducts/:id"   element={<OurProducts />} />
          <Route path="/prefooter/:id"     element={<PreFooter />} />
          <Route path="/about"             element={<About />} />
          <Route path="/contact"           element={<Contact />} />
          <Route path="/shop"              element={<Shop />} />
          <Route path="/blog"              element={<BlogPage />} />
          <Route path="/blog/:id"          element={<BlogDetail />} />
          <Route path="/login"             element={<Login />} />
          <Route path="/signup"            element={<Signup />} />
          <Route path="/requestengineer"   element={<RequestEngineer />} />
          <Route path="/repairs"           element={<Repairs />} />
          <Route path="/digital-services"  element={<DigitalServices />} />
          <Route path="/services"          element={<ServicesPage />} />
          <Route path="/marketplace"       element={<MarketplaceHome />} />
          <Route path="/admin/*"           element={<AdminRoutes />} />
          <Route path="/swap-deals"        element={<SwapDeals />} />

          {/* /Membership plan */}
         
          <Route path="/membership"     element={<MembershipBenefits />} />
          <Route path="/membership/verify"     element={<MembershipVerify />} />
          <Route path="/membership-plan" element={<MembershipPlan/>} />
        
          

          {/*  Cart, Checkout, Orders */}
          <Route path="/cart"              element={<CartPage />} />
          <Route path="/checkout"          element={<CheckoutPage />} />
          <Route path="/order-success"     element={<OrderSuccessPage />} />
          <Route path="/track-order"       element={<OrderTrackingPage />} />
          <Route path="/shop/:id" element={<ProductDetail />} />
        </Routes>
      </main>

      {!isAdminRoute && <CustomChatbot />}
    </div>
  );
}

export default function App() {
  return (
    <AdminProvider>
      <UserProvider>
        <CartProvider>
          <Router>
            <AppContent />
          </Router>
        </CartProvider>
      </UserProvider>
    </AdminProvider>
  );
}