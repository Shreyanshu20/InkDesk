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
import { useAdmin } from "../../Context/AdminContext";
import UsersSkeleton from "./UsersSkeleton";

const API_BASE_URL =
  import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

function Users() {
  const { adminData } = useAdmin();
  const isAdmin = adminData?.role === "admin";

  const checkAdminAccess = (action) => {
    if (isAdmin) {
      return true;
    } else {
      toast.error(`Access denied. Admin privileges required to ${action}.`);
      return false;
    }
  };

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

  const [userStats, setUserStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    suspended: 0,
    admins: 0,
    users: 0,
    verifiedUsers: 0,
    recentUsers: 0,
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

  const fetchUserStats = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/admin/users/stats`, {
        withCredentials: true,
      });

      if (response.data.success) {
        setUserStats(response.data.stats);
      }
    } catch (error) {
      // Keep default empty stats on error
    }
  };

  useEffect(() => {
    fetchUserStats();
  }, []);

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
        params.append(
          "sortOrder",
          sortConfig.direction === "ascending" ? "asc" : "desc"
        );
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
          name:
            `${user.first_name || ""} ${user.last_name || ""}`.trim() ||
            "Unknown User",
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
        setTotalUsers(
          response.data.pagination?.total || transformedUsers.length
        );
      }
    } catch (error) {
      toast.error("Failed to load users");
      setUsers([]);
      setTotalUsers(0);
    } finally {
      setIsLoading(false);
    }
  };

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
          name:
            `${user.first_name || ""} ${user.last_name || ""}`.trim() ||
            "Unknown User",
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
      toast.error("Failed to load user details");
      navigate("/admin/users");
    }
  };

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

        fetchUsers();
        fetchUserStats();

        return true;
      }
    } catch (error) {
      toast.error("Failed to delete user, the user may have active orders");
      return false;
    }
  };

  const updateUserStatus = async (userId, newStatus) => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/admin/users/${userId}/status`,
        { status: newStatus },
        { withCredentials: true }
      );

      if (response.data.success) {
        toast.success("User status updated successfully");

        fetchUsers();
        fetchUserStats();

        return true;
      }
    } catch (error) {
      toast.error("Failed to update user status");
      return false;
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, rowsPerPage, searchQuery, statusFilter, sortConfig]);

  useEffect(() => {
    if (id) {
      fetchUserById(id);
      setView("view");
    }
  }, [id]);

  useEffect(() => {
    const pathParts = location.pathname.split("/");
    if (pathParts[3] === "view" && pathParts[4]) {
      const userId = pathParts[4];
      fetchUserById(userId);
    }
  }, [location.pathname]);

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
      if (!checkAdminAccess("delete users")) return;

      const success = await deleteUser(userId);
      if (success) {
        fetchUsers();
      }
    }
  };

  const handleUpdateStatus = async (userId, newStatus) => {
    if (!checkAdminAccess("update user status")) return;

    const success = await updateUserStatus(userId, newStatus);
    if (success) {
      fetchUsers();
    }
  };

  const handleDelete = async (ids) => {
    if (
      window.confirm(`Delete ${ids.length > 1 ? "these users" : "this user"}?`)
    ) {
      if (!checkAdminAccess("delete users")) return;

      let successCount = 0;
      for (const id of ids) {
        const success = await deleteUser(id);
        if (success) successCount++;
      }

      if (successCount > 0) {
        toast.success(`${successCount} user(s) deleted successfully`);
        fetchUsers();
        setSelectedUsers([]);
      }
    }
  };

  const handleUserUpdate = async (userId, userData) => {
    if (!checkAdminAccess("update users")) return false;

    try {
      const response = await axios.put(
        `${API_BASE_URL}/admin/users/${userId}`,
        userData,
        { withCredentials: true }
      );

      if (response.data.success) {
        toast.success("User updated successfully");
        fetchUsers();
        return true;
      }
    } catch (error) {
      if (error.response?.status === 403) {
        toast.error(
          "Access denied. Admin privileges required to update users."
        );
      } else {
        toast.error("Failed to update user");
      }
      return false;
    }
  };

  const handleSelectUser = (userId) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSelectAllUsers = (checked) => {
    if (checked) {
      setSelectedUsers(users.map((user) => user.id));
    } else {
      setSelectedUsers([]);
    }
  };

  const closeEditModal = () => {
    setEditModalOpen(false);
    setSelectedUserForEdit(null);
  };

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

  if (isLoading && users.length === 0) {
    return <UsersSkeleton />;
  }

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
    <div className="p-6 bg-background min-h-screen">
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

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {Object.entries({
          all: {
            count: userStats.total,
            label: "Total Users",
            icon: "fa-users",
            color: "blue",
          },
          active: {
            count: userStats.active,
            label: "Active Users",
            icon: "fa-user-check",
            color: "green",
          },
          inactive: {
            count: userStats.inactive,
            label: "Inactive Users",
            icon: "fa-user-slash",
            color: "gray",
          },
          suspended: {
            count: userStats.suspended,
            label: "Suspended Users",
            icon: "fa-user-times",
            color: "red",
          },
        }).map(([key, { count, label, icon, color }]) => (
          <div
            key={key}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {label}
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {count}
                </p>
              </div>
              <div
                className={`w-10 h-10 flex items-center justify-center rounded-full ${
                  color === "blue"
                    ? "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                    : color === "green"
                    ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
                    : color === "gray"
                    ? "bg-gray-100 text-gray-600 dark:bg-gray-900/30 dark:text-gray-400"
                    : "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
                }`}
              >
                <i className={`fas ${icon}`}></i>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md mb-6 p-4">
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <input
                type="text"
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-700 text-gray-600 dark:text-white"
              />
              <i className="fas fa-search absolute left-3 top-3 text-gray-400"></i>
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-700 text-gray-600 dark:text-white"
            >
              <option value="all">All Status ({userStats.total})</option>
              <option value="active">Active ({userStats.active})</option>
              <option value="inactive">Inactive ({userStats.inactive})</option>
              <option value="suspended">
                Suspended ({userStats.suspended})
              </option>
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

      {selectedUsers.length > 0 && (
        <BulkActions
          selectedItems={selectedUsers}
          actions={[
            {
              label: "Delete Selected",
              icon: "fas fa-trash",
              onClick: (selectedIds) => handleDelete(selectedIds),
              className:
                "bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded-md",
              title: "Delete selected users",
            },
          ]}
          entityName="users"
          position="bottom-right"
        />
      )}

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <>
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
              onSelectItem={handleSelectUser}
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

            <Pagination
              page={page}
              rowsPerPage={rowsPerPage}
              totalItems={totalUsers}
              handlePageChange={(newPage) => setPage(newPage)}
              handleRowsPerPageChange={(newRowsPerPage) => {
                setRowsPerPage(newRowsPerPage);
                setPage(0);
              }}
              entityName="users"
            />
          </>
        )}
      </div>

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
