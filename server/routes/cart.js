const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const { authenticate } = require('../middleware/auth');
const entityStore = require('../localEntityStore');

// Get user's cart
router.get('/:userId', authenticate, async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Check authorization
    if (req.user.id !== userId && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const carts = await entityStore.filter('Cart', { userId });
    const cart = carts[0] || null;

    res.json({ success: true, data: cart });
  } catch (error) {
    console.error('Error fetching cart:', error);
    res.status(500).json({ error: error.message });
  }
});

// Add or update item in cart
router.post('/add', authenticate, async (req, res) => {
  try {
    const { productId, quantity, priceAtTime, variant } = req.body;
    const userId = req.user.id;

    if (!productId || quantity <= 0) {
      return res.status(400).json({ error: 'Invalid product or quantity' });
    }

    // Get or create cart
    let carts = await entityStore.filter('Cart', { userId });
    let cart = carts[0];

    if (!cart) {
      cart = await entityStore.create('Cart', {
        userId,
        items: [],
        subtotal: 0,
        shippingCost: 0,
        taxAmount: 0,
        total: 0,
        lastUpdated: new Date().toISOString(),
      });
    }

    // Check if item already exists
    const existingItemIndex = cart.items.findIndex(
      (item) => item.productId === productId && JSON.stringify(item.variant) === JSON.stringify(variant)
    );

    if (existingItemIndex >= 0) {
      // Update quantity
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      // Add new item
      cart.items.push({
        id: `item-${crypto.randomUUID()}`,
        productId,
        quantity,
        priceAtTime,
        variant,
        addedAt: new Date().toISOString(),
      });
    }

    // Recalculate totals
    cart.subtotal = cart.items.reduce((sum, item) => sum + (item.priceAtTime * item.quantity), 0);
    cart.total = cart.subtotal + cart.shippingCost + cart.taxAmount;
    cart.lastUpdated = new Date().toISOString();

    // Update cart
    await entityStore.update('Cart', cart.id, cart);

    res.json({ success: true, data: cart });
  } catch (error) {
    console.error('Error adding to cart:', error);
    res.status(500).json({ error: error.message });
  }
});

// Remove item from cart
router.delete('/:cartId/items/:itemId', authenticate, async (req, res) => {
  try {
    const { cartId, itemId } = req.params;

    const cart = await entityStore.get('Cart', cartId);
    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    if (cart.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    // Remove item
    cart.items = cart.items.filter((item) => item.id !== itemId);

    // Recalculate totals
    cart.subtotal = cart.items.reduce((sum, item) => sum + (item.priceAtTime * item.quantity), 0);
    cart.total = cart.subtotal + cart.shippingCost + cart.taxAmount;
    cart.lastUpdated = new Date().toISOString();

    await entityStore.update('Cart', cartId, cart);

    res.json({ success: true, data: cart });
  } catch (error) {
    console.error('Error removing from cart:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update item quantity
router.patch('/:cartId/items/:itemId', authenticate, async (req, res) => {
  try {
    const { cartId, itemId } = req.params;
    const { quantity } = req.body;

    if (quantity <= 0) {
      return res.status(400).json({ error: 'Invalid quantity' });
    }

    const cart = await entityStore.get('Cart', cartId);
    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    if (cart.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    // Update item
    const item = cart.items.find((i) => i.id === itemId);
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    item.quantity = quantity;

    // Recalculate totals
    cart.subtotal = cart.items.reduce((sum, item) => sum + (item.priceAtTime * item.quantity), 0);
    cart.total = cart.subtotal + cart.shippingCost + cart.taxAmount;
    cart.lastUpdated = new Date().toISOString();

    await entityStore.update('Cart', cartId, cart);

    res.json({ success: true, data: cart });
  } catch (error) {
    console.error('Error updating cart item:', error);
    res.status(500).json({ error: error.message });
  }
});

// Apply shipping to cart
router.post('/:cartId/apply-shipping', authenticate, async (req, res) => {
  try {
    const { cartId } = req.params;
    const { shippingMethod, shippingCost } = req.body;

    const cart = await entityStore.get('Cart', cartId);
    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    if (cart.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    cart.shippingMethod = shippingMethod;
    cart.shippingCost = shippingCost;
    cart.total = cart.subtotal + cart.shippingCost + cart.taxAmount;
    cart.lastUpdated = new Date().toISOString();

    await entityStore.update('Cart', cartId, cart);

    res.json({ success: true, data: cart });
  } catch (error) {
    console.error('Error applying shipping:', error);
    res.status(500).json({ error: error.message });
  }
});

// Clear cart
router.delete('/:cartId', authenticate, async (req, res) => {
  try {
    const { cartId } = req.params;

    const cart = await entityStore.get('Cart', cartId);
    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    if (cart.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    await entityStore.delete('Cart', cartId);

    res.json({ success: true, message: 'Cart cleared' });
  } catch (error) {
    console.error('Error clearing cart:', error);
    res.status(500).json({ error: error.message });
  }
});

// Sync cart with frontend
router.post('/sync', authenticate, async (req, res) => {
  try {
    const { cartData } = req.body;
    const userId = req.user.id;

    // Get or create cart
    let carts = await entityStore.filter('Cart', { userId });
    let cart = carts[0];

    if (!cart) {
      cart = await entityStore.create('Cart', {
        userId,
        ...cartData,
        lastUpdated: new Date().toISOString(),
      });
    } else {
      // Update existing cart
      Object.assign(cart, cartData);
      cart.lastUpdated = new Date().toISOString();
      await entityStore.update('Cart', cart.id, cart);
    }

    res.json({ success: true, data: cart });
  } catch (error) {
    console.error('Error syncing cart:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
