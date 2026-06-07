const express = require('express');
const router = express.Router();
const { db } = require('../firebase');
const { authenticate } = require('../middleware/auth');

// Get reviews for a product
router.get('/product/:productId', async (req, res) => {
  try {
    const { productId } = req.params;
    const { sortBy = 'recent', limit = 100 } = req.query;

    let query = db.collection('Review').where('productId', '==', productId).where('status', '==', 'approved');

    // Sort options
    if (sortBy === 'helpful') {
      query = query.orderBy('helpful', 'desc');
    } else if (sortBy === 'rating-high') {
      query = query.orderBy('rating', 'desc');
    } else if (sortBy === 'rating-low') {
      query = query.orderBy('rating', 'asc');
    } else {
      query = query.orderBy('createdAt', 'desc');
    }

    query = query.limit(parseInt(limit));

    const snapshot = await query.get();
    const reviews = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    // Calculate stats
    const allReviews = await db.collection('Review').where('productId', '==', productId).where('status', '==', 'approved').get();
    const stats = {
      totalReviews: allReviews.docs.length,
      averageRating: allReviews.docs.length > 0
        ? (allReviews.docs.reduce((sum, doc) => sum + (doc.data().rating || 0), 0) / allReviews.docs.length).toFixed(1)
        : 0,
      ratingDistribution: {
        5: allReviews.docs.filter(doc => doc.data().rating === 5).length,
        4: allReviews.docs.filter(doc => doc.data().rating === 4).length,
        3: allReviews.docs.filter(doc => doc.data().rating === 3).length,
        2: allReviews.docs.filter(doc => doc.data().rating === 2).length,
        1: allReviews.docs.filter(doc => doc.data().rating === 1).length,
      }
    };

    res.json({ reviews, stats });
  } catch (err) {
    console.error('Error fetching reviews:', err);
    res.status(500).json({ error: err.message });
  }
});

// Get a single review
router.get('/:reviewId', async (req, res) => {
  try {
    const doc = await db.collection('Review').doc(req.params.reviewId).get();
    if (!doc.exists) return res.status(404).json({ error: 'Review not found' });
    res.json({ id: doc.id, ...doc.data() });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a review (authenticated)
router.post('/', authenticate, async (req, res) => {
  try {
    const { productId, rating, title, content } = req.body;

    // Validate input
    if (!productId || !rating || !title || !content) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }

    if (title.trim().length < 5 || title.trim().length > 100) {
      return res.status(400).json({ error: 'Title must be between 5 and 100 characters' });
    }

    if (content.trim().length < 10 || content.trim().length > 2000) {
      return res.status(400).json({ error: 'Content must be between 10 and 2000 characters' });
    }

    // Check if product exists
    const productDoc = await db.collection('Product').doc(productId).get();
    if (!productDoc.exists) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Check if user already reviewed this product
    const existingReview = await db.collection('Review')
      .where('productId', '==', productId)
      .where('userId', '==', req.user.id)
      .get();

    if (existingReview.docs.length > 0) {
      return res.status(400).json({ error: 'You have already reviewed this product' });
    }

    // Create review
    const reviewData = {
      productId,
      userId: req.user.id,
      userEmail: req.user.email,
      userName: req.user.email.split('@')[0], // Use email prefix as default name
      rating: parseInt(rating),
      title: title.trim(),
      content: content.trim(),
      verified: false, // Could be set to true if we check order history
      helpful: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'approved' // Auto-approve for now, can be changed to 'pending' for moderation
    };

    const docRef = await db.collection('Review').add(reviewData);

    res.status(201).json({ id: docRef.id, ...reviewData });
  } catch (err) {
    console.error('Error creating review:', err);
    res.status(500).json({ error: err.message });
  }
});

// Update a review (authenticated, owner only)
router.put('/:reviewId', authenticate, async (req, res) => {
  try {
    const { rating, title, content } = req.body;

    // Get the review
    const reviewDoc = await db.collection('Review').doc(req.params.reviewId).get();
    if (!reviewDoc.exists) {
      return res.status(404).json({ error: 'Review not found' });
    }

    const review = reviewDoc.data();

    // Check ownership
    if (review.userId !== req.user.id) {
      return res.status(403).json({ error: 'You can only edit your own reviews' });
    }

    // Validate input
    if (rating && (rating < 1 || rating > 5)) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }

    if (title && (title.trim().length < 5 || title.trim().length > 100)) {
      return res.status(400).json({ error: 'Title must be between 5 and 100 characters' });
    }

    if (content && (content.trim().length < 10 || content.trim().length > 2000)) {
      return res.status(400).json({ error: 'Content must be between 10 and 2000 characters' });
    }

    // Update review
    const updateData = {
      updatedAt: new Date().toISOString(),
      ...(rating && { rating: parseInt(rating) }),
      ...(title && { title: title.trim() }),
      ...(content && { content: content.trim() })
    };

    await db.collection('Review').doc(req.params.reviewId).update(updateData);

    const updatedDoc = await db.collection('Review').doc(req.params.reviewId).get();
    res.json({ id: updatedDoc.id, ...updatedDoc.data() });
  } catch (err) {
    console.error('Error updating review:', err);
    res.status(500).json({ error: err.message });
  }
});

// Delete a review (authenticated, owner only)
router.delete('/:reviewId', authenticate, async (req, res) => {
  try {
    // Get the review
    const reviewDoc = await db.collection('Review').doc(req.params.reviewId).get();
    if (!reviewDoc.exists) {
      return res.status(404).json({ error: 'Review not found' });
    }

    const review = reviewDoc.data();

    // Check ownership
    if (review.userId !== req.user.id) {
      return res.status(403).json({ error: 'You can only delete your own reviews' });
    }

    await db.collection('Review').doc(req.params.reviewId).delete();
    res.json({ ok: true });
  } catch (err) {
    console.error('Error deleting review:', err);
    res.status(500).json({ error: err.message });
  }
});

// Mark review as helpful
router.post('/:reviewId/helpful', async (req, res) => {
  try {
    const reviewDoc = await db.collection('Review').doc(req.params.reviewId).get();
    if (!reviewDoc.exists) {
      return res.status(404).json({ error: 'Review not found' });
    }

    const currentHelpful = reviewDoc.data().helpful || 0;
    await db.collection('Review').doc(req.params.reviewId).update({
      helpful: currentHelpful + 1
    });

    res.json({ ok: true, helpful: currentHelpful + 1 });
  } catch (err) {
    console.error('Error marking review helpful:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
