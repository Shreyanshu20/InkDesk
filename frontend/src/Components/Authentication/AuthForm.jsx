import React, { useState, useEffect, useContext } from "react";
import {
  Link,
  useNavigate,
  useSearchParams,
  useLocation,
} from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { AppContent } from "../../Context/AppContent.jsx";

function AuthForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const { backendUrl, setIsLoggedIn, setUserData } = useContext(AppContent);
  const [searchParams] = useSearchParams();

  // Determine if this is signup or login based on path
  const isSignup = location.pathname === "/signup";

  // Get user type and registration success from URL params
  const registeredSuccess = searchParams.get("registered") === "true";
  const initialUserType =
    searchParams.get("type") === "seller" ? "seller" : "customer";

  // State for user type and form submission
  const [userType, setUserType] = useState(initialUserType);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  // Initialize form data based on auth type
  const [formData, setFormData] = useState(
    isSignup
      ? {
          firstName: "",
          lastName: "",
          email: "",
          password: "",
          agreeToTerms: false,
        }
      : {
          email: "",
          password: "",
          rememberMe: false,
        }
  );

  // Clear errors when user type changes
  useEffect(() => {
    setErrors({});
  }, [userType]);

  // Clear or re-initialize form when switching between login/signup
  useEffect(() => {
    setFormData(
      isSignup
        ? {
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            agreeToTerms: false,
          }
        : {
            email: "",
            password: "",
            rememberMe: false,
          }
    );
    setErrors({});
  }, [isSignup]);

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
    } else if (isSignup && formData.password.length < 8) {
      newErrors.password = "Must be at least 8 characters";
    }

    // Signup-specific validations
    if (isSignup) {
      if (!formData.firstName?.trim()) newErrors.firstName = "Required";
      if (!formData.lastName?.trim()) newErrors.lastName = "Required";
      if (!formData.agreeToTerms) {
        newErrors.agreeToTerms = "You must agree to the terms";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      setIsSubmitting(true);

      try {
        if (isSignup) {
          // Registration logic
          const backendData = {
            first_name: formData.firstName,
            last_name: formData.lastName,
            email: formData.email,
            password: formData.password,
            role: userType === "seller" ? "admin" : "user",
          };

          const response = await axios.post(
            `${backendUrl}/auth/register`,
            backendData,
            { withCredentials: true }
          );

          if (response.data.success) {
            toast.success("Registration successful! Please verify your email.");

            // Set user data from registration
            setIsLoggedIn(true);
            setUserData({
              email: formData.email,
              first_name: formData.firstName,
              last_name: formData.lastName,
              role: userType === "seller" ? "admin" : "user",
              isAccountVerified: false,
            });

            // Redirect to email verification with auto-send OTP
            setTimeout(() => {
              navigate(
                `/verify-email?email=${encodeURIComponent(
                  formData.email
                )}&autoSend=true`
              );
            }, 1500);
          } else {
            toast.error(response.data.message || "Registration failed");
          }
        } else {
          // Login logic
          const loginData = {
            email: formData.email,
            password: formData.password,
          };

          const response = await axios.post(
            `${backendUrl}/auth/login`,
            loginData,
            { withCredentials: true }
          );

          if (response.data.success) {
            toast.success("Login successful!");

            // Set user data from login response
            setIsLoggedIn(true);
            setUserData(response.data.user);

            // Check if user needs email verification
            if (!response.data.user.isAccountVerified) {
              toast.info("Please verify your email to access all features.");
              setTimeout(() => {
                navigate(
                  `/verify-email?email=${encodeURIComponent(
                    response.data.user.email
                  )}`
                );
              }, 1500);
              return;
            }

            // Redirect based on user role
            setTimeout(() => {
              if (response.data.user.role === "admin") {
                // Use environment variable for admin panel URL
                const adminUrl =
                  import.meta.env.VITE_ADMIN_URL ||
                  import.meta.env.VITE_ADMIN_PANEL_URL ||
                  "http://localhost:5174"; // fallback for development

                // Redirect to admin panel
                window.location.href = adminUrl;
              } else {
                navigate("/");
              }
            }, 1000);
          } else {
            toast.error(response.data.message || "Login failed");
          }
        }
      } catch (error) {
        console.error("Auth error:", error);
        const errorMessage =
          error.response?.data?.message ||
          `${isSignup ? "Registration" : "Login"} failed. Please try again.`;
        toast.error(errorMessage);

        if (!isSignup) {
          setErrors({ form: "Invalid email or password" });
        }
      } finally {
        setIsSubmitting(false);
      }
    } else {
      toast.error("Please fix the errors in the form");
    }
  };

  return (
    <div className="bg-background flex flex-col justify-center px-4 py-5 md:py-12">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-gray-800 p-5 md:p-10 shadow rounded-lg">
          <div className="mb-5 md:mb-8">
            <h2 className="text-center text-2xl font-semibold text-gray-800 dark:text-white">
              {isSignup ? "Create Account" : "Welcome Back"}
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
              {isSignup
                ? `Join our community of ${
                    userType === "seller"
                      ? "stationery sellers"
                      : "stationery enthusiasts"
                  }`
                : "Sign in to continue to your account"}
            </p>
          </div>

          {registeredSuccess && !isSignup && (
            <div className="mb-4 rounded-md bg-green-50 dark:bg-green-900/30 p-3 text-sm text-green-700 dark:text-green-300">
              Account created successfully! Please log in.
            </div>
          )}

          {errors.form && (
            <div className="mb-4 rounded-md bg-red-50 dark:bg-red-900/30 p-3 text-sm text-red-700 dark:text-red-300">
              {errors.form}
            </div>
          )}

          {/* User Type Toggle */}
          <div className="flex mb-6 border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
            <button
              type="button"
              onClick={() => setUserType("customer")}
              className={`flex-1 py-2.5 text-center text-sm font-medium transition-all ${
                userType === "customer"
                  ? "bg-primary text-white"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
              }`}
            >
              <i className="fas fa-user mr-2"></i>
              Customer
            </button>
            <button
              type="button"
              onClick={() => setUserType("seller")}
              className={`flex-1 py-2.5 text-center text-sm font-medium transition-all ${
                userType === "seller"
                  ? "bg-primary text-white"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
              }`}
            >
              <i className="fas fa-store mr-2"></i>
              Seller
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Signup-only fields */}
            {isSignup && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <div className="relative">
                    <input
                      id="firstName"
                      name="firstName"
                      type="text"
                      value={formData.firstName || ""}
                      onChange={handleChange}
                      placeholder="First Name"
                      className={`w-full rounded-md py-2 px-3 border ${
                        errors.firstName
                          ? "border-red-500 dark:border-red-700"
                          : "border-gray-300 dark:border-gray-600"
                      } bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-primary focus:border-primary`}
                    />
                  </div>
                  {errors.firstName && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {errors.firstName}
                    </p>
                  )}
                </div>

                <div>
                  <div className="relative">
                    <input
                      id="lastName"
                      name="lastName"
                      type="text"
                      value={formData.lastName || ""}
                      onChange={handleChange}
                      placeholder="Last Name"
                      className={`w-full rounded-md py-2 px-3 border ${
                        errors.lastName
                          ? "border-red-500 dark:border-red-700"
                          : "border-gray-300 dark:border-gray-600"
                      } bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-primary focus:border-primary`}
                    />
                  </div>
                  {errors.lastName && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {errors.lastName}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Email field */}
            <div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <i className="fas fa-envelope text-gray-400"></i>
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email address"
                  className={`pl-10 w-full rounded-md py-2 px-3 border ${
                    errors.email
                      ? "border-red-500 dark:border-red-700"
                      : "border-gray-300 dark:border-gray-600"
                  } bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-primary focus:border-primary`}
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password field */}
            <div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <i className="fas fa-lock text-gray-400"></i>
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete={isSignup ? "new-password" : "current-password"}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder={
                    isSignup ? "Password (min. 8 characters)" : "Password"
                  }
                  className={`pl-10 w-full rounded-md py-2 px-3 border ${
                    errors.password
                      ? "border-red-500 dark:border-red-700"
                      : "border-gray-300 dark:border-gray-600"
                  } bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-primary focus:border-primary`}
                />
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.password}
                </p>
              )}
            </div>

            {/* Login-only fields */}
            {!isSignup && (
              <div className="flex flex-col md:justify-between gap-3">
                <div className="text-sm flex justify-end">
                  <Link
                    to="/forgot-password"
                    className="font-medium text-primary hover:text-primary/80"
                  >
                    Forgot password?
                  </Link>
                </div>

                <div className="flex items-center">
                  <input
                    id="rememberMe"
                    name="rememberMe"
                    type="checkbox"
                    checked={formData.rememberMe || false}
                    onChange={handleChange}
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                  />
                  <label
                    htmlFor="rememberMe"
                    className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
                  >
                    Remember me
                  </label>
                </div>
              </div>
            )}

            {/* Signup-only terms agreement */}
            {isSignup && (
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="agreeToTerms"
                    name="agreeToTerms"
                    type="checkbox"
                    checked={formData.agreeToTerms || false}
                    onChange={handleChange}
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3">
                  <label
                    htmlFor="agreeToTerms"
                    className="text-sm text-gray-700 dark:text-gray-300"
                  >
                    I agree to the{" "}
                    <Link to="/terms" className="text-primary">
                      Terms
                    </Link>{" "}
                    and{" "}
                    <Link to="/privacy" className="text-primary">
                      Privacy Policy
                    </Link>
                  </label>
                  {errors.agreeToTerms && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {errors.agreeToTerms}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Submit button */}
            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                ) : isSignup ? (
                  "Create Account"
                ) : (
                  `Sign in as ${userType === "seller" ? "Seller" : "Customer"}`
                )}
              </button>
            </div>
          </form>

          {/* Toggle between login and signup */}
          <div className="mt-6 text-center text-sm">
            <p className="text-gray-600 dark:text-gray-400">
              {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
              <Link
                to={
                  isSignup
                    ? `/login${userType === "seller" ? "?type=seller" : ""}`
                    : `/signup${userType === "seller" ? "?type=seller" : ""}`
                }
                className="font-medium text-primary hover:text-primary/80"
              >
                {isSignup ? "Sign in" : "Sign up"}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthForm;
