import React, { useState, useRef, useEffect, useContext } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useCategories } from "../../Context/CategoryContext.jsx";
import { useTheme } from "../../Context/ThemeContext.jsx";
import { useCart } from "../../Context/CartContext.jsx";
import { useWishlist } from "../../Context/WishlistContext.jsx";
import { AppContent } from "../../Context/AppContent.jsx";
import { toast } from "react-toastify";

function NavbarBottom() {
  const { categories } = useCategories();
  const { theme, themeToggle } = useTheme();
  const { getCartItemCount } = useCart();
  const { getWishlistItemCount } = useWishlist();
  const { isLoggedIn, userData, logout } = useContext(AppContent);
  const navigate = useNavigate();
  const location = useLocation(); // Add this to get current route

  const [activeDropdown, setActiveDropdown] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedMobileCategories, setExpandedMobileCategories] = useState([]);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const mobileMenuRef = useRef(null);

  const [searchText, setSearchText] = useState("");
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const searchRef = useRef(null);

  // Handle search functionality
  const handleSearchExpand = () => {
    setIsSearchExpanded(!isSearchExpanded);
    if (!isSearchExpanded) {
      setTimeout(() => {
        document.getElementById("mobile-search-input")?.focus();
      }, 100);
    }
  };

  const handleSearch = () => {
    if (searchText.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchText.trim())}`);
      setIsSearchExpanded(false);
      setSearchText("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // Handle logout
  const handleLogout = async () => {
    const success = await logout();
    if (success) {
      navigate("/");
      toast.success("Logged out successfully");
    }
    setShowProfileDropdown(false);
    setMobileMenuOpen(false);
  };

  // Handle theme toggle
  const handleThemeToggle = () => {
    themeToggle();
  };

  // Close mobile menu and search when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setMobileMenuOpen(false);
      }
      if (showProfileDropdown && !event.target.closest(".profile-menu-container")) {
        setShowProfileDropdown(false);
      }
      // Close search when clicking outside
      if (searchRef.current && !searchRef.current.contains(event.target) && isSearchExpanded) {
        setIsSearchExpanded(false);
      }
    }

    if (mobileMenuOpen || showProfileDropdown || isSearchExpanded) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [mobileMenuOpen, showProfileDropdown, isSearchExpanded]);

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

  // Generate menu items
  const generateMenuItems = () => {
    const categoryOrder = [
      "Stationery",
      "Office Supplies",
      "Art Supplies",
      "Craft Materials",
    ];
    const sortedCategories = categoryOrder
      .map((categoryName) =>
        categories.find((cat) => cat.category_name === categoryName)
      )
      .filter(Boolean);

    return [
      { name: "Home", link: "/" },
      {
        name: "Shop",
        link: "",
        hasDropdown: true,
        categories: [
          {
            title: "Browse All",
            items: [
              { name: "All Products", link: "/shop" },
              { name: "New Arrivals", link: "/shop?sort=newest-desc" },
              { name: "Best Sellers", link: "/shop?featured=true" },
              { name: "Sale Items", link: "/shop?discount=true" },
            ],
          },
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
      { name: "About", link: "/about" },
      { name: "Blogs", link: "/blogs" },
      { name: "Contact", link: "/contact" },
    ];
  };

  const menuItems = generateMenuItems();

  const handleDropdownToggle = (index) => {
    setActiveDropdown(activeDropdown === index ? null : index);
  };

  const handleMouseLeave = () => {
    setActiveDropdown(null);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const toggleMobileCategory = (index) => {
    setExpandedMobileCategories(
      expandedMobileCategories.includes(index)
        ? expandedMobileCategories.filter((item) => item !== index)
        : [...expandedMobileCategories, index]
    );
  };

  const handleCartClick = (e) => {
    if (!isLoggedIn) {
      e.preventDefault();
      toast.error("Please login to access your cart");
      navigate("/login");
    }
  };

  const handleWishlistClick = (e) => {
    if (!isLoggedIn) {
      e.preventDefault();
      toast.error("Please login to access your wishlist");
      navigate("/login");
    }
  };

  const cartItemCount = getCartItemCount ? getCartItemCount() : 0;
  const wishlistItemCount = getWishlistItemCount ? getWishlistItemCount() : 0;

  return (
    <div className="bg-background shadow-sm relative z-20 bg-gradient-to-b from-accent/30 to-background/90">
      <div className="max-w-7xl mx-auto">
        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center justify-center px-2 py-1">
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
                {item.hasDropdown ? (
                  // For dropdown items like Shop, use a button with route-based active state
                  <button
                    className={`px-6 py-2 text-sm font-medium transition-colors ${
                      location.pathname === '/shop' // Check if currently on /shop route
                        ? "text-[#E66354] border-b-2 border-[#E66354]" // Active state
                        : "text-text hover:text-[#E66354]" // Same hover effect as others
                    }`}
                  >
                    {item.name}
                    <i
                      className="fas fa-chevron-down text-xs ml-1"
                      aria-hidden="true"
                    ></i>
                  </button>
                ) : (
                  // For regular links, use NavLink
                  <NavLink
                    to={item.link}
                    className={({ isActive }) =>
                      `px-6 py-2 text-sm font-medium transition-colors ${
                        isActive
                          ? "text-[#E66354] border-b-2 border-[#E66354]"
                          : "text-text hover:text-[#E66354]"
                      }`
                    }
                  >
                    {item.name}
                  </NavLink>
                )}

                {/* Dropdown content remains the same */}
                {item.hasDropdown && activeDropdown === index && (
                  <div className="absolute top-full left-0 bg-background shadow-lg rounded-b-lg p-6 w-[1000px] -ml-[400px] grid grid-cols-5 gap-6 border-t-2 border-[#E66354]">
                    {item.categories.map((category, catIndex) => (
                      <div key={catIndex} className="space-y-3">
                        <h3
                          className={`font-bold uppercase text-sm tracking-wider ${
                            category.title === "Browse All"
                              ? "text-blue-600 dark:text-blue-400"
                              : "text-[#E66354]"
                          }`}
                        >
                          {category.title}
                        </h3>
                        <ul className="space-y-2">
                          {category.items.map((subItem, subIndex) => (
                            <li key={subIndex}>
                              <Link
                                to={subItem.link}
                                className={`transition-colors text-sm ${
                                  category.title === "Browse All"
                                    ? "text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium"
                                    : "text-text hover:text-[#E66354]"
                                }`}
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

        {/* Mobile/Tablet Navigation */}
        <div className="lg:hidden flex items-center justify-between p-2">
          {/* Left Side - Menu Button */}
          <button
            className="text-text focus:outline-none focus:ring-2 focus:ring-[#E66354] rounded p-2"
            onClick={toggleMobileMenu}
            aria-label="Toggle mobile menu"
          >
            <i className="fas fa-bars text-lg" aria-hidden="true"></i>
          </button>

          {/* Right Side - Actions */}
          <div className="flex items-center space-x-1">
            {/* Search Button */}
            <button
              onClick={handleSearchExpand}
              className="text-text hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full p-2 transition-all duration-300"
              aria-label="Search"
            >
              <i className="fas fa-search text-lg" aria-hidden="true"></i>
            </button>

            {/* Profile Button (Mobile/Tablet) */}
            <div className="profile-menu-container relative">
              <button
                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                className="text-text hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full p-2 transition-all duration-300"
                aria-label="My account"
              >
                <i className="fas fa-user text-lg" aria-hidden="true"></i>
              </button>

              {/* Mobile Profile Dropdown - Removed theme toggle */}
              {showProfileDropdown && (
                <div className="absolute -right-5 mt-2 w-56 bg-white dark:bg-gray-800 rounded-md shadow-lg z-100 py-2 border border-gray-200 dark:border-gray-700">
                  {!isLoggedIn ? (
                    <>
                      <Link
                        to="/login"
                        onClick={() => setShowProfileDropdown(false)}
                        className="block px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <i
                          className="fas fa-sign-in-alt mr-3"
                          aria-hidden="true"
                        ></i>
                        Login
                      </Link>
                      <Link
                        to="/signup"
                        onClick={() => setShowProfileDropdown(false)}
                        className="block px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <i
                          className="fas fa-user-plus mr-3"
                          aria-hidden="true"
                        ></i>
                        Sign Up
                      </Link>
                    </>
                  ) : (
                    <>
                      <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {userData?.first_name} {userData?.last_name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {userData?.email}
                        </p>
                      </div>

                      <Link
                        to={
                          userData?.role === "admin"
                            ? `${import.meta.env.VITE_ADMIN_URL}/`
                            : "/account"
                        }
                        onClick={() => setShowProfileDropdown(false)}
                        className="block px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <i className="fas fa-user-circle mr-3"></i>
                        {userData?.role === "admin"
                          ? "Admin Dashboard"
                          : "My Account"}
                      </Link>

                      <Link
                        to="/orders"
                        onClick={() => setShowProfileDropdown(false)}
                        className="block px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <i className="fas fa-box mr-3"></i>
                        My Orders
                      </Link>

                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-3 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <i className="fas fa-sign-out-alt mr-3"></i>
                        Logout
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Wishlist */}
            <Link
              to="/wishlist"
              onClick={handleWishlistClick}
              className="text-text relative hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full p-2 transition duration-300"
              aria-label="My wishlist"
            >
              <i className="fas fa-heart text-lg" aria-hidden="true"></i>
              {wishlistItemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-primary text-white rounded-full text-xs w-4 h-4 flex items-center justify-center font-bold">
                  {wishlistItemCount > 99 ? "99+" : wishlistItemCount}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link
              to="/cart"
              onClick={handleCartClick}
              className="text-text relative hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full p-2 transition duration-300"
              aria-label="Shopping cart"
            >
              <i
                className="fas fa-shopping-cart text-lg"
                aria-hidden="true"
              ></i>
              {cartItemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-primary text-white rounded-full text-xs w-4 h-4 flex items-center justify-center font-bold">
                  {cartItemCount > 99 ? "99+" : cartItemCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Mobile Search Expandable Bar - Made consistent with desktop design */}
        {isSearchExpanded && (
          <div 
            ref={searchRef}
            className="lg:hidden absolute top-full left-0 right-0 bg-white dark:bg-gray-800 shadow-lg z-50 px-4 py-3 border-t border-gray-200 dark:border-gray-700"
          >
            <div className="relative flex w-full">
              <input
                id="mobile-search-input"
                type="text"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                onClick={handleKeyPress}
                placeholder="Search for products, brands, categories..."
                className="pl-4 py-3 pr-4 text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 w-full rounded-l-full border-none text-sm h-10 focus:outline-none"
              />
              <button
                onClick={handleSearch}
                className="bg-[#E66354] hover:bg-[#E66354]/80 px-4 py-3 rounded-r-full text-white transition-all duration-300 flex items-center justify-center h-10 flex-shrink-0"
              >
                <i className="fas fa-search" aria-hidden="true"></i>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Menu Sidebar */}
      <div
        ref={mobileMenuRef}
        className={`lg:hidden fixed top-0 left-0 bottom-0 w-[300px] bg-white dark:bg-gray-900 shadow-xl transform transition-transform duration-300 ease-in-out z-50 flex flex-col ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Mobile Menu Header */}
        <div className="bg-primary flex items-center justify-between px-4 py-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
          <Link to="/" onClick={() => setMobileMenuOpen(false)}>
            <img
              src="/brandlogo.png"
              alt="InkDesk Logo"
              className="h-8 w-auto object-contain"
            />
          </Link>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="text-gray-600 p-2"
          >
            <i className="fas fa-times text-lg" aria-hidden="true"></i>
          </button>
        </div>

        {/* Mobile Menu Items - Scrollable */}
        <nav className="flex-1 overflow-y-auto px-4 py-2">
          <ul className="space-y-1">
            {menuItems.map((item, index) => (
              <li key={item.name}>
                {item.hasDropdown ? (
                  <div>
                    <button
                      className="flex items-center justify-between w-full py-3 px-3 text-left rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 font-medium"
                      onClick={() => toggleMobileCategory(index)}
                    >
                      <span>{item.name}</span>
                      <i
                        className={`fas ${
                          expandedMobileCategories.includes(index)
                            ? "fa-chevron-up"
                            : "fa-chevron-down"
                        } text-sm`}
                      ></i>
                    </button>

                    {expandedMobileCategories.includes(index) && (
                      <div className="mt-2 ml-4 space-y-4">
                        {item.categories.map((category, catIndex) => (
                          <div key={catIndex}>
                            <h4
                              className={`text-sm font-semibold uppercase tracking-wider mb-2 ${
                                category.title === "Browse All"
                                  ? "text-blue-600 dark:text-blue-400"
                                  : "text-[#E66354]"
                              }`}
                            >
                              {category.title}
                            </h4>
                            <ul className="space-y-1 pl-2 border-l-2 border-gray-200 dark:border-gray-700">
                              {category.items.map((subItem, subIndex) => (
                                <li key={subIndex}>
                                  <Link
                                    to={subItem.link}
                                    className={`block py-2 px-2 text-sm rounded transition-colors ${
                                      category.title === "Browse All"
                                        ? "text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                                        : "text-gray-600 dark:text-gray-300 hover:text-[#E66354] hover:bg-gray-50 dark:hover:bg-gray-700"
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
                    )}
                  </div>
                ) : (
                  <NavLink
                    to={item.link}
                    className={({ isActive }) =>
                      `block py-3 px-3 rounded-lg font-medium transition-colors ${
                        isActive
                          ? "text-[#E66354] bg-[#E66354]/10"
                          : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
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

        {/* Mobile Menu Footer - Theme Toggle in Sidebar */}
        <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
          <button
            onClick={() => {
              handleThemeToggle();
              setMobileMenuOpen(false);
            }}
            className="flex items-center justify-between w-full py-3 px-3 text-left rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 font-medium text-gray-700 dark:text-gray-200"
          >
            <div className="flex items-center">
              <i
                className={`fas ${
                  theme === "dark" ? "fa-sun" : "fa-moon"
                } mr-3`}
              ></i>
              <span>{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setMobileMenuOpen(false)}
        ></div>
      )}
    </div>
  );
}

export default NavbarBottom;
