import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify"; // Changed from react-hot-toast
import Loader from "../Common/Loader";
import Table from "../Common/Table";
import Pagination from "../Common/Pagination";
import BulkActions from "../Common/BulkActions";
import { getProductTableConfig } from "../Common/tableConfig.jsx";
import ProductDetails from "./components/ProductDetails";

// Backend URL configuration - FIXED
const API_BASE_URL =
  import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [view, setView] = useState("list");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });
  const [totalProducts, setTotalProducts] = useState(0);

  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation(); // Add location hook

  // Fetch products from backend with owner filter
  const fetchProducts = async () => {
    try {
      setIsLoading(true);

      const params = new URLSearchParams();
      params.append("page", page + 1);
      params.append("limit", rowsPerPage);

      if (searchQuery) {
        params.append("search", searchQuery);
      }

      if (categoryFilter !== "all") {
        const categoryObj = categories.find(
          (c) => c.category_name === categoryFilter
        );
        if (categoryObj) {
          params.append("selectedCategories", categoryObj._id);
        }
      }

      // ✅ Add status filter to backend call
      if (statusFilter !== "all") {
        if (statusFilter === "active") {
          params.append("inStock", "true");
        } else if (statusFilter === "out_of_stock") {
          params.append("inStock", "false");
        }
      }

      if (sortConfig.key) {
        let sortBy = sortConfig.key;
        if (sortBy === "name") sortBy = "product_name";
        else if (sortBy === "price") sortBy = "product_price";
        else if (sortBy === "inventory") sortBy = "product_stock";
        else if (sortBy === "category") sortBy = "product_category";

        params.append("sortBy", sortBy);
        params.append(
          "order",
          sortConfig.direction === "ascending" ? "asc" : "desc"
        );
      }

      console.log('🔍 Fetching admin products with params:', params.toString());

      const response = await axios.get(
        `${API_BASE_URL}/products/admin?${params.toString()}`,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );

      console.log('📦 Backend response:', response.data);

      if (response.data.success) {
        const transformedProducts = response.data.products.map((product) => ({
          id: product._id,
          name: product.product_name,
          description: product.product_description,
          price: product.product_price,
          inventory: product.product_stock,
          category: product.product_category,
          subcategory: product.product_subcategory,
          brand: product.product_brand,
          images: product.product_image ? [product.product_image] : [],
          rating: product.product_rating || 0,
          discount: product.product_discount || 0,
          status: product.product_stock > 0 ? "active" : "out_of_stock",
          createdAt: product.createdAt,
          updatedAt: product.updatedAt,
          owner: product.owner,
        }));

        console.log('🔄 Transformed products for seller:', transformedProducts);
        console.log(`📊 Seller has ${transformedProducts.length} products of ${response.data.pagination?.totalProducts} total`);

        setProducts(transformedProducts);
        setTotalProducts(response.data.pagination?.totalProducts || 0); // ✅ Make sure this is set correctly
      }
    } catch (error) {
      console.error("❌ Error fetching seller's products:", error);
      if (error.response?.status === 401) {
        toast.error("Please login to access admin products");
      } else {
        toast.error("Failed to load your products");
      }
      setProducts([]); // ✅ Clear products on error
      setTotalProducts(0); // ✅ Reset total on error
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch categories from backend
  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/categories`);
      if (response.data.success) {
        setCategories(response.data.categories);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Failed to load categories");
    }
  };

  // Fetch single product by ID
  const fetchProductById = async (productId) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/products/${productId}`
      );
      if (response.data.success) {
        const product = response.data.product;
        const transformedProduct = {
          id: product._id,
          name: product.product_name,
          description: product.product_description,
          price: product.product_price,
          inventory: product.product_stock,
          category: product.product_category,
          subcategory: product.product_subcategory,
          brand: product.product_brand,
          images: product.product_image ? [product.product_image] : [],
          rating: product.product_rating || 0,
          discount: product.product_discount || 0,
          status: product.product_stock > 0 ? "active" : "out_of_stock",
          createdAt: product.createdAt,
          updatedAt: product.updatedAt,
        };
        setCurrentProduct(transformedProduct);
      }
    } catch (error) {
      console.error("Error fetching product:", error);
      toast.error("Failed to load product details");
      navigate("/admin/products");
    }
  };

  // Delete product
  const deleteProduct = async (productId) => {
    try {
      const response = await axios.delete(
        `${API_BASE_URL}/products/${productId}`,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );
      if (response.data.success) {
        toast.success("Product deleted successfully"); // react-toastify
        return true;
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      if (error.response?.status === 401) {
        toast.error("Unauthorized to delete this product"); // react-toastify
      } else if (error.response?.status === 403) {
        toast.error("You can only delete your own products"); // react-toastify
      } else {
        toast.error("Failed to delete product"); // react-toastify
      }
      return false;
    }
  };

  // Add a refresh function
  const refreshProducts = useCallback(() => {
    setPage(0); // Reset to first page
    fetchProducts();
  }, [fetchProducts]);

  // Load initial data
  useEffect(() => {
    fetchCategories();
  }, []);

  // Fetch products when dependencies change
  useEffect(() => {
    if (categories.length > 0) {
      fetchProducts();
    }
  }, [page, rowsPerPage, searchQuery, categoryFilter, statusFilter, sortConfig, categories]); // ✅ Add statusFilter

  // Update the useEffect that handles URL parameters
  useEffect(() => {
    if (id) {
      fetchProductById(id);
      setView("view");
    } else {
      // Reset to list view and fetch products
      setView("list");
      if (categories.length > 0) {
        setPage(0); // Reset to first page
        fetchProducts();
      }
    }
  }, [id, categories]);

  // Add effect to handle refresh from navigation state
  useEffect(() => {
    if (location.state?.refresh) {
      console.log('🔄 Refreshing products due to navigation state');
      fetchProducts();
      // Clear the state to prevent repeated refreshes
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  // Check if coming from product form
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    if (urlParams.get('refresh') === 'true') {
      // Remove the refresh parameter from URL
      const newUrl = window.location.pathname;
      window.history.replaceState({}, document.title, newUrl);
      
      // Refresh the products
      if (categories.length > 0) {
        setPage(0);
        fetchProducts();
      }
    }
  }, [location.search]);

  // Add this useEffect to watch for timestamp changes:
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const timestamp = urlParams.get('t');
    
    if (timestamp) {
      console.log('🔄 Timestamp detected - forcing refresh');
      
      // Clean URL
      window.history.replaceState({}, document.title, window.location.pathname);
      
      // Force complete refresh
      setPage(0);
      setSearchQuery("");
      setCategoryFilter("all");
      setStatusFilter("all");
      
      // Trigger fetchProducts
      if (categories.length > 0) {
        fetchProducts();
      }
    }
  }, [location.search, categories]);

  // Handle product actions
  const handleViewProduct = (productId) => {
    navigate(`/admin/products/view/${productId}`);
  };

  const handleEditProduct = (productId) => {
    navigate(`/admin/products/edit/${productId}`);
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      const success = await deleteProduct(productId);
      if (success) {
        fetchProducts(); // Refresh the list
      }
    }
  };

  const handleDelete = async (ids) => {
    if (
      window.confirm(
        `Delete ${ids.length > 1 ? "these products" : "this product"}?`
      )
    ) {
      try {
        // Delete products one by one (you might want to implement bulk delete in backend)
        const deletePromises = ids.map((id) => deleteProduct(id));
        const results = await Promise.all(deletePromises);

        if (results.every((result) => result)) {
          toast.success(`${ids.length} product(s) deleted successfully`);
          setSelectedProducts([]);
          fetchProducts(); // Refresh the list

          if (view === "view" && ids.includes(currentProduct?.id)) {
            navigate("/admin/products");
          }
        }
      } catch (error) {
        toast.error("Some products could not be deleted");
      }
    }
  };

  const handleSelectProduct = (id, selected) => {
    setSelectedProducts(
      selected
        ? [...selectedProducts, id]
        : selectedProducts.filter((productId) => productId !== id)
    );
  };

  const handleSelectAll = (selected) => {
    if (selected) {
      // Select all products on current page
      const currentPageIds = products.map((p) => p.id);
      setSelectedProducts([...new Set([...selectedProducts, ...currentPageIds])]);
    } else {
      // Deselect all products on current page
      const currentPageIds = products.map((p) => p.id);
      setSelectedProducts(selectedProducts.filter(id => !currentPageIds.includes(id)));
    }
  };

  const handlePageChange = (newPage) => {
    console.log('📄 Changing page from', page, 'to', newPage);
    setPage(newPage);
  };

  const handleRowsPerPageChange = (e) => {
    const newRowsPerPage = parseInt(e.target.value, 10);
    console.log('📊 Changing rows per page from', rowsPerPage, 'to', newRowsPerPage);
    setRowsPerPage(newRowsPerPage);
    setPage(0); // Reset to first page
  };

  // Get table configuration
  const tableConfig = getProductTableConfig(
    handleViewProduct,
    handleEditProduct,
    handleDeleteProduct
  );

  // Render product details view
  if (view === "view" && currentProduct) {
    return (
      <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
        <ProductDetails
          product={currentProduct}
          onBack={() => {
            setView("list");
            navigate("/admin/products");
          }}
          onEdit={() => navigate(`/admin/products/edit/${currentProduct.id}`)}
          onDelete={() => handleDelete([currentProduct.id])}
        />
      </div>
    );
  }

  // Render product list view
  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
            My Products
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {totalProducts} products you're selling
          </p>
        </div>
        <button
          onClick={() => navigate("/admin/products/add")}
          className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-md flex items-center gap-2 font-medium"
        >
          <i className="fas fa-plus"></i>
          <span>Add Product</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 bg-white dark:bg-gray-800 p-4 rounded-md shadow-sm grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Search */}
        <div>
          <label
            htmlFor="search"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Search
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <i className="fas fa-search text-gray-400"></i>
            </div>
            <input
              id="search"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 placeholder-gray-500 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-primary focus:border-primary"
              placeholder="Search products..."
            />
          </div>
        </div>

        {/* Category Filter */}
        <div>
          <label
            htmlFor="category-filter"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Category
          </label>
          <select
            id="category-filter"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          >
            <option value="all">All Categories</option>
            {categories.map((category) => (
              <option key={category._id} value={category.category_name}>
                {category.category_name}
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div>
          <label
            htmlFor="status-filter"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Status
          </label>
          <select
            id="status-filter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="out_of_stock">Out of Stock</option>
          </select>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white dark:bg-gray-800 rounded-md shadow-sm">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader />
          </div>
        ) : (
          <>
            <Table
              data={products} // ✅ Use products directly from backend
              columns={tableConfig.columns}
              selectedItems={selectedProducts}
              onSelectItem={handleSelectProduct}
              onSelectAll={handleSelectAll}
              sortConfig={sortConfig}
              onSortChange={setSortConfig}
              isLoading={isLoading}
              emptyMessage="No products found"
              enableSelection={true}
              enableSorting={true}
              itemKey="id"
            />

            {/* Pagination */}
            <Pagination
              page={page}
              rowsPerPage={rowsPerPage}
              totalItems={totalProducts} // ✅ Use backend total, not filtered length
              handlePageChange={handlePageChange}
              handleRowsPerPageChange={handleRowsPerPageChange}
              entityName="products"
            />
          </>
        )}
      </div>

      {/* Bulk Actions */}
      {selectedProducts.length > 0 && (
        <BulkActions
          selectedItems={selectedProducts}
          entityName="products"
          actions={[
            {
              label: "Delete",
              onClick: handleDelete,
              className:
                "bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded-md",
              icon: "fas fa-trash",
              title: "Delete selected products",
            },
          ]}
        />
      )}
    </div>
  );
}

export default Products;
