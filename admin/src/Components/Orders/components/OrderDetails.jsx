import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import StatusUpdateModal from "./StatusUpdateModal";
import { getStatusColor } from "./utils";
import OrderDetailsSkeleton from "./OrderDetailsSkeleton";

const API_BASE_URL =
  import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

function OrderDetails() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statusModalOpen, setStatusModalOpen] = useState(false);

  const orderStatuses = [
    "pending",
    "processing",
    "shipped",
    "delivered",
    "cancelled",
  ];

  useEffect(() => {
    if (id) {
      fetchOrderData();
    }
  }, [id]);

  const fetchOrderData = async () => {
    try {
      setLoading(true);

      const response = await axios.get(`${API_BASE_URL}/admin/orders/${id}`, {
        withCredentials: true,
      });

      if (response.data.success) {
        const order = response.data.order;
        const customer = order.user_id || {};
        const customerName =
          `${customer.first_name || ""} ${customer.last_name || ""}`.trim() ||
          "Unknown Customer";

        const formattedOrderData = {
          ...order,
          id: order._id,
          customer: {
            name: customerName,
            email: customer.email || "Not provided",
            id: customer._id || "unknown",
          },
        };

        setOrderData(formattedOrderData);
      } else {
        toast.error("Order not found");
        navigate("/admin/orders");
      }
    } catch (error) {
      toast.error("Failed to load order details");
      navigate("/admin/orders");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/admin/orders/${id}/status`,
        { status: newStatus },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (response.data.success) {
        setOrderData((prev) => ({
          ...prev,
          status: newStatus,
          updatedAt: new Date().toISOString(),
        }));
        toast.success(`Order status updated to ${newStatus}`);
      } else {
        toast.error("Failed to update order status");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update order status"
      );
    } finally {
      setStatusModalOpen(false);
    }
  };

  const handleBack = () => {
    navigate("/admin/orders");
  };

  const formatPrice = (price) => {
    return `₹${(price || 0).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return <OrderDetailsSkeleton />;
  }

  if (!orderData) {
    return (
      <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
        <div className="text-center">
          <p className="text-gray-500 dark:text-gray-400">Order not found</p>
          <button
            onClick={handleBack}
            className="mt-4 px-4 py-2 bg-primary text-white rounded-md"
          >
            Back to Orders
          </button>
        </div>
      </div>
    );
  }

  const customer = orderData.user_id || {};
  const customerName =
    `${customer.first_name || ""} ${customer.last_name || ""}`.trim() ||
    "Unknown Customer";

  return (
    <div className="p-6 bg-background min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <button
            onClick={handleBack}
            className="mr-4 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <i className="fas fa-arrow-left text-lg"></i>
          </button>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
              Order Details
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Order #
              {orderData.order_number ||
                orderData._id?.slice(-8)?.toUpperCase() ||
                "N/A"}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setStatusModalOpen(true)}
            className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-md flex items-center gap-2"
          >
            <i className="fas fa-edit"></i>
            Update Status
          </button>
          <button
            onClick={fetchOrderData}
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md flex items-center gap-2"
          >
            <i className="fas fa-refresh"></i>
            Refresh
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Order Information
              </h2>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                  orderData.status
                )}`}
              >
                {orderData.status?.charAt(0)?.toUpperCase() +
                  orderData.status?.slice(1)}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500 dark:text-gray-400">
                  Order Date:
                </span>
                <p className="font-medium text-gray-900 dark:text-white">
                  {formatDate(orderData.createdAt)}
                </p>
              </div>
              <div>
                <span className="text-gray-500 dark:text-gray-400">
                  Payment Method:
                </span>
                <p className="font-medium text-gray-900 dark:text-white">
                  {orderData.payment_method || "Not specified"}
                </p>
              </div>
              <div>
                <span className="text-gray-500 dark:text-gray-400">
                  Payment Status:
                </span>
                <p
                  className={`font-medium ${
                    orderData.payment_status === "paid"
                      ? "text-green-600 dark:text-green-400"
                      : "text-yellow-600 dark:text-yellow-400"
                  }`}
                >
                  {orderData.payment_status || "Pending"}
                </p>
              </div>
              <div>
                <span className="text-gray-500 dark:text-gray-400">
                  Total Amount:
                </span>
                <p className="font-bold text-lg text-gray-900 dark:text-white">
                  {formatPrice(orderData.total_amount)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Order Items ({orderData.items?.length || 0})
            </h2>

            <div className="space-y-4">
              {orderData.items && orderData.items.length > 0 ? (
                orderData.items.map((item, index) => {
                  const product = item.product_id || {};
                  return (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center overflow-hidden">
                          {product.product_image ? (
                            <img
                              src={product.product_image}
                              alt={product.product_name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <i className="fas fa-box text-gray-400 text-xl"></i>
                          )}
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900 dark:text-white">
                            {product.product_name ||
                              item.product_name ||
                              "Unknown Product"}
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Quantity: {item.quantity || 1}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Price:{" "}
                            {formatPrice(item.price || product.product_price)}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {formatPrice(
                            (item.price || product.product_price || 0) *
                              (item.quantity || 1)
                          )}
                        </p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                  No items found in this order
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Customer Information
            </h2>
            <div className="space-y-3 text-sm">
              <div>
                <span className="text-gray-500 dark:text-gray-400">Name:</span>
                <p className="font-medium text-gray-900 dark:text-white">
                  {customerName}
                </p>
              </div>
              <div>
                <span className="text-gray-500 dark:text-gray-400">Email:</span>
                <p className="font-medium text-gray-900 dark:text-white">
                  {customer.email || "Not provided"}
                </p>
              </div>
              <div>
                <span className="text-gray-500 dark:text-gray-400">Phone:</span>
                <p className="font-medium text-gray-900 dark:text-white">
                  {customer.phone || "Not provided"}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Shipping Address
            </h2>
            {orderData.shipping_address ? (
              <div className="text-sm space-y-2">
                <p className="font-medium text-gray-900 dark:text-white">
                  {orderData.shipping_address.name}
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  {orderData.shipping_address.address}
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  {orderData.shipping_address.city},{" "}
                  {orderData.shipping_address.state}{" "}
                  {orderData.shipping_address.pincode}
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  {orderData.shipping_address.country}
                </p>
                {orderData.shipping_address.phone && (
                  <p className="text-gray-600 dark:text-gray-400">
                    Phone: {orderData.shipping_address.phone}
                  </p>
                )}
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400">
                No shipping address provided
              </p>
            )}
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Order Summary
            </h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">
                  Subtotal:
                </span>
                <span className="text-gray-900 dark:text-white">
                  {formatPrice(orderData.subtotal || orderData.total_amount)}
                </span>
              </div>
              {orderData.shipping_cost && (
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">
                    Shipping:
                  </span>
                  <span className="text-gray-900 dark:text-white">
                    {formatPrice(orderData.shipping_cost)}
                  </span>
                </div>
              )}
              {orderData.tax_amount && (
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Tax:</span>
                  <span className="text-gray-900 dark:text-white">
                    {formatPrice(orderData.tax_amount)}
                  </span>
                </div>
              )}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-2 mt-2">
                <div className="flex justify-between">
                  <span className="font-semibold text-gray-900 dark:text-white">
                    Total:
                  </span>
                  <span className="font-bold text-lg text-gray-900 dark:text-white">
                    {formatPrice(orderData.total_amount)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <StatusUpdateModal
        statusModalOpen={statusModalOpen}
        selectedOrderForStatus={orderData}
        closeStatusModal={() => setStatusModalOpen(false)}
        orderStatuses={orderStatuses}
        handleStatusUpdate={handleStatusUpdate}
        getStatusColor={getStatusColor}
      />
    </div>
  );
}

export default OrderDetails;
