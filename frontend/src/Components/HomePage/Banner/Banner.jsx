import React, { useState, useEffect } from "react";

const API_BASE_URL =
  import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

function Banner() {
  const [bannerData, setBannerData] = useState(null);
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const fetchBanner = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/banners?location=homepage`
        );
        const data = await response.json();

        if (data.success && data.banners.length > 0) {
          setBannerData(data.banners[0]);
        }
      } catch (error) {}
    };

    fetchBanner();
  }, []);

  const handleSubscribe = async (e) => {
    e.preventDefault();

    if (!email.trim() || !email.includes("@")) {
      setMessage({ type: "error", text: "Please enter a valid email address" });
      return;
    }

    setIsSubmitting(true);
    setMessage(null);

    setTimeout(() => {
      setIsSubmitting(false);
      setMessage({
        type: "success",
        text: "Thank you! Check your email for your discount code.",
      });
      setEmail("");
      setTimeout(() => setMessage(null), 5000);
    }, 1500);
  };

  const defaultBanner = {
    title: "Get 10% Off Your First Order!",
    subtitle: "Join our newsletter and receive an exclusive discount code.",
    buttonText: "Get Discount",
  };

  const banner = bannerData || defaultBanner;

  return (
    <section className="w-full p-4">
      <div className="">
        <div
          className="relative overflow-hidden rounded-lg shadow-md"
          style={
            banner.image
              ? {
                  backgroundImage: `url(${banner.image})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }
              : {
                  background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
                }
          }
        >
          <div className="relative px-4 py-6 md:px-8 md:py-10 text-center">
            <div className="bg-gradient-to-br from-red-400 to-red-900 max-w-xl mx-auto rounded-lg p-4 md:p-6 text-white">
              <div className="inline-flex items-center justify-center w-10 h-10 md:w-12 md:h-12 bg-white/10 rounded-full mb-3 md:mb-4">
                <i className="fas fa-gift text-sm md:text-base"></i>
              </div>
              <h2 className="text-lg md:text-xl lg:text-2xl font-bold mb-2 md:mb-3 leading-tight">
                {banner.title}
              </h2>
              {banner.subtitle && (
                <p className="text-sm md:text-base text-white/90 mb-4 md:mb-6 leading-relaxed">
                  {banner.subtitle}
                </p>
              )}
              <form
                onSubmit={handleSubscribe}
                className="max-w-xs sm:max-w-md md:max-w-lg mx-auto mb-4 md:mb-6"
              >
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1">
                    <input
                      type="email"
                      placeholder="Enter your email"
                      className="w-full px-3 py-2.5 text-sm rounded-md bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isSubmitting}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-primary hover:bg-primary/70 text-white px-4 py-2.5 text-sm font-medium rounded-md transition-all duration-200"
                  >
                    {isSubmitting ? (
                      <>
                        <i className="fas fa-spinner fa-spin mr-2"></i>
                        Processing...
                      </>
                    ) : (
                      banner.buttonText || "Get Discount"
                    )}
                  </button>
                </div>
              </form>
              <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4 text-xs text-white/80 mb-3 md:mb-4">
                <span className="flex items-center">
                  <i className="fas fa-shield-alt mr-1.5 text-green-400"></i>
                  100% Secure
                </span>
                <span className="flex items-center">
                  <i className="fas fa-clock mr-1.5 text-blue-400"></i>
                  Instant Delivery
                </span>
                <span className="flex items-center">
                  <i className="fas fa-envelope mr-1.5 text-yellow-400"></i>
                  No Spam
                </span>
              </div>
              {message && (
                <div
                  className={`inline-block px-3 py-2 rounded-md text-xs font-medium ${
                    message.type === "error"
                      ? "bg-red-500/20 text-red-200 border border-red-400/30"
                      : "bg-green-500/20 text-green-200 border border-green-400/30"
                  }`}
                >
                  <i
                    className={`fas ${
                      message.type === "error"
                        ? "fa-exclamation-circle"
                        : "fa-check-circle"
                    } mr-1`}
                  ></i>
                  {message.text}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Banner;
