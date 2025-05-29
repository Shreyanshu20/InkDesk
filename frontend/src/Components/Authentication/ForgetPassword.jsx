import React, { useState, useContext, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { AppContent } from "../../Context/AppContent.jsx";

function ForgetPassword() {
  const { backendUrl } = useContext(AppContent);
  const navigate = useNavigate();

  // Track the current step of the password reset flow
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password

  // Form data for all steps
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [passwords, setPasswords] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  // Loading states for each step
  const [sendingEmail, setSendingEmail] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [resettingPassword, setResettingPassword] = useState(false);

  // OTP resend cooldown
  const [resendDisabled, setResendDisabled] = useState(false);
  const [countdown, setCountdown] = useState(0);

  // References for OTP inputs
  const inputRefs = Array(6)
    .fill(0)
    .map(() => useRef(null));

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
        `${backendUrl}/auth/forget-password-otp`,
        { email }
      );

      if (response.data.success) {
        toast.success("OTP sent to your email");
        setStep(2);
        // Start resend cooldown
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

  // Handle backspace in OTP fields
  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      // Move to previous input on backspace if current input is empty
      inputRefs[index - 1].current.focus();
    }
  };

  // Handle OTP paste
  const handleOtpPaste = (e) => {
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

  // Resend OTP
  const handleResendOtp = async () => {
    if (resendDisabled) return;

    setResendDisabled(true);

    try {
      const response = await axios.post(
        `${backendUrl}/auth/forget-password-otp`,
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

    // Move directly to step 3 since we'll verify OTP with the reset-password endpoint
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
      const response = await axios.post(`${backendUrl}/auth/reset-password`, {
        email,
        otp: otp.join(""),
        newPassword: passwords.newPassword,
      });

      if (response.data.success) {
        toast.success("Password reset successfully");
        // Redirect to login page after successful reset
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        toast.error(response.data.message || "Failed to reset password");
      }
    } catch (error) {
      console.error("Password reset error:", error);
      if (error.response?.data?.message === "Invalid OTP") {
        toast.error("Invalid verification code. Please check and try again.");
        // Go back to OTP step if the OTP is invalid
        setStep(2);
      } else if (error.response?.data?.message === "OTP expired") {
        toast.error("Verification code has expired. Please request a new one.");
        // Go back to email step if the OTP expired
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
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Email Address
              </label>
              <div className="mt-1 relative">
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
                  placeholder="Enter your email address"
                  className="pl-10 w-full rounded-md py-2 px-3 border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-primary focus:border-primary"
                  required
                />
              </div>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                We'll send a one-time password to this email
              </p>
            </div>

            <div>
              <button
                type="submit"
                disabled={sendingEmail}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {sendingEmail ? (
                  <>
                    <i className="fas fa-spinner fa-spin mr-2"></i>
                    Sending...
                  </>
                ) : (
                  "Send Reset OTP"
                )}
              </button>
            </div>
          </form>
        );

      case 2:
        return (
          <form onSubmit={handleOtpSubmit} className="space-y-6">
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
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    onPaste={index === 0 ? handleOtpPaste : undefined}
                    className="w-12 h-12 text-center text-xl font-semibold rounded-md border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-primary focus:ring-primary"
                    required
                  />
                ))}
              </div>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 text-center">
                Enter the 6-digit code sent to {email}
              </p>
            </div>

            <div>
              <button
                type="submit"
                disabled={verifyingOtp}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {verifyingOtp ? (
                  <>
                    <i className="fas fa-spinner fa-spin mr-2"></i>
                    Verifying...
                  </>
                ) : (
                  "Verify OTP"
                )}
              </button>
            </div>

            <div className="text-center">
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={resendDisabled}
                className="text-sm font-medium text-primary hover:text-primary/80 disabled:text-gray-500 disabled:cursor-not-allowed"
              >
                {resendDisabled ? (
                  <>
                    <i className="fas fa-clock mr-1"></i>
                    Resend in {countdown}s
                  </>
                ) : (
                  "Resend OTP"
                )}
              </button>
            </div>

            <div className="text-center">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
              >
                <i className="fas fa-arrow-left mr-1"></i>
                Change email
              </button>
            </div>
          </form>
        );

      case 3:
        return (
          <form onSubmit={handlePasswordSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="newPassword"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                New Password
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <i className="fas fa-lock text-gray-400"></i>
                </div>
                <input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  value={passwords.newPassword}
                  onChange={handlePasswordChange}
                  placeholder="Minimum 8 characters"
                  className="pl-10 w-full rounded-md py-2 px-3 border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-primary focus:border-primary"
                  required
                  minLength={8}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Confirm New Password
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <i className="fas fa-lock text-gray-400"></i>
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={passwords.confirmPassword}
                  onChange={handlePasswordChange}
                  placeholder="Confirm your password"
                  className="pl-10 w-full rounded-md py-2 px-3 border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-primary focus:border-primary"
                  required
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={resettingPassword}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {resettingPassword ? (
                  <>
                    <i className="fas fa-spinner fa-spin mr-2"></i>
                    Resetting...
                  </>
                ) : (
                  "Reset Password"
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
    <div className="flex flex-col justify-center py-15 sm:px-6 lg:px-8 bg-background text-text">
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-gray-100 dark:bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="sm:mx-auto sm:w-full sm:max-w-md mb-10">
            <div className="flex justify-center">
              <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center">
                <i className="fas fa-key text-white text-xl"></i>
              </div>
            </div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
              Reset your password
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
              {step === 1 && "Enter your email to receive a reset code"}
              {step === 2 && "Enter the verification code sent to your email"}
              {step === 3 && "Create a new password for your account"}
            </p>
          </div>

          {/* Progress Indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div className="flex flex-col items-center">
                <div
                  className={`h-8 w-8 rounded-full flex items-center justify-center ${
                    step >= 1
                      ? "bg-primary text-white"
                      : "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                  }`}
                >
                  {step > 1 ? <i className="fas fa-check"></i> : 1}
                </div>
                <span className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Email
                </span>
              </div>

              <div
                className={`flex-1 h-1 mx-2 ${
                  step > 1 ? "bg-primary" : "bg-gray-200 dark:bg-gray-700"
                }`}
              ></div>

              <div className="flex flex-col items-center">
                <div
                  className={`h-8 w-8 rounded-full flex items-center justify-center ${
                    step >= 2
                      ? "bg-primary text-white"
                      : "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                  }`}
                >
                  {step > 2 ? <i className="fas fa-check"></i> : 2}
                </div>
                <span className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Verify
                </span>
              </div>

              <div
                className={`flex-1 h-1 mx-2 ${
                  step > 2 ? "bg-primary" : "bg-gray-200 dark:bg-gray-700"
                }`}
              ></div>

              <div className="flex flex-col items-center">
                <div
                  className={`h-8 w-8 rounded-full flex items-center justify-center ${
                    step >= 3
                      ? "bg-primary text-white"
                      : "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                  }`}
                >
                  3
                </div>
                <span className="mt-1 text-xs text-gray-500 dark:text-gray-400">
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
              to="/login"
              className="text-sm font-medium text-primary hover:text-primary/80"
            >
              <i className="fas fa-arrow-left mr-1"></i>
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgetPassword;
