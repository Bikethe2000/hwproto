import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Package, Loader2 } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/lib/AuthContext';
import { api } from '@/api/apiClient';
import SiteLayout from '@/components/layout/SiteLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogTitle } from '@/components/ui/alert-dialog';

export default function Checkout() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const { items, subtotal, shippingCost, taxAmount, total, setShipping, clearCart } = useCart();

  const [step, setStep] = useState('shipping'); // shipping, payment, review
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  // Form states
  const [shippingAddress, setShippingAddress] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: '',
    street: '',
    city: '',
    postalCode: '',
    country: 'GR',
    region: '',
  });

  const [shippingMethod, setShippingMethodState] = useState(null);
  const [shippingMethods, setShippingMethods] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [orderNotes, setOrderNotes] = useState('');

  // Validate authentication
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/checkout' } });
    }
  }, [isAuthenticated, navigate]);

  // Fetch shipping methods
  useEffect(() => {
    if (shippingAddress.country && subtotal > 0) {
      fetchShippingMethods();
    }
  }, [shippingAddress.country, subtotal]);

  const fetchShippingMethods = async () => {
    try {
      const weight = items.reduce((sum, item) => sum + (item.weight || 1), 0);
      const params = new URLSearchParams({
        country: shippingAddress.country,
        weight: Math.max(weight, 0.5),
        region: shippingAddress.region || '',
        isRemoteArea: isRemoteArea() ? 'true' : 'false',
      });

      const response = await fetch(`/api/shipping/calculate?${params}`);
      const data = await response.json();

      if (data.success) {
        setShippingMethods(data.data || []);
        // Select first method by default
        if (data.data.length > 0 && !shippingMethod) {
          selectShippingMethod(data.data[0]);
        }
      }
    } catch (error) {
      console.error('Failed to fetch shipping methods:', error);
    }
  };

  const isRemoteArea = () => {
    // Simple logic - can be enhanced based on postal code database
    const remotePostalCodes = ['60000', '59000', '61000']; // Example remote areas
    return remotePostalCodes.includes(shippingAddress.postalCode);
  };

  const selectShippingMethod = (method) => {
    setShippingMethodState(method);
    setShipping(method.name, method.cost);
  };

  const handleAddressChange = (field, value) => {
    setShippingAddress((prev) => ({ ...prev, [field]: value }));
  };

  const validateShipping = () => {
    if (
      !shippingAddress.fullName ||
      !shippingAddress.email ||
      !shippingAddress.phone ||
      !shippingAddress.street ||
      !shippingAddress.city ||
      !shippingAddress.postalCode ||
      !shippingMethod
    ) {
      return false;
    }
    return true;
  };

  const handlePlaceOrder = async () => {
    if (!validateShipping()) {
      alert('Please fill in all required fields');
      return;
    }

    setIsLoading(true);

    try {
      // Create order
      const orderData = {
        items: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          priceAtTime: item.priceAtTime,
        })),
        shippingAddress,
        shippingMethod: shippingMethod.name,
        shippingCost: shippingMethod.cost,
        total,
        notes: orderNotes,
      };

      const response = await api.post('/orders', orderData);

      if (response.success) {
        const orderId = response.data.id;

        // Initialize payment intent if paying with card
        if (paymentMethod === 'card') {
          const paymentResponse = await api.post('/payments/create-intent', {
            amount: total,
            currency: 'eur',
            orderId,
          });

          if (paymentResponse.success) {
            // Redirect to payment page
            navigate('/order-confirmation', {
              state: { orderId, clientSecret: paymentResponse.data.clientSecret },
            });
          }
        } else {
          // Direct confirmation without payment
          navigate('/order-confirmation', { state: { orderId } });
        }

        clearCart();
      }
    } catch (error) {
      console.error('Failed to place order:', error);
      alert('Failed to place order: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  if (items.length === 0) {
    return (
      <SiteLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg text-muted-foreground mb-4">Your cart is empty</p>
            <Button onClick={() => navigate('/store')}>Continue Shopping</Button>
          </div>
        </div>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      <div className="min-h-screen bg-background py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <button
              onClick={() => navigate('/cart')}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Cart
            </button>

            <h1 className="text-3xl md:text-4xl font-bold mb-2">Checkout</h1>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="lg:col-span-2 space-y-8"
            >
              {/* Step 1: Shipping Address */}
              <div className="bg-card border border-border rounded-lg p-6">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold">
                    1
                  </span>
                  Shipping Address
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    placeholder="Full Name *"
                    value={shippingAddress.fullName}
                    onChange={(e) => handleAddressChange('fullName', e.target.value)}
                  />
                  <Input
                    placeholder="Email *"
                    type="email"
                    value={shippingAddress.email}
                    onChange={(e) => handleAddressChange('email', e.target.value)}
                  />
                  <Input
                    placeholder="Phone *"
                    value={shippingAddress.phone}
                    onChange={(e) => handleAddressChange('phone', e.target.value)}
                  />
                  <Input
                    placeholder="Street Address *"
                    value={shippingAddress.street}
                    onChange={(e) => handleAddressChange('street', e.target.value)}
                  />
                  <Input
                    placeholder="City *"
                    value={shippingAddress.city}
                    onChange={(e) => handleAddressChange('city', e.target.value)}
                  />
                  <Input
                    placeholder="Postal Code *"
                    value={shippingAddress.postalCode}
                    onChange={(e) => handleAddressChange('postalCode', e.target.value)}
                  />

                  <select
                    value={shippingAddress.country}
                    onChange={(e) => handleAddressChange('country', e.target.value)}
                    className="px-3 py-2 border border-border rounded-md bg-background"
                  >
                    <option value="GR">Greece (GR)</option>
                    <option value="AT">Austria (AT)</option>
                    <option value="BE">Belgium (BE)</option>
                    <option value="BG">Bulgaria (BG)</option>
                    <option value="DE">Germany (DE)</option>
                    <option value="ES">Spain (ES)</option>
                    <option value="FR">France (FR)</option>
                    <option value="IT">Italy (IT)</option>
                    <option value="NL">Netherlands (NL)</option>
                    <option value="PL">Poland (PL)</option>
                    {/* Add more countries as needed */}
                  </select>

                  <Input
                    placeholder="Region / State"
                    value={shippingAddress.region}
                    onChange={(e) => handleAddressChange('region', e.target.value)}
                  />
                </div>
              </div>

              {/* Step 2: Shipping Method */}
              <div className="bg-card border border-border rounded-lg p-6">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold">
                    2
                  </span>
                  Shipping Method
                </h2>

                {shippingMethods.length > 0 ? (
                  <div className="space-y-3">
                    {shippingMethods.map((method) => (
                      <label
                        key={method.id}
                        className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                          shippingMethod?.id === method.id
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        <input
                          type="radio"
                          name="shippingMethod"
                          checked={shippingMethod?.id === method.id}
                          onChange={() => selectShippingMethod(method)}
                          className="w-4 h-4"
                        />
                        <div className="ml-4 flex-1">
                          <p className="font-medium">{method.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {method.estimatedDays} business days
                          </p>
                        </div>
                        <p className="font-bold">€{method.cost.toFixed(2)}</p>
                      </label>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">Loading shipping options...</p>
                )}
              </div>

              {/* Step 3: Payment Method */}
              <div className="bg-card border border-border rounded-lg p-6">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold">
                    3
                  </span>
                  Payment Method
                </h2>

                <div className="space-y-3">
                  <label className="flex items-center p-4 border-2 border-primary bg-primary/5 rounded-lg cursor-pointer">
                    <input
                      type="radio"
                      name="payment"
                      value="card"
                      checked={paymentMethod === 'card'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-4 h-4"
                    />
                    <span className="ml-4 font-medium">Credit / Debit Card (via Stripe)</span>
                  </label>
                  <label className="flex items-center p-4 border-2 border-border hover:border-primary/50 rounded-lg cursor-pointer transition-colors">
                    <input
                      type="radio"
                      name="payment"
                      value="bank"
                      checked={paymentMethod === 'bank'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-4 h-4"
                    />
                    <span className="ml-4 font-medium">Bank Transfer</span>
                  </label>
                </div>

                {paymentMethod === 'bank' && (
                  <div className="mt-4 p-4 bg-muted/50 rounded-lg text-sm">
                    <p className="font-medium mb-2">Bank Transfer Details</p>
                    <p className="text-muted-foreground">
                      Bank transfer details will be provided after order confirmation.
                    </p>
                  </div>
                )}
              </div>

              {/* Order Notes */}
              <div className="bg-card border border-border rounded-lg p-6">
                <label className="block mb-3">
                  <p className="font-medium text-sm mb-2">Order Notes (Optional)</p>
                  <textarea
                    placeholder="Add special instructions or notes..."
                    value={orderNotes}
                    onChange={(e) => setOrderNotes(e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-md bg-background resize-none"
                    rows={4}
                  />
                </label>
              </div>
            </motion.div>

            {/* Order Summary Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-1"
            >
              <div className="sticky top-6 space-y-4">
                <div className="bg-card border border-border rounded-lg p-6">
                  <h3 className="text-lg font-bold mb-6">Order Summary</h3>

                  <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                    {items.map((item) => (
                      <div key={item.id} className="text-sm border-b border-border pb-3 last:border-0">
                        <div className="flex justify-between mb-1">
                          <span className="line-clamp-1">{item.productName}</span>
                          <span className="font-mono-code">×{item.quantity}</span>
                        </div>
                        <p className="text-muted-foreground">
                          €{(item.priceAtTime * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>

                  <Separator />

                  <div className="space-y-3 text-sm my-6">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>€{subtotal.toFixed(2)}</span>
                    </div>
                    {shippingCost > 0 && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Shipping</span>
                        <span>€{shippingCost.toFixed(2)}</span>
                      </div>
                    )}
                    {taxAmount > 0 && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Tax</span>
                        <span>€{taxAmount.toFixed(2)}</span>
                      </div>
                    )}
                  </div>

                  <Separator />

                  <div className="flex justify-between text-lg font-bold mt-6 mb-6">
                    <span>Total</span>
                    <span>€{total.toFixed(2)}</span>
                  </div>

                  <Button
                    onClick={() => setShowConfirmDialog(true)}
                    disabled={isLoading || !validateShipping()}
                    size="lg"
                    className="w-full"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      'Place Order'
                    )}
                  </Button>
                </div>

                {/* Trust Badges */}
                <div className="space-y-2 text-xs text-muted-foreground">
                  <p>✓ Secure SSL Checkout</p>
                  <p>✓ Fast Shipping</p>
                  <p>✓ 24/7 Support</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogTitle>Confirm Order</AlertDialogTitle>
          <AlertDialogDescription>
            You are about to place an order for €{total.toFixed(2)}. This order will be shipped to:{' '}
            <strong>{shippingAddress.street}, {shippingAddress.city}</strong>
          </AlertDialogDescription>
          <div className="flex gap-3 justify-end">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handlePlaceOrder}>Confirm Order</AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </SiteLayout>
  );
}
