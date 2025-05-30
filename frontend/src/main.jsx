import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import axios from "axios";
import "./index.css";
import App from "./App.jsx";
import ErrorBoundary from "./ErrorBoundary.jsx";
import ScrollToTop from "./Components/Common/ScrollToTop.jsx";

// Import all providers
import { ThemeProvider } from "./Context/ThemeContext.jsx";
import { AppContentProvider } from "./Context/AppContent.jsx";
import { CategoryProvider } from "./Context/CategoryContext.jsx";
import { CartProvider } from "./Context/CartContext.jsx";
import { WishlistProvider } from "./Context/WishlistContext.jsx";
import { ReviewProvider } from "./Context/ReviewContext.jsx";

axios.defaults.withCredentials = true;

// Set the correct backend URL
if (window.location.origin === import.meta.env.VITE_BACKEND_URL) {
  axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <ScrollToTop />
        <ThemeProvider>
          <AppContentProvider>
            <CategoryProvider>
              <CartProvider>
                <WishlistProvider>
                  <ReviewProvider>
                    <App />
                  </ReviewProvider>
                </WishlistProvider>
              </CartProvider>
            </CategoryProvider>
          </AppContentProvider>
        </ThemeProvider>
      </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>
);
