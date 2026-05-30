import React from "react";
import { motion } from "framer-motion";

export default function CartSummary({
  items = [],
  subtotal = 0,
  shipping = 0,
  total = 0,
  onCheckout,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="border border-border bg-card rounded-xl p-6 shadow-sm space-y-6"
    >
      <h2 className="text-lg font-display font-bold">Order Summary</h2>

      {/* Items */}
      <div className="space-y-3">
        {items.map((item, i) => (
          <div
            key={i}
            className="flex justify-between text-sm text-muted-foreground"
          >
            <span>
              {item.title} × {item.quantity}
            </span>
            <span>€{(item.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}

        {items.length === 0 && (
          <p className="text-sm text-muted-foreground">Your cart is empty</p>
        )}
      </div>

      {/* Subtotal */}
      <div className="flex justify-between text-sm pt-4 border-t border-border">
        <span className="font-mono-code text-muted-foreground">Subtotal</span>
        <span className="font-medium">€{subtotal.toFixed(2)}</span>
      </div>

      {/* Shipping */}
      <div className="flex justify-between text-sm">
        <span className="font-mono-code text-muted-foreground">Shipping</span>
        <span className="font-medium">
          {shipping === 0 ? "—" : `€${shipping.toFixed(2)}`}
        </span>
      </div>

      {/* Total */}
      <div className="flex justify-between text-base font-display font-bold pt-4 border-t border-border">
        <span>Total</span>
        <span>€{total.toFixed(2)}</span>
      </div>

      {/* Checkout Button */}
      <button
        onClick={onCheckout}
        disabled={items.length === 0}
        className={`w-full py-3 rounded-lg font-display font-semibold text-sm transition ${
          items.length === 0
            ? "bg-muted text-muted-foreground cursor-not-allowed"
            : "bg-primary text-primary-foreground hover:bg-primary/90 active:scale-[0.98]"
        }`}
      >
        Checkout
      </button>
    </motion.div>
  );
}
