import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { AppContent } from "./AppContent";

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const { isLoggedIn, backendUrl } = useContext(AppContent);
  const [cartItems, setCartItems] = useState([]);
  const [cartSummary, setCartSummary] = useState({
    totalItems: 0,
    totalPrice: 0,
    discount: 0,
    finalPrice: 0,
  });
  const [loading, setLoading] = useState(false);
  const [pendingOperations, setPendingOperations] = useState(new Set());
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

  const updateCartOptimistically = (newItems, newSummary) => {
    setCartItems(newItems);
    setCartSummary(newSummary);
  };

  const calculateSummary = (items) => {
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = items.reduce((sum, item) => {
      const price = item.product_id?.product_price || 0;
      return sum + price * item.quantity;
    }, 0);

    return {
      totalItems,
      totalPrice,
      discount: 0,
      finalPrice: totalPrice,
    };
  };

  const fetchCart = async () => {
    if (!isLoggedIn) {
      setCartItems([]);
      setCartSummary({
        totalItems: 0,
        totalPrice: 0,
        discount: 0,
        finalPrice: 0,
      });
      return;
    }
    try {
      const response = await axios.get(`${backendUrl}/cart`, {
        withCredentials: true,
      });
      if (response.data.success) {
        const items = response.data.cartItems || [];
        setCartItems(items);
        setCartSummary(calculateSummary(items));
      }
    } catch (error) {}
  };

  const addToCart = async (productId, quantity = 1) => {
    const loadingKey = `add-${productId}`;
    if (!isLoggedIn) {
      toast.error("Please login to add items to cart");
      return { success: false };
    }
    setButtonLoading(loadingKey, true);
    toast.success("Added to cart!");
    try {
      const response = await axios.post(
        `${backendUrl}/cart/add`,
        {
          product_id: productId,
          quantity: quantity,
        },
        { withCredentials: true }
      );
      if (response.data.success) {
        await fetchCart();
        return { success: true };
      } else {
        toast.error(response.data.message || "Failed to add product to cart");
        await fetchCart();
        return { success: false };
      }
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error("Please login to add items to cart");
      } else {
        toast.error("Failed to add item to cart");
      }
      await fetchCart();
      return { success: false };
    } finally {
      setButtonLoading(loadingKey, false);
    }
  };

  const removeFromCart = async (cartItemId) => {
    const loadingKey = `remove-${cartItemId}`;
    if (!isLoggedIn) {
      toast.error("Please login to modify cart");
      return false;
    }
    setButtonLoading(loadingKey, true);
    const optimisticItems = cartItems.filter((item) => item._id !== cartItemId);
    updateCartOptimistically(
      optimisticItems,
      calculateSummary(optimisticItems)
    );
    toast.success("Item removed from cart");
    try {
      const response = await axios.delete(`${backendUrl}/cart/${cartItemId}`, {
        withCredentials: true,
      });
      if (response.data.success) {
        return true;
      } else {
        await fetchCart();
        toast.error(response.data.message || "Failed to remove item from cart");
        return false;
      }
    } catch (error) {
      await fetchCart();
      toast.error("Failed to remove item from cart");
      return false;
    } finally {
      setButtonLoading(loadingKey, false);
    }
  };

  const updateCartItemOptimistic = async (cartItemId, newQuantity) => {
    const loadingKey = `update-${cartItemId}`;
    if (!isLoggedIn) {
      return false;
    }
    if (newQuantity < 1) {
      return removeFromCart(cartItemId);
    }
    setButtonLoading(loadingKey, true);
    const optimisticItems = cartItems.map((item) =>
      item._id === cartItemId ? { ...item, quantity: newQuantity } : item
    );
    updateCartOptimistically(
      optimisticItems,
      calculateSummary(optimisticItems)
    );
    try {
      const response = await axios.put(
        `${backendUrl}/cart/${cartItemId}`,
        { quantity: newQuantity },
        { withCredentials: true }
      );
      if (response.data.success) {
        return true;
      } else {
        await fetchCart();
        toast.error(response.data.message || "Failed to update quantity");
        return false;
      }
    } catch (error) {
      await fetchCart();
      toast.error("Failed to update quantity");
      return false;
    } finally {
      setButtonLoading(loadingKey, false);
    }
  };

  const updateQuantity = async (cartItemId, newQuantity) => {
    if (!isLoggedIn) {
      toast.error("Please login to modify cart");
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
        await fetchCart();
        return true;
      } else {
        toast.error(response.data.message || "Failed to update quantity");
        return false;
      }
    } catch (error) {
      toast.error("Failed to update quantity");
      return false;
    }
  };

  const clearCart = async () => {
    if (!isLoggedIn) {
      toast.error("Please login to clear cart");
      return false;
    }
    updateCartOptimistically([], {
      totalItems: 0,
      totalPrice: 0,
      discount: 0,
      finalPrice: 0,
    });
    try {
      const response = await axios.post(
        `${backendUrl}/cart/clear`,
        {},
        { withCredentials: true }
      );
      if (response.data.success) {
        return true;
      } else {
        await fetchCart();
        toast.error(response.data.message || "Failed to clear cart");
        return false;
      }
    } catch (error) {
      await fetchCart();
      toast.error("Failed to clear cart");
      return false;
    }
  };

  useEffect(() => {
    fetchCart();
  }, [isLoggedIn]);

  const value = {
    cartItems,
    cartSummary,
    loading,
    addToCart,
    removeFromCart,
    updateQuantity,
    updateCartItemOptimistic,
    clearCart,
    fetchCart,
    getCartItemCount: () => cartSummary.totalItems || 0,
    refreshCart: fetchCart,
    hasPendingUpdates: pendingOperations.size > 0,
    isButtonLoading,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export { CartContext };
export default CartContext;
