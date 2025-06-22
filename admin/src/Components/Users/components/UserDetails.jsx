import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import UserDetailsSkeleton from "./UserDetailsSkeleton";

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

const UserDetails = ({ user: propUser, onBack: propOnBack }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [user, setUser] = useState(propUser || null);
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(!propUser);
  const [activeTab, setActiveTab] = useState("profile");

  const handleBack = () => {
    if (propOnBack) {
      propOnBack();
    } else {
      navigate("/admin/users");
    }
  };

  useEffect(() => {
    if (!propUser && id) {
      fetchUserData();
    }
  }, [id, propUser]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      
      const response = await axios.get(
        `${API_BASE_URL}/admin/users/${id}`,
        { withCredentials: true }
      );

      if (response.data.success) {
        const userData = response.data.user;
        
        // Transform data exactly like Settings page does
        const transformedUser = {
          ...userData,
          // Combine first_name + last_name like Settings does
          name: `${userData.first_name || ""} ${userData.last_name || ""}`.trim() || "Unknown User",
        };
        
        setUser(transformedUser);
        console.log('👤 User data loaded:', transformedUser);
        
        // Fetch addresses separately like Settings does
        await fetchUserAddresses(userData._id || userData.id);
      }
    } catch (error) {
      console.error('❌ Error fetching user data:', error);
      toast.error('Failed to load user details');
      handleBack();
    } finally {
      setLoading(false);
    }
  };

  // Fetch user addresses separately - exactly like Settings does
  const fetchUserAddresses = async (userId) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/admin/users/${userId}/addresses`,
        { withCredentials: true }
      );

      if (response.data.success && response.data.addresses.length > 0) {
        setAddresses(response.data.addresses);
        console.log('📍 Addresses loaded:', response.data.addresses);
      } else {
        console.log('No addresses found for user');
        setAddresses([]);
      }
    } catch (error) {
      console.log('Error fetching addresses:', error);
      setAddresses([]);
    }
  };

  if (loading) {
    return <UserDetailsSkeleton />;
  }

  if (!user) {
    return (
      <div className="p-6 bg-background min-h-screen">
        <div className="text-center">
          <p className="text-gray-500 dark:text-gray-400">User data not found</p>
          <button
            onClick={handleBack}
            className="mt-4 px-4 py-2 bg-primary text-white rounded-md"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Create safe user object
  const safeUser = {
    name: user.name || 'Unknown User',
    email: user.email || 'No email',
    phone: user.phone || 'Not provided',
    first_name: user.first_name || '',
    last_name: user.last_name || '',
    role: user.role || 'user',
    status: user.status || 'active',
    createdAt: user.createdAt || Date.now(),
    avatar: user.avatar || null,
    orders: user.orders || [],
    activityLog: user.activityLog || [],
    ...user
  };

  // Get primary address like Settings does
  const primaryAddress = addresses.find(addr => addr.is_primary) || addresses[0];

  return (
    <div className="p-6 bg-background min-h-screen">
      {/* Header with back button */}
      <div className="flex items-center mb-6">
        <button
          onClick={handleBack}
          className="mr-4 p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-white dark:hover:bg-gray-800 transition-all"
        >
          <i className="fas fa-arrow-left text-xl"></i>
        </button>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          User Details
        </h1>
      </div>

      {/* User info header */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden mb-6 border border-gray-200 dark:border-gray-700">
        <div className="p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row justify-between">
            <div className="flex items-center mb-4 sm:mb-0">
              <div className="relative">
                {safeUser.avatar ? (
                  <img
                    src={safeUser.avatar}
                    alt={safeUser.name}
                    className="h-24 w-24 rounded-full object-cover border-4 border-white dark:border-gray-700 shadow-lg"
                  />
                ) : (
                  <div className="h-24 w-24 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-white text-3xl font-bold border-4 border-white dark:border-gray-700 shadow-lg">
                    {safeUser.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <span
                  className={`absolute bottom-2 right-2 h-5 w-5 rounded-full border-3 border-white dark:border-gray-700 ${
                    safeUser.status === "active"
                      ? "bg-green-500"
                      : safeUser.status === "inactive"
                      ? "bg-gray-500"
                      : "bg-red-500"
                  }`}
                ></span>
              </div>
              <div className="ml-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {safeUser.name}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 text-lg">{safeUser.email}</p>
                <div className="flex items-center mt-3 space-x-3">
                  <span
                    className={`px-3 py-1 text-sm font-medium rounded-full ${
                      safeUser.role === "admin"
                        ? "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400"
                        : safeUser.role === "manager"
                        ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                        : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                    }`}
                  >
                    {safeUser.role.charAt(0).toUpperCase() + safeUser.role.slice(1)}
                  </span>
                  <span
                    className={`px-3 py-1 text-sm font-medium rounded-full ${
                      safeUser.status === "active"
                        ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                        : safeUser.status === "inactive"
                        ? "bg-gray-100 text-gray-800 dark:bg-gray-700/50 dark:text-gray-400"
                        : safeUser.status === "suspended"
                        ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                        : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                    }`}
                  >
                    {safeUser.status.charAt(0).toUpperCase() + safeUser.status.slice(1)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-t border-gray-200 dark:border-gray-700">
          <nav className="flex overflow-x-auto">
            {["profile", "orders", "activity", "security"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === tab
                    ? "border-primary text-primary bg-primary/5"
                    : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700/50"
                }`}
              >
                <i className={`fas fa-${tab === 'profile' ? 'user' : tab === 'orders' ? 'shopping-bag' : tab === 'activity' ? 'history' : 'shield-alt'} mr-2`}></i>
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Tab content */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
        {activeTab === "profile" && (
          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-3 mb-6">
                Personal Information
              </h3>

              {/* Personal Information - using actual backend fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                    First Name
                  </h4>
                  <p className="text-gray-900 dark:text-white font-medium">
                    {safeUser.first_name || "Not provided"}
                  </p>
                </div>

                <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                    Last Name
                  </h4>
                  <p className="text-gray-900 dark:text-white font-medium">
                    {safeUser.last_name || "Not provided"}
                  </p>
                </div>

                <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                    Email
                  </h4>
                  <p className="text-gray-900 dark:text-white font-medium">
                    {safeUser.email}
                  </p>
                </div>

                <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                    Phone
                  </h4>
                  <p className="text-gray-900 dark:text-white font-medium">
                    {safeUser.phone || "Not provided"}
                  </p>
                </div>

                <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                    Date Joined
                  </h4>
                  <p className="text-gray-900 dark:text-white font-medium">
                    {new Date(safeUser.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                    Role
                  </h4>
                  <p className="text-gray-900 dark:text-white font-medium">
                    {safeUser.role.charAt(0).toUpperCase() + safeUser.role.slice(1)}
                  </p>
                </div>
              </div>
            </div>

            {/* Address Section - using separate addresses array like Settings */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-3 mb-6">
                Address Information
              </h3>

              {primaryAddress ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                      Street Address
                    </h4>
                    <p className="text-gray-900 dark:text-white font-medium">
                      {primaryAddress.address_line_1 || "Not provided"}
                    </p>
                    {primaryAddress.address_line_2 && (
                      <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">
                        {primaryAddress.address_line_2}
                      </p>
                    )}
                  </div>

                  <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                      City
                    </h4>
                    <p className="text-gray-900 dark:text-white font-medium">
                      {primaryAddress.city || "Not provided"}
                    </p>
                  </div>

                  <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                      State
                    </h4>
                    <p className="text-gray-900 dark:text-white font-medium">
                      {primaryAddress.state || "Not provided"}
                    </p>
                  </div>

                  <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                      Postal Code
                    </h4>
                    <p className="text-gray-900 dark:text-white font-medium">
                      {primaryAddress.postal_code || "Not provided"}
                    </p>
                  </div>

                  <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                      Country
                    </h4>
                    <p className="text-gray-900 dark:text-white font-medium">
                      {primaryAddress.country || "Not provided"}
                    </p>
                  </div>

                  <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                      Address Phone
                    </h4>
                    <p className="text-gray-900 dark:text-white font-medium">
                      {primaryAddress.phone || "Not provided"}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <i className="fas fa-map-marker-alt text-gray-300 dark:text-gray-600 text-3xl mb-3"></i>
                  <p className="text-gray-500 dark:text-gray-400">No address information provided</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Other tabs remain the same... */}
        {activeTab === "orders" && (
          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-3 mb-6">
              Order History
            </h3>
            
            {safeUser.orders && safeUser.orders.length > 0 ? (
              <div className="space-y-4">
                {safeUser.orders.map((order, index) => (
                  <div key={index} className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
                    <div className="flex justify-between items-center">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          Order #{order.order_number || order._id?.slice(-8) || `ORD-${index + 1}`}
                        </h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'Date not available'}
                        </p>
                        {order.items && order.items.length > 0 && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {order.items.length} item(s)
                          </p>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <div className="text-right">
                          <p className="font-medium text-gray-900 dark:text-white">
                            ₹{order.total_amount || '0.00'}
                          </p>
                          <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                            order.status === 'delivered' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                            order.status === 'shipped' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' :
                            order.status === 'processing' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
                            order.status === 'cancelled' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' :
                            'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                          }`}>
                            {order.status ? order.status.charAt(0).toUpperCase() + order.status.slice(1) : 'Pending'}
                          </span>
                        </div>
                        
                        {/* View Details Button */}
                        <button
                          onClick={() => navigate(`/admin/orders/view/${order._id || order.id}`)}
                          className="px-3 py-1.5 bg-primary hover:bg-primary/90 text-white text-xs font-medium rounded-md transition-colors flex items-center space-x-1"
                        >
                          <i className="fas fa-eye text-xs"></i>
                          <span>View Details</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <i className="fas fa-shopping-cart text-gray-300 dark:text-gray-600 text-3xl mb-3"></i>
                <p className="text-gray-500 dark:text-gray-400">This user hasn't placed any orders yet.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === "activity" && (
          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-3 mb-6">
              Activity Log
            </h3>
            
            {safeUser.activityLog && safeUser.activityLog.length > 0 ? (
              <div className="space-y-4">
                {safeUser.activityLog.map((activity, index) => (
                  <div key={index} className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
                    <div className="flex items-center">
                      <div className={`p-2 rounded-full mr-3 ${
                        activity.type === 'order' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' :
                        activity.type === 'account' ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' :
                        'bg-gray-100 text-gray-600 dark:bg-gray-900/30 dark:text-gray-400'
                      }`}>
                        <i className={`fas ${
                          activity.type === 'order' ? 'fa-shopping-bag' :
                          activity.type === 'account' ? 'fa-user-plus' :
                          'fa-circle'
                        }`}></i>
                      </div>
                      <div className="flex-1">
                        <p className="text-gray-900 dark:text-white font-medium">
                          {activity.message}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {activity.timestamp ? new Date(activity.timestamp).toLocaleString() : 'Time not available'}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <i className="fas fa-history text-gray-300 dark:text-gray-600 text-3xl mb-3"></i>
                <p className="text-gray-500 dark:text-gray-400">No activity has been logged for this user.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === "security" && (
          <div className="space-y-8">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-3 mb-6">
              Security Settings
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                  Account Status
                </h4>
                <p className="text-gray-900 dark:text-white font-medium">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    safeUser.status === "active"
                      ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                      : safeUser.status === "inactive"
                      ? "bg-gray-100 text-gray-800 dark:bg-gray-700/50 dark:text-gray-400"
                      : safeUser.status === "suspended"
                      ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                      : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                  }`}>
                    {safeUser.status.charAt(0).toUpperCase() + safeUser.status.slice(1)}
                  </span>
                </p>
              </div>

              <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                  Account Verified
                </h4>
                <p className="text-gray-900 dark:text-white font-medium">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    safeUser.isAccountVerified 
                      ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                      : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                  }`}>
                    {safeUser.isAccountVerified ? 'Verified' : 'Unverified'}
                  </span>
                </p>
              </div>

              <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                  Two-Factor Authentication
                </h4>
                <p className="text-gray-900 dark:text-white font-medium">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    safeUser.twoFactorEnabled 
                      ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                      : "bg-gray-100 text-gray-800 dark:bg-gray-700/50 dark:text-gray-400"
                  }`}>
                    {safeUser.twoFactorEnabled ? 'Enabled' : 'Disabled'}
                  </span>
                </p>
              </div>

              <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                  Active Sessions
                </h4>
                <p className="text-gray-900 dark:text-white font-medium">
                  {safeUser.sessions ? safeUser.sessions.length : 0} session(s)
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDetails;
