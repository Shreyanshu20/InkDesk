import React, { createContext, useContext, useEffect } from "react";

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

// Theme toggle function
export const themeToggle = () => {
  const isDark = document.documentElement.classList.toggle("dark");

  if (isDark) {
    localStorage.theme = "dark";
  } else {
    localStorage.theme = "light";
  }
};

// Initialize theme
const initializeTheme = () => {
  if (
    localStorage.theme === "dark" ||
    (!("theme" in localStorage) &&
      window.matchMedia("(prefers-color-scheme: dark)").matches)
  ) {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
};

export const ThemeProvider = ({ children }) => {
  useEffect(() => {
    initializeTheme();
  }, []);

  const value = {
    themeToggle,
    isDark: document.documentElement.classList.contains("dark"),
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

// Export ThemeContext as both named and default export
export { ThemeContext };
export default ThemeContext;