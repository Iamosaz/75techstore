import { Link } from "react-router-dom";
import SEO from "../components/SEO";

export default function NotFound() {
  return (
    <section className="min-h-[70vh] flex items-center justify-center px-6 py-24 bg-gray-950 text-center">
      <SEO
        title="Page Not Found"
        description="The page you are looking for does not exist or has moved."
        noindex
      />
      <div>
        <p className="text-yellow-400 font-bold tracking-widest text-sm mb-4">ERROR 404</p>
        <h1 className="text-4xl md:text-5xl font-black text-white mb-4">Page not found</h1>
        <p className="text-gray-300 mb-8 max-w-md mx-auto">
          The page you are looking for does not exist or has moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="px-8 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-950 font-bold rounded-xl"
          >
            Go to Homepage
          </Link>
          <Link
            to="/shop"
            className="px-8 py-3 bg-white text-gray-950 font-bold rounded-xl"
          >
            Browse the Shop
          </Link>
        </div>
      </div>
    </section>
  );
}