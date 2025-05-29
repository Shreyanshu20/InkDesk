import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { AppContent } from "../../../Context/AppContent.jsx";
import { useWishlist } from "../../../Context/WishlistContext.jsx"; // Import WishlistContext
import StarRating from "../../Common/StarRating";
import PriceDisplay from "../../Common/PriceDisplay";
import Button from "../../Common/Button";

const Products = ({ products, formatPrice }) => {
  const { backendUrl, isLoggedIn } = useContext(AppContent);

  // Use WishlistContext instead of local state
  const {
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    loading: wishlistLoading,
  } = useWishlist();

  const addToCart = async (e, productId) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isLoggedIn) {
      toast.info("Please login to add items to cart");
      return;
    }

    try {
      const response = await axios.post(
        `${backendUrl}/cart/add`,
        {
          product_id: productId,
          quantity: 1,
        },
        {
          withCredentials: true,
        }
      );

      if (response.data.success) {
        toast.success("Product added to cart successfully!");
      } else {
        toast.error(response.data.message || "Failed to add product to cart");
      }
    } catch (error) {
      console.error("Add to cart error:", error);
      if (error.response?.status === 401) {
        toast.error("Please login to add items to cart");
      } else {
        toast.error("Failed to add product to cart. Please try again.");
      }
    }
  };

  // Simplified toggleWishlist using WishlistContext
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
      // WishlistContext handles toast messages, so no need to add them here
    }
  };

  const calculateDiscount = (price, discountPercentage) => {
    if (!discountPercentage) return 0;
    return Math.round(discountPercentage);
  };

  if (!products || products.length === 0) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {/* Loading skeleton */}
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="animate-pulse">
            <div className="bg-gray-200 rounded-lg h-64 w-full mb-4"></div>
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((product) => {
        const discount = calculateDiscount(
          product.product_price,
          product.product_discount
        );
        const inStock = product.product_stock > 0;
        const discountedPrice =
          discount > 0
            ? product.product_price - product.product_price * (discount / 100)
            : product.product_price;

        // Use WishlistContext to check if product is in wishlist
        const productInWishlist = isInWishlist(product._id);

        return (
          <div key={product._id} className="group relative h-full">
            <Link to={`/shop/product/${product._id}`} className="block h-full">
              <div className="bg-gray-50 dark:bg-gray-800 text-text rounded-lg border border-gray-300 dark:border-gray-600 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group-hover:scale-[1.01] h-full flex flex-col group border-b-4 border-transparent hover:border-primary">
                {/* Product Image - Fixed Height */}
                <div className="relative aspect-square bg-gray-50 flex-shrink-0">
                  <img
                    src={product.product_image || "/api/placeholder/300/300"}
                    alt={product.product_name}
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                    loading="lazy"
                  />

                  {/* Discount Badge */}
                  {discount > 0 && (
                    <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                      {discount}% OFF
                    </span>
                  )}

                  {/* Out of Stock Overlay */}
                  {!inStock && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
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
                      productInWishlist
                        ? "Remove from wishlist"
                        : "Add to wishlist"
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
                <div className="p-4 flex-1 flex flex-col justify-between min-h-[140px]">
                  <div className="flex-1">
                    {/* Product Name - Fixed Height */}
                    <h3 className="font-medium mb-2 line-clamp-2 h-12 overflow-hidden leading-6">
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
                      originalPrice={
                        discount > 0 ? product.product_price : null
                      }
                      discount={discount}
                      formatPrice={formatPrice}
                      size="md"
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
                onClick={(e) => addToCart(e, product._id)}
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
      })}
    </div>
  );
};

export default Products;
