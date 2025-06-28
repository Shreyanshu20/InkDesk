import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import Loader from "../Common/Loader";
import Table from "../Common/Table";
import Pagination from "../Common/Pagination";
import BulkActions from "../Common/BulkActions";
import { getOrderTableConfig } from "../Common/tableConfig";
import StatusUpdateModal from "./components/StatusUpdateModal";
import { getStatusColor } from "./components/utils";
import OrdersSkeleton from "./OrdersSkeleton";

const API_BASE_URL =
  import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

function Orders() {
  const navigate = useNavigate();
  const location = useLocation();
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [selectedOrderForStatus, setSelectedOrderForStatus] = useState(null);
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });
  const [totalOrders, setTotalOrders] = useState(0);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    processing: 0,
    shipped: 0,
    delivered: 0,
    cancelled: 0,
  });

  const orderStatuses = [
    "pending",
    "processing",
    "shipped",
    "delivered",
    "cancelled",
  ];

  const fetchOrders = useCallback(async () => {
    try {
      setIsLoading(true);

      const params = new URLSearchParams();
      params.append("page", page + 1);
      params.append("limit", rowsPerPage);

      if (searchQuery.trim()) {
        params.append("search", searchQuery.trim());
      }

      if (statusFilter !== "all") {
        params.append("status", statusFilter);
      }

      if (sortConfig.key) {
        let sortBy = sortConfig.key;
        if (sortBy === "customer") sortBy = "user_id";
        else if (sortBy === "date") sortBy = "createdAt";
        else if (sortBy === "total") sortBy = "total_amount";
        else if (sortBy === "id") sortBy = "order_number";

        params.append("sortBy", sortBy);
        params.append(
          "sortOrder",
          sortConfig.direction === "ascending" ? "asc" : "desc"
        );
      }

      const response = await axios.get(
        `${API_BASE_URL}/admin/orders?${params.toString()}`,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        const transformedOrders = response.data.orders.map((order) => {
          let customer = {
            name: "Unknown Customer",
            email: "no-email@example.com",
            id: order.user_id?._id || order.user_id || "unknown",
          };

          if (order.user_id && typeof order.user_id === "object") {
            const firstName = order.user_id.first_name || "";
            const lastName = order.user_id.last_name || "";
            customer.name =
              `${firstName} ${lastName}`.trim() || "Unknown Customer";
            customer.email = order.user_id.email || "no-email@example.com";
            customer.id = order.user_id._id;
          }

          if (order.shipping_address && order.shipping_address.name) {
            if (customer.name === "Unknown Customer") {
              customer.name = order.shipping_address.name;
            }
          }

          return {
            id: order._id,
            customer: customer,
            date: order.createdAt,
            total: order.total_amount || 0,
            status: order.status,
            order_number: order.order_number,
            items: order.items || [],
            shipping_address: order.shipping_address,
            user_id: order.user_id,
          };
        });

        setOrders(transformedOrders);
        setTotalOrders(
          response.data.pagination?.totalOrders || transformedOrders.length
        );
      }
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error("Please login to access orders");
        navigate("/admin/login");
      } else {
        toast.error("Failed to load orders");
      }
      setOrders([]);
      setTotalOrders(0);
    } finally {
      setIsLoading(false);
    }
  }, [page, rowsPerPage, searchQuery, statusFilter, sortConfig, navigate]);

  const fetchOrderStats = useCallback(async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/admin/orders/stats`, {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      });

      if (response.data.success) {
        setStats(response.data.stats);
      }
    } catch (error) {
      setStats({
        total: 0,
        pending: 0,
        processing: 0,
        shipped: 0,
        delivered: 0,
        cancelled: 0,
        totalRevenue: 0,
        averageOrderValue: 0,
        todaysOrders: 0,
        thisWeekOrders: 0,
      });
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  useEffect(() => {
    fetchOrderStats();
  }, []);

  const handleSearchChange = useCallback((e) => {
    setSearchQuery(e.target.value);
    setPage(0);
  }, []);

  const handleStatusFilterChange = useCallback((e) => {
    setStatusFilter(e.target.value);
    setPage(0);
  }, []);

  const handlePageChange = useCallback((newPage) => {
    setPage(newPage);
  }, []);

  const handleRowsPerPageChange = useCallback((newRowsPerPage) => {
    setRowsPerPage(parseInt(newRowsPerPage, 10));
    setPage(0);
  }, []);

  const handleSortChange = useCallback((newSortConfig) => {
    setSortConfig(newSortConfig);
    setPage(0);
  }, []);

  const handleViewOrder = useCallback(
    (orderId) => {
      navigate(`/admin/orders/view/${orderId}`);
    },
    [navigate]
  );

  const openStatusModal = useCallback((order, e) => {
    if (e) e.stopPropagation();
    setSelectedOrderForStatus(order);
    setStatusModalOpen(true);
  }, []);

  const closeStatusModal = useCallback(() => {
    setStatusModalOpen(false);
    setSelectedOrderForStatus(null);
  }, []);

  const handleStatusUpdate = useCallback(
    async (newStatus) => {
      if (!selectedOrderForStatus) return;

      try {
        const response = await axios.put(
          `${API_BASE_URL}/admin/orders/${selectedOrderForStatus.id}/status`,
          { status: newStatus },
          {
            withCredentials: true,
            headers: { "Content-Type": "application/json" },
          }
        );

        if (response.data.success) {
          setOrders((prevOrders) =>
            prevOrders.map((order) =>
              order.id === selectedOrderForStatus.id
                ? { ...order, status: newStatus }
                : order
            )
          );
          toast.success("Order status updated successfully");

          fetchOrderStats();
        }
      } catch (error) {
        toast.error(
          error.response?.data?.message || "Failed to update order status"
        );
      }

      closeStatusModal();
    },
    [selectedOrderForStatus, closeStatusModal, fetchOrderStats]
  );

  const handleDeleteOrder = useCallback(
    async (orderId) => {
      if (window.confirm("Are you sure you want to delete this order?")) {
        try {
          const response = await axios.delete(
            `${API_BASE_URL}/admin/orders/${orderId}`,
            {
              withCredentials: true,
              headers: { "Content-Type": "application/json" },
            }
          );

          if (response.data.success) {
            setOrders((prevOrders) =>
              prevOrders.filter((order) => order.id !== orderId)
            );
            toast.success("Order deleted successfully");

            fetchOrderStats();
          }
        } catch (error) {
          toast.error(
            error.response?.data?.message || "Failed to delete order"
          );
        }
      }
    },
    [fetchOrderStats]
  );

  const handleBulkDelete = useCallback(
    async (ids) => {
      if (window.confirm(`Delete ${ids.length} selected order(s)?`)) {
        try {
          const deletePromises = ids.map((id) =>
            axios.delete(`${API_BASE_URL}/admin/orders/${id}`, {
              withCredentials: true,
              headers: { "Content-Type": "application/json" },
            })
          );

          const results = await Promise.allSettled(deletePromises);
          const successful = results.filter(
            (result) => result.status === "fulfilled"
          ).length;

          setOrders((prevOrders) =>
            prevOrders.filter((order) => !ids.includes(order.id))
          );
          setSelectedOrders([]);

          if (successful === ids.length) {
            toast.success(`Successfully deleted ${successful} order(s)`);
          } else {
            toast.warning(`Deleted ${successful} of ${ids.length} orders`);
          }

          fetchOrderStats();
        } catch (error) {
          toast.error("Failed to delete orders");
        }
      }
    },
    [fetchOrderStats]
  );

  const handleSelectOrder = useCallback((orderId, selected) => {
    setSelectedOrders((prev) =>
      selected ? [...prev, orderId] : prev.filter((id) => id !== orderId)
    );
  }, []);

  const handleSelectAll = useCallback(
    (selected) => {
      if (selected) {
        const currentPageIds = orders.map((order) => order.id);
        setSelectedOrders((prev) => [...new Set([...prev, ...currentPageIds])]);
      } else {
        const currentPageIds = orders.map((order) => order.id);
        setSelectedOrders((prev) =>
          prev.filter((id) => !currentPageIds.includes(id))
        );
      }
    },
    [orders]
  );

  const tableConfig = useMemo(
    () =>
      getOrderTableConfig(handleViewOrder, handleDeleteOrder, openStatusModal),
    [handleViewOrder, handleDeleteOrder, openStatusModal]
  );

  if (isLoading && orders.length === 0) {
    return <OrdersSkeleton />;
  }

  return (
    <div className="p-6 bg-background">
      <div className="mb-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
              Orders Management
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Manage and track all customer orders ({stats.total} total orders)
              {stats.totalRevenue > 0 && (
                <>
                  {" "}
                  • ₹{stats.totalRevenue.toLocaleString("en-IN")} total revenue
                </>
              )}
              {stats.todaysOrders > 0 && (
                <> • {stats.todaysOrders} orders today</>
              )}
            </p>
          </div>
          <button
            onClick={() => {
              fetchOrders();
              fetchOrderStats();
            }}
            className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-md flex items-center gap-2 font-medium transition-colors"
          >
            <i className="fas fa-refresh"></i>
            <span>Refresh</span>
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 flex items-center">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <i className="fas fa-shopping-cart text-blue-600 dark:text-blue-400"></i>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Total
                </p>
                <p className="text-xl font-semibold text-gray-900 dark:text-white">
                  {stats.total}
                </p>
                {stats.thisWeekOrders > 0 && (
                  <p className="text-xs text-green-600 dark:text-green-400">
                    +{stats.thisWeekOrders} this week
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 flex items-center">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                <i className="fas fa-clock text-yellow-600 dark:text-yellow-400"></i>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Pending
                </p>
                <p className="text-xl font-semibold text-gray-900 dark:text-white">
                  {stats.pending}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 flex items-center">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <i className="fas fa-cog text-blue-600 dark:text-blue-400"></i>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Processing
                </p>
                <p className="text-xl font-semibold text-gray-900 dark:text-white">
                  {stats.processing}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 flex items-center">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <i className="fas fa-truck text-purple-600 dark:text-purple-400"></i>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Shipped
                </p>
                <p className="text-xl font-semibold text-gray-900 dark:text-white">
                  {stats.shipped}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 flex items-center">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                <i className="fas fa-check-circle text-green-600 dark:text-green-400"></i>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Delivered
                </p>
                <p className="text-xl font-semibold text-gray-900 dark:text-white">
                  {stats.delivered}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 flex items-center">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 dark:bg-red-900 rounded-lg">
                <i className="fas fa-times-circle text-red-600 dark:text-red-400"></i>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Cancelled
                </p>
                <p className="text-xl font-semibold text-gray-900 dark:text-white">
                  {stats.cancelled}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-6 bg-white dark:bg-gray-800 p-4 rounded-md shadow-sm grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="search"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Search Orders
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <i className="fas fa-search text-gray-400"></i>
            </div>
            <input
              id="search"
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 placeholder-gray-500 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-primary focus:border-primary"
              placeholder="Search by order number, customer name, or email..."
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="status-filter"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Filter by Status
          </label>
          <select
            id="status-filter"
            value={statusFilter}
            onChange={handleStatusFilterChange}
            className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-md shadow-sm">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader />
          </div>
        ) : (
          <>
            <Table
              data={orders}
              columns={tableConfig.columns}
              selectedItems={selectedOrders}
              onSelectItem={handleSelectOrder}
              onSelectAll={handleSelectAll}
              sortConfig={sortConfig}
              onSortChange={handleSortChange}
              isLoading={isLoading}
              emptyMessage="No orders found. Orders will appear here once customers place them."
              enableSelection={true}
              enableSorting={true}
              itemKey="id"
            />

            <Pagination
              page={page}
              rowsPerPage={rowsPerPage}
              totalItems={totalOrders}
              handlePageChange={handlePageChange}
              handleRowsPerPageChange={handleRowsPerPageChange}
              entityName="orders"
            />
          </>
        )}
      </div>

      {selectedOrders.length > 0 && (
        <BulkActions
          selectedItems={selectedOrders}
          actions={[
            {
              label: "Delete Selected",
              icon: "fas fa-trash",
              onClick: (selectedIds) => handleBulkDelete(selectedIds),
              className:
                "bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded-md",
              title: "Delete selected orders",
            },
          ]}
          entityName="orders"
          position="bottom-right"
        />
      )}

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
