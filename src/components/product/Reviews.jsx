import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ReviewCard from './ReviewCard';
import ReviewForm from './ReviewForm';
import { useReviews } from '@/hooks/useReviews';
import { useReviewContext } from '@/contexts/ReviewContext';

export default function Reviews({ productId, isAuthenticated, currentUserId, onLoginRequired }) {
  const { reviews, stats, loading, error, sortBy, fetchReviews, createReview, updateReview, deleteReview, markHelpful, setSortBy } = useReviews(productId);
  const { showReviewForm, setShowReviewForm, openReviewForm } = useReviewContext();
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const [displayCount, setDisplayCount] = useState(5);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const handleCreateReview = async (reviewData) => {
    if (!isAuthenticated) {
      onLoginRequired?.();
      return;
    }

    setIsSubmitting(true);
    try {
      await createReview({
        productId,
        ...reviewData
      });
      setShowReviewForm(false);
    } catch (err) {
      console.error('Error creating review:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateReview = async (reviewData) => {
    if (!editingReviewId) return;

    setIsSubmitting(true);
    try {
      await updateReview(editingReviewId, reviewData);
      setEditingReviewId(null);
    } catch (err) {
      console.error('Error updating review:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      await deleteReview(reviewId);
    } catch (err) {
      console.error('Error deleting review:', err);
    }
  };

  const handleMarkHelpful = async (reviewId) => {
    try {
      await markHelpful(reviewId);
    } catch (err) {
      console.error('Error marking helpful:', err);
    }
  };

  const handleSortChange = (newSort) => {
    setSortBy(newSort);
    fetchReviews(newSort);
    setSortOpen(false);
  };

  const visibleReviews = reviews.slice(0, displayCount);
  const hasMoreReviews = reviews.length > displayCount;

  const editingReview = reviews.find(r => r.id === editingReviewId);
  const userReview = reviews.find(r => r.id === editingReviewId);

  return (
    <div className="mt-16 pt-8 border-t border-border" data-reviews-section>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Customer Reviews</h2>

            {/* Rating Summary */}
            {stats && stats.totalReviews > 0 ? (
              <div className="flex items-center gap-4">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold">{stats.averageRating}</span>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.round(stats.averageRating)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-muted-foreground'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <span className="text-sm text-muted-foreground">
                  Based on {stats.totalReviews} review{stats.totalReviews !== 1 ? 's' : ''}
                </span>
              </div>
            ) : (
              <p className="text-muted-foreground">No reviews yet. Be the first to review!</p>
            )}
          </div>

          {/* Write Review Button */}
          <Button
            onClick={() => {
              if (!isAuthenticated) {
                onLoginRequired?.();
              } else {
                setShowReviewForm(!showReviewForm);
              }
            }}
            className="mt-4 md:mt-0"
          >
            {showReviewForm ? 'Cancel' : 'Write a Review'}
          </Button>
        </div>

        {/* Rating Distribution */}
        {stats && stats.totalReviews > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-6 bg-muted/30 rounded-lg"
          >
            <h3 className="font-semibold mb-4">Rating Distribution</h3>
            <div className="space-y-3">
              {[5, 4, 3, 2, 1].map((rating) => (
                <div key={rating} className="flex items-center gap-3">
                  <span className="text-sm font-medium w-12">
                    {rating} <Star className="w-3 h-3 inline fill-yellow-400" />
                  </span>
                  <div className="flex-1 h-2 bg-border rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${stats.totalReviews > 0 ? (stats.ratingDistribution[rating] / stats.totalReviews) * 100 : 0}%` }}
                      className="h-full bg-yellow-400"
                    />
                  </div>
                  <span className="text-sm text-muted-foreground w-8 text-right">
                    {stats.ratingDistribution[rating]}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Review Form */}
        <AnimatePresence>
          {showReviewForm && (
            <ReviewForm
              onSubmit={handleCreateReview}
              isLoading={isSubmitting}
              onCancel={() => setShowReviewForm(false)}
              editingReview={null}
            />
          )}
        </AnimatePresence>

        {/* Edit Form */}
        <AnimatePresence>
          {editingReviewId && editingReview && (
            <ReviewForm
              onSubmit={handleUpdateReview}
              isLoading={isSubmitting}
              onCancel={() => setEditingReviewId(null)}
              editingReview={editingReview}
            />
          )}
        </AnimatePresence>

        {/* Sort and Filter */}
        {reviews.length > 0 && (
          <div className="mb-6 flex gap-3">
            <div className="relative">
              <button
                onClick={() => setSortOpen(!sortOpen)}
                className="px-4 py-2 border border-border rounded-lg flex items-center gap-2 hover:border-primary transition-colors"
              >
                <span className="text-sm">Sort by: {sortBy === 'recent' ? 'Recent' : sortBy === 'helpful' ? 'Most Helpful' : sortBy === 'rating-high' ? 'Highest Rating' : 'Lowest Rating'}</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${sortOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {sortOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full mt-1 w-full bg-background border border-border rounded-lg shadow-lg z-10"
                  >
                    {[
                      { value: 'recent', label: 'Most Recent' },
                      { value: 'helpful', label: 'Most Helpful' },
                      { value: 'rating-high', label: 'Highest Rating' },
                      { value: 'rating-low', label: 'Lowest Rating' }
                    ].map((option) => (
                      <button
                        key={option.value}
                        onClick={() => handleSortChange(option.value)}
                        className={`w-full px-4 py-2 text-left text-sm hover:bg-muted transition-colors ${
                          sortBy === option.value ? 'bg-primary/10 text-primary font-medium' : ''
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="p-4 bg-destructive/10 text-destructive rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Reviews List */}
        <div className="space-y-4">
          <AnimatePresence>
            {visibleReviews.map((review) => (
              <ReviewCard
                key={review.id}
                review={review}
                onDelete={handleDeleteReview}
                onEdit={() => setEditingReviewId(review.id)}
                onMarkHelpful={handleMarkHelpful}
                isOwnReview={isAuthenticated && currentUserId && review.userId === currentUserId}
                isEditMode={editingReviewId === review.id}
                onEditStart={() => setEditingReviewId(review.id)}
                onEditCancel={() => setEditingReviewId(null)}
              />
            ))}
          </AnimatePresence>
        </div>

        {/* Load More Button */}
        {hasMoreReviews && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-8 text-center"
          >
            <Button
              variant="outline"
              onClick={() => setDisplayCount(displayCount + 5)}
            >
              Load More Reviews ({displayCount} of {reviews.length})
            </Button>
          </motion.div>
        )}

        {/* Empty State */}
        {!loading && reviews.length === 0 && !showReviewForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-12 text-center"
          >
            <p className="text-muted-foreground mb-4">
              No reviews yet. {isAuthenticated ? 'Be the first to share your experience!' : 'Log in to write a review.'}
            </p>
            {isAuthenticated && (
              <Button onClick={() => setShowReviewForm(true)}>
                Write the First Review
              </Button>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
