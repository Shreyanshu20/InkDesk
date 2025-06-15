import React from "react";
import { Link } from "react-router-dom";

function Blogs() {
  const blogPosts = [
    {
      id: 1,
      title: "Essential Stationery for Students",
      excerpt: "Discover the must-have stationery items every student needs for a successful academic year.",
      image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?ixlib=rb-4.0.3&w=400",
      date: "May 28, 2025",
      author: "Sarah Johnson",
      category: "Education",
      readTime: "5 min read",
    },
    {
      id: 2,
      title: "Office Organization Tips",
      excerpt: "Transform your workspace with these simple organization strategies using quality office supplies.",
      image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?ixlib=rb-4.0.3&w=400",
      date: "May 25, 2025",
      author: "Mike Chen",
      category: "Productivity",
      readTime: "7 min read",
    },
    {
      id: 3,
      title: "Art Supply Guide for Beginners",
      excerpt: "Starting your artistic journey? Here are the essential art supplies every beginner should have.",
      image: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?ixlib=rb-4.0.3&w=400",
      date: "May 22, 2025",
      author: "Emma Wilson",
      category: "Art & Craft",
      readTime: "6 min read",
    },
  ];

  return (
    <section className="py-10 lg:py-16 px-6 bg-background">
      <div className="container mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="text-center mb-6 md:mb-8 lg:mb-12">
          <h2 className="text-2xl lg:text-3xl font-bold text-text dark:text-white mb-2 md:mb-4">
            Latest from Our Blog
          </h2>
          <div className="w-16 md:w-20 lg:w-24 h-0.5 md:h-1 bg-primary mx-auto mb-2 md:mb-4"></div>
          <p className="text-sm lg:text-base text-text/70 dark:text-gray-400 max-w-2xl mx-auto">
            Tips, guides, and inspiration for stationery lovers and productivity enthusiasts
          </p>
        </div>

        {/* Blog Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 lg:gap-6 mb-6 md:mb-8 lg:mb-12">
          {blogPosts.map((post) => (
            <article
              key={post.id}
              className="group bg-gray-50 dark:bg-gray-800 text-text rounded-lg border border-gray-300 dark:border-gray-600 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 hover:scale-101 h-full flex flex-col border-b-4 border-transparent hover:border-primary"
            >
              {/* Image */}
              <div className="relative h-32 md:h-40 lg:h-48 overflow-hidden flex-shrink-0">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                  loading="lazy"
                  onError={(e) => {
                    e.target.src = "https://placehold.co/400x300?text=Blog+Image";
                  }}
                />
                <div className="absolute top-2 left-2">
                  <span className="bg-primary text-white px-2 md:px-3 py-1 rounded-full text-[10px] md:text-xs font-medium">
                    {post.category}
                  </span>
                </div>
                <div className="absolute top-2 right-2">
                  <span className="bg-white/90 dark:bg-gray-800/90 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-full text-[10px] md:text-xs font-medium">
                    {post.readTime}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-3 md:p-4 lg:p-6 flex-1 flex flex-col">
                <div className="flex items-center text-text/70 dark:text-gray-400 text-[10px] md:text-xs lg:text-sm mb-2 md:mb-3">
                  <i className="far fa-calendar mr-1 md:mr-2"></i>
                  <span>{post.date}</span>
                  <span className="mx-1 md:mx-2">•</span>
                  <span>By {post.author}</span>
                </div>

                <h3 className="text-base lg:text-xl font-bold text-text dark:text-white mb-2 md:mb-3 group-hover:text-primary transition-colors line-clamp-2 overflow-hidden leading-tight">
                  <Link to={`/blog/${post.id}`} className="block">
                    {post.title}
                  </Link>
                </h3>

                <p className="text-xs md:text-sm lg:text-base text-text/70 dark:text-gray-400 mb-3 md:mb-4 line-clamp-2 flex-1">
                  {post.excerpt}
                </p>

                <Link
                  to={`/blog/${post.id}`}
                  className="inline-flex items-center text-primary font-medium hover:text-primary/80 transition-colors text-xs md:text-sm mt-auto"
                >
                  Read More
                  <i className="fas fa-arrow-right ml-1 md:ml-2 text-xs"></i>
                </Link>
              </div>
            </article>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <Link
            to="/blog"
            className="inline-flex items-center px-4 md:px-6 py-2 md:py-2.5 lg:py-3 bg-primary hover:bg-primary/90 text-white font-semibold rounded-lg transition-colors duration-300 text-sm md:text-base"
          >
            <i className="fas fa-blog mr-2 md:mr-3"></i>
            View All Articles
            <i className="fas fa-arrow-right ml-2 md:ml-3"></i>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default Blogs;