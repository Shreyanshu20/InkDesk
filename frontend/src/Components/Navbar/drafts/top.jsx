import React, { useContext, useEffect, useState } from "react";
import { ThemeContext } from "../../main";
import { Link, NavLink } from "react-router-dom";

function NavbarTop() {
  const { themeToggle } = useContext(ThemeContext);
  const [isDark, setIsDark] = useState(false);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    const isDarkMode =
      document.documentElement.classList.contains("dark") ||
      localStorage.theme === "dark" ||
      (!("theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);
    setIsDark(isDarkMode);
  }, []);

  const handleThemeToggle = () => {
    themeToggle();
    setIsDark(!isDark);
  };

  const handleClearSearch = () => {
    setSearchText("");
  };

  return (
    <div className="navbar bg-background p-5">
      <div className="navbar-start">
        <a className="btn btn-ghost text-xl font-bold text-primary hover:bg-primary/50 transition-colors duration-300">
          <span className="text-primary">Ink</span>
          <span className="text-accent">Desk</span>
        </a>
      </div>

      <div className="navbar-center">
        <div className="form-control relative">
          <input
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Search products..."
            className="input rounded-full w-96 bg-background/80 text-text 
                     border border-primary/20 
                     transition-all duration-300 
                     hover:border-primary/70 hover:shadow-lg
                     focus:border-primary focus:shadow-md focus:bg-background 
                     focus:outline-none pl-10 pr-4 py-2"
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 text-text/70 z-10"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>

          {searchText && (
            <button
              onClick={handleClearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text hover:text-text/70 transition-colors duration-300 z-10"
              aria-label="Clear search"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </div>
      </div>

      <div className="navbar-end flex gap-4">
        <button
          onClick={handleThemeToggle}
          className="btn btn-ghost btn-circle hover:bg-primary/10 transition-all duration-300 text-primary"
          aria-label="Toggle theme"
        >
          {isDark ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
          )}
        </button>

        <div className="dropdown dropdown-end">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost btn-circle avatar hover:bg-primary/10 transition-all duration-300 hover:scale-105"
          >
            <div className="w-10 rounded-full ring ring-primary ring-offset-2 ring-offset-background">
              <img
                alt="Profile"
                src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
              />
            </div>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow-lg bg-background text-text rounded-box w-52 border border-primary/20"
          >
            <li>
              <Link className="justify-between hover:bg-primary/10 hover:text-primary transition-colors duration-200">
                Profile
                <span className="badge bg-primary text-background">New</span>
              </Link>
            </li>
            <li>
              <Link className="hover:bg-primary/10 hover:text-primary transition-colors duration-200">
                Settings
              </Link>
            </li>
            <li>
              <Link className="hover:bg-primary/10 hover:text-primary transition-colors duration-200">
                Logout
              </Link>
            </li>
          </ul>
        </div>

        <button className="btn btn-ghost btn-circle hover:bg-accent transition-all duration-300 text-primary hover:scale-105">
          <div className="indicator">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-7 w-7"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <span className="badge badge-sm text-xs indicator-item bg-accent text-background font-bold">
              0
            </span>
          </div>
        </button>
      </div>
    </div>
  );
}

export default NavbarTop;
