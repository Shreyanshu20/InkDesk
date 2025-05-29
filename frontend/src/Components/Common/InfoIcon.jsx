import React from "react";

function InfoIcon({ icon, label, value }) {
  return (
    <div className="flex items-center">
      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mr-3 text-primary">
        <i className={`fas fa-${icon}`}></i>
      </div>
      <div className="text-sm">
        <div className="font-medium text-text">{label}</div>
        <div className="text-text/70">{value}</div>
      </div>
    </div>
  );
}

export default InfoIcon;