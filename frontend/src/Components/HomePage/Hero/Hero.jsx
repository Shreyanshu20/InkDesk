import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const API_BASE_URL =
  import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

function Hero() {
  const [slides, setSlides] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch carousel banners
  useEffect(() => {
    const fetchCarouselBanners = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/banners?location=homepage-carousel`
        );
        const data = await response.json();

        if (data.success && data.banners.length > 0) {
          const formattedSlides = data.banners.map((banner) => {
            // Construct proper image URL
            let imageUrl = banner.image;
            if (banner.image && !banner.image.includes("http")) {
              imageUrl = banner.image.startsWith("/")
                ? `${API_BASE_URL}${banner.image}`
                : `${API_BASE_URL}/${banner.image}`;
            }

            return {
              id: banner._id,
              title: banner.title,
              subtitle: banner.subtitle,
              buttonText: banner.buttonText || "Shop Now",
              buttonLink: banner.url || "/shop",
              imageUrl: imageUrl,
              imageAlt: banner.title,
              textPosition: banner.textPosition || "left",
            };
          });

          setSlides(formattedSlides);
        }
      } catch (error) {
        console.error("Error fetching carousel banners:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCarouselBanners();
  }, []);

  // Auto-slide functionality
  useEffect(() => {
    if (slides.length > 1) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [slides.length]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  if (isLoading) {
    return (
      <section className="relative w-full h-[400px] md:h-[500px] lg:h-[600px] bg-gray-100">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      </section>
    );
  }

  if (slides.length === 0) {
    return null;
  }

  return (
    <section className="relative w-full h-[60vh] md:h-[70vh] lg:h-[80vh] overflow-hidden">
      {/* Slide Container */}
      <div className="relative w-full h-full">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            {/* Background Image */}
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: `url("${slide.imageUrl}")`,
              }}
            />

            {/* Dark overlay for better text contrast */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-black/10 to-transparent"></div>

            {/* Content positioned based on textPosition from backend */}
            <div
              className={`absolute inset-0 flex items-center px-8 lg:px-16 ${
                slide.textPosition === "center"
                  ? "justify-center text-center"
                  : slide.textPosition === "right"
                  ? "justify-end text-right"
                  : "justify-start text-left"
              }`}
            >
              <div
                className={`z-10 ${
                  slide.textPosition === "center"
                    ? "max-w-2xl md:max-w-3xl lg:max-w-4xl"
                    : "max-w-lg md:max-w-xl lg:max-w-2xl"
                }`}
              >
                {/* Title with strong text shadow */}
                <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 md:mb-6 leading-tight text-white drop-shadow-[2px_2px_2px_rgba(0,0,0,0.5)]">
                  {slide.title}
                </h1>

                {/* Subtitle with text shadow */}
                {slide.subtitle && (
                  <p className="text-base md:text-lg lg:text-xl mb-6 md:mb-8 leading-relaxed text-white/95 drop-shadow-[1px_1px_2px_rgba(0,0,0,0.4)]">
                    {slide.subtitle}
                  </p>
                )}

                {/* CTA Button */}
                {slide.buttonText && (
                  <div>
                    <Link
                      to={slide.buttonLink}
                      className="inline-flex items-center bg-primary hover:bg-primary/90 text-white px-4 py-2 md:px-6 md:py-3 rounded-full font-bold text-sm md:text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                    >
                      <span>{slide.buttonText}</span>
                      <i className="fas fa-arrow-right ml-2 md:ml-3 transition-transform duration-300"></i>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      {slides.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white/30 hover:bg-white/60 text-gray-700 px-2 py-4 md:py-10 rounded-r-md transition-all duration-300 z-20 hover:shadow-md"
            aria-label="Previous slide"
          >
            <i className="fas fa-chevron-left text-sm md:text-base"></i>
          </button>

          <button
            onClick={goToNext}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white/30 hover:bg-white/60 text-gray-700 px-2 py-4  md:py-10 rounded-l-md transition-all duration-300 z-20 hover:shadow-md"
            aria-label="Next slide"
          >
            <i className="fas fa-chevron-right text-sm md:text-base"></i>
          </button>
        </>
      )}

      {/* Slide Indicators */}
      {slides.length > 1 && (
        <div className="absolute bottom-4 md:bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-3 z-10">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`transition-all duration-300 ${
                index === currentSlide
                  ? "w-8 h-2 bg-primary rounded-full shadow-lg"
                  : "w-2 h-2 bg-white/70 hover:bg-white/90 rounded-full"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default Hero;