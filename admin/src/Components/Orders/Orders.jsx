import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import Table from "../Common/Table";
import { getOrderTableConfig } from "../Common/tableConfig";

// Import common components
import Pagination from "../Common/Pagination";
import BulkActions from "../Common/BulkActions";

// Keep order-specific components
import StatusUpdateModal from "./components/StatusUpdateModal";
import SearchFilters from "./components/SearchFilters";
import { getStatusColor } from "./components/utils";

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

function Orders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [selectedOrderForStatus, setSelectedOrderForStatus] = useState(null);
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });

  const orderStatuses = ["pending", "processing", "shipped", "delivered", "cancelled"];

  // Fetch orders from backend
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/admin/orders`, {
        withCredentials: true,
      });

      if (response.data.success) {
        // Transform backend data to frontend format
        const transformedOrders = response.data.orders.map((order) => {
          let customer = { 
            name: "Customer", 
            email: "customer@example.com",
            id: order.user_id 
          };

          // Try to get customer info from populated user data
          if (order.user_id && typeof order.user_id === 'object') {
            customer.name = `${order.user_id.first_name || ''} ${order.user_id.last_name || ''}`.trim();
            customer.email = order.user_id.email;
            customer.id = order.user_id._id;
          }
          
          // Fallback to shipping address if user data not populated
          if (order.shipping_address) {
            if (order.shipping_address.name && customer.name === "Customer") {
              customer.name = order.shipping_address.name;
            }
            if (order.shipping_address.email && customer.email === "customer@example.com") {
              customer.email = order.shipping_address.email;
            }
          }

          return {
            id: order._id,
            customer: customer,
            date: order.createdAt,
            total: order.total_amount,
            status: order.status,
            order_number: order.order_number,
            items: order.items,
            shipping_address: order.shipping_address,
            user_id: order.user_id
          };
        });

        setOrders(transformedOrders);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  // Fetch orders on component mount
  useEffect(() => {
    fetchOrders();
  }, []);

  // Filter orders
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.order_number?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Sort filtered orders based on sortConfig
  const sortedFilteredOrders = useMemo(() => {
    let sortableOrders = [...filteredOrders];
    if (sortConfig && sortConfig.key) {
      sortableOrders.sort((a, b) => {
        let aValue, bValue;

        // Handle nested properties and different data types
        if (sortConfig.key === "customer") {
          aValue = a.customer.name.toLowerCase();
          bValue = b.customer.name.toLowerCase();
        } else if (sortConfig.key === "date") {
          aValue = new Date(a.date).getTime();
          bValue = new Date(b.date).getTime();
        } else if (sortConfig.key === "total") {
          aValue = a.total;
          bValue = b.total;
        } else if (sortConfig.key === "id") {
          aValue = a.order_number || a.id;
          bValue = b.order_number || b.id;
        } else {
          aValue = a[sortConfig.key];
          bValue = b[sortConfig.key];
        }

        if (aValue < bValue) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableOrders;
  }, [filteredOrders, sortConfig]);

  // Paginate sorted orders
  const paginatedOrders = sortedFilteredOrders.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (e) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  };

  const handleViewOrder = (orderId) => {
    // Find the order in current data
    const order = orders.find(o => o.id === orderId);
    if (order) {
      navigate(`/admin/orders/${orderId}`, { state: { orderData: order } });
    } else {
      toast.error("Order not found");
    }
  };

  const openStatusModal = (order, e) => {
    if (e) e.stopPropagation();
    setSelectedOrderForStatus(order);
    setStatusModalOpen(true);
  };

  const closeStatusModal = () => {
    setStatusModalOpen(false);
    setSelectedOrderForStatus(null);
  };

  const handleStatusUpdate = async (newStatus) => {
    if (!selectedOrderForStatus) return;

    try {
      const response = await axios.put(
        `${API_BASE_URL}/admin/orders/${selectedOrderForStatus.id}/status`,
        { status: newStatus },
        { withCredentials: true }
      );

      if (response.data.success) {
        // Update local state
        setOrders(
          orders.map((order) =>
            order.id === selectedOrderForStatus.id
              ? { ...order, status: newStatus }
              : order
          )
        );
        toast.success("Order status updated successfully");
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error("Failed to update order status");
    }

    closeStatusModal();
  };

  const handleDelete = async (ids) => {
    if (
      window.confirm(
        `Delete ${ids.length > 1 ? "these orders" : "this order"}?`
      )
    ) {
      try {
        const deletePromises = ids.map(id =>
          axios.delete(`${API_BASE_URL}/admin/orders/${id}`, {
            withCredentials: true,
          })
        );

        await Promise.all(deletePromises);
        
        // Remove deleted orders from state
        setOrders(orders.filter((order) => !ids.includes(order.id)));
        setSelectedOrders([]);
        toast.success(`${ids.length} order(s) deleted successfully`);
      } catch (error) {
        console.error("Error deleting orders:", error);
        toast.error("Failed to delete orders");
      }
    }
  };

  const handleSelect = (orderId, selected) => {
    setSelectedOrders((prev) =>
      selected ? [...prev, orderId] : prev.filter((id) => id !== orderId)
    );
  };

  const handleSelectAll = (selected) => {
    if (selected) {
      const newSelection = filteredOrders.map((order) => order.id);
      setSelectedOrders(newSelection);
    } else {
      setSelectedOrders([]);
    }
  };

  const handleSortChange = (newSortConfig) => {
    setSortConfig(newSortConfig);
  };

  // Get table config
  const tableConfig = getOrderTableConfig(
    handleViewOrder,
    handleDelete,
    openStatusModal
  );

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Orders
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {filteredOrders.length} orders found
          </p>
        </div>
        <button
          onClick={fetchOrders}
          className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-md flex items-center gap-2 font-medium"
        >
          <i className="fas fa-refresh"></i>
          <span>Refresh</span>
        </button>
      </div>

      {/* Search and Filters */}
      <SearchFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
      />

      {/* Orders Table */}
      <div className="bg-white dark:bg-gray-800 rounded-md shadow-md overflow-hidden">
        {loading ? (
          <div className="p-6 text-center">
            <i className="fas fa-spinner fa-spin text-primary mr-2"></i>
            Loading orders...
          </div>
        ) : (
          <>
            <Table
              data={paginatedOrders}
              columns={tableConfig.columns}
              selectedItems={selectedOrders}
              onSelect={handleSelect}
              onSelectAll={handleSelectAll}
              sortConfig={sortConfig}
              onSortChange={handleSortChange}
              isLoading={loading}
              emptyMessage="No orders found"
              isSelectable={true}
            />

            {/* Common Pagination Component */}
            <Pagination
              page={page}
              rowsPerPage={rowsPerPage}
              totalItems={filteredOrders.length}
              handlePageChange={handlePageChange}
              handleRowsPerPageChange={handleRowsPerPageChange}
              entityName="orders"
            />
          </>
        )}
      </div>

      {/* Common BulkActions Component */}
      {selectedOrders.length > 0 && (
        <BulkActions
          selectedItems={selectedOrders}
          entityName="orders"
          actions={[
            {
              label: "Delete",
              onClick: handleDelete,
              className:
                "bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded-md",
              icon: "fas fa-trash",
              title: "Delete selected orders",
            },
          ]}
        />
      )}

      {/* Status Update Modal */}
      <StatusUpdateModal
        statusModalOpen={statusModalOpen}
        selectedOrderForStatus={selectedOrderForStatus}
        closeStatusModal={closeStatusModal}
        orderStatuses={orderStatuses}
        handleStatusUpdate={handleStatusUpdate}
        getStatusColor={getStatusColor}
      />
    </div>
  );
}

export default Orders;
