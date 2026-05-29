import React from 'react';
import { CheckCircle2, MessageCircle, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import SectionLabel from '../shared/SectionLabel';

const SERVICE_PRICING = {
  'pcb-design': {
    tiers: [
      { label: 'Simple PCB', price: '€15 – €40', desc: '1–2 layer, <10 components, basic layout', express: false },
      { label: 'Standard PCB', price: '€40 – €80', desc: '2–4 layer, moderate complexity, BOM included', express: true },
      { label: 'Advanced PCB', price: '€80 – €120+', desc: 'Multi-layer, high-density, impedance control', express: true },
    ],
    note: 'Gerber files, BOM, and schematic included. Complex RF/mixed-signal boards quoted separately.',
  },
  '3d-cad': {
    tiers: [
      { label: 'Simple Part', price: '€10 – €25', desc: 'Single body, basic geometry, export-ready', express: false },
      { label: 'Assembly', price: '€25 – €60', desc: 'Multi-part assembly, mates, drawing package', express: true },
      { label: 'Complex Model', price: '€60 – €100+', desc: 'Full enclosure, organic surfaces, production prep', express: true },
    ],
    note: 'STEP, IGES, STL, and native format files included.',
  },
  '3d-printing': {
    tiers: [
      { label: 'Small Part (<50g)', price: '€5 – €15', desc: 'Standard PLA, basic geometry, <24h print time', express: false },
      { label: 'Medium Part', price: '€15 – €40', desc: 'Up to 200g, any material, custom color', express: true },
      { label: 'Large / Batch', price: '€40 – €120+', desc: 'Multi-part, production run, post-processing', express: true },
    ],
    note: 'Material: PLA from €4/50g · PETG from €5/50g · TPU from €7/50g. Use the estimator above for instant quotes.',
  },
  'micro-soldering': {
    tiers: [
      { label: 'Basic Repair', price: '€10 – €25', desc: 'Connector reflow, through-hole, basic SMD', express: false },
      { label: 'SMD / BGA', price: '€25 – €55', desc: 'SMD 0402+, BGA rework, IC replacement', express: true },
      { label: 'Board Diagnostics', price: '€30 – €80+', desc: 'Full diagnosis, short tracing, complex repair', express: true },
    ],
    note: 'Component cost not included. Diagnosis fee waived if repair is booked.',
  },
  'ai-chatbots': {
    tiers: [
      { label: 'Basic Bot', price: '€150 – €300', desc: 'FAQ answering, single platform (WhatsApp or Telegram)', express: false },
      { label: 'Standard Bot', price: '€300 – €500', desc: 'Multi-flow conversations, bookings, 2 platforms', express: true },
      { label: 'Advanced Bot', price: '€500 – €800', desc: 'Full AI assistant, CRM integration, all platforms', express: true },
    ],
    note: 'Optional monthly support plan available. All bots include setup, testing, and deployment.',
  },
  'smart-home': {
    tiers: [
      { label: 'Starter Setup', price: '€100 – €150', desc: 'Voice assistant or basic device automation', express: false },
      { label: 'Room Automation', price: '€150 – €250', desc: 'Full room setup: lighting, sensors, voice control', express: true },
      { label: 'Full System', price: '€250 – €300+', desc: 'Multi-room, custom routines, remote management', express: true },
    ],
    note: 'Hardware cost not included. Remote setup available. On-site available in Athens area.',
  },
  'web-development': {
    tiers: [
      { label: 'Landing Page', price: '€150 – €300', desc: 'Single-page site, contact form, mobile-ready', express: false },
      { label: 'Business Site', price: '€300 – €550', desc: 'Multi-page, CMS, SEO-ready, custom design', express: true },
      { label: 'Web App', price: '€550 – €800+', desc: 'Custom functionality, integrations, user auth', express: true },
    ],
    note: 'Domain and hosting not included. Maintenance plans available after delivery.',
  },
  'dashboard-dev': {
    tiers: [
      { label: 'Simple Dashboard', price: '€200 – €400', desc: 'Data display, charts, basic filters', express: false },
      { label: 'Admin Panel', price: '€400 – €650', desc: 'CRUD operations, user roles, export features', express: true },
      { label: 'Full System', price: '€650 – €900+', desc: 'Real-time data, IoT, complex integrations', express: true },
    ],
    note: 'Backend API development can be included. IoT device integration quoted separately.',
  },
  'mvp-dev': {
    tiers: [
      { label: 'Proof of Concept', price: '€400 – €800', desc: 'Core feature only, demo-ready in 1–2 weeks', express: false },
      { label: 'MVP', price: '€800 – €1800', desc: 'Full working product, basic auth, deployed', express: true },
      { label: 'Full Prototype', price: '€1800 – €3000+', desc: 'Multi-feature, hardware + software, investor-ready', express: true },
    ],
    note: 'Includes technical scoping session. Post-launch iteration available as retainer.',
  },
  'engineering': {
    tiers: [
      { label: 'Consultation', price: '€50', desc: '1-hour technical deep-dive, project scoping', express: false },
      { label: 'Prototype Build', price: '€100 – €400', desc: 'Electronics + mechanical, working prototype delivery', express: true },
      { label: 'Full Project', price: '€400 – €1000+', desc: 'End-to-end engineering, firmware, final product', express: true },
    ],
    note: 'Competition builds and robotics systems quoted after brief. Component sourcing additional.',
  },
};

export default function PricingTable({ serviceKey }) {
  const pricing = SERVICE_PRICING[serviceKey];
  if (!pricing) return null;

  return (
    <section className="py-20 border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionLabel text="Pricing" coord="SEC: PRC-001" />
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
          <h2 className="font-display font-bold text-2xl tracking-tight text-foreground uppercase">
            Transparent Pricing
          </h2>
          <p className="text-sm text-muted-foreground max-w-sm">
            Fixed pricing for standard jobs. Complex projects quoted within 24h.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {pricing.tiers.map((tier, i) => (
            <div key={tier.label} className={`relative rounded-xl border p-6 flex flex-col gap-3 transition-all ${
              i === 1 ? 'border-primary/40 bg-primary/5' : 'border-border bg-card/50'
            }`}>
              {i === 1 && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="font-mono-code text-[10px] px-3 py-1 rounded-full bg-primary text-primary-foreground">POPULAR</span>
                </div>
              )}
              <div>
                <h3 className="font-display font-bold text-foreground mb-1">{tier.label}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{tier.desc}</p>
              </div>
              <div className="font-display font-bold text-2xl text-primary mt-auto">{tier.price}</div>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-signal" /> Included files
                </span>
                {tier.express && (
                  <span className="flex items-center gap-1">
                    <Zap className="w-3 h-3 text-yellow-400" /> Express available
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between p-5 rounded-xl border border-border bg-card/30">
          <p className="text-sm text-muted-foreground max-w-xl">{pricing.note}</p>
          <a
            href="https://wa.me/1234567890?text=Hi! I need a custom quote."
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 flex items-center gap-2 px-5 py-2.5 bg-signal text-background font-display font-semibold text-sm rounded-lg hover:opacity-90 active:scale-[0.98] transition-all"
          >
            <MessageCircle className="w-4 h-4" />
            Get Custom Quote
          </a>
        </div>
      </div>
    </section>
  );
}