import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Star } from 'lucide-react';

export default function SalesHistory({ sales = {} }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Sales Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            <p className="text-xs font-mono-code text-muted-foreground">TOTAL SALES</p>
          </div>
          <p className="text-3xl font-bold">{sales.totalSales || 0}</p>
          <p className="text-xs text-muted-foreground mt-2">Items sold</p>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <p className="text-xs font-mono-code text-muted-foreground mb-2">EARNINGS</p>
          <p className="text-3xl font-bold">€{(sales.totalEarnings || 0).toFixed(2)}</p>
          <p className="text-xs text-muted-foreground mt-2">Total revenue</p>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center gap-2 mb-2">
            <Star className="w-5 h-5 text-accent" />
            <p className="text-xs font-mono-code text-muted-foreground">RATING</p>
          </div>
          <p className="text-3xl font-bold">{sales.sellerRating?.toFixed(1) || '5.0'}</p>
          <p className="text-xs text-muted-foreground mt-2">Seller rating</p>
        </div>
      </div>

      {/* Reviews */}
      {sales.sellerReviews && sales.sellerReviews.length > 0 && (
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-lg font-bold mb-4">Customer Reviews</h3>
          <div className="space-y-4">
            {sales.sellerReviews.map((review, idx) => (
              <div key={idx} className="border-b border-border pb-4 last:border-0">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium">{review.buyerName}</p>
                  <div className="flex gap-1">
                    {[...Array(Math.round(review.rating))].map((_, i) => (
                      <span key={i}>⭐</span>
                    ))}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{review.comment}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {new Date(review.date).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}
