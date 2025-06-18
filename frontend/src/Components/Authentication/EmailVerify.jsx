import React, { useState, useEffect, useContext, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AppContent } from "../../Context/AppContent.jsx";
import axios from "axios";
import { toast } from "react-toastify";

function EmailVerify() {
  const { backendUrl, userData, setUserData, setIsLoggedIn } =
    useContext(AppContent);
  const navigate = useNavigate();
  const location = useLocation();

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [email, setEmail] = useState("");

  // Check if this is coming from registration
  const isFromRegistration =
    new URLSearchParams(location.search).get("fromRegistration") === "true";

  // Simple ref to prevent duplicate sends
  const hasSentOTP = useRef(false);

  // Create refs for inputs
  const inputRefs = useRef(
    Array(6)
      .fill(0)
      .map(() => React.createRef())
  );

  // Get email from URL params or user data
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const emailFromUrl = urlParams.get("email");

    if (emailFromUrl) {
      setEmail(emailFromUrl);
    } else if (userData?.email) {
      setEmail(userData.email);
    }

    // Handle OTP sending based on registration status
    if (!isFromRegistration && !hasSentOTP.current) {
      sendOTP();
    } else if (isFromRegistration) {
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
    }
  }, [location.search, userData, isFromRegistration]);

  // Simple function to send OTP
  const sendOTP = async () => {
    if (hasSentOTP.current) return;

    hasSentOTP.current = true;
    setResendDisabled(true);
    setCountdown(60);

    try {
      const response = await axios.post(
        `${backendUrl}/auth/sendVerificationEmail`,
        {},
        { withCredentials: true }
      );

      if (response.data.success) {
        toast.success("Verification code sent to your email");
      } else {
        toast.error(
          response.data.message || "Failed to send verification code"
        );
        hasSentOTP.current = false;
        setResendDisabled(false);
        setCountdown(0);
      }
    } catch (error) {
      console.error("Send OTP error:", error);
      toast.error("Failed to send verification code");
      hasSentOTP.current = false;
      setResendDisabled(false);
      setCountdown(0);
    }
  };

  // Countdown timer
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setResendDisabled(false);
    }
  }, [countdown]);

  // Resend OTP
  const handleResend = () => {
    hasSentOTP.current = false;
    sendOTP();
  };

  // Handle OTP input
  const handleChange = (index, value) => {
    if (value && !/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1].current?.focus();
    }
  };

  // Handle backspace
  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].current?.focus();
    }
  };

  // Handle paste
  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text");

    if (/^\d{6}$/.test(pastedData)) {
      setOtp(pastedData.split(""));
      inputRefs.current[5].current?.focus();
    }
  };

  // Submit verification
  const handleSubmit = async (e) => {
    e.preventDefault();

    const otpValue = otp.join("");
    if (otpValue.length !== 6) {
      toast.error("Please enter a complete 6-digit OTP");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        `${backendUrl}/auth/verifyAccount`,
        { otp: otpValue },
        { withCredentials: true }
      );

      if (response.data.success) {
        toast.success("Email verified successfully!");

        // Set user as logged in after verification
        setIsLoggedIn(true);

        // Update user data to mark as verified
        if (userData) {
          setUserData({
            ...userData,
            isAccountVerified: true,
          });
        }

        setTimeout(() => {
          if (userData?.role === "admin") {
            const adminUrl =
              import.meta.env.VITE_ADMIN_URL || "http://localhost:5174";
            window.location.href = adminUrl;
          } else {
            navigate("/");
          }
        }, 1500);
      } else {
        toast.error(response.data.message || "Verification failed");
      }
    } catch (error) {
      console.error("Verification error:", error);
      toast.error(
        error.response?.data?.message || "An error occurred during verification"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className=" bg-background flex flex-col justify-center px-2 md:px-4 py-6 md:py-12">
      <div className="mx-auto w-full max-w-md md:max-w-lg">
        {/* FIXED: Everything inside single box */}
        <div className="bg-white dark:bg-gray-800 py-8 px-6 md:px-10 shadow-xl rounded-xl border border-gray-100 dark:border-gray-700">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="h-14 w-14 md:h-16 md:w-16 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center">
                <i className="fas fa-envelope text-white text-xl md:text-2xl"></i>
              </div>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              Verify your email
            </h2>
            <p className="mt-2 text-sm md:text-base text-gray-600 dark:text-gray-400 max-w-md mx-auto">
              {isFromRegistration
                ? `We've sent a verification code to your email address`
                : `We've sent a verification code to`}{" "}
              <span className="font-medium text-primary break-all">
                {email}
              </span>
            </p>
          </div>

          {/* Verification Form */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Verification Code
              </label>
              <div className="flex justify-center gap-2 md:gap-3">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={inputRefs.current[index]}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={index === 0 ? handlePaste : undefined}
                    className="w-10 h-10 md:w-12 md:h-12 text-center text-lg md:text-xl font-semibold rounded-lg border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm focus:border-primary focus:ring-2 focus:ring-primary transition-all duration-200"
                    required
                  />
                ))}
              </div>
              <p className="mt-3 text-xs md:text-sm text-gray-500 dark:text-gray-400 text-center">
                Enter the 6-digit code sent to your email
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-200"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Verifying...
                </>
              ) : (
                <>
                  <i className="fas fa-shield-check mr-2"></i>
                  Verify Email
                </>
              )}
            </button>
          </form>

          {/* Resend Section */}
          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                  Didn't receive the code?
                </span>
              </div>
            </div>

            <div className="mt-6 text-center">
              <button
                onClick={handleResend}
                disabled={resendDisabled}
                className="inline-flex items-center text-sm font-medium text-primary hover:text-primary/80 disabled:text-gray-500 disabled:cursor-not-allowed transition-colors"
              >
                {resendDisabled ? (
                  <>
                    <i className="fas fa-clock mr-2"></i>
                    Resend code in {countdown}s
                  </>
                ) : (
                  <>
                    <i className="fas fa-paper-plane mr-2"></i>
                    Resend verification code
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EmailVerify;
