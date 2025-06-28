import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Table from "../Common/Table";
import Pagination from "../Common/Pagination";
import BulkActions from "../Common/BulkActions";
import { useAdmin } from "../../Context/AdminContext";
import BannersSkeleton from "./BannersSkeleton";

const API_BASE_URL =
  import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

function Banners() {
  const navigate = useNavigate();
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

  const [banners, setBanners] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedBanners, setSelectedBanners] = useState([]);
  const [locationFilter, setLocationFilter] = useState("all");
  const [sortConfig, setSortConfig] = useState({
    key: "position",
    direction: "ascending",
  });

  const fetchBanners = async (showSuccessToast = false, isRefresh = false) => {
    if (isRefresh) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }

    try {
      const token =
        localStorage.getItem("token") ||
        document.cookie.replace(
          /(?:(?:^|.*;\s*)token\s*\=\s*([^;]*).*$)|^.*$/,
          "$1"
        );

      const response = await fetch(`${API_BASE_URL}/banners/admin`, {
        credentials: "include",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (data.success) {
        setBanners(data.banners || []);
        if (showSuccessToast) {
          toast.success("Banners refreshed successfully!");
        }
      } else {
        toast.error("Failed to load banners");
      }
    } catch (error) {
      toast.error("Error loading banners");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const filteredBanners =
    locationFilter === "all"
      ? banners
      : banners.filter((banner) => banner.location === locationFilter);

  const sortedBanners = React.useMemo(() => {
    let bannersToSort = [...filteredBanners];
    if (sortConfig.key) {
      bannersToSort.sort((a, b) => {
        if (sortConfig.key === "position") {
          return sortConfig.direction === "ascending"
            ? a.position - b.position
            : b.position - a.position;
        } else if (sortConfig.key === "startDate") {
          const dateA = new Date(a.startDate).getTime();
          const dateB = new Date(b.startDate).getTime();
          return sortConfig.direction === "ascending"
            ? dateA - dateB
            : dateB - dateA;
        } else if (sortConfig.key === "createdAt") {
          const dateA = new Date(a.createdAt).getTime();
          const dateB = new Date(b.createdAt).getTime();
          return sortConfig.direction === "ascending"
            ? dateA - dateB
            : dateB - dateA;
        }
        const aValue = a[sortConfig.key]?.toString().toLowerCase() || "";
        const bValue = b[sortConfig.key]?.toString().toLowerCase() || "";
        if (aValue < bValue) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }
    return bannersToSort;
  }, [filteredBanners, sortConfig]);

  const paginatedBanners = sortedBanners.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleEditBanner = (id) => {
    navigate(`/admin/banners/edit/${id}`);
  };

  const handleAddBanner = () => {
    navigate("/admin/banners/add");
  };

  const handleToggleStatus = async (id) => {
    if (!checkAdminAccess("change banner status")) return;

    try {
      const token =
        localStorage.getItem("token") ||
        document.cookie.replace(
          /(?:(?:^|.*;\s*)token\s*\=\s*([^;]*).*$)|^.*$/,
          "$1"
        );
      const banner = banners.find((b) => b._id === id);
      const newStatus = !banner?.isActive;

      const response = await fetch(
        `${API_BASE_URL}/banners/admin/${id}/toggle`,
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        await fetchBanners();
        toast.success(
          `Banner ${newStatus ? "activated" : "deactivated"} successfully!`,
          {
            icon: newStatus ? "🟢" : "⚫",
          }
        );
      } else {
        const errorData = await response.json();
        if (response.status === 403) {
          toast.error(
            "Access denied. Admin privileges required to change banner status."
          );
        } else {
          toast.error(errorData.message || "Failed to update banner status");
        }
      }
    } catch (error) {
      toast.error("Error updating banner status");
    }
  };

  const handleDeleteBanner = async (id) => {
    const banner = banners.find((b) => b._id === id);
    const bannerTitle = banner?.title || "banner";

    if (window.confirm(`Are you sure you want to delete "${bannerTitle}"?`)) {
      if (!checkAdminAccess("delete banners")) return;

      try {
        const token =
          localStorage.getItem("token") ||
          document.cookie.replace(
            /(?:(?:^|.*;\s*)token\s*\=\s*([^;]*).*$)|^.*$/,
            "$1"
          );

        const response = await fetch(`${API_BASE_URL}/banners/admin/${id}`, {
          method: "DELETE",
          credentials: "include",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          await fetchBanners();
          setSelectedBanners(
            selectedBanners.filter((bannerId) => bannerId !== id)
          );
          toast.success(`"${bannerTitle}" deleted successfully!`, {
            icon: "🗑️",
          });
        } else {
          const errorData = await response.json();
          if (response.status === 403) {
            toast.error(
              "Access denied. Admin privileges required to delete banners."
            );
          } else {
            toast.error(errorData.message || "Failed to delete banner");
          }
        }
      } catch (error) {
        toast.error("Error deleting banner");
      }
    }
  };

  const handleBulkDelete = async (ids) => {
    if (
      window.confirm(`Are you sure you want to delete ${ids.length} banners?`)
    ) {
      if (!checkAdminAccess("delete banners")) return;

      const toastId = toast.loading(`Deleting ${ids.length} banners...`);

      try {
        const token =
          localStorage.getItem("token") ||
          document.cookie.replace(
            /(?:(?:^|.*;\s*)token\s*\=\s*([^;]*).*$)|^.*$/,
            "$1"
          );

        const results = await Promise.allSettled(
          ids.map((id) =>
            fetch(`${API_BASE_URL}/banners/admin/${id}`, {
              method: "DELETE",
              credentials: "include",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            })
          )
        );

        const successCount = results.filter(
          (result) => result.status === "fulfilled" && result.value.ok
        ).length;
        const failureCount = results.filter(
          (result) => result.status === "rejected" || !result.value.ok
        ).length;

        await fetchBanners();
        setSelectedBanners([]);

        toast.dismiss(toastId);

        if (failureCount === 0) {
          toast.success(`${successCount} banners deleted successfully!`, {
            icon: "🗑️",
          });
        } else if (successCount === 0) {
          toast.error("Failed to delete banners");
        } else {
          toast.warning(
            `${successCount} banners deleted, ${failureCount} failed`
          );
        }
      } catch (error) {
        toast.dismiss(toastId);
        toast.error("Error deleting banners");
      }
    }
  };

  const handleBulkActivate = async (ids) => {
    if (!checkAdminAccess("activate banners")) return;

    const inactiveBanners = ids.filter((id) => {
      const banner = banners.find((b) => b._id === id);
      return banner && !banner.isActive;
    });

    if (inactiveBanners.length === 0) {
      toast.info("No banners need activation");
      return;
    }

    const toastId = toast.loading(
      `Activating ${inactiveBanners.length} banners...`
    );

    try {
      const token =
        localStorage.getItem("token") ||
        document.cookie.replace(
          /(?:(?:^|.*;\s*)token\s*\=\s*([^;]*).*$)|^.*$/,
          "$1"
        );

      await Promise.all(
        inactiveBanners.map((id) => {
          const banner = banners.find((b) => b._id === id);
          return fetch(`${API_BASE_URL}/banners/admin/${id}`, {
            method: "PUT",
            credentials: "include",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ ...banner, isActive: true }),
          });
        })
      );

      await fetchBanners();
      setSelectedBanners([]);

      toast.dismiss(toastId);
      toast.success(
        `${inactiveBanners.length} banners activated successfully!`,
        {
          icon: "🟢",
        }
      );
    } catch (error) {
      toast.dismiss(toastId);
      toast.error("Error activating banners");
    }
  };

  const handleBulkDeactivate = async (ids) => {
    if (!checkAdminAccess("deactivate banners")) return;

    const activeBanners = ids.filter((id) => {
      const banner = banners.find((b) => b._id === id);
      return banner && banner.isActive;
    });

    if (activeBanners.length === 0) {
      toast.info("No banners need deactivation");
      return;
    }

    const toastId = toast.loading(
      `Deactivating ${activeBanners.length} banners...`
    );

    try {
      const token =
        localStorage.getItem("token") ||
        document.cookie.replace(
          /(?:(?:^|.*;\s*)token\s*\=\s*([^;]*).*$)|^.*$/,
          "$1"
        );

      await Promise.all(
        activeBanners.map((id) => {
          const banner = banners.find((b) => b._id === id);
          return fetch(`${API_BASE_URL}/banners/admin/${id}`, {
            method: "PUT",
            credentials: "include",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ ...banner, isActive: false }),
          });
        })
      );

      await fetchBanners();
      setSelectedBanners([]);

      toast.dismiss(toastId);
      toast.success(
        `${activeBanners.length} banners deactivated successfully!`,
        {
          icon: "⚫",
        }
      );
    } catch (error) {
      toast.dismiss(toastId);
      toast.error("Error deactivating banners");
    }
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (e) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  };

  const handleSelectBanner = (id, selected) => {
    setSelectedBanners(
      selected
        ? [...selectedBanners, id]
        : selectedBanners.filter((bannerId) => bannerId !== id)
    );
  };

  const handleSelectAll = (selected) => {
    setSelectedBanners(
      selected ? paginatedBanners.map((banner) => banner._id) : []
    );
  };

  const handleSortChange = (newSortConfig) => {
    setSortConfig(newSortConfig);
  };

  const formatLocation = (location) => {
    const locationMap = {
      "homepage-carousel": "Homepage Carousel",
      homepage: "Homepage Banner",
      advertisement: "Advertisement Banner",
    };
    return locationMap[location] || location;
  };

  const tableConfig = {
    columns: [
      {
        key: "banner",
        label: "Banner",
        sortable: false,
        width: "280px",
        customRenderer: (banner) => (
          <div className="flex items-start gap-3 py-3 w-full">
            <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 flex-shrink-0 border border-gray-200 dark:border-gray-600">
              {banner.image ? (
                <img
                  src={banner.image}
                  alt={banner.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = "none";
                    e.target.nextSibling.style.display = "flex";
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <i className="fas fa-image text-gray-400 text-sm"></i>
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0 space-y-1.5 overflow-hidden">
              <div className="text-sm font-medium text-gray-900 dark:text-white">
                <div
                  className="text-wrap leading-relaxed"
                  style={{
                    whiteSpace: "normal",
                    wordWrap: "break-word",
                    wordBreak: "break-word",
                    maxWidth: "200px",
                  }}
                  title={banner.title}
                >
                  {banner.title || "Untitled Banner"}
                </div>
              </div>

              {banner.subtitle && (
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  <div
                    className="text-wrap leading-relaxed"
                    style={{
                      whiteSpace: "normal",
                      wordWrap: "break-word",
                      wordBreak: "break-word",
                      maxWidth: "200px",
                    }}
                    title={banner.subtitle}
                  >
                    {banner.subtitle}
                  </div>
                </div>
              )}

              {banner.url && (
                <div className="text-sm text-blue-600 dark:text-blue-400">
                  <div className="flex items-start gap-1">
                    <i className="fas fa-external-link-alt flex-shrink-0 mt-1"></i>
                    <span
                      className="text-wrap-url min-w-0 flex-1"
                      style={{
                        whiteSpace: "normal",
                        wordBreak: "break-all",
                        overflowWrap: "anywhere",
                        maxWidth: "180px",
                      }}
                      title={banner.url}
                    >
                      {banner.url}
                    </span>
                  </div>
                </div>
              )}

              {banner.buttonText && (
                <div className="text-sm text-gray-400 dark:text-gray-500">
                  <span
                    className="text-wrap"
                    style={{
                      whiteSpace: "normal",
                      wordWrap: "break-word",
                      wordBreak: "break-word",
                      maxWidth: "200px",
                    }}
                  >
                    CTA: "{banner.buttonText}"
                  </span>
                </div>
              )}
            </div>
          </div>
        ),
      },
      {
        key: "location",
        label: "Location",
        sortable: true,
        width: "50px",
        customRenderer: (banner) => {
          const locationColors = {
            "homepage-carousel":
              "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
            homepage:
              "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
            advertisement:
              "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
          };

          const shortLocationMap = {
            "homepage-carousel": "Carousel",
            homepage: "Home",
            advertisement: "Ads",
          };

          return (
            <span
              className={`px-2 py-1 rounded-full text-sm font-medium ${
                locationColors[banner.location] || "bg-gray-100 text-gray-800"
              }`}
              title={formatLocation(banner.location)}
            >
              {shortLocationMap[banner.location] || banner.location}
            </span>
          );
        },
      },
      {
        key: "position",
        label: "Pos",
        sortable: true,
        width: "50px",
        customRenderer: (banner) => (
          <div className="text-center">
            <span className="inline-flex items-center justify-center w-8 h-8 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-full text-sm font-medium">
              {banner.position || 1}
            </span>
          </div>
        ),
      },
      {
        key: "days left",
        label: "Days Left",
        sortable: true,
        width: "80px",
        customRenderer: (banner) => {
          if (!banner.startDate || !banner.endDate) {
            return <span className="text-gray-400 text-sm">-</span>;
          }

          const startDate = new Date(banner.startDate);
          const endDate = new Date(banner.endDate);
          const now = new Date();

          let daysLeft = 0;
          let status = "";
          let color = "";

          if (now < startDate) {
            daysLeft = Math.ceil((startDate - now) / (1000 * 60 * 60 * 24));
            status = "starts";
            color = "text-blue-600 dark:text-blue-400";
          } else if (now > endDate) {
            daysLeft = Math.ceil((now - endDate) / (1000 * 60 * 60 * 24));
            status = "expired";
            color = "text-red-600 dark:text-red-400";
          } else {
            daysLeft = Math.ceil((endDate - now) / (1000 * 60 * 60 * 24));
            status = "left";
            color = "text-green-600 dark:text-green-400";
          }

          return (
            <div className={`text-sm font-medium ${color} text-center`}>
              <div>
                {daysLeft}d {status}
              </div>
            </div>
          );
        },
      },
      {
        key: "status",
        label: "Status",
        sortable: false,
        width: "90px",
        customRenderer: (banner) => {
          return (
            <div className="flex flex-col items-center space-y-1">
              <select
                value={banner.isActive ? "active" : "inactive"}
                onChange={(e) => {
                  e.stopPropagation();
                  const newStatus = e.target.value === "active";
                  if (newStatus !== banner.isActive) {
                    handleToggleStatus(banner._id);
                  }
                }}
                className={`text-sm border rounded px-2 py-1.5 font-medium focus:outline-none focus:ring-2 focus:ring-primary transition-colors ${
                  banner.isActive
                    ? "text-green-700 bg-green-50 border-green-300 hover:bg-green-100 dark:bg-green-900/20 dark:text-green-300 dark:border-green-600 dark:hover:bg-green-900/30"
                    : "text-red-700 bg-red-50 border-red-300 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-300 dark:border-red-600 dark:hover:bg-red-900/30"
                }`}
                onClick={(e) => e.stopPropagation()}
              >
                <option
                  value="active"
                  className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                  Active
                </option>
                <option
                  value="inactive"
                  className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                  Inactive
                </option>
              </select>
            </div>
          );
        },
      },
      {
        key: "created",
        label: "Created",
        sortable: true,
        width: "70px",
        customRenderer: (banner) => {
          if (!banner.createdAt) {
            return <span className="text-gray-400">-</span>;
          }

          return (
            <div className="text-sm text-gray-600 dark:text-gray-400 text-center">
              {new Date(banner.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}
            </div>
          );
        },
      },
      {
        key: "actions",
        label: "Actions",
        sortable: false,
        width: "80px",
        customRenderer: (banner) => (
          <div className="flex items-center justify-center space-x-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleEditBanner(banner._id);
              }}
              className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 p-1 rounded transition-colors"
              title="Edit banner"
            >
              <i className="fas fa-edit text-sm"></i>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteBanner(banner._id);
              }}
              className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 p-1 rounded transition-colors"
              title="Delete banner"
            >
              <i className="fas fa-trash text-sm"></i>
            </button>
          </div>
        ),
      },
    ],
  };

  return (
    <div className="p-6 bg-background min-h-screen">
      {isLoading ? (
        <BannersSkeleton />
      ) : (
        <>
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                Banners
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Manage promotional banners across your site
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => fetchBanners(true, true)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                title="Refresh banners"
                disabled={isRefreshing}
              >
                <i
                  className={`fas fa-sync-alt ${isRefreshing ? "fa-spin" : ""}`}
                ></i>
              </button>

              <select
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-white text-text dark:bg-gray-700 dark:text-white"
              >
                <option value="all">All Locations</option>
                <option value="homepage-carousel">Homepage Carousel</option>
                <option value="homepage">Homepage Banner</option>
                <option value="advertisement">Advertisement Banner</option>
              </select>

              <button
                onClick={handleAddBanner}
                className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-md flex items-center transition-colors"
              >
                <i className="fas fa-plus mr-2"></i>
                Add New Banner
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
              <div className="flex items-center gap-1">
                <div className="w-9 h-9 flex justify-center items-center bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <i className="fas fa-images text-blue-600 dark:text-blue-400"></i>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Total Banners
                  </p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {banners.length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
              <div className="flex items-center gap-1">
                <div className="w-9 h-9 flex justify-center items-center bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <i className="fas fa-check text-green-600 dark:text-green-400"></i>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Active
                  </p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {
                      banners.filter((b) => {
                        const now = new Date();
                        const start = new Date(b.startDate);
                        const end = new Date(b.endDate);
                        return b.isActive && now >= start && now <= end;
                      }).length
                    }
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
              <div className="flex items-center gap-1">
                <div className="w-9 h-9 flex justify-center items-center bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <i className="fas fa-clock text-blue-600 dark:text-blue-400"></i>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Scheduled
                  </p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {
                      banners.filter((b) => {
                        const now = new Date();
                        const start = new Date(b.startDate);
                        return b.isActive && now < start;
                      }).length
                    }
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
              <div className="flex items-center gap-1">
                <div className="w-9 h-9 flex justify-center items-center bg-red-100 dark:bg-red-900/30 rounded-lg">
                  <i className="fas fa-times-circle text-red-600 dark:text-red-400"></i>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Expired
                  </p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {
                      banners.filter((b) => {
                        const now = new Date();
                        const end = new Date(b.endDate);
                        return now > end;
                      }).length
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              {isRefreshing ? (
                <div className="flex justify-center items-center py-12">
                  <div className="flex flex-col items-center">
                    <i className="fas fa-spinner fa-spin text-primary text-2xl mb-2"></i>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                      Refreshing banners...
                    </p>
                  </div>
                </div>
              ) : (
                <Table
                  data={paginatedBanners}
                  columns={tableConfig.columns}
                  selectedItems={selectedBanners}
                  onSelect={handleSelectBanner}
                  onSelectAll={handleSelectAll}
                  sortConfig={sortConfig}
                  onSortChange={handleSortChange}
                  itemKey="_id"
                  emptyMessage="No banners found. Create your first banner to get started!"
                  enableSelection={true}
                  enableSorting={true}
                />
              )}
            </div>

            {!isRefreshing && filteredBanners.length > 0 && (
              <Pagination
                page={page}
                rowsPerPage={rowsPerPage}
                totalItems={filteredBanners.length}
                handlePageChange={handlePageChange}
                handleRowsPerPageChange={handleRowsPerPageChange}
                entityName="banners"
              />
            )}
          </div>

          {selectedBanners.length > 0 && (
            <BulkActions
              selectedItems={selectedBanners}
              entityName="banners"
              actions={[
                {
                  label: "Delete",
                  icon: "fas fa-trash",
                  onClick: handleBulkDelete,
                  className:
                    "bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors",
                  title: "Delete selected banners",
                },
                {
                  label: "Activate",
                  icon: "fas fa-toggle-on",
                  onClick: handleBulkActivate,
                  className:
                    "bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-colors",
                  title: "Activate selected banners",
                },
                {
                  label: "Deactivate",
                  icon: "fas fa-toggle-off",
                  onClick: handleBulkDeactivate,
                  className:
                    "bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md transition-colors",
                  title: "Deactivate selected banners",
                },
              ]}
            />
          )}
        </>
      )}
    </div>
  );
}

export default Banners;
