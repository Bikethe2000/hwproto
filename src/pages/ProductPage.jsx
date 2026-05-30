import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronLeft, Package, ShoppingCart, Truck } from "lucide-react";
import { api } from "@/api/apiClient";
import { useCart } from "@/hooks/useCart";
import SiteLayout from "@/components/layout/SiteLayout";
import { Button } from "@/components/ui/button";

export default function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [mainImage, setMainImage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    api.entities.Product.get(id)
      .then((data) => {
        if (!mounted) return;
        setProduct(data);
        setMainImage(data.images?.[0] || data.image_url || null);
      })
      .catch(() => mounted && setProduct(null))
      .finally(() => mounted && setLoading(false));
    return () => { mounted = false; };
  }, [id]);

  const images = useMemo(() => product?.images?.length ? product.images : [product?.image_url].filter(Boolean), [product]);
  const priceLabel = product?.price_label || (product?.price != null ? `€${Number(product.price).toFixed(2)}` : "Request Quote");

  const handleAddToCart = () => {
    if (!product) return;
    addToCart({ id: product.id, title: product.title, price: product.price, image_url: mainImage || product.image_url, images: product.images }, 1);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate("/checkout");
  };

  if (loading) {
    return <SiteLayout><div className="p-10 text-center text-muted-foreground">Loading product…</div></SiteLayout>;
  }

  if (!product) {
    return <SiteLayout><div className="p-10 text-center text-muted-foreground">Product not found</div></SiteLayout>;
  }

  return (
    <SiteLayout>
      <div className="max-w-6xl mx-auto px-4 py-10">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6">
          <ChevronLeft className="w-4 h-4" /> Back to Store
        </button>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="w-full aspect-square bg-muted rounded-xl overflow-hidden">
              {mainImage ? <img src={mainImage} alt={product.title} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center"><Package className="w-10 h-10 text-muted-foreground" /></div>}
            </motion.div>
            <div className="flex gap-3 mt-4 overflow-x-auto">
              {images.map((img, idx) => (
                <button key={idx} onClick={() => setMainImage(img)} className={`w-20 h-20 rounded-lg overflow-hidden border ${mainImage === img ? "border-primary" : "border-border"}`}>
                  <img src={img} alt="thumb" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-6">
            <h1 className="text-3xl font-bold">{product.title}</h1>
            <p className="text-muted-foreground leading-relaxed">{product.description}</p>
            <div>
              <p className="text-4xl font-bold text-primary">{priceLabel}</p>
              <p className="text-sm text-muted-foreground mt-1">{product.stock > 0 ? (product.stock < 5 ? `Low stock (${product.stock} left)` : "In stock") : "Out of stock"}</p>
            </div>
            <div className="flex gap-4">
              <Button className="flex-1" onClick={handleAddToCart}><ShoppingCart className="w-4 h-4 mr-2" />Add to Cart</Button>
              <Button variant="outline" className="flex-1" onClick={handleBuyNow}><Truck className="w-4 h-4 mr-2" />Buy Now</Button>
            </div>
            <a href={`https://wa.me/6973620089?text=Hi! I'm interested in: ${product.title}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm text-signal hover:underline">
              Contact via WhatsApp for details
            </a>
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}
