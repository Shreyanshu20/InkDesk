import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Table from "../../Common/Table";
import Pagination from "../../Common/Pagination";

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

function SubcategoryTable({ categoryId, categoryName, onClose }) {
  const [subcategories, setSubcategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSubcategories, setSelectedSubcategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [editingSubcategory, setEditingSubcategory] = useState(null);
  const [newSubcategoryName, setNewSubcategoryName] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchSubcategories();
  }, [categoryId]);

  const fetchSubcategories = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `${API_BASE_URL}/admin/categories/${categoryId}/subcategories`,
        { withCredentials: true }
      );

      if (response.data.success) {
        setSubcategories(response.data.subcategories);
      }
    } catch (error) {
      console.error("Error fetching subcategories:", error);
      toast.error("Failed to load subcategories");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddSubcategory = async () => {
    if (!newSubcategoryName.trim()) {
      toast.error("Subcategory name is required");
      return;
    }

    try {
      const response = await axios.post(
        `${API_BASE_URL}/admin/subcategories`,
        {
          subcategory_name: newSubcategoryName.trim(),
          category_id: categoryId,
        },
        { withCredentials: true }
      );

      if (response.data.success) {
        toast.success("Subcategory created successfully");
        setNewSubcategoryName("");
        setShowAddForm(false);
        fetchSubcategories();
      }
    } catch (error) {
      console.error("Error creating subcategory:", error);
      const message = error.response?.data?.message || "Failed to create subcategory";
      toast.error(message);
    }
  };

  const handleUpdateSubcategory = async (subcategoryId, newName, newImage = undefined) => {
    if (!newName.trim()) {
      toast.error("Subcategory name is required");
      return;
    }

    try {
      const updateData = { subcategory_name: newName.trim() };
      if (newImage !== undefined) {
        updateData.subcategory_image = newImage;
      }

      const response = await axios.put(
        `${API_BASE_URL}/admin/subcategories/${subcategoryId}`,
        updateData,
        { withCredentials: true }
      );

      if (response.data.success) {
        toast.success("Subcategory updated successfully");
        setEditingSubcategory(null);
        fetchSubcategories();
      }
    } catch (error) {
      console.error("Error updating subcategory:", error);
      const message = error.response?.data?.message || "Failed to update subcategory";
      toast.error(message);
    }
  };

  const handleImageUpload = async (subcategoryId, file) => {
    if (!file) return;

    // Validate file type
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      toast.error("Please upload only JPG, PNG, or WebP images");
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error("Image must be smaller than 5MB");
      return;
    }

    setUploadingImage(subcategoryId);

    try {
      const formData = new FormData();
      formData.append('images', file);

      // FIX: Use your actual backend API path
      const response = await axios.post(
        `${API_BASE_URL}/api/upload/subcategory-images`,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
          withCredentials: true,
        }
      );

      if (response.data.success && response.data.images.length > 0) {
        const uploadedImg = response.data.images[0];
        
        // Update subcategory with new image
        await handleUpdateSubcategory(
          subcategoryId, 
          subcategories.find(sub => sub._id === subcategoryId)?.subcategory_name || '',
          uploadedImg.url
        );
        
        toast.success("Image uploaded successfully");
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload image');
    } finally {
      setUploadingImage(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemoveImage = async (subcategoryId) => {
    const subcategory = subcategories.find(sub => sub._id === subcategoryId);
    if (!subcategory?.subcategory_image) return;

    try {
      // Update subcategory to remove image
      await handleUpdateSubcategory(
        subcategoryId,
        subcategory.subcategory_name,
        ''
      );
      
      toast.success("Image removed successfully");
    } catch (error) {
      console.error('Error removing image:', error);
      toast.error('Failed to remove image');
    }
  };

  const handleDeleteSubcategory = async (subcategoryId) => {
    if (!window.confirm("Are you sure you want to delete this subcategory?")) {
      return;
    }

    try {
      const response = await axios.delete(
        `${API_BASE_URL}/admin/subcategories/${subcategoryId}`,
        { withCredentials: true }
      );

      if (response.data.success) {
        toast.success("Subcategory deleted successfully");
        fetchSubcategories();
      }
    } catch (error) {
      console.error("Error deleting subcategory:", error);
      const message = error.response?.data?.message || "Failed to delete subcategory";
      toast.error(message);
    }
  };

  const handleBulkDelete = async (selectedIds) => {
    if (!window.confirm(`Delete ${selectedIds.length} selected subcategories?`)) {
      return;
    }

    let successCount = 0;
    for (const id of selectedIds) {
      try {
        await axios.delete(`${API_BASE_URL}/admin/subcategories/${id}`, {
          withCredentials: true,
        });
        successCount++;
      } catch (error) {
        console.error(`Error deleting subcategory ${id}:`, error);
      }
    }

    if (successCount > 0) {
      toast.success(`Successfully deleted ${successCount} subcategories`);
      fetchSubcategories();
    }
    if (successCount < selectedIds.length) {
      toast.warning(
        `${selectedIds.length - successCount} subcategories could not be deleted`
      );
    }

    setSelectedSubcategories([]);
  };

  // Filter subcategories based on search
  const filteredSubcategories = subcategories.filter((sub) =>
    sub.subcategory_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Paginate filtered subcategories
  const paginatedSubcategories = filteredSubcategories.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const tableColumns = [
    {
      key: "subcategory_info",
      label: "Subcategory",
      sortable: true,
      className: "px-6 py-4 whitespace-nowrap",
      customRenderer: (subcategory) => (
        <div className="flex items-center">
          {/* Image */}
          <div className="h-12 w-12 flex-shrink-0 rounded-md overflow-hidden bg-gray-100 dark:bg-gray-700 flex items-center justify-center mr-3">
            {subcategory.subcategory_image ? (
              <img
                src={subcategory.subcategory_image}
                alt={subcategory.subcategory_name}
                className="h-full w-full object-cover"
              />
            ) : (
              <i className="fas fa-layer-group text-gray-400"></i>
            )}
          </div>
          
          {/* Info */}
          <div className="flex-1">
            {editingSubcategory === subcategory._id ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  defaultValue={subcategory.subcategory_name}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      handleUpdateSubcategory(subcategory._id, e.target.value);
                    }
                    if (e.key === "Escape") {
                      setEditingSubcategory(null);
                    }
                  }}
                  className="text-sm border border-gray-300 rounded px-2 py-1 flex-1"
                  autoFocus
                  onFocus={(e) => e.target.select()}
                />
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const input = e.target.closest('.flex').querySelector("input");
                    if (input && input.value.trim()) {
                      handleUpdateSubcategory(subcategory._id, input.value.trim());
                    } else {
                      toast.error("Subcategory name cannot be empty");
                    }
                  }}
                  className="text-green-600 hover:text-green-800 text-xs p-1"
                  title="Save changes"
                >
                  <i className="fas fa-check"></i>
                </button>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setEditingSubcategory(null);
                  }}
                  className="text-red-600 hover:text-red-800 text-xs p-1"
                  title="Cancel editing"
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
            ) : (
              <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {subcategory.subcategory_name}
              </div>
            )}
            <div className="text-xs text-gray-500 dark:text-gray-400">
              ID: {subcategory._id?.slice(-8) || "No ID"}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "image_actions",
      label: "Image",
      sortable: false,
      className: "px-6 py-4 whitespace-nowrap",
      customRenderer: (subcategory) => (
        <div className="flex items-center gap-2">
          {uploadingImage === subcategory._id ? (
            <div className="flex items-center text-blue-600">
              <i className="fas fa-spinner fa-spin mr-1"></i>
              <span className="text-xs">Uploading...</span>
            </div>
          ) : (
            <>
              <button
                onClick={() => {
                  fileInputRef.current.onclick = () => {
                    fileInputRef.current.onchange = (e) => {
                      if (e.target.files[0]) {
                        handleImageUpload(subcategory._id, e.target.files[0]);
                      }
                    };
                  };
                  fileInputRef.current.click();
                }}
                className="text-blue-600 hover:text-blue-800 text-xs flex items-center gap-1"
                title="Upload image"
              >
                <i className="fas fa-upload"></i>
                {subcategory.subcategory_image ? "Change" : "Add"}
              </button>
              
              {subcategory.subcategory_image && (
                <button
                  onClick={() => handleRemoveImage(subcategory._id)}
                  className="text-red-600 hover:text-red-800 text-xs"
                  title="Remove image"
                >
                  <i className="fas fa-trash"></i>
                </button>
              )}
            </>
          )}
        </div>
      ),
    },
    {
      key: "createdAt",
      label: "Created",
      sortable: true,
      className: "px-6 py-4 whitespace-nowrap",
      customRenderer: (subcategory) => (
        <div className="text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center">
            <i className="fas fa-calendar-plus mr-2 text-gray-400"></i>
            {subcategory.createdAt
              ? new Date(subcategory.createdAt).toLocaleDateString("en-IN", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })
              : "Unknown"}
          </div>
        </div>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      sortable: false,
      className: "px-6 py-4 whitespace-nowrap text-right text-sm font-medium",
      customRenderer: (subcategory) => (
        <div className="flex items-center justify-end space-x-2">
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setEditingSubcategory(subcategory._id);
            }}
            className="text-primary hover:text-primary/80 p-1 rounded transition-colors"
            title="Edit subcategory"
            disabled={editingSubcategory === subcategory._id}
          >
            <i className="fas fa-edit"></i>
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleDeleteSubcategory(subcategory._id);
            }}
            className="text-red-600 hover:text-red-700 p-1 rounded transition-colors"
            title="Delete subcategory"
          >
            <i className="fas fa-trash"></i>
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-5xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
          <div>
            <h2 className="text-xl font-semibold text-text">
              Subcategories - {categoryName}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Manage subcategories and their images for this category
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-md text-sm flex items-center gap-2"
            >
              <i className="fas fa-plus"></i>
              Add Subcategory
            </button>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-2"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
        </div>

        {/* Add Form */}
        {showAddForm && (
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 flex-shrink-0">
            <div className="flex items-center gap-3">
              <input
                type="text"
                placeholder="Enter subcategory name"
                value={newSubcategoryName}
                onChange={(e) => setNewSubcategoryName(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") handleAddSubcategory();
                  if (e.key === "Escape") setShowAddForm(false);
                }}
                className="flex-1 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-sm bg-white dark:bg-gray-800 text-text"
                autoFocus
              />
              <button
                onClick={handleAddSubcategory}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm"
              >
                <i className="fas fa-check mr-1"></i>
                Add
              </button>
              <button
                onClick={() => {
                  setShowAddForm(false);
                  setNewSubcategoryName("");
                }}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md text-sm"
              >
                <i className="fas fa-times mr-1"></i>
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Search */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
          <div className="relative">
            <input
              type="search"
              placeholder="Search subcategories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 pl-10 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-text focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
          </div>
        </div>

        {/* Table Container - This is the scrollable area */}
        <div className="flex-1 overflow-y-auto min-h-0">
          <Table
            data={paginatedSubcategories}
            columns={tableColumns}
            selectedItems={selectedSubcategories}
            onSelectItem={(id, selected) => {
              setSelectedSubcategories(
                selected
                  ? [...selectedSubcategories, id]
                  : selectedSubcategories.filter((itemId) => itemId !== id)
              );
            }}
            onSelectAll={(selected) => {
              setSelectedSubcategories(
                selected ? filteredSubcategories.map((item) => item._id) : []
              );
            }}
            isLoading={isLoading}
            emptyMessage="No subcategories found for this category"
            enableSelection={true}
            itemKey="_id"
          />
        </div>

        {/* Pagination */}
        <div className="border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
          <Pagination
            page={page}
            rowsPerPage={rowsPerPage}
            totalItems={filteredSubcategories.length}
            handlePageChange={setPage}
            handleRowsPerPageChange={(e) => {
              setRowsPerPage(parseInt(e.target.value, 10));
              setPage(0);
            }}
            entityName="subcategories"
          />
        </div>

        {/* Bulk Actions */}
        {selectedSubcategories.length > 0 && (
          <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 flex-shrink-0">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {selectedSubcategories.length} subcategories selected
              </span>
              <button
                onClick={() => handleBulkDelete(selectedSubcategories)}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm flex items-center gap-2"
              >
                <i className="fas fa-trash"></i>
                Delete Selected
              </button>
            </div>
          </div>
        )}

        {/* Hidden file input for image uploads */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/webp,image/png"
          className="hidden"
        />
      </div>
    </div>
  );
}

export default SubcategoryTable;