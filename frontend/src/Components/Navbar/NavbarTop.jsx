import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AppContent } from "../../Context/AppContent.jsx";
import { useCategories } from "../../Context/CategoryContext.jsx";
import { useTheme } from "../../Context/ThemeContext.jsx";
import { useCart } from "../../Context/CartContext.jsx";
import { useWishlist } from "../../Context/WishlistContext.jsx";
import { toast } from "react-toastify";

function NavbarTop() {
  const { theme, themeToggle } = useTheme();
  const { isLoggedIn, userData, logout } = useContext(AppContent);
  const { getWishlistItemCount } = useWishlist();
  const { getCartItemCount } = useCart();
  const navigate = useNavigate();

  const [searchText, setSearchText] = useState("");
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  const handleThemeToggle = () => {
    themeToggle();
  };

  const handleLogout = async () => {
    const success = await logout();
    if (success) {
      navigate("/");
      toast.success("Logged out successfully");
    }
    setShowProfileDropdown(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        showProfileDropdown &&
        !event.target.closest(".profile-menu-container")
      ) {
        setShowProfileDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showProfileDropdown]);

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

  const handleSearch = () => {
    if (searchText.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchText.trim())}`);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="bg-gradient-to-br from-red-500 to-red-800 lg:px-8 py-5 text-white">
      <div className="mx-auto flex items-center justify-center lg:justify-between">
        
        {/* Logo - Always visible */}
        <Link
          to="/"
          className="flex items-center flex-shrink-0"
        >
          <img
            src="/brandlogo.png"
            alt="InkDesk Logo"
            className="h-8 w-auto object-contain"
          />
        </Link>

        {/* Desktop Search Bar - Hidden on mobile/tablet */}
        <div className="hidden lg:flex justify-center items-center max-w-2xl xl:max-w-4xl flex-1 mx-8">
          <div className="relative flex w-full max-w-3xl">
            <input
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onClick={handleKeyPress}
              placeholder="Search for products, brands, categories..."
              aria-label="Search for products"
              className="pl-4 py-3 pr-4 text-gray-700 bg-white w-full rounded-l-full focus:outline-none border-none text-sm h-12"
            />
            <button
              onClick={handleSearch}
              className="bg-accent px-6 rounded-r-full text-white border-none hover:bg-accent/70 transition-all duration-300 flex items-center justify-center h-12 flex-shrink-0"
              aria-label="Search"
            >
              <i className="fas fa-search" aria-hidden="true"></i>
            </button>
          </div>
        </div>

        {/* Desktop Right Section - Hidden on mobile/tablet */}
        <div className="hidden lg:flex items-center space-x-3 flex-shrink-0">
          {/* Authentication Buttons */}
          {!isLoggedIn ? (
            <div className="flex items-center space-x-2">
              <Link
                to="/login"
                className="text-white text-sm font-medium hover:bg-white hover:text-primary px-4 py-2 rounded-full transition-all duration-300 flex items-center whitespace-nowrap"
              >
                <i className="fas fa-sign-in-alt mr-2" aria-hidden="true"></i>
                Login
              </Link>
              <Link
                to="/signup"
                className="text-white text-sm font-medium hover:bg-white hover:text-primary px-4 py-2 rounded-full transition-all duration-300 flex items-center border-2 border-white/70 whitespace-nowrap"
              >
                <i className="fas fa-user-plus mr-2" aria-hidden="true"></i>
                Signup
              </Link>
            </div>
          ) : (
            /* Profile Dropdown */
            <div className="profile-menu-container relative">
              <button
                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                className="text-white text-sm font-medium flex items-center border-2 border-white/70 hover:bg-white hover:text-primary px-3 py-2 rounded-full transition-all duration-300 whitespace-nowrap"
                aria-label="My account"
                aria-expanded={showProfileDropdown}
                aria-haspopup="true"
              >
                <i className="fas fa-user mr-2" aria-hidden="true"></i>
                {userData?.first_name || "Account"}
                <i
                  className={`fas fa-chevron-down ml-2 transition-transform duration-200 ${
                    showProfileDropdown ? "rotate-180" : ""
                  }`}
                  aria-hidden="true"
                ></i>
              </button>

              {/* Profile Dropdown Menu */}
              {showProfileDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg z-50 py-1 border border-gray-200 dark:border-gray-700">
                  <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {userData?.first_name} {userData?.last_name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {userData?.email}
                    </p>
                    {userData?.isAccountVerified ? (
                      <p className="text-xs text-green-500 mt-1">
                        <i className="fas fa-check-circle mr-1"></i> Verified
                      </p>
                    ) : (
                      <p className="text-xs text-yellow-500 mt-1">
                        <i className="fas fa-exclamation-circle mr-1"></i> Not verified
                      </p>
                    )}
                  </div>

                  <Link
                    to={userData?.role === "admin" ? `${import.meta.env.VITE_ADMIN_URL}/` : "/account"}
                    onClick={() => setShowProfileDropdown(false)}
                    className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <i className="fas fa-user-circle mr-2"></i>
                    {userData?.role === "admin" ? "Admin Dashboard" : "My Account"}
                  </Link>

                  {!userData?.isAccountVerified && (
                    <Link
                      to={`/verify-email?email=${userData?.email}&autoSend=true`}
                      onClick={() => setShowProfileDropdown(false)}
                      className="block px-4 py-2 text-sm text-blue-600 dark:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <i className="fas fa-envelope-open-text mr-2"></i>
                      Verify Email
                    </Link>
                  )}

                  <Link
                    to="/orders"
                    onClick={() => setShowProfileDropdown(false)}
                    className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <i className="fas fa-box mr-2"></i>
                    My Orders
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <i className="fas fa-sign-out-alt mr-2"></i>
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Theme Toggle */}
          <button
            onClick={handleThemeToggle}
            className="text-white text-xl flex items-center hover:bg-white hover:text-primary rounded-full p-2 transition-all duration-300"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <i className="fas fa-sun" aria-hidden="true"></i>
            ) : (
              <i className="fas fa-moon" aria-hidden="true"></i>
            )}
          </button>

          {/* Wishlist */}
          <Link
            to="/wishlist"
            onClick={handleWishlistClick}
            className="text-white text-xl relative flex items-center hover:bg-white hover:text-primary rounded-full p-2 transition duration-300"
            aria-label="My wishlist"
          >
            <i className="fas fa-heart" aria-hidden="true"></i>
            {wishlistItemCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-white text-primary rounded-full text-xs w-4 h-4 flex items-center justify-center font-bold">
                {wishlistItemCount > 99 ? "99+" : wishlistItemCount}
              </span>
            )}
          </Link>

          {/* Cart */}
          <Link
            to="/cart"
            onClick={handleCartClick}
            className="text-white text-xl relative flex items-center hover:bg-white hover:text-primary rounded-full p-2 transition duration-300"
            aria-label="Shopping cart"
          >
            <i className="fas fa-shopping-cart" aria-hidden="true"></i>
            {cartItemCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-white text-primary rounded-full text-xs w-4 h-4 flex items-center justify-center font-bold">
                {cartItemCount > 99 ? "99+" : cartItemCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </div>
  );
}

export default NavbarTop;
