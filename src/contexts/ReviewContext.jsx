import React, { createContext, useState, useContext } from 'react';

export const ReviewContext = createContext();

export const ReviewProvider = ({ children }) => {
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [currentProductId, setCurrentProductId] = useState(null);

  const openReviewForm = (productId) => {
    setCurrentProductId(productId);
    setShowReviewForm(true);
    // Scroll to reviews section
    setTimeout(() => {
      const reviewsSection = document.querySelector('[data-reviews-section]');
      if (reviewsSection) {
        reviewsSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const closeReviewForm = () => {
    setShowReviewForm(false);
  };

  return (
    <ReviewContext.Provider value={{
      showReviewForm,
      setShowReviewForm,
      currentProductId,
      setCurrentProductId,
      openReviewForm,
      closeReviewForm
    }}>
      {children}
    </ReviewContext.Provider>
  );
};

export const useReviewContext = () => {
  const context = useContext(ReviewContext);
  if (!context) {
    throw new Error('useReviewContext must be used within a ReviewProvider');
  }
  return context;
};
