import React, { useState, useEffect, useContext, useRef } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { AppContent } from "../../Context/AppContent.jsx";
import { useCategories } from "../../Context/CategoryContext.jsx";
import FilterMenu from "./components/FilterMenu";
import Sorting from "./components/Sorting";
import Products from "./components/Products";
import NoProduct from "./components/NoProduct";
import Pagination from "../Common/Pagination";
import PageHeader from "../Common/PageHeader";
import Newsletter from "../HomePage/Newsletter/Newsletter";
import ProductsGridSkeleton from "./components/ProductsGridSkeleton.jsx";

const ProductsPage = () => {
  const { category, subcategory } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const { backendUrl } = useContext(AppContent);
  const { categories } = useCategories();

  // Ref for products section
  const productsEndRef = useRef(null);
  const [showMobileControls, setShowMobileControls] = useState(true);
  const [isNavbarSidebarOpen, setIsNavbarSidebarOpen] = useState(false);

  // States
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Filter states
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortOption, setSortOption] = useState("relevance");
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 16;

  // Available brands state
  const [availableBrands, setAvailableBrands] = useState([]);

  // Check for navbar mobile menu state
  useEffect(() => {
    const checkNavbarMobileMenu = () => {
      // Look for the mobile menu sidebar element
      const mobileMenuSidebar = document.querySelector(
        'div[class*="translate-x-0"][class*="fixed"][class*="left-0"]'
      );
      const mobileMenuOverlay = document.querySelector(
        'div[class*="bg-black/50"][class*="fixed"][class*="inset-0"]'
      );

      // Check if mobile menu is open
      const isOpen =
        (mobileMenuSidebar &&
          !mobileMenuSidebar.classList.contains("-translate-x-full")) ||
        (mobileMenuOverlay && mobileMenuOverlay.style.display !== "none");

      setIsNavbarSidebarOpen(isOpen);
    };

    // Check initially
    checkNavbarMobileMenu();

    // Create mutation observer to watch for DOM changes
    const observer = new MutationObserver(() => {
      checkNavbarMobileMenu();
    });

    // Watch the document body for changes
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["class", "style"],
    });

    return () => observer.disconnect();
  }, []);

  // Scroll handler to show/hide mobile controls
  useEffect(() => {
    const handleScroll = () => {
      if (productsEndRef.current) {
        const rect = productsEndRef.current.getBoundingClientRect();
        const isVisible = rect.bottom > window.innerHeight;
        setShowMobileControls(isVisible);
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Check initial state

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // All other functions remain exactly the same...
  const fetchProducts = async () => {
    setIsLoading(true);

    try {
      console.log("🔍 Fetching products...");
      console.log("Backend URL:", backendUrl);
      console.log("Current searchTerm state:", searchTerm);
      console.log("URL search param:", searchParams.get("search"));

      const url = `${backendUrl}/products`;
      const params = new URLSearchParams();

      params.append("page", currentPage);
      params.append("limit", productsPerPage);

      // Use search term from URL if available, otherwise use state
      const urlSearchTerm = searchParams.get("search");
      const activeSearchTerm = urlSearchTerm || searchTerm;
      
      if (activeSearchTerm && activeSearchTerm.trim()) {
        params.append("search", activeSearchTerm.trim());
        console.log("🎯 Adding search term to query:", activeSearchTerm);
      }

      if (category && category !== "all") {
        params.append("category", category);
      }

      if (subcategory && subcategory !== "all") {
        const subcategoryName = subcategory.replace(/-/g, " ");
        params.append("subcategory", subcategoryName);
        console.log("🎯 Adding subcategory to query:", subcategoryName);
      }

      // Handle subcategory from search dropdown
      const subcategoryQuery = searchParams.get("subcategory");
      if (subcategoryQuery && !category && !subcategory) {
        params.append("subcategory", subcategoryQuery);
        console.log("🎯 Adding subcategory from search dropdown:", subcategoryQuery);
      }

      if (selectedCategories.length > 0) {
        selectedCategories.forEach((catId) => {
          params.append("selectedCategories", catId);
        });
      }

      if (selectedBrands.length > 0) {
        selectedBrands.forEach((brand) => {
          params.append("brand", brand);
        });
      }

      if (priceRange[1] < 5000) {
        params.append("maxPrice", priceRange[1]);
      }

      if (inStockOnly) {
        params.append("inStock", "true");
      }

      // Handle special URL parameters
      const featuredParam = searchParams.get("featured");
      const discountParam = searchParams.get("discount");
      
      if (featuredParam === "true") {
        params.append("featured", "true");
      }
      
      if (discountParam === "true") {
        params.append("discount", "true");
      }

      if (sortOption !== "relevance") {
        const [field, order] = sortOption.split("-");

        let backendField = field;
        if (field === "price") {
          backendField = "product_price";
        } else if (field === "product_rating") {
          backendField = "product_rating";
        } else if (field === "product_name") {
          backendField = "product_name";
        } else if (field === "createdAt") {
          backendField = "createdAt";
        }

        params.append("sortBy", backendField);
        params.append("order", order || "asc");

        console.log(`🔧 Sorting by: ${backendField} (${order})`);
      }

      console.log("🔍 Final API Parameters:", params.toString());
      console.log("🌐 Full API URL:", `${url}?${params.toString()}`);

      const response = await axios.get(`${url}?${params.toString()}`);

      if (response.data.success) {
        const productsData = response.data.products;
        setProducts(productsData);
        setFilteredProducts(productsData);
        setTotalProducts(
          response.data.pagination?.totalProducts || productsData.length
        );
        setTotalPages(response.data.pagination?.totalPages || 1);

        console.log("✅ Products loaded successfully:", productsData.length);
        console.log("📊 Total products found:", response.data.pagination?.totalProducts || productsData.length);
      } else {
        console.error("❌ API returned success: false", response.data);
        toast.error(response.data.message || "Failed to load products");
      }
    } catch (error) {
      console.error("❌ Error fetching products:", error);

      if (error.response) {
        console.error("Error response:", error.response.data);
        toast.error(`Server error: ${error.response.status}`);
      } else if (error.request) {
        console.error("Network error - no response received");
        toast.error(
          "Cannot connect to server. Please check if backend is running on port 5000."
        );
      } else {
        console.error("Error message:", error.message);
        toast.error(`Error: ${error.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const fetchBrands = async () => {
    try {
      const url = `${backendUrl}/products/brands`;
      console.log("Fetching ALL brands from:", url);

      const response = await axios.get(url);
      console.log("Brands response:", response.data);

      if (response.data.success) {
        const allBrands = response.data.brands || [];
        setAvailableBrands(allBrands);
        console.log("✅ Loaded all available brands:", allBrands);
      } else {
        console.error("Failed to fetch brands:", response.data);
      }
    } catch (error) {
      console.error("Error fetching brands:", error);
      if (error.response) {
        console.error("Brands error response:", error.response.data);
      }
    }
  };

  useEffect(() => {
    const searchQuery = searchParams.get("search") || "";
    const subcategoryQuery = searchParams.get("subcategory") || "";
    const sortParam = searchParams.get("sort");
    
    console.log("🔍 URL Search Parameters:", {
      search: searchQuery,
      subcategory: subcategoryQuery,
      sort: sortParam
    });
    
    // Update search term immediately when URL changes
    if (searchQuery !== searchTerm) {
      setSearchTerm(searchQuery);
      console.log("🎯 Setting search term from URL:", searchQuery);
    }
    
    // Handle subcategory from search dropdown
    if (subcategoryQuery && !category && !subcategory) {
      console.log("🎯 Subcategory from search dropdown:", subcategoryQuery);
    }

    // Handle sort parameter
    if (sortParam && sortParam !== sortOption) {
      setSortOption(sortParam);
      console.log("🎯 Setting sort option from URL:", sortParam);
    }

    // Always fetch brands when URL parameters change
    fetchBrands();
  }, [searchParams]); // Keep searchParams dependency

  useEffect(() => {
    if (!categories || categories.length === 0) return;

    setSelectedCategories([]);
    setCurrentPage(1);

    if (category && category !== "all") {
      const categoryObj = categories.find(
        (c) => c.category_name.toLowerCase().replace(/\s+/g, "-") === category
      );

      if (categoryObj) {
        setSelectedCategories([categoryObj._id]);
        console.log(
          "🎯 Auto-selected category from URL:",
          categoryObj.category_name
        );
      }
    }
  }, [category, subcategory, categories]);

  useEffect(() => {
    if (categories.length > 0) {
      console.log("🚀 Triggering fetchProducts due to dependency change");
      fetchProducts();
    }
  }, [
    categories,
    searchTerm,
    category,
    subcategory,
    selectedCategories,
    priceRange,
    selectedBrands,
    inStockOnly,
    sortOption,
    currentPage,
    searchParams, // This ensures fetchProducts runs when URL changes
  ]);

  useEffect(() => {
    setCurrentPage(1);
  }, [category, subcategory, searchTerm]);

  const handleBrandToggle = (brand) => {
    console.log("Brand toggle called with:", brand);
    console.log("Current selected brands:", selectedBrands);

    setSelectedBrands((prev) => {
      const newSelection = prev.includes(brand)
        ? prev.filter((b) => b !== brand)
        : [...prev, brand];

      console.log("New brand selection:", newSelection);
      return newSelection;
    });

    setCurrentPage(1);
  };

  const handleCategoryToggle = (categoryId) => {
    console.log("Category toggle called with ID:", categoryId);

    const categoryObj = categories.find((c) => c._id === categoryId);

    setSelectedCategories((prev) => {
      const newSelection = prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [categoryId];

      console.log("New category selection:", newSelection);

      if (newSelection.length === 1 && categoryObj) {
        const categorySlug = categoryObj.category_name
          .toLowerCase()
          .replace(/\s+/g, "-");

        window.history.replaceState(null, "", `/shop/category/${categorySlug}`);
      } else if (newSelection.length === 0) {
        window.history.replaceState(null, "", "/shop");
      }

      return newSelection;
    });

    setCurrentPage(1);
  };

  const clearFilters = () => {
    setPriceRange([0, 5000]);
    setSelectedBrands([]);
    setSelectedCategories([]);
    setInStockOnly(false);
    setSortOption("relevance");
    setSearchTerm("");
    setSearchParams({});
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
    }).format(price);
  };

  // Construct breadcrumbs
  const breadcrumbs = [{ label: "Shop", link: "/shop" }];

  const featuredParam = searchParams.get("featured");
  const discountParam = searchParams.get("discount");
  const sortParam = searchParams.get("sort");

  if (featuredParam === "true") {
    breadcrumbs.push({ label: "Best Sellers" });
  } else if (discountParam === "true") {
    breadcrumbs.push({ label: "Sale Items" });
  } else if (sortParam === "newest-desc") {
    breadcrumbs.push({ label: "New Arrivals" });
  } else if (searchTerm) {
    breadcrumbs.push({ label: `Search: "${searchTerm}"` });
  } else if (category && category !== "all") {
    const categoryObj = categories.find(
      (c) => c.category_name.toLowerCase().replace(/\s+/g, "-") === category
    );
    if (categoryObj) {
      breadcrumbs.push({
        label: categoryObj.category_name,
        link: `/shop/category/${category}`,
      });

      if (subcategory) {
        const subcategoryObj = categoryObj.subcategories?.find(
          (s) =>
            s.subcategory_name.toLowerCase().replace(/\s+/g, "-") ===
            subcategory
        );

        if (subcategoryObj) {
          breadcrumbs.push({
            label: subcategoryObj.subcategory_name,
          });
        }
      }
    }
  } else if (category === "all") {
    breadcrumbs.push({ label: "All Products" });
  }

  const getPageTitle = () => {
    const featuredParam = searchParams.get("featured");
    const discountParam = searchParams.get("discount");
    const sortParam = searchParams.get("sort");
    const subcategoryQuery = searchParams.get("subcategory");

    if (featuredParam === "true") {
      return "Best Sellers";
    }

    if (discountParam === "true") {
      return "Sale Items";
    }

    if (sortParam === "newest-desc") {
      return "New Arrivals";
    }

    if (searchTerm) {
      return `Search Results for "${searchTerm}"`;
    }

    // Handle subcategory from search dropdown
    if (subcategoryQuery && !category && !subcategory) {
      return `${subcategoryQuery}`;
    }

    if (subcategory) {
      const categoryObj = categories.find(
        (c) => c.category_name.toLowerCase().replace(/\s+/g, "-") === category
      );

      if (categoryObj) {
        const subcategoryObj = categoryObj.subcategories?.find(
          (s) =>
            s.subcategory_name.toLowerCase().replace(/\s+/g, "-") ===
            subcategory
        );

        if (subcategoryObj) {
          return subcategoryObj.subcategory_name;
        }
      }
    }

    if (category && category !== "all") {
      const categoryObj = categories.find(
        (c) => c.category_name.toLowerCase().replace(/\s+/g, "-") === category
      );

      if (categoryObj) {
        return categoryObj.category_name;
      }
    }

    return "All Products";
  };

  useEffect(() => {
    if (!categories || categories.length === 0) return;

    if (category && category !== "all") {
      const categoryObj = categories.find(
        (c) => c.category_name.toLowerCase().replace(/\s+/g, "-") === category
      );

      if (categoryObj) {
        if (!selectedCategories.includes(categoryObj._id)) {
          setSelectedCategories([categoryObj._id]);
          console.log(
            "🎯 Synced filter with URL category:",
            categoryObj.category_name
          );
        }
      }
    } else {
      if (selectedCategories.length > 0) {
        setSelectedCategories([]);
        console.log("🔄 Cleared category filter for all products");
      }
    }
  }, [category, categories]);

  return (
    <div className="bg-background text-text min-h-screen">
      <PageHeader title={getPageTitle()} breadcrumbs={breadcrumbs} />

      <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 pb-6 md:pb-10">
        
        <div className="mb-4 md:mb-6">
          <div className="flex items-center justify-between">
            <p className="text-text/70 text-sm md:text-base">
              <span className="font-medium text-text">{totalProducts}</span> {totalProducts === 1 ? "product" : "products"} found
            </p>
            
            <div className="hidden md:block">
              <Sorting
                sortOption={sortOption}
                setSortOption={setSortOption}
              />
            </div>
          </div>
        </div>

        {showMobileControls && !isNavbarSidebarOpen && (
          <div className="md:hidden fixed bottom-0 left-0 right-0 z-20 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 px-5 py-1 shadow-lg">
            <div className="flex items-center justify-center gap-4 max-w-md mx-auto">
              <FilterMenu
                categories={categories}
                selectedCategories={selectedCategories}
                handleCategoryToggle={handleCategoryToggle}
                priceRange={priceRange}
                setPriceRange={setPriceRange}
                availableBrands={availableBrands}
                selectedBrands={selectedBrands}
                handleBrandToggle={handleBrandToggle}
                inStockOnly={inStockOnly}
                setInStockOnly={setInStockOnly}
                clearFilters={clearFilters}
                formatPrice={formatPrice}
                isMobile={true}
              />
              
              <Sorting
                sortOption={sortOption}
                setSortOption={setSortOption}
                isMobile={true}
              />
            </div>
          </div>
        )}

        {/* Desktop Layout */}
        <div className="hidden md:flex gap-6">
          <FilterMenu
            categories={categories}
            selectedCategories={selectedCategories}
            handleCategoryToggle={handleCategoryToggle}
            priceRange={priceRange}
            setPriceRange={setPriceRange}
            availableBrands={availableBrands}
            selectedBrands={selectedBrands}
            handleBrandToggle={handleBrandToggle}
            inStockOnly={inStockOnly}
            setInStockOnly={setInStockOnly}
            clearFilters={clearFilters}
            formatPrice={formatPrice}
          />

          {isLoading ? (
            <ProductsGridSkeleton />
          ) : (
            <div className="flex-1">
              {filteredProducts.length === 0 ? (
                <NoProduct clearFilters={clearFilters} />
              ) : (
                <>
                  <div className="mb-8">
                    <Products
                      products={filteredProducts}
                      formatPrice={formatPrice}
                    />
                  </div>

                  {totalPages > 1 && (
                    <div className="flex justify-center">
                      <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        setCurrentPage={setCurrentPage}
                      />
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>

        {/* Mobile Layout */}
        {isLoading ? (
          <ProductsGridSkeleton />
        ) : (
          <div className="md:hidden pb-20">
            {filteredProducts.length === 0 ? (
              <NoProduct clearFilters={clearFilters} />
            ) : (
              <>
                <div className="mb-6">
                  <Products
                    products={filteredProducts}
                    formatPrice={formatPrice}
                    isMobile={true}
                  />
                </div>

                {totalPages > 1 && (
                  <div className="flex justify-center mb-6" ref={productsEndRef}>
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      setCurrentPage={setCurrentPage}
                    />
                  </div>
                )}
                
                {totalPages <= 1 && <div ref={productsEndRef}></div>}
              </>
            )}
          </div>
        )}
      </div>

      <Newsletter />
    </div>
  );
};

export default ProductsPage;
