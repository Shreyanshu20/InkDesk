import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Table from "../Common/Table";
import Pagination from "../Common/Pagination";
import BulkActions from "../Common/BulkActions";
import { mockBanners } from "../../utils/mockData";
import { getBannerTableConfig } from "../Common/tableConfig";

function Banners() {
  const navigate = useNavigate();
  
  const [banners, setBanners] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedBanners, setSelectedBanners] = useState([]);
  const [locationFilter, setLocationFilter] = useState("all");
  const [sortConfig, setSortConfig] = useState({
    key: "position",
    direction: "ascending",
  });
  
  // Load banners on component mount
  useEffect(() => {
    // Use setTimeout to simulate API call
    setTimeout(() => {
      setBanners(mockBanners || []);
      setIsLoading(false);
    }, 500);
  }, []);
  
  // Filter banners based on location
  const filteredBanners = locationFilter === "all"
    ? banners
    : banners.filter(banner => banner.location === locationFilter);
  
  // Sort banners based on the current sort configuration
  const sortedBanners = React.useMemo(() => {
    let bannersToSort = [...filteredBanners];
    if (sortConfig.key) {
      bannersToSort.sort((a, b) => {
        if (sortConfig.key === "position") {
          return sortConfig.direction === "ascending"
            ? a.position - b.position
            : b.position - a.position;
        } else if (sortConfig.key === "period") {
          const dateA = new Date(a.startDate).getTime();
          const dateB = new Date(b.startDate).getTime();
          return sortConfig.direction === "ascending"
            ? dateA - dateB
            : dateB - dateA;
        }
        // Default string sort
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }
    return bannersToSort;
  }, [filteredBanners, sortConfig]);
  
  // Simple pagination
  const paginatedBanners = sortedBanners.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );
  
  // Navigation handlers
  const handleViewBanner = (id) => navigate(`/admin/banners/view/${id}`);
  const handleEditBanner = (id) => navigate(`/admin/banners/edit/${id}`);
  const handleAddBanner = () => navigate('/admin/banners/add');
  
  // Toggle banner active status
  const handleToggleStatus = (id) => {
    setBanners(banners.map(banner => 
      banner.id === id ? {...banner, isActive: !banner.isActive} : banner
    ));
  };
  
  // Delete banner
  const handleDeleteBanner = (id) => {
    if (window.confirm("Are you sure you want to delete this banner?")) {
      setBanners(banners.filter(banner => banner.id !== id));
      // Also remove from selected if present
      setSelectedBanners(selectedBanners.filter(bannerId => bannerId !== id));
    }
  };
  
  // Bulk delete
  const handleBulkDelete = (ids) => {
    if (window.confirm(`Are you sure you want to delete ${ids.length} banners?`)) {
      setBanners(banners.filter(banner => !ids.includes(banner.id)));
      setSelectedBanners([]);
    }
  };
  
  // Bulk activate
  const handleBulkActivate = (ids) => {
    setBanners(banners.map(banner => 
      ids.includes(banner.id) ? {...banner, isActive: true} : banner
    ));
    setSelectedBanners([]);
  };
  
  // Bulk deactivate
  const handleBulkDeactivate = (ids) => {
    setBanners(banners.map(banner => 
      ids.includes(banner.id) ? {...banner, isActive: false} : banner
    ));
    setSelectedBanners([]);
  };
  
  // Pagination handlers
  const handlePageChange = (newPage) => {
    setPage(newPage);
  };
  
  const handleRowsPerPageChange = (e) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  };
  
  // Selection handlers
  const handleSelectBanner = (id, selected) => {
    setSelectedBanners(
      selected
        ? [...selectedBanners, id]
        : selectedBanners.filter(bannerId => bannerId !== id)
    );
  };
  
  const handleSelectAll = (selected) => {
    setSelectedBanners(selected ? paginatedBanners.map(banner => banner.id) : []);
  };
  
  // Handle sort change
  const handleSortChange = (newSortConfig) => {
    setSortConfig(newSortConfig);
  };
  
  // Get table config
  const tableConfig = getBannerTableConfig(
    handleViewBanner,
    handleEditBanner,
    handleDeleteBanner,
    handleToggleStatus
  );
  
  // Define renderers for Table component
  const customRenderers = {
    banner: (banner) => (
      <div className="flex items-center">
        <div className="h-16 w-32 rounded overflow-hidden bg-gray-100 dark:bg-gray-700 mr-3">
          {banner.image ? (
            <img 
              src={banner.image} 
              alt={banner.title} 
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center">
              <i className="fas fa-image text-gray-400 text-xl"></i>
            </div>
          )}
        </div>
        <div>
          <div className="font-medium text-gray-900 dark:text-white">
            {banner.title}
          </div>
          {banner.subtitle && (
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {banner.subtitle}
            </div>
          )}
        </div>
      </div>
    ),
    location: (banner) => (
      <div>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          banner.location === "homepage-carousel"
            ? "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400"
            : "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
        }`}>
          {banner.location === "homepage-carousel" 
            ? "Home Carousel" 
            : banner.location.charAt(0).toUpperCase() + banner.location.slice(1)}
        </span>
      </div>
    ),
    period: (banner) => {
      const now = new Date();
      const startDate = new Date(banner.startDate);
      const endDate = new Date(banner.endDate);
      const isActive = banner.isActive && now >= startDate && now <= endDate;
      
      return (
        <div>
          <div className="text-sm">
            {new Date(banner.startDate).toLocaleDateString()} - {new Date(banner.endDate).toLocaleDateString()}
          </div>
          <div className="text-xs mt-1">
            {isActive ? (
              <span className="text-green-600 dark:text-green-400">
                <i className="fas fa-circle text-xs mr-1"></i>
                Currently Active
              </span>
            ) : (
              <span className="text-gray-500 dark:text-gray-400">
                <i className="fas fa-circle text-xs mr-1"></i>
                {now < startDate ? "Scheduled" : "Expired"}
              </span>
            )}
          </div>
        </div>
      );
    },
    status: (banner) => (
      <div className="flex justify-center">
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleToggleStatus(banner.id);
          }}
          className={`relative inline-flex items-center h-6 rounded-full w-11 ${
            banner.isActive 
              ? "bg-green-600 dark:bg-green-500" 
              : "bg-gray-300 dark:bg-gray-600"
          } transition-colors duration-200`}
        >
          <span 
            className={`${
              banner.isActive ? "translate-x-6" : "translate-x-1"
            } inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-200`}
          ></span>
        </button>
      </div>
    )
  };
  
  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Header */}
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
          {/* Simple filter dropdown */}
          <select
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm"
          >
            <option value="all">All Locations</option>
            <option value="homepage">Homepage</option>
            <option value="homepage-carousel">Home Carousel</option>
            <option value="category">Category Pages</option>
            <option value="product">Product Page</option>
            <option value="checkout">Checkout</option>
          </select>
          
          {/* Add button */}
          <button
            onClick={handleAddBanner}
            className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-md flex items-center"
          >
            <i className="fas fa-plus mr-2"></i>
            Add New Banner
          </button>
        </div>
      </div>
      
      {/* Banners table */}
      <div className="bg-white dark:bg-gray-800 rounded-md shadow-md overflow-hidden">
        {isLoading ? (
          <div className="p-12 flex justify-center">
            <div className="flex flex-col items-center">
              <i className="fas fa-spinner fa-spin text-primary text-2xl mb-2"></i>
              <p className="text-gray-500 dark:text-gray-400">Loading banners...</p>
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
            customRenderers={customRenderers}
            itemKey="id"
            emptyMessage="No banners found"
            isSelectable={true}
          />
        )}
        
        {/* Pagination */}
        <Pagination
          page={page}
          rowsPerPage={rowsPerPage}
          totalItems={filteredBanners.length}
          handlePageChange={handlePageChange}
          handleRowsPerPageChange={handleRowsPerPageChange}
          entityName="banners"
        />
      </div>
      
      {/* Bulk Actions */}
      {selectedBanners.length > 0 && (
        <BulkActions
          selectedItems={selectedBanners}
          entityName="banners"
          actions={[
            {
              label: "Delete",
              icon: "fas fa-trash",
              onClick: handleBulkDelete,
              className: "bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded-md",
              title: "Delete selected banners",
            },
            {
              label: "Activate",
              icon: "fas fa-toggle-on",
              onClick: handleBulkActivate,
              className: "bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded-md",
              title: "Activate selected banners",
            },
            {
              label: "Deactivate",
              icon: "fas fa-toggle-off",
              onClick: handleBulkDeactivate,
              className: "bg-gray-600 hover:bg-gray-700 text-white px-4 py-1 rounded-md",
              title: "Deactivate selected banners",
            },
          ]}
        />
      )}
    </div>
  );
}

export default Banners;