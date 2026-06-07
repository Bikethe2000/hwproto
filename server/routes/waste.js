const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const { authenticate } = require('../middleware/auth');
const entityStore = require('../localEntityStore');

// List all waste listings
router.get('/listings', async (req, res) => {
  try {
    const { materialType, condition, minPrice, maxPrice, search } = req.query;

    let listings = await entityStore.list('WasteListing');
    listings = listings.filter((l) => l.available !== false);

    // Apply filters
    if (materialType) {
      listings = listings.filter((l) => l.materialType === materialType);
    }

    if (condition) {
      listings = listings.filter((l) => l.condition === condition);
    }

    if (minPrice || maxPrice) {
      const min = minPrice ? parseFloat(minPrice) : 0;
      const max = maxPrice ? parseFloat(maxPrice) : Infinity;
      listings = listings.filter((l) => l.pricePerKg >= min && l.pricePerKg <= max);
    }

    if (search) {
      const searchLower = search.toLowerCase();
      listings = listings.filter(
        (l) =>
          l.materialType.toLowerCase().includes(searchLower) ||
          l.description?.toLowerCase().includes(searchLower) ||
          l.color?.toLowerCase().includes(searchLower)
      );
    }

    // Sort by newest first
    listings.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.json({ success: true, data: listings });
  } catch (error) {
    console.error('Error listing waste:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get single waste listing
router.get('/listings/:listingId', async (req, res) => {
  try {
    const { listingId } = req.params;

    const listing = await entityStore.get('WasteListing', listingId);
    if (!listing) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    // Increment view count
    listing.viewCount = (listing.viewCount || 0) + 1;
    await entityStore.update('WasteListing', listingId, listing);

    res.json({ success: true, data: listing });
  } catch (error) {
    console.error('Error fetching waste listing:', error);
    res.status(500).json({ error: error.message });
  }
});

// Create waste listing
router.post('/listings', authenticate, async (req, res) => {
  try {
    const {
      materialType,
      weight,
      condition,
      pricePerKg,
      images,
      description,
      color,
      specifications,
      quantity,
    } = req.body;
    const sellerId = req.user.id;

    if (!materialType || !weight || !condition || !pricePerKg) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Get seller info from profile
    const profiles = await entityStore.filter('UserProfile', { userId: sellerId });
    const sellerInfo = profiles[0] || { displayName: 'Seller', sellerRating: 5 };

    const totalPrice = weight.value * pricePerKg;

    const listing = await entityStore.create('WasteListing', {
      sellerId,
      sellerInfo: {
        name: sellerInfo.displayName,
        avatar: sellerInfo.profilePicture,
        rating: sellerInfo.sellerRating || 5,
      },
      materialType,
      weight,
      condition,
      pricePerKg,
      totalPrice,
      images: images || [],
      description: description || '',
      available: true,
      quantity: quantity || 1,
      color: color || '',
      specifications: specifications || {},
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      viewCount: 0,
      soldCount: 0,
    });

    // Add listing to seller's profile
    if (profiles.length > 0) {
      const profile = profiles[0];
      profile.wasteListings = profile.wasteListings || [];
      profile.wasteListings.push(listing.id);
      profile.updatedAt = new Date().toISOString();
      await entityStore.update('UserProfile', profile.id, profile);
    }

    res.status(201).json({ success: true, data: listing });
  } catch (error) {
    console.error('Error creating waste listing:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update waste listing
router.patch('/listings/:listingId', authenticate, async (req, res) => {
  try {
    const { listingId } = req.params;
    const { materialType, weight, condition, pricePerKg, description, images, quantity, available } = req.body;

    const listing = await entityStore.get('WasteListing', listingId);
    if (!listing) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    // Check authorization
    if (listing.sellerId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    // Update fields
    if (materialType) listing.materialType = materialType;
    if (weight) listing.weight = weight;
    if (condition) listing.condition = condition;
    if (pricePerKg) {
      listing.pricePerKg = pricePerKg;
      listing.totalPrice = (weight || listing.weight).value * pricePerKg;
    }
    if (description) listing.description = description;
    if (images) listing.images = images;
    if (quantity) listing.quantity = quantity;
    if (available !== undefined) listing.available = available;

    listing.updatedAt = new Date().toISOString();

    await entityStore.update('WasteListing', listingId, listing);

    res.json({ success: true, data: listing });
  } catch (error) {
    console.error('Error updating waste listing:', error);
    res.status(500).json({ error: error.message });
  }
});

// Delete waste listing
router.delete('/listings/:listingId', authenticate, async (req, res) => {
  try {
    const { listingId } = req.params;

    const listing = await entityStore.get('WasteListing', listingId);
    if (!listing) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    // Check authorization
    if (listing.sellerId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    await entityStore.delete('WasteListing', listingId);

    // Remove from seller's profile
    const profiles = await entityStore.filter('UserProfile', { userId: listing.sellerId });
    if (profiles.length > 0) {
      const profile = profiles[0];
      profile.wasteListings = (profile.wasteListings || []).filter((id) => id !== listingId);
      profile.updatedAt = new Date().toISOString();
      await entityStore.update('UserProfile', profile.id, profile);
    }

    res.json({ success: true, message: 'Listing deleted' });
  } catch (error) {
    console.error('Error deleting waste listing:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get seller's listings
router.get('/by-seller/:sellerId', async (req, res) => {
  try {
    const { sellerId } = req.params;

    const listings = await entityStore.filter('WasteListing', { sellerId, available: true });
    listings.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.json({ success: true, data: listings });
  } catch (error) {
    console.error('Error fetching seller listings:', error);
    res.status(500).json({ error: error.message });
  }
});

// Purchase waste (add to cart / create order)
router.post('/listings/:listingId/purchase', authenticate, async (req, res) => {
  try {
    const { listingId } = req.params;
    const { quantity } = req.body;
    const buyerId = req.user.id;

    if (!quantity || quantity <= 0) {
      return res.status(400).json({ error: 'Invalid quantity' });
    }

    const listing = await entityStore.get('WasteListing', listingId);
    if (!listing) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    if (!listing.available || listing.quantity < quantity) {
      return res.status(400).json({ error: 'Not enough stock available' });
    }

    // Update sold count
    listing.soldCount = (listing.soldCount || 0) + quantity;
    listing.quantity -= quantity;
    if (listing.quantity <= 0) {
      listing.available = false;
    }
    listing.updatedAt = new Date().toISOString();
    await entityStore.update('WasteListing', listingId, listing);

    // Update seller earnings
    const sellProfiles = await entityStore.filter('UserProfile', { userId: listing.sellerId });
    if (sellProfiles.length > 0) {
      const profile = sellProfiles[0];
      const earnings = listing.pricePerKg * quantity;
      profile.totalEarnings = (profile.totalEarnings || 0) + earnings;
      profile.totalSales = (profile.totalSales || 0) + quantity;
      profile.updatedAt = new Date().toISOString();
      await entityStore.update('UserProfile', profile.id, profile);
    }

    res.json({ success: true, data: listing });
  } catch (error) {
    console.error('Error purchasing waste:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
