import React, { useContext, useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AppContent } from "../../Context/AppContent.jsx";
import { useTheme } from "../../Context/ThemeContext.jsx";
import { useCart } from "../../Context/CartContext.jsx";
import { useWishlist } from "../../Context/WishlistContext.jsx";
import { toast } from "react-toastify";

function NavbarTop() {
  const { theme, themeToggle } = useTheme();
  const { isLoggedIn, userData, logout, backendUrl } = useContext(AppContent);
  const { getWishlistItemCount } = useWishlist();
  const { getCartItemCount } = useCart();
  const navigate = useNavigate();

  const [searchText, setSearchText] = useState("");
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [subcategoryResults, setSubcategoryResults] = useState([]);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const searchTimeoutRef = useRef(null);
  const searchDropdownRef = useRef(null);

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

  const searchProducts = async (query) => {
    if (!query || query.trim().length < 2) {
      setSearchResults([]);
      setSubcategoryResults([]);
      setShowSearchDropdown(false);
      return;
    }
    setIsSearching(true);
    setShowSearchDropdown(true);
    try {
      const response = await fetch(
        `${backendUrl}/products/search?q=${encodeURIComponent(query.trim())}`
      );
      const data = await response.json();
      if (data.success) {
        const products = data.products.slice(0, 5);
        setSearchResults(products);
        const subcategories = [
          ...new Set(
            data.products
              .map((product) => product.product_subcategory)
              .filter(Boolean)
          ),
        ].slice(0, 4);
        setSubcategoryResults(subcategories);
        setShowSearchDropdown(true);
      } else {
        setSearchResults([]);
        setSubcategoryResults([]);
        setShowSearchDropdown(true);
      }
    } catch (error) {
      setSearchResults([]);
      setSubcategoryResults([]);
      setShowSearchDropdown(true);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchText(value);
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    searchTimeoutRef.current = setTimeout(() => {
      searchProducts(value);
    }, 300);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        showProfileDropdown &&
        !event.target.closest(".profile-menu-container")
      ) {
        setShowProfileDropdown(false);
      }
      if (
        showSearchDropdown &&
        searchDropdownRef.current &&
        !searchDropdownRef.current.contains(event.target)
      ) {
        setShowSearchDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showProfileDropdown, showSearchDropdown]);

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
      setShowSearchDropdown(false);
      setSearchText("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleProductClick = (productId) => {
    navigate(`/shop/product/${productId}`);
    setShowSearchDropdown(false);
    setSearchText("");
  };

  const handleSubcategoryClick = (subcategory) => {
    navigate(`/shop?subcategory=${encodeURIComponent(subcategory)}`);
    setShowSearchDropdown(false);
    setSearchText("");
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="bg-gradient-to-br from-red-500 to-red-800 lg:px-8 py-5 text-white">
      <div className="mx-auto flex items-center justify-center lg:justify-between">
        <Link to="/" className="flex items-center flex-shrink-0">
          <img
            src="/brandlogo.png"
            alt="InkDesk Logo"
            className="h-8 w-auto object-contain"
          />
        </Link>
        <div className="hidden lg:flex justify-center items-center max-w-2xl xl:max-w-4xl flex-1 mx-8">
          <div
            className="relative flex w-full max-w-3xl"
            ref={searchDropdownRef}
          >
            <input
              type="text"
              value={searchText}
              onChange={handleSearchChange}
              onKeyPress={handleKeyPress}
              onFocus={() =>
                searchText.trim().length >= 2 && searchProducts(searchText)
              }
              placeholder="Search for products, brands, categories..."
              aria-label="Search for products"
              className="pl-4 py-3 pr-4 text-gray-700 bg-white w-full rounded-l-full focus:outline-none border-2 border-gray-50 border-r-0 text-sm h-12"
            />
            <button
              onClick={handleSearch}
              className="group bg-accent/30 px-6 rounded-r-full text-white border-2 border-gray-50 border-l-0 hover:bg-gray-50 transition-all duration-300 flex items-center justify-center h-12 flex-shrink-0"
              aria-label="Search"
            >
              {isSearching ? (
                <i className="fas fa-spinner fa-spin" aria-hidden="true"></i>
              ) : (
                <i
                  className="fas fa-search group-hover:text-primary transition-all duration-300"
                  aria-hidden="true"
                ></i>
              )}
            </button>
            {showSearchDropdown && (
              <div className="absolute top-full left-0 right-0 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl z-50 mt-2 max-h-96 overflow-y-auto">
                {isSearching && (
                  <div className="p-8 text-center">
                    <div className="w-8 h-8 border-2 border-red-200 border-t-red-600 rounded-full animate-spin mx-auto mb-4"></div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Searching...
                    </div>
                  </div>
                )}
                {!isSearching && (
                  <>
                    {searchResults.length > 0 && (
                      <div className="p-3">
                        <div className="text-xs font-bold text-red-600 uppercase tracking-wide px-3 py-2 bg-red-50 dark:bg-red-900/20 rounded-lg mb-2">
                          <i className="fas fa-box mr-2"></i>
                          Products
                        </div>
                        {searchResults.map((product) => (
                          <div
                            key={product._id}
                            onClick={() => handleProductClick(product._id)}
                            className="flex items-center p-3 hover:bg-red-50 dark:hover:bg-red-900/10 cursor-pointer rounded-lg transition-all duration-200 border border-transparent hover:border-red-100 dark:hover:border-red-800"
                          >
                            <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-lg flex-shrink-0 flex items-center justify-center overflow-hidden border border-gray-200 dark:border-gray-600">
                              {product.product_images &&
                              product.product_images.length > 0 ? (
                                <img
                                  src={
                                    product.product_images[0]?.url ||
                                    product.product_images[0]
                                  }
                                  alt={product.product_name}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    e.target.style.display = "none";
                                    e.target.nextSibling.style.display = "flex";
                                  }}
                                />
                              ) : product.product_image ? (
                                <img
                                  src={product.product_image}
                                  alt={product.product_name}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    e.target.style.display = "none";
                                    e.target.nextSibling.style.display = "flex";
                                  }}
                                />
                              ) : null}
                              <div className="w-full h-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center hidden">
                                <i className="fas fa-image text-red-400 text-lg"></i>
                              </div>
                            </div>
                            <div className="ml-4 flex-1 min-w-0">
                              <div className="font-semibold text-gray-900 dark:text-white text-sm truncate mb-1">
                                {product.product_name}
                              </div>
                              <div className="text-xs text-gray-600 dark:text-gray-400 truncate mb-1">
                                by {product.product_brand || "Unknown Brand"}
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="text-sm font-bold text-red-600 dark:text-red-400">
                                  {formatPrice(product.product_price)}
                                </div>
                                {product.product_rating && (
                                  <div className="flex items-center text-xs text-yellow-500">
                                    <i className="fas fa-star mr-1"></i>
                                    {product.product_rating}
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center text-red-400 dark:text-red-300 opacity-0 group-hover:opacity-100 transition-opacity">
                              <i className="fas fa-arrow-right text-sm"></i>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    {subcategoryResults.length > 0 && (
                      <div className="p-3 border-t border-gray-100 dark:border-gray-700">
                        <div className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wide px-3 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg mb-2">
                          <i className="fas fa-tags mr-2"></i>
                          Categories
                        </div>
                        {subcategoryResults.map((subcategory, index) => (
                          <div
                            key={index}
                            onClick={() => handleSubcategoryClick(subcategory)}
                            className="flex items-center p-3 hover:bg-blue-50 dark:hover:bg-blue-900/10 cursor-pointer rounded-lg transition-all duration-200 border border-transparent hover:border-blue-100 dark:hover:border-blue-800"
                          >
                            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex-shrink-0 flex items-center justify-center border border-blue-200 dark:border-blue-800">
                              <i className="fas fa-tag text-blue-600 dark:text-blue-400 text-sm"></i>
                            </div>
                            <div className="ml-4 flex-1">
                              <div className="font-semibold text-gray-900 dark:text-white text-sm">
                                {subcategory}
                              </div>
                              <div className="text-xs text-gray-600 dark:text-gray-400">
                                View all products in this category
                              </div>
                            </div>
                            <div className="flex items-center text-blue-400 dark:text-blue-300">
                              <i className="fas fa-arrow-right text-sm"></i>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    {searchText.trim() &&
                      (searchResults.length > 0 ||
                        subcategoryResults.length > 0) && (
                        <div className="p-3 border-t border-gray-100 dark:border-gray-700">
                          <button
                            onClick={handleSearch}
                            className="w-full p-4 text-left hover:bg-gradient-to-r hover:from-red-50 hover:to-blue-50 dark:hover:from-red-900/10 dark:hover:to-blue-900/10 cursor-pointer rounded-lg transition-all duration-200 flex items-center justify-center text-red-600 dark:text-red-400 font-semibold text-sm border-2 border-dashed border-gray-200 dark:border-gray-600 hover:border-red-300 dark:hover:border-red-600"
                          >
                            <i className="fas fa-search mr-3 text-lg"></i>
                            <span>
                              View all results for "
                              <span className="font-bold">{searchText}</span>"
                            </span>
                            <i className="fas fa-arrow-right ml-3"></i>
                          </button>
                        </div>
                      )}
                    {searchText.trim().length >= 2 &&
                      searchResults.length === 0 &&
                      subcategoryResults.length === 0 && (
                        <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                            <i className="fas fa-search text-2xl text-gray-400 dark:text-gray-500"></i>
                          </div>
                          <div className="text-sm font-medium mb-2">
                            No products found
                          </div>
                          <div className="text-xs text-gray-600 dark:text-gray-400 mb-4">
                            We couldn't find any products matching "
                            <span className="font-semibold">{searchText}</span>"
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-500">
                            Try searching with different keywords or check
                            spelling
                          </div>
                        </div>
                      )}
                  </>
                )}
              </div>
            )}
          </div>
        </div>
        <div className="hidden lg:flex items-center space-x-3 flex-shrink-0">
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
                        <i className="fas fa-exclamation-circle mr-1"></i> Not
                        verified
                      </p>
                    )}
                  </div>
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
          <button
            onClick={handleThemeToggle}
            className="w-9 h-9 flex justify-center items-center text-white text-xl hover:bg-white hover:text-primary rounded-full p-2 transition-all duration-300"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <i className="fas fa-sun" aria-hidden="true"></i>
            ) : (
              <i className="fas fa-moon" aria-hidden="true"></i>
            )}
          </button>
          <Link
            to="/wishlist"
            onClick={handleWishlistClick}
            className="w-9 h-9 flex justify-center items-center text-white text-xl relative hover:bg-white hover:text-primary rounded-full p-2 transition duration-300"
            aria-label="My wishlist"
          >
            <i className="fas fa-heart" aria-hidden="true"></i>
            {wishlistItemCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-white text-primary rounded-full text-xs w-4 h-4 flex items-center justify-center font-bold">
                {wishlistItemCount > 99 ? "99+" : wishlistItemCount}
              </span>
            )}
          </Link>
          <Link
            to="/cart"
            onClick={handleCartClick}
            className="w-9 h-9 flex justify-center items-center text-white text-xl relative hover:bg-white hover:text-primary rounded-full p-2 transition duration-300"
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
