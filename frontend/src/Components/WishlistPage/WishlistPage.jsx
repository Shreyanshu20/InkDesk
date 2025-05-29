import React, { useState, useEffect, useContext, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { AppContent } from "../../Context/AppContent";
import WishlistItem from "./WishlistItem";
import WishlistEmpty from "./WishlistEmpty";
import WishlistSkeleton from "./WishlistSkeleton";
import PageHeader from "../Common/PageHeader";

function WishlistPage() {
  const { backendUrl, isLoggedIn, userData } = useContext(AppContent);
  const navigate = useNavigate();
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const hasFetchedWishlist = useRef(false);

  // Fetch wishlist data from backend
  useEffect(() => {
    if (isLoggedIn && !hasFetchedWishlist.current) {
      hasFetchedWishlist.current = true;
      fetchWishlist();
    } else if (!isLoggedIn) {
      setWishlistItems([]);
      setLoading(false);
    }
  }, [isLoggedIn]);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${backendUrl}/wishlist`, {
        withCredentials: true,
      });

      if (response.data.success) {
        // Transform backend data to match frontend expectations
        const transformedItems = response.data.wishlist.map((item) => ({
          id: item.product_id._id,
          title: item.product_id.product_name,
          imageUrl: item.product_id.product_image || "/api/placeholder/300/300",
          price: item.product_id.product_price,
          oldPrice: item.product_id.product_discount > 0 
            ? item.product_id.product_price 
            : null,
          discountedPrice: item.product_id.product_discount > 0
            ? item.product_id.product_price - (item.product_id.product_price * (item.product_id.product_discount / 100))
            : item.product_id.product_price,
          inStock: item.product_id.product_stock > 0,
          stock: item.product_id.product_stock,
          rating: item.product_id.product_rating || 0,
          brand: item.product_id.product_brand || "",
          dateAdded: new Date(item.createdAt || Date.now()).toISOString().split('T')[0],
          discount: item.product_id.product_discount || 0,
          // Keep original product data for cart operations
          originalProduct: item.product_id
        }));
        
        setWishlistItems(transformedItems);
      } else {
        toast.error(response.data.message || "Failed to fetch wishlist");
      }
    } catch (error) {
      console.error("Error fetching wishlist:", error);
      if (error.response?.status === 401) {
        toast.error("Please login to view your wishlist");
      } else {
        toast.error("Failed to load wishlist. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (itemId) => {
    if (!isLoggedIn) {
      toast.info("Please login to modify your wishlist");
      return;
    }

    try {
      const response = await axios.post(
        `${backendUrl}/wishlist/remove`,
        { product_id: itemId },
        { withCredentials: true }
      );

      if (response.data.success) {
        // Update local state
        setWishlistItems(prevItems => 
          prevItems.filter(item => item.id !== itemId)
        );
        toast.success("Item removed from wishlist");
      } else {
        toast.error(response.data.message || "Failed to remove item from wishlist");
      }
    } catch (error) {
      console.error("Remove from wishlist error:", error);
      toast.error("Failed to remove item. Please try again.");
    }
  };

  const addToCart = async (product, quantity = 1) => {
    if (!isLoggedIn) {
      toast.info("Please login to add items to cart");
      return;
    }

    try {
      const response = await axios.post(
        `${backendUrl}/cart/add`,
        {
          product_id: product.id,
          quantity: quantity,
        },
        {
          withCredentials: true,
        }
      );

      if (response.data.success) {
        toast.success("Product added to cart successfully!");
        return true;
      } else {
        toast.error(response.data.message || "Failed to add product to cart");
        return false;
      }
    } catch (error) {
      console.error("Add to cart error:", error);
      if (error.response?.status === 401) {
        toast.error("Please login to add items to cart");
      } else {
        toast.error("Failed to add product to cart. Please try again.");
      }
      return false;
    }
  };

  // ADD BUY NOW HANDLER
  const handleBuyNow = (product) => {
    if (!isLoggedIn) {
      toast.error("Please login to buy this product");
      navigate("/login");
      return;
    }

    if (!product.inStock) {
      toast.error("This product is out of stock");
      return;
    }

    // Navigate to checkout with product data
    navigate("/checkout", {
      state: {
        buyNowMode: true,
        product: {
          id: product.id,
          name: product.title,
          brand: product.brand,
          price: product.discountedPrice || product.price,
          image: product.imageUrl,
          quantity: 1
        }
      }
    });
  };

  const clearWishlist = async () => {
    if (!isLoggedIn) {
      toast.info("Please login to modify your wishlist");
      return;
    }

    if (wishlistItems.length === 0) {
      toast.info("Your wishlist is already empty");
      return;
    }

    // Show confirmation
    if (!window.confirm("Are you sure you want to clear your entire wishlist?")) {
      return;
    }

    try {
      // Remove all items one by one (since we don't have a clear all endpoint)
      const promises = wishlistItems.map(item => 
        axios.post(
          `${backendUrl}/wishlist/remove`,
          { product_id: item.id },
          { withCredentials: true }
        )
      );

      await Promise.all(promises);
      setWishlistItems([]);
      toast.success("Wishlist cleared successfully");
    } catch (error) {
      console.error("Clear wishlist error:", error);
      toast.error("Failed to clear wishlist. Please try again.");
      // Refresh the wishlist to show accurate state
      fetchWishlist();
    }
  };

  const moveAllToCart = async () => {
    if (!isLoggedIn) {
      toast.info("Please login to add items to cart");
      return;
    }

    if (wishlistItems.length === 0) {
      toast.info("Your wishlist is empty");
      return;
    }

    const inStockItems = wishlistItems.filter(item => item.inStock);
    
    if (inStockItems.length === 0) {
      toast.info("No items in stock to add to cart");
      return;
    }

    try {
      let addedCount = 0;
      const addPromises = inStockItems.map(async (item) => {
        const success = await addToCart(item, 1);
        if (success) {
          addedCount++;
          // Remove from wishlist after successful cart addition
          await axios.post(
            `${backendUrl}/wishlist/remove`,
            { product_id: item.id },
            { withCredentials: true }
          );
        }
        return success;
      });

      await Promise.all(addPromises);

      if (addedCount > 0) {
        // Update local state to remove successfully added items
        setWishlistItems(prevItems => 
          prevItems.filter(item => !item.inStock || !inStockItems.includes(item))
        );
        toast.success(`${addedCount} item${addedCount > 1 ? 's' : ''} moved to cart successfully!`);
      }

      const outOfStockCount = wishlistItems.length - inStockItems.length;
      if (outOfStockCount > 0) {
        toast.info(`${outOfStockCount} out of stock item${outOfStockCount > 1 ? 's' : ''} remained in wishlist`);
      }
    } catch (error) {
      console.error("Move all to cart error:", error);
      toast.error("Some items failed to move to cart. Please try again.");
      // Refresh wishlist to show accurate state
      fetchWishlist();
    }
  };

  // Format price function - UPDATED TO USE INR
  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price || 0);
  };

  // Redirect to login if not authenticated
  if (!isLoggedIn && !loading) {
    return (
      <div className="bg-background min-h-[60vh]">
        <PageHeader 
          title="My Wishlist" 
          breadcrumbs={[
            { label: 'Wishlist' }
          ]}
        />
        <div className="min-h-[40vh] flex flex-col items-center justify-center text-center px-4 py-12">
          <div className="mb-6 text-primary text-7xl opacity-90">
            <i className="fas fa-lock"></i>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100 mb-4">
            Login Required
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-md mx-auto">
            Please login to view and manage your wishlist items.
          </p>
          <Link 
            to="/login"
            className="bg-primary hover:bg-primary/90 text-white px-6 py-3.5 rounded-full shadow transition-colors flex items-center justify-center"
          >
            <i className="fas fa-sign-in-alt mr-2"></i>
            Login to Continue
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-[60vh]">
      <PageHeader 
        title="My Wishlist" 
        breadcrumbs={[
          { label: 'Wishlist' }
        ]}
      />

      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((skeleton) => (
                <WishlistSkeleton key={`skeleton-${skeleton}`} />
              ))}
            </div>
          ) : wishlistItems.length === 0 ? (
            <WishlistEmpty />
          ) : (
            <div>
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
                <div>
                  <div className="border-l-4 border-primary pl-4 mb-2">
                    <span className="text-primary/80 uppercase tracking-wider text-sm font-medium">
                      Your collection
                    </span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-text">
                    {wishlistItems.length} {wishlistItems.length === 1 ? 'Item' : 'Items'} in Your Wishlist
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 mt-2">
                    {wishlistItems.filter(item => item.inStock).length} in stock • {' '}
                    {wishlistItems.filter(item => !item.inStock).length} out of stock
                  </p>
                </div>
                
                <div className="flex flex-wrap gap-3 mt-4 md:mt-0">
                  <button 
                    onClick={moveAllToCart}
                    disabled={wishlistItems.filter(item => item.inStock).length === 0}
                    className={`px-5 py-2.5 rounded-lg shadow-sm transition-colors flex items-center ${
                      wishlistItems.filter(item => item.inStock).length > 0
                        ? "bg-primary hover:bg-primary/90 text-white"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    <i className="fas fa-shopping-cart mr-2"></i>
                    Add All to Cart ({wishlistItems.filter(item => item.inStock).length})
                  </button>
                  
                  <button 
                    onClick={clearWishlist}
                    className="border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 px-5 py-2.5 rounded-lg transition-colors flex items-center"
                  >
                    <i className="fas fa-trash-alt mr-2"></i>
                    Clear Wishlist
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 fade-in">
                {wishlistItems.map((item) => (
                  <WishlistItem 
                    key={item.id} 
                    item={item} 
                    onRemove={removeFromWishlist}
                    onAddToCart={addToCart}
                    onBuyNow={handleBuyNow}
                    formatPrice={formatPrice}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Related Products CTA */}
      <section className="py-16 bg-gradient-to-b from-background to-[#f8f5e6] to-90%">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <span className="text-primary/80 uppercase tracking-wider text-sm font-medium mb-2 inline-block">
              <i className="fas fa-lightbulb mr-2"></i>Discover More
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-text mb-6">
              Recommended For You
            </h2>
            <div className="h-1 w-24 bg-primary mx-auto mb-6"></div>
            <p className="text-text/80 mb-8 leading-relaxed">
              Based on your wishlist items, you might also enjoy these carefully selected products
            </p>
            <Link
              to="/shop"
              className="inline-flex items-center bg-primary text-white hover:bg-primary/90 px-7 py-3.5 rounded-full font-medium transition-colors shadow-md"
            >
              <i className="fas fa-shopping-bag mr-2"></i>
              Explore More Products
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default WishlistPage;
