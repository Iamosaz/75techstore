import React from 'react';

const RefundPolicy = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 text-gray-800">
      <h1 className="text-3xl font-bold mb-6 text-primary">Refund and Returns Policy</h1>
      <p className="text-sm text-gray-500 mb-6">Last Updated: November 2026</p>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">1. Return Period</h2>
        <p className="leading-relaxed">
          We want you to be completely satisfied with your purchase from <strong>75Techstore Limited</strong>. 
          If you are not satisfied, you may request a return within <strong>7 days</strong> from the date you received your item.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">2. Conditions for Returns</h2>
        <p className="leading-relaxed">To be eligible for a return, your item must meet the following conditions:</p>
        <ul className="list-disc ml-6 mt-2 space-y-1">
          <li>Item must be unused, unwashed, and in the same condition as received.</li>
          <li>Must be in original packaging with all security seals, tags, accessories, and manuals intact.</li>
          <li>Proof of purchase (order receipt or invoice number) must be provided.</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">3. Defective or Damaged Products</h2>
        <p className="leading-relaxed">
          If your gadget or item arrives damaged, defective, or incorrect, please notify our customer support team 
          within <strong>48 hours of delivery</strong> at <a href="mailto:75techstorelimited.ng@gmail.com" className="text-blue-600 underline">75techstorelimited.ng@gmail.com</a> with photographs or video evidence. 
          We will arrange a replacement or full refund at no additional cost to you.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">4. Refund Processing Time</h2>
        <p className="leading-relaxed">
          Once your returned item is received and inspected, we will notify you of the approval or rejection of your refund. 
          If approved, your refund will be processed back to your original payment method (or bank account) within 
          <strong> 3 to 5 business days</strong>.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">5. Contact Us</h2>
        <p className="leading-relaxed">
          For return requests or policy inquiries, reach out to us at:
          <br />
          <strong>Email:</strong> 75techstorelimited.ng@gmail.com
          <br />
          <strong>Phone:</strong> Available on our Contact Us page.
        </p>
      </section>
    </div>
  );
};

export default RefundPolicy;