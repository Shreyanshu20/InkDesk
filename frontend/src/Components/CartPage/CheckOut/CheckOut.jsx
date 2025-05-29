import React, { useState, useEffect, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useCart } from "../../../Context/CartContext";
import { AppContent } from "../../../Context/AppContent";
import CheckoutHeader from "./components/CheckoutHeader";
import CheckoutProgress from "./components/CheckoutProgress";
import ShippingForm from "./components/ShippingForm";
import PaymentForm from "./components/PaymentForm";
import OrderSummary from "../components/OrderSummary";
import OrderReview from "./components/OrderReview";
import OrderSuccess from "./components/OrderSuccess";
import { toast } from "react-toastify";
import axios from "axios";
import { PRICING_CONFIG } from "../../Common/pricing.js";

const CheckOut = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { cartItems, cartSummary, clearCart } = useCart();
  const { isLoggedIn, backendUrl } = useContext(AppContent);

  // ADD BUY NOW HANDLING - Check if in Buy Now mode
  const buyNowMode = location.state?.buyNowMode;
  const buyNowProduct = location.state?.product;

  // MODIFY EXISTING LOGIC - Use Buy Now product or regular cart items
  const checkoutItems =
    buyNowMode && buyNowProduct
      ? [
          {
            _id: buyNowProduct.id,
            product_id: {
              _id: buyNowProduct.id,
              product_name: buyNowProduct.name,
              product_brand: buyNowProduct.brand,
              product_price: buyNowProduct.price,
              product_images: [buyNowProduct.image],
              product_stock: 999, // Assume in stock for buy now
            },
            quantity: buyNowProduct.quantity,
          },
        ]
      : cartItems;

  // MODIFY EXISTING LOGIC - Calculate totals for Buy Now mode
  const activeCartSummary =
    buyNowMode && buyNowProduct
      ? {
          totalPrice: buyNowProduct.price * buyNowProduct.quantity,
          totalItems: buyNowProduct.quantity,
        }
      : cartSummary;

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [shippingDetails, setShippingDetails] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    country: "India",
  });

  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: "",
    cardHolderName: "",
    expiryDate: "",
    cvv: "",
    upiId: "",
    selectedWallet: "",
  });

  const [giftMessage, setGiftMessage] = useState("");
  const [showGiftMessageForm, setShowGiftMessageForm] = useState(false);
  const [orderData, setOrderData] = useState(null);

  // Format price function
  const formatPrice = PRICING_CONFIG.formatPrice;

  // Free shipping threshold
  const freeShippingThreshold = PRICING_CONFIG.freeShippingThreshold;

  // Shipping cost
  const shipping = PRICING_CONFIG.calculateShipping(
    activeCartSummary.totalPrice
  );

  // Amount needed for free shipping
  const amountForFreeShipping = PRICING_CONFIG.getAmountForFreeShipping(
    activeCartSummary.totalPrice
  );

  // Progress percentage for free shipping
  const freeShippingProgress = Math.min(
    100,
    (activeCartSummary.totalPrice / freeShippingThreshold) * 100
  );

  // Tax calculation (GST 18%)
  const tax = PRICING_CONFIG.calculateTax(activeCartSummary.totalPrice);

  // Total cost
  const total = PRICING_CONFIG.calculateTotal(activeCartSummary.totalPrice);

  // MODIFY EXISTING LOGIC - Transform cart items for display (works for both regular and buy now)
  const transformedCartItems = checkoutItems.map((item) => ({
    id: item._id,
    name: item.product_id?.product_name || "Unknown Product",
    brand: item.product_id?.product_brand || "Unknown brand",
    price: item.product_id?.product_price || 0,
    quantity: item.quantity,
    totalPrice: (item.product_id?.product_price || 0) * item.quantity,
    image: item.product_id?.product_images?.[0]
      ? item.product_id.product_images[0].startsWith("http")
        ? item.product_id.product_images[0]
        : `${backendUrl}${item.product_id.product_images[0]}`
      : "https://placehold.co/120x160?text=No+Image",
    stock: item.product_id?.product_stock || 0,
    productId: item.product_id?._id,
  }));

  // Redirect if not logged in
  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
    }
  }, [isLoggedIn, navigate]);

  // MODIFY EXISTING LOGIC - Redirect if cart is empty (but not for buy now)
  useEffect(() => {
    if (!buyNowMode && cartItems.length === 0 && step <= 3) {
      toast.info("Your cart is empty. Please add items to proceed.");
      navigate("/cart");
    }
  }, [buyNowMode, cartItems.length, step, navigate]);

  const handleShippingInput = (e) => {
    const { name, value } = e.target;
    setShippingDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleShippingSubmit = (e) => {
    e.preventDefault();
    setStep(2);
  };

  const handlePaymentSubmit = (e) => {
    e.preventDefault();

    if (!isPaymentFormValid()) {
      toast.error("Please fill in all required payment details");
      return;
    }

    setStep(3);
  };

  // Validation function for payment forms
  const isPaymentFormValid = () => {
    switch (paymentMethod) {
      case "card":
        const isCardNumberValid =
          paymentDetails.cardNumber.replace(/\s/g, "").length === 16;
        const isCardHolderValid =
          paymentDetails.cardHolderName.trim().length >= 2;
        const isCvvValid = paymentDetails.cvv.length >= 3;

        const isExpiryValid = (() => {
          if (
            paymentDetails.expiryDate.length !== 5 ||
            !paymentDetails.expiryDate.includes("/")
          ) {
            return false;
          }

          const [month, year] = paymentDetails.expiryDate.split("/");
          const monthNum = parseInt(month);
          const yearNum = parseInt(year);

          if (monthNum < 1 || monthNum > 12) return false;

          const currentYear = new Date().getFullYear() % 100;
          const currentMonth = new Date().getMonth() + 1;

          if (yearNum < currentYear) return false;
          if (yearNum === currentYear && monthNum < currentMonth) return false;

          return true;
        })();

        return (
          isCardNumberValid && isCardHolderValid && isExpiryValid && isCvvValid
        );
      case "upi":
        return (
          paymentDetails.upiId.trim().length > 0 &&
          paymentDetails.upiId.includes("@")
        );
      case "wallet":
        return paymentDetails.selectedWallet.trim().length > 0;
      case "cod":
        return true;
      default:
        return false;
    }
  };

  // Payment input handlers
  const handlePaymentInput = (e) => {
    const { name, value } = e.target;
    setPaymentDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCardNumberInput = (e) => {
    let value = e.target.value.replace(/\D/g, "");
    value = value.substring(0, 16);
    value = value.replace(/(\d{4})(?=\d)/g, "$1 ");
    setPaymentDetails((prev) => ({
      ...prev,
      cardNumber: value,
    }));
  };

  const handleCardHolderInput = (e) => {
    let value = e.target.value.replace(/[^a-zA-Z\s]/g, "");
    value = value.substring(0, 50);
    setPaymentDetails((prev) => ({
      ...prev,
      cardHolderName: value,
    }));
  };

  const handleExpiryDateInput = (e) => {
    let value = e.target.value;
    value = value.replace(/\D/g, "");

    if (value.length > 4) {
      value = value.substring(0, 4);
    }

    let formattedValue = "";

    if (value.length === 0) {
      formattedValue = "";
    } else if (value.length === 1) {
      formattedValue = value;
    } else if (value.length === 2) {
      let month = parseInt(value);
      if (month > 12) {
        month = 12;
        formattedValue = "12";
      } else if (month === 0) {
        month = 1;
        formattedValue = "01";
      } else {
        formattedValue = month.toString().padStart(2, "0");
      }
    } else if (value.length === 3) {
      let month = parseInt(value.substring(0, 2));
      if (month > 12) month = 12;
      if (month === 0) month = 1;

      const year = value.substring(2);
      formattedValue = month.toString().padStart(2, "0") + "/" + year;
    } else if (value.length === 4) {
      let month = parseInt(value.substring(0, 2));
      let year = parseInt(value.substring(2));

      if (month > 12) month = 12;
      if (month === 0) month = 1;

      const currentYear = new Date().getFullYear() % 100;
      const currentMonth = new Date().getMonth() + 1;

      if (year < currentYear - 1) {
        year = currentYear;
      }

      if (year === currentYear && month < currentMonth) {
        month = currentMonth;
      }

      formattedValue =
        month.toString().padStart(2, "0") +
        "/" +
        year.toString().padStart(2, "0");
    }

    setPaymentDetails((prev) => ({
      ...prev,
      expiryDate: formattedValue,
    }));
  };

  const handleCVVInput = (e) => {
    const value = e.target.value.replace(/\D/g, "").substring(0, 4);
    setPaymentDetails((prev) => ({
      ...prev,
      cvv: value,
    }));
  };

  const handleUpiInput = (e) => {
    setPaymentDetails((prev) => ({
      ...prev,
      upiId: e.target.value || "",
    }));
  };

  const handleWalletSelection = (wallet) => {
    setPaymentDetails((prev) => ({
      ...prev,
      selectedWallet: wallet || "",
    }));
  };

  const handleGiftMessageChange = (e) => {
    setGiftMessage(e.target.value);
  };

  const toggleGiftMessageForm = () => {
    setShowGiftMessageForm(!showGiftMessageForm);
  };

  // MODIFY EXISTING LOGIC - Updated order confirmation handler
  const handleConfirmOrder = async () => {
    setLoading(true);

    try {
      // CHOOSE ENDPOINT - Use different endpoint for Buy Now vs regular checkout
      const endpoint = buyNowMode ? "/orders/buy-now" : "/orders/create";

      let orderPayload;

      if (buyNowMode) {
        // Buy Now payload
        orderPayload = {
          product_id: buyNowProduct.id,
          quantity: buyNowProduct.quantity,
          shipping_address: {
            name: `${shippingDetails.firstName} ${shippingDetails.lastName}`,
            address: shippingDetails.address,
            city: shippingDetails.city,
            phone: shippingDetails.phone,
            state: shippingDetails.state,
            pincode: shippingDetails.pincode,
            country: shippingDetails.country,
          },
        };
      } else {
        // Regular checkout payload
        orderPayload = {
          items: transformedCartItems.map((item) => ({
            product_id: item.productId,
            quantity: item.quantity,
          })),
          shipping_address: {
            name: `${shippingDetails.firstName} ${shippingDetails.lastName}`,
            address: `${shippingDetails.address}, ${shippingDetails.city}, ${shippingDetails.state} ${shippingDetails.pincode}`,
            city: shippingDetails.city,
            phone: shippingDetails.phone,
          },
        };
      }

      console.log("Creating order with payload:", orderPayload);

      // Call backend API to create order
      const response = await axios.post(
        `${backendUrl}${endpoint}`,
        orderPayload,
        {
          withCredentials: true,
        }
      );

      if (response.data.success) {
        // MODIFY EXISTING LOGIC - Clear cart only if not in buy now mode
        if (!buyNowMode) {
          await clearCart();
        }

        // FIX THE TOTAL CALCULATION HERE - Use correct variable names
        const codFee = paymentMethod === "cod" ? 40 : 0;
        const finalTotal = (activeCartSummary.totalPrice || 0) + shipping + tax + codFee;

        // Prepare order data for success page
        const successOrderData = {
          orderNumber: response.data.order.order_number,
          orderId: response.data.order._id,
          shippingDetails,
          paymentMethod,
          paymentDetails,
          cartItems: transformedCartItems,
          giftMessage,
          subtotal: activeCartSummary.totalPrice || 0,
          shipping: shipping, // Use 'shipping' not 'shippingCost'
          tax: tax, // Use 'tax' not 'taxAmount'
          codFee: codFee,
          total: finalTotal,
          orderDate: new Date().toISOString(),
          estimatedDelivery: {
            start: new Date(
              Date.now() + 5 * 24 * 60 * 60 * 1000
            ).toLocaleDateString("en-IN"),
            end: new Date(
              Date.now() + 7 * 24 * 60 * 60 * 1000
            ).toLocaleDateString("en-IN"),
          },
          status: 'pending'
        };

        setOrderData(successOrderData);
        toast.success("Order placed successfully!");
        setStep(4);
      } else {
        toast.error(response.data.message || "Failed to place order");
      }
    } catch (error) {
      console.error("Error placing order:", error);

      if (error.response?.status === 401) {
        toast.error("Please login to place an order");
        navigate("/login");
      } else if (error.response?.status === 400) {
        toast.error(error.response.data.message || "Invalid order data");
      } else {
        toast.error("Failed to place order. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Don't render if not logged in
  if (!isLoggedIn) {
    return null;
  }

  // MODIFY EXISTING LOGIC - Don't render if cart is empty (except for buy now or success page)
  if (!buyNowMode && cartItems.length === 0 && step <= 3) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {step <= 3 && <CheckoutHeader />}

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {step <= 3 && <CheckoutProgress step={step} />}

        {step <= 3 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              {step === 1 && (
                <ShippingForm
                  shippingDetails={shippingDetails}
                  handleShippingInput={handleShippingInput}
                  handleShippingSubmit={handleShippingSubmit}
                  loading={loading}
                  setShippingDetails={setShippingDetails}
                />
              )}

              {step === 2 && (
                <PaymentForm
                  paymentMethod={paymentMethod}
                  setPaymentMethod={setPaymentMethod}
                  paymentDetails={paymentDetails}
                  handlePaymentInput={handlePaymentInput}
                  handleCardHolderInput={handleCardHolderInput}
                  handleCardNumberInput={handleCardNumberInput}
                  handleExpiryDateInput={handleExpiryDateInput}
                  handleCVVInput={handleCVVInput}
                  handlePaymentSubmit={handlePaymentSubmit}
                  loading={loading}
                  setStep={setStep}
                  step={step}
                  handleUpiInput={handleUpiInput}
                  handleWalletSelection={handleWalletSelection}
                  isPaymentFormValid={isPaymentFormValid}
                />
              )}

              {step === 3 && (
                <OrderReview
                  shippingDetails={shippingDetails}
                  paymentMethod={paymentMethod}
                  paymentDetails={paymentDetails}
                  cartItems={transformedCartItems}
                  formatPrice={formatPrice}
                  handleConfirmOrder={handleConfirmOrder}
                  loading={loading}
                  setStep={setStep}
                  giftMessage={giftMessage}
                  showGiftMessageForm={showGiftMessageForm}
                  handleGiftMessageChange={handleGiftMessageChange}
                  toggleGiftMessageForm={toggleGiftMessageForm}
                />
              )}
            </div>

            <div className="lg:col-span-1">
              <OrderSummary
                subtotal={activeCartSummary.totalPrice || 0}
                shipping={shipping}
                tax={tax}
                total={total}
                formatPrice={formatPrice}
                amountForFreeShipping={amountForFreeShipping}
                cartItems={transformedCartItems}
                hideCheckoutButton={true}
                paymentMethod={paymentMethod}
              />
            </div>
          </div>
        )}

        {step === 4 && orderData && (
          <div className="flex justify-center items-center min-h-[80vh]">
            <div className="w-full max-w-4xl">
              <OrderSuccess orderData={orderData} formatPrice={formatPrice} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckOut;
