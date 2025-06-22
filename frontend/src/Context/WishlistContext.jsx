import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { AppContent } from './AppContent';

const WishlistContext = createContext();

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

export const WishlistProvider = ({ children }) => {
  const { isLoggedIn, backendUrl } = useContext(AppContent);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [buttonLoadingStates, setButtonLoadingStates] = useState(new Map());

  const setButtonLoading = (key, isLoading) => {
    setButtonLoadingStates(prev => {
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

  // Fetch wishlist
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
        setWishlistItems(response.data.wishlistItems || []);
      }
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      if (error.response?.status !== 401) {
        // toast.error('Failed to load wishlist');
      }
    }
  };

  // Check if product is in wishlist
  const isInWishlist = (productId) => {
    return wishlistItems.some(item => item.product_id?._id === productId || item.product_id === productId);
  };

  // Optimistic add to wishlist
  const addToWishlist = async (productId) => {
    const loadingKey = `add-wishlist-${productId}`;
    
    if (!isLoggedIn) {
      toast.error('Please login to add items to wishlist');
      return { success: false };
    }

    setButtonLoading(loadingKey, true);

    // Optimistic update - add immediately
    const optimisticItem = {
      _id: `temp-${Date.now()}`,
      product_id: productId,
      addedAt: new Date().toISOString()
    };
    setWishlistItems(prev => [...prev, optimisticItem]);
    
    // Show success immediately
    toast.success('Added to wishlist!');

    try {
      const response = await axios.post(
        `${backendUrl}/wishlist/add`,
        { product_id: productId },
        { withCredentials: true }
      );

      if (response.data.success) {
        // Refresh to get accurate data
        await fetchWishlist();
        return { success: true };
      } else {
        // Revert optimistic update
        setWishlistItems(prev => prev.filter(item => item._id !== optimisticItem._id));
        toast.error(response.data.message || 'Failed to add to wishlist');
        return { success: false };
      }
    } catch (error) {
      console.error('Add to wishlist error:', error);
      // Revert optimistic update
      setWishlistItems(prev => prev.filter(item => item._id !== optimisticItem._id));
      
      if (error.response?.status === 401) {
        toast.error('Please login to add items to wishlist');
      } else {
        toast.error('Failed to add to wishlist');
      }
      return { success: false };
    } finally {
      setButtonLoading(loadingKey, false);
    }
  };

  // Optimistic remove from wishlist
  const removeFromWishlist = async (productId) => {
    const loadingKey = `remove-wishlist-${productId}`;
    
    if (!isLoggedIn) {
      toast.error('Please login to modify wishlist');
      return { success: false };
    }

    setButtonLoading(loadingKey, true);

    // Optimistic update - remove immediately
    const originalItems = [...wishlistItems];
    const optimisticItems = wishlistItems.filter(item => 
      item.product_id?._id !== productId && item.product_id !== productId
    );
    setWishlistItems(optimisticItems);
    
    // Show success immediately
    toast.success('Removed from wishlist');

    try {
      const response = await axios.delete(
        `${backendUrl}/wishlist/remove/${productId}`,
        { withCredentials: true }
      );

      if (response.data.success) {
        // Keep the optimistic update
        return { success: true };
      } else {
        // Revert optimistic update
        setWishlistItems(originalItems);
        toast.error(response.data.message || 'Failed to remove from wishlist');
        return { success: false };
      }
    } catch (error) {
      console.error('Remove from wishlist error:', error);
      // Revert optimistic update
      setWishlistItems(originalItems);
      toast.error('Failed to remove from wishlist');
      return { success: false };
    } finally {
      setButtonLoading(loadingKey, false);
    }
  };

  // Fetch wishlist when user logs in/out
  useEffect(() => {
    fetchWishlist();
  }, [isLoggedIn]);

  const value = {
    wishlistItems,
    loading,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    fetchWishlist,
    isButtonLoading,
  };

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
};

export { WishlistContext };
export default WishlistContext;