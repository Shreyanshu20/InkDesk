import React from "react";
import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center bg-background text-text p-6">
      <div className="max-w-lg w-full text-center">
        <h1 className="text-9xl font-bold text-primary">
          <span className="text-primary">4</span>
          <span className="text-accent">0</span>
          <span className="text-primary">4</span>
        </h1>
        <h2 className="text-3xl md:text-4xl font-bold mt-8 mb-4">
          Oops! Page not found
        </h2>
        <p className="text-lg mb-8 text-text/80">
          We couldn't find the page you're looking for. It might have been
          removed, renamed, or maybe it never existed.
        </p>
        <div className="my-8">
          <i className="fas fa-eye-slash text-accent/70 text-8xl"></i>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="btn bg-primary hover:bg-primary/90 text-white font-medium px-6 py-3 rounded-full transition-all duration-300"
          >
            Back to Home
          </Link>
          <button
            onClick={() => window.history.back()}
            className="btn btn-outline border-primary/30 hover:bg-primary/10 text-primary font-medium px-6 py-3 rounded-full transition-all duration-300"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}

export default NotFound;