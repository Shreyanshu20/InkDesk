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
    <section className="py-16 px-4 bg-background text-text">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Latest from Our Blog
          </h2>
          <div className="w-24 h-1 bg-primary mx-auto mb-4"></div>
          <p className=" text-lg max-w-2xl mx-auto">
            Tips, guides, and inspiration for stationery lovers and productivity enthusiasts
          </p>
        </div>

        {/* Blog Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <article
              key={post.id}
              className="bg-gray-100 dark:bg-gray-900 text-text rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group"
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-primary text-text px-3 py-1 rounded-full text-xs font-medium">
                    {post.category}
                  </span>
                </div>
                <div className="absolute top-4 right-4">
                  <span className="bg-white/90 text-gray-700 px-2 py-1 rounded-full text-xs font-medium">
                    {post.readTime}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-center text-text text-sm mb-3">
                  <i className="far fa-calendar mr-2"></i>
                  <span>{post.date}</span>
                  <span className="mx-2">•</span>
                  <span>By {post.author}</span>
                </div>

                <h3 className="text-xl font-bold text-text mb-3 group-hover:text-primary transition-colors">
                  <Link to={`/blog/${post.id}`} className="block">
                    {post.title}
                  </Link>
                </h3>

                <p className="text-text mb-4 line-clamp-2">
                  {post.excerpt}
                </p>

                <Link
                  to={`/blog/${post.id}`}
                  className="inline-flex items-center text-primary font-medium hover:text-primary-dark transition-colors"
                >
                  Read More
                  <i className="fas fa-arrow-right ml-2 text-sm"></i>
                </Link>
              </div>
            </article>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Link
            to="/blog"
            className="inline-flex items-center px-8 py-3 bg-primary hover:bg-primary-dark text-white font-semibold rounded-lg transition-colors duration-300"
          >
            <i className="fas fa-blog mr-3"></i>
            View All Articles
            <i className="fas fa-arrow-right ml-3"></i>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default Blogs;