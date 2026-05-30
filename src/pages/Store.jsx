import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Loader2, Package, Globe, Truck, Info } from 'lucide-react';
import { api } from '@/api/apiClient';
import PageHero from '../components/shared/PageHero';
import SectionLabel from '../components/shared/SectionLabel';
import ShippingCalculator from '../components/shipping/ShippingCalculator';
import ProductDetailModal from '../components/product/ProductDetailModal';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/hooks/useCart';

const STATUS_CONFIG = {
  in_stock: { label: 'In Stock', class: 'text-signal border-signal/30 bg-signal/5' },
  made_to_order: { label: 'Made to Order', class: 'text-primary border-primary/30 bg-primary/5' },
  custom_build: { label: 'Custom Build', class: 'text-accent border-accent/30 bg-accent/5' },
  out_of_stock: { label: 'Out of Stock', class: 'text-muted-foreground border-border bg-muted/30' },
};

const ALL_CATS = 'All';

export default function Store() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState(ALL_CATS);
  const [categories, setCategories] = useState([ALL_CATS]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { addToCart } = useCart();

  useEffect(() => {
    api.entities.Product.list('-sort_order')
      .then((data) => {
        const list = data.length > 0 ? data : FALLBACK_PRODUCTS;
        setProducts(list);
        const cats = [ALL_CATS, ...new Set(list.map(p => p.category).filter(Boolean))];
        setCategories(cats);
        setLoading(false);
      })
      .catch(() => {
        setProducts(FALLBACK_PRODUCTS);
        setCategories([ALL_CATS, 'Electronics', 'Hardware', 'Connectors']);
        setLoading(false);
      });
  }, []);

  const filtered = filter === ALL_CATS ? products : products.filter(p => p.category === filter);

  const getPriceLabel = (p) => {
    if (p.price_label) return p.price_label;
    if (p.price != null) return `€${p.price}`;
    return 'Request Quote';
  };

  const handleAddToCart = (product) => {
    addToCart({
      id: product.id,
      title: product.title,
      price: product.price,
      image_url: product.image_url,
      images: product.images,
    }, 1);
  };

  const handleBuyNow = (product) => {
    addToCart({
      id: product.id,
      title: product.title,
      price: product.price,
      image_url: product.image_url,
      images: product.images,
    }, 1);
    navigate('/checkout');
  };

  return (
    <div>
      <PageHero
        label="Prototyping Store"
        title="Engineering Components & Kits"
        description="Essential prototyping supplies for robotics and electronics projects. Quality components, maker-friendly prices."
      />

      {/* Shipping Info Banner */}
      <section className="border-y border-border bg-card/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col sm:flex-row gap-6">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Truck className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="font-mono-code text-xs text-primary mb-0.5">GREECE & EU COUNTRIES</p>
                <p className="text-sm text-muted-foreground">
                  BoxNow delivery — Greece, Bulgaria, France, Netherlands, Belgium, Cyprus
                </p>
              </div>
            </div>
            <div className="hidden sm:block w-px bg-border" />
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                <Globe className="w-4 h-4 text-accent" />
              </div>
              <div>
                <p className="font-mono-code text-xs text-accent mb-0.5">WORLDWIDE SHIPPING</p>
                <p className="text-sm text-muted-foreground">DHL Express — all other countries, tracked delivery</p>
              </div>
            </div>
            <div className="hidden sm:block w-px bg-border" />
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-signal/10 flex items-center justify-center flex-shrink-0">
                <Info className="w-4 h-4 text-signal" />
              </div>
              <div>
                <p className="font-mono-code text-xs text-signal mb-0.5">ORDERING</p>
                <p className="text-sm text-muted-foreground">
                  Contact via WhatsApp to place orders and get shipping quotes
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Category filters */}
          <div className="flex flex-wrap gap-2 mb-10">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-4 py-2 text-xs font-mono-code rounded-md border transition-all active:scale-[0.98] ${
                  filter === cat
                    ? 'border-primary text-primary bg-primary/10'
                    : 'border-border text-muted-foreground hover:text-foreground'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence mode="popLayout">
                {filtered.map((product, i) => {
                  const status = STATUS_CONFIG[product.status] || STATUS_CONFIG.in_stock;
                  return (
                    <motion.div
                      key={product.id || product.title}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ delay: i * 0.04 }}
                      className="group rounded-xl border border-border bg-card/50 hover:border-primary/30 transition-all overflow-hidden flex flex-col cursor-pointer"
                      onClick={() => setSelectedProduct({
                        ...product,
                        images: product.images || [product.image_url].filter(Boolean),
                        stock: product.stock ?? 10, // fallback
                      })}
                    >
                      {product.image_url ? (
                        <div
                          className="relative aspect-[4/3] overflow-hidden bg-secondary/30"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/product/${product.id}`);
                          }}
                        >
                          <img
                            src={product.image_url}
                            alt={product.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                      ) : (
                        <div className="aspect-[4/3] bg-secondary/30 flex items-center justify-center">
                          <Package className="w-8 h-8 text-muted-foreground/30" />
                        </div>
                      )}
                      <div className="p-5 flex flex-col flex-1">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <span className="font-mono-code text-[10px] px-2 py-0.5 rounded-full border border-border text-muted-foreground">
                            {product.category}
                          </span>
                          <span
                            className={`font-mono-code text-[10px] px-2 py-0.5 rounded-full border flex-shrink-0 ${status.class}`}
                          >
                            {status.label}
                          </span>
                        </div>
                        <h3 className="font-display font-semibold text-foreground mb-2 mt-1">
                          {product.title}
                        </h3>
                        <p className="text-sm text-muted-foreground leading-relaxed mb-4 flex-1">
                          {product.description}
                        </p>
                        <div className="flex items-center justify-between mt-auto">
                          <span className="font-display font-bold text-lg text-primary">
                            {getPriceLabel(product)}
                          </span>
                          <a
                            href={`https://wa.me/6973620089?text=Hi! I'm interested in: ${product.title}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono-code text-signal border border-signal/30 rounded-md hover:bg-signal/10 active:scale-[0.98] transition-all"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <MessageCircle className="w-3 h-3" />
                            Order
                          </a>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}

          {/* Product Detail Modal */}
          <ProductDetailModal
            product={selectedProduct}
            isOpen={!!selectedProduct}
            onClose={() => setSelectedProduct(null)}
            onAddToCart={() => selectedProduct && handleAddToCart(selectedProduct)}
            onBuyNow={() => selectedProduct && handleBuyNow(selectedProduct)}
          />

          {/* Shipping Calculator */}
          <div className="mt-12 max-w-lg">
            <ShippingCalculator />
          </div>

          {/* Custom order CTA */}
          <div className="mt-16 p-8 rounded-xl border border-border bg-card/40 text-center">
            <SectionLabel text="Custom Orders" />
            <h3 className="font-display font-bold text-xl text-foreground mb-2">
              Need something specific?
            </h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto text-sm">
              Can't find what you need? We source components and build custom kits for specific projects.
            </p>
            <a
              href="https://wa.me/6973620089?text=Hi! I need help sourcing custom components."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-signal text-background font-display font-semibold text-sm rounded-md hover:opacity-90 active:scale-[0.98] transition-all glow-signal"
            >
              <MessageCircle className="w-4 h-4" />
              Request Custom Components
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
