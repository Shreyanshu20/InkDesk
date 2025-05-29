import React from "react";

const Checkbox = ({ id, label, checked, onChange, className = "" }) => {
  return (
    <div className={`flex items-center ${className}`}>
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={onChange}
        className="w-4 h-4 border-gray-300 rounded focus:ring-primary"
      />
      <label htmlFor={id} className="ml-2 text-text">
        {label}
      </label>
    </div>
  );
};

export default Checkbox;