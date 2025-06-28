import React from "react";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-gradient-to-br from-red-600 to-red-900 pt-16 pb-8 px-6 md:px-8 lg:px-20 text-white">
      <div className="container mx-auto">
        <div className="flex flex-col lg:flex-row gap-10 mb-12">
          <div className="lg:max-w-2xl w-full">
            <div className="flex items-center mb-5">
              <Link to="/" className="flex items-center">
                <img
                  src="brandlogo.png"
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
                <i className="fas fa-phone mr-2"></i> +91 1234567890
              </p>
              <p>
                <i className="fas fa-map-marker-alt mr-2"></i> 221B, InkDesk
                Street, Stationery City, IN
              </p>
            </div>
          </div>
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
                  to="/shop"
                  className="text-white/80 hover:text-white text-sm transition-colors flex items-center"
                >
                  <i className="fas fa-chevron-right mr-2 text-xs text-white/70"></i>
                  All Products
                </Link>
              </li>
              <li>
                <Link
                  to="/shop?featured=true"
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
                  to="/blogs"
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
            </ul>
          </div>
          <div className="w-full">
            <h3 className="font-semibold mb-5 text-lg text-white">Products</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/shop/category/stationery/notebooks"
                  className="text-white/80 hover:text-white text-sm transition-colors flex items-center"
                >
                  <i className="fas fa-chevron-right mr-2 text-xs text-white/70"></i>
                  Notebooks
                </Link>
              </li>
              <li>
                <Link
                  to="/shop/category/stationery/journals"
                  className="text-white/80 hover:text-white text-sm transition-colors flex items-center"
                >
                  <i className="fas fa-chevron-right mr-2 text-xs text-white/70"></i>
                  Journals
                </Link>
              </li>
              <li>
                <Link
                  to="/shop/category/stationery/pens"
                  className="text-white/80 hover:text-white text-sm transition-colors flex items-center"
                >
                  <i className="fas fa-chevron-right mr-2 text-xs text-white/70"></i>
                  Pens & Markers
                </Link>
              </li>
              <li>
                <Link
                  to="/shop/category/office-supplies/organizers"
                  className="text-white/80 hover:text-white text-sm transition-colors flex items-center"
                >
                  <i className="fas fa-chevron-right mr-2 text-xs text-white/70"></i>
                  Desk Organizers
                </Link>
              </li>
              <li>
                <Link
                  to="/shop/category/office-supplies/calculators"
                  className="text-white/80 hover:text-white text-sm transition-colors flex items-center"
                >
                  <i className="fas fa-chevron-right mr-2 text-xs text-white/70"></i>
                  Calculators
                </Link>
              </li>
              <li>
                <Link
                  to="/shop/category/art-supplies/art-pencils"
                  className="text-white/80 hover:text-white text-sm transition-colors flex items-center"
                >
                  <i className="fas fa-chevron-right mr-2 text-xs text-white/70"></i>
                  Art Pencils
                </Link>
              </li>
              <li>
                <Link
                  to="/shop/category/office-supplies"
                  className="text-white/80 hover:text-white text-sm transition-colors flex items-center"
                >
                  <i className="fas fa-chevron-right mr-2 text-xs text-white/70"></i>
                  Office Supplies
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10 pt-6 text-center">
          <div className="text-sm text-white/80 mb-4">
            &copy; {new Date().getFullYear()} InkDesk. All rights reserved.
          </div>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            <Link
              to="#"
              className="text-xs text-white/70 hover:text-white transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              to="#"
              className="text-xs text-white/70 hover:text-white transition-colors"
            >
              Terms & Conditions
            </Link>
            <Link
              to="#"
              className="text-xs text-white/70 hover:text-white transition-colors"
            >
              Shipping Policy
            </Link>
            <Link
              to="#"
              className="text-xs text-white/70 hover:text-white transition-colors"
            >
              Returns & Refunds
            </Link>
            <Link
              to="#"
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
