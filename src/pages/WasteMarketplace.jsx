import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Filter, Loader2, AlertCircle } from 'lucide-react';
import { api } from '@/api/apiClient';
import { useAuth } from '@/lib/AuthContext';
import { useCart } from '@/hooks/useCart';
import SiteLayout from '@/components/layout/SiteLayout';
import PageHero from '@/components/shared/PageHero';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

const MATERIALS = ['PLA', 'ABS', 'PETG', 'TPU', 'Nylon', 'Other'];
const CONDITIONS = ['Pristine', 'Good', 'Fair', 'Scrap'];

export default function WasteMarketplace() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const { addToCart } = useCart();

  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [selectedCondition, setSelectedCondition] = useState(null);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadListings();
  }, [selectedMaterial, selectedCondition, minPrice, maxPrice, searchQuery]);

  const loadListings = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();

      if (selectedMaterial) params.append('materialType', selectedMaterial);
      if (selectedCondition) params.append('condition', selectedCondition.toLowerCase());
      if (minPrice) params.append('minPrice', minPrice);
      if (maxPrice) params.append('maxPrice', maxPrice);
      if (searchQuery) params.append('search', searchQuery);

      const response = await api.get(`/waste/listings?${params}`);
      setListings(response.data || []);
      setError(null);
    } catch (err) {
      console.error('Error loading listings:', err);
      setError('Failed to load listings');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (listing) => {
    addToCart(
      {
        id: listing.id,
        title: `${listing.materialType} Waste - ${listing.weight.value}${listing.weight.unit}`,
        price: listing.pricePerKg,
        image_url: listing.images?.[0],
      },
      listing.quantity || 1
    );
  };

  return (
    <SiteLayout>
      <div>
        {/* Hero */}
        <PageHero
          label="3D Printing Materials"
          title="Waste Marketplace"
          description="Buy and sell 3D printer waste materials. Support the circular economy by recycling printing scraps."
        />

        <div className="min-h-screen bg-background py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header with Create Button */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-8"
            >
              <h2 className="text-2xl font-bold">Available Listings</h2>
              {isAuthenticated && (
                <Button
                  onClick={() => navigate('/waste/create')}
                  className="gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Create Listing
                </Button>
              )}
            </motion.div>

            {/* Search & Filter */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-8 space-y-4"
            >
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by material, color, or description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Filter Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
              >
                <Filter className="w-4 h-4" />
                {showFilters ? 'Hide Filters' : 'Show Filters'}
              </button>

              {/* Filters */}
              <AnimatePresence>
                {showFilters && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-card border border-border rounded-lg p-6 space-y-6"
                  >
                    {/* Material Filter */}
                    <div>
                      <label className="text-sm font-mono-code text-muted-foreground mb-3 block">
                        MATERIAL TYPE
                      </label>
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => setSelectedMaterial(null)}
                          className={`px-3 py-1 text-xs rounded-md border transition-colors ${
                            selectedMaterial === null
                              ? 'bg-primary text-primary-foreground border-primary'
                              : 'border-border hover:bg-muted'
                          }`}
                        >
                          All
                        </button>
                        {MATERIALS.map((mat) => (
                          <button
                            key={mat}
                            onClick={() => setSelectedMaterial(mat)}
                            className={`px-3 py-1 text-xs rounded-md border transition-colors ${
                              selectedMaterial === mat
                                ? 'bg-primary text-primary-foreground border-primary'
                                : 'border-border hover:bg-muted'
                            }`}
                          >
                            {mat}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Condition Filter */}
                    <div>
                      <label className="text-sm font-mono-code text-muted-foreground mb-3 block">
                        CONDITION
                      </label>
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => setSelectedCondition(null)}
                          className={`px-3 py-1 text-xs rounded-md border transition-colors ${
                            selectedCondition === null
                              ? 'bg-primary text-primary-foreground border-primary'
                              : 'border-border hover:bg-muted'
                          }`}
                        >
                          All
                        </button>
                        {CONDITIONS.map((cond) => (
                          <button
                            key={cond}
                            onClick={() => setSelectedCondition(cond)}
                            className={`px-3 py-1 text-xs rounded-md border transition-colors ${
                              selectedCondition === cond
                                ? 'bg-primary text-primary-foreground border-primary'
                                : 'border-border hover:bg-muted'
                            }`}
                          >
                            {cond}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Price Filter */}
                    <div>
                      <label className="text-sm font-mono-code text-muted-foreground mb-3 block">
                        PRICE PER KG (€)
                      </label>
                      <div className="flex gap-2">
                        <Input
                          type="number"
                          placeholder="Min"
                          value={minPrice}
                          onChange={(e) => setMinPrice(e.target.value)}
                        />
                        <Input
                          type="number"
                          placeholder="Max"
                          value={maxPrice}
                          onChange={(e) => setMaxPrice(e.target.value)}
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Results */}
            {error ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-destructive/20 border border-destructive/30 rounded-lg p-12 text-center"
              >
                <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
                <p className="text-destructive">{error}</p>
              </motion.div>
            ) : loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin" />
              </div>
            ) : listings.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-card border border-border rounded-lg p-12 text-center"
              >
                <p className="text-muted-foreground mb-4">No listings found</p>
                {selectedMaterial || selectedCondition || minPrice || maxPrice || searchQuery ? (
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedMaterial(null);
                      setSelectedCondition(null);
                      setMinPrice('');
                      setMaxPrice('');
                    }}
                  >
                    Clear Filters
                  </Button>
                ) : null}
              </motion.div>
            ) : (
              <>
                <p className="text-sm text-muted-foreground mb-6">
                  Found {listings.length} {listings.length === 1 ? 'listing' : 'listings'}
                </p>
                <motion.div
                  layout
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                >
                  <AnimatePresence mode="popLayout">
                    {listings.map((listing) => (
                      <motion.div
                        key={listing.id}
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="group bg-card border border-border rounded-lg overflow-hidden hover:border-primary/50 transition-all duration-300 hover:shadow-lg flex flex-col"
                      >
                        {/* Image */}
                        <div className="relative w-full h-40 bg-muted overflow-hidden cursor-pointer">
                          {listing.images?.[0] ? (
                            <motion.img
                              src={listing.images[0]}
                              alt={listing.materialType}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-accent/20">
                              <span className="text-2xl">📦</span>
                            </div>
                          )}

                          {!listing.available && (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                              <span className="text-white font-bold">Sold Out</span>
                            </div>
                          )}

                          {/* Seller Badge */}
                          <div className="absolute top-2 right-2">
                            <Badge
                              className={listing.available ? 'bg-signal/90' : 'bg-muted/90'}
                            >
                              ⭐ {listing.sellerInfo?.rating || '5.0'}
                            </Badge>
                          </div>
                        </div>

                        {/* Content */}
                        <div className="p-4 flex-1 flex flex-col">
                          <div className="mb-3">
                            <h3
                              onClick={() => navigate(`/waste/${listing.id}`)}
                              className="font-bold text-sm mb-1 cursor-pointer hover:text-primary transition-colors line-clamp-2"
                            >
                              {listing.materialType}
                            </h3>
                            <p className="text-xs font-mono-code text-muted-foreground">
                              {listing.weight?.value}{listing.weight?.unit || 'kg'} • {listing.condition}
                            </p>
                          </div>

                          {listing.color && (
                            <p className="text-xs text-muted-foreground mb-2">
                              Color: <span className="font-medium">{listing.color}</span>
                            </p>
                          )}

                          {listing.description && (
                            <p className="text-xs text-muted-foreground mb-3 line-clamp-2 flex-1">
                              {listing.description}
                            </p>
                          )}

                          {/* Pricing */}
                          <div className="border-t border-border pt-3 mb-3">
                            <p className="text-sm font-bold">€{listing.pricePerKg.toFixed(2)}/kg</p>
                            <p className="text-xs text-muted-foreground">
                              Total: €{listing.totalPrice.toFixed(2)}
                            </p>
                          </div>

                          {/* Stats */}
                          <div className="flex gap-2 text-xs text-muted-foreground mb-3 border-b border-border pb-3">
                            <span>👁 {listing.viewCount || 0}</span>
                            <span>📦 {listing.soldCount || 0} sold</span>
                          </div>

                          {/* Seller Info */}
                          {listing.sellerInfo && (
                            <p className="text-xs text-muted-foreground mb-3">
                              by <span className="font-medium">{listing.sellerInfo.name}</span>
                            </p>
                          )}

                          {/* Button */}
                          <Button
                            onClick={() => handleAddToCart(listing)}
                            disabled={!listing.available}
                            variant={listing.available ? 'default' : 'secondary'}
                            size="sm"
                            className="w-full"
                          >
                            {listing.available ? 'Add to Cart' : 'Unavailable'}
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>
              </>
            )}
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}
