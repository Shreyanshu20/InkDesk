import React from "react";

const FilterSection = ({ title, children, hasBorder = true }) => {
  return (
    <div className={`${hasBorder ? 'border-b border-gray-300 pb-4' : ''}`}>
      <h3 className="font-medium text-text mb-3">{title}</h3>
      {children}
    </div>
  );
};

export default FilterSection;