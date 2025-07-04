import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { useScreenSize } from "./hooks/useScreenSize";
import MobileRestriction from "./Components/Common/MobileRestriction";
import { AdminContextProvider, useAdmin } from "./Context/AdminContext.jsx";

import Layout from "./Layouts";
import Dashboard from "./Components/Dashboard/Dashboard";
import Products from "./Components/Products/Products";
import ProductForm from "./Components/Products/components/ProductForm";
import Categories from "./Components/Categories/Categories";
import CategoryForm from "./Components/Categories/components/CategoryForm";
import Orders from "./Components/Orders/Orders";
import OrderDetails from "./Components/Orders/components/OrderDetails";
import Users from "./Components/Users/Users";
import UserDetails from "./Components/Users/components/UserDetails";
import Banners from "./Components/Banners/Banners";
import BannerForm from "./Components/Banners/components/BannerForm";
import Reviews from "./Components/Reviews/Reviews";
import Settings from "./Components/Settings/Settings";
import AdminLogin from "./Components/Auth/AdminLogin";
import AdminForgotPassword from "./Components/Auth/AdminForgotPassword";

const ProtectedRoute = ({ children }) => {
  const { isLoading, isAuthenticated } = useAdmin();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading admin...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const MobileAwareProtectedRoute = ({ children }) => {
  const { isMobile } = useScreenSize();

  if (isMobile) {
    return <MobileRestriction />;
  }

  return <ProtectedRoute>{children}</ProtectedRoute>;
};

const MobileAwareLogin = ({ children }) => {
  const { isMobile } = useScreenSize();

  if (isMobile) {
    return <MobileRestriction />;
  }

  return children;
};

const RedirectToAdmin = () => {
  return <Navigate to="/admin" replace />;
};

function App() {
  return (
    <AdminContextProvider>
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
        <Route path="/login" element={<Navigate to="/admin/login" replace />} />
        <Route
          path="/admin/login"
          element={
            <MobileAwareLogin>
              <AdminLogin />
            </MobileAwareLogin>
          }
        />
        <Route
          path="/admin/forgot-password"
          element={
            <MobileAwareLogin>
              <AdminForgotPassword />
            </MobileAwareLogin>
          }
        />
        <Route path="/" element={<RedirectToAdmin />} />
        <Route
          path="/admin"
          element={
            <MobileAwareProtectedRoute>
              <Layout />
            </MobileAwareProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="products">
            <Route index element={<Products />} />
            <Route path="add" element={<ProductForm mode="add" />} />
            <Route path="edit/:id" element={<ProductForm mode="edit" />} />
            <Route path="view/:id" element={<Products view="view" />} />
          </Route>
          <Route path="orders">
            <Route index element={<Orders />} />
            <Route path="view/:id" element={<OrderDetails />} />
          </Route>
          <Route path="users">
            <Route index element={<Users />} />
            <Route path="view/:id" element={<UserDetails />} />
          </Route>
          <Route path="categories">
            <Route index element={<Categories />} />
            <Route path="add" element={<CategoryForm mode="add" />} />
            <Route path="edit/:id" element={<CategoryForm mode="edit" />} />
            <Route path="view/:id" element={<Categories view="view" />} />
          </Route>
          <Route path="banners">
            <Route index element={<Banners />} />
            <Route path="add" element={<BannerForm mode="add" />} />
            <Route path="edit/:id" element={<BannerForm mode="edit" />} />
          </Route>
          <Route path="reviews" element={<Reviews />} />
          <Route path="settings" element={<Settings />} />
        </Route>
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </AdminContextProvider>
  );
}

export default App;
