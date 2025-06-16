import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import CategoriesSkeleton from "./CategoriesSkeleton";

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fallback static data with your existing structure - in reverse alphabetical order
  const fallbackCategories = [
    {
      id: 1,
      category_name: "Stationery",
      products: "120+ products",
      image: "sat.jpg",
      link: "/shop/category/stationery",
    },
    {
      id: 2,
      category_name: "Office Supplies", 
      products: "85+ products",
      image: "officeSupplies.jpg",
      link: "/shop/category/office-supplies",
    },
    {
      id: 3,
      category_name: "Craft Materials",
      products: "75+ products",
      image: "craft.jpg", 
      link: "/shop/category/craft-materials",
    },
    {
      id: 4,
      category_name: "Art Supplies",
      products: "95+ products", 
      image: "artSupplies.jpg",
      link: "/shop/category/art-supplies",
    },
  ];

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/categories/with-subcategories`);
        const data = await response.json();

        if (data.success && data.categories.length > 0) {
          // Sort categories in reverse alphabetical order (Z to A)
          const sortedCategories = data.categories.sort((a, b) => 
            b.category_name.localeCompare(a.category_name)
          );

          // Map backend data to match your existing structure
          const mappedCategories = sortedCategories.slice(0, 4).map((category, index) => {
            const fallback = fallbackCategories[index] || fallbackCategories[0];
            
            return {
              id: category._id,
              category_name: category.category_name,
              // Use backend image if available, otherwise fallback to static image
              image: category.category_image || fallback.image,
              // Generate product count from subcategories or use fallback
              products: category.subcategories ? `${category.subcategories.length * 10}+ products` : fallback.products,
              // Generate link from category name
              link: `/shop/category/${category.category_name.toLowerCase().replace(/\s+/g, "-")}`,
            };
          });

          // If we have less than 4 categories from backend, fill with fallback data
          while (mappedCategories.length < 4) {
            const fallbackIndex = mappedCategories.length;
            if (fallbackCategories[fallbackIndex]) {
              mappedCategories.push(fallbackCategories[fallbackIndex]);
            } else {
              break;
            }
          }

          setCategories(mappedCategories);
        } else {
          // Use fallback data if API fails
          setCategories(fallbackCategories);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
        setError("Failed to load categories");
        // Use fallback data on error
        setCategories(fallbackCategories);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Show loading state
  if (loading) {
    return <CategoriesSkeleton />;
  }

  return (
    <section className="bg-background text-text py-8 px-4">
      <div className="max-w-7xl mx-auto h-full">
        {/* Section Header - Compact */}
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-2">
            Shop by Category
          </h2>
          <div className="w-24 h-1 bg-primary mx-auto mt-4"></div>
        </div>

        {/* Categories Grid - Exact Reference Layout */}
        <div className="hidden md:grid grid-cols-4 grid-rows-2 gap-3 h-[70vh]">
          
          {/* Large Left Card - Spans 2 rows */}
          <Link
            to={categories[0].link}
            className="group relative col-span-2 row-span-2 rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300"
          >
            <img
              src={categories[0].image}
              alt={categories[0].category_name}
              className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
              onError={(e) => {
                e.target.src = "sat.jpg"; // Fallback to static image
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
            
            {/* Content - Left Aligned like reference */}
            <div className="group absolute p-4 bottom-6 left-6 text-white">
              <p className="text-sm font-medium text-white/90 mb-2 uppercase tracking-wide group-hover:scale-103 transition-all duration-300">
                {categories[0].products}
              </p>
              <h3 className="text-3xl font-bold mb-4 leading-tight group-hover:scale-103 transition-all duration-300">
                {categories[0].category_name}
              </h3>
              <div className="border-2 border-white/80 group-hover:bg-white group-hover:text-black px-4 py-2 rounded-full inline-flex items-center group-hover:scale-103 transition-all duration-300">
                <span className="font-medium text-sm mr-2">
                  Shop Now
                </span>
                <i className="fas fa-arrow-right text-sm"></i>
              </div>
            </div>
          </Link>

          {/* Top Right Card */}
          <Link
            to={categories[1].link}
            className="group relative col-span-2 rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300"
          >
            <img
              src={categories[1].image}
              alt={categories[1].category_name}
              className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
              onError={(e) => {
                e.target.src = "officeSupplies.jpg"; // Fallback to static image
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
            
            <div className="absolute p-2 bottom-4 left-4 text-white">
              <p className="text-xs font-medium text-white/90 mb-1 uppercase tracking-wide group-hover:scale-103 transition-all duration-300">
                {categories[1].products}
              </p>
              <h3 className="text-2xl font-bold mb-3 leading-tight group-hover:scale-103 transition-all duration-300">
                {categories[1].category_name}
              </h3>
              <div className="border-2 border-white/80 group-hover:bg-white group-hover:text-black px-4 py-2 rounded-full inline-flex items-center group-hover:scale-103 transition-all duration-300">
                <span className="font-medium text-sm mr-2">
                  Shop Now
                </span>
                <i className="fas fa-arrow-right text-sm"></i>
              </div>
            </div>
          </Link>

          {/* Bottom Left Card */}
          <Link
            to={categories[2].link}
            className="group relative col-span-1 rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300"
          >
            <img
              src={categories[2].image}
              alt={categories[2].category_name}
              className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
              onError={(e) => {
                e.target.src = "artSupplies.jpg"; // Fallback to static image
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
            
            <div className="absolute p-2 bottom-3 left-3 text-white">
              <p className="text-xs font-medium text-white/90 mb-1 uppercase tracking-wide group-hover:scale-103 transition-all duration-300">
                {categories[2].products}
              </p>
              <h3 className="text-xl font-bold mb-2 leading-tight group-hover:scale-103 transition-all duration-300">
                {categories[2].category_name}
              </h3>
              <div className="border-2 border-white/80 group-hover:bg-white group-hover:text-black px-4 py-2 rounded-full inline-flex items-center group-hover:scale-103 transition-all duration-300">
                <span className="font-medium text-sm mr-2">
                  Shop Now
                </span>
                <i className="fas fa-arrow-right text-sm"></i>
              </div>
            </div>
          </Link>

          {/* Bottom Right Card */}
          <Link
            to={categories[3].link}
            className="group relative col-span-1 rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300"
          >
            <img
              src={categories[3].image}
              alt={categories[3].category_name}
              className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
              onError={(e) => {
                e.target.src = "craft.jpg"; // Fallback to static image
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
            
            <div className="absolute p-2 bottom-3 left-3 text-white">
              <p className="text-xs font-medium text-white/90 mb-1 uppercase tracking-wide group-hover:scale-103 transition-all duration-300">
                {categories[3].products}
              </p>
              <h3 className="text-xl font-bold mb-2 leading-tight group-hover:scale-103 transition-all duration-300">
                {categories[3].category_name}
              </h3>
              <div className="border-2 border-white/80 group-hover:bg-white group-hover:text-black px-4 py-2 rounded-full inline-flex items-center group-hover:scale-103 transition-all duration-300">
                <span className="font-medium text-sm mr-2">
                  Shop Now
                </span>
                <i className="fas fa-arrow-right text-sm"></i>
              </div>
            </div>
          </Link>
        </div>

        {/* Responsive Mobile Layout */}
        <div className="md:hidden grid grid-cols-1 gap-3">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={category.link}
              className="group relative rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 h-50"
            >
              <img
                src={category.image}
                alt={category.category_name}
                className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                onError={(e) => {
                  // Fallback to static images based on category name
                  const fallbackImages = {
                    "Stationery": "sat.jpg",
                    "Office Supplies": "officeSupplies.jpg",
                    "Art Supplies": "artSupplies.jpg",
                    "Craft Materials": "craft.jpg"
                  };
                  e.target.src = fallbackImages[category.category_name] || "sat.jpg";
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
              
              <div className="absolute p-2 bottom-2 left-2 text-white">
                <p className="text-xs font-medium text-white/90 mb-1 uppercase tracking-wide group-hover:scale-103 transition-all duration-300">
                  {category.products}
                </p>
                <h3 className="text-lg font-bold mb-2 leading-tight group-hover:scale-103 transition-all duration-300">
                  {category.category_name}
                </h3>
                <div className="border border-white/80 group-hover:bg-white group-hover:text-black px-4 py-2 rounded-full inline-flex items-center group-hover:scale-103 transition-all duration-300">
                  <span className="font-medium text-xs mr-1">
                    Shop Now
                  </span>
                  <i className="fas fa-arrow-right text-xs"></i>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Error State */}
        {error && (
          <div className="text-center text-red-500 mt-4">
            <p className="text-sm">{error}</p>
          </div>
        )}
      </div>
    </section>
  );
}

export default Categories;