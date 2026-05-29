import React from 'react';
import { motion } from 'framer-motion';
import SectionLabel from './SectionLabel';

export default function PageHero({ label, title, description, children }) {
  return (
    <section className="relative py-24 sm:py-32 grid-bg overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl"
        >
          <SectionLabel text={label} />
          <h1 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl tracking-tight text-foreground mb-6 uppercase">
            {title}
          </h1>
          {description && (
            <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
              {description}
            </p>
          )}
          {children && <div className="mt-8 flex flex-wrap gap-4">{children}</div>}
        </motion.div>
      </div>
    </section>
  );
}