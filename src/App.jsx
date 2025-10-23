// src/App.jsx

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Navbar from "./components/Navbar";

// Pages
import Home from "./pages/Home";
import DealDetails from "./pages/DealDetails";

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
          </Routes>
        </main>

        {/* 🔹 Footer section (optional for later) */}
        {/* <Footer /> */}
      </div>
    </Router>
  );
}