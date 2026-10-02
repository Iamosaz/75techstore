// src/pages/PrivacyPolicy.jsx
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiShield, FiLock, FiEye, FiDatabase, FiSmartphone } from 'react-icons/fi';

const PrivacyPolicy = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        
        {/* Header banner */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-12 text-white text-center">
          <FiShield className="text-5xl mx-auto mb-4 opacity-90 animate-pulse" />
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight">Privacy Policy</h1>
          <p className="mt-2 text-blue-100 text-sm">Last Updated: March 2026 • 75TechStore Limited</p>
        </div>

        {/* Content body */}
        <div className="p-6 sm:p-10 lg:p-12 space-y-8 text-gray-600 leading-relaxed text-sm sm:text-base">
          
          <div className="bg-emerald-50 border-l-4 border-emerald-500 p-4 rounded-r-xl">
            <p className="text-emerald-800 font-medium">
              We highly value your trust and privacy. This Privacy Policy details exactly how we safeguard your data in compliance with the Nigeria Data Protection Regulation (NDPR).
            </p>
          </div>

          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <span className="text-blue-600">1.</span> Information We Collect
            </h2>
            <p>
              We collect information that allows us to fulfill orders, process payments, and verify swap deal submissions. This includes:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-sm">
              <li><strong>Contact Information:</strong> Name, Email Address, Delivery Address, and Telephone Number.</li>
              <li><strong>Device Info:</strong> Brand, Model, Condition details, and uploaded gadget photos when submitting Swap Deals or Engineering Repairs.</li>
              <li><strong>Interaction Logs:</strong> Automatically tracked pageviews, device types, and traffic channels (such as Google, WhatsApp links, or Social Media) to optimize site speed and performance.</li>
            </ul>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <span className="text-blue-600">2.</span> How We Use Your Information
            </h2>
            <p>
              Your data is processed strictly for official operations including:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-sm">
              <li>Processing your orders and routing shipments.</li>
              <li>Enabling our engineers to contact you regarding repair status or swap assessments.</li>
              <li>Providing active VIP Membership benefits.</li>
              <li>Analyzing network traffic anonymously to keep our site fast and free from security threats.</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <span className="text-blue-600">3.</span> Financial Data & Paystack Security
            </h2>
            <div className="flex gap-3 bg-blue-50 border border-blue-100 p-4 rounded-xl text-blue-800">
              <FiLock className="shrink-0 text-xl mt-0.5" />
              <div>
                <p className="font-semibold">Secured Payment Processing:</p>
                <p className="text-xs mt-1">
                  We never store your credit/debit card numbers directly on our servers. All financial transactions are securely tokenized and handled by <strong>Paystack</strong>, a fully PCI-DSS compliant payment gateway.
                </p>
              </div>
            </div>
          </section>

          {/* Section 4 */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <span className="text-blue-600">4.</span> Information Sharing Policy
            </h2>
            <p>
              75TechStore Limited <strong>does not sell, rent, or lease</strong> your personal details to third parties. We only share essential operational data with verified third parties strictly required to fulfill your requests, such as dispatch riders / courier delivery agencies.
            </p>
          </section>

          {/* Section 5 */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <span className="text-blue-600">5.</span> Data Retention & Rights
            </h2>
            <p>
              Under NDPR guidelines, you retain full rights over your data. You may request to review, update, or completely delete your profile at any time. To make a data request, please send an email directly to our support desk.
            </p>
          </section>

          {/* Footer Contact info */}
          <div className="border-t border-gray-100 pt-8 mt-10 text-center">
            <p className="text-xs text-gray-400">
              Concerns about your privacy? Contact our Data Officer via support@75techstore.com.ng
            </p>
            <Link to="/" className="mt-4 inline-block bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold px-4 py-2 rounded-xl transition">
              Return to Homepage
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;