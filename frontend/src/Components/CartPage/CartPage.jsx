import React, { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import FreeShippingIndicator from "./components/FreeShippingProgressBar";
import CartItems from "./components/CartItems";
import CouponSection from "./components/CouponSection";
import OrderSummary from "./components/OrderSummary";
import EmptyCart from "./components/EmptyCart";
import PageHeader from "../Common/PageHeader";
import { AppContent } from "../../Context/AppContent";
import { useCart } from "../../Context/CartContext";

function CartPage() {
  const navigate = useNavigate();
  const { isLoggedIn, loading } = useContext(AppContent);
  const {
    cartItems: backendCartItems,
    cartSummary,
    isLoading,
    updateCartItemOptimistic,
    removeFromCart,
    fetchCart,
  } = useCart();

  useEffect(() => {
    if (loading) return;
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }
    fetchCart();
  }, [isLoggedIn, navigate, loading, fetchCart]);

  const formatPrice = (price) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price || 0);

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

  const subtotal = cartSummary?.totalPrice || 0;
  const freeShippingThreshold = 499;
  const shipping = subtotal >= freeShippingThreshold ? 0 : 50;
  const amountForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const freeShippingProgress = Math.min(
    100,
    (subtotal / freeShippingThreshold) * 100
  );
  const tax = subtotal * 0.18;
  const total = subtotal + shipping + tax;

  const handleQuantityChange = (cartItemId, amount) => {
    const currentItem = transformedCartItems.find(
      (item) => item.id === cartItemId
    );
    if (!currentItem) return;
    const newQuantity = currentItem.quantity + amount;
    if (newQuantity <= 0 || newQuantity > currentItem.stock) return;
    updateCartItemOptimistic(cartItemId, newQuantity);
  };

  const handleInputChange = (cartItemId, value) => {
    const quantity = parseInt(value) || 1;
    const currentItem = transformedCartItems.find(
      (item) => item.id === cartItemId
    );
    if (!currentItem) return;
    if (quantity <= 0 || quantity > currentItem.stock) return;
    updateCartItemOptimistic(cartItemId, quantity);
  };

  const removeItem = (cartItemId) => {
    removeFromCart(cartItemId);
  };

  if (loading) {
    return (
      <div className="bg-background min-h-screen">
        <PageHeader
          title="Shopping Cart"
          breadcrumbs={[{ label: "Shopping Cart" }]}
        />
        <div className="container mx-auto px-3 md:px-4 py-4 md:py-8 max-w-7xl">
          <div className="flex justify-center items-center py-10 md:py-20">
            <div className="text-center">
              <i className="fas fa-spinner fa-spin text-3xl md:text-4xl text-primary mb-4"></i>
              <p className="text-text text-sm md:text-base">Loading...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="bg-background min-h-screen">
        <PageHeader
          title="Shopping Cart"
          breadcrumbs={[{ label: "Shopping Cart" }]}
        />
        <div className="container mx-auto px-3 md:px-4 py-4 md:py-8 max-w-7xl">
          <div className="flex justify-center items-center py-10 md:py-20">
            <div className="text-center">
              <i className="fas fa-spinner fa-spin text-3xl md:text-4xl text-primary mb-4"></i>
              <p className="text-text text-sm md:text-base">
                Loading your cart...
              </p>
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
      <section className="bg-background">
        <div className="container mx-auto px-3 md:px-4 py-4 md:py-8 max-w-7xl">
          {transformedCartItems.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
              <div className="lg:col-span-2 space-y-4 md:space-y-6">
                <FreeShippingIndicator
                  amountForFreeShipping={amountForFreeShipping}
                  freeShippingProgress={freeShippingProgress}
                  formatPrice={formatPrice}
                />
                <CartItems
                  cartItems={transformedCartItems}
                  handleQuantityChange={handleQuantityChange}
                  handleInputChange={handleInputChange}
                  removeItem={removeItem}
                  formatPrice={formatPrice}
                />
                <CouponSection />
              </div>
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
      </section>
    </div>
  );
}

export default CartPage;
