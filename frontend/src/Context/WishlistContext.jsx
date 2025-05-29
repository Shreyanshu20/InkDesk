import React, { createContext, useContext, useState, useEffect } from 'react';
import { AppContent } from './AppContent.jsx';
import axios from 'axios';
import { toast } from 'react-toastify';

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
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch wishlist from backend
  const fetchWishlist = async () => {
    if (!isLoggedIn) {
      setWishlist([]);
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get(`${backendUrl}/wishlist`, {
        withCredentials: true,
      });

      if (response.data.success) {
        setWishlist(response.data.wishlist || []);
      }
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      if (error.response?.status !== 401) {
        toast.error('Failed to load wishlist');
      }
    } finally {
      setLoading(false);
    }
  };

  // Add item to wishlist
  const addToWishlist = async (productId) => {
    if (!isLoggedIn) {
      toast.error('Please login to add items to wishlist');
      return false;
    }

    try {
      const response = await axios.post(
        `${backendUrl}/wishlist/add`,
        { product_id: productId },
        { withCredentials: true }
      );

      if (response.data.success) {
        setWishlist(response.data.wishlist || []);
        toast.success('Added to wishlist');
        return true;
      } else {
        toast.error(response.data.message || 'Failed to add to wishlist');
        return false;
      }
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      toast.error(error.response?.data?.message || 'Failed to add to wishlist');
      return false;
    }
  };

  // Remove item from wishlist
  const removeFromWishlist = async (productId) => {
    if (!isLoggedIn) {
      toast.error('Please login to modify wishlist');
      return false;
    }

    try {
      const response = await axios.delete(
        `${backendUrl}/wishlist/remove/${productId}`,
        { withCredentials: true }
      );

      if (response.data.success) {
        setWishlist(response.data.wishlist || []);
        toast.success('Removed from wishlist');
        return true;
      } else {
        toast.error(response.data.message || 'Failed to remove from wishlist');
        return false;
      }
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      toast.error(error.response?.data?.message || 'Failed to remove from wishlist');
      return false;
    }
  };

  // Check if item is in wishlist
  const isInWishlist = (productId) => {
    console.log('Checking wishlist for product:', productId); // Debug log
    console.log('Current wishlist:', wishlist); // Debug log
    
    const found = wishlist.some(item => {
      const itemId = item.product_id?._id || item.product_id || item._id;
      console.log('Comparing:', itemId, 'with', productId); // Debug log
      return itemId === productId;
    });
    
    console.log('Product found in wishlist:', found); // Debug log
    return found;
  };

  // Get wishlist item count (ONLY FOR NAVBAR)
  const getWishlistItemCount = () => {
    return wishlist.length;
  };

  // Clear wishlist (for logout)
  const clearWishlist = () => {
    setWishlist([]);
  };

  // Fetch wishlist when user logs in
  useEffect(() => {
    if (isLoggedIn) {
      fetchWishlist();
    } else {
      clearWishlist();
    }
  }, [isLoggedIn]);

  const value = {
    wishlist,
    loading,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    getWishlistItemCount, // ONLY THIS FOR NAVBAR
    clearWishlist,
    fetchWishlist,
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};