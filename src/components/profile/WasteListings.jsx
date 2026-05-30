import React from 'react';
import { motion } from 'framer-motion';
import { Package } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function WasteListings({ listings = [] }) {
  if (listings.length === 0) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-card border border-border rounded-lg p-12 text-center">
        <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground">No waste listings yet</p>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {listings.map((listing) => (
        <div key={listing.id} className="bg-card border border-border rounded-lg overflow-hidden hover:border-primary/50 transition-colors">
          {listing.images?.[0] && (
            <div className="w-full h-40 bg-muted overflow-hidden">
              <img src={listing.images[0]} alt={listing.materialType} className="w-full h-full object-cover" />
            </div>
          )}

          <div className="p-4">
            <div className="flex items-start justify-between mb-3">
              <h3 className="font-bold text-sm">{listing.materialType}</h3>
              <Badge className={listing.available ? 'bg-signal/20 text-signal' : 'bg-muted text-muted-foreground'}>
                {listing.available ? 'Available' : 'Sold Out'}
              </Badge>
            </div>

            <p className="text-xs font-mono-code text-muted-foreground mb-2">
              {listing.weight?.value}{listing.weight?.unit || 'kg'} • {listing.condition}
            </p>

            {listing.color && (
              <p className="text-xs text-muted-foreground mb-3">
                Color: <span className="font-medium">{listing.color}</span>
              </p>
            )}

            {listing.description && (
              <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                {listing.description}
              </p>
            )}

            <div className="border-t border-border pt-3 mt-3">
              <p className="text-sm font-bold">€{listing.pricePerKg.toFixed(2)}/kg</p>
              <p className="text-xs text-muted-foreground">Total: €{listing.totalPrice.toFixed(2)}</p>
            </div>

            <div className="flex gap-2 mt-3 text-xs text-muted-foreground">
              <span>👁 {listing.viewCount || 0} views</span>
              <span>📦 {listing.soldCount || 0} sold</span>
            </div>
          </div>
        </div>
      ))}
    </motion.div>
  );
}
