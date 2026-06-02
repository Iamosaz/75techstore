// src/App.jsx

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Navbar from "./components/Navbar";

// Pages
import Home from "./pages/Home";
import DealDetails from "./pages/DealDetails";
import Category from "./components/category/Category";
import Category2 from "./components/category/Category2";
import Services from "./components/Services/Services";
import OurProducts from "./components/ourproducts/OurProducts";
import PreFooter from "./components/prefooter/PreFooter";
import About from "./pages/About";
import Contact from "./pages/Contact";
import CustomChatbot from "./components/chatbot/CustomChatbot";


export default function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-gray-50 font-sans">
        {/* 🔹 Navigation Bar (optional for later) */}
        <Navbar />

        {/* 🔹 Main content */}
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
           <Route path="/deals/:id" element={<DealDetails />} />
           <Route path="/category/:id" element={<Category />} />
           <Route path="/category2/:id" element={<Category2 />} />
          <Route path="/services/:id" element={<Services />} />
          <Route path="/ourproducts/:id" element={<OurProducts />} />
          <Route path="/prefooter/:id" element={<PreFooter />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          </Routes>
        </main>
        
        {/* Chatbot  (Always visible) */}
        <CustomChatbot />


        {/* 🔹 Footer section (optional for later) */}
        {/* <Footer /> */}
      </div>
    </Router>
  );
}