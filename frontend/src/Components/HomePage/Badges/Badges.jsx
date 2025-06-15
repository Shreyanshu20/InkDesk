import React from "react";

function Badges() {
  const badges = [
    {
      id: 1,
      title: "Free Shipping",
      description: "On orders over ₹99",
      icon: <i className="fa-solid fa-truck-fast"></i>,
      iconColor: "text-blue-500",
      bgGradient: "from-blue-500/10 to-blue-600/5",
    },
    {
      id: 2,
      title: "Premium Quality",
      description: "Guaranteed products",
      icon: <i className="fa-solid fa-medal"></i>,
      iconColor: "text-amber-500",
      bgGradient: "from-amber-500/10 to-amber-600/5",
    },
    {
      id: 3,
      title: "Secure Payment",
      description: "100% safe checkout",
      icon: <i className="fa-solid fa-shield-halved"></i>,
      iconColor: "text-emerald-500",
      bgGradient: "from-emerald-500/10 to-emerald-600/5",
    },
    {
      id: 4,
      title: "Easy Returns",
      description: "Within 10 days",
      icon: <i className="fa-solid fa-rotate-left"></i>,
      iconColor: "text-purple-500",
      bgGradient: "from-purple-500/10 to-purple-600/5",
    },
  ];

  return (
    <section className="py-10 px-4 md:px-6 bg-background">
      <div className="container mx-auto max-w-7xl">
        {/* Mobile: 2x2 Grid with Icon on Top */}
        <div className="grid grid-cols-2 md:hidden gap-4">
          {badges.map((badge) => (
            <div
              key={badge.id}
              className="group text-center p-4 rounded-2xl bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-800/80 dark:to-gray-900/50 border border-gray-200/50 dark:border-gray-700/50 hover:shadow-lg hover:scale-101 transition-all duration-300 backdrop-blur-sm"
            >
              {/* Icon */}
              <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br from-gray-50 to-white dark:from-gray-700 dark:to-gray-800 border border-gray-200/50 dark:border-gray-600/50 flex items-center justify-center shadow-sm group-hover:shadow-md transition-all duration-300">
                <span className={`text-xl ${badge.iconColor} group-hover:scale-105 transition-transform duration-300`}>
                  {badge.icon}
                </span>
              </div>
              
              {/* Content */}
              <h3 className="font-semibold text-text dark:text-white text-sm mb-1 leading-tight">
                {badge.title}
              </h3>
              <p className="text-xs text-text/70 dark:text-gray-400 leading-tight">
                {badge.description}
              </p>
            </div>
          ))}
        </div>

        {/* Tablet & Desktop: Horizontal Layout */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {badges.map((badge) => (
            <div
              key={badge.id}
              className="group flex items-center gap-3 lg:gap-4 p-4 lg:p-6 rounded-2xl bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-800/80 dark:to-gray-900/50 border border-gray-200/50 dark:border-gray-700/50 hover:shadow-lg hover:scale-102 transition-all duration-300 backdrop-blur-sm"
            >
              {/* Icon Container */}
              <div className="flex-shrink-0 w-12 h-12 lg:w-14 lg:h-14 rounded-xl bg-gradient-to-br from-gray-50 to-white dark:from-gray-700 dark:to-gray-800 border border-gray-200/50 dark:border-gray-600/50 flex items-center justify-center shadow-sm group-hover:shadow-md transition-all duration-300">
                <span className={`text-lg lg:text-xl ${badge.iconColor} group-hover:scale-105 transition-transform duration-300`}>
                  {badge.icon}
                </span>
              </div>
              
              {/* Content */}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-text dark:text-white text-sm lg:text-base mb-1 leading-tight">
                  {badge.title}
                </h3>
                <p className="text-xs lg:text-sm text-text/70 dark:text-gray-400 leading-tight">
                  {badge.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Badges;