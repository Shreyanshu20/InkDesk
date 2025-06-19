import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

const UserDetails = ({ user: propUser, onBack: propOnBack }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [user, setUser] = useState(propUser || null);
  const [loading, setLoading] = useState(!propUser);
  const [activeTab, setActiveTab] = useState("profile");

  // Function to go back
  const handleBack = () => {
    if (propOnBack) {
      propOnBack();
    } else {
      navigate("/admin/users");
    }
  };

  // Fetch user data if not provided as prop
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
        
        // Transform data to match component expectations
        const transformedUser = {
          ...userData,
          name: `${userData.first_name || ""} ${userData.last_name || ""}`.trim() || "Unknown User",
          avatar: userData.avatar || null,
          address: userData.address || null,
          orders: userData.orders || [],
          activityLog: userData.activityLog || [],
          twoFactorEnabled: userData.twoFactorEnabled || false,
          sessions: userData.sessions || [],
          notes: userData.notes || ''
        };
        
        setUser(transformedUser);
        console.log('👤 User data loaded:', transformedUser);
      }
    } catch (error) {
      console.error('❌ Error fetching user data:', error);
      toast.error('Failed to load user details');
      handleBack();
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <i className="fas fa-spinner fa-spin text-3xl text-primary mb-4"></i>
            <p className="text-gray-500 dark:text-gray-400">Loading user details...</p>
          </div>
        </div>
      </div>
    );
  }

  // Safety check for user object
  if (!user) {
    return (
      <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
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

  // Ensure user object has required properties with defaults
  const safeUser = {
    name: user.name || 'Unknown User',
    email: user.email || 'No email',
    avatar: user.avatar || null,
    status: user.status || 'unknown',
    role: user.role || 'customer',
    phone: user.phone || 'Not provided',
    createdAt: user.createdAt || Date.now(),
    lastLogin: user.lastLogin || null,
    address: user.address || null,
    orders: user.orders || [],
    notes: user.notes || '',
    twoFactorEnabled: user.twoFactorEnabled || false,
    sessions: user.sessions || [],
    activityLog: user.activityLog || [],
    ...user
  };

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Header with back button */}
      <div className="flex items-center mb-6">
        <button
          onClick={handleBack}
          className="mr-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <i className="fas fa-arrow-left text-xl"></i>
        </button>
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          User Details
        </h1>
      </div>

      {/* User info header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden mb-6">
        <div className="p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row justify-between">
            <div className="flex items-center mb-4 sm:mb-0">
              <div className="relative">
                {safeUser.avatar ? (
                  <img
                    src={safeUser.avatar}
                    alt={safeUser.name}
                    className="h-20 w-20 rounded-full object-cover border-4 border-white dark:border-gray-700 shadow-md"
                  />
                ) : (
                  <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center text-primary text-2xl font-bold border-4 border-white dark:border-gray-700 shadow-md">
                    {safeUser.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <span
                  className={`absolute bottom-1 right-1 h-4 w-4 rounded-full border-2 border-white dark:border-gray-700 ${
                    safeUser.status === "active"
                      ? "bg-green-500"
                      : safeUser.status === "inactive"
                      ? "bg-gray-500"
                      : "bg-red-500"
                  }`}
                ></span>
              </div>
              <div className="ml-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  {safeUser.name}
                </h2>
                <p className="text-gray-500 dark:text-gray-400">{safeUser.email}</p>
                <div className="flex items-center mt-2">
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      safeUser.role === "admin"
                        ? "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400"
                        : safeUser.role === "manager"
                        ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                        : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400"
                    }`}
                  >
                    {safeUser.role.charAt(0).toUpperCase() + safeUser.role.slice(1)}
                  </span>
                  <span
                    className={`ml-2 px-2 py-1 text-xs rounded-full ${
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
            <button
              onClick={() => setActiveTab("profile")}
              className={`px-6 py-3 text-sm font-medium whitespace-nowrap ${
                activeTab === "profile"
                  ? "border-b-2 border-primary text-primary"
                  : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white"
              }`}
            >
              Profile
            </button>
            <button
              onClick={() => setActiveTab("orders")}
              className={`px-6 py-3 text-sm font-medium whitespace-nowrap ${
                activeTab === "orders"
                  ? "border-b-2 border-primary text-primary"
                  : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white"
              }`}
            >
              Orders
            </button>
            <button
              onClick={() => setActiveTab("activity")}
              className={`px-6 py-3 text-sm font-medium whitespace-nowrap ${
                activeTab === "activity"
                  ? "border-b-2 border-primary text-primary"
                  : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white"
              }`}
            >
              Activity Log
            </button>
            <button
              onClick={() => setActiveTab("security")}
              className={`px-6 py-3 text-sm font-medium whitespace-nowrap ${
                activeTab === "security"
                  ? "border-b-2 border-primary text-primary"
                  : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white"
              }`}
            >
              Security
            </button>
          </nav>
        </div>
      </div>

      {/* Tab content */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        {activeTab === "profile" && (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
              Personal Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Full Name
                </h4>
                <p className="text-gray-900 dark:text-white">{safeUser.name}</p>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Email
                </h4>
                <p className="text-gray-900 dark:text-white">{safeUser.email}</p>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Phone
                </h4>
                <p className="text-gray-900 dark:text-white">
                  {safeUser.phone || "Not provided"}
                </p>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Date Joined
                </h4>
                <p className="text-gray-900 dark:text-white">
                  {new Date(safeUser.createdAt || Date.now()).toLocaleDateString()}
                </p>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Last Login
                </h4>
                <p className="text-gray-900 dark:text-white">
                  {safeUser.lastLogin
                    ? new Date(safeUser.lastLogin).toLocaleString()
                    : "Never logged in"}
                </p>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Role
                </h4>
                <p className="text-gray-900 dark:text-white capitalize">
                  {safeUser.role || "Not assigned"}
                </p>
              </div>
            </div>

            <h3 className="text-lg font-medium text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2 pt-4">
              Address Information
            </h3>

            {safeUser.address ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                    Street Address
                  </h4>
                  <p className="text-gray-900 dark:text-white">
                    {safeUser.address.street}
                  </p>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                    City
                  </h4>
                  <p className="text-gray-900 dark:text-white">
                    {safeUser.address.city}
                  </p>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                    State/Province
                  </h4>
                  <p className="text-gray-900 dark:text-white">
                    {safeUser.address.state}
                  </p>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                    Postal Code
                  </h4>
                  <p className="text-gray-900 dark:text-white">
                    {safeUser.address.postalCode}
                  </p>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                    Country
                  </h4>
                  <p className="text-gray-900 dark:text-white">
                    {safeUser.address.country}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400 italic">
                No address information provided
              </p>
            )}

            <h3 className="text-lg font-medium text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2 pt-4">
              Notes
            </h3>
            <p className="text-gray-900 dark:text-white">
              {safeUser.notes || "No notes available for this user."}
            </p>
          </div>
        )}

        {activeTab === "orders" && (
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
              Order History
            </h3>

            {safeUser.orders && safeUser.orders.length > 0 ? (
              <div className="mt-4 overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Order Details
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Items
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Total
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {safeUser.orders.map((order) => (
                      <tr key={order.id || order._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        {/* Order Details Column */}
                        <td className="px-4 py-4">
                          <div className="flex flex-col space-y-1">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              #{(order.order_number || order.id || order._id)?.slice(-8)?.toUpperCase() || 'N/A'}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              {order.date || order.createdAt 
                                ? new Date(order.date || order.createdAt).toLocaleDateString('en-IN', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric'
                                  })
                                : 'N/A'
                              }
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              {order.date || order.createdAt 
                                ? new Date(order.date || order.createdAt).toLocaleTimeString('en-IN', {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })
                                : ''
                              }
                            </div>
                          </div>
                        </td>

                        {/* Items Column */}
                        <td className="px-4 py-4">
                          <div className="flex flex-col space-y-1">
                            {order.items && order.items.length > 0 ? (
                              <>
                                <div className="text-sm text-gray-900 dark:text-white">
                                  {order.items.length} item{order.items.length > 1 ? 's' : ''}
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                  {order.items.slice(0, 2).map((item, idx) => (
                                    <div key={idx} className="truncate max-w-32">
                                      {item.product_id?.product_name || item.product_name || 'Unknown Product'}
                                      {item.quantity && ` (×${item.quantity})`}
                                    </div>
                                  ))}
                                  {order.items.length > 2 && (
                                    <div className="text-xs text-gray-400">
                                      +{order.items.length - 2} more...
                                    </div>
                                  )}
                                </div>
                              </>
                            ) : (
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                No items
                              </div>
                            )}
                          </div>
                        </td>

                        {/* Status Column */}
                        <td className="px-4 py-4">
                          <div className="flex flex-col space-y-1">
                            <span
                              className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                order.status === "delivered"
                                  ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                                  : order.status === "pending"
                                  ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                                  : order.status === "processing"
                                  ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                                  : order.status === "shipped"
                                  ? "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400"
                                  : order.status === "cancelled"
                                  ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                                  : "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"
                              }`}
                            >
                              {order.status?.charAt(0)?.toUpperCase() + order.status?.slice(1) || 'Unknown'}
                            </span>
                            {order.payment_status && (
                              <span className={`inline-flex px-2 py-1 text-xs rounded-full ${
                                order.payment_status === 'paid' 
                                  ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                                  : order.payment_status === 'pending'
                                  ? 'bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400'
                                  : 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400'
                              }`}>
                                {order.payment_status}
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Total Column */}
                        <td className="px-4 py-4">
                          <div className="flex flex-col space-y-1">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {order.total !== undefined && order.total !== null 
                                ? `₹${Number(order.total).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                                : order.total_amount !== undefined && order.total_amount !== null
                                ? `₹${Number(order.total_amount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                                : 'N/A'
                              }
                            </div>
                            {order.payment_method && (
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                via {order.payment_method.toUpperCase()}
                              </div>
                            )}
                          </div>
                        </td>

                        {/* Actions Column */}
                        <td className="px-4 py-4">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => navigate(`/admin/orders/view/${order.id || order._id}`)}
                              className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded text-primary bg-primary/10 hover:bg-primary/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                            >
                              <i className="fas fa-eye mr-1"></i>
                              View
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="mt-4 text-center py-8">
                <div className="text-gray-400 dark:text-gray-500 mb-2">
                  <i className="fas fa-shopping-cart text-3xl"></i>
                </div>
                <p className="text-gray-500 dark:text-gray-400 italic">
                  This user hasn't placed any orders yet.
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === "activity" && (
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
              Activity Log
            </h3>

            {safeUser.activityLog && safeUser.activityLog.length > 0 ? (
              <div className="flow-root mt-6">
                <ul className="-mb-8">
                  {safeUser.activityLog.map((activity, activityIdx) => (
                    <li key={activityIdx}>
                      <div className="relative pb-8">
                        {activityIdx !== safeUser.activityLog.length - 1 ? (
                          <span
                            className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200 dark:bg-gray-700"
                            aria-hidden="true"
                          />
                        ) : null}
                        <div className="relative flex space-x-3">
                          <div>
                            <span
                              className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white dark:ring-gray-800 
                                ${
                                  activity.type === "login"
                                    ? "bg-blue-500"
                                    : activity.type === "order"
                                    ? "bg-green-500"
                                    : activity.type === "update"
                                    ? "bg-yellow-500"
                                    : "bg-gray-500"
                                }
                              `}
                            >
                              <i
                                className={`text-white fas 
                                  ${
                                    activity.type === "login"
                                      ? "fa-sign-in-alt"
                                      : activity.type === "order"
                                      ? "fa-shopping-cart"
                                      : activity.type === "update"
                                      ? "fa-user-edit"
                                      : "fa-info-circle"
                                  }
                                `}
                                aria-hidden="true"
                              />
                            </span>
                          </div>
                          <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                            <div>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                {activity.message}{" "}
                              </p>
                            </div>
                            <div className="text-right text-sm whitespace-nowrap text-gray-500 dark:text-gray-400">
                              {new Date(activity.timestamp).toLocaleString()
                              }
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400 italic mt-4">
                No activity has been logged for this user.
              </p>
            )}
          </div>
        )}

        {activeTab === "security" && (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
              Security Settings
            </h3>

            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                Password Reset
              </h4>
              <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md flex items-center">
                <i className="fas fa-key mr-2"></i>
                Send Password Reset Link
              </button>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                Account Status
              </h4>
              <div className="flex space-x-3">
                <button
                  className={`px-4 py-2 rounded-md flex items-center ${
                    safeUser.status === "active"
                      ? "bg-gray-200 text-gray-800 cursor-not-allowed"
                      : "bg-green-600 hover:bg-green-700 text-white"
                  }`}
                  disabled={safeUser.status === "active"}
                >
                  <i className="fas fa-check-circle mr-2"></i>
                  Activate
                </button>
                <button
                  className={`px-4 py-2 rounded-md flex items-center ${
                    safeUser.status === "suspended"
                      ? "bg-gray-200 text-gray-800 cursor-not-allowed"
                      : "bg-red-600 hover:bg-red-700 text-white"
                  }`}
                  disabled={safeUser.status === "suspended"}
                >
                  <i className="fas fa-ban mr-2"></i>
                  Suspend
                </button>
              </div>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Current status:{" "}
                <span className="font-medium capitalize">{safeUser.status}</span>
              </p>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                Two-Factor Authentication
              </h4>
              <p className="text-gray-500 dark:text-gray-400 mb-2">
                {safeUser.twoFactorEnabled
                  ? "Two-factor authentication is enabled for this user."
                  : "Two-factor authentication is not enabled for this user."}
              </p>
              <button
                className={`px-4 py-2 rounded-md flex items-center ${
                  safeUser.twoFactorEnabled
                    ? "bg-yellow-600 hover:bg-yellow-700 text-white"
                    : "bg-blue-600 hover:bg-blue-700 text-white"
                }`}
              >
                <i
                  className={`fas ${
                    safeUser.twoFactorEnabled ? "fa-times-circle" : "fa-shield-alt"
                  } mr-2`}
                ></i>
                {safeUser.twoFactorEnabled ? "Disable 2FA" : "Enable 2FA"}
              </button>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                Login Sessions
              </h4>
              {safeUser.sessions && safeUser.sessions.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Device
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          IP Address
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Location
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Last Active
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {safeUser.sessions.map((session) => (
                        <tr key={session.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                            <div className="flex items-center">
                              <i
                                className={`fas ${
                                  session.device.includes("iPhone") ||
                                  session.device.includes("iPad")
                                    ? "fa-apple"
                                    : session.device.includes("Android")
                                    ? "fa-android"
                                    : "fa-desktop"
                                } mr-2`}
                              ></i>
                              {session.device}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {session.ip}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {session.location}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {new Date(session.lastActive).toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button className="text-red-600 hover:text-red-900 dark:hover:text-red-400">
                              Revoke
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400 italic">
                  No active sessions found.
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDetails;
