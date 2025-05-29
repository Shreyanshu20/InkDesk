import React from "react";
import { Link } from "react-router-dom";

function Breadcrumb({ items = [] }) {
  return (
    <div className="text-sm text-text/70 flex items-center flex-wrap">
      <Link to="/" className="hover:text-text transition-colors">
        <i className="fas fa-home mr-1"></i> Home
      </Link>
      
      {items.map((item, index) => (
        <React.Fragment key={index}>
          <span className="mx-1.5">/</span>
          {item.link ? (
            <Link to={item.link} className="hover:text-text transition-colors">
              {item.label}
            </Link>
          ) : (
            <span className="text-text font-medium">{item.label}</span>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

export default Breadcrumb;