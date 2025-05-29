import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { mockBanners } from "../../../utils/mockData";

function BannerForm({ mode = "", viewOnly = false }) {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const isViewMode = viewOnly;
  const isEditMode = mode === "edit" || (!mode && id && !viewOnly);
  const isAddMode = mode === "add" || (!mode && !id);
  
  const [isLoading, setIsLoading] = useState(!!id);
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    image: "",
    position: 1,
    location: "homepage",
    startDate: new Date().toISOString().split("T")[0],
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    url: "",
    isActive: true,
    buttonText: "",
    textPosition: "center",
  });
  
  // Load banner data if editing or viewing
  useEffect(() => {
    if (id) {
      setTimeout(() => {
        const banner = mockBanners.find(b => b.id === parseInt(id));
        if (banner) {
          setFormData({
            title: banner.title,
            subtitle: banner.subtitle || "",
            image: banner.image,
            position: banner.position,
            location: banner.location,
            startDate: banner.startDate,
            endDate: banner.endDate,
            url: banner.url || "",
            isActive: banner.isActive,
            buttonText: banner.buttonText || "",
            textPosition: banner.textPosition || "center",
          });
        }
        setIsLoading(false);
      }, 500);
    }
  }, [id]);
  
  // Handle form field changes
  const handleChange = (e) => {
    if (isViewMode) return;
    
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (isViewMode) return;
    
    // Here you would typically call an API to save the data
    console.log("Form submitted:", formData);
    
    // Simulate successful save
    if (isAddMode) {
      mockBanners.push({
        ...formData,
        id: Math.max(...mockBanners.map(b => b.id)) + 1
      });
    } else if (isEditMode) {
      const index = mockBanners.findIndex(b => b.id === parseInt(id));
      if (index !== -1) {
        mockBanners[index] = { ...mockBanners[index], ...formData };
      }
    }
    
    // Navigate back to banners list
    navigate("/admin/banners");
  };
  
  // Handle cancellation
  const handleCancel = () => {
    navigate("/admin/banners");
  };
  
  // Handle switching from view to edit mode
  const handleEdit = () => {
    navigate(`/admin/banners/edit/${id}`);
  };
  
  // Show loading state
  if (isLoading) {
    return (
      <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen flex justify-center items-center">
        <div className="flex flex-col items-center">
          <i className="fas fa-spinner fa-spin text-primary text-2xl mb-2"></i>
          <p className="text-gray-500 dark:text-gray-400">Loading banner data...</p>
        </div>
      </div>
    );
  }
  
  // Carousel settings section
  const renderCarouselSettings = () => {
    if (formData.location !== "homepage-carousel") return null;
    
    return (
      <div className="mt-4 border-t border-gray-200 dark:border-gray-700 pt-4">
        <h4 className="text-md font-medium text-gray-900 dark:text-white mb-3">
          Carousel Settings
        </h4>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="buttonText"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Button Text (optional)
            </label>
            {isViewMode ? (
              <p className="px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-md">
                {formData.buttonText || "None"}
              </p>
            ) : (
              <input
                type="text"
                id="buttonText"
                name="buttonText"
                value={formData.buttonText}
                onChange={handleChange}
                placeholder="Shop Now"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
              />
            )}
          </div>
          
          <div>
            <label
              htmlFor="textPosition"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Text Position
            </label>
            {isViewMode ? (
              <p className="px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-md">
                {formData.textPosition.charAt(0).toUpperCase() + formData.textPosition.slice(1)}
              </p>
            ) : (
              <select
                id="textPosition"
                name="textPosition"
                value={formData.textPosition}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
              >
                <option value="left">Left Aligned</option>
                <option value="center">Center Aligned</option>
                <option value="right">Right Aligned</option>
              </select>
            )}
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="max-w-4xl mx-auto">
        {/* Form Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
              {isViewMode 
                ? "View Banner" 
                : isEditMode 
                  ? "Edit Banner" 
                  : "Add New Banner"}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {isViewMode
                ? "Banner details"
                : isEditMode
                  ? "Update the banner details below"
                  : "Fill in the details to create a new banner"}
            </p>
          </div>
          <div>
            <button
              onClick={handleCancel}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 mr-2"
            >
              {isViewMode ? "Back" : "Cancel"}
            </button>
            
            {isViewMode ? (
              <button
                onClick={handleEdit}
                className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-md"
              >
                Edit Banner
              </button>
            ) : (
              <button
                type="submit"
                form="banner-form"
                className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-md"
              >
                {isEditMode ? "Update Banner" : "Create Banner"}
              </button>
            )}
          </div>
        </div>
        
        {/* Banner Form */}
        <div className="bg-white dark:bg-gray-800 rounded-md shadow-md overflow-hidden">
          <form id="banner-form" onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left column - Image */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Banner Image
                </label>
                
                {isViewMode ? (
                  <div className="w-full rounded-md overflow-hidden">
                    {formData.image ? (
                      <img
                        src={formData.image}
                        alt={formData.title}
                        className="w-full h-48 object-cover rounded-md"
                      />
                    ) : (
                      <div className="w-full h-48 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                        <i className="fas fa-image text-gray-400 text-3xl"></i>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-md p-4 text-center">
                    {formData.image ? (
                      <div className="relative">
                        <img
                          src={formData.image}
                          alt={formData.title}
                          className="w-full h-40 object-cover rounded-md mb-2"
                        />
                        <button
                          type="button"
                          onClick={() => setFormData({...formData, image: ""})}
                          className="absolute top-2 right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center"
                        >
                          <i className="fas fa-times"></i>
                        </button>
                      </div>
                    ) : (
                      <div className="p-4">
                        <i className="fas fa-cloud-upload-alt text-3xl text-gray-400 mb-2"></i>
                        <p className="text-gray-500">Upload an image or enter URL</p>
                      </div>
                    )}
                    <input
                      type="text"
                      name="image"
                      value={formData.image}
                      onChange={handleChange}
                      placeholder="Image URL"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md mt-2"
                    />
                  </div>
                )}
                
                {/* Preview section could be added here */}
              </div>
              
              {/* Right column - Form fields */}
              <div>
                <div className="grid grid-cols-1 gap-4">
                  {/* Title */}
                  <div>
                    <label
                      htmlFor="title"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      Title
                    </label>
                    {isViewMode ? (
                      <p className="px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-md">
                        {formData.title}
                      </p>
                    ) : (
                      <input
                        type="text"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                      />
                    )}
                  </div>
                  
                  {/* Subtitle */}
                  <div>
                    <label
                      htmlFor="subtitle"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      Subtitle (optional)
                    </label>
                    {isViewMode ? (
                      <p className="px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-md">
                        {formData.subtitle || "None"}
                      </p>
                    ) : (
                      <input
                        type="text"
                        id="subtitle"
                        name="subtitle"
                        value={formData.subtitle}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                      />
                    )}
                  </div>
                  
                  {/* URL */}
                  <div>
                    <label
                      htmlFor="url"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      Link URL
                    </label>
                    {isViewMode ? (
                      <p className="px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-md">
                        {formData.url || "None"}
                      </p>
                    ) : (
                      <input
                        type="url"
                        id="url"
                        name="url"
                        value={formData.url}
                        onChange={handleChange}
                        placeholder="https://"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                      />
                    )}
                  </div>
                  
                  {/* Position and location */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="position"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                      >
                        Position
                      </label>
                      {isViewMode ? (
                        <p className="px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-md">
                          {formData.position}
                        </p>
                      ) : (
                        <input
                          type="number"
                          id="position"
                          name="position"
                          value={formData.position}
                          onChange={handleChange}
                          min="1"
                          required
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                        />
                      )}
                    </div>
                    <div>
                      <label
                        htmlFor="location"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                      >
                        Location
                      </label>
                      {isViewMode ? (
                        <p className="px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-md">
                          {formData.location === "homepage-carousel" 
                            ? "Homepage Carousel" 
                            : formData.location.charAt(0).toUpperCase() + formData.location.slice(1)}
                        </p>
                      ) : (
                        <select
                          id="location"
                          name="location"
                          value={formData.location}
                          onChange={handleChange}
                          required
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                        >
                          <option value="homepage">Homepage</option>
                          <option value="homepage-carousel">Homepage Carousel</option>
                          <option value="category">Category Pages</option>
                          <option value="product">Product Page</option>
                          <option value="checkout">Checkout</option>
                        </select>
                      )}
                    </div>
                  </div>
                  
                  {/* Dates */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="startDate"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                      >
                        Start Date
                      </label>
                      {isViewMode ? (
                        <p className="px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-md">
                          {new Date(formData.startDate).toLocaleDateString()}
                        </p>
                      ) : (
                        <input
                          type="date"
                          id="startDate"
                          name="startDate"
                          value={formData.startDate}
                          onChange={handleChange}
                          required
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                        />
                      )}
                    </div>
                    <div>
                      <label
                        htmlFor="endDate"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                      >
                        End Date
                      </label>
                      {isViewMode ? (
                        <p className="px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-md">
                          {new Date(formData.endDate).toLocaleDateString()}
                        </p>
                      ) : (
                        <input
                          type="date"
                          id="endDate"
                          name="endDate"
                          value={formData.endDate}
                          onChange={handleChange}
                          required
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                        />
                      )}
                    </div>
                  </div>
                  
                  {/* Status */}
                  <div>
                    {isViewMode ? (
                      <div className="mt-2">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300 mr-2">Status:</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          formData.isActive
                            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                            : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                        }`}>
                          {formData.isActive ? "Active" : "Inactive"}
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center mt-2">
                        <input
                          type="checkbox"
                          id="isActive"
                          name="isActive"
                          checked={formData.isActive}
                          onChange={handleChange}
                          className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                        />
                        <label
                          htmlFor="isActive"
                          className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
                        >
                          Active
                        </label>
                      </div>
                    )}
                  </div>
                  
                  {/* Carousel specific options */}
                  {renderCarouselSettings()}
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default BannerForm;