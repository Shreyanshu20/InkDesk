import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Import the admin context
import { AdminContextProvider, useAdmin } from "./Context/AdminContext";

// Import components
import Layout from "./Layouts";
import Dashboard from "./Components/Dashboard/Dashboard";
import Products from "./Components/Products/Products";
import ProductForm from "./Components/Products/components/ProductForm";
import Categories from "./Components/Categories/Categories";
import CategoryForm from "./Components/Categories/components/CategoryForm";
import CategoryDetails from "./Components/Categories/components/CategoryDetails";
import Orders from "./Components/Orders/Orders";
import Users from "./Components/Users/Users";
import Banners from "./Components/Banners/Banners";
import BannerForm from "./Components/Banners/components/BannerForm";
import Reviews from "./Components/Reviews/Reviews";
import Settings from "./Components/Settings/Settings";

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { loading } = useAdmin();

  // Show loading spinner while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin...</p>
        </div>
      </div>
    );
  }

  // Always allow access for now
  return children;
};

// Redirect Component for root path
const RedirectToAdmin = () => {
  return <Navigate to="/admin" replace />;
};

function App() {
  return (
    <AdminContextProvider>
      {/* REMOVED <Router> - it's already in main.jsx */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        toastStyle={{
          fontFamily: "inherit",
          borderRadius: "8px",
        }}
      />

      <Routes>
        {/* Root redirect */}
        <Route path="/" element={<RedirectToAdmin />} />

        {/* Protected admin routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />

          {/* Products routes */}
          <Route path="products">
            <Route index element={<Products />} />
            <Route path="add" element={<ProductForm mode="add" />} />
            <Route path="edit/:id" element={<ProductForm mode="edit" />} />
            <Route path="view/:id" element={<Products view="view" />} />
          </Route>

          {/* Categories routes */}
          <Route path="categories">
            <Route index element={<Categories />} />
            <Route path="add" element={<CategoryForm mode="add" />} />
            <Route path="edit/:id" element={<CategoryForm mode="edit" />} />
            <Route path="view/:id" element={<CategoryDetails />} />
          </Route>

          {/* Orders routes */}
          <Route path="orders" element={<Orders />} />

          {/* Users routes */}
          <Route path="users" element={<Users />} />

          {/* Banners routes */}
          <Route path="banners">
            <Route index element={<Banners />} />
            <Route path="add" element={<BannerForm mode="add" />} />
            <Route path="edit/:id" element={<BannerForm mode="edit" />} />
          </Route>

          {/* Reviews routes */}
          <Route path="reviews" element={<Reviews />} />

          <Route path="settings" element={<Settings />} />
        </Route>

        {/* Catch all - redirect to admin */}
        <Route path="*" element={<RedirectToAdmin />} />
      </Routes>
    </AdminContextProvider>
  );
}

export default App;
