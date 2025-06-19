import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { API_BASE_URL } from '../config';

const ProductForm = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    product_name: '',
    product_description: '',
    product_price: '',
    product_stock: '',
    product_category: '',
    product_brand: '',
    product_image: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (productId) {
      fetchProduct(productId);
    }
  }, [productId]);

  const fetchProduct = async (productId) => {
    try {
      setLoading(true);
      console.log('🔍 Fetching product with ID:', productId);

      const response = await axios.get(
        `${API_BASE_URL}/admin/products/${productId}`,
        {
          withCredentials: true,
          headers: { 'Content-Type': 'application/json' },
        }
      );

      console.log('📦 Product response:', response.data);

      if (response.data.success) {
        const product = response.data.product;

        // Map backend fields to form fields
        setFormData({
          product_name: product.product_name || '',
          product_description: product.product_description || '',
          product_price: product.product_price || '',
          product_stock: product.product_stock || '',
          product_category: product.product_category || '',
          product_brand: product.product_brand || '',
          product_image: product.product_image || '',
          // Add any other fields your form needs
        });

        console.log('✅ Product data loaded successfully');
      } else {
        throw new Error(response.data.message || 'Failed to fetch product');
      }
    } catch (error) {
      console.error('❌ Error fetching product:', error);

      // Better error handling
      if (error.response?.status === 404) {
        toast.error('Product not found');
        navigate('/admin/products');
      } else if (error.response?.status === 400) {
        toast.error('Invalid product ID');
        navigate('/admin/products');
      } else {
        toast.error('Failed to load product. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await axios.put(
        `${API_BASE_URL}/admin/products/${productId}`,
        formData,
        {
          withCredentials: true,
          headers: { 'Content-Type': 'application/json' },
        }
      );

      if (response.data.success) {
        toast.success('Product updated successfully');
        navigate('/admin/products');
      } else {
        throw new Error(response.data.message || 'Failed to update product');
      }
    } catch (error) {
      console.error('❌ Error updating product:', error);
      toast.error(error.response?.data.message || 'Failed to update product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Product Form</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <div>
            <label>Product Name</label>
            <input
              type="text"
              name="product_name"
              value={formData.product_name}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Product Description</label>
            <textarea
              name="product_description"
              value={formData.product_description}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Product Price</label>
            <input
              type="number"
              name="product_price"
              value={formData.product_price}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Product Stock</label>
            <input
              type="number"
              name="product_stock"
              value={formData.product_stock}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Product Category</label>
            <input
              type="text"
              name="product_category"
              value={formData.product_category}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Product Brand</label>
            <input
              type="text"
              name="product_brand"
              value={formData.product_brand}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Product Image URL</label>
            <input
              type="text"
              name="product_image"
              value={formData.product_image}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit">Update Product</button>
        </form>
      )}
    </div>
  );
};

export default ProductForm;