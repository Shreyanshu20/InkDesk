import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import axios from "axios";
import "./index.css";
import App from "./App.jsx";
import ErrorBoundary from "./ErrorBoundary.jsx";
import { ThemeProvider } from "./Context/ThemeContext.jsx";

axios.defaults.withCredentials = true;

if (window.location.origin === import.meta.env.VITE_BACKEND_URL) {
  axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;
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
