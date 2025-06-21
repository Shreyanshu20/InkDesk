import React, { useContext } from "react";
import ThemeContext from "../../../Context/ThemeContext.jsx"; // Default import

function SidebarFooter({ collapsed }) {
  const { themeToggle } = useContext(ThemeContext);

  return (
    <div className="p-4 border-t border-gray-200 dark:border-gray-700">
      <div className="flex flex-col">
        <a
          href={`${import.meta.env.VITE_FRONTEND_URL}/`}
          className={`flex items-center text-sm text-text transition-all duration-300 rounded-lg px-3 py-2.5 ${
            collapsed ? "justify-center" : ""
          }  hover:bg-accent/30 dark:hover:bg-accent/50`}
          title={collapsed ? "Back to Store" : ""}
          aria-label="Go back to store"
        >
          <i
            className="fas fa-store w-5 h-5"
            style={{ lineHeight: "1.5rem" }}
          ></i>
          {!collapsed && <span className="ml-2">Back to Store</span>}
        </a>
      </div>
    </div>
  );
}

export default SidebarFooter;
