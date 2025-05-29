import React from "react";

const SearchBar = ({ searchTerm, handleSearch, placeholder = "Search...", className = "" }) => {
  return (
    <div className={`relative ${className}`}>
      <input
        type="text"
        placeholder={placeholder}
        value={searchTerm}
        onChange={handleSearch}
        className="w-full py-2 px-4 pr-10 rounded-lg border border-gray-500 shadow-sm focus:ring-primary/30 focus:border-primary focus:outline-none"
      />
      <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
        <i className="fas fa-search" aria-hidden="true"></i>
      </div>
    </div>
  );
};

export default SearchBar;