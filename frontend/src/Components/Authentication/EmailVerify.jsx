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
  const otpSentRef = useRef(false);

  const inputRefs = Array(6)
    .fill(0)
    .map(() => React.createRef());

  useEffect(() => {
    // Handle countdown for resending OTP
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setResendDisabled(false);
    }
  }, [countdown]);

  // Get email from URL params or userData
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const emailParam = params.get("email");
    const autoSend = params.get("autoSend") === "true";

    if (emailParam) {
      setEmail(emailParam);
    } else if (userData?.email) {
      setEmail(userData.email);
    } else {
      toast.error("No email provided for verification");
      navigate("/login");
      return;
    }

    // Only send OTP automatically if requested AND not already sent
    if (autoSend && !otpSentRef.current) {
      handleResendOTP();
      otpSentRef.current = true;
    }
  }, [location.search, userData, navigate]);

  // Handle OTP input change
  const handleChange = (index, value) => {
    // Only allow numbers
    if (value && !/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs[index + 1].current.focus();
    }
  };

  // Handle key press for backspace
  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      // Move to previous input on backspace if current input is empty
      inputRefs[index - 1].current.focus();
    }
  };

  // Paste OTP from clipboard
  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text");

    // Check if pasted content is a 6-digit number
    if (/^\d{6}$/.test(pastedData)) {
      const digits = pastedData.split("");
      setOtp(digits);

      // Focus the last input
      inputRefs[5].current.focus();
    }
  };

  // Submit OTP for verification
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
        `${backendUrl}/auth/verify-account`,
        { otp: otpValue },
        { withCredentials: true }
      );

      if (response.data.success) {
        toast.success("Email verified successfully!");

        // Update user data if available
        if (userData) {
          setUserData({
            ...userData,
            isAccountVerified: true,
          });
        }

        // Redirect to my-account page
        setTimeout(() => {
          navigate("/account");
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

  // Request a new OTP
  const handleResendOTP = async () => {
    setResendDisabled(true);
    setCountdown(60); // 60 seconds cooldown

    try {
      const response = await axios.post(
        `${backendUrl}/auth/send-otp`,
        {},
        { withCredentials: true }
      );

      if (response.data.success) {
        toast.success("New verification code sent to your email");
      } else {
        toast.error(response.data.message || "Failed to send verification code");
        setResendDisabled(false);
        setCountdown(0);
      }
    } catch (error) {
      console.error("Resend OTP error:", error);
      toast.error(error.response?.data?.message || "Failed to send verification code");
      setResendDisabled(false);
      setCountdown(0);
    }
  };

  return (
    <div className="flex flex-col justify-center py-15 bg-gray-50 dark:bg-gray-900">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center">
            <i className="fas fa-envelope text-white text-xl"></i>
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
          Verify your email
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400 max-w">
          We've sent a verification code to{" "}
          <span className="font-medium text-primary">{email}</span>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="otp"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Verification Code
              </label>
              <div className="mt-2 flex justify-center gap-2">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={inputRefs[index]}
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

            <div>
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
            </div>
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
                onClick={handleResendOTP}
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
