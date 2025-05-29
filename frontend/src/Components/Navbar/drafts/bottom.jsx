import React, { useEffect, useRef } from "react";
import { Link, NavLink } from "react-router-dom";

function NavbarBottom() {
  const dropdownRefs = useRef({});

  // Handle clicks outside dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check all open dropdowns
      Object.keys(dropdownRefs.current).forEach((key) => {
        const dropdownRef = dropdownRefs.current[key];
        if (dropdownRef && !dropdownRef.contains(event.target)) {
          // If the dropdown details element has the open attribute, close it
          if (dropdownRef.hasAttribute("open")) {
            dropdownRef.removeAttribute("open");
          }
        }
      });
    };

    // Add event listener
    document.addEventListener("mousedown", handleClickOutside);

    // Clean up
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const menuItems = [
    { name: "Home", link: "/" },
    {
      name: "Stationery",
      subcategories: [
        { name: "Pens", link: "/pens" },
        { name: "Pencils", link: "/pencils" },
        { name: "Notebooks", link: "/notebooks" },
        { name: "Journals", link: "/journals" },
        { name: "Calendars", link: "/calendars" },
      ],
    },
    {
      name: "Office Supplies",
      subcategories: [
        { name: "Desk Organizers", link: "/desk-organizers" },
        { name: "Paper Products", link: "/paper-products" },
        { name: "Binders", link: "/binders" },
        { name: "Office Machines", link: "/office-machines" },
        { name: "Desk Accessories", link: "/desk-accessories" },
      ],
    },
    {
      name: "Art Supplies",
      subcategories: [
        { name: "Drawing", link: "/drawing" },
        { name: "Painting", link: "/painting" },
        { name: "Coloring", link: "/coloring" },
        { name: "Crafting", link: "/crafting" },
        { name: "Art Storage", link: "/art-storage" },
      ],
    },
    {
      name: "Craft Supplies",
      subcategories: [
        { name: "Scrapbooking", link: "/scrapbooking" },
        { name: "DIY Materials", link: "/diy" },
        { name: "Paper Crafts", link: "/paper-crafts" },
        { name: "Decorative Items", link: "/decorative" },
        { name: "Tools", link: "/craft-tools" },
      ],
    },
    { name: "Contact Us", link: "/contact" },
  ];

  const renderMenuItem = (item) => (
    <li key={item.name} className="mx-1">
      {item.subcategories ? (
        <details
          ref={(el) => {
            if (el) dropdownRefs.current[item.name] = el;
          }}
          className="dropdown"
        >
          <summary className="text-text hover:text-primary hover:bg-primary/10 rounded-md px-3 py-2 cursor-pointer">
            {item.name}
          </summary>
          <ul className="p-2 bg-background z-10 shadow-md rounded-lg border border-primary/20 mt-2 w-48">
            {item.subcategories.map((subItem) => (
              <li key={subItem.name}>
                <NavLink
                  to={subItem.link}
                  className={({ isActive }) =>
                    `block px-4 py-2 rounded-md ${
                      isActive
                        ? "bg-primary/10 text-primary font-medium"
                        : "text-text hover:text-primary hover:bg-primary/10"
                    }`
                  }
                >
                  {subItem.name}
                </NavLink>
              </li>
            ))}
          </ul>
        </details>
      ) : (
        <NavLink
          to={item.link}
          className={({ isActive }) =>
            `block px-3 py-2 rounded-md transition-colors ${
              isActive
                ? "bg-primary/10 text-primary font-medium"
                : "text-text hover:text-primary hover:bg-primary/10"
            }`
          }
        >
          {item.name}
        </NavLink>
      )}
    </li>
  );

  return (
    <div className="navbar bg-background shadow-sm border-b border-primary/10 justify-center">
      {/* Mobile menu button - aligned to left */}
      <div className="lg:hidden absolute left-4">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-text"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </div>

          {/* Mobile menu dropdown */}
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-background text-text rounded-lg z-20 mt-3 w-52 p-2 shadow-lg border border-primary/20"
          >
            {menuItems.map(renderMenuItem)}
          </ul>
        </div>
      </div>

      {/* Centered navigation for desktop */}
      <div className="lg:flex justify-center w-full">
        <ul className="menu menu-horizontal px-1 flex justify-center items-center">
          {menuItems.map(renderMenuItem)}
        </ul>
      </div>
    </div>
  );
}

export default NavbarBottom;
