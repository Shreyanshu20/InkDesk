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
  // ADD WISHLIST FUNCTIONALITY
  const {
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    loading: wishlistLoading,
  } = useWishlist();

  // Check if product is in wishlist
  const productInWishlist = isInWishlist(product._id || product.id);

  // Handle add/remove wishlist
  const handleWishlistToggle = async () => {
    if (productInWishlist) {
      await removeFromWishlist(product._id || product.id);
    } else {
      await addToWishlist(product._id || product.id);
    }
  };

  return (
    <div className="bg-background">
      <div className="container mx-auto px-4 py-2 md:px-30 md:py-8">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-16">
          {/* Left Column - Product Images */}
          <div className="w-full lg:w-1/3">
            <div className="sticky top-24">
              <div className="relative mb-6 rounded-2xl overflow-hidden border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 shadow-lg">
                <img
                  src={
                    // Handle both new multiple images and old single image
                    product.product_images && product.product_images.length > 0
                      ? product.product_images[selectedImage]?.url
                      : product.images && product.images.length > 0
                      ? product.images[selectedImage]?.url || product.images[selectedImage]
                      : product.product_image || "/placeholder-image.jpg"
                  }
                  alt={product.product_name || product.name}
                  className="w-full h-96 object-cover"
                />

                {/* Stock status overlay */}
                {(product.product_stock <= 0 || product.stock <= 0) && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-red-600 text-white px-4 py-2 rounded-lg font-semibold">
                      Out of Stock
                    </div>
                  </div>
                )}

                {/* Discount Badge */}
                {(product.product_discount > 0 || product.discount > 0) && (
                  <div className="absolute top-4 right-4 bg-primary text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                    {product.product_discount || product.discount}% OFF
                  </div>
                )}
              </div>

              {/* Thumbnail Images - UPDATED LOGIC */}
              {(() => {
                // Get images from either product_images (backend) or images (frontend)
                const imageArray = product.product_images && product.product_images.length > 0
                  ? product.product_images
                  : product.images && product.images.length > 0
                  ? product.images
                  : [];

                console.log('🖼️ Rendering thumbnails for images:', imageArray.length);

                // Only show thumbnails if we have more than 1 image
                if (imageArray.length > 1) {
                  return (
                    <div className="flex gap-3 overflow-x-auto p-2">
                      {imageArray.map((image, index) => (
                        <button
                          key={index}
                          className={`w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 hover:opacity-80 transition-all duration-200 ${
                            selectedImage === index
                              ? "ring-2 ring-primary shadow-lg scale-105"
                              : "border-2 border-gray-200 dark:border-gray-600 hover:border-primary/50"
                          }`}
                          onClick={() => {
                            console.log('🖱️ Thumbnail clicked:', index);
                            setSelectedImage(index);
                          }}
                          aria-label={`View product image ${index + 1}`}
                        >
                          <img
                            src={image.url || image}
                            alt={`${product.product_name || product.name} - view ${index + 1}`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              console.error('❌ Thumbnail image failed to load:', image.url || image);
                              e.target.src = "/placeholder-image.jpg";
                            }}
                          />
                        </button>
                      ))}
                    </div>
                  );
                }
                return null;
              })()}
            </div>
          </div>

          {/* Right Column - Product Info */}
          <div className="w-full lg:w-2/3">
            {" "}
            {/* Changed from lg:w-3/5 to lg:w-2/3 to balance the layout */}
            {/* Product Title & Brand */}
            <div className="mb-2">
              <h1 className="text-3xl lg:text-4xl font-bold mb-3 text-text leading-tight">
                {product.name}
              </h1>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-sm text-primary/70">by</span>
                <span className="text-md font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">
                  {product.author}
                </span>
              </div>
            </div>
            {/* Ratings */}
            <div className="mb-2 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600">
              <StarRating
                rating={product.rating}
                reviewCount={product.reviewCount}
                size="lg"
                showText={true}
              />
            </div>
            {/* Price */}
            <div className="mb-2 p-6 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-2xl border border-primary/20">
              <PriceDisplay
                price={product.price}
                originalPrice={product.originalPrice}
                discount={product.discount}
                size="xl"
                formatPrice={formatPrice}
              />

              {/* Price Benefits */}
              <div className="mt-2 flex flex-wrap gap-3 text-sm">
                <div className="flex items-center text-green-600 dark:text-green-400">
                  <i className="fas fa-shipping-fast mr-2"></i>
                  Free shipping over ₹99
                </div>
                <div className="flex items-center text-blue-600 dark:text-blue-400">
                  <i className="fas fa-undo mr-2"></i>
                  30-day returns
                </div>
                <div className="flex items-center text-purple-600 dark:text-purple-400">
                  <i className="fas fa-shield-alt mr-2"></i>
                  1-year warranty
                </div>
              </div>
            </div>
            {/* Quantity & Actions - UPDATED TO USE COMPONENT */}
            <div className="mb-2">
              {/* Quantity Selector */}
              <div className="mb-2 mt-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Quantity
                </label>

                <div className="flex items-center gap-3 mb-4">
                  <QuantitySelector
                    quantity={quantity}
                    onChange={(newQuantity) => {
                      // Update quantity using the existing handler logic
                      const event = { target: { value: newQuantity } };
                      handleInputChange(event);
                    }}
                    min={1}
                    max={product.stock}
                  />

                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {product.stock} available
                  </span>
                </div>
              </div>

              {/* Action Buttons - SIMPLIFIED */}
              <div className="space-y-3">
                {/* Primary Actions */}
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      if (product.stock <= 0) {
                        toast.info("We'll notify you when this product is back in stock!");
                      } else {
                        handleAddToCart();
                      }
                    }}
                    disabled={cartLoading}
                    className={`flex-1 py-4 px-6 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                      product.stock > 0 && !cartLoading
                        ? "bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600"
                        : "bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-500 dark:text-gray-400 border border-gray-300 dark:border-gray-600"
                    }`}
                  >
                    <i
                      className={`fas ${
                        product.stock > 0 ? "fa-shopping-cart" : "fa-bell"
                      }`}
                    ></i>
                    {cartLoading
                      ? "Adding..."
                      : product.stock > 0
                      ? "Add to Cart"
                      : "Notify Me"}
                  </button>

                  <button
                    onClick={handleBuyNow}
                    disabled={product.stock <= 0 || cartLoading}
                    className={`flex-1 py-4 px-6 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                      product.stock > 0 && !cartLoading
                        ? "bg-primary hover:bg-primary/90 text-white shadow-md hover:shadow-lg"
                        : "bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    <i className="fas fa-bolt"></i>
                    {cartLoading
                      ? "Processing..."
                      : product.stock > 0
                      ? "Buy Now"
                      : "Out of Stock"}
                  </button>
                </div>

                {/* Secondary Action */}
                <button
                  onClick={handleWishlistToggle}
                  disabled={wishlistLoading}
                  className={`w-full py-3 px-6 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 border ${
                    productInWishlist
                      ? "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30"
                      : "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                  }`}
                >
                  <i
                    className={`${
                      productInWishlist ? "fas fa-heart" : "far fa-heart"
                    }`}
                  ></i>
                  {wishlistLoading
                    ? "Loading..."
                    : productInWishlist
                    ? "Remove from Wishlist"
                    : "Add to Wishlist"}
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="mt-6 grid grid-cols-3 gap-3 text-xs">
                <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-lg">
                  <i className="fas fa-shipping-fast mb-1 block"></i>
                  <span>Fast Delivery</span>
                </div>
                <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-lg">
                  <i className="fas fa-shield-check mb-1 block"></i>
                  <span>Secure Payment</span>
                </div>
                <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 rounded-lg">
                  <i className="fas fa-medal mb-1 block"></i>
                  <span>Quality Assured</span>
                </div>
              </div>
            </div>
            {/* Product Info Grid */}
            <div className="mb-2 p-6 bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600">
              <h3 className="text-lg font-semibold text-text mb-4 flex items-center">
                <i className="fas fa-tags mr-2 text-primary"></i>
                Product Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InfoIcon icon="barcode" label="SKU" value={product.sku} />

                <InfoIcon
                  icon="tags"
                  label="Category"
                  value={product.category}
                />

                <InfoIcon
                  icon="bookmark"
                  label="Subcategory"
                  value={product.subcategory || "N/A"}
                />

                <InfoIcon icon="industry" label="Brand" value={product.brand} />
              </div>
            </div>
            {/* Social Sharing */}
            <div className="p-6 bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600">
              <h3 className="text-lg font-semibold text-text mb-4 flex items-center">
                <i className="fas fa-share-alt mr-2 text-primary"></i>
                Share this Product
              </h3>
              <SocialShare
                url={`https://inkdesk.com/shop/product/${product.id}`}
                title={product.name}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Details;
