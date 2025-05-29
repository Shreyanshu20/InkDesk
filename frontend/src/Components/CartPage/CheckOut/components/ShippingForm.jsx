import React, { useState, useEffect } from "react";
import { useContext } from "react";
import { AppContent } from "../../../../Context/AppContent";
import axios from "axios";
import { toast } from "react-toastify"; // Add this import

const ShippingForm = ({
  shippingDetails,
  handleShippingInput,
  handleShippingSubmit,
  loading,
  setShippingDetails,
}) => {
  const { backendUrl, userData } = useContext(AppContent);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [userAddresses, setUserAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [isPrimaryAddress, setIsPrimaryAddress] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState('');
  const [editAddressData, setEditAddressData] = useState({});

  // Fetch user's existing addresses
  useEffect(() => {
    fetchUserAddresses();
    
    // Set email from userData if available
    if (userData?.email) {
      setShippingDetails(prev => ({
        ...prev,
        email: userData.email
      }));
    }
  }, [userData?.email]);

  const fetchUserAddresses = async () => {
    try {
      const response = await axios.get(`${backendUrl}/user/addresses`, {
        withCredentials: true,
      });

      if (response.data.success) {
        const addresses = response.data.addresses || [];
        setUserAddresses(addresses);

        // If user has addresses, don't show form initially
        if (addresses && addresses.length > 0) {
          setShowAddressForm(false);
          
          // Auto-select primary address if exists
          const primaryAddress = addresses.find(addr => addr.is_primary);
          if (primaryAddress) {
            handleAddressSelection(primaryAddress);
          } else {
            // If no primary, select the first address
            handleAddressSelection(addresses[0]);
          }
        } else {
          // If no addresses, show form
          setShowAddressForm(true);
        }
      }
    } catch (error) {
      console.error("Error fetching addresses:", error);
      // If error, show form
      setShowAddressForm(true);
    }
  };

  const handleAddressSelection = (address) => {
    setSelectedAddressId(address._id);
    setShippingDetails({
      firstName: address.first_name,
      lastName: address.last_name,
      email: userData?.email || "",
      phone: address.phone,
      address: address.address_line_1,
      city: address.city,
      state: address.state,
      pincode: address.postal_code,
      country: address.country || "India",
    });
    setIsPrimaryAddress(address.is_primary);
  };

  const handleAddNewAddress = () => {
    setSelectedAddressId("");
    setShowAddressForm(true);
    // Clear form
    setShippingDetails({
      firstName: "",
      lastName: "",
      email: userData?.email || "",
      phone: "",
      address: "",
      city: "",
      state: "",
      pincode: "",
      country: "India",
    });
  };

  const handleEditAddress = async (address, e) => {
    e.stopPropagation(); // Prevent address selection when clicking edit
    
    setEditingAddressId(address._id);
    setEditAddressData({
      first_name: address.first_name,
      last_name: address.last_name,
      phone: address.phone,
      address_line_1: address.address_line_1,
      city: address.city,
      state: address.state,
      postal_code: address.postal_code,
      country: address.country,
      is_primary: address.is_primary
    });
    setShowAddressForm(true);
    
    // Fill the form with address data for editing
    setShippingDetails({
      firstName: address.first_name,
      lastName: address.last_name,
      email: userData?.email || "",
      phone: address.phone,
      address: address.address_line_1,
      city: address.city,
      state: address.state,
      pincode: address.postal_code,
      country: address.country || "India",
    });
    
    setIsPrimaryAddress(address.is_primary);
  };

  const handleCancelEdit = () => {
    setEditingAddressId('');
    setEditAddressData({});
    setShowAddressForm(false);
    // Clear form
    setShippingDetails({
      firstName: "",
      lastName: "",
      email: userData?.email || "",
      phone: "",
      address: "",
      city: "",
      state: "",
      pincode: "",
      country: "India",
    });
    setIsPrimaryAddress(false);
  };

  const handleUpdateAddress = async (e) => {
    e.preventDefault();

    try {
      const addressData = {
        first_name: shippingDetails.firstName,
        last_name: shippingDetails.lastName,
        phone: shippingDetails.phone,
        address_line_1: shippingDetails.address,
        city: shippingDetails.city,
        state: shippingDetails.state,
        postal_code: shippingDetails.pincode,
        country: shippingDetails.country,
        is_primary: isPrimaryAddress,
      };

      const response = await axios.put(
        `${backendUrl}/user/addresses/${editingAddressId}`,
        addressData,
        {
          withCredentials: true,
        }
      );

      if (response.data.success) {
        // Refresh addresses list
        await fetchUserAddresses();
        
        // Reset edit state
        setEditingAddressId('');
        setEditAddressData({});
        setShowAddressForm(false);
        
        toast.success('Address updated successfully!'); // Replace alert with toast
      } else {
        toast.error(`Failed to update address: ${response.data.message}`); // Replace alert with toast
      }
    } catch (error) {
      console.error("Error updating address:", error);
      const errorMessage = error.response?.data?.message || "Failed to update address. Please try again.";
      toast.error(errorMessage); // Replace alert with toast
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    // If editing an address, call update function
    if (editingAddressId) {
      await handleUpdateAddress(e);
      return;
    }

    // If using existing address, proceed directly
    if (selectedAddressId && !showAddressForm) {
      handleShippingSubmit(e);
      return;
    }

    // If adding new address, save it first
    try {
      const addressData = {
        first_name: shippingDetails.firstName,
        last_name: shippingDetails.lastName,
        phone: shippingDetails.phone,
        address_line_1: shippingDetails.address,
        city: shippingDetails.city,
        state: shippingDetails.state,
        postal_code: shippingDetails.pincode,
        country: shippingDetails.country,
        is_primary: isPrimaryAddress || userAddresses.length === 0,
      };

      const response = await axios.post(`${backendUrl}/user/addresses`, addressData, {
        withCredentials: true,
      });

      if (response.data.success) {
        // Refresh addresses and close form
        await fetchUserAddresses();
        setShowAddressForm(false);
        toast.success('Address saved successfully!'); // Replace alert with toast
      } else {
        toast.error(`Failed to save address: ${response.data.message}`); // Replace alert with toast
      }
    } catch (error) {
      console.error("Error saving address:", error);
      toast.error("Failed to save address. Please try again."); // Replace alert with toast
    }
  };

  const handleDeleteAddress = async (addressId, e) => {
    e.stopPropagation(); // Prevent address selection when clicking delete

    if (window.confirm("Are you sure you want to delete this address?")) { // Keep confirm dialog
      try {
        console.log('Deleting address:', addressId);
        
        const response = await axios.delete(
          `${backendUrl}/user/addresses/${addressId}`,
          {
            withCredentials: true,
          }
        );

        console.log('Delete response:', response.data);

        if (response.data.success) {
          // Remove from local state
          setUserAddresses((prev) => prev.filter((addr) => addr._id !== addressId));

          // If deleted address was selected, clear selection
          if (selectedAddressId === addressId) {
            setSelectedAddressId("");
            setShippingDetails({
              firstName: "",
              lastName: "",
              email: userData?.email || "",
              phone: "",
              address: "",
              city: "",
              state: "",
              pincode: "",
              country: "India",
            });
          }

          // If no addresses left, show form
          const remainingAddresses = userAddresses.filter(addr => addr._id !== addressId);
          if (remainingAddresses.length === 0) {
            setShowAddressForm(true);
          }

          toast.success('Address deleted successfully!'); // Replace alert with toast
        } else {
          toast.error(`Failed to delete address: ${response.data.message}`); // Replace alert with toast
        }
      } catch (error) {
        console.error("Error deleting address:", error);
        console.error("Error response:", error.response?.data);
        
        const errorMessage = error.response?.data?.message || "Failed to delete address. Please try again.";
        toast.error(errorMessage); // Replace alert with toast
      }
    }
  };

  return (
    <div className="bg-gray-100 dark:bg-gray-900 rounded-2xl shadow-md overflow-hidden border border-gray-300 dark:border-gray-600">
      <div className="p-6 border-b border-gray-300 dark:border-gray-600">
        <h2 className="text-xl font-bold text-text flex items-center">
          <i className="fas fa-truck-loading text-primary mr-3"></i>
          Shipping Details
        </h2>
      </div>

      <div className="p-6">
        {/* Address Selection Options */}
        {userAddresses.length > 0 && !showAddressForm && (
          <div className="mb-6">
            <h3 className="text-lg font-medium text-text mb-4">
              Select Shipping Address
            </h3>

            {/* Existing Addresses */}
            <div className="space-y-3 mb-4">
              {userAddresses.map((address) => (
                <div
                  key={address._id}
                  className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                    selectedAddressId === address._id
                      ? "border-primary bg-primary/5"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                  onClick={() => handleAddressSelection(address)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <input
                          type="radio"
                          name="selectedAddress"
                          checked={selectedAddressId === address._id}
                          onChange={() => handleAddressSelection(address)}
                          className="mr-3"
                        />
                        <span className="font-medium text-text">
                          {address.first_name} {address.last_name}
                          {address.is_primary && (
                            <span className="ml-2 px-2 py-1 text-xs bg-primary/10 text-primary rounded">
                              Primary
                            </span>
                          )}
                        </span>
                      </div>
                      <p className="text-text/70 text-sm ml-6">
                        {address.address_line_1}, {address.city}, {address.state} -{" "}
                        {address.postal_code}
                      </p>
                      <p className="text-text/70 text-sm ml-6">
                        Phone: {address.phone}
                      </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center space-x-2 ml-4">
                      {/* Edit Button */}
                      <button
                        onClick={(e) => handleEditAddress(address, e)}
                        className="p-2 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-all duration-200"
                        title="Edit address"
                      >
                        <i className="fas fa-edit text-sm"></i>
                      </button>
                      
                      {/* Delete Button */}
                      <button
                        onClick={(e) => handleDeleteAddress(address._id, e)}
                        className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-200"
                        title="Delete address"
                      >
                        <i className="fas fa-trash-alt text-sm"></i>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Add New Address Button */}
            <button
              type="button"
              onClick={handleAddNewAddress}
              className="w-full p-4 border-2 border-dashed border-gray-400 dark:border-gray-500 rounded-lg text-primary hover:border-primary hover:bg-primary/5 transition-all duration-200 flex items-center justify-center"
            >
              <i className="fas fa-plus mr-2"></i>
              Add New Address
            </button>
          </div>
        )}

        {/* Address Form */}
        {(showAddressForm || userAddresses.length === 0) && (
          <form onSubmit={handleFormSubmit}>
            {/* Form Header */}
            <div className="mb-6">
              <h3 className="text-lg font-medium text-text">
                {editingAddressId ? 'Edit Address' : 'Add New Address'}
              </h3>
              {editingAddressId && (
                <p className="text-sm text-text/60 mt-1">
                  Update the address details below
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium text-text/70 mb-1"
                >
                  First Name *
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={shippingDetails.firstName}
                  onChange={handleShippingInput}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 bg-background/80 text-text"
                />
              </div>

              <div>
                <label
                  htmlFor="lastName"
                  className="block text-sm font-medium text-text/70 mb-1"
                >
                  Last Name *
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={shippingDetails.lastName}
                  onChange={handleShippingInput}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 bg-background/80 text-text"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-text/70 mb-1"
                >
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={shippingDetails.email}
                  onChange={handleShippingInput}
                  disabled
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 bg-background/80 text-text"
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Email cannot be changed</p>
              </div>


              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-text/70 mb-1"
                >
                  Phone Number *
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={shippingDetails.phone}
                  onChange={handleShippingInput}
                  required
                  placeholder="10-digit mobile number"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 bg-background/80 text-text"
                />
              </div>

              <div className="md:col-span-2">
                <label
                  htmlFor="address"
                  className="block text-sm font-medium text-text/70 mb-1"
                >
                  Address *
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={shippingDetails.address}
                  onChange={handleShippingInput}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 bg-background/80 text-text"
                />
              </div>

              <div>
                <label
                  htmlFor="city"
                  className="block text-sm font-medium text-text/70 mb-1"
                >
                  City *
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={shippingDetails.city}
                  onChange={handleShippingInput}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 bg-background/80 text-text"
                />
              </div>

              <div>
                <label
                  htmlFor="state"
                  className="block text-sm font-medium text-text/70 mb-1"
                >
                  State *
                </label>
                <select
                  id="state"
                  name="state"
                  value={shippingDetails.state}
                  onChange={handleShippingInput}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 bg-background/80 text-text"
                >
                  <option value="">Select State</option>
                  <option value="Andhra Pradesh">Andhra Pradesh</option>
                  <option value="Delhi">Delhi</option>
                  <option value="Gujarat">Gujarat</option>
                  <option value="Karnataka">Karnataka</option>
                  <option value="Kerala">Kerala</option>
                  <option value="Maharashtra">Maharashtra</option>
                  <option value="Punjab">Punjab</option>
                  <option value="Tamil Nadu">Tamil Nadu</option>
                  <option value="Uttar Pradesh">Uttar Pradesh</option>
                  <option value="West Bengal">West Bengal</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="pincode"
                  className="block text-sm font-medium text-text/70 mb-1"
                >
                  Pincode *
                </label>
                <input
                  type="text"
                  id="pincode"
                  name="pincode"
                  value={shippingDetails.pincode}
                  onChange={handleShippingInput}
                  required
                  maxLength="6"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 bg-background/80 text-text"
                />
              </div>

              <div>
                <label
                  htmlFor="country"
                  className="block text-sm font-medium text-text/70 mb-1"
                >
                  Country *
                </label>
                <input
                  type="text"
                  id="country"
                  name="country"
                  value={shippingDetails.country}
                  onChange={handleShippingInput}
                  required
                  disabled
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-background text-text/70 cursor-not-allowed"
                />
              </div>
            </div>

            {/* Primary Address Checkbox */}
            <div className="mt-6">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={isPrimaryAddress}
                  onChange={(e) => setIsPrimaryAddress(e.target.checked)}
                  className="mr-3"
                />
                <span className="text-sm text-text/70">
                  {userAddresses.length === 0
                    ? "Set as primary address"
                    : "Set as primary address (will replace current primary)"}
                </span>
              </label>
            </div>

            <div className="mt-8 flex justify-end">
              {(userAddresses.length > 0 || editingAddressId) && (
                <button
                  type="button"
                  onClick={editingAddressId ? handleCancelEdit : () => setShowAddressForm(false)}
                  className="mr-4 bg-background hover:bg-accent/10 border border-gray-300 hover:border-gray-400 text-text/80 font-medium rounded-md px-6 py-3 transition-all duration-300"
                >
                  Cancel
                </button>
              )}
              
              <button
                type="submit"
                disabled={loading}
                className="bg-primary hover:bg-primary/90 text-white font-medium rounded-md px-8 py-3 transition-colors duration-300 flex items-center justify-center shadow-md hover:shadow-lg"
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Processing...
                  </span>
                ) : editingAddressId ? (
                  <>
                    Update Address
                    <i className="fas fa-check ml-2"></i>
                  </>
                ) : userAddresses.length === 0 ? (
                  <>
                    Continue to Payment
                    <i className="fas fa-arrow-right ml-2"></i>
                  </>
                ) : (
                  <>
                    Save Address
                    <i className="fas fa-save ml-2"></i>
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {/* Continue Button for Selected Address */}
        {selectedAddressId && !showAddressForm && (
          <div className="mt-8 flex justify-end">
            <button
              onClick={handleFormSubmit}
              disabled={loading}
              className="bg-primary hover:bg-primary/90 text-white font-medium rounded-md px-8 py-3 transition-colors duration-300 flex items-center justify-center shadow-md hover:shadow-lg"
            >
              {loading ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                <>
                  Continue to Payment
                  <i className="fas fa-arrow-right ml-2"></i>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShippingForm;
