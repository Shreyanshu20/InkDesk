import React from "react";

function PriceDisplay({
  price,
  originalPrice,
  discount,
  size = "md",
  formatPrice,
}) {
  const sizeClasses = {
    sm: "text-sm",
    md: "text-lg",
    lg: "text-2xl",
    xl: "text-3xl",
  };

  // Default format price function if none is provided
  const formatPriceWithFallback = (value) => {
    if (formatPrice && typeof formatPrice === "function") {
      return formatPrice(value);
    }
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "INR",
    }).format(value);
  };

  return (
    <div className="flex items-center">
      <span className={`${sizeClasses[size]} mr-3`}>
        {formatPriceWithFallback(price)}
      </span>

      {originalPrice && (
        <>
          <span className={`${sizeClasses[size]} text-text/70 line-through`}>
            {formatPriceWithFallback(originalPrice)}
          </span>
        </>
      )}
    </div>
  );
}

export default PriceDisplay;
