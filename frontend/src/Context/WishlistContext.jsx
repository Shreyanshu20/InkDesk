import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { AppContent } from "./AppContent";

const WishlistContext = createContext();

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
};

export const WishlistProvider = ({ children }) => {
  const { isLoggedIn, backendUrl } = useContext(AppContent);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [buttonLoadingStates, setButtonLoadingStates] = useState(new Map());

  const setButtonLoading = (key, isLoading) => {
    setButtonLoadingStates((prev) => {
      const newMap = new Map(prev);
      if (isLoading) {
        newMap.set(key, true);
      } else {
        newMap.delete(key);
      }
      return newMap;
    });
  };

  const isButtonLoading = (key) => buttonLoadingStates.has(key);

  const fetchWishlist = async () => {
    if (!isLoggedIn) {
      setWishlistItems([]);
      return;
    }
    try {
      const response = await axios.get(`${backendUrl}/wishlist`, {
        withCredentials: true,
      });
      if (response.data.success) {
        setWishlistItems(response.data.wishlist || []);
      }
    } catch (error) {}
  };

  const isInWishlist = (productId) => {
    if (!productId || wishlistItems.length === 0) {
      return false;
    }
    return wishlistItems.some((item) => {
      const itemProductId1 = item.product_id?._id;
      const itemProductId2 = item.product_id;
      return (
        itemProductId1 === productId ||
        itemProductId2 === productId ||
        (typeof itemProductId2 === "object" &&
          itemProductId2?._id === productId)
      );
    });
  };

  const getWishlistItemCount = () => wishlistItems.length;

  const addToWishlist = async (productId) => {
    const loadingKey = `add-wishlist-${productId}`;
    if (!isLoggedIn) {
      toast.error("Please login to add items to wishlist");
      return { success: false };
    }
    setButtonLoading(loadingKey, true);
    try {
      const response = await axios.post(
        `${backendUrl}/wishlist/add`,
        { product_id: productId },
        { withCredentials: true }
      );
      if (response.data.success) {
        toast.success("Added to wishlist!");
        if (response.data.wishlist) {
          setWishlistItems(response.data.wishlist);
        } else {
          await fetchWishlist();
        }
        return { success: true };
      } else {
        toast.error(response.data.message || "Failed to add to wishlist");
        return { success: false };
      }
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error("Please login to add items to wishlist");
      } else {
        toast.error("Failed to add to wishlist");
      }
      return { success: false };
    } finally {
      setButtonLoading(loadingKey, false);
    }
  };

  const removeFromWishlist = async (productId) => {
    const loadingKey = `remove-wishlist-${productId}`;
    if (!isLoggedIn) {
      toast.error("Please login to modify wishlist");
      return { success: false };
    }
    setButtonLoading(loadingKey, true);
    try {
      const response = await axios.delete(
        `${backendUrl}/wishlist/remove/${productId}`,
        { withCredentials: true }
      );
      if (response.data.success) {
        toast.success("Removed from wishlist");
        if (response.data.wishlist) {
          setWishlistItems(response.data.wishlist);
        } else {
          await fetchWishlist();
        }
        return { success: true };
      } else {
        toast.error(response.data.message || "Failed to remove from wishlist");
        return { success: false };
      }
    } catch (error) {
      toast.error("Failed to remove from wishlist");
      return { success: false };
    } finally {
      setButtonLoading(loadingKey, false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, [isLoggedIn, backendUrl]);

  const value = {
    wishlistItems,
    loading,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    fetchWishlist,
    isButtonLoading,
    getWishlistItemCount,
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};

export { WishlistContext };
export default WishlistContext;
