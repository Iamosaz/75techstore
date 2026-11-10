
import { useMemo, useState } from "react";
import {
  FiChevronDown,
  FiSearch,
  FiMessageCircle,
  FiArrowUpRight,
  FiHelpCircle,
} from "react-icons/fi";

const faqs = [
  {
    category: "General",
    question: "What is 75TechStore Limited?",
    answer:
      "75TechStore Limited is a technology company providing quality gadgets, professional device repair services, and digital technology solutions. We help individuals and businesses access the right technology, products and services to meet their needs.",
  },
  {
    category: "General",
    question: "Where is 75TechStore located?",
    answer:
      "We are based in Nigeria and serve customers through our online platform. Contact our team for our current physical business address and other location details.",
  },
  {
    category: "Shopping",
    question: "What products can I purchase from 75TechStore?",
    answer:
      "We offer a range of technology products, including laptops, smartphones, tablets and accessories. Our catalogue features products from different brands, with availability depending on current stock.",
  },
  {
    category: "Shopping",
    question: "Are your products genuine?",
    answer:
      "We are committed to providing quality technology products and helping customers make informed purchasing decisions. Product specifications, condition, availability and applicable warranty information should be confirmed with our team before purchase.",
  },
  {
    category: "Shopping",
    question: "How can I place an order?",
    answer:
      "Browse our online shop, select your preferred product and follow the available ordering instructions. You can also contact our team through WhatsApp for product enquiries and assistance with placing an order.",
  },
  {
    category: "Shopping",
    question: "Do you offer delivery outside Lagos?",
    answer:
      "Contact us with your delivery location and the product you intend to purchase. Our team will confirm whether delivery is available, the applicable delivery fee and the estimated delivery timeframe.",
  },
  {
    category: "Shopping",
    question: "What payment methods do you accept?",
    answer:
      "Available payment options and payment instructions are confirmed during the ordering process. Please use only the official payment details provided by 75TechStore.",
  },
  {
    category: "Shopping",
    question: "Can I request a product that is not listed on your website?",
    answer:
      "Absolutely! If you cannot find a particular laptop, smartphone or accessory in our catalogue, contact us with the product name, model and specifications. Our team can check its availability and discuss possible options.",
  },
  {
    category: "Repairs",
    question: "What types of devices do you repair?",
    answer:
      "We provide device repair services for supported smartphones, laptops and other compatible gadgets. Contact us with your device brand, model and description of the problem so we can advise you on the available service.",
  },
  {
    category: "Repairs",
    question: "How do I request a device repair?",
    answer:
      "Visit the Repairs section of our website and complete the repair request form. Provide your name, device type, issue, location and contact information. Our team will review your request and get in touch with you.",
  },
  {
    category: "Repairs",
    question: "How much does a device repair cost?",
    answer:
      "Repair costs depend on the device, the nature of the fault, replacement parts and the complexity of the repair. Submit a repair request so our team can assess your requirements and provide further information.",
  },
  {
    category: "Repairs",
    question: "How long does a repair take?",
    answer:
      "Repair duration depends on the device, the fault, availability of replacement parts and the work required. Our team will communicate an estimated timeframe after assessing your device.",
  },
  {
    category: "Digital Services",
    question: "What digital services does 75TechStore offer?",
    answer:
      "Our digital services include website design and development, e-commerce website development, custom web solutions and other technology-related services. Contact us to discuss your business requirements and project ideas.",
  },
  {
    category: "Digital Services",
    question: "Can 75TechStore build a website for my business?",
    answer:
      "Yes! We work on business websites, e-commerce stores, portfolio websites and custom web solutions. We can discuss your goals, preferred features and project requirements before recommending a suitable solution.",
  },
  {
    category: "Digital Services",
    question: "How do I get a quotation for a digital project?",
    answer:
      "Contact our team with a description of your project, the features you need and your expected timeline. We will review your requirements and discuss the appropriate scope and pricing.",
  },
  {
    category: "Orders & Support",
    question: "Can I cancel or return an order?",
    answer:
      "Returns, exchanges and order cancellation requests are subject to the applicable 75TechStore terms and conditions and the circumstances of the purchase. Please contact our team with your order details before making arrangements.",
  },
  {
    category: "Orders & Support",
    question: "How can I contact customer support?",
    answer:
      "You can contact 75TechStore through our website or WhatsApp. Our team can assist with product enquiries, orders, repair requests and digital service enquiries.",
  },
];

const categories = [
  "All",
  "General",
  "Shopping",
  "Repairs",
  "Digital Services",
  "Orders & Support",
];

const WHATSAPP_NUMBER = "2347035620709";

export default function FAQ() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [openIndex, setOpenIndex] = useState(0);
  const [search, setSearch] = useState("");

  const filteredFaqs = useMemo(() => {
    return faqs.filter((faq) => {
      const matchesCategory =
        activeCategory === "All" || faq.category === activeCategory;

      const searchText = search.toLowerCase();

      const matchesSearch =
        faq.question.toLowerCase().includes(searchText) ||
        faq.answer.toLowerCase().includes(searchText);

      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, search]);

  const handleCategoryChange = (category) => {
    setActiveCategory(category);
    setOpenIndex(0);
  };

  return (
    <section
      id="faq"
      className="relative overflow-hidden bg-white py-20 md:py-28"
    >
      {/* Background decoration */}
      <div className="pointer-events-none absolute -right-32 top-20 h-80 w-80 rounded-full bg-blue-100/50 blur-3xl" />
      <div className="pointer-events-none absolute -left-32 bottom-10 h-80 w-80 rounded-full bg-indigo-100/40 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">

        {/* Heading */}
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
            <FiHelpCircle />
            Frequently Asked Questions
          </span>

          <h2 className="text-3xl font-bold tracking-tight text-gray-950 sm:text-4xl md:text-5xl">
            Got Questions?
            <span className="block text-blue-600">
              We've Got Answers.
            </span>
          </h2>

          <p className="mt-5 text-base leading-7 text-gray-500 md:text-lg">
            Everything you need to know about shopping with 75TechStore,
            our repair services and digital solutions.
          </p>
        </div>

        {/* Search */}
        <div className="mx-auto mb-8 max-w-xl">
          <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-4 shadow-sm transition focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-50">
            <FiSearch className="shrink-0 text-xl text-gray-400" />

            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setOpenIndex(0);
              }}
              placeholder="Search for a question..."
              className="w-full bg-transparent text-sm text-gray-800 outline-none placeholder:text-gray-400"
            />

            {search && (
              <button
                onClick={() => setSearch("")}
                className="text-sm font-medium text-blue-600"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Category filters */}
        <div className="mb-10 flex flex-wrap justify-center gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryChange(category)}
              className={`rounded-full px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
                activeCategory === category
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                  : "border border-gray-200 bg-white text-gray-600 hover:border-blue-300 hover:text-blue-600"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Accordion */}
        <div className="mx-auto max-w-3xl space-y-3">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq, index) => {
              const isOpen = openIndex === index;

              return (
                <div
                  key={`${faq.category}-${faq.question}`}
                  className={`overflow-hidden rounded-2xl border transition-all duration-300 ${
                    isOpen
                      ? "border-blue-200 bg-blue-50/40 shadow-sm"
                      : "border-gray-200 bg-white hover:border-blue-200"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() =>
                      setOpenIndex(isOpen ? -1 : index)
                    }
                    aria-expanded={isOpen}
                    className="flex w-full items-center justify-between gap-5 px-5 py-5 text-left sm:px-7"
                  >
                    <div className="flex items-start gap-3">
                      <span
                        className={`mt-0.5 text-sm font-bold ${
                          isOpen ? "text-blue-600" : "text-gray-300"
                        }`}
                      >
                        {String(index + 1).padStart(2, "0")}
                      </span>

                      <span
                        className={`text-sm font-semibold leading-6 sm:text-base ${
                          isOpen ? "text-blue-700" : "text-gray-800"
                        }`}
                      >
                        {faq.question}
                      </span>
                    </div>

                    <span
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-all duration-300 ${
                        isOpen
                          ? "rotate-180 bg-blue-600 text-white"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      <FiChevronDown size={19} />
                    </span>
                  </button>

                  <div
                    className={`grid transition-all duration-300 ease-in-out ${
                      isOpen
                        ? "grid-rows-[1fr] opacity-100"
                        : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <div className="border-t border-blue-100 px-5 pb-6 pt-4 sm:px-7">
                        <p className="pl-7 text-sm leading-7 text-gray-600 sm:text-base">
                          {faq.answer}
                        </p>

                        <span className="ml-7 mt-4 inline-block rounded-full bg-blue-100/70 px-3 py-1 text-xs font-medium text-blue-700">
                          {faq.category}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="rounded-2xl border border-dashed border-gray-300 py-12 text-center">
              <FiSearch className="mx-auto mb-3 text-3xl text-gray-300" />

              <h3 className="font-semibold text-gray-800">
                No matching questions found
              </h3>

              <p className="mt-2 text-sm text-gray-500">
                Try another keyword or contact our support team.
              </p>

              <button
                onClick={() => {
                  setSearch("");
                  setActiveCategory("All");
                }}
                className="mt-4 text-sm font-semibold text-blue-600"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>

        {/* Contact CTA */}
        <div className="mx-auto mt-14 max-w-3xl overflow-hidden rounded-3xl bg-gray-950 px-6 py-10 text-center sm:px-10">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-2xl text-white">
            <FiMessageCircle />
          </div>

          <h3 className="text-2xl font-bold text-white sm:text-3xl">
            Still have questions?
          </h3>

          <p className="mx-auto mt-3 max-w-lg text-sm leading-7 text-gray-400 sm:text-base">
            Our team is ready to help you find the right gadget,
            request a repair or get started with your next digital project.
          </p>

          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
              "Hello 75TechStore, I have an enquiry."
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-7 inline-flex items-center gap-3 rounded-xl bg-blue-600 px-7 py-4 text-sm font-semibold text-white transition hover:bg-blue-500"
          >
            Chat With Our Team
            <FiArrowUpRight size={18} />
          </a>
        </div>

      </div>
    </section>
  );
}
