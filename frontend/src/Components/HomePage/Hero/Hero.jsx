import React, { useState, useEffect } from "react";

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

function Hero() {
  const [slides, setSlides] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch carousel banners
  useEffect(() => {
    const fetchCarouselBanners = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/banners?location=homepage-carousel`);
        const data = await response.json();
        
        if (data.success && data.banners.length > 0) {
          const formattedSlides = data.banners.map(banner => ({
            id: banner._id,
            tagline: banner.tagline || "FEATURED",
            title: banner.title,
            subtitle: banner.subtitle || "",
            description: banner.description || banner.subtitle || banner.title,
            buttonText: banner.buttonText || "Shop Now",
            buttonLink: banner.url || "/shop",
            imageUrl: banner.image,
            imageAlt: banner.title,
            textPosition: banner.textPosition || "center"
          }));
          setSlides(formattedSlides);
        } else {
          // Fallback slide
          setSlides([
            {
              id: 1,
              tagline: "NEW ARRIVALS",
              title: "Summer Reading Collection",
              subtitle: "Adventure Awaits",
              description: "Discover thrilling tales perfect for your summer adventures!",
              buttonText: "Explore Collection",
              buttonLink: "/shop/summer",
              imageUrl: "/src/assets/hero1.webp",
              imageAlt: "Summer adventure book collection",
              textPosition: "center"
            }
          ]);
        }
      } catch (error) {
        console.error('Error fetching carousel banners:', error);
        setSlides([]);
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
      <section className="relative w-full h-[400px] md:h-[500px] bg-gray-200">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-2"></div>
            <div className="text-gray-500">Loading...</div>
          </div>
        </div>
      </section>
    );
  }

  if (slides.length === 0) {
    return null;
  }

  const currentSlideData = slides[currentSlide];

  // Define positioning classes based on textPosition
  const getPositionClasses = (position) => {
    switch (position) {
      case 'left':
        return {
          container: "justify-start items-center pl-6 md:pl-12 lg:pl-16",
          content: "text-left max-w-lg",
          overlay: "bg-gradient-to-r from-black/70 via-black/40 to-transparent"
        };
      case 'right':
        return {
          container: "justify-end items-center pr-6 md:pr-12 lg:pr-16",
          content: "text-right max-w-lg",
          overlay: "bg-gradient-to-l from-black/70 via-black/40 to-transparent"
        };
      case 'center':
      default:
        return {
          container: "justify-center items-center",
          content: "text-center max-w-2xl",
          overlay: "bg-black/50"
        };
    }
  };

  const positionClasses = getPositionClasses(currentSlideData.textPosition);

  return (
    <section className="relative w-full h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden">
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
            <img
              src={slide.imageUrl}
              alt={slide.imageAlt}
              className="w-full h-full object-cover"
            />
            
            {/* Dark Overlay for text readability */}
            <div className={`absolute inset-0 ${getPositionClasses(slide.textPosition).overlay}`}></div>

            {/* Content Container */}
            <div className={`absolute inset-0 flex px-4 sm:px-6 lg:px-8 ${getPositionClasses(slide.textPosition).container}`}>
              <div className={`${getPositionClasses(slide.textPosition).content} z-10`}>
                {/* Tagline */}
                {slide.tagline && (
                  <div className="mb-4">
                    <span className="inline-block px-4 py-2 bg-primary text-white text-sm font-semibold rounded-full shadow-lg">
                      {slide.tagline}
                    </span>
                  </div>
                )}
                
                {/* Main Title */}
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight drop-shadow-lg">
                  {slide.title}
                </h1>
                
                {/* Subtitle */}
                {slide.subtitle && (
                  <h2 className="text-lg md:text-xl lg:text-2xl text-white/95 font-medium mb-4 drop-shadow-md">
                    {slide.subtitle}
                  </h2>
                )}
                
                {/* Description */}
                <p className="text-base md:text-lg text-white/90 mb-6 leading-relaxed drop-shadow-md">
                  {slide.description}
                </p>
                
                {/* CTA Button */}
                <div className="flex gap-3">
                  <a
                    href={slide.buttonLink}
                    className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 inline-flex items-center shadow-lg hover:shadow-xl"
                  >
                    <span>{slide.buttonText}</span>
                    <i className="fas fa-arrow-right ml-2"></i>
                  </a>
                </div>
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
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-3 rounded-full transition-all duration-300 z-20 backdrop-blur-sm"
            aria-label="Previous slide"
          >
            <i className="fas fa-chevron-left text-lg"></i>
          </button>
          
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-3 rounded-full transition-all duration-300 z-20 backdrop-blur-sm"
            aria-label="Next slide"
          >
            <i className="fas fa-chevron-right text-lg"></i>
          </button>
        </>
      )}

      {/* Slide Indicators */}
      {slides.length > 1 && (
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? "bg-white shadow-lg"
                  : "bg-white/50 hover:bg-white/75"
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