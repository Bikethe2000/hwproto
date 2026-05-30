const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const entityStore = require('../localEntityStore');

// Get user profile
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const profiles = await entityStore.filter('UserProfile', { userId });
    const profile = profiles[0];

    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    res.json({ success: true, data: profile });
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update user profile
router.patch('/:userId', authenticate, async (req, res) => {
  try {
    const { userId } = req.params;
    const { displayName, bio, profilePicture, country, region } = req.body;

    // Check authorization
    if (req.user.id !== userId && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    let profiles = await entityStore.filter('UserProfile', { userId });
    let profile = profiles[0];

    if (!profile) {
      // Create new profile if doesn't exist
      profile = await entityStore.create('UserProfile', {
        userId,
        displayName: displayName || req.user.name || 'User',
        email: req.user.email,
        bio: bio || '',
        profilePicture: profilePicture || '',
        country: country || '',
        region: region || '',
        totalPurchases: 0,
        totalSpent: 0,
        orderHistory: [],
        totalSales: 0,
        totalEarnings: 0,
        wasteListings: [],
        sellerRating: 5,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    } else {
      // Update existing profile
      if (displayName) profile.displayName = displayName;
      if (bio !== undefined) profile.bio = bio;
      if (profilePicture !== undefined) profile.profilePicture = profilePicture;
      if (country) profile.country = country;
      if (region !== undefined) profile.region = region;
      profile.updatedAt = new Date().toISOString();
      await entityStore.update('UserProfile', profile.id, profile);
    }

    res.json({ success: true, data: profile });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get user's orders (from profile)
router.get('/:userId/orders', async (req, res) => {
  try {
    const { userId } = req.params;

    const profiles = await entityStore.filter('UserProfile', { userId });
    const profile = profiles[0];

    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    const orderIds = profile.orderHistory || [];
    const orders = [];

    for (const orderId of orderIds) {
      try {
        const order = await entityStore.get('Order', orderId);
        if (order) orders.push(order);
      } catch (error) {
        console.error(`Failed to fetch order ${orderId}:`, error);
      }
    }

    orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.json({ success: true, data: orders });
  } catch (error) {
    console.error('Error fetching user orders:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get user's sales history (waste listings sold)
router.get('/:userId/sales', async (req, res) => {
  try {
    const { userId } = req.params;

    const profiles = await entityStore.filter('UserProfile', { userId });
    const profile = profiles[0];

    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    res.json({
      success: true,
      data: {
        totalSales: profile.totalSales || 0,
        totalEarnings: profile.totalEarnings || 0,
        sellerRating: profile.sellerRating || 5,
        listingCount: (profile.wasteListings || []).length,
        sellerReviews: profile.sellerReviews || [],
      },
    });
  } catch (error) {
    console.error('Error fetching sales history:', error);
    res.status(500).json({ error: error.message });
  }
});

// Create or get profile
router.post('/ensure/:userId', authenticate, async (req, res) => {
  try {
    const { userId } = req.params;

    if (req.user.id !== userId && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    let profiles = await entityStore.filter('UserProfile', { userId });
    let profile = profiles[0];

    if (!profile) {
      profile = await entityStore.create('UserProfile', {
        userId,
        displayName: req.user.name || 'User',
        email: req.user.email,
        bio: '',
        profilePicture: '',
        country: '',
        region: '',
        totalPurchases: 0,
        totalSpent: 0,
        orderHistory: [],
        totalSales: 0,
        totalEarnings: 0,
        wasteListings: [],
        sellerRating: 5,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }

    res.json({ success: true, data: profile });
  } catch (error) {
    console.error('Error creating/fetching profile:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
