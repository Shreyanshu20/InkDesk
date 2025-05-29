import { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import NavItem from "./components/NavItem";
import SidebarHeader from "./components/SidebarHeader";
import SidebarFooter from "./components/SidebarFooter";

function Sidebar({ collapsed, toggleSidebar }) {
  const [expandedMenus, setExpandedMenus] = useState({});
  const location = useLocation();

  // Expand the menu based on current path when component mounts
  useEffect(() => {
    const currentPath = location.pathname;
    navItems.forEach((item) => {
      if (
        item.children &&
        (currentPath === item.path ||
          item.children.some((child) => currentPath.includes(child.path)))
      ) {
        setExpandedMenus((prev) => ({
          ...prev,
          [item.key]: true,
        }));
      }
    });
  }, [location.pathname]);

  // Close submenus when sidebar collapses
  useEffect(() => {
    if (collapsed) {
      setExpandedMenus({});
    }
  }, [collapsed]);

  const toggleMenu = (menuKey) => {
    setExpandedMenus((prev) => ({
      ...prev,
      [menuKey]: !prev[menuKey],
    }));
  };

  // Navigation items structure with FontAwesome icons
  const navItems = [
    {
      key: "dashboard",
      name: "Dashboard",
      path: "/admin",
      icon: "fas fa-tachometer-alt",
    },
    {
      key: "products",
      name: "Products",
      path: "/admin/products",
      icon: "fas fa-box",
      children: [
        { name: "List Products", path: "/admin/products" },
        { name: "Add Product", path: "/admin/products/add" },
        { name: "Categories", path: "/admin/categories" },
      ],
    },
    {
      key: "orders",
      name: "Orders",
      path: "/admin/orders",
      icon: "fas fa-shopping-bag",
    },
    {
      key: "users",
      name: "Users",
      path: "/admin/users",
      icon: "fas fa-users",
    },
    {
      key: "reviews",
      name: "Reviews",
      path: "/admin/reviews",
      icon: "fas fa-star",
    },
    {
      key: "banners",
      name: "Banners",
      path: "/admin/banners",
      icon: "fas fa-pen-fancy",
    },
    {
      key: "settings",
      name: "Settings",
      path: "/admin/settings",
      icon: "fas fa-cog",
    },
  ];

  return (
    <aside
      className={`h-screen bg-background border-r border-gray-200 dark:border-gray-700 shadow-[4px_0px_16px_rgba(17,17,26,0.05)] ${
        collapsed ? "w-20" : "w-64"
      } transition-all duration-300 ease-in-out flex flex-col fixed top-0 left-0 z-40`}
      aria-label="Main Navigation"
    >
      <SidebarHeader collapsed={collapsed} />

      {/* Navigation */}
      <nav
        className="flex-1 overflow-y-auto py-4 px-3"
        aria-label="Admin Navigation"
      >
        <ul className="space-y-1.5">
          {navItems.map((item) => (
            <NavItem
              key={item.key}
              item={item}
              collapsed={collapsed}
              expandedMenus={expandedMenus}
              toggleMenu={toggleMenu}
              location={location}
            />
          ))}
        </ul>
      </nav>

      <SidebarFooter collapsed={collapsed} />
    </aside>
  );
}

export default Sidebar;
