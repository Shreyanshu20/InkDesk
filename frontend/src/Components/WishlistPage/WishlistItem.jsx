import React from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function WishlistItem({ item, onRemove, onAddToCart, onBuyNow, formatPrice }) {
  const navigate = useNavigate();

  const handleRemove = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onRemove(item.product_id._id);
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // Just call onAddToCart - it will handle the toast message
    onAddToCart(item.product_id, 1);
  };

  const handleBuyNow = (e) => {
    e.preventDefault();
    e.stopPropagation();

    navigate("/checkout", {
      state: {
        buyNowMode: true,
        product: {
          id: item.product_id._id,
          name: item.product_id.product_name,
          brand: item.product_id.product_brand,
          price: item.product_id.product_price,
          image:
            item.product_id.product_image ||
            item.product_id.product_images?.[0] ||
            "https://placehold.co/300x400?text=No+Image",
          quantity: 1,
        },
      },
    });
  };

  const product = item.product_id;

  if (!product) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
        <div className="text-center text-text/50">
          <i className="fas fa-exclamation-triangle text-2xl mb-2"></i>
          <p className="text-sm">Product not available</p>
        </div>
      </div>
    );
  }

  const isOutOfStock = product.product_stock <= 0;
  const discountPercentage = product.product_discount || 0;

  const discountedPrice =
    discountPercentage > 0
      ? product.product_price - (product.product_price * discountPercentage) / 100
      : product.product_price;

  const productImage =
    product.product_images && product.product_images.length > 0
      ? product.product_images[0].url || product.product_images[0]
      : product.product_image || "https://placehold.co/300x400?text=No+Image";

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group h-full flex flex-col">
      <Link to={`/shop/product/${product._id}`} className="block flex-1">
        <div className="relative bg-gray-100 dark:bg-gray-700 aspect-square md:aspect-[3/4]">
          <img
            src={productImage}
            alt={product.product_name}
            className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
            loading="lazy"
            onError={(e) => {
              e.target.src = "https://placehold.co/300x400?text=No+Image";
            }}
          />

          {discountPercentage > 0 && (
            <span className="absolute top-1 right-1 md:top-2 md:right-2 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 md:px-2 md:py-1 rounded-full">
              {discountPercentage}% OFF
            </span>
          )}

          {isOutOfStock && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="bg-black/80 text-white px-2 py-1 md:px-3 md:py-1 rounded-full text-xs md:text-sm font-medium">
                Out of Stock
              </span>
            </div>
          )}
        </div>

        <div className="p-2 md:p-3 flex-1 flex flex-col">
          <div className="flex-1">
            <h3 className="font-medium text-xs md:text-sm mb-1 md:mb-2 line-clamp-2 leading-tight">
              {product.product_name}
            </h3>

            {product.product_brand && (
              <p className="text-xs text-text/60 mb-1 md:mb-2">{product.product_brand}</p>
            )}

            <div className="flex items-center gap-1 text-xs mb-2">
              <div
                className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full ${
                  isOutOfStock ? "bg-red-500" : "bg-green-500"
                }`}
              ></div>
              <span
                className={
                  isOutOfStock
                    ? "text-red-600 dark:text-red-400"
                    : "text-green-600 dark:text-green-400"
                }
              >
                {isOutOfStock
                  ? "Out of Stock"
                  : `${product.product_stock} in stock`}
              </span>
            </div>

            <div className="mb-2">
              <div className="flex items-center gap-1 md:gap-2">
                <span className="text-sm md:text-base font-bold text-primary">
                  {formatPrice(discountedPrice)}
                </span>
                {discountPercentage > 0 && (
                  <span className="text-xs text-gray-500 line-through">
                    {formatPrice(product.product_price)}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </Link>

      <div className="p-2 md:p-3 pt-0 space-y-1.5 md:space-y-2">
        {isOutOfStock ? (
          <button
            onClick={(e) => {
              e.preventDefault();
              toast.info("We'll notify you when this product is back in stock!");
            }}
            className="w-full bg-gray-400 text-white text-xs md:text-sm py-1.5 md:py-2 rounded-md font-medium flex items-center justify-center gap-1 md:gap-2"
          >
            <i className="fas fa-bell text-xs"></i>
            Out of Stock
          </button>
        ) : (
          <button
            onClick={handleAddToCart}
            className="w-full bg-primary text-white text-xs md:text-sm py-1.5 md:py-2 rounded-md hover:bg-primary/90 transition-colors font-medium flex items-center justify-center gap-1 md:gap-2"
          >
            <i className="fas fa-shopping-cart text-xs"></i>
            Add to Cart
          </button>
        )}

        <button
          onClick={handleBuyNow}
          disabled={isOutOfStock}
          className="w-full border border-primary text-primary hover:bg-primary hover:text-white py-1.5 md:py-2 rounded-md font-medium transition-colors text-xs md:text-sm flex items-center justify-center gap-1 md:gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <i className="fas fa-bolt text-xs"></i>
          Buy Now
        </button>

        <button
          onClick={handleRemove}
          className="w-full border border-red-500 text-red-500 hover:bg-red-500 hover:text-white py-1.5 md:py-2 rounded-md font-medium transition-colors text-xs md:text-sm flex items-center justify-center gap-1 md:gap-2"
        >
          <i className="fas fa-heart-broken text-xs"></i>
          <span className="hidden md:inline">Remove from Wishlist</span>
          <span className="md:hidden">Remove</span>
        </button>
      </div>

      <div className="hidden md:block px-3 pb-2">
        <div className="pt-2 border-t border-gray-100 dark:border-gray-700">
          <p className="text-xs text-text/50 text-center">
            <i className="fas fa-heart mr-1"></i>
            Added{" "}
            {new Date(item.createdAt || Date.now()).toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
}

export default WishlistItem;