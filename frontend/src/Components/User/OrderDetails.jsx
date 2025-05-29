import React, { useState, useEffect, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { AppContent } from "../../Context/AppContent.jsx";
import axios from "axios";
import { toast } from "react-toastify";

function OrderDetails() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { backendUrl } = useContext(AppContent);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancellingOrder, setCancellingOrder] = useState(false);

  // Format price in INR
  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price || 0);
  };

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await axios.get(`${backendUrl}/orders/${orderId}`, {
          withCredentials: true,
        });

        if (response.data.success) {
          setOrder(response.data.order);
        } else {
          toast.error("Order not found");
          navigate("/orders");
        }
      } catch (error) {
        console.error("Error fetching order details:", error);
        if (error.response?.status === 401) {
          toast.error("Please login to view order details");
          navigate("/login");
        } else if (error.response?.status === 404) {
          toast.error("Order not found");
          navigate("/orders");
        } else {
          toast.error("Failed to load order details");
        }
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrderDetails();
    }
  }, [orderId, backendUrl, navigate]);

  const handleCancelOrder = async () => {
    if (!window.confirm("Are you sure you want to cancel this order?")) {
      return;
    }

    try {
      setCancellingOrder(true);
      const response = await axios.put(
        `${backendUrl}/orders/${orderId}/cancel`,
        { reason: "Cancelled by customer" },
        { withCredentials: true }
      );

      if (response.data.success) {
        toast.success("Order cancelled successfully");
        setOrder((prev) => ({ ...prev, status: "cancelled" }));
      } else {
        toast.error(response.data.message || "Failed to cancel order");
      }
    } catch (error) {
      console.error("Error cancelling order:", error);
      toast.error("Failed to cancel order. Please try again.");
    } finally {
      setCancellingOrder(false);
    }
  };

  // Format date function
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Function to determine badge color based on status
  const getStatusBadgeClass = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-700";
      case "processing":
        return "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-700";
      case "shipped":
        return "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-700";
      case "delivered":
        return "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-200 dark:border-green-700";
      case "cancelled":
        return "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-red-200 dark:border-red-700";
      default:
        return "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600";
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "fas fa-clock";
      case "processing":
        return "fas fa-cog fa-spin";
      case "shipped":
        return "fas fa-truck";
      case "delivered":
        return "fas fa-check-circle";
      case "cancelled":
        return "fas fa-times-circle";
      default:
        return "fas fa-clipboard-list";
    }
  };

  // Calculate estimated delivery dates
  const getEstimatedDelivery = (orderDate) => {
    const startDate = new Date(orderDate);
    startDate.setDate(startDate.getDate() + 5);
    const endDate = new Date(orderDate);
    endDate.setDate(endDate.getDate() + 7);

    return {
      start: startDate.toLocaleDateString("en-IN", {
        month: "short",
        day: "numeric",
      }),
      end: endDate.toLocaleDateString("en-IN", {
        month: "short",
        day: "numeric",
      }),
    };
  };

  // Calculate order summary
  const calculateSummary = (order) => {
    const subtotal =
      order.items?.reduce((sum, item) => sum + item.price * item.quantity, 0) ||
      0;
    const shipping = subtotal >= 999 ? 0 : 99; // Free shipping over ₹999
    const tax = Math.round(subtotal * 0.18 * 100) / 100; // 18% GST
    
    // Use the actual total_amount from order, not calculated total
    const total = order.total_amount || (subtotal + shipping + tax);

    return { subtotal, shipping, tax, total };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background py-4 sm:py-8">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-sm p-4 sm:p-8">
            <div className="animate-pulse space-y-6">
              <div className="h-6 sm:h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2 sm:w-1/3"></div>
              <div className="h-3 sm:h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 sm:w-1/2"></div>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-16 sm:h-24 bg-gray-200 dark:bg-gray-700 rounded-xl"
                  ></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-background py-4 sm:py-8">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-sm p-8 sm:p-12 lg:p-16 text-center border border-gray-200 dark:border-gray-700">
            <div className="text-4xl sm:text-6xl lg:text-8xl mb-4 sm:mb-6 text-gray-300 dark:text-gray-600">
              <i className="fas fa-search"></i>
            </div>
            <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-text mb-2 sm:mb-3">
              Order Not Found
            </h3>
            <p className="text-text/60 text-sm sm:text-base lg:text-lg mb-6 sm:mb-8 max-w-md mx-auto">
              The order you're looking for doesn't exist or you don't have
              permission to view it.
            </p>
            <Link
              to="/orders"
              className="inline-flex items-center px-6 sm:px-8 py-3 sm:py-4 bg-primary hover:bg-primary/90 text-white font-semibold rounded-lg sm:rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl text-sm sm:text-base"
            >
              <i className="fas fa-arrow-left mr-2 sm:mr-3"></i>
              Back to My Orders
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const summary = calculateSummary(order);
  const estimatedDelivery = getEstimatedDelivery(order.createdAt);

  return (
    <div className="min-h-screen bg-background py-4 sm:py-8">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <Link
            to="/orders"
            className="inline-flex items-center text-primary hover:text-primary/80 font-semibold mb-4 sm:mb-6 text-sm sm:text-base lg:text-lg transition-colors duration-200"
          >
            <i className="fas fa-arrow-left mr-2 sm:mr-3"></i>
            Back to My Orders
          </Link>

          {/* Mobile Header */}
          <div className="block sm:hidden">
            <h1 className="text-xl font-bold text-text mb-2">
              <i className="fas fa-receipt mr-2 text-primary"></i>
              Order Details
            </h1>
            <p className="text-text/70 text-sm mb-4">
              Order placed on{" "}
              {new Date(order.createdAt).toLocaleDateString("en-IN")}
            </p>
            <div className="mb-4">
              <span
                className={`px-4 py-2 rounded-lg text-sm font-bold border-2 ${getStatusBadgeClass(
                  order.status
                )}`}
              >
                <i className={`${getStatusIcon(order.status)} mr-2`}></i>
                {order.status?.charAt(0).toUpperCase() + order.status?.slice(1)}
              </span>
            </div>
          </div>

          {/* Desktop Header */}
          <div className="hidden sm:flex sm:flex-col lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-text mb-2 sm:mb-3">
                <i className="fas fa-receipt mr-2 sm:mr-3 text-primary"></i>
                Order Details
              </h1>
              <p className="text-text/70 text-sm sm:text-base lg:text-lg">
                Order placed on {formatDate(order.createdAt)}
              </p>
            </div>
            <div className="mt-4 lg:mt-0">
              <span
                className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl text-sm sm:text-base lg:text-lg font-bold border-2 ${getStatusBadgeClass(
                  order.status
                )}`}
              >
                <i
                  className={`${getStatusIcon(order.status)} mr-2 sm:mr-3`}
                ></i>
                {order.status?.charAt(0).toUpperCase() + order.status?.slice(1)}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          {/* Order Info Section */}
          <div className="p-4 sm:p-6 lg:p-8 bg-gradient-to-r from-primary/5 to-secondary/5 border-b border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              <div className="text-center sm:text-left">
                <p className="text-text/60 mb-1 sm:mb-2 font-medium text-xs sm:text-sm">
                  <i className="fas fa-hashtag mr-1 sm:mr-2"></i>
                  Order Number
                </p>
                <p className="font-bold text-lg sm:text-xl lg:text-2xl text-text">
                  #{order.order_number || order._id.slice(-8).toUpperCase()}
                </p>
              </div>

              <div className="text-center">
                <p className="text-text/60 mb-1 sm:mb-2 font-medium text-xs sm:text-sm">
                  <i className="fas fa-calendar-alt mr-1 sm:mr-2"></i>
                  Order Date
                </p>
                <p className="font-bold text-lg sm:text-xl lg:text-2xl text-text">
                  {new Date(order.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>

              <div className="text-center sm:col-span-2 lg:col-span-1 lg:text-right">
                <p className="text-text/60 mb-1 sm:mb-2 font-medium text-xs sm:text-sm">
                  <i className="fas fa-rupee-sign mr-1 sm:mr-2"></i>
                  Total Amount
                </p>
                <p className="font-bold text-xl sm:text-2xl lg:text-3xl text-primary">
                  {formatPrice(order.total_amount)}
                </p>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="p-4 sm:p-6 lg:p-8">
            <h3 className="text-lg sm:text-xl lg:text-2xl font-bold mb-4 sm:mb-6 text-text flex items-center">
              <i className="fas fa-shopping-cart mr-2 sm:mr-3 text-primary"></i>
              Order Items ({order.items?.length}{" "}
              {order.items?.length === 1 ? "item" : "items"})
            </h3>

            {/* Mobile: Card Layout */}
            <div className="space-y-4 sm:hidden">
              {order.items?.map((item, index) => (
                <div
                  key={index}
                  className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 border border-gray-200 dark:border-gray-600"
                >
                  <div className="flex items-start space-x-3 mb-3">
                    <div className="w-16 h-20 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-700 shadow-sm">
                      <img
                        src={
                          item.product_id?.product_image ||
                          "/api/placeholder/100/100"
                        }
                        alt={item.product_id?.product_name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = "/api/placeholder/100/100";
                        }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-text text-sm mb-1">
                        {item.product_id?.product_name || "Product Name"}
                      </h4>
                      <p className="text-text/60 text-xs mb-2">
                        {item.product_id?.product_brand || "Unknown Brand"}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-text/60">
                          {formatPrice(item.price)} each
                        </span>
                        <span className="inline-flex items-center justify-center w-12 h-8 bg-primary/10 text-primary rounded-lg font-bold text-sm border border-primary/20">
                          {item.quantity}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-primary text-lg">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop: Table Layout */}
            <div className="hidden sm:block overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-900">
                    <tr>
                      <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs lg:text-sm font-bold text-text uppercase tracking-wider">
                        Product
                      </th>
                      <th className="px-4 lg:px-6 py-3 lg:py-4 text-center text-xs lg:text-sm font-bold text-text uppercase tracking-wider hidden md:table-cell">
                        Price
                      </th>
                      <th className="px-4 lg:px-6 py-3 lg:py-4 text-center text-xs lg:text-sm font-bold text-text uppercase tracking-wider">
                        Quantity
                      </th>
                      <th className="px-4 lg:px-6 py-3 lg:py-4 text-right text-xs lg:text-sm font-bold text-text uppercase tracking-wider">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {order.items?.map((item, index) => (
                      <tr
                        key={index}
                        className="hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors duration-200"
                      >
                        <td className="px-4 lg:px-6 py-4 lg:py-6">
                          <div className="flex items-center">
                            <div className="w-16 lg:w-20 h-20 lg:h-24 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-700 mr-4 lg:mr-6 shadow-sm">
                              <img
                                src={
                                  item.product_id?.product_image ||
                                  "/api/placeholder/100/100"
                                }
                                alt={item.product_id?.product_name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.target.src = "/api/placeholder/100/100";
                                }}
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-bold text-text text-sm lg:text-lg mb-1">
                                {item.product_id?.product_name ||
                                  "Product Name"}
                              </h4>
                              <p className="text-text/60 text-xs lg:text-sm mb-2">
                                {item.product_id?.product_brand ||
                                  "Unknown Brand"}
                              </p>
                              <p className="text-text/60 text-xs md:hidden">
                                {formatPrice(item.price)} each
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 lg:px-6 py-4 lg:py-6 text-center hidden md:table-cell">
                          <span className="font-bold text-text text-sm lg:text-lg">
                            {formatPrice(item.price)}
                          </span>
                        </td>
                        <td className="px-4 lg:px-6 py-4 lg:py-6 text-center">
                          <span className="inline-flex items-center justify-center w-12 lg:w-16 h-8 lg:h-10 bg-primary/10 text-primary rounded-lg font-bold text-sm lg:text-lg border border-primary/20">
                            {item.quantity}
                          </span>
                        </td>
                        <td className="px-4 lg:px-6 py-4 lg:py-6 text-right">
                          <span className="font-bold text-primary text-base lg:text-xl">
                            {formatPrice(item.price * item.quantity)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
              {/* Summary */}
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-text mb-4 sm:mb-6 flex items-center">
                  <i className="fas fa-receipt mr-2 sm:mr-3 text-primary"></i>
                  Order Summary
                </h3>
                <div className="space-y-3 sm:space-y-4 bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg sm:rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                  <div className="flex justify-between text-sm sm:text-base lg:text-lg">
                    <span className="text-text/70 font-medium">Subtotal</span>
                    <span className="text-text font-bold">
                      {formatPrice(summary.subtotal)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm sm:text-base lg:text-lg">
                    <span className="text-text/70 font-medium">Shipping</span>
                    <span className="text-green-600 dark:text-green-400 font-bold">
                      {summary.shipping === 0
                        ? "Free"
                        : formatPrice(summary.shipping)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm sm:text-base lg:text-lg">
                    <span className="text-text/70 font-medium">GST (18%)</span>
                    <span className="text-text font-bold">
                      {formatPrice(summary.tax)}
                    </span>
                  </div>
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-3 sm:pt-4">
                    <div className="flex justify-between">
                      <span className="font-bold text-lg sm:text-xl text-text">Total</span>
                      <span className="font-bold text-lg sm:text-xl lg:text-2xl text-primary">
                        {formatPrice(order.total_amount)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-text mb-4 sm:mb-6 flex items-center">
                  <i className="fas fa-map-marker-alt mr-2 sm:mr-3 text-primary"></i>
                  Shipping Address
                </h3>
                <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg sm:rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                  {order.shipping_address ? (
                    <div className="space-y-2 sm:space-y-3">
                      <p className="font-bold text-text text-sm sm:text-base lg:text-lg">
                        {order.shipping_address.name}
                      </p>
                      <p className="text-text/70 text-sm sm:text-base">
                        {order.shipping_address.address}
                      </p>
                      <p className="text-text/70 text-sm sm:text-base">
                        {order.shipping_address.city}
                      </p>
                      {order.shipping_address.phone && (
                        <p className="text-text/70 flex items-center text-sm sm:text-base">
                          <i className="fas fa-phone mr-2 text-primary"></i>
                          {order.shipping_address.phone}
                        </p>
                      )}
                    </div>
                  ) : (
                    <p className="text-text/60 text-center py-4 text-sm sm:text-base">
                      No shipping address available
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Delivery Information */}
          {order.status !== "cancelled" && (
            <div className="p-4 sm:p-6 lg:p-8 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center mb-4 sm:mb-6">
                <div className="bg-blue-500 p-3 sm:p-4 rounded-full mr-3 sm:mr-4 shadow-lg">
                  <i className="fas fa-truck text-white text-lg sm:text-xl"></i>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-text">
                  Delivery Information
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div className="bg-white dark:bg-gray-800 p-3 sm:p-4 rounded-lg sm:rounded-xl border border-gray-200 dark:border-gray-700">
                  <p className="text-text/60 mb-1 sm:mb-2 font-medium text-xs sm:text-sm">
                    Estimated Delivery
                  </p>
                  <p className="font-bold text-text text-sm sm:text-base lg:text-lg">
                    {estimatedDelivery.start} - {estimatedDelivery.end}
                  </p>
                </div>
                <div className="bg-white dark:bg-gray-800 p-3 sm:p-4 rounded-lg sm:rounded-xl border border-gray-200 dark:border-gray-700">
                  <p className="text-text/60 mb-1 sm:mb-2 font-medium text-xs sm:text-sm">
                    Status
                  </p>
                  <p className="font-bold text-text text-sm sm:text-base lg:text-lg">
                    {order.status === "pending" && "Order is being processed"}
                    {order.status === "processing" &&
                      "Order is being prepared for shipment"}
                    {order.status === "shipped" && "Order is on its way to you"}
                    {order.status === "delivered" && "Order has been delivered"}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              {(order.status === "pending" ||
                order.status === "processing") && (
                <button
                  onClick={handleCancelOrder}
                  disabled={cancellingOrder}
                  className="px-6 sm:px-8 py-3 sm:py-4 bg-red-50 hover:bg-red-100 dark:bg-red-900/30 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 font-bold rounded-lg sm:rounded-xl transition-all duration-200 border-2 border-red-200 dark:border-red-800 hover:border-red-300 dark:hover:border-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                >
                  {cancellingOrder ? (
                    <>
                      <i className="fas fa-spinner fa-spin mr-2 sm:mr-3"></i>
                      Cancelling...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-times mr-2 sm:mr-3"></i>
                      Cancel Order
                    </>
                  )}
                </button>
              )}

              <button className="px-6 sm:px-8 py-3 sm:py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg sm:rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl text-sm sm:text-base">
                <i className="fas fa-shipping-fast mr-2 sm:mr-3"></i>
                Track Order
              </button>

              <button className="px-6 sm:px-8 py-3 sm:py-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg sm:rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl text-sm sm:text-base">
                <i className="fas fa-file-pdf mr-2 sm:mr-3"></i>
                Download Invoice
              </button>

              {order.status === "delivered" && (
                <button className="px-6 sm:px-8 py-3 sm:py-4 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-lg sm:rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl text-sm sm:text-base">
                  <i className="fas fa-star mr-2 sm:mr-3"></i>
                  Rate & Review
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderDetails;
