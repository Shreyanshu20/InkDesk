import React, { useState, useContext, useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { AppContent } from "../../Context/AppContent";
import ShippingForm from "../CartPage/CheckOut/components/ShippingForm";

const BuyNowModal = ({ isOpen, onClose, product, quantity, backendUrl }) => {
  const { userData } = useContext(AppContent);
  const [loading, setLoading] = useState(false);
  const [shippingDetails, setShippingDetails] = useState({
    firstName: "",
    lastName: "",
    email: userData?.email || "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    country: "India",
  });

  // Set email from userData when available
  useEffect(() => {
    if (userData?.email) {
      setShippingDetails((prev) => ({
        ...prev,
        email: userData.email,
      }));
    }
  }, [userData?.email]);

  const handleShippingInput = (e) => {
    const { name, value } = e.target;
    setShippingDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleShippingSubmit = async (e) => {
    e.preventDefault();

    if (
      !shippingDetails.firstName ||
      !shippingDetails.lastName ||
      !shippingDetails.phone ||
      !shippingDetails.address ||
      !shippingDetails.city ||
      !shippingDetails.state ||
      !shippingDetails.pincode
    ) {
      toast.error("Please fill all required shipping details");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        `${backendUrl}/orders/buy-now`,
        {
          product_id: product.id,
          quantity: quantity,
          shipping_address: {
            name: `${shippingDetails.firstName} ${shippingDetails.lastName}`,
            address: shippingDetails.address,
            city: shippingDetails.city,
            phone: shippingDetails.phone,
            state: shippingDetails.state,
            pincode: shippingDetails.pincode,
            country: shippingDetails.country,
          },
        },
        { withCredentials: true }
      );

      if (response.data.success) {
        toast.success("Order placed successfully!");
        onClose();
        // Reset form
        setShippingDetails({
          firstName: "",
          lastName: "",
          email: userData?.email || "",
          phone: "",
          address: "",
          city: "",
          state: "",
          pincode: "",
          country: "India",
        });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-background rounded-2xl shadow-lg border border-gray-300 dark:border-gray-600 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-300 dark:border-gray-600 bg-gradient-to-r from-primary/10 to-secondary/10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-text flex items-center">
                <i className="fas fa-bolt text-primary mr-3"></i>
                Quick Buy
              </h2>
              <p className="text-sm text-text/60 mt-1">
                Complete your purchase in one step
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors p-2 hover:bg-gray-100 rounded-full"
              disabled={loading}
            >
              <i className="fas fa-times text-xl"></i>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
          {/* Left Side - Shipping Form */}
          <div className="lg:col-span-2">
            <ShippingForm
              shippingDetails={shippingDetails}
              handleShippingInput={handleShippingInput}
              handleShippingSubmit={handleShippingSubmit}
              loading={loading}
              setShippingDetails={setShippingDetails}
            />
          </div>

          {/* Right Side - Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl shadow-md border border-gray-300 dark:border-gray-600 sticky top-6">
              {/* Order Summary Header */}
              <div className="p-6 border-b border-gray-300 dark:border-gray-600">
                <h3 className="text-lg font-bold text-text flex items-center">
                  <i className="fas fa-receipt text-primary mr-2"></i>
                  Order Summary
                </h3>
              </div>

              {/* Product Details */}
              <div className="p-6 space-y-4">
                <div className="flex items-center space-x-4 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div className="w-16 h-20 flex-shrink-0 overflow-hidden rounded-md bg-gray-100">
                    <img
                      src={
                        product?.image ||
                        "https://placehold.co/80x100?text=Product"
                      }
                      alt={product?.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-text text-sm line-clamp-2">
                      {product?.name}
                    </h4>
                    <p className="text-xs text-text/60 mt-1">
                      {product?.brand}
                    </p>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-xs text-text/70">
                        Qty: {quantity}
                      </span>
                      <span className="text-sm font-semibold text-primary">
                        ${(product?.price * quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="space-y-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between text-sm">
                    <span className="text-text/70">Subtotal</span>
                    <span className="text-text">
                      ${(product?.price * quantity).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-text/70">Shipping</span>
                    <span className="text-green-600">Free</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-text/70">Tax (8%)</span>
                    <span className="text-text">
                      ${(product?.price * quantity * 0.08).toFixed(2)}
                    </span>
                  </div>
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
                    <div className="flex justify-between">
                      <span className="text-lg font-semibold text-text">
                        Total
                      </span>
                      <span className="text-xl font-bold text-primary">
                        ${(product?.price * quantity * 1.08).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Benefits */}
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="space-y-2 text-xs text-text/70">
                    <div className="flex items-center">
                      <i className="fas fa-shield-alt text-green-500 mr-2"></i>
                      <span>Secure Payment</span>
                    </div>
                    <div className="flex items-center">
                      <i className="fas fa-truck text-blue-500 mr-2"></i>
                      <span>Fast Delivery</span>
                    </div>
                    <div className="flex items-center">
                      <i className="fas fa-undo text-orange-500 mr-2"></i>
                      <span>Easy Returns</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyNowModal;
