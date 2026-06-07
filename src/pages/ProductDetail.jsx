import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ShoppingCart, ZoomIn, Check, AlertCircle } from 'lucide-react';
import { api } from '@/api/apiClient';
import { useCart } from '@/hooks/useCart';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import SiteLayout from '@/components/layout/SiteLayout';
import Reviews from '@/components/product/Reviews';
import { AuthContext } from '@/lib/AuthContext';

const STATUS_CONFIG = {
  in_stock: { label: 'In Stock', class: 'bg-signal/20 text-signal border-signal/30' },
  made_to_order: { label: 'Made to Order', class: 'bg-primary/20 text-primary border-primary/30' },
  custom_build: { label: 'Custom Build', class: 'bg-accent/20 text-accent border-accent/30' },
  out_of_stock: { label: 'Out of Stock', class: 'bg-muted-foreground/20 text-muted-foreground border-muted-foreground/30' },
};

export default function ProductDetail() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const authContext = useContext(AuthContext);
  const isAuthenticated = authContext?.isAuthenticated || false;

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const [allProducts, setAllProducts] = useState([]);

  const handleLoginRequired = () => {
    navigate('/login');
  };

  useEffect(() => {
    loadProduct();
  }, [productId]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      // Fetch product by ID
      const products = await api.entities.Product.list();
      const found = products.find((p) => p.id === productId);

      if (!found) {
        setError('Product not found');
        return;
      }

      setProduct(found);
      setAllProducts(products);
      setSelectedImageIndex(0);
      setAddedToCart(false);
    } catch (err) {
      console.error('Error loading product:', err);
      setError('Failed to load product');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 2000);
    }
  };

  const navigateProduct = (direction) => {
    const currentIndex = allProducts.findIndex((p) => p.id === productId);
    let nextIndex;

    if (direction === 'next') {
      nextIndex = (currentIndex + 1) % allProducts.length;
    } else {
      nextIndex = (currentIndex - 1 + allProducts.length) % allProducts.length;
    }

    navigate(`/product/${allProducts[nextIndex].id}`);
  };

  const images = product?.images || (product?.image_url ? [product.image_url] : []);
  const mainImage = images[selectedImageIndex] || '/placeholder.png';

  const isOutOfStock = product?.status === 'out_of_stock';
  const priceLabel = product?.price_label || (product?.price ? `€${product.price}` : 'Request Quote');

  if (loading) {
    return (
      <SiteLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
        </div>
      </SiteLayout>
    );
  }

  if (error || !product) {
    return (
      <SiteLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
            <p className="text-lg text-muted-foreground">{error || 'Product not found'}</p>
            <Button onClick={() => navigate('/store')} className="mt-4">
              Back to Store
            </Button>
          </div>
        </div>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      <div className="min-h-screen bg-background py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <motion.button
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => navigate('/store')}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Store
          </motion.button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Image Gallery */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="space-y-4"
            >
              {/* Main Image */}
              <div className="relative bg-muted rounded-lg overflow-hidden aspect-square group">
                <motion.img
                  key={mainImage}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  src={mainImage}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
                <motion.div
                  className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors cursor-zoom-in flex items-center justify-center"
                  whileHover={{ backgroundColor: 'rgba(0,0,0,0.1)' }}
                >
                  <ZoomIn className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                </motion.div>
              </div>

              {/* Thumbnail Gallery */}
              {images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {images.map((img, idx) => (
                    <motion.button
                      key={idx}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedImageIndex(idx)}
                      className={`flex-shrink-0 w-20 h-20 rounded-md overflow-hidden border-2 transition-colors ${
                        idx === selectedImageIndex ? 'border-primary' : 'border-border'
                      }`}
                    >
                      <img
                        src={img}
                        alt={`View ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </motion.button>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Product Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="flex flex-col justify-between"
            >
              {/* Header */}
              <div className="space-y-4 mb-8">
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                    {product.title}
                  </h1>
                  {product.category && (
                    <p className="text-sm text-muted-foreground mb-2">
                      Category: <span className="font-mono-code">{product.category}</span>
                    </p>
                  )}
                </div>

                {/* Status Badge */}
                <div>
                  <Badge
                    className={`${STATUS_CONFIG[product.status]?.class || 'bg-muted text-muted-foreground'} border px-3 py-1`}
                  >
                    {STATUS_CONFIG[product.status]?.label || product.status}
                  </Badge>
                </div>

                {/* Price */}
                <div className="pt-4 border-t border-border">
                  <p className="text-sm text-muted-foreground mb-2">Price</p>
                  <p className="text-3xl font-bold text-foreground">{priceLabel}</p>
                </div>

                {/* Description */}
                {product.description && (
                  <div className="pt-6">
                    <h3 className="text-sm font-mono-code text-muted-foreground mb-2">DESCRIPTION</h3>
                    <p className="text-foreground/90 leading-relaxed">
                      {product.description}
                    </p>
                  </div>
                )}
              </div>

              {/* Add to Cart Section */}
              <div className="space-y-4 pt-8 border-t border-border">
                {/* Quantity Selector */}
                <div>
                  <label className="text-sm font-mono-code text-muted-foreground mb-3 block">
                    QUANTITY
                  </label>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={isOutOfStock}
                      className="w-10 h-10 rounded-md border border-border hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                    >
                      −
                    </button>
                    <input
                      type="number"
                      min="1"
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      disabled={isOutOfStock}
                      className="w-16 h-10 text-center border border-border rounded-md bg-background disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      disabled={isOutOfStock}
                      className="w-10 h-10 rounded-md border border-border hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Add to Cart Button */}
                <AnimatePresence mode="wait">
                  {addedToCart ? (
                    <motion.div
                      key="added"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="w-full py-3 rounded-lg bg-signal/20 border border-signal/30 text-signal flex items-center justify-center gap-2 font-medium"
                    >
                      <Check className="w-5 h-5" />
                      Added to Cart
                    </motion.div>
                  ) : (
                    <motion.div
                      key="add"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                    >
                      <Button
                        onClick={handleAddToCart}
                        disabled={isOutOfStock}
                        size="lg"
                        className="w-full"
                      >
                        <ShoppingCart className="w-5 h-5 mr-2" />
                        Add to Cart
                      </Button>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Buy Now Button */}
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full"
                  disabled={isOutOfStock}
                  onClick={() => {
                    handleAddToCart();
                    navigate('/checkout');
                  }}
                >
                  Buy Now
                </Button>

                {isOutOfStock && (
                  <p className="text-sm text-destructive text-center py-2">
                    This product is currently out of stock
                  </p>
                )}
              </div>
            </motion.div>
          </div>

          {/* Navigation Arrows */}
          <div className="mt-16 flex items-center justify-between">
            <motion.button
              whileHover={{ x: -5 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigateProduct('prev')}
              className="p-3 rounded-lg border border-border hover:bg-muted transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </motion.button>

            <p className="text-sm text-muted-foreground">
              {allProducts.findIndex((p) => p.id === productId) + 1} of {allProducts.length}
            </p>

            <motion.button
              whileHover={{ x: 5 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigateProduct('next')}
              className="p-3 rounded-lg border border-border hover:bg-muted transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </motion.button>
          </div>

          {/* Related Products */}
          {allProducts.length > 1 && (
            <div className="mt-20 pt-12 border-t border-border">
              <h2 className="text-2xl font-bold mb-8">More Products</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {allProducts.slice(0, 4).map((p) => (
                  <motion.div
                    key={p.id}
                    whileHover={{ y: -5 }}
                    onClick={() => navigate(`/product/${p.id}`)}
                    className="cursor-pointer group"
                  >
                    <div className="relative bg-muted rounded-lg overflow-hidden aspect-square mb-3">
                      <img
                        src={p.image_url || '/placeholder.png'}
                        alt={p.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <h3 className="font-medium text-sm line-clamp-2">{p.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {p.price_label || (p.price ? `€${p.price}` : 'Request Quote')}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Reviews Section */}
          <Reviews 
            productId={productId}
            isAuthenticated={isAuthenticated}
            currentUserId={authContext?.user?.id}
            onLoginRequired={handleLoginRequired}
          />
        </div>
      </div>
    </SiteLayout>
  );
}
