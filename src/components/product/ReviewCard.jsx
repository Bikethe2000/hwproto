import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Trash2, Edit2, ThumbsUp, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ReviewCard({ review, onDelete, onEdit, onMarkHelpful, isOwnReview, isEditMode, onEditStart, onEditCancel }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isMarking, setIsMarking] = useState(false);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      setIsDeleting(true);
      try {
        await onDelete(review.id);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const handleMarkHelpful = async () => {
    setIsMarking(true);
    try {
      await onMarkHelpful(review.id);
    } finally {
      setIsMarking(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="border border-border rounded-lg p-6 hover:border-primary/50 transition-colors"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < review.rating
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-muted-foreground'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm font-semibold text-foreground">
              {review.title}
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            by {review.userName}
            {review.verified && (
              <span className="ml-2 inline-flex items-center gap-1 text-signal">
                <CheckCircle className="w-3 h-3" />
                Verified Purchase
              </span>
            )}
            {' '} • {formatDate(review.createdAt)}
          </p>
        </div>

        {/* Actions */}
        {isOwnReview && (
          <div className="flex gap-2">
            <button
              onClick={onEditStart}
              className="p-2 hover:bg-primary/10 rounded transition-colors text-muted-foreground hover:text-primary"
              title="Edit review"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="p-2 hover:bg-destructive/10 rounded transition-colors text-muted-foreground hover:text-destructive disabled:opacity-50"
              title="Delete review"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Content */}
      <p className="text-sm text-foreground mb-4 leading-relaxed">
        {review.content}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-border">
        <button
          onClick={handleMarkHelpful}
          disabled={isMarking}
          className="flex items-center gap-2 text-xs text-muted-foreground hover:text-primary transition-colors disabled:opacity-50"
        >
          <ThumbsUp className="w-4 h-4" />
          Helpful ({review.helpful || 0})
        </button>
        {isOwnReview && isEditMode && (
          <button
            onClick={onEditCancel}
            className="text-xs text-muted-foreground hover:text-destructive transition-colors"
          >
            Cancel
          </button>
        )}
      </div>
    </motion.div>
  );
}
