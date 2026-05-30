import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, ArrowLeft, Package } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/lib/AuthContext';
import CartItem from './CartItem';
import SiteLayout from '@/components/layout/SiteLayout';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import CartSummary from "@/components/cart/CartSummary";

export default function CartPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { items, removeFromCart, updateQuantity, subtotal, shippingCost, taxAmount, total } = useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/checkout' } });
      return;
    }
    setIsCheckingOut(true);
    // Navigate to checkout page
    navigate('/checkout');
  };

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
              onClick={() => navigate('/store')}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Continue Shopping
            </button>

            <div className="flex items-center gap-3 mb-2">
              <ShoppingCart className="w-8 h-8" />
              <h1 className="text-3xl md:text-4xl font-bold">Shopping Cart</h1>
            </div>
            <p className="text-muted-foreground">
              {items.length} {items.length === 1 ? 'item' : 'items'} in your cart
            </p>
          </motion.div>

          {items.length === 0 ? (
            // Empty Cart State
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-16 text-center"
            >
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <Package className="w-8 h-8 text-muted-foreground" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
              <p className="text-muted-foreground mb-8 max-w-sm">
                Start shopping to add items to your cart. Browse our products and find what you need.
              </p>
              <Button onClick={() => navigate('/store')} size="lg">
                Continue Shopping
              </Button>
            </motion.div>
          ) : (
            // Cart Items
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="lg:col-span-2"
              >
                <div className="bg-card border border-border rounded-lg p-6">
                  <h2 className="text-lg font-bold mb-6">Order Summary</h2>

                  <AnimatePresence mode="popLayout">
                    {items.map((item) => (
                      <CartItem
                        key={item.id}
                        item={item}
                        onRemove={removeFromCart}
                        onUpdateQuantity={updateQuantity}
                      />
                    ))}
                  </AnimatePresence>
                </div>

                {/* Shipping Selection Info */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="mt-6 p-4 bg-accent/10 border border-accent/20 rounded-lg"
                >
                  <p className="text-sm text-accent">
                    💡 <span className="font-medium">Shipping will be calculated at checkout</span> based on your location and order weight.
                  </p>
                </motion.div>
              </motion.div>

              {/* Summary Sidebar */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="lg:col-span-1"
              >
                <div className="sticky top-6 space-y-6">
                  <div className="bg-card border border-border rounded-lg p-6">
                    <h3 className="text-lg font-bold mb-6">Cart Summary</h3>
                        <CartSummary
                        items={cartItems}
                        subtotal={subtotal}
                        shipping={shippingCost}
                        total={subtotal + shippingCost}
                        onCheckout={() => console.log("Checkout clicked")}
                        />
                  </div>

                  {/* Info Cards */}
                  <div className="space-y-3 text-sm">
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <p className="font-mono-code text-xs text-muted-foreground mb-1">SHIPPING</p>
                      <p className="text-sm">Calculated at checkout</p>
                    </div>
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <p className="font-mono-code text-xs text-muted-foreground mb-1">SECURITY</p>
                      <p className="text-sm">Secure SSL checkout</p>
                    </div>
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <p className="font-mono-code text-xs text-muted-foreground mb-1">SUPPORT</p>
                      <p className="text-sm">24/7 customer support</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </div>
      </div>
    </SiteLayout>
  );
}
