import React from "react";
import { Link } from "react-router-dom";

function PageHeader({ title, breadcrumbs }) {
  return (
    <section className="relative py-6 md:py-15 bg-gradient-to-b from-accent/40 to-background/90">
      <div className="container mx-auto px-4 md:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-text mb-4 text-center">
            {title}
          </h1>

          {breadcrumbs && breadcrumbs.length > 0 && (
            <div className="flex items-center justify-center text-sm text-gray-600 dark:text-gray-300">
              <Link to="/" className="hover:text-primary transition-colors">
                Home
              </Link>

              {breadcrumbs.map((breadcrumb, index) => (
                <React.Fragment key={index}>
                  <span className="mx-2">
                    <i className="fas fa-chevron-right text-xs"></i>
                  </span>

                  {index === breadcrumbs.length - 1 ? (
                    <span className="text-primary">{breadcrumb.label}</span>
                  ) : (
                    <Link
                      to={breadcrumb.link}
                      className="hover:text-primary transition-colors"
                    >
                      {breadcrumb.label}
                    </Link>
                  )}
                </React.Fragment>
              ))}
            </div>
          )}

          <div className="h-1 w-24 bg-primary mx-auto mt-4"></div>
        </div>
      </div>
    </section>
  );
}

export default PageHeader;
