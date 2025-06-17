import React, { useState, useEffect, useContext, useRef } from "react";
import { AppContent } from "../../Context/AppContent.jsx";
import { useCart } from "../../Context/CartContext.jsx";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import WishlistItem from "./WishlistItem";
import WishlistEmpty from "./WishlistEmpty";
import WishlistSkeleton from "./WishlistSkeleton";
import PageHeader from "../Common/PageHeader"; // Add this import

function WishlistPage() {
  const { backendUrl, isLoggedIn, userData } = useContext(AppContent);
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const hasFetchedWishlist = useRef(false);

  // Fetch wishlist data from backend
  useEffect(() => {
    if (isLoggedIn && !hasFetchedWishlist.current) {
      fetchWishlist();
      hasFetchedWishlist.current = true;
    } else if (!isLoggedIn) {
      setLoading(false);
    }
  }, [isLoggedIn]);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      console.log("🔄 Fetching wishlist from:", `${backendUrl}/wishlist`);

      const response = await axios.get(`${backendUrl}/wishlist`, {
        withCredentials: true,
      });

      console.log("📊 Wishlist response:", response.data);

      if (response.data.success) {
        setWishlistItems(response.data.wishlist || []);
        console.log(
          "✅ Wishlist items loaded:",
          response.data.wishlist?.length || 0
        );
      } else {
        toast.error(response.data.message || "Failed to fetch wishlist");
      }
    } catch (error) {
      console.error("❌ Error fetching wishlist:", error);
      if (error.response?.status === 401) {
        toast.error("Please login to view your wishlist");
        navigate("/login");
      } else {
        toast.error("Failed to load wishlist items");
      }
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (productId) => {
    try {
      console.log("🗑️ Removing product from wishlist:", productId);

      const response = await axios.delete(
        `${backendUrl}/wishlist/remove/${productId}`,
        {
          withCredentials: true,
        }
      );

      if (response.data.success) {
        setWishlistItems((prevItems) =>
          prevItems.filter((item) => item.product_id._id !== productId)
        );
        toast.success("Item removed from wishlist");
      } else {
        toast.error(response.data.message || "Failed to remove item");
      }
    } catch (error) {
      console.error("❌ Error removing from wishlist:", error);
      toast.error("Failed to remove item from wishlist");
    }
  };

  const handleAddToCart = async (product, quantity = 1) => {
    try {
      // Only call addToCart - it will handle the toast message
      await addToCart(product._id, quantity);
      // Remove the duplicate toast from here
    } catch (error) {
      // Only show error toast if addToCart fails
      toast.error("Failed to add item to cart");
    }
  };

  const handleBuyNow = (product) => {
    console.log("⚡ Buy now product:", product);
    navigate(`/shop/product/${product._id}`);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(price);
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-background text-text">
        <PageHeader title="My Wishlist" breadcrumbs={[{ label: "Wishlist" }]} />
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="text-center py-16">
            <i className="fas fa-sign-in-alt text-6xl text-primary mb-6"></i>
            <h2 className="text-2xl font-bold text-text mb-4">
              Login Required
            </h2>
            <p className="text-text/70 mb-8">
              Please log in to view your wishlist items
            </p>
            <button
              onClick={() => navigate("/login")}
              className="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-lg font-medium transition-colors"
            >
              Login Now
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-background min-h-screen">
        <PageHeader title="My Wishlist" breadcrumbs={[{ label: "Wishlist" }]} />
        <WishlistSkeleton />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-text">
      <PageHeader title="My Wishlist" breadcrumbs={[{ label: "Wishlist" }]} />

      <div className="max-w-6xl mx-auto px-3 md:px-4 lg:px-6 py-4 md:py-8">
        {/* Sub-header with item count */}
        <div className="mb-4 md:mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 md:gap-4">
            <div>
              <p className="text-text/70 text-sm">
                {wishlistItems.length > 0
                  ? `${wishlistItems.length} item${
                      wishlistItems.length !== 1 ? "s" : ""
                    } saved for later`
                  : "No items in your wishlist yet"}
              </p>
            </div>
          </div>
        </div>

        {/* Wishlist Content */}
        {wishlistItems.length === 0 ? (
          <WishlistEmpty />
        ) : (
          <div className="space-y-4 md:space-y-6">
            {/* Items Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4 lg:gap-6">
              {wishlistItems.map((item) => (
                <WishlistItem
                  key={item._id}
                  item={item}
                  onRemove={removeFromWishlist}
                  onAddToCart={handleAddToCart}
                  onBuyNow={handleBuyNow}
                  formatPrice={formatPrice}
                />
              ))}
            </div>

            {/* Action Bar */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-3 md:p-4">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div className="flex items-center gap-2 md:gap-3">
                  <i className="fas fa-info-circle text-primary text-sm"></i>
                  <span className="text-xs md:text-sm text-text/70">
                    Items in your wishlist are saved across all devices
                  </span>
                </div>
                <div className="flex flex-col md:flex-row gap-2 md:gap-3">
                  <button
                    onClick={() => navigate("/shop")}
                    className="px-3 md:px-4 py-2 border border-gray-200 dark:border-gray-600 text-text hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors text-xs md:text-sm font-medium"
                  >
                    Continue Shopping
                  </button>
                  <button
                    onClick={() => {
                      // Add all items to cart - only one toast per item from CartContext
                      wishlistItems.forEach((item) => {
                        handleAddToCart(item.product_id, 1);
                      });
                    }}
                    className="bg-primary hover:bg-primary/90 text-white px-3 md:px-4 py-2 rounded-lg font-medium transition-colors text-xs md:text-sm"
                  >
                    <i className="fas fa-shopping-cart mr-1 md:mr-2"></i>
                    Add All to Cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default WishlistPage;
