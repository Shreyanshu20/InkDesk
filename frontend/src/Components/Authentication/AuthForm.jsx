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
  const {
    backendUrl,
    setIsLoggedIn,
    setUserData,
    isLoggedIn,
    loading,
    userData,
  } = useContext(AppContent);
  const [searchParams] = useSearchParams();

  // Determine if this is signup or login based on path
  const isSignup = location.pathname === "/signup";

  // Get registration success from URL params
  const registeredSuccess = searchParams.get("registered") === "true";

  // State for form submission
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

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
          rememberMe: true,
        }
  );

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
            rememberMe: true,
          }
    );
    setErrors({});
    setShowPassword(false);
  }, [isSignup]);

  // Redirect if already logged in and verified
  useEffect(() => {
    if (!loading && isLoggedIn && userData?.isAccountVerified) {
      navigate("/");
    }
  }, [isLoggedIn, loading, navigate, userData]);

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
            role: "user",
          };

          const response = await axios.post(
            `${backendUrl}/auth/register`,
            backendData,
            { withCredentials: true }
          );

          if (response.data.success) {
            toast.success("Registration successful! Please verify your email.");

            // FIXED: Set logged in immediately after registration since backend sets cookie
            setIsLoggedIn(true);
            setUserData(response.data.user);

            // Direct redirect to verification page
            navigate(
              `/verify-email?email=${encodeURIComponent(
                formData.email
              )}&fromRegistration=true`
            );
          } else {
            toast.error(response.data.message || "Registration failed");
          }
        } else {
          // Login logic
          const loginData = {
            email: formData.email,
            password: formData.password,
            role: "user",
            rememberMe: formData.rememberMe,
          };

          const response = await axios.post(
            `${backendUrl}/auth/login`,
            loginData,
            { withCredentials: true }
          );

          if (response.data.success) {
            toast.success("Login successful!");

            setIsLoggedIn(true);
            setUserData(response.data.user);

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

            setTimeout(() => {
              navigate("/");
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

  // Show loading while checking auth
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-text">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render form if already logged in and verified
  if (isLoggedIn && userData?.isAccountVerified) {
    return null;
  }

  return (
    <div className="bg-background flex flex-col justify-center px-4 py-6">
      <div className="mx-auto w-full max-w-md md:max-w-lg">
        <div className="bg-white dark:bg-gray-800 p-6 md:p-8 lg:p-10 shadow-xl rounded-xl border border-gray-100 dark:border-gray-700">
          {/* Header */}
          <div className="mb-6 md:mb-8">
            <div className="flex justify-center mb-4">
              <div className="h-12 w-12 md:h-16 md:w-16 rounded-full bg-gradient-to-r from-red-600/80 to-red-700/80 flex items-center justify-center">
                <i
                  className={`fas ${
                    isSignup ? "fa-user-plus" : "fa-sign-in-alt"
                  } text-white text-lg md:text-xl lg:text-2xl`}
                ></i>
              </div>
            </div>
            <h2 className="text-center text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">
              {isSignup ? "Create Account" : "Welcome Back"}
            </h2>
            <p className="mt-2 text-center text-sm md:text-base text-gray-600 dark:text-gray-400">
              {isSignup
                ? "Join our community of stationery enthusiasts"
                : "Sign in to continue to your account"}
            </p>
          </div>

          {/* Success message */}
          {registeredSuccess && !isSignup && (
            <div className="mb-4 rounded-lg bg-green-50 dark:bg-green-900/30 p-3 md:p-4 text-sm text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800">
              <div className="flex items-center">
                <i className="fas fa-check-circle mr-2 text-green-500"></i>
                Account created successfully! Please log in.
              </div>
            </div>
          )}

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
            {/* Signup-only fields */}
            {isSignup && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                <div>
                  <label
                    htmlFor="firstName"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    First Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <i className="fas fa-user text-gray-400 text-sm"></i>
                    </div>
                    <input
                      id="firstName"
                      name="firstName"
                      type="text"
                      value={formData.firstName || ""}
                      onChange={handleChange}
                      placeholder="John"
                      className={`pl-10 pr-3 md:pr-4 w-full rounded-lg py-2.5 md:py-3 border ${
                        errors.firstName
                          ? "border-red-500 dark:border-red-700 focus:ring-red-500"
                          : "border-gray-300 dark:border-gray-600 focus:ring-primary"
                      } bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200`}
                    />
                  </div>
                  {errors.firstName && (
                    <p className="mt-1 text-xs md:text-sm text-red-600 dark:text-red-400 flex items-center">
                      <i className="fas fa-exclamation-triangle mr-1 text-xs"></i>
                      {errors.firstName}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="lastName"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Last Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <i className="fas fa-user text-gray-400 text-sm"></i>
                    </div>
                    <input
                      id="lastName"
                      name="lastName"
                      type="text"
                      value={formData.lastName || ""}
                      onChange={handleChange}
                      placeholder="Doe"
                      className={`pl-10 pr-3 md:pr-4 w-full rounded-lg py-2.5 md:py-3 border ${
                        errors.lastName
                          ? "border-red-500 dark:border-red-700 focus:ring-red-500"
                          : "border-gray-300 dark:border-gray-600 focus:ring-primary"
                      } bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200`}
                    />
                  </div>
                  {errors.lastName && (
                    <p className="mt-1 text-xs md:text-sm text-red-600 dark:text-red-400 flex items-center">
                      <i className="fas fa-exclamation-triangle mr-1 text-xs"></i>
                      {errors.lastName}
                    </p>
                  )}
                </div>
              </div>
            )}

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
                  placeholder="john@example.com"
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
                  autoComplete={isSignup ? "new-password" : "current-password"}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder={
                    isSignup ? "Minimum 8 characters" : "Enter your password"
                  }
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

            {/* Login-only fields */}
            {!isSignup && (
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="rememberMe"
                    name="rememberMe"
                    type="checkbox"
                    checked={formData.rememberMe || false}
                    onChange={handleChange}
                    className="h-3 md:h-4 w-3 md:w-4 md:text-sm text-primary focus:ring-primary border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700"
                  />
                  <label
                    htmlFor="rememberMe"
                    className="ml-2 block text-xs md:text-sm text-gray-700 dark:text-gray-300"
                  >
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <Link
                    to="/forgot-password"
                    className="font-medium text-xs md:text-sm text-primary hover:text-primary/80 transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>
              </div>
            )}

            {/* Signup-only terms agreement */}
            {isSignup && (
              <div className="flex items-start space-x-3">
                <div className="flex items-center h-5 mt-0.5">
                  <input
                    id="agreeToTerms"
                    name="agreeToTerms"
                    type="checkbox"
                    checked={formData.agreeToTerms || false}
                    onChange={handleChange}
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700"
                  />
                </div>
                <div className="flex-1">
                  <label
                    htmlFor="agreeToTerms"
                    className="text-sm text-gray-700 dark:text-gray-300"
                  >
                    I agree to the{" "}
                    <Link
                      to="/terms"
                      className="text-primary hover:text-primary/80 font-medium"
                    >
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link
                      to="/privacy"
                      className="text-primary hover:text-primary/80 font-medium"
                    >
                      Privacy Policy
                    </Link>
                  </label>
                  {errors.agreeToTerms && (
                    <p className="mt-1 text-xs md:text-sm text-red-600 dark:text-red-400 flex items-center">
                      <i className="fas fa-exclamation-triangle mr-1 text-xs"></i>
                      {errors.agreeToTerms}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Submit button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex justify-center items-center py-3 md:py-3.5 px-4 border border-transparent rounded-lg shadow-sm text-sm md:text-base font-medium text-white bg-gradient-to-r from-red-600/80 to-red-700/80 hover:from-red-700/80 hover:to-red-800/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-300"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    {isSignup ? "Creating Account..." : "Signing In..."}
                  </>
                ) : (
                  <>
                    <i
                      className={`fas ${
                        isSignup ? "fa-user-plus" : "fa-sign-in-alt"
                      } mr-2`}
                    ></i>
                    {isSignup ? "Create Account" : "Sign In"}
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Footer links */}
          <div className="mt-6 md:mt-8 space-y-4">
            <div className="text-center text-sm">
              <p className="text-gray-600 dark:text-gray-400">
                {isSignup
                  ? "Already have an account?"
                  : "Don't have an account?"}{" "}
                <Link
                  to={isSignup ? "/login" : "/signup"}
                  className="font-medium text-primary hover:text-primary/80 transition-colors"
                >
                  {isSignup ? "Sign in" : "Sign up"}
                </Link>
              </p>
            </div>

            {/* Admin Access Button */}
            <div className="text-center border-t border-gray-200 dark:border-gray-600 pt-6">
              <a
                href={import.meta.env.VITE_ADMIN_URL || "http://localhost:5174"}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex justify-center items-center py-3 md:py-3.5 px-4 border border-transparent rounded-lg shadow-sm text-sm md:text-base font-medium text-white bg-gradient-to-r from-red-600/80 to-red-700/80 hover:from-red-700/80 hover:to-red-800/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-300"
              >
                <i className="fas fa-shield-alt mr-2"></i>
                Access Admin Panel
                <i className="fas fa-external-link-alt ml-2 text-sm"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthForm;
