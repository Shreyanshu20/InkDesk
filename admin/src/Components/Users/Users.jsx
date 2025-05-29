import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import Table from "../Common/Table";
import Pagination from "../Common/Pagination";
import BulkActions from "../Common/BulkActions";
import UserDetails from "./components/UserDetails";
import UserEditModal from "./components/UserEditModal";
import { getUserTableConfig } from "../Common/tableConfig";

const API_BASE_URL =
  import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

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
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedUserForEdit, setSelectedUserForEdit] = useState(null);

  const { id } = useParams();
  const navigate = useNavigate();

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

      const response = await axios.get(
        `${API_BASE_URL}/admin/users?${params.toString()}`,
        {
          withCredentials: true,
        }
      );

      if (response.data.success) {
        const transformedUsers = response.data.users.map((user) => ({
          id: user._id,
          name: `${user.first_name || ""} ${user.last_name || ""}`.trim(),
          email: user.email,
          role: user.role || "customer",
          status: user.status || "active",
          avatar: user.avatar || null,
          phone: user.phone || "N/A",
          createdAt: user.createdAt,
          lastLogin: user.lastLogin || user.updatedAt,
          address: user.address || {},
          orders: user.orders || [],
        }));

        setUsers(transformedUsers);
        setTotalUsers(
          response.data.pagination?.total || transformedUsers.length
        );
      }
    } catch (error) {
      console.error("Error fetching users:", error);
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
          name: `${user.first_name || ""} ${user.last_name || ""}`.trim(),
          email: user.email,
          role: user.role || "customer",
          status: user.status || "active",
          avatar: user.avatar || null,
          phone: user.phone || "N/A",
          createdAt: user.createdAt,
          lastLogin: user.lastLogin || user.updatedAt,
          address: user.address || {},
          orders: user.orders || [],
          notes: user.notes || "",
          twoFactorEnabled: user.twoFactorEnabled || false,
          sessions: user.sessions || [],
          activityLog: user.activityLog || [],
        };
        setCurrentUser(transformedUser);
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      toast.error("Failed to load user details");
      navigate("/admin/users");
    }
  };

  // Update user status
  const updateUserStatus = async (userId, newStatus) => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/admin/users/${userId}/status`,
        { status: newStatus },
        { withCredentials: true }
      );

      if (response.data.success) {
        toast.success("User status updated successfully");
        return true;
      }
    } catch (error) {
      console.error("Error updating user status:", error);
      toast.error("Failed to update user status");
      return false;
    }
  };

  // Delete user (if needed)
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
        return true;
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Failed to delete user");
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

  // Handle user actions
  const handleViewUser = (userId) => {
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

  const handleSelectUser = (id, selected) => {
    if (selected) {
      setSelectedUsers([...selectedUsers, id]);
    } else {
      setSelectedUsers(selectedUsers.filter((userId) => userId !== id));
    }
  };

  const filteredUsers = users;

  // User count by status
  const userCounts = {
    all: users.length,
    active: users.filter((u) => u.status === "active").length,
    inactive: users.filter((u) => u.status === "inactive").length,
    suspended: users.filter((u) => u.status === "suspended").length,
    pending: users.filter((u) => u.status === "pending").length,
  };

  // Sorted users based on sortConfig
  const sortedUsers = useMemo(() => {
    if (!sortConfig.key) return users;

    return [...users].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (aValue < bValue) {
        return sortConfig.direction === "ascending" ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === "ascending" ? 1 : -1;
      }
      return 0;
    });
  }, [users, sortConfig]);

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
      console.error("Error updating user:", error);
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
          Manage and monitor user accounts ({totalUsers} total users)
        </p>
      </div>

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
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="suspended">Suspended</option>
              <option value="pending">Pending</option>
            </select>
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedUsers.length > 0 && (
        <BulkActions
          selectedCount={selectedUsers.length}
          onDelete={() => handleDelete(selectedUsers)}
          onClearSelection={() => setSelectedUsers([])}
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
          onSelect={handleSelectUser}
          onSelectAll={(selected) => {
            if (selected) {
              setSelectedUsers(sortedUsers.map((user) => user.id));
            } else {
              setSelectedUsers([]);
            }
          }}
          sortConfig={sortConfig}
          onSortChange={(key) => {
            setSortConfig({
              key,
              direction:
                sortConfig.key === key && sortConfig.direction === "ascending"
                  ? "descending"
                  : "ascending",
            });
          }}
          isLoading={isLoading}
          emptyMessage="No users found"
          isSelectable={true}
        />

        {/* Pagination */}
        <Pagination
          page={page}
          rowsPerPage={rowsPerPage}
          totalItems={totalUsers}
          handlePageChange={setPage}
          handleRowsPerPageChange={(newRowsPerPage) => {
            setRowsPerPage(newRowsPerPage);
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
