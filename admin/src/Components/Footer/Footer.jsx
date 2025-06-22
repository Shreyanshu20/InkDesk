import React from "react";

function Footer() {
  return (
    <footer className="py-4 px-6 border-t border-gray-200 dark:border-gray-700 bg-background">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <div className="text-center md:text-left mb-4 md:mb-0">
          <p className="text-sm text-text">
            &copy; {new Date().getFullYear()} InkDesk. All rights reserved.
          </p>
        </div>

        <div className="flex items-center space-x-4">
          <a
            href="#"
            className="text-xs text-text hover:text-primary transition-all duration-300"
          >
            Terms of Service
          </a>
          <a
            href="#"
            className="text-xs text-text hover:text-primary transition-all duration-300"
          >
            Privacy Policy
          </a>
          <a
            href="#"
            className="text-xs text-text hover:text-primary transition-all duration-300"
          >
            Help Center
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
