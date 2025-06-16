import React from "react";
import { useWishlist } from "../../../Context/WishlistContext.jsx";
import StarRating from "../../Common/StarRating";
import PriceDisplay from "../../Common/PriceDisplay";
import QuantitySelector from "../../Common/QuantitySelector";
import Button from "../../Common/Button";
import InfoIcon from "../../Common/InfoIcon";
import SocialShare from "../../Common/SocialShare";
import { toast } from "react-toastify";

function Details({
  product,
  selectedImage,
  setSelectedImage,
  quantity,
  handleQuantityChange,
  handleInputChange,
  formatPrice,
  handleAddToCart,
  handleBuyNow,
  cartLoading,
}) {
  const {
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    loading: wishlistLoading,
  } = useWishlist();

  const productInWishlist = isInWishlist(product._id || product.id);

  const handleWishlistToggle = async () => {
    if (productInWishlist) {
      await removeFromWishlist(product._id || product.id);
    } else {
      await addToWishlist(product._id || product.id);
    }
  };

  return (
    <div className="bg-background">
      <div className="max-w-7xl mx-auto px-6 py-2 md:py-5">
        <div className="grid lg:grid-cols-2 gap-2 lg:gap-16">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="aspect-square rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 relative border border-gray-200 dark:border-gray-700">
              <img
                src={
                  product.product_images && product.product_images.length > 0
                    ? product.product_images[selectedImage]?.url
                    : product.images && product.images.length > 0
                    ? product.images[selectedImage]?.url || product.images[selectedImage]
                    : product.product_image || "/placeholder-image.jpg"
                }
                alt={product.product_name || product.name}
                className="w-full h-full object-cover"
              />

              {(product.product_stock <= 0 || product.stock <= 0) && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                  <div className="bg-red-600 text-white px-4 py-2 rounded-lg font-medium">
                    Out of Stock
                  </div>
                </div>
              )}

              {(product.product_discount > 0 || product.discount > 0) && (
                <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1.5 rounded-full text-xs md:text-sm font-bold shadow-lg">
                  {product.product_discount || product.discount}% OFF
                </div>
              )}
            </div>
            
            {(() => {
              const imageArray = product.product_images && product.product_images.length > 0
                ? product.product_images
                : product.images && product.images.length > 0
                ? product.images
                : [];

              if (imageArray.length > 1) {
                return (
                  <div className="flex gap-3 overflow-x-auto pb-2">
                    {imageArray.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImage(index)}
                        className={`flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                          selectedImage === index 
                            ? "border-primary" 
                            : "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500"
                        }`}
                      >
                        <img
                          src={image.url || image}
                          alt={`${product.product_name || product.name} ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                );
              }
              return null;
            })()}
          </div>

          {/* Product Info */}
          <div className="space-y-4 md:space-y-6">
            <div className="space-y-2 md:space-y-4">
              <h1 className="text-xl md:text-3xl lg:text-4xl font-bold text-text leading-tight">
                {product.name}
              </h1>
              
              <div className="flex items-center gap-3">
                <span className="text-xs md:text-sm text-gray-500 dark:text-gray-400">by</span>
                <span className="text-xs md:text-base font-semibold text-primary bg-primary/10 dark:bg-primary/20 px-3 py-1.5 rounded-full">
                  {product.author}
                </span>
              </div>
              
              <div className="bg-gray-100 dark:bg-gray-800 p-2 md:p-4 rounded-xl border border-gray-200 dark:border-gray-700">
                <StarRating
                  rating={product.rating}
                  reviewCount={product.reviewCount}
                  size="sm"
                  showText={true}
                />
              </div>
              
              <div className="bg-gradient-to-r from-primary/5 to-secondary/5 dark:from-primary/10 dark:to-secondary/10 p-2 md:p-4 rounded-xl border border-primary/10 dark:border-primary/20">
                <PriceDisplay
                  price={product.price}
                  originalPrice={product.originalPrice}
                  discount={product.discount}
                  size="lg"
                  formatPrice={formatPrice}
                />
              </div>
            </div>

            {product.description && (
              <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
                <p className="text-sm md:text-base text-text/80 leading-relaxed">{product.description}</p>
              </div>
            )}

            <div className="space-y-4">
              <div className="flex items-center gap-2 md:gap-4">
                <span className="text-sm md:text-base font-medium text-text">Quantity:</span>
                <QuantitySelector
                  quantity={quantity}
                  onChange={(newQuantity) => {
                    const event = { target: { value: newQuantity } };
                    handleInputChange(event);
                  }}
                  min={1}
                  max={product.stock}
                />
                <span className="text-xs md:text-sm text-gray-500 dark:text-gray-400">
                  {product.stock} available
                </span>
              </div>

              <div className="flex flex-col md:flex-row gap-3">
                <button
                  onClick={() => {
                    if (product.stock <= 0) {
                      toast.info("We'll notify you when this product is back in stock!");
                    } else {
                      handleAddToCart();
                    }
                  }}
                  disabled={cartLoading}
                  className={`flex-1 py-3 px-6 rounded-xl text-sm md:text-base font-medium transition-all duration-200 flex items-center justify-center gap-3 ${
                    product.stock > 0 && !cartLoading
                      ? "bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-text border-2 border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
                      : "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 border-2 border-gray-300 dark:border-gray-600"
                  }`}
                >
                  <i className={`fas ${product.stock > 0 ? "fa-shopping-cart" : "fa-bell"}`}></i>
                  {cartLoading ? "Adding..." : product.stock > 0 ? "Add to Cart" : "Notify Me"}
                </button>

                <button
                  onClick={handleBuyNow}
                  disabled={product.stock <= 0 || cartLoading}
                  className={`flex-1 py-3 px-6 rounded-xl text-sm md:text-base font-medium transition-all duration-200 flex items-center justify-center gap-3 ${
                    product.stock > 0 && !cartLoading
                      ? "bg-primary hover:bg-primary/90 text-white shadow-lg hover:shadow-xl"
                      : "bg-gray-400 dark:bg-gray-600 text-gray-300 dark:text-gray-400 cursor-not-allowed"
                  }`}
                >
                  <i className="fas fa-bolt"></i>
                  {cartLoading ? "Processing..." : product.stock > 0 ? "Buy Now" : "Out of Stock"}
                </button>
              </div>

              <button
                onClick={handleWishlistToggle}
                disabled={wishlistLoading}
                className={`w-full py-3 px-6 rounded-xl text-sm md:text-base font-medium transition-all duration-200 flex items-center justify-center gap-3 border-2 ${
                  productInWishlist
                    ? "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-600 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30"
                    : "bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-600 text-text hover:bg-gray-200 dark:hover:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-500"
                }`}
              >
                <i className={`${productInWishlist ? "fas fa-heart" : "far fa-heart"}`}></i>
                {wishlistLoading
                  ? "Loading..."
                  : productInWishlist
                  ? "Remove from Wishlist"
                  : "Add to Wishlist"}
              </button>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-6 space-y-3">
              <div className="flex items-center gap-3 text-xs md:text-sm text-gray-600 dark:text-gray-400">
                <i className="fas fa-truck text-primary"></i>
                <span>Free shipping on orders over ₹999</span>
              </div>
              <div className="flex items-center gap-3 text-xs md:text-sm text-gray-600 dark:text-gray-400">
                <i className="fas fa-undo text-primary"></i>
                <span>10-day return policy</span>
              </div>
              <div className="flex items-center gap-3 text-xs md:text-sm text-gray-600 dark:text-gray-400">
                <i className="fas fa-shield-alt text-primary"></i>
                <span>2-year warranty included</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Details;