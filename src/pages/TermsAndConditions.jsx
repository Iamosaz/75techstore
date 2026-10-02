// src/pages/TermsAndConditions.jsx
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiShield, FiFileText, FiTruck, FiRefreshCw, FiAlertTriangle } from 'react-icons/fi';

const TermsAndConditions = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        
        {/* Header banner */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-12 text-white text-center">
          <FiFileText className="text-5xl mx-auto mb-4 opacity-90 animate-pulse" />
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight">Terms & Conditions</h1>
          <p className="mt-2 text-blue-100 text-sm">Last Updated: March 2026 • 75TechStore Limited</p>
        </div>

        {/* Content body */}
        <div className="p-6 sm:p-10 lg:p-12 space-y-8 text-gray-600 leading-relaxed text-sm sm:text-base">
          
          <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded-r-xl">
            <p className="text-blue-800 font-medium">
              Please read these terms and conditions carefully before using our website or committing to any transactions. By using 75TechStore.com.ng, you agree to be bound by these Terms.
            </p>
          </div>

          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <span className="text-blue-600">1.</span> Introduction & Agreement
            </h2>
            <p>
              Welcome to 75TechStore. These Terms and Conditions govern your use of the website operated by <strong>75TechStore Limited</strong> ("we", "us", or "our"), located at Computer Village, Ikeja, Lagos, Nigeria.
            </p>
            <p>
              By accessing this website, purchasing devices, gadgets, accessories, subscribing to our VIP membership, or requesting engineer repair and device swap services, you acknowledge that you have read, understood, and agreed to these terms.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <span className="text-blue-600">2.</span> Account Registration & Security
            </h2>
            <p>
              To access certain features of the platform, including tracking orders, viewing VIP discounts, and submitting device swap deals, you must register an account. You agree to provide accurate, current, and complete information. You are solely responsible for maintaining the confidentiality of your account credentials.
            </p>
          </section>

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <span className="text-blue-600">3.</span> Device Swap & Assessment Policy
            </h2>
            <div className="flex gap-3 bg-orange-50 border border-orange-100 p-4 rounded-xl text-orange-800">
              <FiRefreshCw className="shrink-0 text-xl mt-0.5" />
              <div>
                <p className="font-semibold">Important Notice on Swap Deals:</p>
                <p className="text-xs mt-1">
                  All devices submitted for swaps must be original, legally acquired, and unlocked from any cloud lock (iCloud, Google Lock, etc.). Devices with illegal origins will be flagged and reported to security authorities immediately.
                </p>
              </div>
            </div>
            <p>
              Our initial assessment value offered online is an estimate based on the details you provided. Final values are determined only after our engineering team at Computer Village, Ikeja performs a physical inspection. We reserve the right to decline any swap deal at our sole discretion.
            </p>
          </section>

          {/* Section 4 */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <span className="text-blue-600">4.</span> Gadget Repair & Engineering Services
            </h2>
            <p>
              When requesting our engineer repair services:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-600 text-sm">
              <li>You agree to back up your personal device data. 75TechStore is not responsible for any data loss during repairs.</li>
              <li>Replaced parts are subject to a limited warranty period specified on your official receipt. This warranty is voided if the device is opened by a third party, suffers physical damage, or is exposed to liquid.</li>
            </ul>
          </section>

          {/* Section 5 */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <span className="text-blue-600">5.</span> Pricing, Payments & VIP Membership
            </h2>
            <p>
              Pricing for physical goods and services on the site is listed in Nigerian Naira (₦). We process secure online payments through our accredited payment partners (including Paystack). 
            </p>
            <p>
              <strong>VIP Subscriptions:</strong> Subscriptions are processed instantly upon transaction verification. VIP discounts apply exclusively to specified products during the duration of your active subscription tier.
            </p>
          </section>

          {/* Section 6 */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <span className="text-blue-600">6.</span> Delivery & Pickup
            </h2>
            <div className="flex gap-3 bg-gray-50 border border-gray-100 p-4 rounded-xl text-gray-700">
              <FiTruck className="shrink-0 text-xl mt-0.5 text-blue-600" />
              <div>
                <p className="font-semibold text-gray-900">Shipping Terms:</p>
                <p className="text-xs mt-1">
                  We deliver nationwide across Nigeria. Delivery timelines are estimates and are subject to third-party courier dispatch speeds. Customers can choose physically to pick up devices directly from our main office in Ikeja, Lagos.
                </p>
              </div>
            </div>
          </section>

          {/* Section 7 */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <span className="text-blue-600">7.</span> Limitation of Liability
            </h2>
            <p>
              To the maximum extent permitted by Nigerian law, 75TechStore Limited shall not be liable for any indirect, incidental, special, exemplary, or consequential damages arising out of your purchases, deliveries, device swaps, or repair assessments.
            </p>
          </section>

          {/* Footer Contact info */}
          <div className="border-t border-gray-100 pt-8 mt-10 text-center">
            <p className="text-xs text-gray-400">
              Questions about these Terms? Contact us via support@75techstore.com.ng or call +234 703 562 0709
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

export default TermsAndConditions;