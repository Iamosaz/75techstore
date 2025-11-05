import React from "react";
import { FaGlobe, FaMobileAlt, FaPaintBrush, FaLightbulb } from "react-icons/fa";
import { Link } from "react-router-dom";
import DS1 from "../../assets/services/DS6.png";
import DS2 from "../../assets/services/DS5.png";
import DS3 from "../../assets/services/DS2.png";
import DS4 from "../../assets/services/DS4.png";

// digital service preview
     const services = [
    {
      icon: <FaGlobe size={32} />,
      title: "Website Development",
      desc: "We create responsive, SEO friendly websites that elevate your online presence and drive conversions.",
      imgUrl:DS1
    },
    {
      icon: <FaMobileAlt size={32} />,
      title: "Mobile App Development",
      desc: "High-performance Android and iOS apps built for speed, usability, and seamless customer engagement.",
      imgUrl:DS2
    },
    {
      icon: <FaPaintBrush size={32} />,
      title: "UI/UX Design",
      desc: "We craft stunning, user-centered interfaces that keep your customers coming back.",
      imgUrl: DS3
    },
    {
       icon: <FaLightbulb size={32} />,
       title: "Tech Consultation",
       desc: "Expert guidance to help startups and businesses align technology with their long-term goals.",
       imgUrl: DS4
    },
  ];

const DigitalServicePreview = () => {
  return (
    <section className="max-w-6xl mx-auto py-20 px-6">
         {/* Header */}
      <div className="text-center mb-16">
         <h2 className="text-2xl font-bold text-brand-blue mb-4">
            <span className="text-brand-blue text-3xl">7</span>
            <span className="text-brand-red text-3xl">5</span>
            <span className="text-3xl bg-gradient-to-r from-[#010e1b] via-brand-blue to-[#d77a33] bg-clip-text text-transparent">
              TechStore Digital Services For Startups & Buisnesses
            </span>
            
      </h2>
      <p className="text-gray-600 max-w-3xl mx-auto">
        We help startups and businesses bring their ideas to life , from fully responsive websites
        to mobile apps, UI/UX design and technical consultation, 75Techstore provides digital solutions that help your buisness grow faster.
      </p>
      </div>

      {/* Services Block */}
     <div className="space-y-16">
        {services.map((svc, idx) => (
          <div
            key={idx}
            className={`flex flex-col md:flex-row items-center gap-8 ${
              idx % 2 === 1 ? "md:flex-row-reverse" : ""
            }`}
          >
            {/* Image */}
            <img
              src={svc.imgUrl}
              alt={svc.title}
              className="w-full md:w-1/2 rounded-xl shadow-md object-cover h-64"
            />

            {/* Text */}
            <div className="flex-1 text-center md:text-left">
              <div className="text-brand-blue mb-2 flex justify-center md:justify-start">
                {svc.icon}
              </div>
              <h3 className="text-2xl font-semibold mb-3">{svc.title}</h3>
              <p className="text-gray-600 mb-4">{svc.desc}</p>
              <Link
                to="/digital-services"
                className="text-brand-blue font-semibold hover:underline"
              >
                Learn more →
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* ───────────── CTA ───────────── */}
      <div className="text-center mt-20">
        <Link
          to="/digital-services"
          className="inline-block bg-brand-blue text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-brand-dark transition"
        >
          Explore All Services & Request a Quote
        </Link>
      </div>
    </section>
  );
};

export default DigitalServicePreview
