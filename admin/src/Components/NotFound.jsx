import React from "react";
import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center bg-background text-text p-6">
      <div className="max-w-lg w-full text-center">
        {/* 404 Title */}
        <h1 className="text-9xl font-bold text-primary">
          <span className="text-primary">4</span>
          <span className="text-accent">0</span>
          <span className="text-primary">4</span>
        </h1>

        {/* Error message */}
        <h2 className="text-3xl md:text-4xl font-bold mt-8 mb-4">
          Oops! Page not found
        </h2>

        <p className="text-lg mb-8 text-text/80">
          We couldn't find the page you're looking for. It might have been
          removed, renamed, or maybe it never existed.
        </p>

        {/* Illustration */}
        <div className="my-8">
          <svg
            className="mx-auto h-40 w-40 text-accent/70"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M3.27489 15.2957C2.42496 14.1915 2 13.6394 2 12C2 10.3606 2.42496 9.80853 3.27489 8.70433C4.97196 6.49956 7.81811 4 12 4C16.1819 4 19.028 6.49956 20.7251 8.70433C21.575 9.80853 22 10.3606 22 12C22 13.6394 21.575 14.1915 20.7251 15.2957C19.028 17.5004 16.1819 20 12 20C7.81811 20 4.97196 17.5004 3.27489 15.2957Z"
              stroke="currentColor"
              strokeWidth="2"
            />
            <path
              d="M15 12C15 13.6569 13.6569 15 12 15C10.3431 15 9 13.6569 9 12C9 10.3431 10.3431 9 12 9C13.6569 9 15 10.3431 15 12Z"
              stroke="currentColor"
              strokeWidth="2"
            />
            <path
              d="M2 12H4"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M20 12H22"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M12 4V2"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M12 22V20"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </div>

        {/* Action buttons */}
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
