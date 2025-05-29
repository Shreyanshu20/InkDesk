import React from "react";
import { Link } from "react-router-dom";

function SidebarHeader({ collapsed }) {
  return (
    <div className="bg-primary flex items-center justify-between h-16 px-4 border-b border-primary/20 shadow-sm">
      <Link
        to="/admin"
        className="w-full flex justify-center"
        aria-label="Go to dashboard"
      >
        {!collapsed ? (
          <div className="flex items-center justify-center py-2">
            <img
              src="/src/assets/brandlogo.png"
              alt="InkDesk Logo"
              className="p-2 object-contain"
              loading="lazy"
            />
          </div>
        ) : (
          <div className="flex items-center justify-center w-full py-2">
            <img
              src="/src/assets/brandlogomini.png"
              alt="InkDesk Icon"
              className="max-h-10 object-contain"
              loading="lazy"
            />
          </div>
        )}
      </Link>
    </div>
  );
}

export default SidebarHeader;
