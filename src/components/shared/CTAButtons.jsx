import React from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, ArrowRight } from 'lucide-react';

export function WhatsAppButton({ text = "Send on WhatsApp", className = "" }) {
  return (
    <a
      href="https://wa.me/1234567890"
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-2 px-6 py-3 bg-signal text-background font-display font-semibold text-sm rounded-md hover:opacity-90 active:scale-[0.98] transition-all glow-signal ${className}`}
    >
      <MessageCircle className="w-4 h-4" />
      {text}
    </a>
  );
}

export function QuoteButton({ text = "Get a Quote", to = "/contact", className = "" }) {
  return (
    <Link
      to={to}
      className={`inline-flex items-center gap-2 px-6 py-3 border border-primary/40 text-primary font-mono-code text-sm rounded-md hover:bg-primary/10 active:scale-[0.98] transition-all ${className}`}
    >
      {text}
      <ArrowRight className="w-4 h-4" />
    </Link>
  );
}