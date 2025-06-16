import React, { useState, useEffect } from "react";

const API_BASE_URL =
  import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

function Advertisement({ position = 1 }) {
  const [ad, setAd] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAds = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/banners?location=advertisement`
        );
        const data = await response.json();

        if (data.success && data.banners.length > 0) {
          const targetAd = data.banners.find(
            (banner) => Number(banner.position) === Number(position)
          );

          if (targetAd) {
            setAd(targetAd);
          }
        }
      } catch (error) {
        console.error("Error fetching advertisements:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAds();
  }, [position]);

  const handleAdClick = () => {
    if (ad?.url) {
      window.open(ad.url, "_blank", "noopener noreferrer");
    }
  };

  if (isLoading) {
    return (
      <section className="w-full p-4">
        <div className="bg-gray-200 animate-pulse rounded-lg h-32"></div>
      </section>
    );
  }

  if (!ad) {
    return null;
  }

  return (
    <section className="w-full p-4">
      <div
        className="relative overflow-hidden rounded-lg shadow-md cursor-pointer"
        onClick={handleAdClick}
      >
        <div className="hidden lg:block">
          <img
            src={ad.image}
            alt={ad.title || "Advertisement"}
            className="w-full h-auto object-cover"
            loading="lazy"
          />
        </div>

        <div className="block lg:hidden">
          <img
            src={ad.mobileImage || ad.image}
            alt={ad.title || "Advertisement"}
            className="w-full h-auto object-cover"
            loading="lazy"
          />
        </div>
      </div>
    </section>
  );
}

export default Advertisement;
