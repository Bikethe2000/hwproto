const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const entityStore = require('../localEntityStore');

// For now, using a placeholder for Stripe
// In production, this will use actual Stripe API
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || null;
const STRIPE_PUBLISHABLE_KEY = process.env.STRIPE_PUBLISHABLE_KEY || null;

// Note: Actual Stripe integration requires: npm install stripe

// Get Stripe publishable key
router.get('/config', (req, res) => {
  res.json({
    publishableKey: STRIPE_PUBLISHABLE_KEY || 'pk_test_mock',
  });
});

// Create payment intent (Stripe)
router.post('/create-intent', authenticate, async (req, res) => {
  try {
    const { amount, currency, orderId, metadata } = req.body;
    const userId = req.user.id;

    if (!amount || amount < 0.5) {
      return res.status(400).json({ error: 'Invalid amount' });
    }

    // TODO: Replace with actual Stripe implementation
    // const stripe = require('stripe')(STRIPE_SECRET_KEY);
    // const intent = await stripe.paymentIntents.create({
    //   amount: Math.round(amount * 100), // Convert to cents
    //   currency: currency || 'eur',
    //   description: `Order ${orderId}`,
    //   metadata: { orderId, userId, ...metadata },
    // });

    // Mock response for now
    const paymentIntent = {
      id: `pi_mock_${Date.now()}`,
      amount: Math.round(amount * 100),
      currency: currency || 'eur',
      status: 'requires_payment_method',
      client_secret: `pi_mock_${Date.now()}_secret_mock`,
      orderId,
      userId,
      createdAt: new Date().toISOString(),
    };

    // Save payment intent to database
    const savedIntent = await entityStore.create('PaymentIntent', paymentIntent);

    res.json({
      success: true,
      data: {
        clientSecret: savedIntent.client_secret,
        paymentIntentId: savedIntent.id,
      },
    });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    res.status(500).json({ error: error.message });
  }
});

// Confirm payment
router.post('/confirm', authenticate, async (req, res) => {
  try {
    const { paymentIntentId, paymentMethodId } = req.body;

    if (!paymentIntentId) {
      return res.status(400).json({ error: 'Payment intent ID required' });
    }

    // TODO: Replace with actual Stripe implementation
    // const stripe = require('stripe')(STRIPE_SECRET_KEY);
    // const intent = await stripe.paymentIntents.confirm(paymentIntentId, {
    //   payment_method: paymentMethodId,
    // });

    // Mock response
    const paymentIntent = await entityStore.get('PaymentIntent', paymentIntentId);
    if (!paymentIntent) {
      return res.status(404).json({ error: 'Payment intent not found' });
    }

    paymentIntent.status = 'succeeded';
    paymentIntent.paymentMethodId = paymentMethodId;
    await entityStore.update('PaymentIntent', paymentIntentId, paymentIntent);

    // Update order status
    const orders = await entityStore.filter('Order', { id: paymentIntent.orderId });
    if (orders.length > 0) {
      const order = orders[0];
      order.paymentStatus = 'completed';
      order.status = 'processing';
      order.updatedAt = new Date().toISOString();
      await entityStore.update('Order', order.id, order);
    }

    res.json({
      success: true,
      data: {
        status: 'succeeded',
        paymentIntentId,
      },
    });
  } catch (error) {
    console.error('Error confirming payment:', error);
    res.status(500).json({ error: error.message });
  }
});

// Handle Stripe webhook
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    // TODO: Verify webhook signature with Stripe
    // const sig = req.headers['stripe-signature'];
    // const event = stripe.webhooks.constructEvent(req.body, sig, STRIPE_WEBHOOK_SECRET);

    // Mock webhook handling
    const event = JSON.parse(req.body);

    switch (event.type) {
      case 'payment_intent.succeeded':
        console.log('Payment succeeded:', event.data.object.id);
        break;
      case 'payment_intent.payment_failed':
        console.log('Payment failed:', event.data.object.id);
        break;
      default:
        console.log('Unhandled event type:', event.type);
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get payment methods for user
router.get('/methods', authenticate, async (req, res) => {
  try {
    const userId = req.user.id;

    // TODO: Fetch actual payment methods from Stripe
    // const stripe = require('stripe')(STRIPE_SECRET_KEY);
    // const paymentMethods = await stripe.paymentMethods.list({
    //   customer: userId,
    // });

    // Mock response
    const paymentMethods = {
      object: 'list',
      data: [],
      total_count: 0,
    };

    res.json({ success: true, data: paymentMethods });
  } catch (error) {
    console.error('Error fetching payment methods:', error);
    res.status(500).json({ error: error.message });
  }
});

// Process refund
router.post('/refund', authenticate, async (req, res) => {
  try {
    const { paymentIntentId, amount, reason } = req.body;

    if (!paymentIntentId) {
      return res.status(400).json({ error: 'Payment intent ID required' });
    }

    // TODO: Process refund with Stripe
    // const stripe = require('stripe')(STRIPE_SECRET_KEY);
    // const refund = await stripe.refunds.create({
    //   payment_intent: paymentIntentId,
    //   amount: amount ? Math.round(amount * 100) : undefined,
    //   reason: reason || 'requested_by_customer',
    // });

    // Mock response
    const refund = {
      id: `re_mock_${Date.now()}`,
      payment_intent: paymentIntentId,
      amount: amount ? Math.round(amount * 100) : null,
      status: 'succeeded',
      reason: reason || 'requested_by_customer',
      createdAt: new Date().toISOString(),
    };

    const savedRefund = await entityStore.create('Refund', refund);

    res.json({
      success: true,
      data: savedRefund,
    });
  } catch (error) {
    console.error('Error processing refund:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
