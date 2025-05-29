import React from "react";
import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Import your components
import Layout from "./Layouts.jsx";
import Dashboard from "./Components/Dashboard/Dashboard.jsx";
import NotFound from "./Components/NotFound.jsx";
import Products from "./Components/Products/Products.jsx";
import ProductForm from "./Components/Products/components/ProductForm.jsx";
import Categories from "./Components/Categories/Categories.jsx";
import CategoryForm from "./Components/Categories/components/CategoryForm.jsx";
import Orders from "./Components/Orders/Orders.jsx";
import OrderDetails from "./Components/Orders/components/OrderDetails.jsx";
import Users from "./Components/Users/Users.jsx";
import Reviews from "./Components/Reviews/Reviews.jsx";
import Banners from "./Components/Banners/Banners.jsx";
import BannerForm from "./Components/Banners/components/BannerForm.jsx";
import Settings from "./Components/Settings/Settings.jsx";

function App() {
  return (
    <>
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
          fontFamily: 'inherit',
          borderRadius: '8px',
        }}
        className="custom-toast-container"
      />

      <Routes>
        <Route path="/admin" element={<Layout />}>
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
            <Route path="view/:id" element={<Categories view="view" />} />
          </Route>

          {/* Orders routes */}
          <Route path="orders">
            <Route index element={<Orders />} />
            <Route path=":id" element={<OrderDetails />} />
          </Route>

          {/* Users routes */}
          <Route path="users">
            <Route index element={<Users />} />
            <Route path="view/:id" element={<Users view="view" />} />
            <Route path="add" element={<Users mode="add" />} />
            <Route path="edit/:id" element={<Users mode="edit" />} />
          </Route>

          {/* Reviews routes */}
          <Route path="reviews" element={<Reviews />} />

          {/* Banner routes */}
          <Route path="banners">
            <Route index element={<Banners />} />
            <Route path="add" element={<BannerForm mode="add" />} />
            <Route path="edit/:id" element={<BannerForm mode="edit" />} />
            <Route path="view/:id" element={<BannerForm viewOnly={true} />} />
          </Route>

          {/* Settings routes */}
          <Route path="settings" element={<Settings />} />

          {/* 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;