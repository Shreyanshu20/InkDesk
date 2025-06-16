import React from "react";

function Tabs({ activeTab, setActiveTab }) {
  const tabs = [
    { id: "description", label: "Description", icon: "fas fa-align-left" },
    { id: "specifications", label: "Specifications", icon: "fas fa-list-ul" },
    { id: "reviews", label: "Reviews", icon: "fas fa-star" },
    { id: "shipping", label: "Shipping", icon: "fas fa-truck" },
  ];

  return (
    <div className="border-b border-gray-200 dark:border-gray-700">
      <div className="flex overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 md:gap-3 px-3 md:px-6 py-3 md:py-4 text-sm md:text-base font-medium whitespace-nowrap transition-all duration-200 border-b-2 ${
              activeTab === tab.id
                ? "text-primary border-primary bg-primary/5 dark:bg-primary/10"
                : "text-gray-600 dark:text-gray-400 border-transparent hover:text-text hover:bg-gray-100 dark:hover:bg-gray-800"
            }`}
          >
            <i className={`${tab.icon}`}></i>
            <span className="hidden md:inline">{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default Tabs;