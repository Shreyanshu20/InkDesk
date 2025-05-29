import React from "react";
import { useNavigate } from "react-router-dom";
import OrderServices from "./OrderServices";
import FreeShippingInfo from "./FreeShippingInfo";
import { useCart } from "../../../Context/CartContext";

const OrderSummary = ({
  subtotal,
  shipping,
  tax,
  total,
  formatPrice,
  amountForFreeShipping,
  cartItems,
  hideCheckoutButton = false,
  paymentMethod = null,
}) => {
  const navigate = useNavigate();
  const { syncPendingUpdates, hasPendingUpdates } = useCart();

  const handleCheckout = async () => {
    // Sync any pending cart updates before checkout
    if (hasPendingUpdates) {
      await syncPendingUpdates();
    }

    // Navigate to checkout page
    navigate('/cart/checkout');
  };

  // Calculate final total with COD fee if applicable
  const finalTotal = total + (paymentMethod === "cod" ? 40 : 0);

  return (
    <div className="bg-gray-100 dark:bg-gray-900 rounded-2xl shadow-md border border-gray-300 dark:border-gray-600 sticky top-6">
      <div className="p-6 border-b border-gray-300 dark:border-gray-600">
        <h2 className="text-xl font-bold text-text flex items-center">
          <i className="fas fa-clipboard-list text-primary mr-3"></i>
          Order Summary
        </h2>
      </div>

      {/* Free Shipping Info - Only show on cart page */}
      {!hideCheckoutButton && (
        <FreeShippingInfo amountForFreeShipping={amountForFreeShipping} />
      )}

      <div className="p-6 space-y-4">
        <div className="flex justify-between text-text/70">
          <span>Subtotal</span>
          <span className="font-medium text-text">{formatPrice(subtotal)}</span>
        </div>

        <div className="flex justify-between text-text/70">
          <span>Shipping</span>
          {shipping === 0 ? (
            <span className="text-green-600 font-medium">Free</span>
          ) : (
            <span className="font-medium text-text">
              {formatPrice(shipping)}
            </span>
          )}
        </div>

        <div className="flex justify-between text-text/70">
          <span>GST (18%)</span>
          <span className="font-medium text-text">{formatPrice(tax)}</span>
        </div>

        {/* COD Fee - Only show in checkout when COD is selected */}
        {paymentMethod === "cod" && (
          <div className="flex justify-between text-text/70">
            <span>COD Fee</span>
            <span className="font-medium text-text">₹40</span>
          </div>
        )}

        <div className="pt-4 border-t border-gray-300 dark:border-gray-600">
          <div className="flex justify-between items-center">
            <span className="text-lg font-bold text-text">Total</span>
            <span className="text-xl font-bold text-primary">
              {formatPrice(finalTotal)}
            </span>
          </div>
          <p className="text-xs text-text/60 mt-1">Including 18% GST</p>
        </div>

        {/* Checkout Button - Only show on cart page */}
        {!hideCheckoutButton && (
          <button
            onClick={handleCheckout}
            className="w-full mt-4 bg-primary hover:bg-primary/90 text-white font-medium rounded-md px-5 py-3.5 transition-colors duration-300 flex items-center justify-center shadow-md hover:shadow-lg"
          >
            <i className="fas fa-credit-card mr-2"></i>
            Proceed to Checkout
          </button>
        )}

        {/* Free Shipping Notice - Only show in checkout if shipping is not free */}
        {hideCheckoutButton && shipping > 0 && amountForFreeShipping > 0 && (
          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/10 rounded-lg border border-blue-100 dark:border-blue-900/20">
            <div className="flex items-start">
              <i className="fas fa-info-circle text-blue-500 mt-0.5 mr-2"></i>
              <p className="text-sm text-blue-800 dark:text-blue-300">
                Add{" "}
                <span className="font-bold">
                  {formatPrice(amountForFreeShipping)}
                </span>{" "}
                more to qualify for{" "}
                <span className="font-bold">FREE shipping</span>
              </p>
            </div>
          </div>
        )}

        <div className="pt-6 flex items-center justify-center text-text/90 mb-4">
          <i className="fas fa-shield-alt text-primary/90 mr-2"></i>
          <span className="text-sm">Secure checkout</span>
        </div>

        <div className="flex justify-center space-x-4 mt-4">
          <i className="fab fa-cc-visa text-2xl text-text/90"></i>
          <i className="fab fa-cc-mastercard text-2xl text-text/90"></i>
          <i className="fab fa-cc-amex text-2xl text-text/90"></i>
          <i className="fab fa-cc-paypal text-2xl text-text/90"></i>
          <i className="fab fa-google-pay text-2xl text-text/90"></i>
          <i className="fab fa-apple-pay text-2xl text-text/90"></i>
        </div>
      </div>

      <div className="mx-6 pt-6 border-t border-dashed border-gray-400 dark:border-gray-500"></div>

      <OrderServices />
    </div>
  );
};

export default OrderSummary;
