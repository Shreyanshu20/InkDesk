import React, { useState, useEffect } from "react";
import PageHeader from "./components/PageHeader";
import StatCard from "./components/StatCard";
import SalesChart from "./components/SalesChart";
import TopProducts from "./components/TopProducts";
import LowStockAlerts from "./components/LowStockAlerts";
import RecentOrders from "./components/RecentOrders";
import RecentActivity from "./components/RecentActivity";
import DashboardSkeleton from "./DashboardSkeleton";
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
    salesData: {
      daily: {
        labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        data: [0, 0, 0, 0, 0, 0, 0],
      },
      weekly: {
        labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
        data: [0, 0, 0, 0],
      },
      monthly: {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
        data: [0, 0, 0, 0, 0, 0],
      },
    },
  });

  const API_BASE_URL =
    import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

  const fetchWithErrorHandling = async (url, options = {}) => {
    try {
      const response = await fetch(url, {
        ...options,
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      throw error;
    }
  };

  const fetchDashboardStats = async () => {
    try {
      const [usersStats, ordersStats, productsStats, reviewsStats] =
        await Promise.allSettled([
          fetchWithErrorHandling(`${API_BASE_URL}/admin/users/stats`),
          fetchWithErrorHandling(`${API_BASE_URL}/admin/orders/stats`),
          fetchWithErrorHandling(`${API_BASE_URL}/admin/products/stats`),
          fetchWithErrorHandling(`${API_BASE_URL}/admin/reviews/stats`),
        ]);

      return {
        users:
          usersStats.status === "fulfilled" && usersStats.value.success
            ? usersStats.value.stats
            : { total: 0, recentUsers: 0 },
        orders:
          ordersStats.status === "fulfilled" && ordersStats.value.success
            ? ordersStats.value.stats
            : {
                total: 0,
                totalRevenue: 0,
                averageOrderValue: 0,
                recentOrders: 0,
              },
        products:
          productsStats.status === "fulfilled" && productsStats.value.success
            ? productsStats.value.stats
            : { totalProducts: 0, activeProducts: 0, outOfStockProducts: 0 },
        reviews:
          reviewsStats.status === "fulfilled" && reviewsStats.value.success
            ? reviewsStats.value.stats
            : { totalReviews: 0, averageRating: 0, recentReviews: 0 },
      };
    } catch (error) {
      throw new Error(`Backend connection failed: ${error.message}`);
    }
  };

  const fetchRecentOrders = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/admin/orders?page=1&limit=5&sortBy=createdAt&order=desc`,
        {
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
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
          amount: `₹${(order.total_amount || 0).toLocaleString()}`,
          status: order.status.charAt(0).toUpperCase() + order.status.slice(1),
        }));
      }
      return [];
    } catch (error) {
      return [];
    }
  };

  const fetchLowStockProducts = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/admin/products?page=1&limit=100&sortBy=product_stock&sortOrder=asc`,
        {
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      const data = await response.json();
      if (data.success) {
        const lowStockThreshold = 10;
        return data.products
          .filter(
            (product) =>
              product.product_stock <= lowStockThreshold &&
              product.product_stock > 0
          )
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
      return [];
    }
  };

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
      .slice(0, 6)
      .map((product, index) => ({
        id: index + 1,
        name: product.name,
        sales: product.sales,
        revenue: Math.round(product.revenue),
      }));
  };

  const generateRecentActivity = (orders, stats) => {
    const activities = [];

    orders.slice(0, 3).forEach((order, index) => {
      activities.push({
        id: `order_${index}`,
        type: "order",
        message: `New order ${order.id} received from ${order.customer}`,
        time: order.date,
      });
    });

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

    return activities.slice(0, 6);
  };

  const generateSalesData = (orders) => {
    if (!orders || orders.length === 0) {
      return {
        daily: {
          labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
          data: [0, 0, 0, 0, 0, 0, 0],
        },
        weekly: {
          labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
          data: [0, 0, 0, 0],
        },
        monthly: {
          labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
          data: [0, 0, 0, 0, 0, 0],
        },
      };
    }

    const now = new Date();

    const dailyData = [];
    const dailyLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

    for (let i = 6; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dayStart = new Date(date.setHours(0, 0, 0, 0));
      const dayEnd = new Date(date.setHours(23, 59, 59, 999));

      const dayRevenue = orders
        .filter((order) => {
          const orderDate = new Date(order.createdAt);
          return orderDate >= dayStart && orderDate <= dayEnd;
        })
        .reduce((sum, order) => sum + (order.total_amount || 0), 0);

      dailyData.push(dayRevenue);
    }

    const weeklyData = [];
    const weeklyLabels = ["Week 1", "Week 2", "Week 3", "Week 4"];

    for (let i = 3; i >= 0; i--) {
      const weekStart = new Date(now);
      weekStart.setDate(weekStart.getDate() - (i * 7 + 6));
      weekStart.setHours(0, 0, 0, 0);

      const weekEnd = new Date(now);
      weekEnd.setDate(weekEnd.getDate() - i * 7);
      weekEnd.setHours(23, 59, 59, 999);

      const weekRevenue = orders
        .filter((order) => {
          const orderDate = new Date(order.createdAt);
          return orderDate >= weekStart && orderDate <= weekEnd;
        })
        .reduce((sum, order) => sum + (order.total_amount || 0), 0);

      weeklyData.push(weekRevenue);
    }

    const monthlyData = [];
    const monthlyLabels = [];

    for (let i = 5; i >= 0; i--) {
      const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthEnd = new Date(
        now.getFullYear(),
        now.getMonth() - i + 1,
        0,
        23,
        59,
        59,
        999
      );

      const monthName = monthStart.toLocaleDateString("en-US", {
        month: "short",
      });
      monthlyLabels.push(monthName);

      const monthRevenue = orders
        .filter((order) => {
          const orderDate = new Date(order.createdAt);
          return orderDate >= monthStart && orderDate <= monthEnd;
        })
        .reduce((sum, order) => sum + (order.total_amount || 0), 0);

      monthlyData.push(monthRevenue);
    }

    return {
      daily: {
        labels: dailyLabels,
        data: dailyData,
      },
      weekly: {
        labels: weeklyLabels,
        data: weeklyData,
      },
      monthly: {
        labels: monthlyLabels,
        data: monthlyData,
      },
    };
  };

  const loadDashboardData = async () => {
    setLoading(true);
    setError(null);

    try {
      const stats = await fetchDashboardStats();

      const allOrdersData = await fetchWithErrorHandling(
        `${API_BASE_URL}/admin/orders?page=1&limit=1000`
      );
      const allOrders = allOrdersData.success ? allOrdersData.orders : [];

      const calculatedRevenue = allOrders.reduce((total, order) => {
        const orderAmount = order.total_amount || 0;
        return total + orderAmount;
      }, 0);

      const calculatedAverage =
        allOrders.length > 0 ? calculatedRevenue / allOrders.length : 0;

      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const recentOrdersCount = allOrders.filter((order) => {
        const orderDate = new Date(order.createdAt);
        return orderDate >= sevenDaysAgo;
      }).length;

      stats.orders = {
        total: allOrders.length,
        totalRevenue: calculatedRevenue,
        averageOrderValue: calculatedAverage,
        recentOrders: recentOrdersCount,
      };

      const recentOrders = await fetchRecentOrders();
      const lowStockProducts = await fetchLowStockProducts();

      const topProducts = generateTopProducts(allOrders);
      const recentActivity = generateRecentActivity(recentOrders, stats);
      const realSalesData = generateSalesData(allOrders);

      setDashboardData({
        stats,
        recentOrders,
        lowStockProducts,
        topProducts,
        recentActivity,
        salesData: realSalesData,
      });
    } catch (error) {
      let errorMessage = "Failed to load dashboard data.";

      if (
        error.message.includes("NetworkError") ||
        error.message.includes("fetch")
      ) {
        errorMessage =
          "Cannot connect to server. Please check your internet connection.";
      } else if (error.message.includes("CORS")) {
        errorMessage = "Server configuration error. Please contact support.";
      } else if (
        error.message.includes("401") ||
        error.message.includes("403")
      ) {
        errorMessage = "Authentication expired. Please log in again.";
      }

      setError(errorMessage);

      if (error.message.includes("401") || error.message.includes("403")) {
        setTimeout(() => {
          const frontendUrl =
            import.meta.env.VITE_FRONTEND_URL || "http://localhost:5173";
          window.location.href = `${frontendUrl}/login?type=admin`;
        }, 2000);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  useEffect(() => {
    if (!import.meta.env.DEV) {
      const interval = setInterval(() => {
        loadDashboardData();
      }, 5 * 60 * 1000);

      return () => clearInterval(interval);
    }
  }, []);

  const formatCurrency = (amount) => {
    return `₹${amount.toLocaleString("en-IN")}`;
  };

  if (loading) {
    return <DashboardSkeleton />;
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
      <PageHeader
        title="Dashboard Overview"
        subtitle="Welcome back! Here's what's happening with your store today."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Revenue"
          value={formatCurrency(dashboardData.stats.orders.totalRevenue || 0)}
          change={`${
            dashboardData.stats.orders.recentOrders || 0
          } recent orders`}
          icon="fas fa-chart-line"
        />

        <StatCard
          title="Total Orders"
          value={(dashboardData.stats.orders.total || 0).toLocaleString()}
          change={`Avg: ${formatCurrency(
            Math.round(dashboardData.stats.orders.averageOrderValue || 0)
          )}`}
          icon="fas fa-shopping-bag"
        />

        <StatCard
          title="Total Products"
          value={(
            dashboardData.stats.products.totalProducts || 0
          ).toLocaleString()}
          change={`${
            dashboardData.stats.products.outOfStockProducts || 0
          } out of stock`}
          icon="fas fa-box"
        />

        <StatCard
          title="Total Users"
          value={(dashboardData.stats.users.total || 0).toLocaleString()}
          change={`${dashboardData.stats.users.recentUsers || 0} new this week`}
          icon="fas fa-users"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <SalesChart
          salesData={dashboardData.salesData}
          timeRange={timeRange}
          setTimeRange={setTimeRange}
        />
        <TopProducts products={dashboardData.topProducts} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <LowStockAlerts items={dashboardData.lowStockProducts} />
        <RecentOrders orders={dashboardData.recentOrders} />
        <RecentActivity activities={dashboardData.recentActivity} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-background p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text/70">Average Rating</p>
              <p className="text-2xl font-bold text-text">
                {Number(dashboardData.stats.reviews.averageRating || 0).toFixed(
                  1
                )}
              </p>
            </div>
            <div className="bg-yellow-100 dark:bg-yellow-900/30 w-9 h-9 flex items-center justify-center rounded-full">
              <i className="fas fa-star text-yellow-600 dark:text-yellow-400"></i>
            </div>
          </div>
        </div>

        <div className="bg-background p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text/70">Total Reviews</p>
              <p className="text-2xl font-bold text-text">
                {(
                  dashboardData.stats.reviews.totalReviews || 0
                ).toLocaleString()}
              </p>
            </div>
            <div className="bg-purple-100 dark:bg-purple-900/30 w-9 h-9 flex items-center justify-center rounded-full">
              <i className="fas fa-comments text-purple-600 dark:text-purple-400"></i>
            </div>
          </div>
        </div>

        <div className="bg-background p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text/70">Active Products</p>
              <p className="text-2xl font-bold text-text">
                {(
                  dashboardData.stats.products.activeProducts || 0
                ).toLocaleString()}
              </p>
            </div>
            <div className="bg-blue-100 dark:bg-blue-900/30 w-9 h-9 flex items-center justify-center rounded-full">
              <i className="fas fa-check-circle text-blue-600 dark:text-blue-400"></i>
            </div>
          </div>
        </div>

        <div className="bg-background p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text/70">Stock Alerts</p>
              <p className="text-2xl font-bold text-text">
                {(dashboardData.lowStockProducts || []).length}
              </p>
            </div>
            <div className="bg-red-100 dark:bg-red-900/30 w-9 h-9 flex items-center justify-center rounded-full">
              <i className="fas fa-exclamation-triangle text-red-600 dark:text-red-400"></i>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
