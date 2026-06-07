const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const { authenticate } = require('../middleware/auth');
const entityStore = require('../localEntityStore');

// Create order
router.post('/', authenticate, async (req, res) => {
  try {
    const { items, shippingAddress, shippingMethod, shippingCost, total, notes } = req.body;
    const userId = req.user.id;

    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'No items in order' });
    }

    const order = await entityStore.create('Order', {
      userId,
      items,
      subtotal: items.reduce((sum, item) => sum + (item.priceAtTime * item.quantity), 0),
      shippingAddress,
      shippingMethod,
      shippingCost,
      taxAmount: 0,
      total,
      status: 'pending',
      paymentStatus: 'unpaid',
      notes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    // Add order ID to user profile's order history
    try {
      const profiles = await entityStore.filter('UserProfile', { userId });
      if (profiles.length > 0) {
        const profile = profiles[0];
        profile.orderHistory = profile.orderHistory || [];
        profile.orderHistory.push(order.id);
        profile.totalPurchases = (profile.totalPurchases || 0) + 1;
        profile.totalSpent = (profile.totalSpent || 0) + total;
        profile.updatedAt = new Date().toISOString();
        await entityStore.update('UserProfile', profile.id, profile);
      }
    } catch (error) {
      console.error('Failed to update user profile with order:', error);
    }

    res.status(201).json({ success: true, data: order });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get user's orders
router.get('/user/:userId', authenticate, async (req, res) => {
  try {
    const { userId } = req.params;

    // Check authorization
    if (req.user.id !== userId && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const orders = await entityStore.filter('Order', { userId });
    orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.json({ success: true, data: orders });
  } catch (error) {
    console.error('Error fetching user orders:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get single order
router.get('/:orderId', authenticate, async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await entityStore.get('Order', orderId);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Check authorization
    if (order.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    res.json({ success: true, data: order });
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update order status (admin only)
router.patch('/:orderId/status', authenticate, async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status, trackingNumber } = req.body;

    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin only' });
    }

    const order = await entityStore.get('Order', orderId);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    order.status = status;
    if (trackingNumber) {
      order.trackingNumber = trackingNumber;
    }
    order.updatedAt = new Date().toISOString();

    await entityStore.update('Order', orderId, order);

    res.json({ success: true, data: order });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ error: error.message });
  }
});

// Cancel order
router.post('/:orderId/cancel', authenticate, async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await entityStore.get('Order', orderId);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Check authorization
    if (order.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    // Only allow cancellation if order is pending or processing
    if (!['pending', 'processing'].includes(order.status)) {
      return res.status(400).json({ error: 'Cannot cancel order in current status' });
    }

    order.status = 'cancelled';
    order.updatedAt = new Date().toISOString();

    await entityStore.update('Order', orderId, order);

    res.json({ success: true, data: order });
  } catch (error) {
    console.error('Error cancelling order:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
