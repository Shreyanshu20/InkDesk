import React, { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Layout from "./Layouts.jsx";
import HomePage from "./Components/HomePage/HomePage";
import ProductsPage from "./Components/ProductsPage/ProductsPage";
import ProductDetails from "./Components/ProductsPage/ProductDetails/ProductDetails";
import About from "./Components/About/About";
import Blogs from "./Components/Blogs/Blogs";
import Contact from "./Components/Contact/Contact";
import CartPage from "./Components/CartPage/CartPage.jsx";
import CheckOut from "./Components/CartPage/CheckOut/CheckOut.jsx";
import WishlistPage from "./Components/WishlistPage/WishlistPage.jsx";
import MyAccount from "./Components/User/MyAccount";
import MyOrders from "./Components/User/MyOrders";
import EmailVerify from "./Components/Authentication/EmailVerify.jsx";
import AuthForm from "./Components/Authentication/AuthForm.jsx";
import ForgetPassword from "./Components/Authentication/ForgetPassword.jsx";
import NotFound from "./Components/NotFound.jsx";
import OrderDetails from "./Components/User/OrderDetails";

function App() {
  const location = useLocation();

  useEffect(() => {
    const isHomepage = location.pathname === "/";
    const isExternalEntry =
      !document.referrer ||
      !document.referrer.includes(window.location.hostname);
    const hasShownToast = sessionStorage.getItem("hasShownServerToast");

    if (isHomepage && isExternalEntry && !hasShownToast) {
      sessionStorage.setItem("hasShownServerToast", "true");

      setTimeout(() => {
        toast.info(
          "🎨 Welcome to InkDesk! Loading may take a moment - thanks for waiting!",
          {
            position: "top-center",
            autoClose: 6000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            style: {
              width: "500px",
              maxWidth: "90vw",
              fontSize: "16px",
              textAlign: "center",
              margin: "0 auto",
              top: "20px",
              fontFamily: '"Red Rose", serif',
            },
          }
        );
      }, 1500);
    }
  }, []);

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
        toastStyle={{
          fontFamily: '"Red Rose", serif',
        }}
      />

      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="shop">
            <Route index element={<ProductsPage />} />
            <Route path="/shop/category/:category" element={<ProductsPage />} />
            <Route
              path="/shop/category/:category/:subcategory"
              element={<ProductsPage />}
            />
            <Route path="product/:productId" element={<ProductDetails />} />
          </Route>
          <Route path="about" element={<About />} />
          <Route path="blogs" element={<Blogs />} />
          <Route path="contact" element={<Contact />} />
          <Route path="cart">
            <Route index element={<CartPage />} />
            <Route path="checkout" element={<CheckOut />} />
          </Route>
          <Route path="checkout" element={<CheckOut />} />
          <Route path="wishlist" element={<WishlistPage />} />
          <Route path="account" element={<MyAccount />} />
          <Route path="my-account" element={<MyAccount />} />
          <Route path="orders" element={<MyOrders />} />
          <Route path="orders/:orderId" element={<OrderDetails />} />
          <Route path="my-account/orders" element={<MyOrders />} />
          <Route path="order-details/:orderId" element={<OrderDetails />} />
          <Route path="verify-email" element={<EmailVerify />} />
          <Route path="signup" element={<AuthForm />} />
          <Route path="login" element={<AuthForm />} />
          <Route path="forgot-password" element={<ForgetPassword />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
