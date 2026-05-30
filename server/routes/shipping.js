const express = require('express');
const router = express.Router();
const entityStore = require('../localEntityStore');

// Shipping rates - configuration
const DEFAULT_SHIPPING_RULES = [
  {
    id: 'boxnow-greece',
    name: 'BoxNow (Greece)',
    carrier: 'BoxNow',
    applicableCountries: ['GR'],
    applicableRegions: ['Greece'],
    maxWeight: 30,
    baseCost: 2.5,
    remoteAreaSurcharge: 1.5,
    estimatedDays: 1,
    priority: 1,
  },
  {
    id: 'elta-greece',
    name: 'ELTA Courier (Greece)',
    carrier: 'ELTA',
    applicableCountries: ['GR'],
    applicableRegions: ['Greece'],
    maxWeight: 50,
    baseCost: 4.0,
    remoteAreaSurcharge: 2.0,
    estimatedDays: 2,
    priority: 2,
  },
  {
    id: 'eu-standard',
    name: 'EU Standard Shipping',
    carrier: 'ELTA',
    applicableCountries: ['AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'HU', 'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL', 'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE'],
    maxWeight: 50,
    baseCost: 8.0,
    estimatedDays: 5,
    priority: 3,
  },
  {
    id: 'dhl-international',
    name: 'DHL Express (International)',
    carrier: 'DHL',
    applicableCountries: [], // Available globally
    maxWeight: 100,
    costPerKg: 1.5,
    baseCost: 15.0,
    estimatedDays: 3,
    priority: 4,
  },
];

// Get available shipping methods
router.get('/methods', async (req, res) => {
  try {
    const { country, weight, region } = req.query;

    let methods = [...DEFAULT_SHIPPING_RULES];

    if (country) {
      methods = methods.filter(
        (m) => m.applicableCountries.length === 0 || m.applicableCountries.includes(country.toUpperCase())
      );
    }

    if (weight) {
      const w = parseFloat(weight);
      methods = methods.filter((m) => w <= m.maxWeight);
    }

    methods.sort((a, b) => a.priority - b.priority);

    res.json({ success: true, data: methods });
  } catch (error) {
    console.error('Error fetching shipping methods:', error);
    res.status(500).json({ error: error.message });
  }
});

// Calculate shipping cost
router.get('/calculate', async (req, res) => {
  try {
    const { country, weight, region, isRemoteArea, shippingMethodId } = req.query;

    if (!country || !weight) {
      return res.status(400).json({ error: 'Country and weight are required' });
    }

    let methods = [...DEFAULT_SHIPPING_RULES];

    if (country) {
      methods = methods.filter(
        (m) => m.applicableCountries.length === 0 || m.applicableCountries.includes(country.toUpperCase())
      );
    }

    const w = parseFloat(weight);
    methods = methods.filter((m) => w <= m.maxWeight);

    if (shippingMethodId) {
      const selected = methods.find((m) => m.id === shippingMethodId);
      if (!selected) {
        return res.status(400).json({ error: 'Selected shipping method not available for this destination' });
      }
      methods = [selected];
    }

    // Calculate cost for each method
    const results = methods.map((method) => {
      let cost = method.baseCost;
      
      if (method.costPerKg) {
        cost += w * method.costPerKg;
      }

      if (isRemoteArea === 'true' && method.remoteAreaSurcharge) {
        cost += method.remoteAreaSurcharge;
      }

      return {
        id: method.id,
        name: method.name,
        carrier: method.carrier,
        cost: parseFloat(cost.toFixed(2)),
        estimatedDays: method.estimatedDays,
        estimatedDelivery: calculateDeliveryDate(method.estimatedDays),
      };
    });

    results.sort((a, b) => a.cost - b.cost);

    res.json({ success: true, data: results });
  } catch (error) {
    console.error('Error calculating shipping:', error);
    res.status(500).json({ error: error.message });
  }
});

// Estimate delivery date
router.post('/estimate', async (req, res) => {
  try {
    const { country, weight, shippingMethodId } = req.body;

    if (!country || !weight) {
      return res.status(400).json({ error: 'Country and weight are required' });
    }

    let method = DEFAULT_SHIPPING_RULES.find((m) => m.id === shippingMethodId);

    if (!method) {
      return res.status(400).json({ error: 'Shipping method not found' });
    }

    const estimatedDelivery = calculateDeliveryDate(method.estimatedDays);

    res.json({
      success: true,
      data: {
        estimatedDays: method.estimatedDays,
        estimatedDelivery,
        method: method.name,
      },
    });
  } catch (error) {
    console.error('Error estimating delivery:', error);
    res.status(500).json({ error: error.message });
  }
});

// Helper function to calculate delivery date
function calculateDeliveryDate(days) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().split('T')[0];
}

module.exports = router;
