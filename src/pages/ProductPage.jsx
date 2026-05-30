import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import { api } from "@/api/apiClient";
import { add } from "date-fns";
import { useCart } from "@/hooks/useCart";
import { apiFetch } from "@/api/apiClient";
import CheckoutButton from "@/components/CheckoutButton";
import AddToCartButton from "@/components/cart/AddToCartButton";



export default function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [mainImage, setMainImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  useEffect(() => {
    api.entities.Product.get(id)
      .then((data) => {
        setProduct(data);
        setMainImage(data.images?.[0] || data.image_url);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="p-10 text-center text-muted-foreground">
        Loading product…
      </div>
    );
  }

  if (!product) {
    return (
      <div className="p-10 text-center text-muted-foreground">
        Product not found
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart({
        id: product.id,
        name: product.title,
        price: product.price,
        image: mainImage,
        quantity: 1,
    });
    };

  const handleBuyNow = async () => {
    try {
        const itemsForStripe = [
        {
            name: product.title,
            price: product.price,
            quantity: 1,
        },
        ];

        const response = await apiFetch("/payments/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: itemsForStripe }),
        });

        if (!response.url) {
        console.error("Stripe session creation failed:", response);
        return;
        }

        window.location.href = response.url;
    } catch (error) {
        console.error("Buy Now error:", error);
    }
    };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        <ChevronLeft className="w-4 h-4" />
        Back to Store
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Left: Images */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full h-96 bg-muted rounded-xl overflow-hidden"
          >
            <img
              src={mainImage}
              alt={product.title}
              className="w-full h-full object-cover hover:scale-105 transition-transform"
            />
          </motion.div>

          {/* Thumbnails */}
          <div className="flex gap-3 mt-4 overflow-x-auto">
            {(product.images || [product.image_url]).map((img, idx) => (
              <button
                key={idx}
                onClick={() => setMainImage(img)}
                className={`w-20 h-20 rounded-lg overflow-hidden border ${
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
        <div className="space-y-6">
          <h1 className="text-3xl font-bold">{product.title}</h1>

          <p className="text-muted-foreground leading-relaxed">
            {product.description}
          </p>

          <div>
            <p className="text-4xl font-bold text-primary">
              €{product.price?.toFixed(2)}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              {product.stock > 0
                ? product.stock < 5
                  ? `Low stock (${product.stock} left)`
                  : "In stock"
                : "Out of stock"}
            </p>
          </div>

          {/* Buttons */}
          <div className="flex gap-4">
            <button
                className="flex-1 bg-primary text-primary-foreground py-3 rounded-lg font-medium hover:bg-primary/90 transition"
                onClick={handleAddToCart}
            >
                Add to Cart
            </button>

            <button
                className="flex-1 bg-signal text-signal-foreground py-3 rounded-lg font-medium hover:bg-signal/90 transition"
                onClick={handleBuyNow}
            >
                Buy Now
            </button>

          </div>

          {/* WhatsApp CTA */}
          <a
            href={`https://wa.me/6973620089?text=Hi! I'm interested in: ${product.title}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-signal hover:underline"
          >
            Contact via WhatsApp for details
          </a>
        </div>
      </div>
    </div>
  );
}
