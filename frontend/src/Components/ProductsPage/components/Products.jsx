import React, { useContext, useMemo } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { AppContent } from "../../../Context/AppContent";
import { useCart } from "../../../Context/CartContext"; 
import { useWishlist } from "../../../Context/WishlistContext";
import StarRating from "../../Common/StarRating";
import PriceDisplay from "../../Common/PriceDisplay";
import Button from "../../Common/Button";

const Products = ({ products, formatPrice, isMobile = false }) => {
  const { isLoggedIn } = useContext(AppContent);
  const { addToCart } = useCart(); 
  const {
    isInWishlist,
    addToWishlist,
    removeFromWishlist,
    loading: wishlistLoading,
  } = useWishlist();

  const handleAddToCart = useMemo(() => async (e, productId) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isLoggedIn) {
      toast.error("Please login to add items to cart");
      return;
    }

    await addToCart(productId, 1);
  }, [isLoggedIn, addToCart]);

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

  const calculateDiscount = (price, discountPercentage) => {
    if (!discountPercentage) return 0;
    return Math.round(discountPercentage);
  };

  if (!products || products.length === 0) {
    return (
      <div className={`grid gap-4 ${isMobile ? 'grid-cols-2' : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'}`}>
        {Array.from({ length: isMobile ? 4 : 8 }).map((_, index) => (
          <div key={index} className="animate-pulse">
            <div className="bg-gray-200 rounded-lg h-64 w-full mb-4"></div>
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    );
  }

  // Mobile Layout (2 columns) - Image focused
  if (isMobile) {
    return (
      <div className="grid grid-cols-2 gap-3">
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

          const productInWishlist = isInWishlist(product._id);

          return (
            <div key={product._id} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
              <Link to={`/shop/product/${product._id}`} className="block">
                {/* Product Image - Made taller for mobile */}
                <div className="relative bg-gray-100 dark:bg-gray-700" style={{ aspectRatio: '3/4' }}>
                  <img
                    src={
                      product.product_image ||
                      product.product_images?.[0] ||
                      "https://placehold.co/300x400?text=No+Image"
                    }
                    alt={product.product_name}
                    className="w-full h-full object-cover"
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

                  {/* Always Visible Wishlist Button for Mobile */}
                  <button
                    onClick={(e) => toggleWishlist(e, product._id)}
                    disabled={wishlistLoading}
                    className={`absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center transition-colors ${
                      productInWishlist
                        ? "bg-red-500 text-white"
                        : "bg-white/90 text-gray-600 hover:text-red-500 hover:bg-white shadow-sm"
                    } ${wishlistLoading ? "cursor-wait opacity-70" : ""}`}
                    aria-label={
                      productInWishlist
                        ? "Remove from wishlist"
                        : "Add to wishlist"
                    }
                  >
                    <i className="fas fa-heart text-xs"></i>
                  </button>

                  {/* Out of Stock Overlay */}
                  {!inStock && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <span className="bg-black/80 text-white px-2 py-1 rounded text-xs font-medium">
                        Out of Stock
                      </span>
                    </div>
                  )}
                </div>
              </Link>

              {/* Product Info - Compact */}
              <div className="p-2.5">
                <Link to={`/shop/product/${product._id}`}>
                  <h3 className="font-medium text-xs mb-1 line-clamp-2 text-text hover:text-primary transition-colors leading-tight">
                    {product.product_name}
                  </h3>
                </Link>
                
                {/* Rating - Smaller */}
                <div className="mb-1.5">
                  <StarRating
                    rating={product.product_rating || 0}
                    size="xs"
                    showText={false}
                  />
                </div>

                {/* Price - Compact */}
                <div className="mb-2">
                  <div className="flex items-center gap-1">
                    <span className="text-sm font-bold text-primary">
                      {formatPrice(discountedPrice)}
                    </span>
                    {discount > 0 && (
                      <span className="text-xs text-gray-500 line-through">
                        {formatPrice(product.product_price)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Add to Cart Button - Smaller */}
                {inStock ? (
                  <button
                    onClick={(e) => handleAddToCart(e, product._id)}
                    className="w-full bg-primary text-white text-xs py-1.5 rounded-md hover:bg-primary/90 transition-colors font-medium"
                  >
                    <i className="fas fa-shopping-cart mr-1"></i>
                    Add to Cart
                  </button>
                ) : (
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      toast.info("We'll notify you when this product is back in stock!");
                    }}
                    className="w-full bg-gray-400 text-white text-xs py-1.5 rounded-md font-medium"
                  >
                    <i className="fas fa-bell mr-1"></i>
                    Out of Stock
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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

        const productInWishlist = isInWishlist(product._id);

        return (
          <div key={product._id} className="group relative h-full">
            <Link to={`/shop/product/${product._id}`} className="block h-full">
              <div className="bg-gray-50 dark:bg-gray-800 text-text rounded-lg border border-gray-300 dark:border-gray-600 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group-hover:scale-[1.01] h-full flex flex-col group border-b-4 border-transparent hover:border-primary">
                {/* Product Image */}
                <div className="relative aspect-square bg-gray-50 flex-shrink-0">
                  <img
                    src={
                      product.product_image ||
                      product.product_images?.[0] ||
                      "https://placehold.co/300x400?text=No+Image"
                    }
                    alt={product.product_name}
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
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

                {/* Product Info */}
                <div className="p-4 flex-1 flex flex-col justify-between min-h-[140px]">
                  <div className="flex-1">
                    <h3 className="font-medium mb-2 line-clamp-2 h-12 overflow-hidden leading-6">
                      {product.product_name}
                    </h3>

                    <div className="h-5 mb-2">
                      {product.product_brand && (
                        <p className="text-xs text-text/70">
                          {product.product_brand}
                        </p>
                      )}
                    </div>

                    <div className="mb-3 h-4">
                      <StarRating
                        rating={product.product_rating || 0}
                        size="sm"
                        showText={false}
                      />
                    </div>
                  </div>

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

            {/* Hover Add to Cart Button for Desktop */}
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
      })}
    </div>
  );
};

export default Products;