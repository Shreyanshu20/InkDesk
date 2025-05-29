import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import axios from "axios";
import "./index.css";
import App from "./App.jsx";
import ErrorBoundary from "./ErrorBoundary.jsx";

// Import providers
import { ThemeProvider } from "./Context/ThemeContext.jsx";

// Configure axios defaults
axios.defaults.withCredentials = true;

// Set the correct backend URL for admin
if (window.location.origin === "http://localhost:5174") {
  axios.defaults.baseURL = "http://localhost:5000/";
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>
);
