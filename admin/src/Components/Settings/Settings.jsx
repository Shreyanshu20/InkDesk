import React, { useState } from "react";

function Settings() {
  // State for tabs
  const [activeTab, setActiveTab] = useState("profile");

  // Profile settings
  const [profileSettings, setProfileSettings] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    avatar: "/images/avatar.png",
    jobTitle: "Store Manager",
    phone: "+1 (555) 123-4567",
    timezone: "UTC-5",
    language: "en",
    bio: "Experienced store manager with 5+ years in retail management.",
  });

  // Security settings
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorEnabled: false,
    lastPasswordChange: "2024-11-15",
    sessionTimeout: 30,
    loginNotifications: true,
    loginHistory: [
      {
        date: "2025-05-20 09:45:12",
        ip: "192.168.1.1",
        device: "Chrome / Windows",
      },
      {
        date: "2025-05-18 14:22:05",
        ip: "192.168.1.1",
        device: "Chrome / Windows",
      },
      {
        date: "2025-05-15 10:33:47",
        ip: "192.168.1.1",
        device: "Mobile / iOS",
      },
    ],
  });

  // Notification settings
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    orderUpdates: true,
    productUpdates: true,
    inventoryAlerts: true,
    securityAlerts: true,
    marketingEmails: false,
    webNotifications: true,
    pushNotifications: false,
  });

  // Billing settings
  const [billingSettings, setBillingSettings] = useState({
    plan: "Professional",
    billingCycle: "monthly",
    nextBillingDate: "2025-06-15",
    paymentMethod: "Visa ending in 4242",
    invoices: [
      {
        id: "INV-2022-001",
        date: "2025-05-15",
        amount: "$49.99",
        status: "Paid",
      },
      {
        id: "INV-2022-002",
        date: "2025-04-15",
        amount: "$49.99",
        status: "Paid",
      },
      {
        id: "INV-2022-003",
        date: "2025-03-15",
        amount: "$49.99",
        status: "Paid",
      },
    ],
  });

  // Handle form changes
  const handleChange = (section, field, value) => {
    switch (section) {
      case "profile":
        setProfileSettings((prev) => ({ ...prev, [field]: value }));
        break;
      case "security":
        setSecuritySettings((prev) => ({ ...prev, [field]: value }));
        break;
      case "notification":
        setNotificationSettings((prev) => ({ ...prev, [field]: value }));
        break;
      case "billing":
        setBillingSettings((prev) => ({ ...prev, [field]: value }));
        break;
      default:
        break;
    }
  };

  // Handle form submission
  const handleSubmit = (e, section, data) => {
    e.preventDefault();
    console.log(`Saving ${section} settings:`, data);
    // Show success message
    alert(
      `${
        section.charAt(0).toUpperCase() + section.slice(1)
      } settings updated successfully!`
    );
  };

  // Handle account deletion
  const handleDeleteAccount = () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone."
    );

    if (confirmed) {
      // In a real app, this would call an API to delete the account
      console.log("Account deletion requested");
      alert(
        "Your account has been scheduled for deletion. You will receive a confirmation email."
      );
    }
  };

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Account Settings
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Manage your account preferences and settings
          </p>
        </div>

        {/* Settings Navigation */}
        <div className="bg-white dark:bg-gray-800 rounded-md shadow-md overflow-hidden mb-6">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex overflow-x-auto">
              <button
                onClick={() => setActiveTab("profile")}
                className={`px-4 py-4 text-sm font-medium ${
                  activeTab === "profile"
                    ? "border-b-2 border-primary text-primary dark:text-primary-light"
                    : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                }`}
              >
                <i className="fas fa-user mr-2"></i>
                Profile
              </button>

              <button
                onClick={() => setActiveTab("security")}
                className={`px-4 py-4 text-sm font-medium ${
                  activeTab === "security"
                    ? "border-b-2 border-primary text-primary dark:text-primary-light"
                    : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                }`}
              >
                <i className="fas fa-shield-alt mr-2"></i>
                Security
              </button>

              <button
                onClick={() => setActiveTab("notification")}
                className={`px-4 py-4 text-sm font-medium ${
                  activeTab === "notification"
                    ? "border-b-2 border-primary text-primary dark:text-primary-light"
                    : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                }`}
              >
                <i className="fas fa-bell mr-2"></i>
                Notifications
              </button>

              <button
                onClick={() => setActiveTab("billing")}
                className={`px-4 py-4 text-sm font-medium ${
                  activeTab === "billing"
                    ? "border-b-2 border-primary text-primary dark:text-primary-light"
                    : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                }`}
              >
                <i className="fas fa-credit-card mr-2"></i>
                Billing
              </button>
            </nav>
          </div>
        </div>

        {/* Settings Content */}
        <div className="bg-white dark:bg-gray-800 rounded-md shadow-md overflow-hidden mb-6">
          <div className="p-6">
            {/* Profile Settings */}
            {activeTab === "profile" && (
              <div>
                <h2 className="text-xl font-medium text-gray-900 dark:text-white mb-4">
                  Profile Settings
                </h2>
                <form
                  onSubmit={(e) => handleSubmit(e, "profile", profileSettings)}
                >
                  <div className="flex mb-6">
                    <div className="mr-6">
                      <div className="relative w-32 h-32 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-700">
                        {profileSettings.avatar ? (
                          <img
                            src={profileSettings.avatar}
                            alt="Profile"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full text-gray-400">
                            <i className="fas fa-user text-4xl"></i>
                          </div>
                        )}
                      </div>
                      <div className="mt-2 flex justify-center">
                        <button
                          type="button"
                          className="text-xs text-primary hover:text-primary-dark dark:text-primary-light"
                        >
                          <i className="fas fa-camera mr-1"></i> Change
                        </button>
                      </div>
                    </div>

                    <div className="flex-1">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label
                            htmlFor="name"
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                          >
                            Name
                          </label>
                          <input
                            type="text"
                            id="name"
                            value={profileSettings.name}
                            onChange={(e) =>
                              handleChange("profile", "name", e.target.value)
                            }
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                          />
                        </div>

                        <div>
                          <label
                            htmlFor="email"
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                          >
                            Email
                          </label>
                          <input
                            type="email"
                            id="email"
                            value={profileSettings.email}
                            onChange={(e) =>
                              handleChange("profile", "email", e.target.value)
                            }
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label
                        htmlFor="phone"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                      >
                        Phone
                      </label>
                      <input
                        type="text"
                        id="phone"
                        value={profileSettings.phone}
                        onChange={(e) =>
                          handleChange("profile", "phone", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="jobTitle"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                      >
                        Job Title
                      </label>
                      <input
                        type="text"
                        id="jobTitle"
                        value={profileSettings.jobTitle}
                        onChange={(e) =>
                          handleChange("profile", "jobTitle", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="timezone"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                      >
                        Timezone
                      </label>
                      <select
                        id="timezone"
                        value={profileSettings.timezone}
                        onChange={(e) =>
                          handleChange("profile", "timezone", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                      >
                        <option value="UTC-8">Pacific Time (UTC-8)</option>
                        <option value="UTC-7">Mountain Time (UTC-7)</option>
                        <option value="UTC-6">Central Time (UTC-6)</option>
                        <option value="UTC-5">Eastern Time (UTC-5)</option>
                        <option value="UTC-4">Atlantic Time (UTC-4)</option>
                        <option value="UTC">Greenwich Mean Time (UTC)</option>
                        <option value="UTC+1">
                          Central European Time (UTC+1)
                        </option>
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="language"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                      >
                        Language
                      </label>
                      <select
                        id="language"
                        value={profileSettings.language}
                        onChange={(e) =>
                          handleChange("profile", "language", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                      >
                        <option value="en">English</option>
                        <option value="es">Spanish</option>
                        <option value="fr">French</option>
                        <option value="de">German</option>
                        <option value="pt">Portuguese</option>
                      </select>
                    </div>
                  </div>

                  <div className="mb-4">
                    <label
                      htmlFor="bio"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      Bio
                    </label>
                    <textarea
                      id="bio"
                      rows="3"
                      value={profileSettings.bio}
                      onChange={(e) =>
                        handleChange("profile", "bio", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                    ></textarea>
                  </div>

                  <div className="flex justify-end mt-6">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-md"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Security Settings */}
            {activeTab === "security" && (
              <div>
                <h2 className="text-xl font-medium text-gray-900 dark:text-white mb-4">
                  Security Settings
                </h2>
                <form
                  onSubmit={(e) =>
                    handleSubmit(e, "security", securitySettings)
                  }
                >
                  {/* Password Section */}
                  <div className="mb-6 border-b border-gray-200 dark:border-gray-700 pb-6">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                      Password
                    </h3>
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          Change Password
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          Last changed: {securitySettings.lastPasswordChange}
                        </div>
                      </div>
                      <button
                        type="button"
                        className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-md text-sm"
                      >
                        Change Password
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="sessionTimeout"
                          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                        >
                          Session Timeout (minutes)
                        </label>
                        <input
                          type="number"
                          id="sessionTimeout"
                          min="5"
                          max="120"
                          value={securitySettings.sessionTimeout}
                          onChange={(e) =>
                            handleChange(
                              "security",
                              "sessionTimeout",
                              parseInt(e.target.value)
                            )
                          }
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                        />
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="loginNotifications"
                          checked={securitySettings.loginNotifications}
                          onChange={(e) =>
                            handleChange(
                              "security",
                              "loginNotifications",
                              e.target.checked
                            )
                          }
                          className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                        />
                        <label
                          htmlFor="loginNotifications"
                          className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
                        >
                          Get notified of new login attempts
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Two-Factor Authentication */}
                  <div className="mb-6 border-b border-gray-200 dark:border-gray-700 pb-6">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        Two-Factor Authentication
                      </h3>
                      <div className="relative inline-block w-10 mr-2 align-middle select-none">
                        <input
                          type="checkbox"
                          id="twoFactorEnabled"
                          checked={securitySettings.twoFactorEnabled}
                          onChange={(e) =>
                            handleChange(
                              "security",
                              "twoFactorEnabled",
                              e.target.checked
                            )
                          }
                          className="sr-only"
                        />
                        <label
                          htmlFor="twoFactorEnabled"
                          className={`${
                            securitySettings.twoFactorEnabled
                              ? "bg-primary"
                              : "bg-gray-300 dark:bg-gray-600"
                          } absolute block w-10 h-6 rounded-full cursor-pointer transition-colors duration-200`}
                        >
                          <span
                            className={`${
                              securitySettings.twoFactorEnabled
                                ? "translate-x-4"
                                : "translate-x-0"
                            } inline-block w-6 h-6 transform bg-white rounded-full shadow-md transition-transform duration-200`}
                          ></span>
                        </label>
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                      Add an extra layer of security to your account by
                      requiring a verification code in addition to your
                      password.
                    </p>
                    {securitySettings.twoFactorEnabled ? (
                      <button
                        type="button"
                        className="px-3 py-1.5 bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-900/50 text-red-800 dark:text-red-400 rounded-md text-sm"
                      >
                        Disable Two-Factor Authentication
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="px-3 py-1.5 bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 text-blue-800 dark:text-blue-400 rounded-md text-sm"
                      >
                        Set Up Two-Factor Authentication
                      </button>
                    )}
                  </div>

                  {/* Login History */}
                  <div className="mb-6">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                      Recent Login Activity
                    </h3>
                    <div className="overflow-hidden rounded-md border border-gray-200 dark:border-gray-700">
                      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-750">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              Date & Time
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              IP Address
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              Device
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                          {securitySettings.loginHistory.map((login, index) => (
                            <tr key={index}>
                              <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                                {login.date}
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                                {login.ip}
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                                {login.device}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="flex justify-end mt-6">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-md"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Notification Settings */}
            {activeTab === "notification" && (
              <div>
                <h2 className="text-xl font-medium text-gray-900 dark:text-white mb-4">
                  Notification Settings
                </h2>
                <form
                  onSubmit={(e) =>
                    handleSubmit(e, "notification", notificationSettings)
                  }
                >
                  <div className="mb-6 border-b border-gray-200 dark:border-gray-700 pb-6">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        Email Notifications
                      </h3>
                      <div className="relative inline-block w-10 mr-2 align-middle select-none">
                        <input
                          type="checkbox"
                          id="emailNotifications"
                          checked={notificationSettings.emailNotifications}
                          onChange={(e) =>
                            handleChange(
                              "notification",
                              "emailNotifications",
                              e.target.checked
                            )
                          }
                          className="sr-only"
                        />
                        <label
                          htmlFor="emailNotifications"
                          className={`${
                            notificationSettings.emailNotifications
                              ? "bg-primary"
                              : "bg-gray-300 dark:bg-gray-600"
                          } absolute block w-10 h-6 rounded-full cursor-pointer transition-colors duration-200`}
                        >
                          <span
                            className={`${
                              notificationSettings.emailNotifications
                                ? "translate-x-4"
                                : "translate-x-0"
                            } inline-block w-6 h-6 transform bg-white rounded-full shadow-md transition-transform duration-200`}
                          ></span>
                        </label>
                      </div>
                    </div>

                    {notificationSettings.emailNotifications && (
                      <div className="pl-6 border-l-2 border-gray-100 dark:border-gray-700 space-y-3 mt-4">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="orderUpdates"
                            checked={notificationSettings.orderUpdates}
                            onChange={(e) =>
                              handleChange(
                                "notification",
                                "orderUpdates",
                                e.target.checked
                              )
                            }
                            className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                          />
                          <label
                            htmlFor="orderUpdates"
                            className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
                          >
                            Order updates and confirmations
                          </label>
                        </div>

                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="productUpdates"
                            checked={notificationSettings.productUpdates}
                            onChange={(e) =>
                              handleChange(
                                "notification",
                                "productUpdates",
                                e.target.checked
                              )
                            }
                            className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                          />
                          <label
                            htmlFor="productUpdates"
                            className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
                          >
                            Product updates and changes
                          </label>
                        </div>

                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="inventoryAlerts"
                            checked={notificationSettings.inventoryAlerts}
                            onChange={(e) =>
                              handleChange(
                                "notification",
                                "inventoryAlerts",
                                e.target.checked
                              )
                            }
                            className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                          />
                          <label
                            htmlFor="inventoryAlerts"
                            className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
                          >
                            Inventory alerts
                          </label>
                        </div>

                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="securityAlerts"
                            checked={notificationSettings.securityAlerts}
                            onChange={(e) =>
                              handleChange(
                                "notification",
                                "securityAlerts",
                                e.target.checked
                              )
                            }
                            className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                          />
                          <label
                            htmlFor="securityAlerts"
                            className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
                          >
                            Security alerts and warnings
                          </label>
                        </div>

                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="marketingEmails"
                            checked={notificationSettings.marketingEmails}
                            onChange={(e) =>
                              handleChange(
                                "notification",
                                "marketingEmails",
                                e.target.checked
                              )
                            }
                            className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                          />
                          <label
                            htmlFor="marketingEmails"
                            className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
                          >
                            Marketing and promotional emails
                          </label>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="mb-6 border-b border-gray-200 dark:border-gray-700 pb-6">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        Browser Notifications
                      </h3>
                      <div className="relative inline-block w-10 mr-2 align-middle select-none">
                        <input
                          type="checkbox"
                          id="webNotifications"
                          checked={notificationSettings.webNotifications}
                          onChange={(e) =>
                            handleChange(
                              "notification",
                              "webNotifications",
                              e.target.checked
                            )
                          }
                          className="sr-only"
                        />
                        <label
                          htmlFor="webNotifications"
                          className={`${
                            notificationSettings.webNotifications
                              ? "bg-primary"
                              : "bg-gray-300 dark:bg-gray-600"
                          } absolute block w-10 h-6 rounded-full cursor-pointer transition-colors duration-200`}
                        >
                          <span
                            className={`${
                              notificationSettings.webNotifications
                                ? "translate-x-4"
                                : "translate-x-0"
                            } inline-block w-6 h-6 transform bg-white rounded-full shadow-md transition-transform duration-200`}
                          ></span>
                        </label>
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                      Receive notifications directly in your browser when you're
                      using the app.
                    </p>
                    {notificationSettings.webNotifications && (
                      <button
                        type="button"
                        className="px-3 py-1.5 bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 text-blue-800 dark:text-blue-400 rounded-md text-sm"
                      >
                        Test Browser Notification
                      </button>
                    )}
                  </div>

                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        Mobile Push Notifications
                      </h3>
                      <div className="relative inline-block w-10 mr-2 align-middle select-none">
                        <input
                          type="checkbox"
                          id="pushNotifications"
                          checked={notificationSettings.pushNotifications}
                          onChange={(e) =>
                            handleChange(
                              "notification",
                              "pushNotifications",
                              e.target.checked
                            )
                          }
                          className="sr-only"
                        />
                        <label
                          htmlFor="pushNotifications"
                          className={`${
                            notificationSettings.pushNotifications
                              ? "bg-primary"
                              : "bg-gray-300 dark:bg-gray-600"
                          } absolute block w-10 h-6 rounded-full cursor-pointer transition-colors duration-200`}
                        >
                          <span
                            className={`${
                              notificationSettings.pushNotifications
                                ? "translate-x-4"
                                : "translate-x-0"
                            } inline-block w-6 h-6 transform bg-white rounded-full shadow-md transition-transform duration-200`}
                          ></span>
                        </label>
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Receive push notifications on your mobile device when
                      you're not using the app.
                    </p>
                  </div>

                  <div className="flex justify-end mt-6">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-md"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Billing Settings */}
            {activeTab === "billing" && (
              <div>
                <h2 className="text-xl font-medium text-gray-900 dark:text-white mb-4">
                  Billing Settings
                </h2>
                <form
                  onSubmit={(e) => handleSubmit(e, "billing", billingSettings)}
                >
                  <div className="mb-6 border-b border-gray-200 dark:border-gray-700 pb-6">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                      Current Plan
                    </h3>
                    <div className="bg-gray-50 dark:bg-gray-750 rounded-md p-4 mb-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">
                            {billingSettings.plan} Plan
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {billingSettings.billingCycle === "monthly"
                              ? "Billed monthly"
                              : "Billed annually"}
                          </div>
                        </div>
                        <div className="text-2xl font-bold text-gray-900 dark:text-white">
                          $49.99
                          <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                            /mo
                          </span>
                        </div>
                      </div>
                      <div className="mt-3 text-sm text-gray-500 dark:text-gray-400">
                        Next billing date: {billingSettings.nextBillingDate}
                      </div>
                    </div>
                    <div className="flex space-x-3">
                      <button
                        type="button"
                        className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-md text-sm"
                      >
                        Change Plan
                      </button>
                      <button
                        type="button"
                        className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-md text-sm"
                      >
                        Cancel Subscription
                      </button>
                    </div>
                  </div>

                  <div className="mb-6 border-b border-gray-200 dark:border-gray-700 pb-6">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                      Payment Method
                    </h3>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center">
                        <div className="rounded-md bg-gray-100 dark:bg-gray-700 p-2 mr-3">
                          <i className="fas fa-credit-card text-gray-500 dark:text-gray-400"></i>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {billingSettings.paymentMethod}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            Expires 12/2026
                          </div>
                        </div>
                      </div>
                      <button
                        type="button"
                        className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-md text-sm"
                      >
                        Update
                      </button>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                      Billing History
                    </h3>
                    <div className="overflow-hidden rounded-md border border-gray-200 dark:border-gray-700">
                      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-750">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              Invoice
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              Date
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              Amount
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              Status
                            </th>
                            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                          {billingSettings.invoices.map((invoice, index) => (
                            <tr key={index}>
                              <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                                {invoice.id}
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                                {invoice.date}
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                                {invoice.amount}
                              </td>
                              <td className="px-4 py-3 text-sm">
                                <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                                  {invoice.status}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-sm text-right">
                                <button
                                  type="button"
                                  className="text-primary hover:text-primary-dark dark:text-primary-light text-sm"
                                >
                                  Download
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>

        {/* Account Deletion Section - Only show on profile tab */}
        {activeTab === "profile" && (
          <div className="bg-white dark:bg-gray-800 rounded-md shadow-md overflow-hidden mt-6">
            <div className="p-6">
              <h2 className="text-xl font-medium text-red-600 dark:text-red-500 mb-2">
                Delete Account
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Once you delete your account, there is no going back. All of
                your data will be permanently removed.
              </p>
              <button
                type="button"
                onClick={handleDeleteAccount}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md"
              >
                Delete Account
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Settings;
