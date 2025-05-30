import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AppContent } from "../../Context/AppContent.jsx";
import { useCategories } from "../../Context/CategoryContext.jsx";
import { useTheme } from "../../Context/ThemeContext.jsx";
import { useCart } from "../../Context/CartContext.jsx";
import { useWishlist } from "../../Context/WishlistContext.jsx"; // ADD ONLY THIS LINE
import { toast } from "react-toastify";
import axios from "axios";
import VoiceSearch from "../Common/VoiceSearch";
import { useVoiceSearch } from "../../hooks/useVoiceSearch";

function NavbarTop() {
  // Get categories from context
  const { categories } = useCategories();

  // Convert categories to simple array for dropdown
  const categoryNames = categories.map((cat) => cat.category_name);

  const { theme, themeToggle } = useTheme();
  const { isLoggedIn, userData, logout, backendUrl } = useContext(AppContent);
  const { getCartItemCount } = useCart(); // ADD ONLY getCartItemCount
  const { getWishlistItemCount } = useWishlist(); // ADD ONLY THIS LINE
  const navigate = useNavigate();
  const { processVoiceCommand } = useVoiceSearch();

  const [isDark, setIsDark] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [category, setCategory] = useState("All Category");
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(0);

  useEffect(() => {
    setIsDark(theme === "dark");
  }, [theme]);

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

  const sendOtpOnLoad = async () => {
    setResendDisabled(true);

    try {
      const response = await axios.post(
        `${backendUrl}/auth/send-otp`,
        {},
        { withCredentials: true }
      );

      if (response.data.success) {
        toast.info("Verification code sent to your email");

        setResendCountdown(60);
        const interval = setInterval(() => {
          setResendCountdown((prev) => {
            if (prev <= 1) {
              clearInterval(interval);
              setResendDisabled(false);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      } else {
        toast.error(
          response.data.message || "Failed to send verification code"
        );
        setResendDisabled(false);
      }
    } catch (error) {
      console.error("Send OTP error:", error);
      toast.error(
        error.response?.data?.message || "Failed to send verification code"
      );
      setResendDisabled(false);
    }
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

  // ADD ONLY THESE TWO FUNCTIONS:
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
    <div className="bg-primary px-4 py-3 md:py-5 text-white">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link
          to="/"
          className="flex items-center lg:justify-start lg:w-auto w-full justify-center"
        >
          <img
            src="/brandlogo.png"
            alt="InkDesk Logo"
            className="h-7 lg:h-8 w-auto object-contain"
          />
        </Link>

        {/* Search Bar - Hidden on mobile unless expanded */}
        <div className="hidden md:hidden lg:flex items-center max-w-3xl relative">
          <div className="relative flex w-full">
            <input
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Search for products... (or use voice search)"
              aria-label="Search for products"
              className="pl-4 py-2 pr-20 text-gray-700 bg-white w-full rounded-l-full focus:outline-none border-none"
            />

            {/* Voice Search Button */}
            <div className="absolute right-16 top-1/2 transform -translate-y-1/2">
              <VoiceSearch onVoiceResult={handleVoiceResult} />
            </div>

            {/* Search Button */}
            <button
              className="bg-[#E66354] px-4 py-2 rounded-r-full text-white border-none focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#E66354] hover:bg-[#E66354]/80 transition-all duration-300 flex items-center"
              aria-label="Search"
              onClick={() => handleVoiceResult(searchText)}
            >
              <i className="fas fa-search" aria-hidden="true"></i>
            </button>
          </div>
        </div>

        {/* Right Section - Mobile Icons */}
        <div className="md:hidden lg:block flex items-center space-x-1 md:space-x-3">
          {/* Desktop-only elements */}
          <div className="hidden md:flex items-center space-x-1 md:space-x-3">
            {/* Theme Toggle - Desktop Only */}
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

            {/* Profile with Dropdown - Desktop Only */}
            <div className="hidden md:block profile-menu-container relative">
              <button
                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                className="text-white text-xl flex items-center hover:bg-white hover:text-primary rounded-full p-2 transition-all duration-300"
                aria-label={isLoggedIn ? "My account" : "Sign in"}
                aria-expanded={showProfileDropdown}
                aria-haspopup="true"
              >
                <i className="fas fa-user" aria-hidden="true"></i>
              </button>

              {/* Profile Dropdown Menu */}
              {showProfileDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg z-50 py-1 border border-gray-200 dark:border-gray-700">
                  {isLoggedIn ? (
                    <>
                      {/* Logged in user info */}
                      <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {userData?.first_name} {userData?.last_name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          {userData?.email}
                        </p>
                        {/* Show verification status */}
                        {userData?.isAccountVerified ? (
                          <p className="text-xs text-green-500 mt-1">
                            <i className="fas fa-check-circle mr-1"></i>{" "}
                            Verified
                          </p>
                        ) : (
                          <p className="text-xs text-yellow-500 mt-1">
                            <i className="fas fa-exclamation-circle mr-1"></i>{" "}
                            Not verified
                          </p>
                        )}
                      </div>

                      {/* Menu items for logged in users */}
                      <Link
                        to={
                          userData?.role === "admin"
                            ? `${import.meta.env.VITE_ADMIN_URL}/`
                            : "/account"
                        }
                        onClick={() => setShowProfileDropdown(false)}
                        className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <i className="fas fa-user-circle mr-2"></i>
                        {userData?.role === "admin"
                          ? "Admin Dashboard"
                          : "My Account"}
                      </Link>

                      {/* Add Verify Email option if user is not verified */}
                      {!userData?.isAccountVerified && (
                        <Link
                          to={`/verify-email?email=${userData?.email}&autoSend=true`}
                          onClick={() => {
                            setShowProfileDropdown(false);
                          }}
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
                    </>
                  ) : (
                    <>
                      {/* Menu items for guests */}
                      <Link
                        to="/login"
                        onClick={() => setShowProfileDropdown(false)}
                        className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <i className="fas fa-sign-in-alt mr-2"></i>
                        Login
                      </Link>

                      <Link
                        to="/signup"
                        onClick={() => setShowProfileDropdown(false)}
                        className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <i className="fas fa-user-plus mr-2"></i>
                        Register
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Wishlist - Desktop Only - UPDATE ONLY THIS SECTION */}
            <div className="hidden md:flex items-center">
              <Link
                to="/wishlist"
                onClick={handleWishlistClick} // ADD ONLY THIS
                className="text-white text-xl relative flex items-center hover:bg-white hover:text-primary rounded-full p-2 transition duration-300"
                aria-label="My wishlist"
              >
                <i className="fas fa-heart" aria-hidden="true"></i>
                {wishlistItemCount > 0 && ( // UPDATE ONLY THIS CONDITION AND CONTENT
                  <span
                    className="absolute -top-0.5 -right-0.5 bg-white text-primary rounded-full text-xs w-4 h-4 flex items-center justify-center font-bold"
                    aria-label={`${wishlistItemCount} items in wishlist`}
                  >
                    {wishlistItemCount > 99 ? "99+" : wishlistItemCount}
                  </span>
                )}
              </Link>
            </div>

            {/* Cart - Always visible on mobile and desktop - UPDATE ONLY THIS SECTION */}
            <div className="hidden md:flex items-center">
              <Link
                to="/cart"
                onClick={handleCartClick} // ADD ONLY THIS
                className="text-white text-xl relative flex items-center hover:bg-white hover:text-primary rounded-full p-2 transition duration-300"
                aria-label="Shopping cart"
              >
                <i className="fas fa-shopping-bag" aria-hidden="true"></i>
                {cartItemCount > 0 && ( // UPDATE ONLY THIS CONDITION AND CONTENT
                  <span
                    className="absolute -top-0.5 -right-0.5 bg-white text-primary rounded-full text-xs w-4 h-4 flex items-center justify-center font-bold"
                    aria-label={`${cartItemCount} items in cart`}
                  >
                    {cartItemCount > 99 ? "99+" : cartItemCount}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NavbarTop;
