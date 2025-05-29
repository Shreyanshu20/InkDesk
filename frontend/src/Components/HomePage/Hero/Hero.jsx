import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const slides = [
    {
      id: 0,
      tagline: "BEST BOOKSHELF IN TOWN",
      title: "Fiction Classics For",
      subtitle: "Fall & Winter Reading",
      description: "Limited Time Only. While Supplies Last!",
      buttonText: "Shop Now",
      buttonLink: "/shop",
      imageUrl: "/src/assets/hero1.webp",
      imageAlt: "Fiction classics book collection display",
    },
    {
      id: 1,
      tagline: "NEW ARRIVALS",
      title: "Summer Reading",
      subtitle: "Adventure Collection",
      description: "Discover our latest titles for your summer escape!",
      buttonText: "Explore",
      buttonLink: "/shop/new",
      imageUrl: "/src/assets/hero2.webp",
      imageAlt: "Summer adventure book collection",
    },
    {
      id: 2,
      tagline: "SPECIAL PROMOTION",
      title: "Children's Books",
      subtitle: "Educational Series",
      description: "Buy 2 Get 1 Free on all children's titles!",
      buttonText: "View Offer",
      buttonLink: "/shop/children",
      imageUrl: "/src/assets/hero1.webp",
      imageAlt: "Children's educational book series",
    },
  ];

  // Preload images for better user experience
  useEffect(() => {
    const loadImages = async () => {
      const imagePromises = slides.map((slide) => {
        return new Promise((resolve) => {
          const img = new Image();
          img.src = slide.imageUrl;
          img.onload = resolve;
        });
      });
      await Promise.all(imagePromises);
      setImagesLoaded(true);
    };
    loadImages();
  }, []);

  // Auto-advance carousel with ability to pause
  useEffect(() => {
    if (!imagesLoaded || !isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [imagesLoaded, isAutoPlaying]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false); 

    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  return (
    <section
      className="relative w-full h-[70vh] sm:h-[calc(100vh-5rem)] min-h-[450px] max-h-[900px] overflow-hidden"
      aria-label="Featured promotions slider"
    >
      {/* Mobile layout - overlay design similar to desktop but optimized for mobile */}
      <div className="sm:hidden block h-full">
        {slides.map((slide, index) => (
          <div
            key={`mobile-slide-${slide.id}`}
            className={`absolute inset-0 w-full h-full transition-opacity duration-700 flex justify-center ${
              currentSlide === index ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
            aria-hidden={currentSlide !== index}
          >
            {/* Background Image */}
            <div className="absolute inset-0">
              <img
                src={slide.imageUrl}
                alt={slide.imageAlt}
                className="w-full h-full object-cover object-center"
                loading={index === 0 ? "eager" : "lazy"}
              />
              {/* Enhanced overlay for better text contrast on mobile */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/20"></div>
            </div>

            {/* Text overlay for mobile - positioned at the bottom for better readability */}
            <div className="absolute p-5 mt-20 mx-5 bg-white/20 rounded-lg backdrop-blur-sm">
              <div className="mb-2">
                <span className="text-primary uppercase text-xs font-medium tracking-wider inline-block bg-white/90 px-2 py-1 rounded shadow-sm">
                  {slide.tagline}
                </span>
              </div>

              <h2 className="text-2xl font-bold text-white mb-2 leading-tight text-shadow">
                {slide.title}
                <span className="block">{slide.subtitle}</span>
              </h2>

              <div className="relative mb-3">
                <div className="h-1 w-16 bg-primary"></div>
              </div>

              <p className="text-white/90 mb-4 text-sm bg-black/30 p-2 rounded backdrop-blur-sm">
                {slide.description}
              </p>

              <Link
                to={slide.buttonLink}
                className="inline-flex items-center bg-primary hover:bg-primary/90 focus:ring-2 focus:ring-offset-2 focus:ring-primary focus:outline-none text-white px-4 py-2.5 rounded-full font-medium transition-colors shadow-md text-sm"
              >
                {slide.buttonText}
                <i className="fas fa-arrow-right ml-2" aria-hidden="true"></i>
              </Link>
            </div>

            {/* Controls over image - mobile */}
            <div className="absolute bottom-4 left-0 right-0 z-20 flex justify-center">
              <div className="flex items-center gap-2">
                {slides.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => goToSlide(i)}
                    className={`p-3 flex items-center justify-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2`}
                    aria-label={`Go to slide ${i + 1}`}
                    aria-current={currentSlide === i ? "true" : "false"}
                  >
                    <span className={`block w-2 h-2 rounded-full ${
                      currentSlide === i ? "bg-primary" : "bg-white/70"
                    }`}></span>
                  </button>
                ))}
              </div>
            </div>

            {/* Navigation arrows - mobile */}
            <button
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/70 text-gray-900 hover:bg-white focus:outline-none focus:ring-2 focus:ring-primary w-8 h-8 flex items-center justify-center rounded-full shadow-md z-20"
              onClick={prevSlide}
              aria-label="Previous slide"
            >
              <i className="fas fa-chevron-left text-sm" aria-hidden="true"></i>
            </button>

            <button
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/70 text-gray-900 hover:bg-white focus:outline-none focus:ring-2 focus:ring-primary w-8 h-8 flex items-center justify-center rounded-full shadow-md z-20"
              onClick={nextSlide}
              aria-label="Next slide"
            >
              <i className="fas fa-chevron-right text-sm" aria-hidden="true"></i>
            </button>
          </div>
        ))}
      </div>

      {/* Desktop layout - keep as is */}
      <div className="hidden sm:block relative h-full">
        {slides.map((slide, index) => (
          <div
            key={`slide-${slide.id}`}
            className={`absolute inset-0 w-full h-full transition-opacity duration-700 ${
              currentSlide === index ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
            aria-hidden={currentSlide !== index}
          >
            {/* Background Image with proper alt text */}
            <div className="absolute inset-0">
              <img
                src={slide.imageUrl}
                alt={slide.imageAlt}
                className="w-full h-full object-cover object-center"
                loading={index === 0 ? "eager" : "lazy"}
              />
              {/* Add overlay for better text contrast */}
              <div className="absolute inset-0 bg-black/15 md:bg-black/10"></div>
            </div>

            {/* Content positioned on top of image - right-aligned on larger screens */}
            <div className="absolute inset-0 flex items-center">
              <div className="container mx-auto px-4 md:px-8 lg:px-16">
                <div className="max-w-lg ml-auto mr-0 md:mr-8 lg:mr-16">
                  <div className="mb-3">
                    <span className="text-primary uppercase text-xs md:text-sm font-medium tracking-wider inline-block bg-white/80 px-2 py-1 rounded shadow-sm">
                      {slide.tagline}
                    </span>
                  </div>

                  <h2 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 mb-6 leading-tight drop-shadow-sm">
                    {slide.title}
                    <span className="block">{slide.subtitle}</span>
                  </h2>

                  <div className="relative mb-6">
                    <div className="h-1 w-24 md:w-32 bg-primary"></div>
                  </div>

                  <p className="text-gray-800 mb-8 text-base md:text-lg max-w-md bg-white/60 p-2 rounded">
                    {slide.description}
                  </p>

                  <Link
                    to={slide.buttonLink}
                    className="inline-flex items-center bg-primary hover:bg-primary/90 focus:ring-2 focus:ring-offset-2 focus:ring-primary focus:outline-none text-white px-6 md:px-8 py-3 md:py-4 rounded-full font-medium transition-colors shadow-sm text-base"
                  >
                    {slide.buttonText}
                    <i className="fas fa-arrow-right ml-2" aria-hidden="true"></i>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Navigation dots - keep as is */}
        <div className="absolute bottom-6 md:bottom-8 left-0 right-0 z-20 flex justify-center">
          <div className="flex items-center gap-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 md:w-4 md:h-4 p-3 flex items-center justify-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2`}
                aria-label={`Go to slide ${index + 1}`}
                aria-current={currentSlide === index ? "true" : "false"}
              >
                <span className={`block w-2 h-2 md:w-3 md:h-3 rounded-full ${
                  currentSlide === index ? "bg-primary" : "bg-gray-300"
                }`}></span>
              </button>
            ))}
          </div>
        </div>

        {/* Navigation Arrows - keep as is */}
        <button
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/70 text-gray-900 hover:bg-white focus:outline-none focus:ring-2 focus:ring-primary w-12 h-12 flex items-center justify-center rounded-full shadow-md z-20 transition-transform hover:scale-110 active:scale-95"
          onClick={prevSlide}
          aria-label="Previous slide"
        >
          <i className="fas fa-chevron-left text-lg" aria-hidden="true"></i>
        </button>

        <button
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/70 text-gray-900 hover:bg-white focus:outline-none focus:ring-2 focus:ring-primary w-12 h-12 flex items-center justify-center rounded-full shadow-md z-20 transition-transform hover:scale-110 active:scale-95"
          onClick={nextSlide}
          aria-label="Next slide"
        >
          <i className="fas fa-chevron-right text-lg" aria-hidden="true"></i>
        </button>
      </div>

      {/* Play/pause button - visible on all screens */}
      <button
        className="absolute top-4 right-4 z-20 bg-white/70 w-6 h-6 text-sm lg:w-8 lg:h-8 lg:text-md flex items-center justify-center rounded-full shadow-md hover:bg-white focus:outline-none focus:ring-1 focus:ring-primary"
        onClick={() => setIsAutoPlaying(!isAutoPlaying)}
        aria-label={isAutoPlaying ? "Pause automatic slide show" : "Play automatic slide show"}
      >
        <i className={`fas ${isAutoPlaying ? 'fa-pause' : 'fa-play'} text-gray-900`} aria-hidden="true"></i>
      </button>
    </section>
  );
}

export default Hero;