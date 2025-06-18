import React, { useState, useRef, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { ThemeContext } from "../../Context/ThemeContext";

function AdminForgotPassword() {
  const navigate = useNavigate();
  const { themeToggle } = useContext(ThemeContext);
  const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

  // Track the current step of the password reset flow
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password

  // Form data for all steps
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [passwords, setPasswords] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  // Password visibility toggles
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Loading states for each step
  const [sendingEmail, setSendingEmail] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [resettingPassword, setResettingPassword] = useState(false);

  // OTP resend cooldown
  const [resendDisabled, setResendDisabled] = useState(false);
  const [countdown, setCountdown] = useState(0);

  // Theme state
  const [isDark, setIsDark] = useState(false);

  // References for OTP inputs
  const inputRefs = Array(6)
    .fill(0)
    .map(() => useRef(null));

  // Check initial theme state
  useEffect(() => {
    const isDarkMode =
      document.documentElement.classList.contains("dark") ||
      localStorage.theme === "dark" ||
      (!("theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);
    setIsDark(isDarkMode);
  }, []);

  // Handle theme toggle
  const handleThemeToggle = () => {
    themeToggle();
    setIsDark(!isDark);
  };

  // Handle email submission (Step 1)
  const handleEmailSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setSendingEmail(true);

    try {
      const response = await axios.post(
        `${backendUrl}/auth/sendResetPasswordEmail`,
        { email }
      );

      if (response.data.success) {
        toast.success("OTP sent to your email");
        setStep(2);
        setResendDisabled(true);
        setCountdown(60);
        const timer = setInterval(() => {
          setCountdown((prev) => {
            if (prev <= 1) {
              clearInterval(timer);
              setResendDisabled(false);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      } else {
        toast.error(response.data.message || "Failed to send OTP");
      }
    } catch (error) {
      console.error("Send OTP error:", error);
      toast.error(
        error.response?.data?.message || "Failed to send OTP. Please try again."
      );
    } finally {
      setSendingEmail(false);
    }
  };

  // Handle OTP input changes
  const handleOtpChange = (index, value) => {
    if (value && !/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs[index + 1].current.focus();
    }
  };

  // Handle backspace in OTP fields
  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs[index - 1].current.focus();
    }
  };

  // Handle OTP paste
  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text");

    if (/^\d{6}$/.test(pastedData)) {
      const digits = pastedData.split("");
      setOtp(digits);
      inputRefs[5].current.focus();
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    if (resendDisabled) return;

    setResendDisabled(true);

    try {
      const response = await axios.post(
        `${backendUrl}/auth/sendResetPasswordEmail`,
        { email }
      );

      if (response.data.success) {
        toast.success("New OTP sent to your email");
        setCountdown(60);
        const timer = setInterval(() => {
          setCountdown((prev) => {
            if (prev <= 1) {
              clearInterval(timer);
              setResendDisabled(false);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      } else {
        toast.error(response.data.message || "Failed to resend OTP");
        setResendDisabled(false);
      }
    } catch (error) {
      console.error("Resend OTP error:", error);
      toast.error(error.response?.data?.message || "Failed to resend OTP");
      setResendDisabled(false);
    }
  };

  // Verify OTP (Step 2)
  const handleOtpSubmit = async (e) => {
    e.preventDefault();

    const otpValue = otp.join("");
    if (otpValue.length !== 6) {
      toast.error("Please enter a complete 6-digit OTP");
      return;
    }

    setStep(3);
  };

  // Handle password change
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswords({
      ...passwords,
      [name]: value,
    });
  };

  // Reset password (Step 3)
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (!passwords.newPassword) {
      toast.error("Please enter a new password");
      return;
    }

    if (passwords.newPassword.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }

    if (passwords.newPassword !== passwords.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setResettingPassword(true);

    try {
      const response = await axios.post(`${backendUrl}/auth/resetPassword`, {
        email,
        otp: otp.join(""),
        newPassword: passwords.newPassword,
      });

      if (response.data.success) {
        toast.success("Password reset successfully");
        setTimeout(() => {
          navigate("/admin/login");
        }, 2000);
      } else {
        toast.error(response.data.message || "Failed to reset password");
      }
    } catch (error) {
      console.error("Password reset error:", error);
      if (error.response?.data?.message === "Invalid OTP") {
        toast.error("Invalid verification code. Please check and try again.");
        setStep(2);
      } else if (error.response?.data?.message === "OTP expired") {
        toast.error("Verification code has expired. Please request a new one.");
        setStep(1);
      } else {
        toast.error(
          error.response?.data?.message || "Failed to reset password"
        );
      }
    } finally {
      setResettingPassword(false);
    }
  };

  // Render different form based on current step
  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <form onSubmit={handleEmailSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <i className="fas fa-envelope text-gray-400"></i>
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your admin email address"
                  className="pl-10 pr-3 md:pr-4 w-full rounded-lg py-3 px-4 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                  required
                />
              </div>
              <p className="mt-2 text-xs md:text-sm text-gray-500 dark:text-gray-400">
                We'll send a one-time password to this email
              </p>
            </div>

            <div>
              <button
                type="submit"
                disabled={sendingEmail}
                className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-200"
              >
                {sendingEmail ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Sending...
                  </>
                ) : (
                  <>
                    <i className="fas fa-paper-plane mr-2"></i>
                    Send Reset OTP
                  </>
                )}
              </button>
            </div>
          </form>
        );

      case 2:
        return (
          <form onSubmit={handleOtpSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Verification Code
              </label>
              <div className="flex justify-center gap-2 md:gap-3">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={inputRefs[index]}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    onPaste={index === 0 ? handleOtpPaste : undefined}
                    className="w-10 h-10 md:w-12 md:h-12 text-center text-lg md:text-xl font-semibold rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-primary focus:ring-2 focus:ring-primary transition-all duration-200"
                    required
                  />
                ))}
              </div>
              <p className="mt-2 text-xs md:text-sm text-gray-500 dark:text-gray-400 text-center">
                Enter the 6-digit code sent to{" "}
                <span className="font-medium text-primary">{email}</span>
              </p>
            </div>

            <div>
              <button
                type="submit"
                disabled={verifyingOtp}
                className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-200"
              >
                {verifyingOtp ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Verifying...
                  </>
                ) : (
                  <>
                    <i className="fas fa-shield-alt mr-2"></i>
                    Verify OTP
                  </>
                )}
              </button>
            </div>

            <div className="text-center space-y-3">
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={resendDisabled}
                className="text-sm font-medium text-primary hover:text-primary/80 disabled:text-gray-500 disabled:cursor-not-allowed transition-colors"
              >
                {resendDisabled ? (
                  <>
                    <i className="fas fa-clock mr-1"></i>
                    Resend in {countdown}s
                  </>
                ) : (
                  <>
                    <i className="fas fa-redo mr-1"></i>
                    Resend OTP
                  </>
                )}
              </button>

              <div>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                >
                  <i className="fas fa-arrow-left mr-1"></i>
                  Change email
                </button>
              </div>
            </div>
          </form>
        );

      case 3:
        return (
          <form onSubmit={handlePasswordSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="newPassword"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                New Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <i className="fas fa-lock text-gray-400"></i>
                </div>
                <input
                  id="newPassword"
                  name="newPassword"
                  type={showNewPassword ? "text" : "password"}
                  value={passwords.newPassword}
                  onChange={handlePasswordChange}
                  placeholder="Minimum 8 characters"
                  className="pl-10 pr-12 w-full rounded-lg py-3 px-4 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                  required
                  minLength={8}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  <i className={`fas ${showNewPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                </button>
              </div>
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Confirm New Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <i className="fas fa-lock text-gray-400"></i>
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={passwords.confirmPassword}
                  onChange={handlePasswordChange}
                  placeholder="Confirm your password"
                  className="pl-10 pr-12 w-full rounded-lg py-3 px-4 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  <i className={`fas ${showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                </button>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={resettingPassword}
                className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-200"
              >
                {resettingPassword ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Resetting...
                  </>
                ) : (
                  <>
                    <i className="fas fa-key mr-2"></i>
                    Reset Password
                  </>
                )}
              </button>
            </div>
          </form>
        );

      default:
        return null;
    }
  };

  return (
    <div className="font-['Red_Rose'] min-h-screen bg-background text-text flex flex-col justify-center px-4 py-6 md:py-12 relative">
      {/* Theme Toggle - Top Left */}
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
        <div className="bg-white dark:bg-gray-800 py-8 px-6 md:px-10 shadow-xl rounded-xl border border-gray-100 dark:border-gray-700">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="h-14 w-14 md:h-16 md:w-16 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center">
                <i className="fas fa-key text-white text-xl md:text-2xl"></i>
              </div>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              Reset Admin Password
            </h2>
            <p className="mt-2 text-sm md:text-base text-gray-600 dark:text-gray-400">
              {step === 1 && "Enter your admin email to receive a reset code"}
              {step === 2 && "Enter the verification code sent to your email"}
              {step === 3 && "Create a new password for your admin account"}
            </p>
          </div>

          {/* Progress Indicator */}
          <div className="mb-8">
            <div className="flex items-center">
              {/* Step 1 */}
              <div className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center text-sm font-semibold ${
                    step >= 1
                      ? "bg-primary text-white"
                      : "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                  } transition-all duration-200`}
                >
                  {step > 1 ? <i className="fas fa-check"></i> : 1}
                </div>
                <span className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  Email
                </span>
              </div>

              {/* Line 1 */}
              <div
                className={`flex-1 h-1 mb-5 ${
                  step > 1 ? "bg-primary" : "bg-gray-200 dark:bg-gray-700"
                } transition-all duration-200`}
              ></div>

              {/* Step 2 */}
              <div className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center text-sm font-semibold ${
                    step >= 2
                      ? "bg-primary text-white"
                      : "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                  } transition-all duration-200`}
                >
                  {step > 2 ? <i className="fas fa-check"></i> : 2}
                </div>
                <span className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  Verify
                </span>
              </div>

              {/* Line 2 */}
              <div
                className={`flex-1 h-1 mb-5 ${
                  step > 2 ? "bg-primary" : "bg-gray-200 dark:bg-gray-700"
                } transition-all duration-200`}
              ></div>

              {/* Step 3 */}
              <div className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center text-sm font-semibold ${
                    step >= 3
                      ? "bg-primary text-white"
                      : "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                  } transition-all duration-200`}
                >
                  3
                </div>
                <span className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  Reset
                </span>
              </div>
            </div>
          </div>

          {/* Step Content */}
          {renderStepContent()}

          {/* Back to Login */}
          <div className="mt-6 text-center">
            <Link
              to="/admin/login"
              className="text-sm font-medium text-primary hover:text-primary/80 inline-flex items-center transition-colors"
            >
              <i className="fas fa-arrow-left mr-1"></i>
              Back to Admin Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminForgotPassword;