import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Package, CheckCircle2, Clock, Truck, AlertCircle, CircuitBoard, Cpu, Box, Wrench, Rocket, Loader2, ChevronRight } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import PageHero from '@/components/shared/PageHero';
import SectionLabel from '@/components/shared/SectionLabel';

const STATUS_CONFIG = {
  submitted:           { label: 'Submitted',            color: 'text-muted-foreground', bg: 'bg-muted/30',       border: 'border-muted',          icon: Clock,         step: 0 },
  in_review:           { label: 'In Review',            color: 'text-primary',          bg: 'bg-primary/10',     border: 'border-primary/30',     icon: Search,        step: 1 },
  sourcing_components: { label: 'Sourcing Components',  color: 'text-yellow-400',       bg: 'bg-yellow-400/10',  border: 'border-yellow-400/30',  icon: Package,       step: 2 },
  in_production:       { label: 'In Production',        color: 'text-accent',           bg: 'bg-accent/10',      border: 'border-accent/30',      icon: Cpu,           step: 3 },
  quality_check:       { label: 'Quality Check',        color: 'text-blue-400',         bg: 'bg-blue-400/10',    border: 'border-blue-400/30',    icon: CheckCircle2,  step: 4 },
  shipped:             { label: 'Shipped',              color: 'text-signal',           bg: 'bg-signal/10',      border: 'border-signal/30',      icon: Truck,         step: 5 },
  delivered:           { label: 'Delivered',            color: 'text-signal',           bg: 'bg-signal/10',      border: 'border-signal/30',      icon: CheckCircle2,  step: 6 },
  on_hold:             { label: 'On Hold',              color: 'text-orange-400',       bg: 'bg-orange-400/10',  border: 'border-orange-400/30',  icon: AlertCircle,   step: -1 },
  cancelled:           { label: 'Cancelled',            color: 'text-destructive',      bg: 'bg-destructive/10', border: 'border-destructive/30', icon: AlertCircle,   step: -1 },
};

const PIPELINE_STEPS = [
  { key: 'submitted',           label: 'Submitted' },
  { key: 'in_review',           label: 'In Review' },
  { key: 'sourcing_components', label: 'Sourcing' },
  { key: 'in_production',       label: 'Production' },
  { key: 'quality_check',       label: 'QC' },
  { key: 'shipped',             label: 'Shipped' },
];

const SERVICE_ICONS = {
  'PCB Design': CircuitBoard,
  '3D CAD Design': Box,
  '3D Printing': Box,
  'Micro Soldering': Wrench,
  'Engineering Project': Rocket,
  'Custom Build': Cpu,
};

function OrderCard({ order }) {
  const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.submitted;
  const StatusIcon = cfg.icon;
  const ServiceIcon = SERVICE_ICONS[order.service_type] || Package;
  const currentStep = cfg.step;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="border border-border rounded-xl bg-card overflow-hidden"
    >
      {/* Header */}
      <div className="p-6 border-b border-border flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
            <ServiceIcon className="w-5 h-5 text-primary" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono-code text-xs text-muted-foreground">ORDER</span>
              <span className="font-mono-code text-xs text-primary font-bold">{order.order_id}</span>
            </div>
            <h3 className="font-display font-bold text-foreground">{order.project_title || order.service_type}</h3>
            <p className="text-xs text-muted-foreground">{order.service_type}</p>
          </div>
        </div>
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm font-medium ${cfg.bg} ${cfg.border} ${cfg.color}`}>
          <StatusIcon className="w-4 h-4" />
          {cfg.label}
        </div>
      </div>

      {/* Progress pipeline */}
      {currentStep >= 0 && (
        <div className="px-6 py-4 bg-secondary/20 border-b border-border">
          <div className="flex items-center gap-0">
            {PIPELINE_STEPS.map((step, i) => {
              const stepCfg = STATUS_CONFIG[step.key];
              const isComplete = currentStep > i;
              const isCurrent = currentStep === i;
              return (
                <React.Fragment key={step.key}>
                  <div className="flex flex-col items-center flex-shrink-0">
                    <div className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all ${
                      isComplete ? 'bg-primary border-primary' :
                      isCurrent  ? 'bg-primary/20 border-primary animate-pulse' :
                                   'bg-muted border-border'
                    }`}>
                      {isComplete ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-primary-foreground" />
                      ) : (
                        <div className={`w-2 h-2 rounded-full ${isCurrent ? 'bg-primary' : 'bg-muted-foreground/30'}`} />
                      )}
                    </div>
                    <span className={`text-[9px] font-mono-code mt-1 ${isCurrent ? 'text-primary' : isComplete ? 'text-foreground/60' : 'text-muted-foreground/40'}`}>
                      {step.label}
                    </span>
                  </div>
                  {i < PIPELINE_STEPS.length - 1 && (
                    <div className={`flex-1 h-0.5 mb-4 mx-1 ${isComplete ? 'bg-primary' : 'bg-border'}`} />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      )}

      {/* Details */}
      <div className="p-6 space-y-3">
        {order.status_message && (
          <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
            <p className="text-xs font-mono-code text-primary mb-1">STUDIO UPDATE</p>
            <p className="text-sm text-foreground/80">{order.status_message}</p>
          </div>
        )}
        <div className="grid grid-cols-2 gap-4 text-sm">
          {order.estimated_delivery && (
            <div>
              <p className="text-xs text-muted-foreground font-mono-code mb-0.5">EST. DELIVERY</p>
              <p className="text-foreground">{new Date(order.estimated_delivery).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
            </div>
          )}
          {order.tracking_number && (
            <div>
              <p className="text-xs text-muted-foreground font-mono-code mb-0.5">TRACKING</p>
              <p className="text-foreground font-mono-code text-xs">{order.shipping_carrier && `${order.shipping_carrier}: `}{order.tracking_number}</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default function OrderTracker() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setSearched(true);
    setResults(null);

    const q = query.trim().toLowerCase();
    const [byEmail, byOrderId] = await Promise.all([
      base44.entities.ClientOrder.filter({ client_email: q }).catch(() => []),
      base44.entities.ClientOrder.filter({ order_id: query.trim() }).catch(() => []),
    ]);

    // Deduplicate
    const combined = [...byEmail, ...byOrderId];
    const unique = combined.filter((o, i, arr) => arr.findIndex(x => x.id === o.id) === i);
    setResults(unique);
    setLoading(false);
  };

  return (
    <div>
      <PageHero
        label="Order Tracker"
        title="Track Your Project"
        description="Enter your email address or order ID to see real-time status updates on your custom hardware project."
      />

      <section className="py-16 sm:py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Search box */}
          <div className="bg-card border border-border rounded-xl p-6 mb-10">
            <SectionLabel text="Project Lookup" />
            <form onSubmit={handleSearch} className="flex gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="your@email.com  or  PCB-2024-001"
                  className="w-full pl-10 pr-4 py-3 bg-secondary/50 border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground/60 font-mono-code focus:outline-none focus:border-primary/50 focus:bg-secondary transition-all"
                />
              </div>
              <button
                type="submit"
                disabled={loading || !query.trim()}
                className="px-6 py-3 bg-primary text-primary-foreground font-display font-semibold text-sm rounded-lg hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center gap-2"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ChevronRight className="w-4 h-4" />}
                {loading ? 'Searching…' : 'Track'}
              </button>
            </form>
          </div>

          {/* Results */}
          <AnimatePresence>
            {loading && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-3" />
                <p className="text-muted-foreground text-sm font-mono-code">Fetching order data…</p>
              </motion.div>
            )}

            {!loading && searched && results !== null && results.length === 0 && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center py-12">
                <div className="w-14 h-14 rounded-xl bg-muted/50 border border-border flex items-center justify-center mx-auto mb-4">
                  <Package className="w-6 h-6 text-muted-foreground" />
                </div>
                <h3 className="font-display font-bold text-foreground mb-2">No orders found</h3>
                <p className="text-muted-foreground text-sm max-w-sm mx-auto">
                  We couldn't find any orders matching <span className="text-primary font-mono-code">{query}</span>. Double-check your email or order ID.
                </p>
              </motion.div>
            )}

            {!loading && results && results.length > 0 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <p className="font-mono-code text-xs text-muted-foreground">
                  {results.length} ORDER{results.length > 1 ? 'S' : ''} FOUND
                </p>
                {results.map(order => <OrderCard key={order.id} order={order} />)}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Help note */}
          {!searched && (
            <div className="text-center py-8">
              <p className="text-muted-foreground text-sm">
                Don't have an order ID yet?{' '}
                <a href="/contact" className="text-primary hover:underline">Get in touch</a> to start your project.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}