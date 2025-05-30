import React, { useState } from "react";
import { Link } from "react-router-dom";

function Blogs() {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const blogPosts = [
    {
      id: 1,
      title: "Essential Stationery for Students",
      excerpt:
        "Discover the must-have stationery items every student needs for a successful academic year. From notebooks to pens, we cover everything.",
      image:
        "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?ixlib=rb-4.0.3&w=600",
      date: "May 28, 2025",
      author: "Sarah Johnson",
      category: "Education",
      readTime: "5 min read",
      featured: true,
    },
    {
      id: 2,
      title: "Office Organization Tips",
      excerpt:
        "Transform your workspace with these simple organization strategies using quality office supplies.",
      image:
        "https://images.unsplash.com/photo-1541746972996-4e0b0f93e586?ixlib=rb-4.0.3&w=600",
      date: "May 25, 2025",
      author: "Mike Chen",
      category: "Productivity",
      readTime: "7 min read",
      featured: false,
    },
    {
      id: 3,
      title: "Art Supply Guide for Beginners",
      excerpt:
        "Starting your artistic journey? Here are the essential art supplies every beginner should have.",
      image:
        "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?ixlib=rb-4.0.3&w=600",
      date: "May 22, 2025",
      author: "Emma Wilson",
      category: "Art & Craft",
      readTime: "6 min read",
      featured: false,
    },
    {
      id: 4,
      title: "The Perfect Notebook Guide",
      excerpt:
        "Find the ideal notebook that matches your writing style and needs with our comprehensive guide.",
      image:
        "https://images.unsplash.com/photo-1455390582262-044cdead277a?ixlib=rb-4.0.3&w=600",
      date: "May 20, 2025",
      author: "David Martinez",
      category: "Education",
      readTime: "8 min read",
      featured: false,
    },
    {
      id: 5,
      title: "Choosing the Right Pen",
      excerpt:
        "Different pens serve different purposes. Learn how to select the perfect writing instrument.",
      image:
        "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?ixlib=rb-4.0.3&w=600",
      date: "May 18, 2025",
      author: "Lisa Thompson",
      category: "Reviews",
      readTime: "4 min read",
      featured: false,
    },
    {
      id: 6,
      title: "Creative Journaling Ideas",
      excerpt:
        "Explore journaling techniques to boost your creativity and mindfulness with beautiful stationery.",
      image:
        "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-4.0.3&w=600",
      date: "May 15, 2025",
      author: "Anna Rodriguez",
      category: "Art & Craft",
      readTime: "9 min read",
      featured: false,
    },
  ];

  const categories = [
    "All",
    "Education",
    "Productivity",
    "Art & Craft",
    "Reviews",
  ];

  const filteredPosts =
    selectedCategory === "All"
      ? blogPosts
      : blogPosts.filter((post) => post.category === selectedCategory);

  const featuredPost = blogPosts.find((post) => post.featured);
  const regularPosts = blogPosts.filter((post) => !post.featured);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-primary-dark text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">InkDesk Blog</h1>
          <div className="w-24 h-1 bg-white mx-auto mb-6"></div>
          <p className="text-xl text-white/90 max-w-3xl mx-auto">
            Insights, tips, and inspiration for stationery enthusiasts,
            students, and professionals
          </p>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
                  selectedCategory === category
                    ? "bg-primary text-white shadow-md"
                    : "bg-gray-100 dark:bg-gray-700 text-text hover:bg-gray-200 dark:hover:bg-gray-600"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Post */}
      {featuredPost && selectedCategory === "All" && (
        <section className="py-12 bg-white dark:bg-gray-800">
          <div className="max-w-7xl mx-auto px-4">
            <div className="bg-gradient-to-r from-primary/5 to-primary/10 dark:from-primary/10 dark:to-primary/20 rounded-2xl overflow-hidden">
              <div className="grid lg:grid-cols-2 gap-0">
                <div className="relative h-64 lg:h-auto">
                  <img
                    src={featuredPost.image}
                    alt={featuredPost.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                      Featured
                    </span>
                  </div>
                </div>
                <div className="p-8 lg:p-12 flex flex-col justify-center">
                  <div className="flex items-center text-primary text-sm mb-4">
                    <span className="bg-primary/10 dark:bg-primary/20 px-3 py-1 rounded-full mr-3">
                      {featuredPost.category}
                    </span>
                    <span>{featuredPost.date}</span>
                    <span className="mx-2">•</span>
                    <span>{featuredPost.readTime}</span>
                  </div>
                  <h2 className="text-3xl font-bold text-text mb-4">
                    {featuredPost.title}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 mb-6 text-lg leading-relaxed">
                    {featuredPost.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center mr-3">
                        <i className="fas fa-user text-primary"></i>
                      </div>
                      <span className="text-text font-medium">
                        By {featuredPost.author}
                      </span>
                    </div>
                    <Link
                      to={`/blog/${featuredPost.id}`}
                      className="inline-flex items-center px-6 py-3 bg-primary hover:bg-primary-dark text-white font-semibold rounded-lg transition-colors"
                    >
                      Read Article
                      <i className="fas fa-arrow-right ml-2"></i>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Blog Posts Grid */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-text">
              {selectedCategory === "All"
                ? "Latest Articles"
                : `${selectedCategory} Articles`}
            </h2>
            <span className="text-gray-500 dark:text-gray-400">
              {filteredPosts.length} article
              {filteredPosts.length !== 1 ? "s" : ""}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <article
                key={post.id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group border border-gray-200 dark:border-gray-700"
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-primary text-white px-3 py-1 rounded-full text-xs font-medium">
                      {post.category}
                    </span>
                  </div>
                  <div className="absolute top-4 right-4">
                    <span className="bg-white/90 dark:bg-gray-800/90 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-full text-xs font-medium">
                      {post.readTime}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm mb-3">
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

                  <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
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

          {/* No Results */}
          {filteredPosts.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <i className="fas fa-search text-4xl"></i>
              </div>
              <h3 className="text-xl font-medium text-text mb-2">
                No articles found
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                Try selecting a different category
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default Blogs;
