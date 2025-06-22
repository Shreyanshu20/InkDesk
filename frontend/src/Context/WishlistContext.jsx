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
      console.log('❌ User not logged in, clearing wishlist');
      setWishlistItems([]);
      return;
    }

    console.log('🔄 Starting wishlist fetch...');
    console.log('📍 Backend URL:', backendUrl);
    console.log('🔗 Full URL:', `${backendUrl}/wishlist`);
    console.log('👤 User logged in:', isLoggedIn);

    try {
      const response = await axios.get(`${backendUrl}/wishlist`, {
        withCredentials: true,
      });

      console.log('📦 Full response:', response);
      console.log('📊 Response status:', response.status);
      console.log('📋 Response data:', response.data);

      if (response.data.success) {
        // FIXED: Backend returns 'wishlist' not 'wishlistItems'
        const items = response.data.wishlist || [];
        console.log('✅ Wishlist fetch successful!');
        console.log('📝 Raw wishlist items from server:', items);
        console.log('🔢 Number of items:', items.length);
        
        // Log each item in detail
        items.forEach((item, index) => {
          console.log(`📋 Item ${index}:`, {
            id: item._id,
            product_id: item.product_id,
            product_details: item.product_id,
            full_item: item
          });
        });
        
        setWishlistItems(items);
      } else {
        console.log('❌ Wishlist API returned success: false');
        console.log('📄 Error message:', response.data.message);
      }
    } catch (error) {
      console.error('💥 Error fetching wishlist:', error);
      console.log('📄 Error response:', error.response?.data);
      console.log('🔢 Error status:', error.response?.status);
      console.log('📋 Error headers:', error.response?.headers);
    }
  };

  // Check if product is in wishlist
  const isInWishlist = (productId) => {
    console.log('=== WISHLIST DEBUG ===');
    console.log('Checking product ID:', productId);
    console.log('Wishlist items:', wishlistItems);
    console.log('Wishlist items count:', wishlistItems.length);
    
    if (!productId || wishlistItems.length === 0) {
      console.log('No product ID or empty wishlist');
      return false;
    }
    
    const result = wishlistItems.some(item => {
      // Check multiple possible ID formats based on backend structure
      const itemProductId1 = item.product_id?._id;
      const itemProductId2 = item.product_id;
      
      console.log('Checking item:', {
        item,
        itemProductId1,
        itemProductId2,
        targetProductId: productId
      });
      
      // Try multiple comparisons
      return itemProductId1 === productId || 
             itemProductId2 === productId ||
             (typeof itemProductId2 === 'object' && itemProductId2?._id === productId);
    });
    
    console.log('Final result:', result);
    console.log('=== END DEBUG ===');
    
    return result;
  };

  // Get wishlist item count
  const getWishlistItemCount = () => {
    console.log('Getting wishlist count:', wishlistItems.length);
    return wishlistItems.length;
  };

  // Add to wishlist
  const addToWishlist = async (productId) => {
    const loadingKey = `add-wishlist-${productId}`;
    
    if (!isLoggedIn) {
      toast.error('Please login to add items to wishlist');
      return { success: false };
    }

    setButtonLoading(loadingKey, true);
    
    try {
      const response = await axios.post(
        `${backendUrl}/wishlist/add`,
        { product_id: productId },
        { withCredentials: true }
      );

      console.log('Add to wishlist response:', response.data);

      if (response.data.success) {
        toast.success('Added to wishlist!');
        // Backend returns updated wishlist in the response
        if (response.data.wishlist) {
          setWishlistItems(response.data.wishlist);
        } else {
          // Fallback: fetch fresh data from server
          await fetchWishlist();
        }
        return { success: true };
      } else {
        toast.error(response.data.message || 'Failed to add to wishlist');
        return { success: false };
      }
    } catch (error) {
      console.error('Add to wishlist error:', error);
      
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

  // Remove from wishlist
  const removeFromWishlist = async (productId) => {
    const loadingKey = `remove-wishlist-${productId}`;
    
    if (!isLoggedIn) {
      toast.error('Please login to modify wishlist');
      return { success: false };
    }

    setButtonLoading(loadingKey, true);

    try {
      const response = await axios.delete(
        `${backendUrl}/wishlist/remove/${productId}`,
        { withCredentials: true }
      );

      console.log('Remove from wishlist response:', response.data);

      if (response.data.success) {
        toast.success('Removed from wishlist');
        // Backend returns updated wishlist in the response
        if (response.data.wishlist) {
          setWishlistItems(response.data.wishlist);
        } else {
          // Fallback: fetch fresh data from server
          await fetchWishlist();
        }
        return { success: true };
      } else {
        toast.error(response.data.message || 'Failed to remove from wishlist');
        return { success: false };
      }
    } catch (error) {
      console.error('Remove from wishlist error:', error);
      toast.error('Failed to remove from wishlist');
      return { success: false };
    } finally {
      setButtonLoading(loadingKey, false);
    }
  };

  // Fetch wishlist when user logs in/out
  useEffect(() => {
    console.log('🎯 WishlistContext useEffect triggered');
    console.log('👤 isLoggedIn:', isLoggedIn);
    console.log('🔗 backendUrl:', backendUrl);
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

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
};

export { WishlistContext };
export default WishlistContext;