import React from "react";
import { Link } from "react-router-dom";

function Button({ 
  children, 
  variant = "primary", 
  size = "md", 
  className = "", 
  as = "button", 
  to, 
  icon,
  disabled = false,
  ...props 
}) {
  const baseClasses = "inline-flex items-center justify-center transition-colors focus:outline-none";
  
  const variantClasses = {
    primary: "bg-primary text-white hover:bg-primary/90 focus:ring-primary/50",
    secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-300/50",
    danger: "bg-red-500 text-white hover:bg-red-600 focus:ring-red-500/50",
    accent: "bg-orange-500 text-white hover:bg-orange-600 focus:ring-orange-500/50",
    outline: "border-2 border-primary text-primary hover:bg-primary hover:text-white focus:ring-primary/50",
    ghost: "text-primary hover:bg-primary/10 focus:ring-primary/50"
  };
  
  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm rounded",
    md: "px-4 py-2 rounded-md",
    lg: "px-5 py-3 rounded-md text-lg",
    xl: "px-6 py-4 rounded-lg text-xl",
    icon: "w-10 h-10 rounded-full p-0"
  };

  const disabledClasses = disabled ? "opacity-60 cursor-not-allowed" : "";
  
  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className} ${disabledClasses}`;
  
  const content = (
    <>
      {icon && <i className={`${icon} ${children ? 'mr-2' : ''}`} aria-hidden="true"></i>}
      {children}
    </>
  );
  
  if (as === "link" && to) {
    return (
      <Link to={to} className={classes} {...props}>
        {content}
      </Link>
    );
  }
  
  return (
    <button className={classes} disabled={disabled} {...props}>
      {content}
    </button>
  );
}

export default Button;