import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { getStatusColor } from "./utils";
import StatusUpdateModal from "./StatusUpdateModal";

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

function OrderDetails() {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [orderData, setOrderData] = useState(location.state?.orderData || null);
  const [loading, setLoading] = useState(!orderData);
  const [statusModalOpen, setStatusModalOpen] = useState(false);

  const orderStatuses = ["pending", "processing", "shipped", "delivered", "cancelled"];

  // Fetch order details if not passed via state
  useEffect(() => {
    if (!orderData && id) {
      fetchOrderDetails();
    }
  }, [id, orderData]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      
      const response = await axios.get(`${API_BASE_URL}/admin/orders/${id}`, {
        withCredentials: true
      });

      if (response.data.success) {
        const order = response.data.order;
        
        // Transform to match expected format
        const transformedOrder = {
          id: order._id,
          order_number: order.order_number,
          customer: {
            name: order.user_id?.first_name 
              ? `${order.user_id.first_name} ${order.user_id.last_name || ''}`.trim()
              : order.shipping_address?.name || 'Customer',
            email: order.user_id?.email || order.shipping_address?.email || 'customer@example.com',
            phone: order.shipping_address?.phone || 'N/A'
          },
          date: order.createdAt,
          total: order.total_amount,
          status: order.status,
          items: order.items || [],
          shipping_address: order.shipping_address,
          user_id: order.user_id
        };
        
        setOrderData(transformedOrder);
      } else {
        toast.error("Order not found");
        navigate("/admin/orders");
      }
    } catch (error) {
      console.error("Error fetching order details:", error);
      toast.error("Failed to load order details");
      navigate("/admin/orders");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/admin/orders/${orderData.id}/status`,
        { status: newStatus },
        { withCredentials: true }
      );

      if (response.data.success) {
        setOrderData({ ...orderData, status: newStatus });
        toast.success("Order status updated successfully");
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error("Failed to update order status");
    }
    setStatusModalOpen(false);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price || 0);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <i className="fas fa-spinner fa-spin text-3xl text-primary mb-4"></i>
            <p className="text-gray-600 dark:text-gray-400">Loading order details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!orderData) {
    return (
      <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            Order Not Found
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            The requested order does not exist or has been removed.
          </p>
          <button
            onClick={() => navigate("/admin/orders")}
            className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-md"
          >
            Back to Orders
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Header */}
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate("/admin/orders")}
          className="text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 mr-4"
        >
          <i className="fas fa-arrow-left"></i>
        </button>
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Order Details: #{orderData.order_number || orderData.id.slice(-8).toUpperCase()}
        </h1>
      </div>

      {/* Order Info */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Customer Info */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Customer Information
            </h3>
            <div className="space-y-2">
              <p className="text-sm">
                <span className="font-medium">Name:</span> {orderData.customer.name}
              </p>
              <p className="text-sm">
                <span className="font-medium">Email:</span> {orderData.customer.email}
              </p>
              <p className="text-sm">
                <span className="font-medium">Phone:</span> {orderData.customer.phone}
              </p>
            </div>
          </div>

          {/* Order Info */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Order Information
            </h3>
            <div className="space-y-2">
              <p className="text-sm">
                <span className="font-medium">Order Date:</span> {formatDate(orderData.date)}
              </p>
              <p className="text-sm">
                <span className="font-medium">Total Amount:</span> {formatPrice(orderData.total)}
              </p>
              <div className="flex items-center">
                <span className="font-medium text-sm mr-2">Status:</span>
                <button
                  onClick={() => setStatusModalOpen(true)}
                  className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(orderData.status)} hover:opacity-80 transition-opacity`}
                >
                  {orderData.status.charAt(0).toUpperCase() + orderData.status.slice(1)}
                  <i className="fas fa-edit ml-1"></i>
                </button>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Shipping Address
            </h3>
            {orderData.shipping_address ? (
              <div className="space-y-1 text-sm">
                <p className="font-medium">{orderData.shipping_address.name}</p>
                <p>{orderData.shipping_address.address}</p>
                <p>{orderData.shipping_address.city}</p>
                {orderData.shipping_address.phone && (
                  <p>Phone: {orderData.shipping_address.phone}</p>
                )}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No shipping address available</p>
            )}
          </div>
        </div>
      </div>

      {/* Order Items */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Order Items ({orderData.items?.length || 0} items)
        </h3>
        
        {orderData.items && orderData.items.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {orderData.items.map((item, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-16 h-16 flex-shrink-0 overflow-hidden rounded-md bg-gray-100 mr-4">
                          <img
                            src={item.product_id?.product_image || "/api/placeholder/100/100"}
                            alt={item.product_id?.product_name || "Product"}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.src = "/api/placeholder/100/100";
                            }}
                          />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {item.product_id?.product_name || "Product Name"}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {item.product_id?.product_brand || "Unknown Brand"}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {formatPrice(item.price)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {item.quantity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {formatPrice(item.price * item.quantity)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500 dark:text-gray-400">No items found for this order</p>
        )}
      </div>

      {/* Status Update Modal */}
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
