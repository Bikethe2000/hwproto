import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ServiceCard({ icon: Icon, title, description, link, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
    >
      <Link to={link} className="group block h-full">
        <div className="relative h-full p-6 rounded-xl border border-border bg-card/50 hover:border-primary/30 hover:bg-card transition-all duration-300">
          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <ArrowUpRight className="w-4 h-4 text-primary" />
          </div>
          <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
            <Icon className="w-5 h-5 text-primary" />
          </div>
          <h3 className="font-display font-semibold text-foreground mb-2">{title}</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
          <div className="mt-4 font-mono-code text-xs text-primary/60 group-hover:text-primary transition-colors">
            Learn more →
          </div>
        </div>
      </Link>
    </motion.div>
  );
}