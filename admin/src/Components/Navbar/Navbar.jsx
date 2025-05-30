import React, { useState, useContext, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ThemeContext } from "../../Context/ThemeContext.jsx";
import { useAdmin } from "../../Context/AdminContext";
import axios from "axios";
import { toast } from "react-toastify";

function Navbar({ collapsed, toggleSidebar }) {
  const { themeToggle } = useContext(ThemeContext);
  const { adminData, logout, refreshAdminData } = useAdmin();
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);

  const location = useLocation();
  const navigate = useNavigate();
  const notificationRef = useRef(null);
  const profileRef = useRef(null);
  const [isDark, setIsDark] = useState(false);

  const backendUrl =
    import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

  // Get breadcrumb navigation based on current route
  const getBreadcrumbs = () => {
    const pathSegments = location.pathname.split("/").filter(Boolean);
    const breadcrumbs = [];

    // Map route segments to breadcrumb items
    const routeMap = {
      products: { label: "Products", icon: "fas fa-box" },
      orders: { label: "Orders", icon: "fas fa-shopping-bag" },
      users: { label: "Users", icon: "fas fa-users" },
      analytics: { label: "Analytics", icon: "fas fa-chart-bar" },
      settings: { label: "Settings", icon: "fas fa-cog" },
      notifications: { label: "Notifications", icon: "fas fa-bell" },
      profile: { label: "Profile", icon: "fas fa-user" },
      inventory: { label: "Inventory", icon: "fas fa-warehouse" },
      categories: { label: "Categories", icon: "fas fa-tags" },
      reviews: { label: "Reviews", icon: "fas fa-star" },
      reports: { label: "Reports", icon: "fas fa-file-chart" },
      search: { label: "Search", icon: "fas fa-search" },
    };

    // Check if we're on the dashboard page
    const isOnDashboard =
      location.pathname === "/admin" || location.pathname === "/admin/";

    if (isOnDashboard) {
      // If on dashboard, show "Dashboard" as active
      breadcrumbs.push({
        label: "Dashboard",
        path: "/admin",
        icon: "fas fa-tachometer-alt",
        isActive: true,
      });
    } else {
      // Build breadcrumbs from path segments
      let currentPath = "";
      pathSegments.forEach((segment, index) => {
        if (index === 0 && segment === "admin") return; // Skip 'admin' segment

        currentPath += `/${segment}`;
        const routeInfo = routeMap[segment];

        if (routeInfo) {
          breadcrumbs.push({
            label: routeInfo.label,
            path: `/admin${currentPath}`,
            icon: routeInfo.icon,
            isActive: index === pathSegments.length - 1,
          });
        } else {
          // Handle dynamic routes (like IDs)
          const parentSegment = pathSegments[index - 1];
          if (parentSegment && routeMap[parentSegment]) {
            breadcrumbs.push({
              label: `${routeMap[parentSegment].label} Details`,
              path: `/admin${currentPath}`,
              icon: routeMap[parentSegment].icon,
              isActive: true,
            });
          } else {
            // Handle unknown routes
            breadcrumbs.push({
              label: segment.charAt(0).toUpperCase() + segment.slice(1),
              path: `/admin${currentPath}`,
              icon: "fas fa-folder",
              isActive: index === pathSegments.length - 1,
            });
          }
        }
      });
    }

    return breadcrumbs;
  };

  // Simple fetch admin data - the backend does all the work
  const fetchAdminData = async () => {
    setIsLoadingProfile(true);
    try {
      // Use the admin context to refresh data
      const isAuth = await refreshAdminData();
      if (isAuth) {
        console.log("✅ Admin profile loaded from context");
      }
    } catch (error) {
      console.error("❌ Profile fetch failed:", error);

      if (error.response?.status === 401 || error.response?.status === 403) {
        // Token invalid/expired - redirect to login
        const frontendUrl =
          import.meta.env.VITE_FRONTEND_URL || "http://localhost:5173";
        window.location.href = `${frontendUrl}/login?type=admin`;
      }
    } finally {
      setIsLoadingProfile(false);
    }
  };

  // Fetch notifications from backend
  const fetchNotifications = async () => {
    try {
      // For now, using mock data - replace with real API endpoint when available
      const mockNotifications = [
        {
          id: 1,
          type: "order",
          message: "New order #2458 received",
          time: "5 min ago",
          read: false,
        },
        {
          id: 2,
          type: "stock",
          message: "Low stock alert: Premium Journal",
          time: "2 hours ago",
          read: false,
        },
        {
          id: 3,
          type: "user",
          message: "New user registration",
          time: "Yesterday",
          read: true,
        },
        {
          id: 4,
          type: "order",
          message: "Order #2457 completed",
          time: "2 days ago",
          read: true,
        },
      ];

      setNotifications(mockNotifications);

      // TODO: Replace with real API call like this:
      // const response = await axios.get(`${backendUrl}/admin/notifications`, {
      //   withCredentials: true,
      // });
      // if (response.data.success) {
      //   setNotifications(response.data.notifications);
      // }
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    }
  };

  // Handle logout
  const handleLogout = async () => {
    if (isLoggingOut) return;

    setIsLoggingOut(true);
    try {
      toast.info("Logging out...");
      await logout(); // This will handle the redirect
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Logout failed. Please try again.");
    } finally {
      setIsLoggingOut(false);
    }
  };

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/admin/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!adminData) return "A";

    const firstName = adminData.first_name || "";
    const lastName = adminData.last_name || "";
    const name = adminData.name || "";

    if (firstName && lastName) {
      return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
    } else if (firstName) {
      return firstName.charAt(0).toUpperCase();
    } else if (name) {
      return name.charAt(0).toUpperCase();
    } else if (adminData.email) {
      return adminData.email.charAt(0).toUpperCase();
    }

    return "A";
  };

  // Get user display name
  const getUserDisplayName = () => {
    if (!adminData) return "Admin User";

    const firstName = adminData.first_name || "";
    const lastName = adminData.last_name || "";
    const name = adminData.name || "";

    if (firstName && lastName) {
      return `${firstName} ${lastName}`.trim();
    } else if (firstName) {
      return firstName;
    } else if (name) {
      return name;
    } else if (adminData.email) {
      return adminData.email.split("@")[0];
    }

    return "Admin User";
  };

  // Check initial theme state
  useEffect(() => {
    const isDarkMode =
      document.documentElement.classList.contains("dark") ||
      localStorage.theme === "dark" ||
      (!("theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);
    setIsDark(isDarkMode);
  }, []);

  // Fetch data on component mount
  useEffect(() => {
    if (adminData) {
      setIsLoadingProfile(false);
    } else {
      fetchAdminData();
    }
    fetchNotifications();
  }, [adminData]);

  // Handle theme toggle function
  const handleThemeToggle = () => {
    themeToggle();
    setIsDark(!isDark);
  };

  // Handle clicks outside dropdowns
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setNotificationsOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const breadcrumbs = getBreadcrumbs();
  const unreadNotifications = notifications.filter((n) => !n.read);

  return (
    <nav
      className={`bg-background border-b border-gray-200 dark:border-gray-700 h-16 px-4 flex items-center justify-between fixed top-0 right-0 ${
        collapsed ? "left-20" : "left-64"
      } z-30 transition-all duration-300 shadow-sm`}
      aria-label="Main navigation"
    >
      {/* Left side with menu toggle and breadcrumbs */}
      <div className="flex items-center min-w-0 flex-1">
        <button
          onClick={toggleSidebar}
          className="mr-4 text-text hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary/30 rounded-md p-1.5 transition-all duration-300 flex-shrink-0"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <i
            className={`fas ${
              collapsed ? "fa-bars" : "fa-angle-double-left"
            } w-5 h-5`}
            style={{ lineHeight: "1.25rem" }}
          ></i>
        </button>

        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="min-w-0 flex-1">
          <ol className="flex items-center space-x-1">
            {/* Home Icon - always show as inactive when not on dashboard */}
            <li className="flex items-center mr-2">
              <Link
                to="/admin"
                className={`flex items-center transition-colors duration-200 ${
                  location.pathname === "/admin" ||
                  location.pathname === "/admin/"
                    ? "text-text pointer-events-none"
                    : "text-text/80 hover:text-text"
                }`}
                title="Dashboard Home"
              >
                <i className="fas fa-home text-primary"></i>
              </Link>
            </li>

            {breadcrumbs.map((breadcrumb, index) => (
              <li key={breadcrumb.path} className="flex items-center">
                {/* Show separator only if not the first item after home or not dashboard */}
                {!(breadcrumb.label === "Dashboard" && index === 0) && (
                  <span className="text-text/40 mx-2">/</span>
                )}

                {breadcrumb.isActive ? (
                  <span className="flex items-center text-text font-medium">
                    {breadcrumb.icon && breadcrumb.label !== "Dashboard" && (
                      <i
                        className={`${breadcrumb.icon} mr-2 text-primary text-xs`}
                      ></i>
                    )}
                    <span className="truncate">{breadcrumb.label}</span>
                  </span>
                ) : (
                  <Link
                    to={breadcrumb.path}
                    className="flex items-center text-text/80 hover:text-text transition-colors duration-200"
                  >
                    {breadcrumb.icon && breadcrumb.label !== "Dashboard" && (
                      <i
                        className={`${breadcrumb.icon} mr-2 text-xs text-primary/70`}
                      ></i>
                    )}
                    <span className="truncate">{breadcrumb.label}</span>
                  </Link>
                )}
              </li>
            ))}
          </ol>
        </nav>
      </div>

      {/* Right-side actions */}
      <div className="flex items-center space-x-2 md:space-x-4 flex-shrink-0">
        {/* Search */}
        <form onSubmit={handleSearch} className="hidden md:block relative">
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 w-40 lg:w-60 rounded-full bg-gray-100 dark:bg-gray-800 border-none text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all duration-300"
              aria-label="Search"
            />
            <button
              type="submit"
              className="absolute left-3 top-2.5 text-gray-400 hover:text-primary transition-colors"
            >
              <i className="fas fa-search"></i>
            </button>
          </div>
        </form>

        {/* Theme toggle */}
        <button
          onClick={handleThemeToggle}
          className="p-2 text-text hover:text-primary hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary/30"
          aria-label="Toggle theme"
        >
          <i className={`fas ${isDark ? "fa-sun" : "fa-moon"} w-5 h-5`}></i>
        </button>

        {/* Notifications */}
        <div className="relative" ref={notificationRef}>
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="p-2 text-text hover:text-primary hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full relative transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary/30"
            aria-label={`Notifications (${unreadNotifications.length} new)`}
            aria-expanded={notificationsOpen}
          >
            <i className="fas fa-bell w-5 h-5"></i>
            {unreadNotifications.length > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-white text-xs rounded-full flex items-center justify-center ring-2 ring-background">
                {unreadNotifications.length > 99
                  ? "99+"
                  : unreadNotifications.length}
              </span>
            )}
          </button>

          {notificationsOpen && (
            <div
              className="absolute right-0 mt-2 w-80 bg-background shadow-lg rounded-lg border border-gray-200 dark:border-gray-700 z-50 fade-in"
              role="menu"
            >
              <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                <h3 className="font-medium text-text">Notifications</h3>
                <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                  {unreadNotifications.length} new
                </span>
              </div>

              <div className="max-h-64 overflow-y-auto">
                {notifications.length > 0 ? (
                  notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`px-4 py-3 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200 cursor-pointer ${
                        !notification.read
                          ? "bg-blue-50 dark:bg-blue-900/20"
                          : ""
                      }`}
                      role="menuitem"
                    >
                      <div className="flex items-start">
                        <div className="mr-3 mt-1 bg-primary/10 p-2 rounded-full">
                          <i
                            className={`fas fa-${
                              notification.type === "order"
                                ? "shopping-bag"
                                : notification.type === "stock"
                                ? "box"
                                : "user"
                            } text-primary`}
                          ></i>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-text">
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {notification.time}
                          </p>
                        </div>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                    <i className="fas fa-bell-slash text-2xl mb-2"></i>
                    <p className="text-sm">No notifications</p>
                  </div>
                )}
              </div>

              <div className="px-4 py-2 text-center bg-gray-50 dark:bg-gray-800 rounded-b-lg">
                <Link
                  to="/admin/notifications"
                  className="text-sm text-primary hover:underline transition-all duration-300"
                  onClick={() => setNotificationsOpen(false)}
                >
                  View all notifications
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Profile */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center focus:outline-none focus:ring-2 focus:ring-primary/30 rounded-full transition-all duration-300"
            aria-label="Profile menu"
            aria-expanded={profileOpen}
          >
            <div className="w-8 h-8 overflow-hidden rounded-full bg-primary text-white flex items-center justify-center shadow-sm hover:shadow transition-all duration-300">
              {isLoadingProfile ? (
                <i className="fas fa-spinner fa-spin text-sm"></i>
              ) : (
                <span className="font-medium text-sm">{getUserInitials()}</span>
              )}
            </div>
          </button>

          {profileOpen && (
            <div
              className="absolute right-0 mt-2 w-64 bg-background shadow-lg rounded-lg border border-gray-200 dark:border-gray-700 z-50 fade-in"
              role="menu"
            >
              {/* User Info Section */}
              <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                {isLoadingProfile ? (
                  <div className="animate-pulse">
                    <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded mb-2"></div>
                    <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded mb-1"></div>
                    <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-2/3"></div>
                  </div>
                ) : (
                  <>
                    <p className="text-sm font-medium text-text">
                      {getUserDisplayName()}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {adminData?.email || "admin@inkdesk.com"}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-xs text-primary font-medium">
                        {adminData?.role === "admin"
                          ? "Administrator"
                          : "Admin"}
                      </p>
                      {adminData?.isAccountVerified ? (
                        <span className="text-xs text-green-500">
                          <i className="fas fa-check-circle mr-1"></i>Verified
                        </span>
                      ) : (
                        <span className="text-xs text-yellow-500">
                          <i className="fas fa-exclamation-circle mr-1"></i>
                          Unverified
                        </span>
                      )}
                    </div>
                  </>
                )}
              </div>

              {/* Menu Items */}
              <ul className="py-2">
                <li role="none">
                  <Link
                    to="/admin/profile"
                    className="block px-4 py-2 text-sm text-text hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300"
                    role="menuitem"
                    onClick={() => setProfileOpen(false)}
                  >
                    <i className="fas fa-user mr-3 w-4 text-center text-primary/80"></i>
                    My Profile
                  </Link>
                </li>
                <li role="none">
                  <Link
                    to="/admin/settings"
                    className="block px-4 py-2 text-sm text-text hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300"
                    role="menuitem"
                    onClick={() => setProfileOpen(false)}
                  >
                    <i className="fas fa-cog mr-3 w-4 text-center text-primary/80"></i>
                    Settings
                  </Link>
                </li>
                <li role="none">
                  <Link
                    to="/admin/help"
                    className="block px-4 py-2 text-sm text-text hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300"
                    role="menuitem"
                    onClick={() => setProfileOpen(false)}
                  >
                    <i className="fas fa-question-circle mr-3 w-4 text-center text-primary/80"></i>
                    Help & Support
                  </Link>
                </li>

                {/* Divider */}
                <li
                  className="border-t border-gray-200 dark:border-gray-700 my-2"
                  role="none"
                ></li>

                {/* Back to Frontend */}
                <li role="none">
                  <a
                    href={`${
                      import.meta.env.VITE_FRONTEND_URL ||
                      "http://localhost:5173"
                    }/`}
                    className="block px-4 py-2 text-sm text-text hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300"
                    role="menuitem"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <i className="fas fa-external-link-alt mr-3 w-4 text-center text-primary/80"></i>
                    Visit Store
                  </a>
                </li>

                {/* Logout */}
                <li role="none">
                  <button
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    role="menuitem"
                  >
                    <i
                      className={`fas ${
                        isLoggingOut ? "fa-spinner fa-spin" : "fa-sign-out-alt"
                      } mr-3 w-4 text-center`}
                    ></i>
                    {isLoggingOut ? "Logging out..." : "Logout"}
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
