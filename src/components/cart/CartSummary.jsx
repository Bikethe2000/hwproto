import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

export default function CartSummary({ 
  subtotal = 0, 
  shippingCost = 0, 
  taxAmount = 0, 
  total = 0,
  onCheckout = () => {},
  isLoading = false 
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <div className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Subtotal</span>
          <span className="font-medium">€{subtotal.toFixed(2)}</span>
        </div>

        {shippingCost > 0 && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">Shipping</span>
            <span className="font-medium">€{shippingCost.toFixed(2)}</span>
          </div>
        )}

        {taxAmount > 0 && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">Tax</span>
            <span className="font-medium">€{taxAmount.toFixed(2)}</span>
          </div>
        )}
      </div>

      <Separator />

      <div className="flex justify-between items-center text-base font-bold">
        <span>Total</span>
        <span className="text-lg">€{total.toFixed(2)}</span>
      </div>

      <Button
        onClick={onCheckout}
        disabled={isLoading || subtotal === 0}
        className="w-full mt-4"
        size="lg"
      >
        {isLoading ? 'Processing...' : 'Proceed to Checkout'}
      </Button>
    </motion.div>
  );
}
