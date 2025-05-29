import React from "react";

function Badges() {
  const badges = [
    {
      id: 1,
      title: "Free Shipping",
      description: "Orders over $50",
      icon: <i className="fa-solid fa-truck-fast"></i>,
    },
    {
      id: 2,
      title: "Quality Guaranteed",
      description: "Premium products",
      icon: <i className="fa-solid fa-medal"></i>,
    },
    {
      id: 3,
      title: "24/7 Support",
      description: "Always available",
      icon: <i className="fa-solid fa-headset"></i>,
    },
    {
      id: 4,
      title: "Secure Payment",
      description: "100% secure checkout",
      icon: <i className="fa-solid fa-shield-halved"></i>,
    },
    {
      id: 5,
      title: "Easy Returns",
      description: "30-day money back",
      icon: <i className="fa-solid fa-rotate-left"></i>,
    },
    {
      id: 6,
      title: "Eco-Friendly",
      description: "Sustainable packaging",
      icon: <i className="fa-solid fa-leaf"></i>,
    },
  ];

  return (
    <section className="lg:p-20 p-5 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-3 lg:gap-6">
          {badges.map((badge) => (
            <div
              key={badge.id}
              className="group flex flex-col lg:flex-row items-center gap-1 lg:gap-5 p-3 lg:p-5 bg-background rounded-xl shadow-md hover:shadow-md border-2 border-primary hover:translate-y-[-2px] transition-all duration-300"
            >
              <div className="flex-shrink-0 w-12 h-12 lg:w-14 lg:h-14 flex items-center justify-center rounded-full bg-accent/10 group-hover:bg-accent/30 text-primary text-lg lg:text-2xl transition-colors duration-300">
                {badge.icon}
              </div>
              <div>
                <h3 className="font-semibold text-text text-center text-sm lg:text-lg dark:text-text text-lg group-hover:text-primary transition-colors duration-300">
                  {badge.title}
                </h3>
                <p className="text-text/70 text-center dark:text-text/70 text-sm">
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
