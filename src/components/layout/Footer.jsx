import React from 'react';
import { Link } from 'react-router-dom';
import { Cpu, MessageCircle, Mail, ExternalLink, Link2 } from 'lucide-react';
import NewsletterSignup from '../shared/NewsletterSignup';

export default function Footer() {
  return (
    <footer className="bg-card border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-md bg-primary/10 border border-primary/30 flex items-center justify-center">
                <Cpu className="w-4 h-4 text-primary" />
              </div>
              <span className="font-display font-bold text-sm tracking-tight">
                HW<span className="text-primary">PROTO</span>
              </span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Hardware Prototyping Studio. Turning ideas into real hardware through robotics, electronics, and precision engineering.
            </p>
          </div>

          {/* Hardware Services */}
          <div>
            <h4 className="font-mono-code text-xs uppercase tracking-wider text-muted-foreground mb-4">Hardware</h4>
            <div className="space-y-2">
              <Link to="/services/pcb-design" className="block text-sm text-foreground/70 hover:text-primary transition-colors">PCB Design</Link>
              <Link to="/services/3d-cad" className="block text-sm text-foreground/70 hover:text-primary transition-colors">3D CAD Design</Link>
              <Link to="/services/3d-printing" className="block text-sm text-foreground/70 hover:text-primary transition-colors">3D Printing</Link>
              <Link to="/services/micro-soldering" className="block text-sm text-foreground/70 hover:text-primary transition-colors">Micro Soldering</Link>
              <Link to="/services/engineering" className="block text-sm text-foreground/70 hover:text-primary transition-colors">Engineering Projects</Link>
            </div>
          </div>

          {/* Digital Services */}
          <div>
            <h4 className="font-mono-code text-xs uppercase tracking-wider text-muted-foreground mb-4">Digital</h4>
            <div className="space-y-2">
              <Link to="/services/ai-chatbots" className="block text-sm text-foreground/70 hover:text-primary transition-colors">AI Chatbots</Link>
              <Link to="/services/smart-home" className="block text-sm text-foreground/70 hover:text-primary transition-colors">Smart Home</Link>
              <Link to="/services/web-development" className="block text-sm text-foreground/70 hover:text-primary transition-colors">Website Development</Link>
              <Link to="/services/dashboard-dev" className="block text-sm text-foreground/70 hover:text-primary transition-colors">Dashboards & Admin</Link>
              <Link to="/services/mvp-dev" className="block text-sm text-foreground/70 hover:text-primary transition-colors">MVP Development</Link>
            </div>
          </div>

          {/* Newsletter + Contact */}
          <div>
            <h4 className="font-mono-code text-xs uppercase tracking-wider text-muted-foreground mb-4">Get in Touch</h4>
            <div className="space-y-3 mb-6">
              <a href="https://wa.me/1234567890" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-signal hover:opacity-80 transition-opacity">
                <MessageCircle className="w-4 h-4" />
                WhatsApp
              </a>
              <a href="mailto:hello@hwproto.studio"
                className="flex items-center gap-2 text-sm text-foreground/70 hover:text-primary transition-colors">
                <Mail className="w-4 h-4" />
                hello@hwproto.studio
              </a>
            </div>
            <div className="flex items-center gap-3 mb-6">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors"><ExternalLink className="w-4 h-4" /></a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors"><Link2 className="w-4 h-4" /></a>
            </div>
            <NewsletterSignup source="footer" />
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted-foreground font-mono-code">
            © 2026 Hardware Prototyping Studio. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground font-mono-code">
            REF: SYS-001 // STATUS: OPERATIONAL
          </p>
        </div>
      </div>
    </footer>
  );
}