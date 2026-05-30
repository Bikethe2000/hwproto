import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

export default function ProductDetailModal({
  product,
  isOpen,
  onClose,
  onNext,
  onPrev,
  onAddToCart,
  onBuyNow,
}) {
  const [mainImage, setMainImage] = useState(product?.images?.[0]);

  if (!isOpen || !product) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Modal container */}
        <motion.div
          className="bg-card border border-border rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", stiffness: 120, damping: 14 }}
        >
          {/* Header */}
          <div className="flex justify-between items-center p-4 border-b border-border">
            <h2 className="text-xl font-bold">{product.title}</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-muted rounded-lg transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="flex flex-col md:flex-row overflow-y-auto">
            {/* Left: Images */}
            <div className="md:w-1/2 p-4">
              <div className="w-full h-80 bg-muted rounded-lg overflow-hidden">
                <img
                  src={mainImage}
                  alt={product.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform"
                />
              </div>

              {/* Thumbnails */}
              <div className="flex gap-2 mt-3 overflow-x-auto">
                {product.images?.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setMainImage(img)}
                    className={`w-16 h-16 rounded-lg overflow-hidden border ${
                      mainImage === img
                        ? "border-primary"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <img
                      src={img}
                      alt="thumb"
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Right: Info */}
            <div className="md:w-1/2 p-6 space-y-6">
              {/* Price */}
              <div>
                <p className="text-3xl font-bold">€{product.price.toFixed(2)}</p>
                <p
                  className={`text-sm mt-1 ${
                    product.stock === 0
                      ? "text-accent"
                      : product.stock < 5
                      ? "text-signal"
                      : "text-muted-foreground"
                  }`}
                >
                  {product.stock === 0
                    ? "Out of stock"
                    : product.stock < 5
                    ? `Low stock (${product.stock} left)`
                    : "In stock"}
                </p>
              </div>

              {/* Description */}
              <div>
                <h3 className="font-semibold mb-1">Description</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => onAddToCart(product)}
                  className="flex-1 bg-primary text-primary-foreground py-3 rounded-lg font-medium hover:bg-primary/90 transition"
                >
                  Add to Cart
                </button>

                <button
                  onClick={() => onBuyNow(product)}
                  className="flex-1 bg-signal text-signal-foreground py-3 rounded-lg font-medium hover:bg-signal/90 transition"
                >
                  Buy Now
                </button>
              </div>

              {/* Navigation */}
              {(onNext || onPrev) && (
                <div className="flex justify-between pt-4 border-t border-border">
                  <button
                    onClick={onPrev}
                    className="flex items-center gap-1 text-sm hover:text-primary transition"
                  >
                    <ChevronLeft className="w-4 h-4" /> Previous
                  </button>

                  <button
                    onClick={onNext}
                    className="flex items-center gap-1 text-sm hover:text-primary transition"
                  >
                    Next <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
