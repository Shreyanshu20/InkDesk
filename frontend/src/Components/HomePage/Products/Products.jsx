import React, { useState, useEffect, useContext, useMemo } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { AppContent } from "../../../Context/AppContent";
import { useCart } from "../../../Context/CartContext";
import { useWishlist } from "../../../Context/WishlistContext";
import StarRating from "../../Common/StarRating";
import PriceDisplay from "../../Common/PriceDisplay";
import Button from "../../Common/Button";
import { PRICING_CONFIG } from "../../Common/pricing";

const API_BASE_URL =
  import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

function Products() {
  const { isLoggedIn } = useContext(AppContent);
  const { addToCart } = useCart();
  const {
    isInWishlist,
    addToWishlist,
    removeFromWishlist,
    loading: wishlistLoading,
  } = useWishlist();

  const [activeTab, setActiveTab] = useState("featured");
  const [products, setProducts] = useState({
    featured: [],
    bestsellers: [],
    new: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Responsive pagination settings
  const getProductsPerPage = () => {
    if (typeof window !== "undefined") {
      if (window.innerWidth < 768) return 2; // Mobile: 2 products per page
      if (window.innerWidth < 1024) return 4; // Tablet: 4 products per page
      return 4; // Desktop: 4 products per page
    }
    return 4;
  };

  const [productsPerPage, setProductsPerPage] = useState(getProductsPerPage());

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const newProductsPerPage = getProductsPerPage();
      if (newProductsPerPage !== productsPerPage) {
        setProductsPerPage(newProductsPerPage);
        setCurrentPage(1);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [productsPerPage]);

  // Fetch products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const [featuredRes, bestsellersRes, newRes] = await Promise.all([
          fetch(`${API_BASE_URL}/products?featured=true&limit=8`),
          fetch(
            `${API_BASE_URL}/products?sortBy=product_rating&order=desc&limit=12`
          ),
          fetch(
            `${API_BASE_URL}/products?sortBy=createdAt&order=desc&limit=10`
          ),
        ]);

        const [featuredData, bestsellersData, newData] = await Promise.all([
          featuredRes.json(),
          bestsellersRes.json(),
          newRes.json(),
        ]);

        setProducts({
          featured:
            featuredData.success && Array.isArray(featuredData.products)
              ? featuredData.products.map(sanitizeProduct)
              : [],
          bestsellers:
            bestsellersData.success && Array.isArray(bestsellersData.products)
              ? bestsellersData.products.map(sanitizeProduct)
              : [],
          new:
            newData.success && Array.isArray(newData.products)
              ? newData.products.map(sanitizeProduct)
              : [],
        });
      } catch (error) {
        console.error("Error fetching products:", error);
        setError("Failed to load products. Please try again later.");
        setProducts({
          featured: getSampleProducts("featured"),
          bestsellers: getSampleProducts("bestsellers"),
          new: getSampleProducts("new"),
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Reset pagination when tab changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);

  const getSampleProducts = (type) => {
    const basePrice =
      type === "featured" ? 29.99 : type === "bestsellers" ? 19.99 : 34.99;
    const brandPrefix =
      type === "featured"
        ? "Premium"
        : type === "bestsellers"
        ? "Popular"
        : "Latest";

    return Array.from({ length: 12 }, (_, i) => ({
      _id: `${type}-${i + 1}`,
      product_name: `${brandPrefix} ${
        type === "featured"
          ? "Notebook Set"
          : type === "bestsellers"
          ? "Pen Collection"
          : "Art Supplies"
      } ${i + 1}`,
      product_description: `High-quality ${type} products for professionals`,
      product_price: basePrice + i * 3,
      product_image: `https://images.unsplash.com/photo-${
        type === "featured"
          ? "1544716278-ca5e3f4abd8c"
          : type === "bestsellers"
          ? "1586075010923-59c9c0e3a59c"
          : "1513475382585-d06e58bcb0e0"
      }?ixlib=rb-4.0.3&w=400`,
      product_category: "stationery",
      product_rating: 4.5 - i * 0.1,
      product_stock: i === 2 ? 0 : 10 + i, // Make 3rd product out of stock
      product_brand: `${brandPrefix} Brand`,
      product_discount: i % 3 === 0 ? 15 : 0,
    }));
  };

  const sanitizeProduct = (product) => {
    return {
      ...product,
      name: product.product_name || "Unnamed Product",
      description: product.product_description || "",
      price:
        typeof product.product_price === "number" ? product.product_price : 0,
      rating:
        typeof product.product_rating === "number" ? product.product_rating : 0,
      inStock: product.product_stock > 0,
      category: product.product_category || "stationery",
      image:
        product.product_image ||
        product.product_images?.[0] ||
        "https://via.placeholder.com/400x500?text=No+Image",
    };
  };

  // Memoize the handleAddToCart to prevent unnecessary re-renders
  const handleAddToCart = useMemo(
    () => async (e, productId) => {
      e.preventDefault();
      e.stopPropagation();

      if (!isLoggedIn) {
        toast.error("Please login to add items to cart");
        return;
      }

      // Use CartContext addToCart which handles UI updates
      await addToCart(productId, 1);
    },
    [isLoggedIn, addToCart]
  );

  const toggleWishlist = async (e, productId) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isLoggedIn) {
      toast.info("Please login to add items to wishlist");
      return;
    }

    const productInWishlist = isInWishlist(productId);

    try {
      if (productInWishlist) {
        await removeFromWishlist(productId);
      } else {
        await addToWishlist(productId);
      }
    } catch (error) {
      console.error("Wishlist toggle error:", error);
    }
  };

  // Fixed discount calculation - use the same logic as your working version
  const calculateDiscount = (price, discountPercentage) => {
    if (!discountPercentage) return 0;
    return Math.round(discountPercentage);
  };

  // Pagination logic
  const currentProducts = products[activeTab];
  const totalPages = Math.ceil(currentProducts.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  const currentPageProducts = currentProducts.slice(startIndex, endIndex);

  const goToPage = (page) => {
    setCurrentPage(page);
  };

  const nextPage = () => {
    if (currentPage < totalPages) {
      goToPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      goToPage(currentPage - 1);
    }
  };

  // Product Card Component - EXACT STYLING FROM YOUR FILE
  const ProductCard = ({ product }) => {
    // FIXED: Use product.product_discount (like in your working version)
    const discount = calculateDiscount(
      product.product_price,
      product.product_discount // CHANGED: back to product_discount
    );
    const inStock = product.product_stock > 0;
    // FIXED: Use the same discount calculation as your working version
    const discountedPrice =
      discount > 0
        ? product.product_price - product.product_price * (discount / 100)
        : product.product_price;

    const productInWishlist = isInWishlist(product._id);

    return (
      <div className="group relative h-full">
        <Link to={`/shop/product/${product._id}`} className="block h-full">
          <div className="bg-gray-50 dark:bg-gray-800 text-text rounded-lg border border-gray-100 dark:border-gray-600 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group-hover:scale-101 h-full flex flex-col group border-b-4 border-transparent hover:border-primary">
            {/* Product Image - Fixed Height */}
            <div className="relative aspect-square bg-gray-50 flex-shrink-0">
              <img
                src={
                  product.product_image ||
                  product.product_images?.[0] ||
                  "https://placehold.co/300x400?text=No+Image"
                }
                alt={product.product_name}
                className="w-full h-full object-cover group-hover:scale-101 transition-transform duration-300"
                loading="lazy"
                onError={(e) => {
                  e.target.src = "https://placehold.co/300x400?text=No+Image";
                }}
              />

              {/* Discount Badge */}
              {discount > 0 && (
                <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                  {discount}% OFF
                </span>
              )}

              {/* Out of Stock Overlay */}
              {!inStock && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center group-hover:scale-101">
                  <span className="bg-black/80 text-white px-3 py-1 rounded-full text-sm font-medium">
                    Out of Stock
                  </span>
                </div>
              )}

              {/* Wishlist Button */}
              <button
                onClick={(e) => toggleWishlist(e, product._id)}
                disabled={wishlistLoading}
                className={`absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${
                  productInWishlist
                    ? "bg-red-500 text-white opacity-100"
                    : "bg-white/80 hover:bg-white text-gray-600 hover:text-red-500 opacity-0 group-hover:opacity-100"
                } ${wishlistLoading ? "cursor-wait opacity-70" : ""}`}
                aria-label={
                  productInWishlist ? "Remove from wishlist" : "Add to wishlist"
                }
              >
                <i
                  className={`fas fa-heart text-sm ${
                    productInWishlist ? "text-white" : ""
                  }`}
                ></i>
              </button>
            </div>

            {/* Product Info - Flexible Height with Fixed Structure */}
            <div className="px-4 py-3 flex-1 flex flex-col justify-between">
              <div className="flex-1">
                {/* Product Name - Fixed Height */}
                <h3 className="font-medium text-sm md:text-base mb-2 line-clamp-2 h-12 overflow-hidden leading-6">
                  {product.product_name}
                </h3>

                {/* Brand - Fixed Height */}
                <div className="h-5 mb-2">
                  {product.product_brand && (
                    <p className="text-xs text-text/70">
                      {product.product_brand}
                    </p>
                  )}
                </div>

                {/* Rating - Fixed Height */}
                <div className="mb-3 h-4">
                  <StarRating
                    rating={product.product_rating || 0}
                    size="sm"
                    showText={false}
                  />
                </div>
              </div>

              {/* Price - Always at Bottom */}
              <div className="mt-auto">
                <PriceDisplay
                  price={discountedPrice}
                  originalPrice={discount > 0 ? product.product_price : null}
                  discount={discount}
                  formatPrice={PRICING_CONFIG.formatPrice}
                  size="sm"
                />
              </div>
            </div>
          </div>
        </Link>

        {/* Add to Cart Button for in-stock OR Notify Button for out-of-stock */}
        {inStock ? (
          <Button
            className="absolute bottom-4 right-4 rounded-full w-10 h-10 flex items-center justify-center transition-all duration-200 opacity-0 group-hover:opacity-100"
            variant="primary"
            size="icon"
            onClick={(e) => handleAddToCart(e, product._id)}
            aria-label="Add to cart"
          >
            <i className="fas fa-shopping-cart text-sm"></i>
          </Button>
        ) : (
          <Button
            className="absolute bottom-4 right-4 rounded-full w-10 h-10 flex items-center justify-center transition-all duration-200 opacity-0 group-hover:opacity-100"
            variant="primary"
            size="icon"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toast.info(
                "We'll notify you when this product is back in stock!"
              );
            }}
            aria-label="Notify when in stock"
          >
            <i className="fas fa-bell text-sm"></i>
          </Button>
        )}
      </div>
    );
  };

  if (isLoading) {
    return (
      <section className="py-10 px-4 md:px-6 bg-background">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center">
            <div className="w-8 md:w-12 h-8 md:h-12 border-3 md:border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3 md:mb-4"></div>
            <p className="text-text/70 dark:text-gray-400 text-sm md:text-base">
              Loading products...
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-10 px-4 md:px-6 bg-background">
      <div className="container mx-auto max-w-7xl">
        {/* Section header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-4 md:mb-6 lg:mb-8">
          <div>
            <h2 className="text-2xl lg:text-3xl font-bold text-text text-center mb-1 md:mb-2">
              Popular Products
            </h2>
          </div>

          <Link
            to="/shop"
            className="hidden flex items-center justify-center md:block px-4 md:px-6 py-2 md:py-3 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors duration-200 text-sm md:text-base"
          >
            <div className="flex items-center">
              View All Products
              <i className="fas fa-arrow-right ml-2"></i>
            </div>
          </Link>
        </div>

        {/* Error message */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-3 md:px-4 py-2 md:py-3 rounded-lg mb-4 md:mb-6 text-xs md:text-sm">
            <div className="flex items-center">
              <i className="fas fa-exclamation-circle mr-2 text-xs md:text-sm"></i>
              {error}
            </div>
          </div>
        )}

        {/* Category tabs */}
        <div className="flex overflow-x-auto mb-4 md:mb-6 lg:mb-8 border-b border-gray-200 dark:border-gray-700 -mx-2 px-2 md:mx-0 md:px-0">
          {["featured", "bestsellers", "new"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-shrink-0 px-3 md:px-4 lg:px-6 py-2 md:py-3 text-sm lg:text-base font-medium whitespace-nowrap mr-2 md:mr-0 border-b-2 transition-all duration-300 ${
                activeTab === tab
                  ? "border-primary text-primary bg-primary/5 dark:bg-primary/10"
                  : "border-transparent text-text/70 dark:text-gray-400 hover:text-primary"
              }`}
            >
              {tab === "new"
                ? "New Arrivals"
                : tab.charAt(0).toUpperCase() + tab.slice(1)}
              <span className="ml-1 md:ml-2 text-[10px] md:text-xs bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-1 md:px-2 py-0.5 md:py-1 rounded">
                {products[tab].length}
              </span>
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div>
          {currentPageProducts.length > 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4 lg:gap-6 mb-4 md:mb-6 lg:mb-8">
              {currentPageProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 md:py-12">
              <div className="text-gray-400 dark:text-gray-600 mb-3 md:mb-4">
                <i className="fas fa-box-open text-2xl md:text-3xl lg:text-4xl"></i>
              </div>
              <h3 className="text-sm md:text-base lg:text-lg font-medium text-text dark:text-white mb-1 md:mb-2">
                No products found
              </h3>
              <p className="text-xs md:text-sm lg:text-base text-text/70 dark:text-gray-400">
                Check back later for new products.
              </p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex flex-col md:flex-row justify-between items-center gap-3 md:gap-4 mb-4 md:mb-6 lg:mb-8">
            <div className="text-xs md:text-sm text-text/70 dark:text-gray-400 hidden md:block">
              Showing {startIndex + 1}-
              {Math.min(endIndex, currentProducts.length)} of{" "}
              {currentProducts.length} products
            </div>

            <div className="flex items-center gap-1 md:gap-2">
              <button
                onClick={prevPage}
                disabled={currentPage === 1}
                className={`p-1.5 md:p-2 lg:p-3 rounded border transition-colors duration-200 ${
                  currentPage === 1
                    ? "border-gray-300 dark:border-gray-600 text-gray-400 cursor-not-allowed"
                    : "border-gray-300 dark:border-gray-600 text-text dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                }`}
              >
                <i className="fas fa-chevron-left text-xs md:text-sm"></i>
              </button>

              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                let pageNumber = i + 1;
                if (totalPages > 5) {
                  if (currentPage <= 3) {
                    pageNumber = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNumber = totalPages - 4 + i;
                  } else {
                    pageNumber = currentPage - 2 + i;
                  }
                }

                return (
                  <button
                    key={pageNumber}
                    onClick={() => goToPage(pageNumber)}
                    className={`w-7 md:w-9 lg:w-10 h-7 md:h-9 lg:h-10 rounded border text-xs md:text-sm transition-colors duration-200 ${
                      pageNumber === currentPage
                        ? "border-primary bg-primary text-white"
                        : "border-gray-300 dark:border-gray-600 text-text dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                    }`}
                  >
                    {pageNumber}
                  </button>
                );
              })}

              <button
                onClick={nextPage}
                disabled={currentPage === totalPages}
                className={`p-1.5 md:p-2 lg:p-3 rounded border transition-colors duration-200 ${
                  currentPage === totalPages
                    ? "border-gray-300 dark:border-gray-600 text-gray-400 cursor-not-allowed"
                    : "border-gray-300 dark:border-gray-600 text-text dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                }`}
              >
                <i className="fas fa-chevron-right text-xs md:text-sm"></i>
              </button>
            </div>
          </div>
        )}

        {/* Mobile View All Button */}
        <div className="text-center md:hidden">
          <Link
            to="/shop"
            className="inline-block px-6 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors duration-200 text-sm"
          >
            View All Products{" "}
            <i className="fas fa-arrow-right ml-2 md:ml-3"></i>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default Products;
