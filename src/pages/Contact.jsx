import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Mail, ExternalLink, Link2, ArrowRight, Lightbulb } from 'lucide-react';
import { Link } from 'react-router-dom';
import PageHero from '../components/shared/PageHero';
import SectionLabel from '../components/shared/SectionLabel';
import QuoteForm from '../components/contact/QuoteForm';
import NewsletterSignup from '../components/shared/NewsletterSignup';

const services = [
  { label: 'PCB Design', path: '/services/pcb-design' },
  { label: '3D CAD Design', path: '/services/3d-cad' },
  { label: '3D Printing', path: '/services/3d-printing' },
  { label: 'Micro Soldering', path: '/services/micro-soldering' },
  { label: 'Engineering Project', path: '/services/engineering' },
];

export default function Contact() {
  return (
    <div>
      <PageHero
        label="Contact"
        title="Get in Touch"
        description="Have a project in mind? Fill out the quote form and get a response within 24 hours. WhatsApp is the fastest way to reach us."
      />

      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            {/* Quote Form — takes 2 cols */}
            <motion.div className="lg:col-span-2" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <SectionLabel text="Request a Quote" />
              <h2 className="font-display font-bold text-2xl text-foreground uppercase mb-6">Tell us about your project</h2>
              <div className="bg-card border border-border rounded-2xl p-6 sm:p-8">
                <QuoteForm />
              </div>
            </motion.div>

            {/* Sidebar */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
              <SectionLabel text="Direct Contact" />
              <div className="space-y-4">
                {/* WhatsApp */}
                <a href="https://wa.me/6973620089" target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-4 p-5 rounded-xl border border-signal/30 bg-signal/5 hover:bg-signal/10 transition-all group">
                  <div className="w-11 h-11 rounded-xl bg-signal/10 flex items-center justify-center flex-shrink-0">
                    <MessageCircle className="w-5 h-5 text-signal" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-display font-semibold text-signal text-sm">WhatsApp</h3>
                    <p className="text-xs text-muted-foreground">Reply within 1 hour</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-signal opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>

                {/* Email */}
                <a href="mailto:hello@hwproto.studio"
                  className="flex items-center gap-4 p-5 rounded-xl border border-border hover:border-primary/30 transition-all group">
                  <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-display font-semibold text-foreground text-sm">Email</h3>
                    <p className="text-xs text-muted-foreground">hello@hwproto.studio</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>

                {/* "Don't know what you need" card */}
                <div className="p-5 rounded-xl border border-accent/30 bg-accent/5">
                  <div className="flex items-center gap-2 mb-2">
                    <Lightbulb className="w-4 h-4 text-accent" />
                    <h3 className="font-display font-semibold text-accent text-sm">Not sure what you need?</h3>
                  </div>
                  <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
                    Got an idea but don't know where to start? Select "I don't know what I need" in the form — we'll help scope your project.
                  </p>
                </div>

                {/* Social */}
                <div className="p-5 rounded-xl border border-border">
                  <h3 className="font-display font-semibold text-foreground text-sm mb-3">Social</h3>
                  <div className="flex gap-3">
                    <a href="#" className="w-9 h-9 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/30 transition-all">
                      <ExternalLink className="w-4 h-4" />
                    </a>
                    <a href="#" className="w-9 h-9 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/30 transition-all">
                      <Link2 className="w-4 h-4" />
                    </a>
                  </div>
                </div>

                {/* Newsletter */}
                <div className="p-5 rounded-xl border border-primary/20 bg-primary/5">
                  <NewsletterSignup source="contact" />
                </div>

                {/* Quick links */}
                <div className="p-5 rounded-xl border border-border">
                  <h3 className="font-display font-semibold text-foreground text-sm mb-3">Services</h3>
                  <div className="space-y-2">
                    {services.map((s) => (
                      <Link key={s.label} to={s.path} className="flex items-center justify-between text-xs text-muted-foreground hover:text-primary transition-colors py-0.5">
                        {s.label} <ArrowRight className="w-3 h-3" />
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}