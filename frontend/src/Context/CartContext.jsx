import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { AppContent } from './AppContent'; // Import AppContent

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const { backendUrl, isLoggedIn } = useContext(AppContent); // Use AppContent context
  const [cartItems, setCartItems] = useState([]);
  const [cartSummary, setCartSummary] = useState({
    totalItems: 0,
    totalPrice: 0,
    discount: 0,
    finalPrice: 0
  });
  const [loading, setLoading] = useState(false);

  // Fetch cart items
  const fetchCart = async () => {
    if (!isLoggedIn) { // Use isLoggedIn instead of isAuthenticated()
      setCartItems([]);
      setCartSummary({
        totalItems: 0,
        totalPrice: 0,
        discount: 0,
        finalPrice: 0
      });
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get(`${backendUrl}/cart`, {
        withCredentials: true,
      });

      if (response.data.success) {
        setCartItems(response.data.cartItems || []);
        
        // Calculate summary
        const items = response.data.cartItems || [];
        const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
        const totalPrice = items.reduce((sum, item) => {
          const price = item.product_id?.product_price || 0;
          return sum + (price * item.quantity);
        }, 0);

        setCartSummary({
          totalItems,
          totalPrice,
          discount: 0,
          finalPrice: totalPrice
        });
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
      if (error.response?.status !== 401) {
        toast.error('Failed to load cart items');
      }
    } finally {
      setLoading(false);
    }
  };

  // Add to cart
  const addToCart = async (productId, quantity = 1) => {
    if (!isLoggedIn) { // Use isLoggedIn instead of isAuthenticated()
      toast.error('Please login to add items to cart');
      return false;
    }

    try {
      const response = await axios.post(
        `${backendUrl}/cart/add`,
        {
          product_id: productId,
          quantity: quantity,
        },
        {
          withCredentials: true,
        }
      );

      if (response.data.success) {
        await fetchCart(); // Refresh cart
        toast.success('Product added to cart successfully!');
        return true;
      } else {
        toast.error(response.data.message || 'Failed to add product to cart');
        return false;
      }
    } catch (error) {
      console.error('Add to cart error:', error);
      if (error.response?.status === 401) {
        toast.error('Please login to add items to cart');
      } else {
        toast.error('Failed to add product to cart. Please try again.');
      }
      return false;
    }
  };

  // Remove from cart
  const removeFromCart = async (cartItemId) => {
    if (!isLoggedIn) { // Use isLoggedIn instead of isAuthenticated()
      toast.error('Please login to modify cart');
      return false;
    }

    try {
      const response = await axios.delete(
        `${backendUrl}/cart/${cartItemId}`,
        { withCredentials: true }
      );

      if (response.data.success) {
        await fetchCart(); // Refresh cart
        toast.success('Item removed from cart');
        return true;
      } else {
        toast.error(response.data.message || 'Failed to remove item from cart');
        return false;
      }
    } catch (error) {
      console.error('Remove from cart error:', error);
      toast.error('Failed to remove item from cart');
      return false;
    }
  };

  // Update quantity
  const updateQuantity = async (cartItemId, newQuantity) => {
    if (!isLoggedIn) { // Use isLoggedIn instead of isAuthenticated()
      toast.error('Please login to modify cart');
      return false;
    }

    if (newQuantity < 1) {
      return removeFromCart(cartItemId);
    }

    try {
      const response = await axios.put(
        `${backendUrl}/cart/${cartItemId}`,
        { quantity: newQuantity },
        { withCredentials: true }
      );

      if (response.data.success) {
        await fetchCart(); // Refresh cart
        return true;
      } else {
        toast.error(response.data.message || 'Failed to update quantity');
        return false;
      }
    } catch (error) {
      console.error('Update quantity error:', error);
      toast.error('Failed to update quantity');
      return false;
    }
  };

  // Clear cart
  const clearCart = async () => {
    if (!isLoggedIn) { // Use isLoggedIn instead of isAuthenticated()
      toast.error('Please login to clear cart');
      return false;
    }

    try {
      const response = await axios.post(
        `${backendUrl}/cart/clear`,
        {},
        { withCredentials: true }
      );

      if (response.data.success) {
        setCartItems([]);
        setCartSummary({
          totalItems: 0,
          totalPrice: 0,
          discount: 0,
          finalPrice: 0
        });
        return true;
      } else {
        toast.error(response.data.message || 'Failed to clear cart');
        return false;
      }
    } catch (error) {
      console.error('Clear cart error:', error);
      toast.error('Failed to clear cart');
      return false;
    }
  };

  // Refresh cart (alias for fetchCart)
  const refreshCart = fetchCart;

  // Get cart item count
  const getCartItemCount = () => {
    return cartSummary.totalItems || 0;
  };

  // Fetch cart when user logs in/out
  useEffect(() => {
    fetchCart();
  }, [isLoggedIn]); // Watch isLoggedIn instead of isAuthenticated

  const value = {
    cartItems,
    cartSummary,
    loading,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    fetchCart,
    refreshCart,
    getCartItemCount
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};