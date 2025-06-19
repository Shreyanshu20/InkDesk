import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import Table from "../Common/Table";
import Pagination from "../Common/Pagination";
import BulkActions from "../Common/BulkActions";
import UserDetails from "./components/UserDetails";
import UserEditModal from "./components/UserEditModal";
import { getUserTableConfig } from "../Common/tableConfig";

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

function Users() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [view, setView] = useState("list");
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalUsers, setTotalUsers] = useState(0);
  
  // ADD: Separate state for user stats
  const [userStats, setUserStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    suspended: 0,
    admins: 0,
    users: 0,
    verifiedUsers: 0,
    recentUsers: 0
  });
  
  const [sortConfig, setSortConfig] = useState({
    key: "createdAt",
    direction: "descending",
  });
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedUserForEdit, setSelectedUserForEdit] = useState(null);

  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // ADD: Fetch user statistics (separate from paginated users)
  const fetchUserStats = async () => {
    try {
      console.log("📊 Fetching user statistics...");
      
      const response = await axios.get(
        `${API_BASE_URL}/admin/users/stats`,
        {
          withCredentials: true,
        }
      );

      if (response.data.success) {
        setUserStats(response.data.stats);
        console.log("📊 User stats loaded:", response.data.stats);
      }
    } catch (error) {
      console.error("❌ Error fetching user stats:", error);
      // Keep default empty stats on error
    }
  };

  // MODIFY: Load both stats and users on mount
  useEffect(() => {
    fetchUserStats(); // Load stats once
  }, []); // Only run once on mount

  // Fetch users from backend
  const fetchUsers = async () => {
    try {
      setIsLoading(true);

      const params = new URLSearchParams();
      params.append("page", page + 1);
      params.append("limit", rowsPerPage);

      if (searchQuery) {
        params.append("search", searchQuery);
      }

      if (statusFilter !== "all") {
        params.append("status", statusFilter);
      }

      if (sortConfig.key) {
        params.append("sortBy", sortConfig.key);
        params.append("sortOrder", sortConfig.direction === "ascending" ? "asc" : "desc");
      }

      console.log('🔍 Fetching users with params:', params.toString());

      const response = await axios.get(
        `${API_BASE_URL}/admin/users?${params.toString()}`,
        {
          withCredentials: true,
        }
      );

      if (response.data.success) {
        console.log('👥 Users response:', response.data);

        const transformedUsers = response.data.users.map((user) => ({
          id: user._id,
          name: `${user.first_name || ""} ${user.last_name || ""}`.trim() || "Unknown User",
          email: user.email,
          role: user.role || "customer",
          status: user.status || "active",
          avatar: user.avatar || null,
          phone: user.phone || "N/A",
          createdAt: user.createdAt,
          lastLogin: user.lastLogin || user.updatedAt,
          address: user.address_details || [],
          orders: user.orders || [],
          first_name: user.first_name,
          last_name: user.last_name,
        }));

        setUsers(transformedUsers);
        setTotalUsers(response.data.pagination?.total || transformedUsers.length);

        console.log(`📊 Loaded ${transformedUsers.length} users of ${response.data.pagination?.total} total`);
      }
    } catch (error) {
      console.error("❌ Error fetching users:", error);
      toast.error("Failed to load users");
      setUsers([]);
      setTotalUsers(0);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch single user by ID
  const fetchUserById = async (userId) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/admin/users/${userId}`,
        {
          withCredentials: true,
        }
      );
      if (response.data.success) {
        const user = response.data.user;
        const transformedUser = {
          id: user._id,
          name: `${user.first_name || ""} ${user.last_name || ""}`.trim() || "Unknown User",
          email: user.email,
          role: user.role || "customer",
          status: user.status || "active",
          avatar: user.avatar || null,
          phone: user.phone || "N/A",
          createdAt: user.createdAt,
          lastLogin: user.lastLogin || user.updatedAt,
          address: user.address_details || [],
          orders: user.orders || [],
          notes: user.notes || "",
          twoFactorEnabled: user.twoFactorEnabled || false,
          sessions: user.sessions || [],
          activityLog: user.activityLog || [],
          first_name: user.first_name,
          last_name: user.last_name,
        };
        setCurrentUser(transformedUser);
      }
    } catch (error) {
      console.error("❌ Error fetching user:", error);
      toast.error("Failed to load user details");
      navigate("/admin/users");
    }
  };

  // MODIFY: Delete user function to refresh stats after deletion
  const deleteUser = async (userId) => {
    try {
      const response = await axios.delete(
        `${API_BASE_URL}/admin/users/${userId}`,
        {
          withCredentials: true,
        }
      );

      if (response.data.success) {
        toast.success("User deleted successfully");
        
        // Refresh both users and stats
        fetchUsers();
        fetchUserStats();
        
        return true;
      }
    } catch (error) {
      console.error("❌ Error deleting user:", error);
      toast.error("Failed to delete user");
      return false;
    }
  };

  // MODIFY: Update user status function to refresh stats
  const updateUserStatus = async (userId, newStatus) => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/admin/users/${userId}/status`,
        { status: newStatus },
        { withCredentials: true }
      );

      if (response.data.success) {
        toast.success("User status updated successfully");
        
        // Refresh both users and stats
        fetchUsers();
        fetchUserStats();
        
        return true;
      }
    } catch (error) {
      console.error("❌ Error updating user status:", error);
      toast.error("Failed to update user status");
      return false;
    }
  };

  // Load initial data
  useEffect(() => {
    fetchUsers();
  }, [page, rowsPerPage, searchQuery, statusFilter, sortConfig]);

  // Handle URL parameter for viewing specific user
  useEffect(() => {
    if (id) {
      fetchUserById(id);
      setView("view");
    }
  }, [id]);

  // ADD: useEffect to handle view route (around line 80)
  useEffect(() => {
    const pathParts = location.pathname.split('/');
    if (pathParts[3] === 'view' && pathParts[4]) {
      const userId = pathParts[4];
      console.log("🔍 Loading user for view:", userId);
      fetchUserById(userId);
    }
  }, [location.pathname]);

  // Handle user actions
  const handleViewUser = (userId) => {
    console.log("👁️ Viewing user:", userId);
    // Navigate to user details route instead of setting local state
    navigate(`/admin/users/view/${userId}`);
  };

  const handleEditUser = (userId) => {
    const user = users.find((u) => u.id === userId);
    if (user) {
      setSelectedUserForEdit(user);
      setEditModalOpen(true);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      const success = await deleteUser(userId);
      if (success) {
        fetchUsers(); // Refresh the list
      }
    }
  };

  const handleUpdateStatus = async (userId, newStatus) => {
    const success = await updateUserStatus(userId, newStatus);
    if (success) {
      fetchUsers(); // Refresh the list
    }
  };

  const handleDelete = async (ids) => {
    if (
      window.confirm(`Delete ${ids.length > 1 ? "these users" : "this user"}?`)
    ) {
      let successCount = 0;
      for (const id of ids) {
        const success = await deleteUser(id);
        if (success) successCount++;
      }

      if (successCount > 0) {
        toast.success(`${successCount} user(s) deleted successfully`);
        fetchUsers(); // Refresh the list
        setSelectedUsers([]);
      }
    }
  };

  // Add debugging to selection handlers
  const handleSelectUser = (id, selected) => {
    console.log('👤 User selection:', { id, selected });
    console.log('📋 Current selectedUsers before:', selectedUsers);
    
    if (selected) {
      const newSelected = [...selectedUsers, id];
      setSelectedUsers(newSelected);
      console.log('📋 New selectedUsers after adding:', newSelected);
    } else {
      const newSelected = selectedUsers.filter((userId) => userId !== id);
      setSelectedUsers(newSelected);
      console.log('📋 New selectedUsers after removing:', newSelected);
    }
  };

  // Sorted users based on sortConfig
  const sortedUsers = useMemo(() => {
    if (!sortConfig.key) return users;

    return [...users].sort((a, b) => {
      let aValue = a[sortConfig.key];
      let bValue = b[sortConfig.key];

      // Handle date fields
      if (sortConfig.key === 'createdAt' || sortConfig.key === 'lastLogin') {
        aValue = new Date(aValue || 0);
        bValue = new Date(bValue || 0);
      }

      if (aValue < bValue) {
        return sortConfig.direction === "ascending" ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === "ascending" ? 1 : -1;
      }
      return 0;
    });
  }, [users, sortConfig]);

  // UseEffect to log sorted users
  useEffect(() => {
    console.log('📊 Sorted users:', sortedUsers);
  }, [sortedUsers]);

  // User count by status
  const userCounts = useMemo(() => ({
    all: userStats.total,
    active: userStats.active,
    inactive: userStats.inactive,
    suspended: userStats.suspended,
  }), [userStats]);

  // Add debugging to select all handler
  const handleSelectAllUsers = (selected) => {
    console.log('👥 Select all users:', { selected, userCount: sortedUsers.length });
    
    if (selected) {
      const allUserIds = sortedUsers.map((user) => user.id);
      setSelectedUsers(allUserIds);
      console.log('📋 Selected all users:', allUserIds);
    } else {
      setSelectedUsers([]);
      console.log('📋 Cleared all selections');
    }
  };

  // Functions to handle modal
  const closeEditModal = () => {
    setEditModalOpen(false);
    setSelectedUserForEdit(null);
  };

  // Update user function
  const handleUserUpdate = async (userId, userData) => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/admin/users/${userId}`,
        userData,
        { withCredentials: true }
      );

      if (response.data.success) {
        toast.success("User updated successfully");
        fetchUsers(); // Refresh the list
        return true;
      }
    } catch (error) {
      console.error("❌ Error updating user:", error);
      toast.error("Failed to update user");
      return false;
    }
  };

  if (view === "view" && currentUser) {
    return (
      <UserDetails
        user={currentUser}
        onBack={() => {
          setView("list");
          setCurrentUser(null);
          navigate("/admin/users");
        }}
      />
    );
  }

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          User Management
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage and monitor user accounts ({userStats.total} total users)
          {userStats.verifiedUsers > 0 && (
            <> • {userStats.verifiedUsers} verified</>
          )}
          {userStats.recentUsers > 0 && (
            <> • {userStats.recentUsers} new this week</>
          )}
        </p>
      </div>

      {/* User Stats Cards - Now using real stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {Object.entries(userCounts).map(([status, count]) => (
          <div
            key={status}
            className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 cursor-pointer hover:shadow-md transition-shadow ${
              statusFilter === status ? 'ring-2 ring-primary' : ''
            }`}
            onClick={() => setStatusFilter(status)}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 capitalize">
                  {status === "all" ? "Total Users" : `${status} Users`}
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {count}
                </p>
              </div>
              <div className={`p-3 rounded-full ${
                status === "all" ? "bg-blue-100 text-blue-600" :
                status === "active" ? "bg-green-100 text-green-600" :
                status === "inactive" ? "bg-gray-100 text-gray-600" :
                "bg-red-100 text-red-600"
              }`}>
                <i className={`fas ${
                  status === "all" ? "fa-users" :
                  status === "active" ? "fa-user-check" :
                  status === "inactive" ? "fa-user-slash" :
                  "fa-user-times"
                }`}></i>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ADD: Refresh button to update stats */}
      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md mb-6 p-4">
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <input
                type="text"
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
              <i className="fas fa-search absolute left-3 top-3 text-gray-400"></i>
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              <option value="all">All Status ({userCounts.all})</option>
              <option value="active">Active ({userCounts.active})</option>
              <option value="inactive">Inactive ({userCounts.inactive})</option>
              <option value="suspended">Suspended ({userCounts.suspended})</option>
            </select>
          </div>

          <button
            onClick={() => {
              fetchUsers();
              fetchUserStats();
            }}
            className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-md flex items-center gap-2"
          >
            <i className="fas fa-refresh"></i>
            Refresh
          </button>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedUsers.length > 0 && (
        <BulkActions
          selectedItems={selectedUsers} // ✅ Change from selectedCount to selectedItems
          actions={[
            {
              label: "Delete Selected",
              icon: "fas fa-trash",
              onClick: (selectedIds) => handleDelete(selectedIds),
              className: "bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded-md",
              title: "Delete selected users"
            }
          ]}
          entityName="users"
          position="bottom-right"
        />
      )}

      {/* Users Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <Table
          data={sortedUsers}
          columns={
            getUserTableConfig({
              onView: handleViewUser,
              onEdit: handleEditUser,
              onDelete: handleDeleteUser,
              onUpdateStatus: handleUpdateStatus,
            }).columns
          }
          selectedItems={selectedUsers}
          onSelectItem={handleSelectUser} // ✅ Changed from onSelect to onSelectItem
          onSelectAll={handleSelectAllUsers}
          sortConfig={sortConfig}
          onSortChange={({ key, direction }) => {
            setSortConfig({ key, direction });
          }}
          isLoading={isLoading}
          emptyMessage="No users found"
          enableSelection={true}
          enableSorting={true}
          itemKey="id"
        />

        {/* Pagination */}
        <Pagination
          page={page}
          rowsPerPage={rowsPerPage}
          totalItems={totalUsers}
          handlePageChange={setPage}
          handleRowsPerPageChange={(newRowsPerPage) => {
            console.log('👥 Users: Changing rows per page to:', newRowsPerPage);
            setRowsPerPage(parseInt(newRowsPerPage, 10)); // ✅ Convert to number
            setPage(0);
          }}
          entityName="users"
        />
      </div>

      {/* Edit User Modal */}
      <UserEditModal
        editModalOpen={editModalOpen}
        selectedUserForEdit={selectedUserForEdit}
        closeEditModal={closeEditModal}
        handleUserUpdate={handleUserUpdate}
      />
    </div>
  );
}

export default Users;