import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const API_BASE_URL =
  import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

function Settings() {
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
    createdAt: "",
  });

  // Profile form state (email readonly)
  const [profileForm, setProfileForm] = useState({
    first_name: "",
    last_name: "",
    phone: "",
  });

  // Address form state
  const [addressForm, setAddressForm] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    address_line_1: "",
    address_line_2: "",
    city: "",
    state: "",
    postal_code: "",
    country: "India",
  });

  // Password form state
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Delete account form state
  const [deleteForm, setDeleteForm] = useState({
    password: "",
    confirmText: "",
  });

  // Notification settings (simple toggles)
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    orderUpdates: true,
    productUpdates: true,
    inventoryAlerts: true,
    securityAlerts: true,
    marketingEmails: false,
    webNotifications: true,
  });

  // Load user profile data on component mount
  useEffect(() => {
    fetchUserData();
  }, []);

  // Fetch complete user data from backend
  const fetchUserData = async () => {
    try {
      setIsLoading(true);

      const response = await axios.post(
        `${API_BASE_URL}/auth/is-admin`,
        {},
        {
          withCredentials: true,
        }
      );

      if (response.data.success) {
        const user = response.data.user;

        setProfileData(user);

        // Set profile form data
        setProfileForm({
          first_name: user.first_name || "",
          last_name: user.last_name || "",
          phone: user.phone || "",
        });

        // Set address form data with user info
        setAddressForm((prev) => ({
          ...prev,
          first_name: user.first_name || "",
          last_name: user.last_name || "",
          phone: user.phone || "",
        }));

        // Fetch addresses after setting user data
        await fetchUserAddresses();
      }
    } catch (error) {
      console.error("Error fetching user data:", error);

      if (error.response?.status === 401 || error.response?.status === 403) {
        const frontendUrl =
          import.meta.env.VITE_FRONTEND_URL || "http://localhost:5173";
        window.location.href = `${frontendUrl}/login?type=admin`;
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
      const response = await axios.get(`${API_BASE_URL}/user/addresses`, {
        withCredentials: true,
      });

      if (response.data.success && response.data.addresses.length > 0) {
        // Get the primary address or the first address
        const primaryAddress =
          response.data.addresses.find((addr) => addr.is_primary) ||
          response.data.addresses[0];

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

  // Handle address form changes
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

  // Handle notification changes
  const handleNotificationChange = (field, value) => {
    setNotificationSettings((prev) => ({ ...prev, [field]: value }));
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
        `${API_BASE_URL}/user/update-profile`,
        {
          first_name: profileForm.first_name.trim(),
          last_name: profileForm.last_name.trim(),
          phone: profileForm.phone.trim(),
        },
        { withCredentials: true }
      );

      if (response.data.success) {
        toast.success("Profile updated successfully!");
        setProfileData((prev) => ({
          ...prev,
          first_name: response.data.user.first_name,
          last_name: response.data.user.last_name,
          phone: response.data.user.phone,
        }));
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      const errorMessage =
        error.response?.data?.message || "Failed to update profile";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle address submit
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
        `${API_BASE_URL}/user/addresses`,
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
          is_primary: true,
        },
        { withCredentials: true }
      );

      if (response.data.success) {
        toast.success("Address saved successfully!");
      }
    } catch (error) {
      console.error("Error saving address:", error);
      const errorMessage =
        error.response?.data?.message || "Failed to save address";
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
        `${API_BASE_URL}/user/change-password`,
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
      console.error("Error changing password:", error);
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
      const response = await axios.delete(
        `${API_BASE_URL}/user/delete-account`,
        {
          data: { password: deleteForm.password },
          withCredentials: true,
        }
      );

      if (response.data.success) {
        toast.success(
          "Account deleted successfully. You will be redirected..."
        );

        setDeleteForm({ password: "", confirmText: "" });

        setTimeout(() => {
          window.location.href = "/login";
        }, 2000);
      }
    } catch (error) {
      console.error("Error deleting account:", error);
      toast.error(error.response?.data?.message || "Failed to delete account");
    } finally {
      setIsLoading(false);
    }
  };

  // Save notification settings
  const handleNotificationSubmit = async (e) => {
    e.preventDefault();

    toast.success("Notification preferences saved!");
    console.log("Notification settings:", notificationSettings);
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
    return (
      <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <i className="fas fa-spinner fa-spin text-4xl text-primary mb-4"></i>
          <p className="text-gray-600 dark:text-gray-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Admin Settings
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your admin account settings and preferences
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md mb-6">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex space-x-8 px-6">
              {[
                { key: "profile", icon: "fas fa-user", label: "Profile" },
                {
                  key: "address",
                  icon: "fas fa-map-marker-alt",
                  label: "Address",
                },
                {
                  key: "security",
                  icon: "fas fa-shield-alt",
                  label: "Security",
                },
                {
                  key: "notifications",
                  icon: "fas fa-bell",
                  label: "Notifications",
                },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.key
                      ? "border-primary text-primary"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <i className={`${tab.icon} mr-2`}></i>
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <div className="p-6">
            {/* Profile Tab */}
            {activeTab === "profile" && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                  Profile Information
                </h2>

                {/* Account Overview */}
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        Account Status
                      </div>
                      <div className="flex items-center mt-1">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            profileData.isAccountVerified
                              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                              : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                          }`}
                        >
                          <i
                            className={`fas ${
                              profileData.isAccountVerified
                                ? "fa-check-circle"
                                : "fa-exclamation-triangle"
                            } mr-1`}
                          ></i>
                          {profileData.isAccountVerified
                            ? "Verified"
                            : "Unverified"}
                        </span>
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        Role
                      </div>
                      <div className="font-medium text-gray-900 dark:text-white capitalize mt-1">
                        {profileData.role || "N/A"}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        Member Since
                      </div>
                      <div className="font-medium text-gray-900 dark:text-white mt-1">
                        {formatDate(profileData.createdAt)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Profile Form */}
                <form onSubmit={handleProfileSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        First Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={profileForm.first_name}
                        onChange={(e) =>
                          handleProfileChange("first_name", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white"
                        placeholder="Enter your first name"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Last Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={profileForm.last_name}
                        onChange={(e) =>
                          handleProfileChange("last_name", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white"
                        placeholder="Enter your last name"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={profileData.email}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-100 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                      placeholder="Email cannot be changed"
                      disabled
                      readOnly
                    />
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      Email address cannot be changed for security reasons
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      value={profileForm.phone}
                      onChange={(e) =>
                        handleProfileChange("phone", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white"
                      placeholder="Enter your phone number"
                      required
                    />
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      Example: +1234567890 or 1234567890
                    </p>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="bg-primary hover:bg-primary/90 disabled:opacity-50 text-white px-6 py-2 rounded-md flex items-center gap-2"
                    >
                      {isLoading && <i className="fas fa-spinner fa-spin"></i>}
                      Update Profile
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Address Tab */}
            {activeTab === "address" && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                  Address Information
                </h2>

                <form onSubmit={handleAddressSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        First Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={addressForm.first_name}
                        onChange={(e) =>
                          handleAddressChange("first_name", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white"
                        placeholder="Enter first name"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Last Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={addressForm.last_name}
                        onChange={(e) =>
                          handleAddressChange("last_name", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white"
                        placeholder="Enter last name"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      value={addressForm.phone}
                      onChange={(e) =>
                        handleAddressChange("phone", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white"
                      placeholder="Enter phone number"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Address Line 1 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={addressForm.address_line_1}
                      onChange={(e) =>
                        handleAddressChange("address_line_1", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white"
                      placeholder="Street address, P.O. Box, company name"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Address Line 2
                    </label>
                    <input
                      type="text"
                      value={addressForm.address_line_2}
                      onChange={(e) =>
                        handleAddressChange("address_line_2", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white"
                      placeholder="Apartment, suite, unit, building, floor, etc."
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        City <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={addressForm.city}
                        onChange={(e) =>
                          handleAddressChange("city", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white"
                        placeholder="Enter city"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        State/Province
                      </label>
                      <input
                        type="text"
                        value={addressForm.state}
                        onChange={(e) =>
                          handleAddressChange("state", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white"
                        placeholder="Enter state or province"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Postal Code <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={addressForm.postal_code}
                        onChange={(e) =>
                          handleAddressChange("postal_code", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white"
                        placeholder="Enter postal code"
                        required
                      />
                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
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
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Country <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={addressForm.country}
                        onChange={(e) =>
                          handleAddressChange("country", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white"
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

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="bg-primary hover:bg-primary/90 disabled:opacity-50 text-white px-6 py-2 rounded-md flex items-center gap-2"
                    >
                      {isLoading && <i className="fas fa-spinner fa-spin"></i>}
                      Save Address
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === "security" && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                  Security Settings
                </h2>

                {/* Change Password Section */}
                <div className="mb-8">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                    Change Password
                  </h3>

                  <form onSubmit={handlePasswordSubmit} className="space-y-6">
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
                      <div className="flex items-start">
                        <i className="fas fa-info-circle text-blue-500 mt-0.5 mr-3"></i>
                        <div>
                          <h3 className="text-sm font-medium text-blue-800 dark:text-blue-400">
                            Password Security Tips
                          </h3>
                          <div className="mt-2 text-sm text-blue-700 dark:text-blue-300">
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

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Current Password <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="password"
                        value={passwordForm.oldPassword}
                        onChange={(e) =>
                          handlePasswordChange("oldPassword", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white"
                        placeholder="Enter your current password"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        New Password <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="password"
                        value={passwordForm.newPassword}
                        onChange={(e) =>
                          handlePasswordChange("newPassword", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white"
                        placeholder="Enter your new password"
                        minLength="6"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
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
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white"
                        placeholder="Confirm your new password"
                        minLength="6"
                        required
                      />
                      {passwordForm.newPassword &&
                        passwordForm.confirmPassword &&
                        passwordForm.newPassword !==
                          passwordForm.confirmPassword && (
                          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
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
                        className="bg-primary hover:bg-primary/90 disabled:opacity-50 text-white px-6 py-2 rounded-md flex items-center gap-2"
                      >
                        {isLoading && (
                          <i className="fas fa-spinner fa-spin"></i>
                        )}
                        Change Password
                      </button>
                    </div>
                  </form>
                </div>

                {/* Delete Account Section */}
                <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
                  <h3 className="text-lg font-medium text-red-600 dark:text-red-400 mb-4">
                    Delete Account
                  </h3>

                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
                    <div className="flex items-start">
                      <i className="fas fa-exclamation-triangle text-red-500 mt-0.5 mr-3"></i>
                      <div>
                        <h4 className="text-sm font-medium text-red-800 dark:text-red-400">
                          Warning: This action cannot be undone
                        </h4>
                        <div className="mt-2 text-sm text-red-700 dark:text-red-300">
                          <ul className="list-disc list-inside space-y-1">
                            <li>All your data will be permanently deleted</li>
                            <li>You will lose access to all admin features</li>
                            <li>This action cannot be reversed</li>
                            <li>You will be logged out immediately</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  <form onSubmit={handleDeleteAccount} className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Enter your password to confirm{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="password"
                        value={deleteForm.password}
                        onChange={(e) =>
                          handleDeleteChange("password", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                        placeholder="Enter your current password"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Type "DELETE" to confirm{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={deleteForm.confirmText}
                        onChange={(e) =>
                          handleDeleteChange("confirmText", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                        placeholder="Type DELETE to confirm"
                        required
                      />
                      {deleteForm.confirmText &&
                        deleteForm.confirmText !== "DELETE" && (
                          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
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
                        className="bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white px-6 py-2 rounded-md flex items-center gap-2"
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

            {/* Notifications Tab */}
            {activeTab === "notifications" && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                  Notification Preferences
                </h2>

                <form onSubmit={handleNotificationSubmit} className="space-y-6">
                  <div className="space-y-4">
                    {[
                      {
                        key: "emailNotifications",
                        label: "Email Notifications",
                        desc: "Receive notifications via email",
                      },
                      {
                        key: "orderUpdates",
                        label: "Order Updates",
                        desc: "Get notified about new orders and status changes",
                      },
                      {
                        key: "productUpdates",
                        label: "Product Updates",
                        desc: "Receive alerts when products are added or modified",
                      },
                      {
                        key: "inventoryAlerts",
                        label: "Inventory Alerts",
                        desc: "Get notified about low stock and inventory issues",
                      },
                      {
                        key: "securityAlerts",
                        label: "Security Alerts",
                        desc: "Receive important security notifications",
                      },
                      {
                        key: "marketingEmails",
                        label: "Marketing Emails",
                        desc: "Receive promotional and marketing emails",
                      },
                      {
                        key: "webNotifications",
                        label: "Browser Notifications",
                        desc: "Show notifications in your browser",
                      },
                    ].map((notification) => (
                      <div
                        key={notification.key}
                        className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg"
                      >
                        <div className="flex-1">
                          <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                            {notification.label}
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {notification.desc}
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={notificationSettings[notification.key]}
                            onChange={(e) =>
                              handleNotificationChange(
                                notification.key,
                                e.target.checked
                              )
                            }
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 dark:peer-focus:ring-primary/30 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                        </label>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-md flex items-center gap-2"
                    >
                      Save Preferences
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;
