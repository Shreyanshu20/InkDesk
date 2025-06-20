import React, { useState, useEffect, useContext } from "react";
import { AppContent } from "../../Context/AppContent.jsx";
import axios from "axios";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import MyAccountSkeleton from "./MyAccountSkeleton";

function MyAccount() {
  const { userData, setUserData, backendUrl } = useContext(AppContent);
  const [activeTab, setActiveTab] = useState("profile");
  const [isLoading, setIsLoading] = useState(false);

  // Profile data from backend
  const [profileData, setProfileData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    role: "",
    isAccountVerified: false,
    status: "",
    createdAt: ""
  });

  // Profile form state (email readonly)
  const [profileForm, setProfileForm] = useState({
    first_name: "",
    last_name: "",
    phone: ""
  });

  // Address form state - ADD THIS
  const [addressForm, setAddressForm] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    address_line_1: "",
    address_line_2: "",
    city: "",
    state: "",
    postal_code: "",
    country: "India"
  });

  // Password form state
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  // Delete account form state
  const [deleteForm, setDeleteForm] = useState({
    password: "",
    confirmText: ""
  });

  // Load user profile data on component mount
  useEffect(() => {
    fetchUserData();
  }, []);

  // Fetch complete user data from backend
  const fetchUserData = async () => {
    try {
      setIsLoading(true);

      const [profileResponse, authResponse] = await Promise.all([
        axios.get(`${backendUrl}/user/profile`, {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }),
        axios.post(
          `${backendUrl}/auth/is-auth`,
          {},
          {
            withCredentials: true,
            headers: {
              "Content-Type": "application/json",
            },
          }
        ),
      ]);

      if (profileResponse.data.success && authResponse.data.success) {
        const user = {
          ...profileResponse.data.user,
          ...authResponse.data.user,
        };

        setProfileData(user);

        // Set profile form data
        setProfileForm({
          first_name: user.first_name || "",
          last_name: user.last_name || "",
          phone: user.phone || "",
        });

        // Set address form data with user info - ADD THIS
        setAddressForm(prev => ({
          ...prev,
          first_name: user.first_name || "",
          last_name: user.last_name || "",
          phone: user.phone || ""
        }));

        // Update context with fresh data
        setUserData(user);

        // Fetch addresses after setting user data
        await fetchUserAddresses();
      }
    } catch (error) {
      console.error("❌ Error fetching user data:", error);

      if (error.response?.status === 401) {
        toast.error("Please login to access your account");
      } else {
        toast.error("Failed to load profile data");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch user addresses
  const fetchUserAddresses = async () => {
    try {
      const response = await axios.get(`${backendUrl}/user/addresses`, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.data.success && response.data.addresses.length > 0) {
        // Get the primary address or the first address
        const primaryAddress = response.data.addresses.find(addr => addr.is_primary) || response.data.addresses[0];
        
        setAddressForm({
          first_name: primaryAddress.first_name || "",
          last_name: primaryAddress.last_name || "",
          phone: primaryAddress.phone || "",
          address_line_1: primaryAddress.address_line_1 || "",
          address_line_2: primaryAddress.address_line_2 || "",
          city: primaryAddress.city || "",
          state: primaryAddress.state || "",
          postal_code: primaryAddress.postal_code || "",
          country: primaryAddress.country || "India",
        });
      }
    } catch (error) {
      // Silent fail - no addresses found is OK
      console.log("No addresses found or error fetching addresses");
    }
  };

  // Handle profile form changes
  const handleProfileChange = (field, value) => {
    setProfileForm((prev) => ({ ...prev, [field]: value }));
  };

  // Handle address form changes - ADD THIS FUNCTION
  const handleAddressChange = (field, value) => {
    setAddressForm((prev) => ({ ...prev, [field]: value }));
  };

  // Handle password form changes
  const handlePasswordChange = (field, value) => {
    setPasswordForm((prev) => ({ ...prev, [field]: value }));
  };

  // Handle delete form changes
  const handleDeleteChange = (field, value) => {
    setDeleteForm((prev) => ({ ...prev, [field]: value }));
  };

  // Validate phone number
  const validatePhone = (phone) => {
    const cleanPhone = phone.replace(/[\s\-\(\)]/g, "");
    const phoneRegex = /^[\+]?[1-9][\d]{7,15}$/;

    if (cleanPhone.length < 8 || cleanPhone.length > 16) {
      return false;
    }

    return phoneRegex.test(cleanPhone);
  };

  // Validate postal code
  const validatePostalCode = (code, country) => {
    if (!code) return false;

    if (code.length < 3) return false;

    if (country === "India") {
      const indiaPostalRegex = /^[1-9][0-9]{5}$/;
      return indiaPostalRegex.test(code);
    }

    if (country === "United States") {
      const usPostalRegex = /^\d{5}(-\d{4})?$/;
      return usPostalRegex.test(code);
    }

    return code.length >= 3 && code.length <= 10;
  };

  // Update profile
  const handleProfileSubmit = async (e) => {
    e.preventDefault();

    if (!profileForm.first_name.trim()) {
      toast.error("First name is required");
      return;
    }

    if (!profileForm.last_name.trim()) {
      toast.error("Last name is required");
      return;
    }

    if (!profileForm.phone.trim()) {
      toast.error("Phone number is required");
      return;
    }

    if (!validatePhone(profileForm.phone)) {
      toast.error("Please enter a valid phone number");
      return;
    }

    try {
      setIsLoading(true);

      const response = await axios.post(
        `${backendUrl}/user/update-profile`,
        {
          first_name: profileForm.first_name.trim(),
          last_name: profileForm.last_name.trim(),
          phone: profileForm.phone.trim(),
        },
        { withCredentials: true }
      );

      if (response.data.success) {
        toast.success("Profile updated successfully!");

        const updatedUser = {
          ...profileData,
          first_name: response.data.user.first_name,
          last_name: response.data.user.last_name,
          phone: response.data.user.phone,
        };

        setProfileData(updatedUser);
        setUserData(updatedUser);
      }
    } catch (error) {
      console.error("❌ Error updating profile:", error);
      const errorMessage =
        error.response?.data?.message || "Failed to update profile";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle address submit - ADD THIS FUNCTION
  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!addressForm.first_name.trim()) {
      toast.error("First name is required");
      return;
    }
    
    if (!addressForm.last_name.trim()) {
      toast.error("Last name is required");
      return;
    }
    
    if (!addressForm.phone.trim()) {
      toast.error("Phone number is required");
      return;
    }
    
    if (!validatePhone(addressForm.phone)) {
      toast.error("Please enter a valid phone number");
      return;
    }
    
    if (!addressForm.address_line_1.trim()) {
      toast.error("Address line 1 is required");
      return;
    }
    
    if (!addressForm.city.trim()) {
      toast.error("City is required");
      return;
    }
    
    if (!addressForm.postal_code.trim()) {
      toast.error("Postal code is required");
      return;
    }
    
    if (!validatePostalCode(addressForm.postal_code, addressForm.country)) {
      toast.error("Please enter a valid postal code");
      return;
    }
    
    if (!addressForm.country) {
      toast.error("Country is required");
      return;
    }

    try {
      setIsLoading(true);

      const response = await axios.post(
        `${backendUrl}/user/addresses`, 
        {
          first_name: addressForm.first_name.trim(),
          last_name: addressForm.last_name.trim(),
          phone: addressForm.phone.trim(),
          address_line_1: addressForm.address_line_1.trim(),
          address_line_2: addressForm.address_line_2.trim(),
          city: addressForm.city.trim(),
          state: addressForm.state.trim(),
          postal_code: addressForm.postal_code.trim(),
          country: addressForm.country,
          is_primary: true
        },
        { withCredentials: true }
      );

      if (response.data.success) {
        toast.success("Address saved successfully!");
      }
    } catch (error) {
      console.error("❌ Error saving address:", error);
      const errorMessage = error.response?.data?.message || "Failed to save address";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Change password
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (
      !passwordForm.oldPassword ||
      !passwordForm.newPassword ||
      !passwordForm.confirmPassword
    ) {
      toast.error("Please fill in all password fields");
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      toast.error("New password must be at least 6 characters long");
      return;
    }

    try {
      setIsLoading(true);
      const response = await axios.put(
        `${backendUrl}/user/change-password`,
        {
          oldPassword: passwordForm.oldPassword,
          newPassword: passwordForm.newPassword,
        },
        { withCredentials: true }
      );

      if (response.data.success) {
        toast.success("Password changed successfully!");
        setPasswordForm({
          oldPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      }
    } catch (error) {
      console.error("❌ Error changing password:", error);
      toast.error(error.response?.data?.message || "Failed to change password");
    } finally {
      setIsLoading(false);
    }
  };

  // Delete account
  const handleDeleteAccount = async (e) => {
    e.preventDefault();

    if (!deleteForm.password) {
      toast.error("Please enter your password to confirm account deletion");
      return;
    }

    if (deleteForm.confirmText !== "DELETE") {
      toast.error("Please type 'DELETE' to confirm account deletion");
      return;
    }

    if (
      !window.confirm(
        "Are you absolutely sure you want to delete your account? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      setIsLoading(true);
      const response = await axios.delete(`${backendUrl}/user/delete-account`, {
        data: { password: deleteForm.password },
        withCredentials: true,
      });

      if (response.data.success) {
        toast.success(
          "Account deleted successfully. You will be redirected..."
        );

        setDeleteForm({ password: "", confirmText: "" });
        setUserData(null);

        setTimeout(() => {
          window.location.href = "/";
        }, 2000);
      }
    } catch (error) {
      console.error("❌ Error deleting account:", error);
      toast.error(error.response?.data?.message || "Failed to delete account");
    } finally {
      setIsLoading(false);
    }
  };

  // Send verification email
  const handleSendVerificationEmail = async () => {
    try {
      setIsLoading(true);
      const response = await axios.post(
        `${backendUrl}/auth/sendVerificationEmail`,
        {},
        { withCredentials: true }
      );

      if (response.data.success) {
        toast.success("Verification email sent! Please check your inbox.");
      }
    } catch (error) {
      console.error("❌ Error sending verification email:", error);
      toast.error(
        error.response?.data?.message || "Failed to send verification email"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (isLoading && !profileData.email) {
    return <MyAccountSkeleton />;
  }

  const tabsData = [
    { key: "profile", icon: "fas fa-user", label: "Profile", mobileLabel: "Info" },
    { key: "address", icon: "fas fa-map-marker-alt", label: "Address", mobileLabel: "Address" },
    { key: "security", icon: "fas fa-shield-alt", label: "Security", mobileLabel: "Password" },
    { key: "account", icon: "fas fa-cog", label: "Account", mobileLabel: "Settings" },
  ];

  return (
    <div className="min-h-screen bg-background text-text py-4 sm:py-8">
      <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-6">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-text mb-2">
            My Account
          </h1>
          <p className="text-text/70 text-sm sm:text-base">
            Manage your personal information, shipping address, and account
            settings
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 mb-6 sm:mb-8">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex overflow-x-auto px-3 sm:px-6">
              {tabsData.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex-shrink-0 py-3 sm:py-4 px-2 sm:px-1 border-b-2 font-medium text-xs sm:text-sm transition-colors mr-4 sm:mr-8 ${
                    activeTab === tab.key
                      ? "border-primary text-primary"
                      : "border-transparent text-text/70 hover:text-text hover:border-gray-300"
                  }`}
                >
                  <i className={`${tab.icon} mr-1 sm:mr-2`}></i>
                  <span className="hidden sm:inline">{tab.label}</span>
                  <span className="sm:hidden">{tab.mobileLabel}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="p-4 sm:p-6 lg:p-8">
            {/* Profile Tab */}
            {activeTab === "profile" && (
              <div>
                <h2 className="text-xl sm:text-2xl font-semibold text-text mb-4 sm:mb-6">
                  Personal Information
                </h2>

                {/* Account Overview */}
                <div className="bg-gradient-to-r from-primary/5 to-secondary/5 dark:from-primary/10 dark:to-secondary/10 rounded-lg sm:rounded-xl p-4 sm:p-6 mb-6 sm:mb-8 border border-primary/10 dark:border-primary/20">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    <div className="text-center sm:text-left">
                      <div className="text-xs sm:text-sm text-text/70 mb-1 sm:mb-2">
                        Account Status
                      </div>
                      <div className="flex items-center justify-center sm:justify-start">
                        <span
                          className={`inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${
                            profileData.isAccountVerified
                              ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400"
                              : "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400"
                          }`}
                        >
                          <i
                            className={`fas ${
                              profileData.isAccountVerified
                                ? "fa-check-circle"
                                : "fa-exclamation-triangle"
                            } mr-1 sm:mr-2`}
                          ></i>
                          {profileData.isAccountVerified
                            ? "Verified"
                            : "Unverified"}
                        </span>
                      </div>
                    </div>
                    <div className="text-center sm:text-left">
                      <div className="text-xs sm:text-sm text-text/70 mb-1 sm:mb-2">
                        Account Type
                      </div>
                      <div className="font-medium text-text capitalize text-sm sm:text-base">
                        <i className="fas fa-user mr-1 sm:mr-2 text-primary"></i>
                        {profileData.role || "Customer"}
                      </div>
                    </div>
                    <div className="text-center sm:text-left sm:col-span-2 lg:col-span-1">
                      <div className="text-xs sm:text-sm text-text/70 mb-1 sm:mb-2">
                        Member Since
                      </div>
                      <div className="font-medium text-text text-sm sm:text-base">
                        <i className="fas fa-calendar mr-1 sm:mr-2 text-primary"></i>
                        {formatDate(profileData.createdAt)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Profile Form */}
                <form
                  onSubmit={handleProfileSubmit}
                  className="space-y-4 sm:space-y-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                      <label className="block text-sm font-medium text-text mb-2">
                        First Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={profileForm.first_name}
                        onChange={(e) =>
                          handleProfileChange("first_name", e.target.value)
                        }
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-text transition-colors text-sm sm:text-base"
                        placeholder="Enter your first name"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text mb-2">
                        Last Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={profileForm.last_name}
                        onChange={(e) =>
                          handleProfileChange("last_name", e.target.value)
                        }
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-text transition-colors text-sm sm:text-base"
                        placeholder="Enter your last name"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        value={profileData.email}
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-700 text-text/50 cursor-not-allowed text-sm sm:text-base"
                        placeholder="Email cannot be changed"
                        disabled
                        readOnly
                      />
                      <i className="fas fa-lock absolute right-3 top-2.5 sm:top-3 text-text/40"></i>
                    </div>
                    <p className="mt-2 text-xs sm:text-sm text-text/70">
                      <i className="fas fa-info-circle mr-1"></i>
                      Email address cannot be changed for security reasons
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text mb-2">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      value={profileForm.phone}
                      onChange={(e) =>
                        handleProfileChange("phone", e.target.value)
                      }
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-text transition-colors text-sm sm:text-base"
                      placeholder="Enter your phone number"
                      required
                    />
                    <p className="mt-2 text-xs sm:text-sm text-text/70">
                      Example: +1234567890 or 1234567890
                    </p>
                  </div>

                  <div className="flex justify-end pt-4">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 sm:px-8 py-2 sm:py-3 rounded-lg font-medium flex items-center gap-2 transition-colors text-sm sm:text-base"
                    >
                      {isLoading && <i className="fas fa-spinner fa-spin"></i>}
                      <i className="fas fa-save"></i>
                      Update Profile
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Address Tab */}
            {activeTab === "address" && (
              <div>
                <h2 className="text-xl sm:text-2xl font-semibold text-text mb-4 sm:mb-6">
                  Shipping Address
                </h2>

                <form
                  onSubmit={handleAddressSubmit}
                  className="space-y-4 sm:space-y-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                      <label className="block text-sm font-medium text-text mb-2">
                        First Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={addressForm.first_name}
                        onChange={(e) =>
                          handleAddressChange("first_name", e.target.value)
                        }
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-text transition-colors text-sm sm:text-base"
                        placeholder="Enter first name"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text mb-2">
                        Last Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={addressForm.last_name}
                        onChange={(e) =>
                          handleAddressChange("last_name", e.target.value)
                        }
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-text transition-colors text-sm sm:text-base"
                        placeholder="Enter last name"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text mb-2">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      value={addressForm.phone}
                      onChange={(e) =>
                        handleAddressChange("phone", e.target.value)
                      }
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-text transition-colors text-sm sm:text-base"
                      placeholder="Enter phone number"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text mb-2">
                      Address Line 1 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={addressForm.address_line_1}
                      onChange={(e) =>
                        handleAddressChange("address_line_1", e.target.value)
                      }
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-text transition-colors text-sm sm:text-base"
                      placeholder="Street address, P.O. Box, company name"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text mb-2">
                      Address Line 2
                    </label>
                    <input
                      type="text"
                      value={addressForm.address_line_2}
                      onChange={(e) =>
                        handleAddressChange("address_line_2", e.target.value)
                      }
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-text transition-colors text-sm sm:text-base"
                      placeholder="Apartment, suite, unit, building, floor, etc."
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                      <label className="block text-sm font-medium text-text mb-2">
                        City <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={addressForm.city}
                        onChange={(e) =>
                          handleAddressChange("city", e.target.value)
                        }
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-text transition-colors text-sm sm:text-base"
                        placeholder="Enter city"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text mb-2">
                        State/Province
                      </label>
                      <input
                        type="text"
                        value={addressForm.state}
                        onChange={(e) =>
                          handleAddressChange("state", e.target.value)
                        }
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-text transition-colors text-sm sm:text-base"
                        placeholder="Enter state or province"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                      <label className="block text-sm font-medium text-text mb-2">
                        Postal Code <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={addressForm.postal_code}
                        onChange={(e) =>
                          handleAddressChange("postal_code", e.target.value)
                        }
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-text transition-colors text-sm sm:text-base"
                        placeholder="Enter postal code"
                        required
                      />
                      <p className="mt-2 text-xs sm:text-sm text-text/70">
                        {addressForm.country === "India" &&
                          "Example: 110001 (6 digits)"}
                        {addressForm.country === "United States" &&
                          "Example: 12345 or 12345-6789"}
                        {(!addressForm.country ||
                          (addressForm.country !== "India" &&
                            addressForm.country !== "United States")) &&
                          "Enter valid postal code"}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text mb-2">
                        Country <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={addressForm.country}
                        onChange={(e) =>
                          handleAddressChange("country", e.target.value)
                        }
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-text transition-colors text-sm sm:text-base"
                        required
                      >
                        <option value="">Select Country</option>
                        <option value="India">India</option>
                        <option value="United States">United States</option>
                        <option value="Canada">Canada</option>
                        <option value="United Kingdom">United Kingdom</option>
                        <option value="Australia">Australia</option>
                        <option value="Germany">Germany</option>
                        <option value="France">France</option>
                        <option value="Japan">Japan</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-end pt-4">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 sm:px-8 py-2 sm:py-3 rounded-lg font-medium flex items-center gap-2 transition-colors text-sm sm:text-base"
                    >
                      {isLoading && <i className="fas fa-spinner fa-spin"></i>}
                      <i className="fas fa-map-marker-alt"></i>
                      Save Address
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === "security" && (
              <div>
                <h2 className="text-xl sm:text-2xl font-semibold text-text mb-4 sm:mb-6">
                  Security Settings
                </h2>

                {/* Change Password Section */}
                <div className="mb-6 sm:mb-8">
                  <h3 className="text-lg font-medium text-text mb-4">
                    Change Password
                  </h3>

                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
                    <div className="flex items-start">
                      <i className="fas fa-shield-alt text-blue-500 mt-0.5 mr-2 sm:mr-3 text-sm sm:text-base"></i>
                      <div>
                        <h4 className="text-xs sm:text-sm font-medium text-blue-800 dark:text-blue-400 mb-2">
                          Password Security Tips
                        </h4>
                        <div className="text-xs sm:text-sm text-blue-700 dark:text-blue-300">
                          <ul className="list-disc list-inside space-y-1">
                            <li>Use at least 8 characters</li>
                            <li>Include uppercase and lowercase letters</li>
                            <li>Include numbers and special characters</li>
                            <li>Don't use personal information</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  <form
                    onSubmit={handlePasswordSubmit}
                    className="space-y-4 sm:space-y-6"
                  >
                    <div>
                      <label className="block text-sm font-medium text-text mb-2">
                        Current Password <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="password"
                        value={passwordForm.oldPassword}
                        onChange={(e) =>
                          handlePasswordChange("oldPassword", e.target.value)
                        }
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-text transition-colors text-sm sm:text-base"
                        placeholder="Enter your current password"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-text mb-2">
                        New Password <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="password"
                        value={passwordForm.newPassword}
                        onChange={(e) =>
                          handlePasswordChange("newPassword", e.target.value)
                        }
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-text transition-colors text-sm sm:text-base"
                        placeholder="Enter your new password"
                        minLength="6"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-text mb-2">
                        Confirm New Password{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="password"
                        value={passwordForm.confirmPassword}
                        onChange={(e) =>
                          handlePasswordChange(
                            "confirmPassword",
                            e.target.value
                          )
                        }
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-text transition-colors text-sm sm:text-base"
                        placeholder="Confirm your new password"
                        minLength="6"
                        required
                      />
                      {passwordForm.newPassword &&
                        passwordForm.confirmPassword &&
                        passwordForm.newPassword !==
                          passwordForm.confirmPassword && (
                          <p className="mt-2 text-xs sm:text-sm text-red-600 dark:text-red-400">
                            <i className="fas fa-exclamation-triangle mr-1"></i>
                            Passwords do not match
                          </p>
                        )}
                    </div>

                    <div className="flex justify-end">
                      <button
                        type="submit"
                        disabled={
                          isLoading ||
                          passwordForm.newPassword !==
                            passwordForm.confirmPassword
                        }
                        className="bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 sm:px-8 py-2 sm:py-3 rounded-lg font-medium flex items-center gap-2 transition-colors text-sm sm:text-base"
                      >
                        {isLoading && (
                          <i className="fas fa-spinner fa-spin"></i>
                        )}
                        <i className="fas fa-key"></i>
                        Change Password
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Account Tab */}
            {activeTab === "account" && (
              <div>
                <h2 className="text-xl sm:text-2xl font-semibold text-text mb-4 sm:mb-6">
                  Account Settings
                </h2>

                {/* Account Status */}
                <div className="mb-6 sm:mb-8">
                  <h3 className="text-lg font-medium text-text mb-4">
                    Account Status
                  </h3>

                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 sm:p-6 border border-gray-200 dark:border-gray-600">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-4">
                      <div className="flex items-center">
                        <div
                          className={`h-3 w-3 rounded-full mr-3 ${
                            profileData.status === "active"
                              ? "bg-green-500"
                              : profileData.status === "inactive"
                              ? "bg-yellow-500"
                              : "bg-red-500"
                          }`}
                        ></div>
                        <span className="text-base sm:text-lg font-medium text-text capitalize">
                          {profileData.status || "active"}
                        </span>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs sm:text-sm font-medium self-start sm:self-auto ${
                          profileData.status === "active"
                            ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400"
                            : "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400"
                        }`}
                      >
                        {profileData.status === "active"
                          ? "Active Account"
                          : "Inactive Account"}
                      </span>
                    </div>

                    <div className="space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <span className="text-sm font-medium text-text/70">
                          Email verification:
                        </span>
                        <div className="flex items-center gap-2">
                          {profileData.isAccountVerified ? (
                            <span className="text-green-600 dark:text-green-400 text-sm">
                              <i className="fas fa-check-circle mr-1"></i>
                              Verified
                            </span>
                          ) : (
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                              <span className="text-yellow-600 dark:text-yellow-400 text-sm">
                                <i className="fas fa-exclamation-triangle mr-1"></i>
                                Not verified
                              </span>
                              <button
                                onClick={handleSendVerificationEmail}
                                disabled={isLoading}
                                className="text-primary hover:text-primary/80 text-sm font-medium underline"
                              >
                                Send verification email
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <span className="text-sm font-medium text-text/70">
                          Account type:
                        </span>
                        <span className="text-sm text-text capitalize">
                          {profileData.role || "Customer"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {!profileData.isAccountVerified && (
                    <div className="mt-4">
                      <Link
                        to={`/verify-email?email=${profileData.email}`}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-primary hover:bg-primary/90 transition-colors"
                      >
                        <i className="fas fa-envelope-check mr-2"></i>
                        Verify Email Now
                      </Link>
                    </div>
                  )}
                </div>

                {/* Danger Zone - Delete Account */}
                <div className="border-t border-gray-200 dark:border-gray-700 pt-6 sm:pt-8">
                  <h3 className="text-lg font-medium text-red-600 dark:text-red-400 mb-4">
                    <i className="fas fa-exclamation-triangle mr-2"></i>
                    Danger Zone
                  </h3>

                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 sm:p-6 mb-4 sm:mb-6">
                    <div className="flex items-start">
                      <i className="fas fa-trash-alt text-red-500 mt-0.5 mr-2 sm:mr-3 text-sm sm:text-base"></i>
                      <div>
                        <h4 className="text-xs sm:text-sm font-medium text-red-800 dark:text-red-400 mb-2">
                          Delete Account Permanently
                        </h4>
                        <div className="text-xs sm:text-sm text-red-700 dark:text-red-300">
                          <ul className="list-disc list-inside space-y-1">
                            <li>
                              All your personal data will be permanently deleted
                            </li>
                            <li>Your order history will be lost</li>
                            <li>
                              You will lose access to your wishlist and saved
                              items
                            </li>
                            <li>This action cannot be reversed</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  <form
                    onSubmit={handleDeleteAccount}
                    className="space-y-4 sm:space-y-6"
                  >
                    <div>
                      <label className="block text-sm font-medium text-text mb-2">
                        Enter your password to confirm{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="password"
                        value={deleteForm.password}
                        onChange={(e) =>
                          handleDeleteChange("password", e.target.value)
                        }
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent bg-background text-text transition-colors text-sm sm:text-base"
                        placeholder="Enter your current password"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-text mb-2">
                        Type "DELETE" to confirm{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={deleteForm.confirmText}
                        onChange={(e) =>
                          handleDeleteChange("confirmText", e.target.value)
                        }
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent bg-background text-text transition-colors text-sm sm:text-base"
                        placeholder="Type DELETE to confirm"
                        required
                      />
                      {deleteForm.confirmText &&
                        deleteForm.confirmText !== "DELETE" && (
                          <p className="mt-2 text-xs sm:text-sm text-red-600 dark:text-red-400">
                            <i className="fas fa-exclamation-triangle mr-1"></i>
                            Please type "DELETE" exactly as shown
                          </p>
                        )}
                    </div>

                    <div className="flex justify-end">
                      <button
                        type="submit"
                        disabled={
                          isLoading ||
                          deleteForm.confirmText !== "DELETE" ||
                          !deleteForm.password
                        }
                        className="bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 sm:px-8 py-2 sm:py-3 rounded-lg font-medium flex items-center gap-2 transition-colors text-sm sm:text-base"
                      >
                        {isLoading && (
                          <i className="fas fa-spinner fa-spin"></i>
                        )}
                        <i className="fas fa-trash mr-1"></i>
                        Delete Account Permanently
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyAccount;