import React, { useState, useEffect } from "react";

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

function Banner() {
  const [bannerData, setBannerData] = useState(null);
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const fetchBanner = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/banners?location=homepage`);
        const data = await response.json();
        
        if (data.success && data.banners.length > 0) {
          setBannerData(data.banners[0]);
        }
      } catch (error) {
        console.error('Error fetching homepage banner:', error);
      }
    };

    fetchBanner();
  }, []);

  const handleSubscribe = async (e) => {
    e.preventDefault();

    if (!email.trim() || !email.includes('@')) {
      setMessage({ type: "error", text: "Please enter a valid email address" });
      return;
    }

    setIsSubmitting(true);
    setMessage(null);

    setTimeout(() => {
      setIsSubmitting(false);
      setMessage({ type: "success", text: "Thank you! Check your email for your discount code." });
      setEmail("");
      setTimeout(() => setMessage(null), 5000);
    }, 1500);
  };

  const defaultBanner = {
    title: "Get 10% Off Your First Order!",
    subtitle: "Join our newsletter and receive an exclusive discount code.",
    buttonText: "Get Discount",
    image: "/src/assets/banner.webp"
  };

  const banner = bannerData || defaultBanner;

  return (
    <section 
      className="w-full py-12 md:py-16 px-4 relative"
      style={{ 
        backgroundImage: `linear-gradient(135deg, #667eea 0%, #764ba2 100%), url(${banner.image})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundBlendMode: 'overlay',
        backdropFilter: 'blur(5px)',
      }}
    >
      <div className="max-w-3xl mx-auto text-center text-text">
        <div className="bg-gray-50 dark:bg-gray-800 p-8 md:p-12 rounded-2xl shadow-lg">
          {/* Icon */}
          <div className="inline-flex items-center justify-center w-12 h-12 bg-primary text-white rounded-full mb-4">
            <i className="fas fa-tags"></i>
          </div>

          {/* Title */}
          <h2 className="text-2xl md:text-3xl font-bold mb-3 text-text">
            {banner.title}
          </h2>
          
          {/* Subtitle */}
          <p className="text-text text-base md:text-lg mb-6">
            {banner.subtitle}
          </p>

          {/* Form */}
          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto mb-4">
            <div className="flex-grow">
              <input
                type="email"
                placeholder="Enter your email address"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-500 text-text focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting}
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-70 whitespace-nowrap"
            >
              {isSubmitting ? (
                <>
                  <i className="fas fa-spinner fa-spin mr-1"></i>
                  Please wait...
                </>
              ) : (
                banner.buttonText || "Get Discount"
              )}
            </button>
          </form>

          {/* Trust indicators */}
          <div className="flex items-center justify-center space-x-4 text-sm text-gray-500 mb-4">
            <span className="flex items-center">
              <i className="fas fa-shield-alt mr-1 text-green-500"></i>
              Secure & Private
            </span>
            <span className="flex items-center">
              <i className="fas fa-clock mr-1 text-blue-500"></i>
              Instant Delivery
            </span>
          </div>

          {/* Message */}
          {message && (
            <div className={`px-4 py-2 rounded-lg text-sm ${
              message.type === "error"
                ? "bg-red-50 text-red-700 border border-red-200"
                : "bg-green-50 text-green-700 border border-green-200"
            }`}>
              {message.text}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default Banner;