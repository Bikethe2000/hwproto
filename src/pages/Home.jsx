import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CircuitBoard, Box, Printer, Wrench, Rocket, ArrowRight, Search, Package, CheckCircle2, Cpu, Truck, Star, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import SectionLabel from '../components/shared/SectionLabel';
import { WhatsAppButton, QuoteButton } from '../components/shared/CTAButtons';
import { api } from '@/api/apiClient';

import HERO_IMG from '../assets/hero.png';

const SERVICES = [
  { icon: CircuitBoard, title: 'PCB Design',          desc: 'Schematic to Gerber. KiCad, multi-layer, DFM-ready.',           link: '/services/pcb-design',      tag: 'Most Popular' },
  { icon: Box,          title: '3D CAD Design',        desc: 'Mechanical parts, enclosures, and robotics components.',         link: '/services/3d-cad',          tag: null },
  { icon: Printer,      title: '3D Printing',          desc: 'PLA / PETG / TPU. Rapid prototyping & functional parts.',       link: '/services/3d-printing',     tag: 'Fast Turnaround' },
  { icon: Wrench,       title: 'Micro Soldering',      desc: 'SMD rework, PCB repair, component-level diagnostics.',          link: '/services/micro-soldering', tag: null },
  { icon: Rocket,       title: 'Engineering Projects', desc: 'Full product development: electronics + mechanical + firmware.', link: '/services/engineering',     tag: 'Full Stack HW' },
];

const STATS = [
  { value: '50+', label: 'Projects Delivered' },
  { value: '3+',  label: 'Years Experience' },
  { value: '10+', label: 'Competition Awards' },
  { value: '24h', label: 'Avg. Response Time' },
];

const PIPELINE = [
  { icon: Search,       label: 'In Review' },
  { icon: Package,      label: 'Sourcing' },
  { icon: Cpu,          label: 'Production' },
  { icon: CheckCircle2, label: 'QC' },
  { icon: Truck,        label: 'Shipped' },
];

const TYPEWRITER_WORDS = ['real hardware', 'working prototypes', 'custom PCBs', '3D printed parts', 'robotics systems'];

function TypewriterText() {
  const [idx, setIdx] = useState(0);
  const [displayed, setDisplayed] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const word = TYPEWRITER_WORDS[idx];
    let timeout;
    if (!deleting && displayed.length < word.length) {
      timeout = setTimeout(() => setDisplayed(word.slice(0, displayed.length + 1)), 60);
    } else if (!deleting && displayed.length === word.length) {
      timeout = setTimeout(() => setDeleting(true), 1800);
    } else if (deleting && displayed.length > 0) {
      timeout = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 35);
    } else if (deleting && displayed.length === 0) {
      setDeleting(false);
      setIdx((idx + 1) % TYPEWRITER_WORDS.length);
    }
    return () => clearTimeout(timeout);
  }, [displayed, deleting, idx]);

  return (
    <span className="text-primary">
      {displayed}
      <span className="animate-pulse">|</span>
    </span>
  );
}

function QuickTracker() {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const STATUS_LABELS = {
    submitted: 'Submitted', in_review: 'In Review', sourcing_components: 'Sourcing Components',
    in_production: 'In Production', quality_check: 'Quality Check', shipped: 'Shipped',
    delivered: 'Delivered', on_hold: 'On Hold', cancelled: 'Cancelled',
  };
  const STATUS_COLORS = {
    submitted: 'text-muted-foreground', in_review: 'text-primary', sourcing_components: 'text-yellow-400',
    in_production: 'text-accent', quality_check: 'text-blue-400', shipped: 'text-signal',
    delivered: 'text-signal', on_hold: 'text-orange-400', cancelled: 'text-destructive',
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true); setSearched(true); setResult(null);
    const q = query.trim();
    const [byEmail, byId] = await Promise.all([
      api.entities.ClientOrder.filter({ client_email: q }).catch(() => []),
      api.entities.ClientOrder.filter({ order_id: q }).catch(() => []),
    ]);
    const combined = [...byEmail, ...byId].filter((o, i, a) => a.findIndex(x => x.id === o.id) === i);
    setResult(combined.length > 0 ? combined[0] : null);
    setLoading(false);
  };

  return (
    <div className="bg-card/80 border border-border rounded-xl p-5">
      <p className="font-mono-code text-xs text-primary mb-3">QUICK ORDER LOOKUP</p>
      <form onSubmit={handleSearch} className="flex gap-2">
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Email or Order ID…"
          className="flex-1 px-3 py-2 bg-secondary/50 border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground/50 font-mono-code focus:outline-none focus:border-primary/50 transition-all"
        />
        <button type="submit" disabled={loading || !query.trim()} className="px-4 py-2 bg-primary text-primary-foreground text-sm font-semibold rounded-lg hover:opacity-90 disabled:opacity-50 transition-all">
          {loading ? '…' : <Search className="w-4 h-4" />}
        </button>
      </form>
      <AnimatePresence>
        {searched && !loading && (
          <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="mt-3">
            {result ? (
              <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/40 border border-border text-sm">
                <div>
                  <p className="font-mono-code text-xs text-muted-foreground">{result.order_id}</p>
                  <p className="text-foreground font-medium">{result.project_title || result.service_type}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`font-mono-code text-xs font-bold ${STATUS_COLORS[result.status]}`}>
                    {STATUS_LABELS[result.status]}
                  </span>
                  <Link to="/track" className="text-xs text-primary hover:underline">Details →</Link>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground mt-2">No order found for <span className="text-primary font-mono-code">{query}</span></p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      <Link to="/track" className="block mt-3 text-xs font-mono-code text-muted-foreground hover:text-primary transition-colors">
        Full order tracker →
      </Link>
    </div>
  );
}

export default function Home() {
  const [activeService, setActiveService] = useState(0);

  return (
    <div>
      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section className="relative min-h-[92vh] flex items-center grid-bg overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background/90 to-background/60" />
        <div className="absolute right-0 top-0 w-1/2 h-full hidden lg:block">
          <div className="absolute inset-0 bg-gradient-to-r from-background to-transparent z-10" />
          <img src={HERO_IMG} alt="PCB macro" className="w-full h-full object-cover opacity-35" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left */}
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
              <div className="flex items-center gap-2 mb-6">
                <div className="h-px w-12 bg-primary" />
                <span className="font-mono-code text-xs text-primary tracking-wider">HARDWARE PROTOTYPING STUDIO</span>
                <div className="h-px flex-1 bg-primary/20" />
              </div>
              <h1 className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl tracking-tight text-foreground uppercase leading-[1.08] mb-6">
                We build{' '}<br />
                <TypewriterText />
              </h1>
              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed mb-8 max-w-lg">
                Robotics, electronics, and precision prototyping. From napkin sketch to functional prototype — fast, reliable, engineered to spec.
              </p>
              <div className="flex flex-wrap gap-4 mb-12">
                <WhatsAppButton text="Send Project on WhatsApp" />
                <QuoteButton />
              </div>
              <div className="font-mono-code text-[10px] text-muted-foreground/25 tracking-widest">
                REF: HPS-001 // STATUS: ACCEPTING_PROJECTS // LAT: 38.0°N, 23.7°E
              </div>
            </motion.div>

            {/* Right — live widget */}
            <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.2 }} className="space-y-4">
              <QuickTracker />

              {/* Mini pipeline visual */}
              <div className="bg-card/60 border border-border rounded-xl p-5">
                <p className="font-mono-code text-xs text-muted-foreground mb-4">PROJECT PIPELINE</p>
                <div className="flex items-center gap-0">
                  {PIPELINE.map((step, i) => (
                    <React.Fragment key={step.label}>
                      <motion.div
                        className="flex flex-col items-center flex-1"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 + i * 0.1 }}
                      >
                        <div className={`w-8 h-8 rounded-lg border flex items-center justify-center mb-1.5 ${
                          i === 2 ? 'bg-primary/20 border-primary text-primary' : 'bg-secondary/50 border-border text-muted-foreground'
                        }`}>
                          <step.icon className="w-3.5 h-3.5" />
                        </div>
                        <span className={`text-[9px] font-mono-code ${i === 2 ? 'text-primary' : 'text-muted-foreground/50'}`}>{step.label}</span>
                      </motion.div>
                      {i < PIPELINE.length - 1 && (
                        <div className={`h-px flex-1 mx-1 mb-4 ${i < 2 ? 'bg-primary/40' : 'bg-border'}`} />
                      )}
                    </React.Fragment>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground/50 font-mono-code mt-3 text-center">Typical 5-stage production pipeline</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── STATS ────────────────────────────────────────────────── */}
      <section className="border-y border-border bg-card/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-border">
            {STATS.map((s, i) => (
              <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="py-8 sm:py-12 px-4 sm:px-6 text-center">
                <div className="font-display font-bold text-2xl sm:text-3xl text-primary">{s.value}</div>
                <div className="font-mono-code text-xs text-muted-foreground mt-1">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── INTERACTIVE SERVICES ─────────────────────────────────── */}
      <section className="py-24 sm:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionLabel text="Our Services" coord="SEC: SVC-001" />
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
            <h2 className="font-display font-bold text-2xl sm:text-3xl tracking-tight text-foreground uppercase">
              End-to-end prototyping<br className="hidden sm:block" /> capabilities
            </h2>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Service selector */}
            <div className="space-y-2">
              {SERVICES.map((svc, i) => (
                <button
                  key={svc.title}
                  onClick={() => setActiveService(i)}
                  className={`w-full text-left flex items-center gap-4 p-4 rounded-xl border transition-all duration-200 ${
                    activeService === i
                      ? 'bg-primary/10 border-primary/40 text-foreground'
                      : 'bg-card/40 border-border text-muted-foreground hover:text-foreground hover:border-border/80'
                  }`}
                >
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 transition-all ${
                    activeService === i ? 'bg-primary/20 text-primary' : 'bg-secondary text-muted-foreground'
                  }`}>
                    <svc.icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-display font-semibold text-sm">{svc.title}</span>
                      {svc.tag && (
                        <span className="text-[9px] font-mono-code px-1.5 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">{svc.tag}</span>
                      )}
                    </div>
                  </div>
                  {activeService === i && <ChevronRight className="w-4 h-4 text-primary flex-shrink-0" />}
                </button>
              ))}
            </div>

            {/* Detail panel */}
            <div className="lg:col-span-2">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeService}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                  className="bg-card border border-border rounded-2xl p-8 h-full flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                        {React.createElement(SERVICES[activeService].icon, { className: 'w-5 h-5 text-primary' })}
                      </div>
                      <div>
                        <h3 className="font-display font-bold text-xl text-foreground">{SERVICES[activeService].title}</h3>
                        {SERVICES[activeService].tag && (
                          <span className="text-xs font-mono-code text-primary">{SERVICES[activeService].tag}</span>
                        )}
                      </div>
                    </div>
                    <p className="text-muted-foreground leading-relaxed mb-6">{SERVICES[activeService].desc}</p>
                    <div className="grid grid-cols-2 gap-3 mb-8">
                      {[
                        activeService === 0 && ['KiCad & EasyEDA', 'Multi-layer support', 'BOM generation', 'DFM optimized'],
                        activeService === 1 && ['SolidWorks / Fusion', 'Parametric design', 'STEP/STL export', 'Print-ready files'],
                        activeService === 2 && ['PLA / PETG / TPU', 'Same-week delivery', 'STL upload + quote', 'Full production runs'],
                        activeService === 3 && ['SMD 0402 capable', 'BGA rework', 'Board diagnostics', 'Component replacement'],
                        activeService === 4 && ['Full system design', 'Firmware dev', 'Mech + Elec integration', 'Competition builds'],
                      ].flat().filter(Boolean).map(feat => (
                        <div key={feat} className="flex items-center gap-2 text-sm text-foreground/70">
                          <CheckCircle2 className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                          {feat}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Link to={SERVICES[activeService].link}
                      className="flex-1 text-center px-4 py-3 bg-primary text-primary-foreground font-display font-semibold text-sm rounded-lg hover:opacity-90 active:scale-[0.98] transition-all">
                      Learn More
                    </Link>
                    <Link to="/contact"
                      className="px-4 py-3 border border-primary/40 text-primary font-mono-code text-sm rounded-lg hover:bg-primary/10 active:scale-[0.98] transition-all flex items-center gap-1">
                      Quote <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* ── PROCESS ──────────────────────────────────────────────── */}
      <section className="py-20 border-t border-border bg-card/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionLabel text="How It Works" coord="SEC: HOW-001" />
          <h2 className="font-display font-bold text-2xl tracking-tight text-foreground uppercase mb-12">
            From idea to delivery
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { n: '01', title: 'Send Your Brief', desc: 'WhatsApp, email, or the contact form — share your idea, files, or requirements.' },
              { n: '02', title: 'Get a Quote',     desc: 'Receive a detailed scope, timeline, and fixed price within 24 hours.' },
              { n: '03', title: 'We Build It',     desc: 'Track every stage live — sourcing, production, QC — through the order tracker.' },
              { n: '04', title: 'Delivered',       desc: 'Shipped via BoxNow (Greece/EU) or DHL worldwide with tracking.' },
            ].map((step, i) => (
              <motion.div key={step.n} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <div className="bg-card border border-border rounded-xl p-6 h-full relative overflow-hidden">
                  <div className="absolute top-3 right-4 font-display font-bold text-5xl text-border/40 select-none">{step.n}</div>
                  <div className="w-8 h-0.5 bg-primary mb-4" />
                  <h3 className="font-display font-bold text-foreground mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────── */}
      <section className="py-24 sm:py-32 border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <SectionLabel text="Start Building" />
            <h2 className="font-display font-bold text-3xl sm:text-4xl tracking-tight text-foreground uppercase mb-4">
              Ready to prototype?
            </h2>
            <p className="text-muted-foreground mb-10 max-w-lg mx-auto">
              Whether you have a napkin sketch or a detailed spec sheet — get in touch today and we'll make it real.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <WhatsAppButton />
              <QuoteButton />
              <Link to="/track" className="inline-flex items-center gap-2 px-6 py-3 border border-border text-muted-foreground font-mono-code text-sm rounded-md hover:text-foreground hover:border-foreground/20 transition-all">
                <Search className="w-4 h-4" /> Track My Order
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}