import React from 'react';
import { motion } from 'framer-motion';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function CartItem({ item, onRemove, onUpdateQuantity }) {
  const itemTotal = (item.priceAtTime * item.quantity).toFixed(2);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="flex gap-4 py-4 border-b border-border last:border-b-0"
    >
      {/* Product Image */}
      <div className="flex-shrink-0 w-20 h-20 rounded-lg bg-muted overflow-hidden">
        {item.image && (
          <img
            src={item.image}
            alt={item.productName}
            className="w-full h-full object-cover"
          />
        )}
      </div>

      {/* Product Info */}
      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-sm line-clamp-2 mb-1">{item.productName}</h3>
        {item.variant && (
          <p className="text-xs text-muted-foreground mb-2">
            {Object.entries(item.variant)
              .map(([key, val]) => `${key}: ${val}`)
              .join(', ')}
          </p>
        )}
        <p className="text-sm font-mono-code text-muted-foreground">
          €{item.priceAtTime.toFixed(2)} × {item.quantity} = €{itemTotal}
        </p>
      </div>

      {/* Quantity Controls */}
      <div className="flex items-center gap-2 ml-4">
        <button
          onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
          className="w-8 h-8 rounded border border-border hover:bg-muted transition-colors flex items-center justify-center text-sm"
        >
          −
        </button>
        <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
        <button
          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
          className="w-8 h-8 rounded border border-border hover:bg-muted transition-colors flex items-center justify-center text-sm"
        >
          +
        </button>
      </div>

      {/* Remove Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => onRemove(item.id)}
        className="flex-shrink-0 p-2 text-destructive hover:bg-destructive/10 rounded transition-colors"
      >
        <Trash2 className="w-4 h-4" />
      </motion.button>
    </motion.div>
  );
}
