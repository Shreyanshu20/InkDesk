import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

function SubCategories({ category, title, description }) {
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Color variations for subcategories
  const bgColors = [
    "bg-blue-50",
    "bg-pink-50", 
    "bg-cyan-50",
    "bg-purple-50",
    "bg-yellow-50",
    "bg-orange-50",
    "bg-green-50",
    "bg-indigo-50",
    "bg-red-50",
    "bg-teal-50",
    "bg-violet-50",
    "bg-rose-50",
  ];

  useEffect(() => {
    const fetchSubcategories = async () => {
      if (!category) {
        setSubcategories([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`${API_BASE_URL}/categories/with-subcategories`);
        
        if (!response.ok) {
          throw new Error(`API request failed with status: ${response.status}`);
        }

        const data = await response.json();

        if (!data.success) {
          throw new Error(`API returned error: ${data.message || 'Unknown error'}`);
        }

        if (!data.categories || !Array.isArray(data.categories)) {
          throw new Error('Invalid response format: categories array not found');
        }

        const targetCategory = data.categories.find(cat => 
          cat.category_name.toLowerCase().trim() === category.toLowerCase().trim()
        );

        if (!targetCategory) {
          throw new Error(`Category "${category}" not found in response`);
        }

        if (!targetCategory.subcategories || !Array.isArray(targetCategory.subcategories)) {
          setSubcategories([]);
          setLoading(false);
          return;
        }

        if (targetCategory.subcategories.length === 0) {
          setSubcategories([]);
          setLoading(false);
          return;
        }

        const mappedSubcategories = targetCategory.subcategories.map((subcat, index) => {
          return {
            id: subcat._id,
            name: subcat.subcategory_name,
            image: subcat.subcategory_image,
            hasValidImage: !!(subcat.subcategory_image && subcat.subcategory_image.trim() !== ''),
            bgColor: bgColors[index % bgColors.length],
            link: `/shop/category/${category.toLowerCase().replace(/\s+/g, "-")}/${subcat.subcategory_name.toLowerCase().replace(/\s+/g, "-")}`,
          };
        });

        setSubcategories(mappedSubcategories);

      } catch (error) {
        setError(error.message);
        setSubcategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSubcategories();
  }, [category]);

  // Show loading state
  if (loading) {
    return (
      <section className="py-10 px-4 md:px-6 bg-background">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-8 md:mb-12 lg:mb-16">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-text mb-3 md:mb-4">
              {title}
            </h2>
            <div className="w-24 h-1 bg-primary mx-auto mt-4"></div>
          </div>
          <div className="flex justify-center items-center h-40">
            <div className="text-center">
              <i className="fas fa-spinner fa-spin text-4xl text-primary mb-4"></i>
              <p className="text-text/70">Loading {category} subcategories...</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Show error state
  if (error) {
    return (
      <section className="py-10 px-4 md:px-6 bg-background">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-8 md:mb-12 lg:mb-16">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-text mb-3 md:mb-4">
              {title}
            </h2>
            <div className="w-24 h-1 bg-primary mx-auto mt-4"></div>
          </div>
          <div className="text-center py-12">
            <i className="fas fa-exclamation-triangle text-4xl text-red-400 mb-4"></i>
            <p className="text-red-600 mb-2">Failed to load {category} subcategories</p>
            <p className="text-text/70 text-sm">{error}</p>
          </div>
        </div>
      </section>
    );
  }

  // Don't render if no subcategories
  if (subcategories.length === 0) {
    return (
      <section className="py-10 px-4 md:px-6 bg-background">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-8 md:mb-12 lg:mb-16">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-text mb-3 md:mb-4">
              {title}
            </h2>
            <div className="w-24 h-1 bg-primary mx-auto mt-4"></div>
          </div>
          <div className="text-center py-12">
            <i className="fas fa-box-open text-4xl text-gray-400 mb-4"></i>
            <p className="text-text/70">No {category} subcategories available yet.</p>
            <p className="text-text/50 text-sm mt-2">Add some subcategories in the admin panel to see them here.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-10 px-4 md:px-6 bg-background">
      <div className="container mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="text-center mb-8 md:mb-12 lg:mb-16">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-text mb-3 md:mb-4">
            {title}
          </h2>
          <div className="w-24 h-1 bg-primary mx-auto mt-4"></div>
          {description && (
            <p className="text-text/70 mt-4 max-w-2xl mx-auto">
              {description}
            </p>
          )}
        </div>

        {/* Subcategories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4 lg:gap-6">
          {subcategories.map((item) => (
            <Link
              key={item.id}
              to={item.link}
              className="group bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 hover:scale-102"
            >
              <div
                className={`${item.bgColor} dark:bg-gray-700 aspect-square flex items-center justify-center p-2 md:p-3 lg:p-4 relative`}
              >
                {item.hasValidImage ? (
                  <>
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-contain group-hover:scale-105 transition-all duration-300"
                      onLoad={(e) => {
                        const fallbackIcon = e.target.parentElement.querySelector('.fallback-icon');
                        if (fallbackIcon) fallbackIcon.style.display = 'none';
                      }}
                      onError={(e) => {
                        e.target.style.display = 'none';
                        const fallbackIcon = e.target.parentElement.querySelector('.fallback-icon');
                        if (fallbackIcon) fallbackIcon.style.display = 'flex';
                      }}
                    />
                    <div className="fallback-icon absolute inset-0 flex items-center justify-center text-gray-400 text-2xl md:text-3xl lg:text-4xl">
                      <i className="fas fa-layer-group"></i>
                    </div>
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-2xl md:text-3xl lg:text-4xl">
                    <i className="fas fa-layer-group"></i>
                  </div>
                )}
              </div>
              <div className="p-3 md:p-4 text-center">
                <h3 className="text-sm md:text-base lg:text-lg font-medium text-text group-hover:text-primary transition-colors duration-300 line-clamp-2">
                  {item.name}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default SubCategories;