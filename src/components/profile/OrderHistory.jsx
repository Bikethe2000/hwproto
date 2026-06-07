import React from 'react';
import { motion } from 'framer-motion';
import { Package } from 'lucide-react';

export default function OrderHistory({ orders = [] }) {
  if (orders.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-card border border-border rounded-lg p-12 text-center"
      >
        <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground">No orders yet</p>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
      {orders.map((order) => (
        <div
          key={order.id}
          className="bg-card border border-border rounded-lg p-6 hover:border-primary/50 transition-colors"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div>
              <p className="text-xs font-mono-code text-muted-foreground mb-1">ORDER ID</p>
              <p className="font-mono-code text-sm">{order.id.slice(0, 12)}...</p>
            </div>
            <div>
              <p className="text-xs font-mono-code text-muted-foreground mb-1">DATE</p>
              <p className="text-sm">{new Date(order.createdAt || order.created_date || Date.now()).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-xs font-mono-code text-muted-foreground mb-1">TOTAL</p>
              <p className="text-sm font-bold">€{Number(order.total ?? order.amount ?? 0).toFixed(2)}</p>
            </div>
            <div className="flex items-end">
              <div>
                <p className="text-xs font-mono-code text-muted-foreground mb-1">STATUS</p>
                <span
                  className={`text-xs px-2 py-1 rounded font-medium ${
                    (order.status || 'processing') === 'delivered'
                      ? 'bg-signal/20 text-signal'
                      : (order.status || 'processing') === 'shipped'
                      ? 'bg-primary/20 text-primary'
                      : 'bg-accent/20 text-accent'
                }`}
                >
                  {order.status || 'processing'}
                </span>
              </div>
            </div>
          </div>

          <div className="border-t border-border pt-4">
            <p className="text-xs font-mono-code text-muted-foreground mb-3">
              ITEMS ({order.items?.length || 0})
            </p>
            <div className="space-y-2">
              {order.items?.slice(0, 3).map((item, idx) => (
                <p key={idx} className="text-sm text-muted-foreground">
                  {item.quantity}× Product ({item.productId})
                </p>
              ))}
              {order.items?.length > 3 && (
                <p className="text-xs text-muted-foreground">
                  +{order.items.length - 3} more items
                </p>
              )}
            </div>
          </div>

          {order.shippingMethod && (
            <p className="mt-3 text-xs text-muted-foreground">
              📦 Shipped via {order.shippingMethod}
              {order.trackingNumber && ` — Tracking: ${order.trackingNumber}`}
            </p>
          )}
        </div>
      ))}
    </motion.div>
  );
}
