import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ReviewForm({ onSubmit, isLoading = false, onCancel, editingReview = null }) {
  const [rating, setRating] = useState(editingReview?.rating || 0);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState(editingReview?.title || '');
  const [content, setContent] = useState(editingReview?.content || '');
  const [error, setError] = useState('');
  const [titleCount, setTitleCount] = useState(editingReview?.title.length || 0);
  const [contentCount, setContentCount] = useState(editingReview?.content.length || 0);

  const handleTitleChange = (e) => {
    const value = e.target.value;
    if (value.length <= 100) {
      setTitle(value);
      setTitleCount(value.length);
    }
  };

  const handleContentChange = (e) => {
    const value = e.target.value;
    if (value.length <= 2000) {
      setContent(value);
      setContentCount(value.length);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (rating === 0) {
      setError('Please select a rating');
      return;
    }

    if (title.trim().length < 5) {
      setError('Title must be at least 5 characters');
      return;
    }

    if (content.trim().length < 10) {
      setError('Review must be at least 10 characters');
      return;
    }

    try {
      await onSubmit({
        rating,
        title: title.trim(),
        content: content.trim()
      });

      // Reset form on success
      if (!editingReview) {
        setRating(0);
        setTitle('');
        setContent('');
        setTitleCount(0);
        setContentCount(0);
      }
    } catch (err) {
      setError(err.message || 'Failed to submit review');
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      onSubmit={handleSubmit}
      className="border border-border rounded-lg p-6 bg-muted/30 mb-8"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">
          {editingReview ? 'Edit Your Review' : 'Write a Review'}
        </h3>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="p-1 hover:bg-muted rounded transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {error && (
        <div className="mb-4 p-3 bg-destructive/10 text-destructive text-sm rounded">
          {error}
        </div>
      )}

      {/* Rating */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-3">
          Rating <span className="text-destructive">*</span>
        </label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              className="transition-transform hover:scale-110"
            >
              <Star
                className={`w-8 h-8 ${
                  star <= (hoverRating || rating)
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-muted-foreground'
                }`}
              />
            </button>
          ))}
          {rating > 0 && (
            <span className="ml-2 flex items-center text-sm text-muted-foreground">
              {rating === 1 && 'Poor'}
              {rating === 2 && 'Fair'}
              {rating === 3 && 'Good'}
              {rating === 4 && 'Very Good'}
              {rating === 5 && 'Excellent'}
            </span>
          )}
        </div>
      </div>

      {/* Title */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">
          Review Title <span className="text-destructive">*</span>
        </label>
        <div className="relative">
          <input
            type="text"
            value={title}
            onChange={handleTitleChange}
            placeholder="Summarize your experience in a few words"
            className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary text-foreground placeholder:text-muted-foreground"
            maxLength={100}
          />
          <span className="absolute right-3 top-2.5 text-xs text-muted-foreground">
            {titleCount}/100
          </span>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          {titleCount < 5
            ? `${5 - titleCount} more character${5 - titleCount !== 1 ? 's' : ''} needed`
            : 'Perfect'}
        </p>
      </div>

      {/* Content */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">
          Your Review <span className="text-destructive">*</span>
        </label>
        <div className="relative">
          <textarea
            value={content}
            onChange={handleContentChange}
            placeholder="Share details about your experience with this product. What did you like or dislike?"
            rows={6}
            className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary text-foreground placeholder:text-muted-foreground resize-none"
            maxLength={2000}
          />
          <span className="absolute right-3 bottom-3 text-xs text-muted-foreground">
            {contentCount}/2000
          </span>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          {contentCount < 10
            ? `${10 - contentCount} more character${10 - contentCount !== 1 ? 's' : ''} needed`
            : 'Perfect'}
        </p>
      </div>

      {/* Buttons */}
      <div className="flex gap-3">
        <Button
          type="submit"
          disabled={isLoading}
          className="flex-1"
        >
          {isLoading
            ? editingReview
              ? 'Updating...'
              : 'Submitting...'
            : editingReview
            ? 'Update Review'
            : 'Submit Review'}
        </Button>
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancel
          </Button>
        )}
      </div>
    </motion.form>
  );
}
