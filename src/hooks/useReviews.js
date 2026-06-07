import { useState, useCallback } from 'react';
import { api } from '@/api/apiClient';

export const useReviews = (productId) => {
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('recent');

  const fetchReviews = useCallback(async (sort = 'recent') => {
    if (!productId) return;

    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`/api/reviews/product/${productId}?sortBy=${sort}&limit=100`);

      if (!response.ok) {
        throw new Error('Failed to fetch reviews');
      }

      const data = await response.json();
      setReviews(data.reviews);
      setStats(data.stats);
      setSortBy(sort);
    } catch (err) {
      console.error('Error fetching reviews:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [productId]);

  const createReview = useCallback(async (reviewData) => {
    try {
      setError(null);
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('hwproto_access_token')}`
        },
        body: JSON.stringify(reviewData)
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create review');
      }

      const newReview = await response.json();
      setReviews([newReview, ...reviews]);

      // Refresh stats
      await fetchReviews(sortBy);

      return newReview;
    } catch (err) {
      console.error('Error creating review:', err);
      setError(err.message);
      throw err;
    }
  }, [reviews, sortBy, fetchReviews]);

  const updateReview = useCallback(async (reviewId, reviewData) => {
    try {
      setError(null);
      const response = await fetch(`/api/reviews/${reviewId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('hwproto_access_token')}`
        },
        body: JSON.stringify(reviewData)
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to update review');
      }

      const updatedReview = await response.json();
      setReviews(reviews.map(r => r.id === reviewId ? updatedReview : r));

      return updatedReview;
    } catch (err) {
      console.error('Error updating review:', err);
      setError(err.message);
      throw err;
    }
  }, [reviews]);

  const deleteReview = useCallback(async (reviewId) => {
    try {
      setError(null);
      const response = await fetch(`/api/reviews/${reviewId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('hwproto_access_token')}`
        }
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete review');
      }

      setReviews(reviews.filter(r => r.id !== reviewId));

      // Refresh stats
      await fetchReviews(sortBy);

      return true;
    } catch (err) {
      console.error('Error deleting review:', err);
      setError(err.message);
      throw err;
    }
  }, [reviews, sortBy, fetchReviews]);

  const markHelpful = useCallback(async (reviewId) => {
    try {
      const response = await fetch(`/api/reviews/${reviewId}/helpful`, {
        method: 'POST'
      });

      if (!response.ok) {
        throw new Error('Failed to mark review as helpful');
      }

      const data = await response.json();
      setReviews(reviews.map(r => 
        r.id === reviewId ? { ...r, helpful: data.helpful } : r
      ));

      return data;
    } catch (err) {
      console.error('Error marking review helpful:', err);
      setError(err.message);
      throw err;
    }
  }, [reviews]);

  return {
    reviews,
    stats,
    loading,
    error,
    sortBy,
    fetchReviews,
    createReview,
    updateReview,
    deleteReview,
    markHelpful,
    setSortBy
  };
};
