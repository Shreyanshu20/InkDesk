import React, { useState, useEffect } from "react";
import PageHeader from "./components/PageHeader";
import StatCard from "./components/StatCard";
import SalesChart from "./components/SalesChart";
import TopProducts from "./components/TopProducts";
import LowStockAlerts from "./components/LowStockAlerts";
import RecentOrders from "./components/RecentOrders";
import RecentActivity from "./components/RecentActivity";
import axios from "axios";

function Dashboard() {
  const [timeRange, setTimeRange] = useState("weekly");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState({
    stats: {
      users: { total: 0, recentUsers: 0 },
      orders: {
        total: 0,
        totalRevenue: 0,
        averageOrderValue: 0,
        recentOrders: 0,
      },
      products: { totalProducts: 0, activeProducts: 0, outOfStockProducts: 0 },
      reviews: { totalReviews: 0, averageRating: 0, recentReviews: 0 },
    },
    recentOrders: [],
    lowStockProducts: [],
    topProducts: [],
    recentActivity: [],
  });

  // API base URL - Vite uses import.meta.env instead of process.env
  const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

  // Enhanced fetch with better error handling
  const fetchWithErrorHandling = async (url, options = {}) => {
    try {
      console.log(`🌐 Fetching: ${url}`);
      
      const response = await fetch(url, {
        ...options,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        }
      });

      console.log(`📡 Response status: ${response.status} for ${url}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log(`✅ Success fetching ${url}`);
      return data;
    } catch (error) {
      console.error(`❌ Network error for ${url}:`, error);
      throw error;
    }
  };

  // Update fetchDashboardStats - REMOVE health check
  const fetchDashboardStats = async () => {
    try {
      console.log(`🔍 Backend URL: ${API_BASE_URL}`);
      
      // Remove this health check - it's causing CORS issues
      // const healthCheck = await fetchWithErrorHandling(`${API_BASE_URL}/health`);
      // console.log('🏥 Backend health check:', healthCheck);

      // Fetch all statistics in parallel
      const [usersStats, ordersStats, productsStats, reviewsStats] = await Promise.allSettled([
        fetchWithErrorHandling(`${API_BASE_URL}/admin/users/stats`),
        fetchWithErrorHandling(`${API_BASE_URL}/admin/orders/stats`),
        fetchWithErrorHandling(`${API_BASE_URL}/admin/products/stats`),
        fetchWithErrorHandling(`${API_BASE_URL}/admin/reviews/stats`),
      ]);

      return {
        users: usersStats.status === 'fulfilled' && usersStats.value.success
          ? usersStats.value.stats
          : { total: 0, recentUsers: 0 },
        orders: ordersStats.status === 'fulfilled' && ordersStats.value.success
          ? ordersStats.value.stats
          : { total: 0, totalRevenue: 0, averageOrderValue: 0, recentOrders: 0 },
        products: productsStats.status === 'fulfilled' && productsStats.value.success
          ? productsStats.value.stats
          : { totalProducts: 0, activeProducts: 0, outOfStockProducts: 0 },
        reviews: reviewsStats.status === 'fulfilled' && reviewsStats.value.success
          ? reviewsStats.value.stats
          : { totalReviews: 0, averageRating: 0, recentReviews: 0 },
      };
    } catch (error) {
      console.error("❌ Error fetching dashboard stats:", error);
      throw new Error(`Backend connection failed: ${error.message}`);
    }
  };

  // Fetch recent orders
  const fetchRecentOrders = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/admin/orders?page=1&limit=5&sortBy=createdAt&order=desc`,
        {
          headers: {
            "Content-Type": "application/json",
          },
          credentials: 'include' // Use cookies
        }
      );

      const data = await response.json();
      if (data.success) {
        return data.orders.map((order) => ({
          id: order.order_number || order._id,
          customer: order.user_id
            ? `${order.user_id.first_name} ${order.user_id.last_name}`
            : "Unknown Customer",
          date: new Date(order.createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          }),
          amount: `₹${order.total_amount.toLocaleString()}`,
          status: order.status.charAt(0).toUpperCase() + order.status.slice(1),
        }));
      }
      return [];
    } catch (error) {
      console.error("Error fetching recent orders:", error);
      return [];
    }
  };

  // Fetch low stock products
  const fetchLowStockProducts = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/admin/products?page=1&limit=50&sortBy=product_stock&order=asc`,
        {
          headers: {
            "Content-Type": "application/json",
          },
          credentials: 'include' // Use cookies
        }
      );

      const data = await response.json();
      if (data.success) {
        const lowStockThreshold = 10;
        return data.products
          .filter((product) => product.product_stock <= lowStockThreshold)
          .slice(0, 5)
          .map((product) => ({
            id: product._id,
            name: product.product_name,
            stock: product.product_stock,
            threshold: lowStockThreshold,
          }));
      }
      return [];
    } catch (error) {
      console.error("Error fetching low stock products:", error);
      return [];
    }
  };

  // Generate top products from orders (simplified approach)
  const generateTopProducts = (orders) => {
    const productSales = {};

    orders.forEach((order) => {
      if (order.items) {
        order.items.forEach((item) => {
          if (item.product_id) {
            const productName =
              item.product_id.product_name || "Unknown Product";
            const revenue = item.price * item.quantity;

            if (productSales[productName]) {
              productSales[productName].sales += item.quantity;
              productSales[productName].revenue += revenue;
            } else {
              productSales[productName] = {
                name: productName,
                sales: item.quantity,
                revenue: revenue,
              };
            }
          }
        });
      }
    });

    return Object.values(productSales)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5)
      .map((product, index) => ({
        id: index + 1,
        name: product.name,
        sales: product.sales,
        revenue: Math.round(product.revenue),
      }));
  };

  // Generate recent activity
  const generateRecentActivity = (orders, stats) => {
    const activities = [];

    // Add recent order activities
    orders.slice(0, 3).forEach((order, index) => {
      activities.push({
        id: `order_${index}`,
        type: "order",
        message: `New order ${order.id} received from ${order.customer}`,
        time: order.date,
      });
    });

    // Add system activities based on stats
    if (stats.users.recentUsers > 0) {
      activities.push({
        id: "users_activity",
        type: "user",
        message: `${stats.users.recentUsers} new users registered this week`,
        time: "This week",
      });
    }

    if (stats.reviews.recentReviews > 0) {
      activities.push({
        id: "reviews_activity",
        type: "review",
        message: `${stats.reviews.recentReviews} new reviews received this week`,
        time: "This week",
      });
    }

    if (stats.products.outOfStockProducts > 0) {
      activities.push({
        id: "stock_activity",
        type: "product",
        message: `${stats.products.outOfStockProducts} products are out of stock`,
        time: "Current",
      });
    }

    return activities.slice(0, 6); // Limit to 6 activities
  };

  // Load all dashboard data
  const loadDashboardData = async () => {
    setLoading(true);
    setError(null);

    try {
      console.log('🚀 Loading dashboard data...');
      console.log('🔧 Environment:', {
        isDev: import.meta.env.DEV,
        backendUrl: API_BASE_URL,
        mode: import.meta.env.MODE
      });

      // Always try to fetch real data first
      const stats = await fetchDashboardStats();
      const recentOrders = await fetchRecentOrders();
      const lowStockProducts = await fetchLowStockProducts();

      // Fetch more orders for analytics
      const allOrdersData = await fetchWithErrorHandling(
        `${API_BASE_URL}/admin/orders?page=1&limit=100`
      );
      const allOrders = allOrdersData.success ? allOrdersData.orders : [];

      // Generate derived data
      const topProducts = generateTopProducts(allOrders);
      const recentActivity = generateRecentActivity(recentOrders, stats);

      setDashboardData({
        stats,
        recentOrders,
        lowStockProducts,
        topProducts,
        recentActivity,
      });

      console.log('✅ Dashboard data loaded successfully');

    } catch (error) {
      console.error("❌ Error loading dashboard data:", error);
      
      // Determine error type
      let errorMessage = "Failed to load dashboard data.";
      
      if (error.message.includes('NetworkError') || error.message.includes('fetch')) {
        errorMessage = "Cannot connect to server. Please check your internet connection.";
      } else if (error.message.includes('CORS')) {
        errorMessage = "Server configuration error. Please contact support.";
      } else if (error.message.includes('401') || error.message.includes('403')) {
        errorMessage = "Authentication expired. Please log in again.";
      }
      
      setError(errorMessage);
      
      // Redirect to login if auth error
      if (error.message.includes('401') || error.message.includes('403')) {
        setTimeout(() => {
          const frontendUrl = import.meta.env.VITE_FRONTEND_URL || 'http://localhost:5173';
          window.location.href = `${frontendUrl}/login?type=admin`;
        }, 2000);
      }
    } finally {
      setLoading(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    loadDashboardData();
  }, []);

  // Auto-refresh data every 5 minutes (only in production)
  useEffect(() => {
    if (!import.meta.env.DEV) {
      const interval = setInterval(() => {
        loadDashboardData();
      }, 5 * 60 * 1000); // 5 minutes

      return () => clearInterval(interval);
    }
  }, []);

  // Sales data for chart - Updated with INR values
  const salesData = {
    daily: {
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      data: [15000, 12000, 18000, 22000, 28000, 35000, 25000], // Weekly sales in ₹
    },
    weekly: {
      labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
      data: [125000, 180000, 220000, 195000], // Monthly weekly breakdown in ₹
    },
    monthly: {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      data: [450000, 520000, 680000, 590000, 720000, 650000], // 6-month sales in ₹
    },
  };

  // Enhanced format currency function
  const formatCurrency = (amount) => {
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  // Format currency for charts (shorter format for better display)
  const formatChartCurrency = (amount) => {
    if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(1)}L`; // Lakhs
    } else if (amount >= 1000) {
      return `₹${(amount / 1000).toFixed(0)}K`; // Thousands
    }
    return `₹${amount}`;
  };

  if (loading) {
    return (
      <div className="container mx-auto p-10 py-4 bg-gray-100 dark:bg-gray-900">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <span className="ml-4 text-lg text-text">Loading dashboard...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-10 py-4 bg-gray-100 dark:bg-gray-900">
        <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 text-red-700 dark:text-red-400 px-4 py-3 rounded mb-4">
          <div className="flex items-center">
            <i className="fas fa-exclamation-triangle mr-2"></i>
            <span>{error}</span>
          </div>
          <button
            onClick={loadDashboardData}
            className="mt-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded text-sm"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-10 py-4 bg-gray-100 dark:bg-gray-900">
      {/* Page Title */}
      <PageHeader
        title="Dashboard Overview"
        subtitle="Welcome back! Here's what's happening with your store today."
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Revenue"
          value={formatCurrency(dashboardData.stats.orders.totalRevenue || 0)}
          change={`${
            dashboardData.stats.orders.recentOrders || 0
          } recent orders`}
          icon="fas fa-chart-line"
          iconBg="bg-green-100 dark:bg-green-900/30"
          iconColor="text-green-600 dark:text-green-400"
        />

        <StatCard
          title="Total Orders"
          value={dashboardData.stats.orders.total.toLocaleString()}
          change={`Avg: ${formatCurrency(
            Math.round(dashboardData.stats.orders.averageOrderValue || 0)
          )}`}
          icon="fas fa-shopping-bag"
          iconBg="bg-primary/10 dark:bg-primary/20"
          iconColor="text-primary"
        />

        <StatCard
          title="Total Products"
          value={dashboardData.stats.products.totalProducts.toLocaleString()}
          change={`${dashboardData.stats.products.outOfStockProducts} out of stock`}
          icon="fas fa-box"
          iconBg="bg-secondary/10 dark:bg-secondary/20"
          iconColor="text-secondary"
        />

        <StatCard
          title="Total Users"
          value={dashboardData.stats.users.total.toLocaleString()}
          change={`${dashboardData.stats.users.recentUsers} new this week`}
          icon="fas fa-users"
          iconBg="bg-accent/10 dark:bg-accent/20"
          iconColor="text-accent"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <SalesChart
          salesData={salesData}
          timeRange={timeRange}
          setTimeRange={setTimeRange}
        />
        <TopProducts products={dashboardData.topProducts} />
      </div>

      {/* Second Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <LowStockAlerts items={dashboardData.lowStockProducts} />
        <RecentOrders orders={dashboardData.recentOrders} />
        <RecentActivity activities={dashboardData.recentActivity} />
      </div>

      {/* Additional Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-background p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text/70">Average Rating</p>
              <p className="text-2xl font-bold text-text">
                {dashboardData.stats.reviews.averageRating.toFixed(1)}
              </p>
            </div>
            <div className="bg-yellow-100 dark:bg-yellow-900/30 p-3 rounded-full">
              <i className="fas fa-star text-yellow-600 dark:text-yellow-400"></i>
            </div>
          </div>
        </div>

        <div className="bg-background p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text/70">Total Reviews</p>
              <p className="text-2xl font-bold text-text">
                {dashboardData.stats.reviews.totalReviews.toLocaleString()}
              </p>
            </div>
            <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-full">
              <i className="fas fa-comments text-purple-600 dark:text-purple-400"></i>
            </div>
          </div>
        </div>

        <div className="bg-background p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text/70">Active Products</p>
              <p className="text-2xl font-bold text-text">
                {dashboardData.stats.products.activeProducts.toLocaleString()}
              </p>
            </div>
            <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full">
              <i className="fas fa-check-circle text-blue-600 dark:text-blue-400"></i>
            </div>
          </div>
        </div>

        <div className="bg-background p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text/70">Stock Alerts</p>
              <p className="text-2xl font-bold text-text">
                {dashboardData.lowStockProducts.length}
              </p>
            </div>
            <div className="bg-red-100 dark:bg-red-900/30 p-3 rounded-full">
              <i className="fas fa-exclamation-triangle text-red-600 dark:text-red-400"></i>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
