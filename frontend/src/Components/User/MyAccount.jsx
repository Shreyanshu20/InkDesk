import React, { useState, useEffect, useContext, useRef } from "react";
import { AppContent } from "../../Context/AppContent.jsx";
import axios from "axios";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

function MyAccount() {
  const { userData, setUserData, backendUrl } = useContext(AppContent);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [addressSaving, setAddressSaving] = useState(false);
  const [activeSection, setActiveSection] = useState("profile");

  // Refs for scrolling to sections
  const profileRef = useRef(null);
  const addressRef = useRef(null);
  const statusRef = useRef(null);
  const passwordRef = useRef(null);

  // Form state
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    address_line1: "",
    address_line2: "",
    city: "",
    state: "",
    postal_code: "",
    country: "",
  });

  // Load user data into form
  useEffect(() => {
    if (userData) {
      console.log("User data received:", userData);
      console.log("Phone value:", userData.phone);

      setFormData({
        first_name: userData.first_name || "",
        last_name: userData.last_name || "",
        email: userData.email || "",
        phone: userData.phone || "",
        address_line1: userData.address_line1 || "",
        address_line2: userData.address_line2 || "",
        city: userData.city || "",
        state: userData.state || "",
        postal_code: userData.postal_code || "",
        country: userData.country || "",
      });
      setLoading(false);
    }
  }, [userData]);

  const scrollToSection = (ref, sectionId) => {
    setActiveSection(sectionId);

    if (ref.current) {
      const navbarHeight = window.innerWidth < 768 ? 60 : 80;
      const yOffset = -navbarHeight - 50;
      const y =
        ref.current.getBoundingClientRect().top + window.pageYOffset + yOffset;

      window.scrollTo({
        top: y,
        behavior: "smooth",
      });

      setTimeout(() => {
        window.dispatchEvent(new CustomEvent("scroll"));
      }, 100);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      handleScroll();
    }, 100);

    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200;

      if (
        !profileRef.current ||
        !addressRef.current ||
        !statusRef.current ||
        !passwordRef.current
      ) {
        return;
      }

      const sections = [
        { id: "profile", position: profileRef.current.offsetTop },
        { id: "address", position: addressRef.current.offsetTop },
        { id: "status", position: statusRef.current.offsetTop },
        { id: "password", position: passwordRef.current.offsetTop },
      ];

      // Sort sections by position (this ensures we get the correct section regardless of DOM order)
      sections.sort((a, b) => a.position - b.position);

      // Find the current active section (the last section that's above the current scroll position)
      let currentSection = sections[0].id;

      for (let i = 0; i < sections.length; i++) {
        if (scrollPosition >= sections[i].position) {
          currentSection = sections[i].id;
        } else {
          break; // Stop once we find a section below the scroll position
        }
      }

      setActiveSection(currentSection);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [
    profileRef.current,
    addressRef.current,
    statusRef.current,
    passwordRef.current,
  ]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Add the backendUrl prefix and use POST instead of PUT to match your route
      const response = await axios.post(
        `${backendUrl}/auth/update-profile`,
        formData,
        { withCredentials: true }
      );

      if (response.data.success) {
        setUserData({
          ...userData,
          ...formData,
        });
        toast.success("Profile updated successfully");
      } else {
        toast.error(response.data.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Profile update error:", error);
      toast.error(
        error.response?.data?.message ||
          "An error occurred while updating your profile"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleAddressSubmit = async (e) => {
    e.preventDefault();

    // Validate required address fields
    if (!formData.address_line1) {
      toast.error("Address Line 1 is required");
      return;
    }

    if (!formData.city) {
      toast.error("City is required");
      return;
    }

    if (!formData.postal_code) {
      toast.error("Postal Code is required");
      return;
    }

    if (!formData.country) {
      toast.error("Country is required");
      return;
    }

    setAddressSaving(true);

    const addressData = {
      address_line1: formData.address_line1,
      address_line2: formData.address_line2,
      city: formData.city,
      state: formData.state,
      postal_code: formData.postal_code,
      country: formData.country,
    };

    try {
      const response = await axios.post(
        `${backendUrl}/auth/update-address`,
        addressData,
        { withCredentials: true }
      );

      if (response.data.success) {
        // Update the userData in context to reflect the changes
        setUserData({
          ...userData,
          ...addressData,
        });
        toast.success("Shipping address updated successfully");
      } else {
        toast.error(
          response.data.message || "Failed to update shipping address"
        );
      }
    } catch (error) {
      console.error("Address update error:", error);
      toast.error(
        error.response?.data?.message ||
          "An error occurred while updating your shipping address"
      );
    } finally {
      setAddressSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <aside className="md:w-64 flex-shrink-0">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 sticky top-24">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              My Account
            </h2>
            <nav className="space-y-1">
              <button
                onClick={() => scrollToSection(profileRef, "profile")}
                className={`flex items-center w-full px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeSection === "profile"
                    ? "bg-primary text-white"
                    : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                <i className="fas fa-user mr-3 w-5 text-center"></i>
                <span>Personal Info</span>
              </button>

              <button
                onClick={() => scrollToSection(addressRef, "address")}
                className={`flex items-center w-full px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeSection === "address"
                    ? "bg-primary text-white"
                    : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                <i className="fas fa-map-marker-alt mr-3 w-5 text-center"></i>
                <span>Shipping Address</span>
              </button>

              <button
                onClick={() => scrollToSection(statusRef, "status")}
                className={`flex items-center w-full px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeSection === "status"
                    ? "bg-primary text-white"
                    : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                <i className="fas fa-shield-alt mr-3 w-5 text-center"></i>
                <span>Account Status</span>
              </button>

              <button
                onClick={() => scrollToSection(passwordRef, "password")}
                className={`flex items-center w-full px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeSection === "password"
                    ? "bg-primary text-white"
                    : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                <i className="fas fa-lock mr-3 w-5 text-center"></i>
                <span>Security</span>
              </button>
            </nav>
          </div>
        </aside>

        {/* Main content */}
        <div className="flex-1">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-10">
            {/* Personal Info Section */}
            <div ref={profileRef}>
              <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Personal Information
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="first_name"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      First Name
                    </label>
                    <input
                      type="text"
                      name="first_name"
                      id="first_name"
                      value={formData.first_name}
                      onChange={handleChange}
                      className="mt-1 p-2 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-gray-100 text-text dark:bg-gray-700 dark:text-white shadow-sm focus:border-primary focus:ring-primary"
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="last_name"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="last_name"
                      id="last_name"
                      value={formData.last_name}
                      onChange={handleChange}
                      className="mt-1 p-2 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-gray-100 text-text dark:bg-gray-700 dark:text-white shadow-sm focus:border-primary focus:ring-primary"
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="mt-1 p-2 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-gray-100 text-text dark:bg-gray-700 dark:text-white shadow-sm focus:border-primary focus:ring-primary"
                      required
                      disabled
                    />
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      Email cannot be changed
                    </p>
                  </div>

                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      id="phone"
                      value={formData.phone || ""} // This ensures an empty string if phone is null/undefined
                      onChange={handleChange}
                      className="mt-1 p-2 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-gray-100 text-text dark:bg-gray-700 dark:text-white shadow-sm focus:border-primary focus:ring-primary"
                      placeholder="12345 67890"
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {saving ? (
                      <i className="fas fa-spinner fa-spin mr-2"></i>
                    ) : null}
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            </div>

            {/* Shipping Address Section */}
            <div
              ref={addressRef}
              className="pt-6 mt-6 border-t border-gray-200 dark:border-gray-700"
            >
              <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Shipping Address
              </h2>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleAddressSubmit(e);
                }}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="address_line1"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Address Line 1
                    </label>
                    <input
                      type="text"
                      name="address_line1"
                      id="address_line1"
                      value={formData.address_line1 || ""}
                      onChange={handleChange}
                      className="mt-1 p-2 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-gray-100 text-text dark:bg-gray-700 dark:text-white shadow-sm focus:border-primary focus:ring-primary"
                      placeholder="Street address or P.O. Box"
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="address_line2"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Address Line 2
                    </label>
                    <input
                      type="text"
                      name="address_line2"
                      id="address_line2"
                      value={formData.address_line2 || ""}
                      onChange={handleChange}
                      className="mt-1 p-2 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-gray-100 text-text dark:bg-gray-700 dark:text-white shadow-sm focus:border-primary focus:ring-primary"
                      placeholder="Apt, suite, unit, building, floor, etc."
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="city"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      City
                    </label>
                    <input
                      type="text"
                      name="city"
                      id="city"
                      value={formData.city || ""}
                      onChange={handleChange}
                      className="mt-1 p-2 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-gray-100 text-text dark:bg-gray-700 dark:text-white shadow-sm focus:border-primary focus:ring-primary"
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="state"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      State/Province
                    </label>
                    <input
                      type="text"
                      name="state"
                      id="state"
                      value={formData.state || ""}
                      onChange={handleChange}
                      className="mt-1 p-2 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-gray-100 text-text dark:bg-gray-700 dark:text-white shadow-sm focus:border-primary focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="postal_code"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Postal Code
                    </label>
                    <input
                      type="text"
                      name="postal_code"
                      id="postal_code"
                      value={formData.postal_code || ""}
                      onChange={handleChange}
                      className="mt-1 p-2 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-gray-100 text-text dark:bg-gray-700 dark:text-white shadow-sm focus:border-primary focus:ring-primary"
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="country"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Country
                    </label>
                    <select
                      name="country"
                      id="country"
                      value={formData.country || ""}
                      onChange={handleChange}
                      className="mt-1 p-2 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-gray-100 text-text dark:bg-gray-700 dark:text-white shadow-sm focus:border-primary focus:ring-primary"
                      required
                    >
                      <option value="">Select a country</option>
                      <option value="US">United States</option>
                      <option value="CA">Canada</option>
                      <option value="UK">United Kingdom</option>
                      <option value="AU">Australia</option>
                      <option value="IN">India</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={addressSaving}
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {addressSaving ? (
                      <i className="fas fa-spinner fa-spin mr-2"></i>
                    ) : null}
                    {addressSaving ? "Saving..." : "Save Address"}
                  </button>
                </div>
              </form>
            </div>

            {/* Account Status Section */}
            <div
              ref={statusRef}
              className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700"
            >
              <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex justify-between items-center">
                <span>Account Status</span>
                {!userData.isAccountVerified && (
                  <Link
                    to={`/verify-email?email=${userData.email}`}
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                  >
                    Verify Email
                  </Link>
                )}
              </h2>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-md p-4">
                <div className="flex items-center">
                  <div
                    className={`h-3 w-3 rounded-full mr-2 ${
                      userData.status === "active"
                        ? "bg-green-500"
                        : userData.status === "inactive"
                        ? "bg-yellow-500"
                        : "bg-red-500"
                    }`}
                  ></div>
                  <p className="text-sm text-gray-700 dark:text-gray-300 capitalize">
                    {userData.status || "active"}
                  </p>
                </div>

                <div className="mt-4">
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    <span className="font-medium">Email verification:</span>{" "}
                    {userData.isAccountVerified ? (
                      <span className="text-green-600 dark:text-green-400">
                        Verified
                      </span>
                    ) : (
                      <span className="text-yellow-600 dark:text-yellow-400">
                        Not verified
                      </span>
                    )}
                  </p>
                  <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                    <span className="font-medium">Account type:</span>{" "}
                    <span>{userData.role}</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Password Section */}
            <div
              ref={passwordRef}
              className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-6"
            >
              <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Change Password
              </h2>

              <form
                onSubmit={async (e) => {
                  e.preventDefault();

                  // Get form data
                  const formData = new FormData(e.target);
                  const currentPassword = formData.get("currentPassword");
                  const newPassword = formData.get("newPassword");
                  const confirmPassword = formData.get("confirmPassword");

                  // Validate
                  if (!currentPassword || !newPassword || !confirmPassword) {
                    toast.error("All password fields are required");
                    return;
                  }

                  if (newPassword !== confirmPassword) {
                    toast.error("New passwords don't match");
                    return;
                  }

                  if (newPassword.length < 8) {
                    toast.error("Password must be at least 8 characters");
                    return;
                  }

                  try {
                    const response = await axios.put(
                      `${backendUrl}/auth/change-password`,
                      {
                        userId: userData.id,
                        oldPassword: currentPassword,
                        newPassword: newPassword,
                      },
                      { withCredentials: true }
                    );

                    if (response.data.success) {
                      toast.success("Password changed successfully");
                      e.target.reset();
                    } else {
                      toast.error(
                        response.data.message || "Failed to change password"
                      );
                    }
                  } catch (error) {
                    toast.error(
                      error.response?.data?.message || "Password change failed"
                    );
                    console.error("Password change error:", error);
                  }
                }}
                className="space-y-4"
              >
                <div>
                  <label
                    htmlFor="currentPassword"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Current Password
                  </label>
                  <input
                    type="password"
                    name="currentPassword"
                    id="currentPassword"
                    className="mt-1 p-2 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-gray-100 text-text dark:bg-gray-700 dark:text-white shadow-sm focus:border-primary focus:ring-primary"
                    placeholder="Enter your current password"
                  />
                </div>

                <div>
                  <label
                    htmlFor="newPassword"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    New Password
                  </label>
                  <input
                    type="password"
                    name="newPassword"
                    id="newPassword"
                    className="mt-1 p-2 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-gray-100 text-text dark:bg-gray-700 dark:text-white shadow-sm focus:border-primary focus:ring-primary"
                    placeholder="Enter your new password"
                  />
                </div>

                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    id="confirmPassword"
                    className="mt-1 p-2 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-gray-100 text-text dark:bg-gray-700 dark:text-white shadow-sm focus:border-primary focus:ring-primary"
                    placeholder="Confirm your new password"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                  >
                    Update Password
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyAccount;
