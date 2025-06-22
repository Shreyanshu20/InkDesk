import React from "react";

const ActionButton = ({ 
  onClick, 
  icon, 
  title, 
  variant = "default",
  disabled = false,
  size = "sm"
}) => {
  // Define color variants
  const variants = {
    view: "text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20",
    edit: "text-emerald-600 hover:text-emerald-800 dark:text-emerald-400 dark:hover:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/20", 
    delete: "text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20",
    status: "text-amber-600 hover:text-amber-800 dark:text-amber-400 dark:hover:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-900/20",
    default: "text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900/20"
  };

  // Define sizes
  const sizes = {
    xs: "p-1",
    sm: "p-1.5", 
    md: "p-2"
  };

  const baseClasses = `
    inline-flex items-center justify-center
    rounded-md font-medium transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-current
    ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
    ${sizes[size]}
    ${variants[variant]}
  `.trim().replace(/\s+/g, ' ');

  return (
    <button
      onClick={disabled ? undefined : onClick}
      className={baseClasses}
      title={title}
      disabled={disabled}
    >
      <i className={`${icon} text-sm`} aria-hidden="true"></i>
    </button>
  );
};

export default ActionButton;