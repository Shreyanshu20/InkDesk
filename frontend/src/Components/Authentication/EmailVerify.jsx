import React, { useState, useEffect, useContext, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AppContent } from "../../Context/AppContent.jsx";
import axios from "axios";
import { toast } from "react-toastify";

function EmailVerify() {
  const { backendUrl, userData, setUserData } = useContext(AppContent);
  const navigate = useNavigate();
  const location = useLocation();

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [email, setEmail] = useState("");

  // Simple ref to prevent duplicate sends
  const hasSentOTP = useRef(false);

  // Create refs for inputs
  const inputRefs = useRef(
    Array(6)
      .fill(0)
      .map(() => React.createRef())
  );

  // Simple function to send OTP
  const sendOTP = async () => {
    if (hasSentOTP.current) return;

    hasSentOTP.current = true;
    setResendDisabled(true);
    setCountdown(60);

    try {
      const response = await axios.post(
        `${backendUrl}/auth/sendVerificationEmail`,
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

        if (userData) {
          setUserData({
            ...userData,
            isAccountVerified: true,
          });
        }

        setTimeout(() => {
          if (userData.role === "admin") {
            // Use environment variable for admin panel URL
            const adminUrl =
              import.meta.env.VITE_ADMIN_URL || "http://localhost:5174";

            console.log("🔄 Redirecting admin to:", adminUrl);
            toast.success(
              `Welcome ${userData.first_name}! Redirecting to admin panel...`
            );

            // Redirect to admin panel with proper token
            window.location.href = adminUrl;
          } else {
            navigate("/");
          }
        }, 1000);
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
    <div className="flex flex-col justify-center min-h-screen py-12 bg-gray-50 dark:bg-gray-900">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center">
            <i className="fas fa-envelope text-white text-xl"></i>
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
          Verify your email
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400 max-w-sm mx-auto">
          We've sent a verification code to{" "}
          <span className="font-medium text-primary">{email}</span>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Verification Code
              </label>
              <div className="mt-2 flex justify-center gap-2">
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
                    className="w-12 h-12 text-center text-xl font-semibold rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-primary focus:ring-primary"
                    required
                  />
                ))}
              </div>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 text-center">
                Enter the 6-digit code sent to your email
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <i className="fas fa-spinner fa-spin mr-2"></i>
                  Verifying...
                </>
              ) : (
                "Verify Email"
              )}
            </button>
          </form>

          <div className="mt-6">
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
                className="text-sm font-medium text-primary hover:text-primary/80 disabled:text-gray-500 disabled:cursor-not-allowed"
              >
                {resendDisabled ? (
                  <>
                    <i className="fas fa-clock mr-1"></i>
                    Resend code in {countdown}s
                  </>
                ) : (
                  <>
                    <i className="fas fa-paper-plane mr-1"></i>
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
