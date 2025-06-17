import React, { useState } from "react";
import { Link } from "react-router-dom";
import PageHeader from "../Common/PageHeader";

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
        "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?ixlib=rb-4.0.3&w=600",
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
        "https://images.unsplash.com/photo-1521747116042-5a810fda9664?ixlib=rb-4.0.3&w=600",
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

  // Static link handler - prevents navigation
  const handleStaticClick = (e) => {
    e.preventDefault();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section with About page style */}
      <section className="relative py-16 md:py-24 bg-gradient-to-b from-primary/40 to-background/90">
        <div className="container mx-auto px-3 md:px-4 max-w-7xl relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <span className="text-primary font-medium mb-2 md:mb-3 inline-block text-sm md:text-base">
              <i className="fas fa-newspaper mr-2"></i>Latest Insights
            </span>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-text mb-4 md:mb-6">
              InkDesk Blog
            </h1>
            <div className="h-1 w-16 md:w-32 bg-primary mx-auto mb-6 md:mb-8"></div>
            <p className="text-base md:text-lg text-text/80 mb-6 md:mb-8 leading-relaxed px-4">
              Insights, tips, and inspiration for stationery enthusiasts,
              students, and professionals. Discover the latest trends and expert
              advice.
            </p>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-6 md:py-8 bg-white dark:bg-[#1a1212] border-y border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-3 md:px-4 max-w-7xl">
          <div className="flex flex-wrap justify-center gap-2 md:gap-4">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-3 py-2 md:px-6 md:py-2 rounded-full font-medium transition-all duration-300 text-xs md:text-sm ${
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
        <section className="py-8 md:py-12">
          <div className="container mx-auto px-3 md:px-4 max-w-7xl">
            <div className="bg-gradient-to-r from-primary/5 to-primary/10 dark:from-primary/10 dark:to-primary/20 rounded-lg md:rounded-2xl overflow-hidden">
              <div className="grid lg:grid-cols-2 gap-0">
                <div className="relative h-48 md:h-64 lg:h-auto">
                  <img
                    src={featuredPost.image}
                    alt={featuredPost.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 md:top-4 md:left-4">
                    <span className="bg-accent text-white px-2 py-1 md:px-3 md:py-1 rounded-full text-xs md:text-sm font-bold">
                      Featured
                    </span>
                  </div>
                </div>
                <div className="p-4 md:p-8 lg:p-12 flex flex-col justify-center">
                  <div className="flex flex-wrap items-center text-primary text-xs md:text-sm mb-3 md:mb-4 gap-2">
                    <span className="bg-primary/10 dark:bg-primary/20 px-2 py-1 md:px-3 md:py-1 rounded-full">
                      {featuredPost.category}
                    </span>
                    <span className="hidden md:inline">
                      {featuredPost.date}
                    </span>
                    <span className="hidden md:inline">•</span>
                    <span>{featuredPost.readTime}</span>
                  </div>
                  <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-text mb-3 md:mb-4">
                    {featuredPost.title}
                  </h2>
                  <p className="text-text/80 mb-4 md:mb-6 text-sm md:text-base lg:text-lg leading-relaxed">
                    {featuredPost.excerpt}
                  </p>
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-0">
                    <div className="flex items-center">
                      <div className="w-8 h-8 md:w-10 md:h-10 bg-primary/20 rounded-full flex items-center justify-center mr-2 md:mr-3">
                        <i className="fas fa-user text-primary text-xs md:text-sm"></i>
                      </div>
                      <span className="text-text font-medium text-xs md:text-sm">
                        By {featuredPost.author}
                      </span>
                    </div>
                    <button
                      onClick={handleStaticClick}
                      className="inline-flex items-center px-4 py-2 md:px-6 md:py-3 bg-primary hover:bg-primary/90 text-white font-semibold rounded-lg transition-colors text-xs md:text-sm"
                    >
                      Read Article
                      <i className="fas fa-arrow-right ml-2"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Blog Posts Grid */}
      <section className="py-8 md:py-16">
        <div className="container mx-auto px-3 md:px-4 max-w-7xl">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 md:mb-8 gap-2">
            <h2 className="text-xl md:text-2xl font-bold text-text">
              {selectedCategory === "All"
                ? "Latest Articles"
                : `${selectedCategory} Articles`}
            </h2>
            <span className="text-text/60 text-xs md:text-sm">
              {filteredPosts.length} article
              {filteredPosts.length !== 1 ? "s" : ""}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
            {filteredPosts.map((post) => (
              <article
                key={post.id}
                className="bg-white dark:bg-[#1a1212] rounded-lg md:rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group border border-gray-200 dark:border-gray-700"
              >
                {/* Image */}
                <div className="relative h-40 md:h-48 overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3 md:top-4 md:left-4">
                    <span className="bg-primary text-white px-2 py-1 md:px-3 md:py-1 rounded-full text-xs font-medium">
                      {post.category}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3 md:top-4 md:right-4">
                    <span className="bg-white/90 dark:bg-gray-800/90 text-text px-2 py-1 rounded-full text-xs font-medium">
                      {post.readTime}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 md:p-6">
                  <div className="flex flex-wrap items-center text-text/60 text-xs md:text-sm mb-2 md:mb-3 gap-1">
                    <i className="far fa-calendar mr-1"></i>
                    <span className="hidden md:inline">{post.date}</span>
                    <span className="md:hidden">
                      {post.date.split(" ")[0]} {post.date.split(" ")[1]}
                    </span>
                    <span className="mx-1 md:mx-2">•</span>
                    <span>By {post.author}</span>
                  </div>

                  <h3 className="text-base md:text-lg lg:text-xl font-bold text-text mb-2 md:mb-3 group-hover:text-primary transition-colors line-clamp-2">
                    <button
                      onClick={handleStaticClick}
                      className="block text-left w-full"
                    >
                      {post.title}
                    </button>
                  </h3>

                  <p className="text-text/80 mb-3 md:mb-4 line-clamp-2 md:line-clamp-3 text-xs md:text-sm leading-relaxed">
                    {post.excerpt}
                  </p>

                  <button
                    onClick={handleStaticClick}
                    className="inline-flex items-center text-primary font-medium hover:text-primary/80 transition-colors text-xs md:text-sm"
                  >
                    Read More
                    <i className="fas fa-arrow-right ml-2 text-xs"></i>
                  </button>
                </div>
              </article>
            ))}
          </div>

          {/* No Results */}
          {filteredPosts.length === 0 && (
            <div className="text-center py-8 md:py-12">
              <div className="text-text/40 mb-3 md:mb-4">
                <i className="fas fa-search text-3xl md:text-4xl"></i>
              </div>
              <h3 className="text-lg md:text-xl font-medium text-text mb-2">
                No articles found
              </h3>
              <p className="text-text/60 text-sm md:text-base">
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
