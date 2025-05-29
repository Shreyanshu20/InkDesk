import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { AppContent } from './AppContent';

const ReviewContext = createContext();

export const useReviews = () => {
    const context = useContext(ReviewContext);
    if (!context) {
        throw new Error('useReviews must be used within a ReviewProvider');
    }
    return context;
};

export const ReviewProvider = ({ children }) => {
    const { backendUrl, isLoggedIn } = useContext(AppContent);
    const [loading, setLoading] = useState(false);

    // Create a review
    const createReview = async (reviewData) => {
        if (!isLoggedIn) {
            toast.error('Please login to write a review');
            return { success: false };
        }

        try {
            setLoading(true);
            const response = await axios.post(
                `${backendUrl}/reviews/create`,
                reviewData,
                { withCredentials: true }
            );

            if (response.data.success) {
                toast.success('Review submitted successfully!');
                return { success: true, review: response.data.review };
            } else {
                toast.error(response.data.message || 'Failed to submit review');
                return { success: false, message: response.data.message };
            }
        } catch (error) {
            console.error('Create review error:', error);
            const message = error.response?.data?.message || 'Failed to submit review';
            toast.error(message);
            return { success: false, message };
        } finally {
            setLoading(false);
        }
    };

    // Get reviews for a product
    const getProductReviews = async (productId, options = {}) => {
        try {
            setLoading(true);
            const params = new URLSearchParams({
                page: options.page || 1,
                limit: options.limit || 10,
                sortBy: options.sortBy || 'createdAt',
                order: options.order || 'desc'
            });

            const response = await axios.get(
                `${backendUrl}/reviews/product/${productId}?${params}`
            );

            if (response.data.success) {
                return { success: true, data: response.data.data };
            } else {
                console.error('Failed to fetch reviews:', response.data.message);
                return { success: false, message: response.data.message };
            }
        } catch (error) {
            console.error('Get product reviews error:', error);
            return { success: false, message: 'Failed to load reviews' };
        } finally {
            setLoading(false);
        }
    };

    // Get user's reviews
    const getUserReviews = async (options = {}) => {
        if (!isLoggedIn) {
            return { success: false, message: 'Not logged in' };
        }

        try {
            setLoading(true);
            const params = new URLSearchParams({
                page: options.page || 1,
                limit: options.limit || 10
            });

            const response = await axios.get(
                `${backendUrl}/reviews/my-reviews?${params}`,
                { withCredentials: true }
            );

            if (response.data.success) {
                return { success: true, data: response.data.data };
            } else {
                return { success: false, message: response.data.message };
            }
        } catch (error) {
            console.error('Get user reviews error:', error);
            return { success: false, message: 'Failed to load reviews' };
        } finally {
            setLoading(false);
        }
    };

    // Update a review
    const updateReview = async (reviewId, reviewData) => {
        if (!isLoggedIn) {
            toast.error('Please login to update review');
            return { success: false };
        }

        try {
            setLoading(true);
            const response = await axios.put(
                `${backendUrl}/reviews/${reviewId}`,
                reviewData,
                { withCredentials: true }
            );

            if (response.data.success) {
                toast.success('Review updated successfully!');
                return { success: true, review: response.data.review };
            } else {
                toast.error(response.data.message || 'Failed to update review');
                return { success: false, message: response.data.message };
            }
        } catch (error) {
            console.error('Update review error:', error);
            const message = error.response?.data?.message || 'Failed to update review';
            toast.error(message);
            return { success: false, message };
        } finally {
            setLoading(false);
        }
    };

    // Delete a review
    const deleteReview = async (reviewId) => {
        if (!isLoggedIn) {
            toast.error('Please login to delete review');
            return { success: false };
        }

        try {
            setLoading(true);
            const response = await axios.delete(
                `${backendUrl}/reviews/${reviewId}`,
                { withCredentials: true }
            );

            if (response.data.success) {
                toast.success('Review deleted successfully!');
                return { success: true };
            } else {
                toast.error(response.data.message || 'Failed to delete review');
                return { success: false, message: response.data.message };
            }
        } catch (error) {
            console.error('Delete review error:', error);
            const message = error.response?.data?.message || 'Failed to delete review';
            toast.error(message);
            return { success: false, message };
        } finally {
            setLoading(false);
        }
    };

    // Check if user can review a product
    const canUserReview = async (productId) => {
        if (!isLoggedIn) {
            return { success: true, canReview: false, reason: 'not_logged_in' };
        }

        try {
            const response = await axios.get(
                `${backendUrl}/reviews/can-review/${productId}`,
                { withCredentials: true }
            );

            if (response.data.success) {
                return {
                    success: true,
                    canReview: response.data.canReview,
                    reason: response.data.reason,
                    verifiedPurchase: response.data.verifiedPurchase,
                    existingReview: response.data.existingReview
                };
            } else {
                return { success: false, message: response.data.message };
            }
        } catch (error) {
            console.error('Can user review error:', error);
            return { success: false, message: 'Failed to check review eligibility' };
        }
    };

    const value = {
        loading,
        createReview,
        getProductReviews,
        getUserReviews,
        updateReview,
        deleteReview,
        canUserReview
    };

    return (
        <ReviewContext.Provider value={value}>
            {children}
        </ReviewContext.Provider>
    );
};