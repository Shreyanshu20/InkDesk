import React from "react";
import { Link } from "react-router-dom";

function GetInTouch() {
  return (
    <section
      className="py-16 md:py-20 bg-gradient-to-r from-primary to-accent text-white relative overflow-hidden"
      aria-labelledby="contact-section-heading"
    >
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <i
          className="fas fa-envelope text-9xl absolute top-10 left-10 transform -rotate-12"
          aria-hidden="true"
        ></i>
        <i
          className="fas fa-paper-plane text-8xl absolute bottom-10 right-10"
          aria-hidden="true"
        ></i>
        <i
          className="fas fa-comments text-7xl absolute top-1/2 left-1/4"
          aria-hidden="true"
        ></i>
      </div>

      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h2
            id="contact-section-heading"
            className="text-3xl md:text-4xl font-bold mb-6"
          >
            <i
              className="fas fa-envelope-open-text mr-3"
              aria-hidden="true"
            ></i>
            We'd Love to Hear From You
          </h2>

          <p className="text-white/90 mb-8 text-lg leading-relaxed">
            Have questions about our products, need assistance with an order, or
            just want to say hello? Our team is here to help you every step of
            the way.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contact"
              className="inline-flex items-center justify-center bg-white text-primary hover:bg-gray-100 px-6 md:px-8 py-3 md:py-4 rounded-full font-medium transition-all duration-300 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary"
            >
              <i
                className="fas fa-paper-plane mr-2"
                aria-hidden="true"
              ></i>
              Get in Touch
            </Link>

            <Link
              to="/faq"
              className="inline-flex items-center justify-center bg-white/20 hover:bg-white/30 text-white px-6 md:px-8 py-3 md:py-4 rounded-full font-medium transition-all duration-300 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-primary"
            >
              <i
                className="fas fa-question-circle mr-2"
                aria-hidden="true"
              ></i>
              View FAQs
            </Link>
          </div>

          {/* Contact info cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-12">
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg hover:bg-white/20 transition-colors">
              <i
                className="fas fa-envelope text-2xl mb-2"
                aria-hidden="true"
              ></i>
              <h3 className="font-medium mb-1">Email Us</h3>
              <a
                href="mailto:support@inkdesk.com"
                className="text-white/90 hover:text-white underline"
              >
                support@inkdesk.com
              </a>
            </div>

            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg hover:bg-white/20 transition-colors">
              <i
                className="fas fa-phone text-2xl mb-2"
                aria-hidden="true"
              ></i>
              <h3 className="font-medium mb-1">Call Us</h3>
              <a
                href="tel:+919876543210"
                className="text-white/90 hover:text-white underline"
              >
                +91 98765 43210
              </a>
            </div>

            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg hover:bg-white/20 transition-colors">
              <i
                className="fas fa-map-marker-alt text-2xl mb-2"
                aria-hidden="true"
              ></i>
              <h3 className="font-medium mb-1">Visit Us</h3>
              <p className="text-white/90">Mon-Fri: 9AM - 6PM</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default GetInTouch;
