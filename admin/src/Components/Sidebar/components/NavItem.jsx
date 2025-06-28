import React, { useRef, useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

function NavItem({ item, collapsed, expandedMenus, toggleMenu, location }) {
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0 });

  useEffect(() => {
    if (collapsed && expandedMenus[item.key] && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.top,
      });
    }
  }, [expandedMenus, item.key, collapsed]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        collapsed &&
        expandedMenus[item.key] &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        !buttonRef.current.contains(event.target)
      ) {
        toggleMenu(item.key);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [collapsed, expandedMenus, item.key, toggleMenu]);

  const renderSubmenuItems = (children) => {
    if (!expandedMenus[item.key]) return null;

    if (!collapsed) {
      return (
        <ul className="pl-10 mt-1 space-y-1 fade-in" role="menu">
          {children.map((child) => (
            <li key={child.path} role="none">
              <NavLink
                to={child.path}
                end
                className={({ isActive }) =>
                  `block py-2 px-3 rounded-md text-sm transition-all duration-300 ${
                    isActive
                      ? "bg-accent text-white"
                      : "text-text hover:bg-accent/30 dark:hover:bg-accent/50"
                  }`
                }
                role="menuitem"
              >
                {child.name}
              </NavLink>
            </li>
          ))}
        </ul>
      );
    }

    return (
      <div
        ref={dropdownRef}
        className="fixed z-50 w-40 rounded-md shadow-lg py-1 bg-background border border-gray-300 dark:border-gray-800 fade-in"
        style={{
          left: "70px",
          top: `${dropdownPosition.top}px`,
        }}
        role="menu"
      >
        {children.map((child) => (
          <NavLink
            key={child.path}
            to={child.path}
            end
            className={({ isActive }) =>
              `block px-4 py-2 text-sm transition-all duration-300 ${
                isActive
                  ? "bg-accent text-white"
                  : "text-text hover:bg-accent/30 dark:hover:bg-accent/50"
              }`
            }
            role="menuitem"
            onClick={(e) => e.stopPropagation()}
          >
            {child.name}
          </NavLink>
        ))}
      </div>
    );
  };

  if (item.children) {
    return (
      <li role="none" className="relative">
        <button
          ref={buttonRef}
          onClick={() => toggleMenu(item.key)}
          aria-expanded={expandedMenus[item.key] || false}
          aria-controls={`submenu-${item.key}`}
          className={`flex items-center justify-between w-full px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-300 ${
            location.pathname.includes(
              item.path.split("/").slice(0, 3).join("/")
            ) || expandedMenus[item.key]
              ? "bg-accent text-white"
              : "text-text hover:bg-accent/30 dark:hover:bg-accent/50"
          }`}
          title={collapsed ? item.name : ""}
          role="menuitem"
        >
          <div
            className={`flex items-center ${
              collapsed ? "justify-center w-full" : ""
            }`}
          >
            <i
              className={`${item.icon} flex-shrink-0 flex items-center justify-center`}
              style={{ lineHeight: "1.5rem" }}
            ></i>
            {!collapsed && <span className="ml-3">{item.name}</span>}
          </div>
          {!collapsed && (
            <i
              className={`fas fa-chevron-down transition-transform ${
                expandedMenus[item.key] ? "transform rotate-180" : ""
              }`}
              style={{ lineHeight: "1.5rem" }}
            ></i>
          )}
        </button>

        <div id={`submenu-${item.key}`} className="submenu-container">
          {renderSubmenuItems(item.children)}
        </div>
      </li>
    );
  }

  return (
    <li role="none">
      <NavLink
        to={item.path}
        end={item.path === "/admin"}
        className={({ isActive }) =>
          `flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ${
            isActive
              ? "bg-gradient-to-r from-red-600/80 to-red-700/80 text-white"
              : "text-text hover:bg-accent/50"
          } ${collapsed ? "justify-center" : ""}`
        }
        title={collapsed ? item.name : ""}
        role="menuitem"
      >
        <i
          className={`${item.icon} flex-shrink-0 flex items-center justify-center`}
          style={{ lineHeight: "1.5rem" }}
        ></i>
        {!collapsed && <span className="ml-3">{item.name}</span>}
      </NavLink>
    </li>
  );
}

export default NavItem;
