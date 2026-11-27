
import React, { useRef } from "react";
import {
  FaStar,
  FaGoogle,
  FaArrowLeft,
  FaArrowRight,
  FaExternalLinkAlt,
  FaQuoteLeft,
} from "react-icons/fa";

const GOOGLE_REVIEW_URL = "https://g.page/r/CVSFvxxGhiyUEAE/review";

const reviews = [
  {
    id: 1,
    name: "Oghenetega Sukuru",
    date: "6 days ago",
    text: "I had a great experience with 75Techstore Limited. Their team demonstrates strong technical expertise and a professional approach to delivering technology solutions. They offer a wide range of services, including website development, mobile app development, IT support, and gadget-related services, making them a convenient one-stop technology partner.",
  },
  {
    id: 2,
    name: "ifeanyi chuks",
    date: "a year ago",
    text: "Got my current phone from them.. And everything is working well",
  },
  {
    id: 3,
    name: "Marvelous Popoola",
    date: "a year ago",
    text: "I got the best of gadgets from their store",
  },
  {
    id: 4,
    name: "Jerry Sunday",
    date: "3 weeks ago",
    text: "Reliable and efficient",
  },
  {
    id: 5,
    name: "akong david",
    date: "a year ago",
    text: "",
  },
  {
    id: 6,
    name: "Godwin Onubeji",
    date: "a year ago",
    text: "",
  },
  {
    id: 7,
    name: "Osazuwa Ikhinmwin",
    date: "a year ago",
    text: "",
    ownerReply: "Thank you",
  },
];

const StarRating = () => (
  <div
    className="flex items-center gap-1 text-amber-400"
    aria-label="5 out of 5 stars"
  >
    {[1, 2, 3, 4, 5].map((star) => (
      <FaStar key={star} size={14} />
    ))}
  </div>
);

const GoogleReviews = () => {
  const sliderRef = useRef(null);

  const scrollReviews = (direction) => {
    if (!sliderRef.current) return;

    const card = sliderRef.current.querySelector(".review-card");
    const distance = card ? card.offsetWidth + 24 : 350;

    sliderRef.current.scrollBy({
      left: direction * distance,
      behavior: "smooth",
    });
  };

  return (
    <section
      id="customer-reviews"
      className="relative overflow-hidden bg-slate-50 py-16 sm:py-20 lg:py-24"
    >
      {/* Decorative background */}
      <div className="pointer-events-none absolute -left-24 top-20 h-64 w-64 rounded-full bg-blue-100/60 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-indigo-100/60 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section heading */}
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white px-4 py-2 text-sm font-semibold text-blue-700 shadow-sm">
            <FaGoogle className="text-base" />
            CUSTOMER FEEDBACK
          </div>

          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
            Trusted by our{" "}
            <span className="text-blue-600">customers</span>
          </h2>

          <p className="mt-4 text-base leading-7 text-slate-600 sm:text-lg">
            Real experiences from people who have chosen 75TechStore for
            their technology needs.
          </p>
        </div>

        {/* Rating summary */}
        <div className="mx-auto mb-10 grid max-w-3xl grid-cols-1 gap-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:grid-cols-3 sm:items-center sm:p-8">
          <div className="text-center sm:border-r sm:border-slate-200">
            <div className="text-5xl font-extrabold tracking-tight text-slate-900">
              5.0
            </div>
            <div className="mt-2 flex justify-center">
              <StarRating />
            </div>
            <p className="mt-2 text-sm text-slate-500">Google rating</p>
          </div>

          <div className="text-center sm:border-r sm:border-slate-200">
            <div className="text-4xl font-bold text-slate-900">7</div>
            <p className="mt-2 text-sm text-slate-500">
              Customer reviews
            </p>
          </div>

          <div className="flex flex-col items-center justify-center gap-2">
            <FaGoogle className="text-3xl text-blue-600" />
            <span className="text-sm font-semibold text-slate-700">
              Reviews on Google
            </span>
            <a
              href={GOOGLE_REVIEW_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-semibold text-blue-600 transition hover:text-blue-800"
            >
              View Google profile
              <FaExternalLinkAlt className="ml-2 inline text-xs" />
            </a>
          </div>
        </div>

        {/* Carousel heading and controls */}
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold text-slate-900 sm:text-2xl">
              What customers are saying
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              Browse customer experiences
            </p>
          </div>

          <div className="flex shrink-0 gap-2">
            <button
              type="button"
              onClick={() => scrollReviews(-1)}
              aria-label="Previous reviews"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-blue-600 hover:bg-blue-600 hover:text-white"
            >
              <FaArrowLeft size={14} />
            </button>

            <button
              type="button"
              onClick={() => scrollReviews(1)}
              aria-label="Next reviews"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-blue-600 hover:bg-blue-600 hover:text-white"
            >
              <FaArrowRight size={14} />
            </button>
          </div>
        </div>

        {/* Review cards */}
        <div
          ref={sliderRef}
          className="flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth pb-5"
          style={{ scrollbarWidth: "none" }}
        >
          {reviews.map((review) => (
            <article
              key={review.id}
              className="review-card w-[88%] shrink-0 snap-start rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl sm:w-[48%] lg:w-[calc(33.333%-16px)]"
            >
              <div className="mb-5 flex items-start justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                  <FaQuoteLeft size={17} />
                </div>
                <FaGoogle className="text-xl text-slate-300" />
              </div>

              <StarRating />

              <p className="mt-5 min-h-[110px] text-sm leading-7 text-slate-600">
                {review.text ||
                  "This customer left a 5-star rating for 75TechStore without a written comment."}
              </p>

              {review.ownerReply && (
                <div className="mt-4 rounded-lg bg-blue-50 p-3">
                  <p className="text-xs font-bold text-slate-800">
                    Response from the owner
                  </p>
                  <p className="mt-1 text-sm text-slate-600">
                    {review.ownerReply}
                  </p>
                </div>
              )}

              <div className="mt-6 border-t border-slate-100 pt-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <h4 className="truncate text-sm font-bold text-slate-900">
                      {review.name}
                    </h4>
                    <p className="mt-1 text-xs text-slate-500">
                      {review.date}
                    </p>
                  </div>
                  <span className="shrink-0 rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                    Google review
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>

        <p className="mt-2 text-center text-xs text-slate-400">
          Scroll horizontally or use the arrows to see more reviews.
        </p>

        {/* Bottom call to action */}
        <div className="mt-12 rounded-2xl bg-slate-900 px-6 py-9 text-center shadow-xl sm:px-10 sm:py-11">
          <h3 className="text-2xl font-bold text-white sm:text-3xl">
            Have you experienced 75TechStore?
          </h3>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-300 sm:text-base">
            Your feedback helps us improve and helps other customers make
            confident decisions.
          </p>

          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <a
              href={GOOGLE_REVIEW_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg transition hover:bg-blue-700"
            >
              <FaGoogle />
              Write a Google Review
              <FaExternalLinkAlt className="text-xs" />
            </a>

            <a
              href={GOOGLE_REVIEW_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-600 px-6 py-3.5 text-sm font-bold text-white transition hover:border-white hover:bg-white/10"
            >
              Read All Google Reviews
              <FaExternalLinkAlt className="text-xs" />
            </a>
          </div>
        </div>

        <p className="mt-5 text-center text-xs text-slate-400">
          Review content is displayed from customer feedback supplied for
          75TechStore. Visit Google for the original reviews and latest updates.
        </p>
      </div>
    </section>
  );
};

export default GoogleReviews;
