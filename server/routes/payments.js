// routes/payments.js
const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const entityStore = require('../localEntityStore');

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
const STRIPE_PUBLISHABLE_KEY = process.env.STRIPE_PUBLISHABLE_KEY;
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

if (!STRIPE_SECRET_KEY) {
  console.warn('⚠️ STRIPE_SECRET_KEY is not set. Payments will fail.');
}

const getStripe = () => {
  if (!STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY is not configured');
  }
  return require('stripe')(STRIPE_SECRET_KEY);
};
const MAX_CHECKOUT_QTY = 20;

// Get Stripe publishable key
router.get('/config', (req, res) => {
  res.json({
    publishableKey: STRIPE_PUBLISHABLE_KEY || 'pk_test_mock',
  });
});

/**
 * Create Stripe Checkout Session
 * Body: { items: [{ name, price, quantity }], metadata?: {} }
 */
router.post('/create-checkout-session', async (req, res) => {
  try {
    if (!STRIPE_SECRET_KEY) {
      return res.status(503).json({ error: 'Payments are not configured' });
    }
    const stripe = getStripe();
    const { items, metadata } = req.body;
    const userId = req.user?.id;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'No items provided' });
    }

    const lineItems = items.map((item) => {
      const quantity = Number(item.quantity);
      const price = Number(item.price);
      if (!item.name || !Number.isFinite(price) || !Number.isFinite(quantity) || quantity <= 0 || quantity > MAX_CHECKOUT_QTY) {
        throw new Error('Each item must have a valid name, price, and quantity');
      }
      return {
        price_data: {
          currency: 'eur',
          product_data: {
            name: item.name,
          },
          unit_amount: Math.round(price * 100),
        },
        quantity,
      };
    });

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: lineItems,
      success_url: `${FRONTEND_URL}/checkout-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${FRONTEND_URL}/checkout-cancel`,
      metadata: {
        userId: userId || 'guest',
        ...(metadata || {}),
      },
    });

    // Optionally store session in your local entity store
    await entityStore.create('PaymentSession', {
      id: session.id,
      userId: userId || 'guest',
      status: session.status,
      amount_total: session.amount_total,
      currency: session.currency,
      createdAt: new Date().toISOString(),
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * Optional: Confirm payment intent manually (if you use PaymentIntents directly)
 * Keeping your previous shape but now wired to Stripe if needed.
 */
router.post('/confirm', authenticate, async (req, res) => {
  try {
    const stripe = getStripe();
    const { paymentIntentId, paymentMethodId } = req.body;

    if (!paymentIntentId) {
      return res.status(400).json({ error: 'Payment intent ID required' });
    }

    const intent = await stripe.paymentIntents.confirm(paymentIntentId, {
      payment_method: paymentMethodId,
    });

    // Update local store
    await entityStore.update('PaymentIntent', paymentIntentId, {
      status: intent.status,
      paymentMethodId,
      updatedAt: new Date().toISOString(),
    });

    res.json({
      success: true,
      data: {
        status: intent.status,
        paymentIntentId,
      },
    });
  } catch (error) {
    console.error('Error confirming payment:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * Stripe Webhook
 * Set endpoint in Stripe dashboard to: https://your-domain.com/api/payments/webhook
 */
router.post(
  '/webhook',
  express.raw({ type: 'application/json' }),
  async (req, res) => {
    let event;

    try {
      const stripe = STRIPE_SECRET_KEY ? getStripe() : null;
      if (!STRIPE_WEBHOOK_SECRET) {
        console.warn('⚠️ STRIPE_WEBHOOK_SECRET not set, skipping signature verification.');
        event = JSON.parse(req.rawBody ? req.rawBody.toString('utf8') : JSON.stringify(req.body));
      } else {
        const sig = req.headers['stripe-signature'];
        event = stripe.webhooks.constructEvent(
          req.rawBody,
          sig,
          STRIPE_WEBHOOK_SECRET
        );
      }
    } catch (err) {
      console.error('Webhook signature verification failed:', err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    try {
      switch (event.type) {
        case "checkout.session.completed": {
          const session = event.data.object;
          const existing = await entityStore.filter('Order', { stripeSessionId: session.id });
          if (existing.length === 0) {
            await entityStore.create("Order", {
              stripeSessionId: session.id,
              userId: session.metadata.userId || null,
              amount: session.amount_total / 100,
              currency: session.currency,
              status: "processing",
              paymentStatus: "paid",
              createdAt: new Date().toISOString(),
            });
          }
          break;
        }

        case 'payment_intent.succeeded': {
          const intent = event.data.object;
          console.log('✅ PaymentIntent succeeded:', intent.id);
          break;
        }
        case 'payment_intent.payment_failed': {
          const intent = event.data.object;
          console.log('❌ PaymentIntent failed:', intent.id);
          break;
        }
        default:
          console.log('Unhandled event type:', event.type);
      }

      res.json({ received: true });
    } catch (error) {
      console.error('Webhook handling error:', error);
      res.status(500).json({ error: error.message });
    }
  }
);

/**
 * Get payment methods for user (still mocked or can be wired to Stripe)
 */
router.get('/methods', authenticate, async (req, res) => {
  try {
    const stripe = getStripe();
    const userId = req.user.id;

    // Example: list payment methods if you store Stripe customer ID
    // const paymentMethods = await stripe.paymentMethods.list({
    //   customer: stripeCustomerId,
    //   type: 'card',
    // });

    const paymentMethods = {
      object: 'list',
      data: [],
      total_count: 0,
      userId,
    };

    res.json({ success: true, data: paymentMethods });
  } catch (error) {
    console.error('Error fetching payment methods:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * Process refund
 */
router.post('/refund', authenticate, async (req, res) => {
  try {
    const stripe = getStripe();
    const { paymentIntentId, amount, reason } = req.body;

    if (!paymentIntentId) {
      return res.status(400).json({ error: 'Payment intent ID required' });
    }

    const refund = await stripe.refunds.create({
      payment_intent: paymentIntentId,
      amount: amount ? Math.round(amount * 100) : undefined,
      reason: reason || 'requested_by_customer',
    });

    const savedRefund = await entityStore.create('Refund', {
      id: refund.id,
      payment_intent: refund.payment_intent,
      amount: refund.amount,
      status: refund.status,
      reason: refund.reason,
      createdAt: new Date().toISOString(),
    });

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
