import React, { useState, useRef, useEffect, useContext } from "react";
import { Link, NavLink } from "react-router-dom";
import { useCategories } from "../../Context/CategoryContext.jsx";
import { useTheme } from "../../Context/ThemeContext.jsx";
import { useCart } from "../../Context/CartContext.jsx"; // ADD ONLY THIS LINE
import { useWishlist } from "../../Context/WishlistContext.jsx"; // ADD ONLY THIS LINE
import { AppContent } from "../../Context/AppContent.jsx"; // ADD ONLY THIS LINE
import { toast } from "react-toastify"; // ADD ONLY THIS LINE
import VoiceSearch from '../Common/VoiceSearch';
import { useVoiceSearch } from '../../hooks/useVoiceSearch';

function NavbarBottom() {
  // Get categories from context
  const { categories, loading } = useCategories();

  // Get theme context
  const { theme, themeToggle } = useTheme();
  const { getCartItemCount } = useCart(); // ADD ONLY THIS LINE
  const { getWishlistItemCount } = useWishlist(); // ADD ONLY THIS LINE
  const { isLoggedIn } = useContext(AppContent); // ADD ONLY THIS LINE
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedMobileCategories, setExpandedMobileCategories] = useState([]);
  const mobileMenuRef = useRef(null);

  const [searchText, setSearchText] = useState("");
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const { processVoiceCommand } = useVoiceSearch();

  // Handle search bar expansion
  const handleSearchExpand = () => {
    setIsSearchExpanded(!isSearchExpanded);
    if (!isSearchExpanded) {
      setTimeout(() => {
        document.getElementById("search-input")?.focus();
      }, 0);
    }
  };

  // Handle theme toggle function
  const handleThemeToggle = () => {
    themeToggle();
  };

  // Close mobile menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target)
      ) {
        setMobileMenuOpen(false);
      }
    }

    if (mobileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [mobileMenuOpen]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [mobileMenuOpen]);

  // Create dynamic menu items
  const generateMenuItems = () => {
    // Define the desired order of categories
    const categoryOrder = [
      "Stationery",
      "Office Supplies", 
      "Art Supplies",
      "Craft Materials",
    ];

    // Sort categories according to the desired order
    const sortedCategories = categoryOrder
      .map((categoryName) => categories.find((cat) => cat.category_name === categoryName))
      .filter(Boolean); // Remove any undefined categories

    const items = [
      {
        name: "Home",
        link: "/",
      },
      {
        name: "Shop",
        link: "/shop",
        hasDropdown: true,
        categories: [
          // ADD THIS: Browse All section as first category
          {
            title: "Browse All",
            items: [
              { name: "All Products", link: "/shop" },
              { name: "New Arrivals", link: "/shop?sort=newest-desc" },
              { name: "Best Sellers", link: "/shop?featured=true" },
              { name: "Sale Items", link: "/shop?discount=true" },
            ]
          },
          // Then add the regular categories
          ...sortedCategories.map((category) => ({
            title: category.category_name,
            items: category.subcategories.map((subcat) => ({
              name: subcat.subcategory_name,
              link: `/shop/category/${category.category_name
                .toLowerCase()
                .replace(/\s+/g, "-")}/${subcat.subcategory_name
                .toLowerCase()
                .replace(/\s+/g, "-")}`,
            })),
          })),
        ],
      },
      {
        name: "About",
        link: "/about",
      },
      {
        name: "Blogs",
        link: "/blogs",
      },
      {
        name: "Contact",
        link: "/contact",
      },
    ];

    return items;
  };

  const menuItems = generateMenuItems();

  const handleDropdownToggle = (index) => {
    if (activeDropdown === index) {
      setActiveDropdown(null);
    } else {
      setActiveDropdown(index);
    }
  };

  const handleMouseLeave = () => {
    setActiveDropdown(null);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const toggleMobileCategory = (index) => {
    if (expandedMobileCategories.includes(index)) {
      setExpandedMobileCategories(
        expandedMobileCategories.filter((item) => item !== index)
      );
    } else {
      setExpandedMobileCategories([...expandedMobileCategories, index]);
    }
  };

  // ADD ONLY THESE TWO FUNCTIONS:
  const handleCartClick = (e) => {
    if (!isLoggedIn) {
      e.preventDefault();
      toast.error('Please login to access your cart');
    }
  };

  const handleWishlistClick = (e) => {
    if (!isLoggedIn) {
      e.preventDefault();
      toast.error('Please login to access your wishlist');
    }
  };

  // GET COUNTS WITH FALLBACK:
  const cartItemCount = getCartItemCount ? getCartItemCount() : 0;
  const wishlistItemCount = getWishlistItemCount ? getWishlistItemCount() : 0;

  // Add this function to handle voice search results:
  const handleVoiceResult = (transcript) => {
    // Set the search text
    setSearchText(transcript);
    
    // Process the voice command
    processVoiceCommand(transcript);
  };

  return (
    <div className="bg-background shadow-sm relative z-20 bg-gradient-to-b from-accent/30 to-background/90">
      <div className="max-w-7xl mx-auto md:flex items-center justify-between p-2 pr-3">
        {/* Desktop Navigation */}
        <div className="hidden md:hidden lg:flex justify-center flex-1">
          <nav className="flex items-center" aria-label="Main Navigation">
            {menuItems.map((item, index) => (
              <div
                key={item.name}
                className="relative"
                onMouseEnter={() =>
                  item.hasDropdown && handleDropdownToggle(index)
                }
                onMouseLeave={handleMouseLeave}
              >
                <NavLink
                  to={item.link}
                  className={({ isActive }) =>
                    `px-6 py-2 text-sm font-medium transition-colors ${
                      isActive || activeDropdown === index
                        ? "text-[#E66354] border-b-2 border-[#E66354]"
                        : "text-text hover:text-[#E66354]"
                    }`
                  }
                  aria-expanded={activeDropdown === index}
                  aria-haspopup={item.hasDropdown ? "true" : "false"}
                >
                  {item.name}
                  {item.hasDropdown && (
                    <span className="ml-1">
                      <i
                        className="fas fa-chevron-down text-xs"
                        aria-hidden="true"
                      ></i>
                    </span>
                  )}
                </NavLink>

                {item.hasDropdown && activeDropdown === index && (
                  <div
                    className="absolute top-full left-0 bg-background shadow-lg rounded-b-lg p-6 mt-1 w-[1000px] -ml-[400px] grid grid-cols-5 gap-6 border-t-2 border-[#E66354]"
                    onMouseLeave={() => setActiveDropdown(null)}
                    role="menu"
                    aria-orientation="horizontal"
                    aria-labelledby={`${item.name.toLowerCase()}-menu`}
                  >
                    {item.categories.map((category, catIndex) => (
                      <div key={catIndex} className="space-y-3" role="none">
                        <h3
                          id={`${item.name.toLowerCase()}-category-${catIndex}`}
                          className={`font-bold uppercase text-sm tracking-wider ${
                            category.title === "Browse All" 
                              ? "text-blue-600 dark:text-blue-400" 
                              : "text-[#E66354]"
                          }`}
                        >
                          {category.title}
                        </h3>
                        <ul
                          className="space-y-2"
                          role="group"
                          aria-labelledby={`${item.name.toLowerCase()}-category-${catIndex}`}
                        >
                          {category.items.map((subItem, subIndex) => (
                            <li key={subIndex} role="none">
                              <Link
                                to={subItem.link}
                                className={`transition-colors text-sm ${
                                  category.title === "Browse All"
                                    ? "text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium"
                                    : "text-text hover:text-[#E66354]"
                                }`}
                                role="menuitem"
                              >
                                {subItem.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
        </div>

        <div className="flex items-center justify-between w-full w-auto lg:hidden md:flex md:items-center md:justify-between md:w-full md:w-auto">
          <div className="flex-start">
            <button
              className="text-text focus:outline-none focus:ring-2 focus:ring-[#E66354] rounded p-2"
              onClick={toggleMobileMenu}
              aria-label="Toggle mobile menu"
            >
              <i className="fas fa-bars" aria-hidden="true"></i>
            </button>
          </div>

          <div className="flex align-center space-x-2">
            {/* Search Bar - Mobile Only */}
            <div className="flex items-center">
              <button
                onClick={handleSearchExpand}
                className="text-text flex justify-center rounded-full p-2 transition-all duration-300"
                aria-label="Search"
              >
                <i className="fas fa-search" aria-hidden="true"></i>
              </button>
              {/* Search Bar - Hidden on mobile unless expanded */}
              <div
                className={`lg:hidden
                  ${isSearchExpanded ? "block" : "hidden"}
                      absolute top-12 left-0 right-0 p-4 transition-all duration-300 z-50 bg-gray-100 dark:bg-gray-950`}
              >
                <div className="relative flex w-full group">
                  <input
                    id="search-input"
                    type="text"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    placeholder="Search for products... (or use voice)"
                    aria-label="Search for products"
                    className="pl-4 py-2 pr-20 text-text bg-gray-100 dark:bg-gray-950 w-full rounded-l-full border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-1 focus:ring-[#E66354] transition-all duration-300"
                  />

                  {/* Voice Search Button */}
                  <div className="absolute right-16 top-1/2 transform -translate-y-1/2">
                    <VoiceSearch onVoiceResult={handleVoiceResult} isExpanded={true} />
                  </div>

                  {/* Search Button */}
                  <button
                    className="bg-gray-100 dark:bg-gray-950 px-4 py-2 rounded-r-full text-text/70 border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-1 focus:ring-[#E66354] transition-all duration-300"
                    aria-label="Search"
                    onClick={() => handleVoiceResult(searchText)}
                  >
                    <i className="fas fa-search" aria-hidden="true"></i>
                  </button>
                </div>
              </div>
            </div>

            {/* Profile - Desktop Only */}
            <div className="flex items-center">
              <Link
                to="/signup"
                className="text-text flex items-center hover:bg-white hover:text-primary rounded-full p-2 transition-all duration-300"
                aria-label="My account"
              >
                <i className="fas fa-user" aria-hidden="true"></i>
              </Link>
            </div>

            {/* Wishlist - Desktop Only - UPDATE ONLY THIS SECTION */}
            <div className="flex items-center">
              <Link
                to="/wishlist"
                onClick={handleWishlistClick} // ADD ONLY THIS
                className="text-text relative flex items-center hover:bg-white hover:text-primary rounded-full p-2 transition duration-300"
                aria-label="My wishlist"
              >
                <i className="fas fa-heart" aria-hidden="true"></i>
                {wishlistItemCount > 0 && ( // UPDATE ONLY THIS CONDITION AND CONTENT
                  <span
                    className="absolute -top-0.5 -right-0.5 bg-white text-primary rounded-full text-xs w-4 h-4 flex items-center justify-center font-bold"
                    aria-label={`${wishlistItemCount} items in wishlist`}
                  >
                    {wishlistItemCount > 99 ? '99+' : wishlistItemCount}
                  </span>
                )}
              </Link>
            </div>

            {/* Cart - Always visible on mobile and desktop - UPDATE ONLY THIS SECTION */}
            <div className="flex items-center">
              <Link
                to="/cart"
                onClick={handleCartClick} // ADD ONLY THIS
                className="text-text relative flex items-center hover:bg-white hover:text-primary rounded-full p-2 transition duration-300"
                aria-label="Shopping cart"
              >
                <i className="fas fa-shopping-bag" aria-hidden="true"></i>
                {cartItemCount > 0 && ( // UPDATE ONLY THIS CONDITION AND CONTENT
                  <span
                    className="absolute -top-0.5 -right-0.5 bg-white text-primary rounded-full text-xs w-4 h-4 flex items-center justify-center font-bold"
                    aria-label={`${cartItemCount} items in cart`}
                  >
                    {cartItemCount > 99 ? '99+' : cartItemCount}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        id="mobile-menu"
        ref={mobileMenuRef}
        className={`lg:hidden fixed top-0 left-0 bottom-0 w-[280px] bg-gray-100 dark:bg-gray-900 shadow-xl transform transition-transform duration-300 ease-in-out z-50
          ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
        `}
        aria-hidden={!mobileMenuOpen}
      >
        {/* Mobile Menu Header */}
        <div className="flex items-center justify-end px-4 py-2">
          <button
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Close menu"
            className="text-text/50 focus:outline-none focus:ring-2 focus:ring-[#E66354] rounded p-2"
          >
            <i className="fas fa-times" aria-hidden="true"></i>
          </button>
        </div>

        {/* Mobile Menu Items */}
        <nav className="p-4" aria-label="Mobile Navigation">
          <ul>
            {menuItems.map((item, index) => (
              <li key={item.name} className="mb-1">
                {item.hasDropdown ? (
                  <div>
                    <button
                      className="flex items-center justify-between w-full py-2 px-3 text-left rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={() => toggleMobileCategory(index)}
                      aria-expanded={expandedMobileCategories.includes(index)}
                      aria-controls={`mobile-submenu-${index}`}
                    >
                      <span className="font-medium">{item.name}</span>
                      <i
                        className={`fas ${
                          expandedMobileCategories.includes(index)
                            ? "fa-chevron-up"
                            : "fa-chevron-down"
                        } text-xs`}
                        aria-hidden="true"
                      ></i>
                    </button>

                    {/* Mobile Submenu */}
                    <div
                      id={`mobile-submenu-${index}`}
                      className={`mt-1 ml-4 space-y-3 ${
                        expandedMobileCategories.includes(index)
                          ? "block"
                          : "hidden"
                      }`}
                    >
                      {item.categories.map((category, catIndex) => (
                        <div key={catIndex} className="mt-3">
                          <h4 className={`text-sm font-medium uppercase tracking-wider mb-2 ${
                            category.title === "Browse All"
                              ? "text-blue-600 dark:text-blue-400"
                              : "text-[#E66354]"
                          }`}>
                            {category.title}
                          </h4>
                          <ul className="space-y-2 pl-2">
                            {category.items.map((subItem, subIndex) => (
                              <li key={subIndex}>
                                <Link
                                  to={subItem.link}
                                  className={`block py-1 text-sm ${
                                    category.title === "Browse All"
                                      ? "text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium"
                                      : "text-text hover:text-[#E66354]"
                                  }`}
                                  onClick={() => setMobileMenuOpen(false)}
                                >
                                  {subItem.name}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <NavLink
                    to={item.link}
                    className={({ isActive }) =>
                      `block py-2 px-3 rounded ${
                        isActive
                          ? "text-[#E66354] bg-[#E66354]/10"
                          : "text-text hover:bg-gray-100 dark:hover:bg-gray-700"
                      }`
                    }
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </NavLink>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* Mobile Menu Footer */}
        <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-700">
          <div className="flex justify-between">
            <button
              onClick={handleThemeToggle}
              className="flex items-center space-x-2 text-sm text-text py-2 px-3 rounded"
              aria-label="Toggle theme"
            >
              <i
                className={`fas ${
                  theme === "dark" ? "fa-sun" : "fa-moon"
                } mr-2`}
                aria-hidden="true"
              ></i>
              <span>{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
            </button>
          </div>
          <div className="flex justify-between mt-2">
            <Link
              to="/account"
              className="text-text flex items-center space-x-2 text-sm py-2 px-3 rounded"
              aria-label="My account"
            >
              <i className="fas fa-user" aria-hidden="true"></i>
              <span>My Account</span>
            </Link>
          </div>
        </div>
      </div>
      {/* Overlay for mobile menu */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        ></div>
      )}
    </div>
  );
}

export default NavbarBottom;
