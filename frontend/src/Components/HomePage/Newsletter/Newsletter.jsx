import React, { useState, useEffect } from "react";

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

function Newsletter() {
  const [newsletterBanner, setNewsletterBanner] = useState(null);
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const fetchNewsletterBanner = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/banners?location=newsletter`);
        const data = await response.json();
        
        if (data.success && data.banners.length > 0) {
          setNewsletterBanner(data.banners[0]);
        }
      } catch (error) {
        console.error('Error fetching newsletter banner:', error);
      }
    };

    fetchNewsletterBanner();
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
      setMessage({ type: "success", text: "Thank you for subscribing!" });
      setEmail("");
      setTimeout(() => setMessage(null), 5000);
    }, 1500);
  };

  const defaultContent = {
    title: "Stay in the Loop",
    subtitle: "Get the latest updates and special offers delivered to your inbox."
  };

  const content = newsletterBanner || defaultContent;

  return (
    <section 
      className="w-full py-12 md:py-16 px-4 relative"
      style={newsletterBanner?.image ? {
        backgroundImage: `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.5)), url(${newsletterBanner.image})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      } : {
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}
    >
      <div className="max-w-2xl mx-auto text-center">
        {/* Icon */}
        <div className="inline-flex items-center justify-center w-12 h-12 bg-white/20 rounded-full mb-4">
          <i className="fas fa-envelope text-white text-lg"></i>
        </div>

        {/* Title */}
        <h2 className="text-2xl md:text-3xl font-bold mb-3 text-white">
          {content.title}
        </h2>

        {/* Subtitle */}
        <p className="text-base md:text-lg text-white/90 mb-6">
          {content.subtitle}
        </p>

        {/* Form */}
        <form
          onSubmit={handleSubscribe}
          className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto mb-4"
        >
          <div className="flex-grow">
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full px-4 py-3 rounded-lg bg-white/90 text-gray-900 focus:outline-none focus:ring-2 focus:ring-white/50"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isSubmitting}
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-70"
          >
            {isSubmitting ? (
              <>
                <i className="fas fa-spinner fa-spin mr-1"></i>
                Subscribing...
              </>
            ) : (
              "Subscribe"
            )}
          </button>
        </form>

        {/* Trust Indicators */}
        <div className="flex items-center justify-center space-x-4 text-sm text-white/70 mb-4">
          <span className="flex items-center">
            <i className="fas fa-users mr-1"></i>
            10,000+ readers
          </span>
          <span className="flex items-center">
            <i className="fas fa-shield-alt mr-1"></i>
            No spam
          </span>
        </div>

        {/* Message */}
        {message && (
          <div
            className={`px-4 py-2 rounded-lg text-sm ${
              message.type === "error"
                ? "bg-red-500/20 text-red-100"
                : "bg-green-500/20 text-green-100"
            }`}
          >
            {message.text}
          </div>
        )}
      </div>
    </section>
  );
}

export default Newsletter;