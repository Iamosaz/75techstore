import React from 'react'
import { Link } from "react-router-dom";

// the 75techstore services card mapping 

const promos = [
  {
    title: "Become a Member & Earn 5% Back",
    desc: "Join 75TechStore+ and enjoy exclusive cashback on every purchase, plus free consultations on all tech needs.",
    img: "/assets/services/member.png",
    link: "/membership",
    bg: "bg-gradient-to-r from-blue-50 to-white",
  },
  {
    title: "Repair Support Anytime",
    desc: "Get instant access to certified technicians who fix your gadgets quickly and affordably.",
    img: "/assets/services/repair.png",
    link: "/repairs",
    bg: "bg-gradient-to-r from-gray-50 to-white",
  },
  {
    title: "Cashback Rewards",
    desc: "Earn up to 5% cashback every time you shop or use our digital services — save while you grow.",
    img: "/assets/services/cashback.png",
    link: "/rewards",
    bg: "bg-gradient-to-r from-yellow-50 to-white",
  },
  {
    title: "Digital Boost for Startups",
    desc: "We help startups scale with top-notch website, mobile app, and digital strategy solutions.",
    img: "/assets/services/boost.png",
    link: "/digital-services",
    bg: "bg-gradient-to-r from-blue-50 via-sky-100 to-white",
  },
];


const OurMembers = () => {
  return (
      <section className="max-w-7xl mx-auto py-20 px-6">
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {promos.map((promo, i) => (
          <div
            key={i}
            className={`${promo.bg} rounded-2xl shadow-md hover:shadow-lg transition p-5 flex flex-col justify-between text-center`}
          >
            <img
              src={promo.img}
              alt={promo.title}
              className="w-full h-40 object-contain mx-auto mb-4"
            />
            <h3 className="text-lg font-bold text-gray-800 mb-2">{promo.title}</h3>
            <p className="text-gray-600 text-sm mb-4">{promo.desc}</p>
            <Link
              to={promo.link}
              className="text-brand-blue font-semibold hover:underline"
            >
              Learn More →
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
};

export default OurMembers ;
