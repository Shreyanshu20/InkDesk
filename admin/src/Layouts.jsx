import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Components/Sidebar/Sidebar";
import Navbar from "./Components/Navbar/Navbar";
import Footer from "./Components/Footer/Footer";

function Layout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Check for stored preference or use default (expanded)
  useEffect(() => {
    const storedState = localStorage.getItem("sidebarCollapsed");
    if (storedState !== null) {
      setSidebarCollapsed(storedState === "true");
    }
  }, []);

  const toggleSidebar = () => {
    const newState = !sidebarCollapsed;
    setSidebarCollapsed(newState);
    localStorage.setItem("sidebarCollapsed", newState);
  };

  return (
    <div className="flex min-h-screen bg-gray-50 text-text">
      <Sidebar collapsed={sidebarCollapsed} toggleSidebar={toggleSidebar} />
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          sidebarCollapsed ? "ml-20" : "ml-64"
        }`}
      >
        <Navbar collapsed={sidebarCollapsed} toggleSidebar={toggleSidebar} />
        <main className="flex-1 mt-16 overflow-auto bg-gray-100 dark:bg-gray-900">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
}

export default Layout;
