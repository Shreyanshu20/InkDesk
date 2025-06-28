import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AppContent } from "../../../Context/AppContent";
import { useCart } from "../../../Context/CartContext";
import axios from "axios";
import Products from "../../HomePage/Products/Products";
import Newsletter from "../../HomePage/Newsletter/Newsletter";
import Tabs from "./Tabs";
import Details from "./Details";
import TabsContent from "./TabsContent";
import Breadcrumb from "../../Common/Breadcrumb";
import PageSkeleton from "./PageSkeleton";

function ProductDetails() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { backendUrl, isLoggedIn } = useContext(AppContent);
  const { addToCart, isLoading: cartLoading } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [activeTab, setActiveTab] = useState("description");

  useEffect(() => {
    setLoading(true);
    setQuantity(1);
    setSelectedImage(0);
    setActiveTab("description");

    const fetchProduct = async () => {
      try {
        setLoading(true);
        const productResponse = await axios.get(
          `${backendUrl}/products/${productId}`
        );
        if (productResponse.data.success) {
          const productData = productResponse.data.product;
          const transformedProduct = {
            id: productData._id,
            _id: productData._id,
            name: productData.product_name,
            author: productData.product_brand || "Unknown Brand",
            price: parseFloat(productData.product_price) || 0,
            originalPrice:
              parseFloat(productData.product_price) +
              parseFloat(productData.product_discount || 0),
            discount: productData.product_discount
              ? Math.round(
                  (parseFloat(productData.product_discount) /
                    parseFloat(productData.product_price)) *
                    100
                )
              : 0,
            sku:
              productData.product_sku ||
              `PRD-${productData._id.slice(-6).toUpperCase()}`,
            stock: parseInt(productData.product_stock) || 0,
            rating: parseFloat(productData.product_rating) || 0,
            reviewCount: productData.review_count || 0,
            description:
              productData.product_description || "No description available.",
            longDescription:
              productData.product_long_description ||
              productData.product_description ||
              "No detailed description available.",
            category: productData.product_category || "Uncategorized",
            subcategory: productData.product_subcategory || "",
            brand: productData.product_brand || "Unknown",
            specifications: [
              { name: "Brand", value: productData.product_brand || "Unknown" },
              {
                name: "Category",
                value: productData.product_category || "Uncategorized",
              },
              {
                name: "Subcategory",
                value: productData.product_subcategory || "N/A",
              },
              {
                name: "Stock",
                value: `${productData.product_stock || 0} units`,
              },
              {
                name: "SKU",
                value:
                  productData.product_sku ||
                  `PRD-${productData._id.slice(-6).toUpperCase()}`,
              },
              { name: "Weight", value: productData.product_weight || "N/A" },
              {
                name: "Dimensions",
                value: productData.product_dimensions || "N/A",
              },
            ],
            reviews: productData.reviews || [],
            tags: [
              productData.product_category,
              productData.product_subcategory,
            ].filter(Boolean),
            images:
              productData.product_images &&
              productData.product_images.length > 0
                ? productData.product_images.map((img) => ({
                    url: img.url,
                    alt_text: img.alt_text || productData.product_name,
                  }))
                : productData.product_image
                ? [
                    {
                      url: productData.product_image,
                      alt_text: productData.product_name,
                    },
                  ]
                : [
                    {
                      url: "https://placehold.co/350x450/ff9d8a/ffffff?text=Product+Image",
                      alt_text: "Product placeholder",
                    },
                  ],
            product_images: productData.product_images || [],
            product_image:
              productData.product_image || productData.mainImage || "",
            placeholderImages: [
              "https://placehold.co/350x450/ff9d8a/ffffff?text=Product+Image",
              "https://placehold.co/100x100/ff9d8a/ffffff?text=Thumb+1",
              "https://placehold.co/100x100/ff9d8a/ffffff?text=Thumb+2",
              "https://placehold.co/100x100/ff9d8a/ffffff?text=Thumb+3",
            ],
          };
          setProduct(transformedProduct);
        } else {
          setProduct(null);
        }
      } catch (error) {
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId, backendUrl]);

  const handleQuantityChange = (amount) => {
    const newQuantity = quantity + amount;
    if (newQuantity >= 1 && newQuantity <= (product?.stock || 1)) {
      setQuantity(newQuantity);
    }
  };

  const handleInputChange = (e) => {
    const value = parseInt(e.target.value) || 1;
    if (value >= 1 && value <= (product?.stock || 1)) {
      setQuantity(value);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price || 0);
  };

  const handleAddToCart = async () => {
    if (!product) return;
    if (!isLoggedIn) {
      toast.error("Please login to add items to cart");
      navigate("/login");
      return;
    }
    const result = await addToCart(product.id, quantity);
    if (result.success) {
      setQuantity(1);
    }
  };

  const handleBuyNow = async () => {
    if (!product) return;
    if (!isLoggedIn) {
      toast.error("Please login to buy this product");
      navigate("/login");
      return;
    }
    navigate("/checkout", {
      state: {
        buyNowMode: true,
        product: {
          id: product.id,
          name: product.name,
          brand: product.author,
          price: product.price,
          image: product.images[0],
          quantity: quantity,
        },
      },
    });
  };

  if (loading) {
    return <PageSkeleton />;
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="max-w-md mx-auto">
          <div className="text-6xl mb-6 text-gray-400">
            <i className="fas fa-exclamation-triangle"></i>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Product Not Found
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            The product you're looking for doesn't exist or couldn't be loaded.
          </p>
          <button
            onClick={() => navigate("/shop")}
            className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg transition-colors flex items-center mx-auto"
          >
            <i className="fas fa-arrow-left mr-2"></i>
            Back to Shop
          </button>
        </div>
      </div>
    );
  }

  const breadcrumbItems = [
    { label: "Shop", link: "/shop" },
    {
      label: product.category,
      link: `/shop/category/${product.category
        .toLowerCase()
        .replace(/\s+/g, "-")}`,
    },
    { label: product.name },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 lg:px-20 py-4">
        <Breadcrumb items={breadcrumbItems} />
      </div>
      <Details
        product={product}
        selectedImage={selectedImage}
        setSelectedImage={setSelectedImage}
        quantity={quantity}
        handleQuantityChange={handleQuantityChange}
        handleInputChange={handleInputChange}
        formatPrice={formatPrice}
        handleAddToCart={handleAddToCart}
        handleBuyNow={handleBuyNow}
        cartLoading={cartLoading}
      />
      <div className="bg-background py-8">
        <div className="container mx-auto px-6 lg:px-20">
          <div className="bg-gray-50 dark:bg-gray-800 shadow-lg rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700">
            <Tabs
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              product={product}
            />
            <TabsContent activeTab={activeTab} product={product} />
          </div>
        </div>
      </div>
      <Newsletter />
    </div>
  );
}

export default ProductDetails;
