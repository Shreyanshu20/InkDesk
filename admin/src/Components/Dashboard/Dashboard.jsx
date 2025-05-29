import React, { useState } from "react";
import PageHeader from "./components/PageHeader";
import StatCard from "./components/StatCard";
import SalesChart from "./components/SalesChart";
import TopProducts from "./components/TopProducts";
import LowStockAlerts from "./components/LowStockAlerts";
import RecentOrders from "./components/RecentOrders";
import RecentActivity from "./components/RecentActivity";

function Dashboard() {
  const [timeRange, setTimeRange] = useState("weekly");

  // Sample data - in a real app, this would come from your API
  const salesData = {
    daily: {
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      data: [4000, 3000, 5000, 2780, 1890, 2390, 3490],
    },
    weekly: {
      labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
      data: [24000, 18000, 32000, 27000],
    },
    monthly: {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      data: [95000, 85000, 120000, 75000, 80000, 110000],
    },
  };

  const topProducts = [
    { id: 1, name: "Premium Journal", sales: 342, revenue: 8550 },
    { id: 2, name: "Fountain Pen Set", sales: 276, revenue: 13800 },
    { id: 3, name: "Leather Notebook", sales: 213, revenue: 6390 },
    { id: 4, name: "Wax Seal Kit", sales: 187, revenue: 5610 },
    { id: 5, name: "Calligraphy Set", sales: 154, revenue: 7700 },
  ];

  const recentOrders = [
    {
      id: "ORD-3845",
      customer: "Emma Wilson",
      date: "Today, 10:45 AM",
      amount: "$128.50",
      status: "Processing",
    },
    {
      id: "ORD-3844",
      customer: "Michael Chen",
      date: "Today, 9:12 AM",
      amount: "$74.99",
      status: "Shipped",
    },
    {
      id: "ORD-3843",
      customer: "Sofia Rodriguez",
      date: "Yesterday, 4:30 PM",
      amount: "$249.95",
      status: "Delivered",
    },
    {
      id: "ORD-3842",
      customer: "James Taylor",
      date: "Yesterday, 1:15 PM",
      amount: "$38.75",
      status: "Processing",
    },
    {
      id: "ORD-3841",
      customer: "Olivia Johnson",
      date: "Jul 19, 2023",
      amount: "$159.00",
      status: "Delivered",
    },
  ];

  const recentActivity = [
    {
      id: 1,
      type: "order",
      message: "New order #ORD-3845 received",
      time: "5 min ago",
    },
    {
      id: 2,
      type: "product",
      message: "Premium Journal stock updated",
      time: "1 hour ago",
    },
    {
      id: 3,
      type: "user",
      message: "New user John Smith registered",
      time: "3 hours ago",
    },
    {
      id: 4,
      type: "review",
      message: "New 5-star review for Calligraphy Set",
      time: "Yesterday",
    },
    {
      id: 5,
      type: "order",
      message: "Order #ORD-3839 marked as delivered",
      time: "Yesterday",
    },
    {
      id: 6,
      type: "product",
      message: "Wax Seal Kit is now low in stock",
      time: "2 days ago",
    },
  ];

  const lowStockItems = [
    { id: 1, name: "Premium Journal", stock: 5, threshold: 10 },
    { id: 2, name: "Wax Seal Kit", stock: 3, threshold: 10 },
    { id: 3, name: "Fountain Pen Ink - Blue", stock: 2, threshold: 5 },
  ];

  return (
    <div className="container mx-auto p-10 py-4 bg-gray-100 dark:bg-gray-900">
      {/* Page Title */}
      <PageHeader title="Overview" subtitle="Welcome back to your overview" />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Sales (Today)"
          value="$1,452"
          change="12% from yesterday"
          icon="fas fa-chart-line"
          iconBg="bg-green-100 dark:bg-green-900/30"
          iconColor="text-green-600 dark:text-green-400"
        />

        <StatCard
          title="Total Sales (Month)"
          value="$24,635"
          change="8% from last month"
          icon="fas fa-calendar-alt"
          iconBg="bg-primary/10 dark:bg-primary/20"
          iconColor="text-primary"
        />

        <StatCard
          title="Total Orders"
          value="384"
          change="4% from last month"
          icon="fas fa-shopping-bag"
          iconBg="bg-secondary/10 dark:bg-secondary/20"
          iconColor="text-secondary"
        />

        <StatCard
          title="Total Users"
          value="1,256"
          change="12% from last month"
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
        <TopProducts products={topProducts} />
      </div>

      {/* Second Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <LowStockAlerts items={lowStockItems} />
        <RecentOrders orders={recentOrders} />
        <RecentActivity activities={recentActivity} />
      </div>
    </div>
  );
}

export default Dashboard;
