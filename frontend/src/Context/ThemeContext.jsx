import React, { createContext, useState, useContext, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  // Get current theme based on the toggle logic
  const getCurrentTheme = () => {
    if (typeof window === 'undefined') return 'light';
    
    return localStorage.theme === "dark" ||
      (!("theme" in localStorage) && window.matchMedia("(prefers-color-scheme: dark)").matches)
      ? 'dark' : 'light';
  };

  const [theme, setTheme] = useState(getCurrentTheme);

  // Apply theme on mount and when theme changes
  useEffect(() => {
    // On page load or when changing themes
    document.documentElement.classList.toggle(
      "dark",
      localStorage.theme === "dark" ||
        (!("theme" in localStorage) && window.matchMedia("(prefers-color-scheme: dark)").matches)
    );
  }, [theme]);

  const themeToggle = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    
    if (newTheme === 'light') {
      // Whenever the user explicitly chooses light mode
      localStorage.theme = "light";
    } else {
      // Whenever the user explicitly chooses dark mode
      localStorage.theme = "dark";
    }

    // Apply the toggle logic immediately
    document.documentElement.classList.toggle(
      "dark",
      localStorage.theme === "dark" ||
        (!("theme" in localStorage) && window.matchMedia("(prefers-color-scheme: dark)").matches)
    );

    setTheme(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, themeToggle }}>
      {children}
    </ThemeContext.Provider>
  );
};

export { ThemeContext };