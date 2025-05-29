import React, { useState, useEffect, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import FreeShippingIndicator from "./components/FreeShippingProgressBar";
import CartItems from "./components/CartItems";
import CouponSection from "./components/CouponSection";
import OrderSummary from "./components/OrderSummary";
import EmptyCart from "./components/EmptyCart";
import RelatedProducts from "./components/RelatedProducts";
import PageHeader from "../Common/PageHeader";
import { AppContent } from "../../Context/AppContent";
import { useCart } from "../../Context/CartContext";

function CartPage() {
  const navigate = useNavigate();
  const { isLoggedIn } = useContext(AppContent);
  const {
    cartItems: backendCartItems,
    cartSummary,
    isLoading,
    updateCartItemOptimistic, // New function
    removeFromCart,
    fetchCart,
    hasPendingUpdates, // New flag
  } = useCart();

  // Check authentication on component mount
  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    fetchCart();
  }, [isLoggedIn, navigate]);

  // Format price in Indian Rupees
  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price || 0);
  };

  // Transform backend cart items to frontend format
  const transformedCartItems =
    backendCartItems?.map((item) => ({
      id: item._id,
      name: item.product_id?.product_name || "Unknown Product",
      brand: item.product_id?.product_brand || "Unknown Brand",
      image:
        item.product_id?.product_image ||
        "https://placehold.co/150x200?text=No+Image",
      price: item.product_id?.product_price || 0,
      quantity: item.quantity,
      stock: item.product_id?.product_stock || 0,
      productId: item.product_id?._id,
      totalPrice: item.price,
    })) || [];

  // Calculate subtotal from backend data
  const subtotal = cartSummary?.totalPrice || 0;

  // Free shipping threshold
  const freeShippingThreshold = 99;

  // Shipping cost
  const shipping = subtotal >= freeShippingThreshold ? 0 : 50;

  // Amount needed for free shipping
  const amountForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);

  // Progress percentage for free shipping
  const freeShippingProgress = Math.min(
    100,
    (subtotal / freeShippingThreshold) * 100
  );

  // Tax calculation (GST 18%)
  const tax = subtotal * 0.18;

  // Total cost
  const total = subtotal + shipping + tax;

  // Handle quantity change - SILENT UPDATE
  const handleQuantityChange = async (cartItemId, amount) => {
    const currentItem = transformedCartItems.find(
      (item) => item.id === cartItemId
    );
    if (!currentItem) return;

    const newQuantity = currentItem.quantity + amount;

    if (newQuantity <= 0 || newQuantity > currentItem.stock) {
      return; // Silent validation - no toast
    }

    updateCartItemOptimistic(cartItemId, newQuantity);
  };

  // Handle direct quantity input - SILENT UPDATE
  const handleInputChange = async (cartItemId, value) => {
    const quantity = parseInt(value) || 1;
    const currentItem = transformedCartItems.find(
      (item) => item.id === cartItemId
    );

    if (!currentItem) return;

    if (quantity <= 0 || quantity > currentItem.stock) {
      return; // Silent validation - no toast
    }

    updateCartItemOptimistic(cartItemId, quantity);
  };

  // Remove item from cart - SILENT
  const removeItem = async (cartItemId) => {
    await removeFromCart(cartItemId);
    // No success toast needed
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="bg-background min-h-screen">
        <PageHeader
          title="Shopping Cart"
          breadcrumbs={[{ label: "Shopping Cart" }]}
        />
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <div className="flex justify-center items-center py-20">
            <div className="text-center">
              <i className="fas fa-spinner fa-spin text-4xl text-primary mb-4"></i>
              <p className="text-text">Loading your cart...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen">
      <PageHeader
        title="Shopping Cart"
        breadcrumbs={[{ label: "Shopping Cart" }]}
      />

      <section className="bg-gradient-to-b from-background to-[#f8f5e6] to-90%">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          {transformedCartItems.length > 0 ? (
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                {/* Free Shipping Progress Bar */}
                <FreeShippingIndicator
                  amountForFreeShipping={amountForFreeShipping}
                  freeShippingProgress={freeShippingProgress}
                  formatPrice={formatPrice}
                />

                {/* Cart Items */}
                <CartItems
                  cartItems={transformedCartItems}
                  handleQuantityChange={handleQuantityChange}
                  handleInputChange={handleInputChange}
                  removeItem={removeItem}
                  formatPrice={formatPrice}
                />

                {/* Coupon Section */}
                <CouponSection />
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <OrderSummary
                  subtotal={subtotal}
                  shipping={shipping}
                  tax={tax}
                  total={total}
                  formatPrice={formatPrice}
                  amountForFreeShipping={amountForFreeShipping}
                  cartItems={transformedCartItems}
                />
              </div>
            </div>
          ) : (
            <EmptyCart />
          )}
        </div>

        {/* Related Products Section */}
        <RelatedProducts formatPrice={formatPrice} />
      </section>
    </div>
  );
}

export default CartPage;
