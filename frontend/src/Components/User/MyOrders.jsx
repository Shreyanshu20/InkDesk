import React, { useState, useEffect, useContext } from "react";
import { AppContent } from "../../Context/AppContent.jsx";
import axios from "axios";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

function MyOrders() {
  const { userData, backendUrl } = useContext(AppContent);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [cancellingOrder, setCancellingOrder] = useState(null);

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
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`${backendUrl}/orders/my-orders`, {
          withCredentials: true,
        });

        if (response.data.success) {
          setOrders(response.data.orders);
        } else {
          toast.error("Failed to fetch orders");
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
        if (error.response?.status === 401) {
          toast.error("Please login to view your orders");
        } else {
          toast.error("An error occurred while fetching your orders");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [backendUrl]);

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) {
      return;
    }

    try {
      setCancellingOrder(orderId);
      const response = await axios.put(
        `${backendUrl}/orders/${orderId}/cancel`,
        { reason: "Cancelled by customer" },
        { withCredentials: true }
      );

      if (response.data.success) {
        toast.success("Order cancelled successfully");
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === orderId ? { ...order, status: "cancelled" } : order
          )
        );
      } else {
        toast.error(response.data.message || "Failed to cancel order");
      }
    } catch (error) {
      console.error("Error cancelling order:", error);
      toast.error("Failed to cancel order. Please try again.");
    } finally {
      setCancellingOrder(null);
    }
  };

  // Filter orders based on active tab
  const filteredOrders = orders.filter((order) => {
    if (activeTab === "all") return true;
    return order.status.toLowerCase() === activeTab;
  });

  // Function to display formatted date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Function to determine badge color based on status
  const getStatusBadgeClass = (status) => {
    switch (status.toLowerCase()) {
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
    switch (status.toLowerCase()) {
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

  // Get order counts for each status
  const getOrderCounts = () => {
    const counts = { all: orders.length };
    ["pending", "processing", "shipped", "delivered", "cancelled"].forEach(
      (status) => {
        counts[status] = orders.filter(
          (order) => order.status.toLowerCase() === status
        ).length;
      }
    );
    return counts;
  };

  const orderCounts = getOrderCounts();

  if (loading) {
    return (
      <div className="min-h-screen bg-background py-4 sm:py-8">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-4 sm:p-8">
            <div className="animate-pulse space-y-6">
              <div className="h-6 sm:h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2 sm:w-1/3"></div>
              <div className="h-3 sm:h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 sm:w-1/2"></div>
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="border border-gray-200 dark:border-gray-700 rounded-xl p-4 sm:p-6"
                >
                  <div className="h-4 sm:h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 sm:w-1/4 mb-4"></div>
                  <div className="h-3 sm:h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 sm:w-1/3 mb-2"></div>
                  <div className="h-3 sm:h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 sm:w-1/6"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-4 sm:py-8">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-text mb-2 sm:mb-3">
            <i className="fas fa-shopping-bag mr-2 sm:mr-3 text-primary"></i>
            My Orders
          </h1>
          <p className="text-text/70 text-sm sm:text-base lg:text-lg">
            Track and manage your orders ({orders.length} total)
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-sm mb-6 sm:mb-8 overflow-hidden border border-gray-200 dark:border-gray-700">
          <div className="flex overflow-x-auto scrollbar-hide">
            {[
              "all",
              "pending",
              "processing",
              "shipped",
              "delivered",
              "cancelled",
            ].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 sm:px-6 lg:px-8 py-3 sm:py-4 lg:py-5 text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-200 flex-shrink-0 border-b-2 sm:border-b-3 ${
                  activeTab === tab
                    ? "bg-primary/5 text-primary border-primary"
                    : "text-text/60 hover:text-text hover:bg-gray-50 dark:hover:bg-gray-700/50 border-transparent"
                }`}
              >
                <span className="capitalize">{tab}</span>
                {orderCounts[tab] > 0 && (
                  <span
                    className={`ml-2 sm:ml-3 px-1.5 sm:px-2.5 py-0.5 sm:py-1 text-xs rounded-full font-bold ${
                      activeTab === tab
                        ? "bg-primary text-white"
                        : "bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-400"
                    }`}
                  >
                    {orderCounts[tab]}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-4 sm:space-y-6">
          {filteredOrders.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-sm p-8 sm:p-12 lg:p-16 text-center border border-gray-200 dark:border-gray-700">
              <div className="text-4xl sm:text-6xl lg:text-8xl mb-4 sm:mb-6 text-gray-300 dark:text-gray-600">
                <i className="fas fa-box-open"></i>
              </div>
              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-text mb-2 sm:mb-3">
                No orders found
              </h3>
              <p className="text-text/60 text-sm sm:text-base lg:text-lg mb-6 sm:mb-8 max-w-md mx-auto">
                {activeTab === "all"
                  ? "You haven't placed any orders yet. Start shopping to see your orders here!"
                  : `You don't have any ${activeTab} orders at the moment.`}
              </p>
              <Link
                to="/"
                className="inline-flex items-center px-6 sm:px-8 py-3 sm:py-4 bg-primary hover:bg-primary/90 text-white font-semibold rounded-lg sm:rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl text-sm sm:text-base"
              >
                <i className="fas fa-shopping-bag mr-2 sm:mr-3"></i>
                Start Shopping
              </Link>
            </div>
          ) : (
            filteredOrders.map((order) => (
              <div
                key={order._id}
                className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-all duration-300"
              >
                <div className="p-4 sm:p-6 lg:p-8">
                  {/* Order Header */}
                  <div className="flex flex-col space-y-4 mb-4 sm:mb-6">
                    {/* Mobile Layout */}
                    <div className="flex items-start justify-between sm:hidden">
                      <div className="flex items-center space-x-3">
                        <div className="text-xl text-primary">
                          <i className={getStatusIcon(order.status)}></i>
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-text mb-1">
                            Order #
                            {order.order_number ||
                              order._id.slice(-8).toUpperCase()}
                          </h3>
                          <p className="text-xs text-text/60">
                            {formatDate(order.createdAt)}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-primary mb-1">
                          {formatPrice(order.total_amount)}
                        </p>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold border ${getStatusBadgeClass(
                            order.status
                          )}`}
                        >
                          {order.status.charAt(0).toUpperCase() +
                            order.status.slice(1)}
                        </span>
                      </div>
                    </div>

                    {/* Desktop/Tablet Layout */}
                    <div className="hidden sm:flex sm:flex-col lg:flex-row lg:items-center lg:justify-between">
                      <div className="flex items-center space-x-4 mb-4 lg:mb-0">
                        <div className="text-2xl lg:text-3xl text-primary">
                          <i className={getStatusIcon(order.status)}></i>
                        </div>
                        <div>
                          <h3 className="text-lg lg:text-xl font-bold text-text mb-1">
                            Order #
                            {order.order_number ||
                              order._id.slice(-8).toUpperCase()}
                          </h3>
                          <p className="text-text/60 flex items-center text-sm lg:text-base">
                            <i className="fas fa-calendar-alt mr-2"></i>
                            Ordered on {formatDate(order.createdAt)}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-6">
                        <span
                          className={`px-3 lg:px-4 py-2 rounded-full text-sm font-semibold border-2 ${getStatusBadgeClass(
                            order.status
                          )}`}
                        >
                          {order.status.charAt(0).toUpperCase() +
                            order.status.slice(1)}
                        </span>
                        <div className="text-right">
                          <p className="text-xl lg:text-2xl font-bold text-primary mb-1">
                            {formatPrice(order.total_amount)}
                          </p>
                          <p className="text-text/60 text-sm flex items-center justify-end">
                            <i className="fas fa-shopping-cart mr-2"></i>
                            {order.items?.length} item{order.items?.length !== 1 ? "s" : ""}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Order Items Preview */}
                  <div className="mb-4 sm:mb-6">
                    <h4 className="text-sm sm:text-base lg:text-lg font-semibold text-text mb-3 sm:mb-4 flex items-center">
                      <i className="fas fa-box mr-2 text-primary"></i>
                      Items in this order
                    </h4>

                    {/* Mobile: Stack items vertically */}
                    <div className="space-y-3 sm:hidden">
                      {order.items?.slice(0, 2).map((item, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 border border-gray-200 dark:border-gray-600"
                        >
                          <div className="w-12 h-12 bg-gray-200 dark:bg-gray-600 rounded-lg overflow-hidden flex-shrink-0">
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
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-semibold text-text truncate">
                              {item.product_id?.product_name}
                            </p>
                            <p className="text-xs text-text/60 mt-1">
                              Qty: {item.quantity} × {formatPrice(item.price)}
                            </p>
                            <p className="text-sm font-bold text-primary">
                              {formatPrice(item.price * item.quantity)}
                            </p>
                          </div>
                        </div>
                      ))}
                      {order.items?.length > 2 && (
                        <div className="flex items-center justify-center bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg p-3 border-2 border-dashed border-primary/30">
                          <span className="text-xs font-semibold text-primary">
                            +{order.items.length - 2} more items
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Desktop/Tablet: Grid layout */}
                    <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
                      {order.items?.slice(0, 4).map((item, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3 lg:p-4 border border-gray-200 dark:border-gray-600"
                        >
                          <div className="w-12 lg:w-16 h-12 lg:h-16 bg-gray-200 dark:bg-gray-600 rounded-lg overflow-hidden flex-shrink-0">
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
                          <div className="min-w-0 flex-1">
                            <p className="text-xs lg:text-sm font-semibold text-text truncate">
                              {item.product_id?.product_name}
                            </p>
                            <p className="text-xs text-text/60 mt-1">
                              Qty: {item.quantity} × {formatPrice(item.price)}
                            </p>
                            <p className="text-sm font-bold text-primary mt-1">
                              {formatPrice(item.price * item.quantity)}
                            </p>
                          </div>
                        </div>
                      ))}
                      {order.items?.length > 4 && (
                        <div className="flex items-center justify-center bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl p-4 border-2 border-dashed border-primary/30">
                          <div className="text-center">
                            <div className="text-xl lg:text-2xl text-primary mb-2">
                              <i className="fas fa-plus"></i>
                            </div>
                            <span className="text-xs lg:text-sm font-semibold text-primary">
                              {order.items.length - 4} more items
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 sm:pt-6 border-t border-gray-200 dark:border-gray-700">
                    <Link
                      to={`/orders/${order._id}`}
                      className="flex-1 sm:flex-none px-4 sm:px-6 py-2.5 sm:py-3 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 text-blue-600 dark:text-blue-400 font-semibold rounded-lg sm:rounded-xl transition-all duration-200 text-center border-2 border-blue-200 dark:border-blue-800 hover:border-blue-300 dark:hover:border-blue-700 text-sm"
                    >
                      <i className="fas fa-eye mr-2"></i>
                      View Details
                    </Link>

                    {(order.status === "pending" ||
                      order.status === "processing") && (
                      <button
                        onClick={() => handleCancelOrder(order._id)}
                        disabled={cancellingOrder === order._id}
                        className="flex-1 sm:flex-none px-4 sm:px-6 py-2.5 sm:py-3 bg-red-50 hover:bg-red-100 dark:bg-red-900/30 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 font-semibold rounded-lg sm:rounded-xl transition-all duration-200 border-2 border-red-200 dark:border-red-800 hover:border-red-300 dark:hover:border-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                      >
                        {cancellingOrder === order._id ? (
                          <>
                            <i className="fas fa-spinner fa-spin mr-2"></i>
                            Cancelling...
                          </>
                        ) : (
                          <>
                            <i className="fas fa-times mr-2"></i>
                            Cancel Order
                          </>
                        )}
                      </button>
                    )}

                    {order.status === "delivered" && (
                      <button className="flex-1 sm:flex-none px-4 sm:px-6 py-2.5 sm:py-3 bg-green-50 hover:bg-green-100 dark:bg-green-900/30 dark:hover:bg-green-900/50 text-green-600 dark:text-green-400 font-semibold rounded-lg sm:rounded-xl transition-all duration-200 border-2 border-green-200 dark:border-green-800 hover:border-green-300 dark:hover:border-green-700 text-sm">
                        <i className="fas fa-star mr-2"></i>
                        Rate & Review
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default MyOrders;
