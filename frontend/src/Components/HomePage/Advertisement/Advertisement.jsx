import React, { useState, useEffect } from "react";

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

function Advertisement() {
  const [ads, setAds] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAds = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/banners?location=advertisement`);
        const data = await response.json();
        
        if (data.success) {
          setAds(data.banners);
        }
      } catch (error) {
        console.error('Error fetching advertisements:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAds();
  }, []);

  if (isLoading) {
    return (
      <section className="w-full py-12 md:py-16 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="h-8 bg-gray-200 rounded-lg w-64 mx-auto animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-gray-200 animate-pulse rounded-2xl h-80"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (ads.length === 0) {
    return null;
  }

  return (
    <section className="w-full py-12 md:py-16 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Featured Offers
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Don't miss out on these exclusive deals and special promotions
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-primary to-primary-dark mx-auto mt-6 rounded-full"></div>
        </div>
        
        {/* Ads Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {ads.map((ad, index) => (
            <div 
              key={ad._id} 
              className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Image Container */}
              <div className="aspect-w-16 aspect-h-9 relative overflow-hidden">
                <img
                  src={ad.image}
                  alt={ad.title}
                  className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-700"
                />
                
                {/* Overlay Gradients */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
              
              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-0 group-hover:-translate-y-2 transition-transform duration-500">
                {/* Category Badge */}
                <div className="inline-block mb-3">
                  <span className="px-3 py-1 bg-primary/90 backdrop-blur-sm text-white text-sm font-medium rounded-full border border-white/20">
                    Special Offer
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-xl md:text-2xl font-bold mb-2 line-clamp-2">
                  {ad.title}
                </h3>
                
                {/* Subtitle */}
                {ad.subtitle && (
                  <p className="text-sm md:text-base text-gray-200 mb-4 line-clamp-2 opacity-90">
                    {ad.subtitle}
                  </p>
                )}
                
                {/* CTA Button */}
                {ad.url && (
                  <a
                    href={ad.url}
                    className="inline-flex items-center bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 border border-white/30 hover:border-white/50 group/btn"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span>{ad.buttonText || "Learn More"}</span>
                    <i className="fas fa-arrow-right ml-2 text-sm transition-transform duration-300 group-hover/btn:translate-x-1" aria-hidden="true"></i>
                  </a>
                )}
              </div>

              {/* Decorative Elements */}
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30">
                  <i className="fas fa-star text-white text-lg" aria-hidden="true"></i>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <a
            href="/shop"
            className="inline-flex items-center bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
          >
            <span>View All Offers</span>
            <i className="fas fa-chevron-right ml-2" aria-hidden="true"></i>
          </a>
        </div>
      </div>
    </section>
  );
}

export default Advertisement;