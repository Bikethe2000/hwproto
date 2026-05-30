import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Check } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { Button } from '@/components/ui/button';

export default function AddToCartButton({ product, quantity = 1, variant = null, className = '' }) {
  const { addToCart } = useCart();
  const [isAdded, setIsAdded] = useState(false);

  const handleClick = () => {
    addToCart(product, quantity, variant);
    setIsAdded(true);
    // Auto-hide after 2 seconds
    const timer = setTimeout(() => setIsAdded(false), 2000);
    return () => clearTimeout(timer);
  };

  return (
    <AnimatePresence mode="wait">
      {isAdded ? (
        <motion.div
          key="added"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className={className}
        >
          <Button disabled className="w-full gap-2 bg-signal/20 text-signal border-signal/30 hover:bg-signal/20">
            <Check className="w-4 h-4" />
            Added to Cart
          </Button>
        </motion.div>
      ) : (
        <motion.div
          key="add"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className={className}
        >
          <Button onClick={handleClick} className="w-full gap-2">
            <ShoppingCart className="w-4 h-4" />
            Add to Cart
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
