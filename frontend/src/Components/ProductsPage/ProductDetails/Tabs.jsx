import React from "react";

function Tabs({ activeTab, setActiveTab, product, reviewData }) {
  const tabs = [
    { id: "description", label: "Description", icon: "fas fa-align-left" },
    { id: "specifications", label: "Specifications", icon: "fas fa-list-ul" },
    { id: "reviews", label: "Reviews", icon: "fas fa-star" },
    { id: "shipping", label: "Shipping", icon: "fas fa-truck" },
  ];

  return (
    <div className="border-b border-gray-200 dark:border-gray-600">
      <nav className="flex">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-4 px-6 text-center font-medium transition-colors relative ${
              activeTab === tab.id
                ? "text-primary border-b-2 border-primary bg-primary/5"
                : "text-text/70 hover:text-text hover:bg-background/50"
            }`}
          >
            <i className={`${tab.icon} mr-2`}></i>
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  );
}

export default Tabs;
