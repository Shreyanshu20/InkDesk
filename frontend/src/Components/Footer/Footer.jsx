import React from "react";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-gradient-to-br from-red-600 to-red-900 pt-16 pb-8 px-6 md:px-8 lg:px-20 text-white">
      <div className="container mx-auto">
        {/* Main footer content - Three columns */}
        <div className="flex flex-col lg:flex-row gap-10 mb-12">
          {/* Company Info */}
          <div className="lg:max-w-2xl w-full">
            <div className="flex items-center mb-5">
              <Link to="/" className="flex items-center">
                <img
                  src="/src/assets/brandlogo.png"
                  alt="InkDesk Logo"
                  className="h-10 w-auto object-contain brightness-110"
                />
              </Link>
            </div>
            <p className="text-sm mb-6 mr-15 text-white/90">
              Premium stationery for professionals and enthusiasts. Quality
              products that inspire creativity and boost productivity.
            </p>
            <div className="flex space-x-4 mb-6">
              <Link
                to="#"
                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors text-white"
                aria-label="Facebook"
              >
                <i className="fab fa-facebook-f"></i>
              </Link>
              <Link
                to="#"
                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors text-white"
                aria-label="Twitter"
              >
                <i className="fab fa-twitter"></i>
              </Link>
              <Link
                to="#"
                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors text-white"
                aria-label="Instagram"
              >
                <i className="fab fa-instagram"></i>
              </Link>
              <Link
                to="#"
                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors text-white"
                aria-label="LinkedIn"
              >
                <i className="fab fa-linkedin-in"></i>
              </Link>
            </div>
            <div className="text-white/80 text-sm">
              <p className="mb-2">
                <i className="fas fa-envelope mr-2"></i> support@inkdesk.com
              </p>
              <p className="mb-2">
                <i className="fas fa-phone mr-2"></i> +1 (555) 123-4567
              </p>
              <p>
                <i className="fas fa-map-marker-alt mr-2"></i> 123 Stationery
                St, Pen City, PC 12345
              </p>
            </div>
          </div>
          {/* Quick Links */}
          <div className="w-full">
            <h3 className="font-semibold mb-5 text-lg text-white">
              Quick Links
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/"
                  className="text-white/80 hover:text-white text-sm transition-colors flex items-center"
                >
                  <i className="fas fa-chevron-right mr-2 text-xs text-white/70"></i>
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/products"
                  className="text-white/80 hover:text-white text-sm transition-colors flex items-center"
                >
                  <i className="fas fa-chevron-right mr-2 text-xs text-white/70"></i>
                  All Products
                </Link>
              </li>
              <li>
                <Link
                  to="/featured"
                  className="text-white/80 hover:text-white text-sm transition-colors flex items-center"
                >
                  <i className="fas fa-chevron-right mr-2 text-xs text-white/70"></i>
                  Featured Items
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="text-white/80 hover:text-white text-sm transition-colors flex items-center"
                >
                  <i className="fas fa-chevron-right mr-2 text-xs text-white/70"></i>
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/blog"
                  className="text-white/80 hover:text-white text-sm transition-colors flex items-center"
                >
                  <i className="fas fa-chevron-right mr-2 text-xs text-white/70"></i>
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-white/80 hover:text-white text-sm transition-colors flex items-center"
                >
                  <i className="fas fa-chevron-right mr-2 text-xs text-white/70"></i>
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  to="/faq"
                  className="text-white/80 hover:text-white text-sm transition-colors flex items-center"
                >
                  <i className="fas fa-chevron-right mr-2 text-xs text-white/70"></i>
                  FAQ
                </Link>
              </li>
            </ul>
          </div>
          {/* Products */}
          <div className="w-full">
            <h3 className="font-semibold mb-5 text-lg text-white">Products</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/products/notebooks"
                  className="text-white/80 hover:text-white text-sm transition-colors flex items-center"
                >
                  <i className="fas fa-chevron-right mr-2 text-xs text-white/70"></i>
                  Notebooks & Journals
                </Link>
              </li>
              <li>
                <Link
                  to="/products/pens"
                  className="text-white/80 hover:text-white text-sm transition-colors flex items-center"
                >
                  <i className="fas fa-chevron-right mr-2 text-xs text-white/70"></i>
                  Pens & Markers
                </Link>
              </li>
              <li>
                <Link
                  to="/products/organizers"
                  className="text-white/80 hover:text-white text-sm transition-colors flex items-center"
                >
                  <i className="fas fa-chevron-right mr-2 text-xs text-white/70"></i>
                  Desk Organizers
                </Link>
              </li>
              <li>
                <Link
                  to="/products/planners"
                  className="text-white/80 hover:text-white text-sm transition-colors flex items-center"
                >
                  <i className="fas fa-chevron-right mr-2 text-xs text-white/70"></i>
                  Planners & Calendars
                </Link>
              </li>
              <li>
                <Link
                  to="/products/accessories"
                  className="text-white/80 hover:text-white text-sm transition-colors flex items-center"
                >
                  <i className="fas fa-chevron-right mr-2 text-xs text-white/70"></i>
                  Desk Accessories
                </Link>
              </li>
              <li>
                <Link
                  to="/products/office"
                  className="text-white/80 hover:text-white text-sm transition-colors flex items-center"
                >
                  <i className="fas fa-chevron-right mr-2 text-xs text-white/70"></i>
                  Office Supplies
                </Link>
              </li>
              <li>
                <Link
                  to="/products/gifts"
                  className="text-white/80 hover:text-white text-sm transition-colors flex items-center"
                >
                  <i className="fas fa-chevron-right mr-2 text-xs text-white/70"></i>
                  Gift Sets
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright section */}
        <div className="border-t border-white/10 pt-6 text-center">
          <div className="text-sm text-white/80 mb-4">
            &copy; {new Date().getFullYear()} InkDesk. All rights reserved.
          </div>

          {/* Policy Links */}
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            <Link
              to="/privacy"
              className="text-xs text-white/70 hover:text-white transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              to="/terms"
              className="text-xs text-white/70 hover:text-white transition-colors"
            >
              Terms & Conditions
            </Link>
            <Link
              to="/shipping"
              className="text-xs text-white/70 hover:text-white transition-colors"
            >
              Shipping Policy
            </Link>
            <Link
              to="/returns"
              className="text-xs text-white/70 hover:text-white transition-colors"
            >
              Returns & Refunds
            </Link>
            <Link
              to="/accessibility"
              className="text-xs text-white/70 hover:text-white transition-colors"
            >
              Accessibility
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
