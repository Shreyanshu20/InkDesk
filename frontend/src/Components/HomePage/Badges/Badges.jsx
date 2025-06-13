import React from "react";

function Badges() {
  const badges = [
    {
      id: 1,
      title: "Free shipping on orders over ₹99",
      icon: <i className="fa-solid fa-truck-fast"></i>,
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
      iconColor: "text-blue-600 dark:text-blue-400",
    },
    {
      id: 2,
      title: "Premium quality guaranteed products",
      icon: <i className="fa-solid fa-medal"></i>,
      bgColor: "bg-amber-50 dark:bg-amber-900/20",
      iconColor: "text-amber-600 dark:text-amber-400",
    },
    {
      id: 3,
      title: "100% secure payment checkout",
      icon: <i className="fa-solid fa-shield-halved"></i>,
      bgColor: "bg-red-50 dark:bg-red-900/20",
      iconColor: "text-red-600 dark:text-red-400",
    },
    {
      id: 4,
      title: "Easy returns within 10 days",
      icon: <i className="fa-solid fa-rotate-left"></i>,
      bgColor: "bg-purple-50 dark:bg-purple-900/20",
      iconColor: "text-purple-600 dark:text-purple-400",
    },
  ];

  return (
    <section className="p-5 lg:p-10 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {badges.map((badge) => (
            <div
              key={badge.id}
              className="flex items-center gap-3 p-4 lg:p-5 bg-white dark:bg-gray-800/50 rounded-xl border border-primary/20 dark:border-primary/60 hover:shadow-md transition-all duration-300"
            >
              {/* Icon Container */}
              <div className={`flex-shrink-0 w-10 h-10 lg:w-12 lg:h-12 flex items-center justify-center rounded-xl ${badge.bgColor}`}>
                <span className={`text-lg lg:text-xl ${badge.iconColor}`}>
                  {badge.icon}
                </span>
              </div>
              
              {/* Content */}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-text dark:text-white text-sm lg:text-base leading-tight">
                  {badge.title}
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