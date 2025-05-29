import React from "react";

function StarRating({ rating, showText = true, size = "md", reviewCount = null }) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  
  const sizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
    xl: "text-xl"
  };

  return (
    <div className="flex items-center">
      <div className={`flex ${sizeClasses[size]} text-yellow-500`}>
        {[...Array(5)].map((_, i) => (
          <i
            key={i}
            className={`
              ${i < fullStars 
                ? "fas fa-star" 
                : i < fullStars + (hasHalfStar ? 0.5 : 0) 
                  ? "fas fa-star-half-alt" 
                  : "far fa-star"
              }
            `}
            aria-hidden="true"
          ></i>
        ))}
      </div>
      
      {showText && (
        <span className="ml-3 text-sm text-text/70">
          {rating.toFixed(1)}
          {reviewCount !== null && (
            <> ({reviewCount} {reviewCount === 1 ? "review" : "reviews"})</>
          )}
        </span>
      )}
    </div>
  );
}

export default StarRating;