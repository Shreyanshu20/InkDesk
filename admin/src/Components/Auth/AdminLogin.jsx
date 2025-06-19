import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate, useSearchParams, useLocation } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import {  useAdmin } from "../../Context/AdminContext";
import { ThemeContext } from "../../Context/ThemeContext";

function AdminLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated, isLoading } = useAdmin();
  const { themeToggle } = useContext(ThemeContext);
  const [searchParams] = useSearchParams();

  // State for form submission
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isDark, setIsDark] = useState(false);

  // Initialize form data for login only
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: true,
  });

  // Check initial theme state
  useEffect(() => {
    const isDarkMode =
      document.documentElement.classList.contains("dark") ||
      localStorage.theme === "dark" ||
      (!("theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);
    setIsDark(isDarkMode);
  }, []);

  // Redirect if already authenticated
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      navigate("/admin");
    }
  }, [isAuthenticated, isLoading, navigate]);

  // Handle theme toggle
  const handleThemeToggle = () => {
    themeToggle();
    setIsDark(!isDark);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });

    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Common validations
    if (!formData.email?.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      setIsSubmitting(true);

      try {
        // FIXED: Don't send any role parameter - let backend determine access
        const result = await login(formData.email, formData.password); // Remove role parameter
        
        if (result.success) {
          toast.success("Login successful! Redirecting to dashboard...");
          setTimeout(() => {
            navigate("/admin");
          }, 1000);
        } else {
          setErrors({ form: result.message || "Login failed" });
        }
      } catch (error) {
        console.error("Auth error:", error);
        const errorMessage =
          error.response?.data?.message ||
          "Login failed. Please try again.";
        toast.error(errorMessage);

        setErrors({ form: "Invalid email or password" });
      } finally {
        setIsSubmitting(false);
      }
    } else {
      toast.error("Please fix the errors in the form");
    }
  };

  // Show loading while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render form if already authenticated
  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="font-['Red_Rose'] min-h-screen bg-background text-text flex flex-col justify-center px-4 py-6 relative">
      {/* Theme Toggle - Top Right */}
      <div className="absolute top-4 right-4 z-10">
        <button
          onClick={handleThemeToggle}
          className="text-text w-12 h-12 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-all duration-300 shadow-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
          aria-label="Toggle theme"
          title={isDark ? "Switch to light mode" : "Switch to dark mode"}
        >
          <i className={`fas ${isDark ? "fa-sun" : "fa-moon"} text-lg`}></i>
        </button>
      </div>

      <div className="mx-auto w-full max-w-md md:max-w-lg">
        <div className="bg-white dark:bg-gray-800 p-6 md:p-8 lg:p-10 shadow-xl rounded-xl border border-gray-100 dark:border-gray-700">
          {/* Header */}
          <div className="mb-6 md:mb-8">
            <div className="flex justify-center mb-4">
              <div className="h-12 w-12 md:h-16 md:w-16 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center">
                <i className="fas fa-user-shield text-white text-lg md:text-xl"></i>
              </div>
            </div>
            <h2 className="text-center text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">
              Admin Portal
            </h2>
            <p className="mt-2 text-center text-sm md:text-base text-gray-600 dark:text-gray-400">
              Sign in to access the administration dashboard
            </p>
          </div>

          {/* Error message */}
          {errors.form && (
            <div className="mb-4 rounded-lg bg-red-50 dark:bg-red-900/30 p-3 md:p-4 text-sm text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800">
              <div className="flex items-center">
                <i className="fas fa-exclamation-circle mr-2 text-red-500"></i>
                {errors.form}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
            {/* Email field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <i className="fas fa-envelope text-gray-400 text-sm"></i>
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="admin@example.com"
                  className={`pl-10 pr-3 md:pr-4 w-full rounded-lg py-2.5 md:py-3 border ${
                    errors.email
                      ? "border-red-500 dark:border-red-700 focus:ring-red-500"
                      : "border-gray-300 dark:border-gray-600 focus:ring-primary"
                  } bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200`}
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-xs md:text-sm text-red-600 dark:text-red-400 flex items-center">
                  <i className="fas fa-exclamation-triangle mr-1 text-xs"></i>
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password field with toggle */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <i className="fas fa-lock text-gray-400 text-sm"></i>
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className={`pl-10 pr-12 w-full rounded-lg py-2.5 md:py-3 border ${
                    errors.password
                      ? "border-red-500 dark:border-red-700 focus:ring-red-500"
                      : "border-gray-300 dark:border-gray-600 focus:ring-primary"
                  } bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 md:pr-5 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  <i
                    className={`fas ${
                      showPassword ? "fa-eye-slash" : "fa-eye"
                    } text-sm`}
                  ></i>
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-xs md:text-sm text-red-600 dark:text-red-400 flex items-center">
                  <i className="fas fa-exclamation-triangle mr-1 text-xs"></i>
                  {errors.password}
                </p>
              )}
            </div>

            {/* Login options */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="rememberMe"
                  name="rememberMe"
                  type="checkbox"
                  checked={formData.rememberMe || false}
                  onChange={handleChange}
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700"
                />
                <label
                  htmlFor="rememberMe"
                  className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
                >
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <Link
                  to="/admin/forgot-password"
                  className="font-medium text-primary hover:text-primary/80 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
            </div>

            {/* Submit button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex justify-center items-center py-3 md:py-3.5 px-4 border border-transparent rounded-lg shadow-sm text-sm md:text-base font-medium text-white bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Signing In...
                  </>
                ) : (
                  <>
                    <i className="fas fa-sign-in-alt mr-2"></i>
                    Sign In to Admin Panel
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Footer links */}
          <div className="mt-6 md:mt-8 space-y-4">
            {/* Customer Site Link */}
            <div className="text-center text-sm border-t border-gray-200 dark:border-gray-600 pt-4">
              <p className="text-gray-600 dark:text-gray-400">
                Need a customer account?{" "}
                <a
                  href={import.meta.env.VITE_FRONTEND_URL || "http://localhost:5173"}
                  className="font-medium text-accent hover:text-accent/80 inline-flex items-center gap-1 transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className="fas fa-external-link-alt text-xs"></i>
                  Go to main site
                </a>
              </p>
            </div>
          </div>

          {/* Security Notice */}
          <div className="mt-6">
            <div className="bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-700 rounded-md p-3">
              <div className="flex items-center justify-center">
                <i className="fas fa-shield-alt text-yellow-600 dark:text-yellow-400 mr-2"></i>
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  This is a secure admin area. Only authorized personnel should access this portal.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;