import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { api } from '@/api/apiClient';
import PageHero from './PageHero';
import SectionLabel from './SectionLabel';
import { WhatsAppButton, QuoteButton } from './CTAButtons';

function GalleryModal({ images, index, onClose, onPrev, onNext }) {
  return (
    <div className="fixed inset-0 z-50 bg-background/90 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
      <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-full bg-card border border-border text-muted-foreground hover:text-foreground">
        <X className="w-5 h-5" />
      </button>
      <button onClick={(e) => { e.stopPropagation(); onPrev(); }} className="absolute left-4 p-2 rounded-full bg-card border border-border text-muted-foreground hover:text-foreground">
        <ChevronLeft className="w-5 h-5" />
      </button>
      <img src={images[index]} alt="" className="max-w-full max-h-[80vh] rounded-xl object-contain" onClick={(e) => e.stopPropagation()} />
      <button onClick={(e) => { e.stopPropagation(); onNext(); }} className="absolute right-4 p-2 rounded-full bg-card border border-border text-muted-foreground hover:text-foreground">
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
}

export default function ServicePage({ serviceKey, label, title: defaultTitle, description: defaultDesc, image: defaultImage, includes: defaultIncludes = [], extras: defaultExtras = [], ctaText: defaultCtaText, ctaWhatsApp: defaultCtaWA, children }) {
  const [content, setContent] = useState(null);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);

  useEffect(() => {
    if (!serviceKey) return;
    api.entities.ServiceContent.filter({ service_key: serviceKey }).then((results) => {
      if (results.length > 0) setContent(results[0]);
    }).catch(() => {});
  }, [serviceKey]);

  const title = content?.title || defaultTitle;
  const description = content?.description || defaultDesc;
  const image = content?.hero_image_url || defaultImage;
  const includes = content?.includes?.length ? content.includes : defaultIncludes;
  const extras = content?.extras?.length ? content.extras : defaultExtras;
  const ctaText = content?.cta_heading || defaultCtaText;
  const ctaWhatsApp = content?.cta_whatsapp_text || defaultCtaWA;
  const galleryImages = content?.gallery_images || [];

  const openGallery = (i) => { setGalleryIndex(i); setGalleryOpen(true); };

  return (
    <div>
      <PageHero label={label} title={title} description={description}>
        <WhatsAppButton text={ctaWhatsApp || 'Send on WhatsApp'} />
        <QuoteButton />
      </PageHero>

      {/* Service image */}
      {image && (
        <section className="border-y border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-0">
            <div className="relative -my-12 rounded-xl overflow-hidden border border-border shadow-2xl">
              <img src={image} alt={title} className="w-full aspect-video object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
              <div className="absolute bottom-4 left-4">
                <span className="font-mono-code text-[10px] text-muted-foreground/50">SVC: {label?.toUpperCase()}</span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Includes + Extras */}
      <section className="py-32 sm:py-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <SectionLabel text="What's Included" />
              <h2 className="font-display font-bold text-xl sm:text-2xl tracking-tight text-foreground uppercase mb-8">Core Deliverables</h2>
              <div className="space-y-3">
                {includes.map((item, i) => (
                  <div key={i} className="flex items-start gap-3 p-4 rounded-lg border border-border bg-card/50">
                    <div className="w-5 h-5 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-primary" />
                    </div>
                    <span className="text-sm text-foreground/80 leading-relaxed">{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
              <SectionLabel text="Extras" />
              <h2 className="font-display font-bold text-xl sm:text-2xl tracking-tight text-foreground uppercase mb-8">Additional Services</h2>
              <div className="space-y-3">
                {extras.map((item, i) => (
                  <div key={i} className="flex items-start gap-3 p-4 rounded-lg border border-border/50 bg-secondary/20">
                    <div className="w-5 h-5 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-accent" />
                    </div>
                    <span className="text-sm text-foreground/70 leading-relaxed">{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Gallery */}
      {galleryImages.length > 0 && (
        <section className="pb-24 border-t border-border pt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionLabel text="Gallery" />
            <h2 className="font-display font-bold text-xl tracking-tight text-foreground uppercase mb-8">Examples</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {galleryImages.map((img, i) => (
                <button key={i} onClick={() => openGallery(i)} className="aspect-square rounded-lg overflow-hidden border border-border hover:border-primary/30 transition-all">
                  <img src={img} alt="" className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Custom children (e.g. STL upload form) */}
      {children}

      {/* Bottom CTA */}
      <section className="py-20 border-t border-border bg-card/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display font-bold text-2xl tracking-tight text-foreground uppercase mb-3">
            {ctaText || 'Ready to get started?'}
          </h2>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto text-sm">
            Send your project details and get a quote within 24 hours.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <WhatsAppButton text={ctaWhatsApp || 'Send on WhatsApp'} />
            <QuoteButton />
          </div>
        </div>
      </section>

      {galleryOpen && (
        <GalleryModal
          images={galleryImages}
          index={galleryIndex}
          onClose={() => setGalleryOpen(false)}
          onPrev={() => setGalleryIndex((galleryIndex - 1 + galleryImages.length) % galleryImages.length)}
          onNext={() => setGalleryIndex((galleryIndex + 1) % galleryImages.length)}
        />
      )}
    </div>
  );
}