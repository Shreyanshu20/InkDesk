import React from "react";
import Hero from "./Hero/Hero";
import Badges from "./Badges/Badges";
import Categories from "./Categories/Categories";
import Products from "./Products/Products";
import SubCategories from "./SubCategories/SubCategories.jsx";
import Blogs from "./Blogs/Blogs";
import Banner from "./Banner/Banner";
import Advertisement from "./Advertisement/Advertisement";
import Newsletter from "./Newsletter/Newsletter";

function HomePage() {
  return (
    <main id="main-content">
      <Hero />
      <Badges />
      <Categories />
      <Products />
      <SubCategories
        category="Stationery"
        title="Elevate Your Workspace with Premium Stationery"
        description="Discover our complete range of high-quality stationery items to boost your productivity"
      />
      <SubCategories
        category="Office Supplies"
        title="Complete Your Office with Essential Supplies"
        description="Everything you need to keep your office running smoothly and efficiently"
      />
      <Banner />
      <Advertisement />
      <Blogs />
      <Newsletter />
    </main>
  );
}

export default HomePage;
