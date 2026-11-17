import React from 'react';

const DeliveryPolicy = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 text-gray-800">
      <h1 className="text-3xl font-bold mb-6 text-primary">Delivery & Shipping Policy</h1>
      <p className="text-sm text-gray-500 mb-6">Last Updated: November 2026</p>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">1. Delivery Timelines</h2>
        <p className="leading-relaxed mb-3">
          At <strong>75Techstore Limited</strong>, we strive to dispatch and deliver your gadgets as quickly as possible. 
          Our delivery timelines across Nigeria are as follows:
        </p>
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-2">
          <p><strong>Lagos / Intra-state Deliveries:</strong> 1 to 2 Business Days</p>
          <p><strong>Interstate / Nationwide Deliveries:</strong> 3 to 5 Business Days</p>
          <p><strong>Express Same-Day Delivery:</strong> Available within Lagos for select orders placed before 12:00 PM.</p>
        </div>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">2. Shipping Fees</h2>
        <p className="leading-relaxed">
          Shipping costs are calculated at checkout based on your delivery address, package weight, and chosen delivery speed. 
          Free shipping promotions will be explicitly stated at checkout when active.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">3. Order Tracking</h2>
        <p className="leading-relaxed">
          Once your order has been dispatched, you will receive an email and/or SMS confirmation containing your tracking details 
          so you can monitor your package in real time using track code on the website to check the status of your order.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">4. Delivery Issues & Address Changes</h2>
        <p className="leading-relaxed">
          If you need to update your delivery address or experience delays with your shipment, please contact our support team immediately at 
          <a href="mailto:75techstorelimited.ng@gmail.com" className="text-blue-600 underline"> 75techstorelimited.ng@gmail.com</a>.
        </p>
      </section>
    </div>
  );
};

export default DeliveryPolicy;