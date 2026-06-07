import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Truck, Globe, Package, MapPin, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { api } from '@/api/apiClient';

// BoxNow supported countries/regions
const BOXNOW_COUNTRIES = ['Greece', 'GR', 'Bulgaria', 'BG', 'Cyprus', 'CY', 'France', 'FR', 'Netherlands', 'NL', 'Belgium', 'BE'];

const CARRIERS = {
  boxnow: {
    name: 'BoxNow',
    desc: 'Locker pickup & home delivery',
    color: 'text-signal border-signal/30 bg-signal/5',
    icon: Package,
    eta: '1–3 business days',
  },
  elta: {
    name: 'ELTA Courier',
    desc: 'Greek domestic courier',
    color: 'text-primary border-primary/30 bg-primary/5',
    icon: Truck,
    eta: '2–4 business days',
  },
  dhl: {
    name: 'DHL Express',
    desc: 'International tracked shipping',
    color: 'text-accent border-accent/30 bg-accent/5',
    icon: Globe,
    eta: '3–7 business days',
  },
};

// Rough shipping rates (EUR)
const RATES = {
  boxnow: { base: 3.5, perKg: 0.8 },
  elta:   { base: 5.0, perKg: 1.2 },
  dhl: {
    europe:       { base: 15, perKg: 4 },
    northAmerica: { base: 22, perKg: 6 },
    asia:         { base: 25, perKg: 7 },
    other:        { base: 20, perKg: 5 },
  },
};

const EU_COUNTRIES = ['Austria', 'Belgium', 'Croatia', 'Czech Republic', 'Denmark', 'Estonia', 'Finland', 'France', 'Germany', 'Hungary', 'Ireland', 'Italy', 'Latvia', 'Lithuania', 'Luxembourg', 'Netherlands', 'Poland', 'Portugal', 'Romania', 'Slovakia', 'Slovenia', 'Spain', 'Sweden', 'Bulgaria', 'Cyprus'];
const NORTH_AMERICA = ['United States', 'Canada', 'Mexico', 'US', 'USA'];
const ASIA = ['China', 'Japan', 'South Korea', 'India', 'Singapore', 'Thailand', 'Taiwan'];

function getDHLZone(country) {
  if (EU_COUNTRIES.includes(country)) return 'europe';
  if (NORTH_AMERICA.includes(country)) return 'northAmerica';
  if (ASIA.includes(country)) return 'asia';
  return 'other';
}

function calcRate(carrier, weightKg) {
  const w = Math.max(0.1, weightKg);
  if (carrier === 'boxnow') return { min: RATES.boxnow.base + w * RATES.boxnow.perKg, max: RATES.boxnow.base + w * RATES.boxnow.perKg * 1.2 };
  if (carrier === 'elta')   return { min: RATES.elta.base   + w * RATES.elta.perKg,   max: RATES.elta.base   + w * RATES.elta.perKg   * 1.3 };
  return null;
}

function calcDHL(country, weightKg) {
  const zone = getDHLZone(country);
  const r = RATES.dhl[zone];
  const w = Math.max(0.1, weightKg);
  return { min: r.base + w * r.perKg, max: r.base + w * r.perKg * 1.4 };
}

export default function ShippingCalculator({ weightKg = 0.3 }) {
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const calculate = async (e) => {
    e.preventDefault();
    if (!country.trim()) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 600)); // small UX delay

    const c = country.trim();
    const isGreece = c.toLowerCase() === 'greece' || c.toLowerCase() === 'gr' || c.toLowerCase() === 'ελλάδα';
    const isBoxNow = BOXNOW_COUNTRIES.some(bc => bc.toLowerCase() === c.toLowerCase());

    let options = [];

    if (isGreece && isBoxNow) {
      options.push({ carrier: 'boxnow', ...calcRate('boxnow', weightKg), ...CARRIERS.boxnow });
      options.push({ carrier: 'elta',   ...calcRate('elta', weightKg),   ...CARRIERS.elta });
    } else if (isBoxNow && !isGreece) {
      options.push({ carrier: 'boxnow', ...calcRate('boxnow', weightKg), ...CARRIERS.boxnow });
      options.push({ carrier: 'dhl',    ...calcDHL(c, weightKg),         ...CARRIERS.dhl });
    } else if (isGreece) {
      options.push({ carrier: 'elta', ...calcRate('elta', weightKg), ...CARRIERS.elta });
    } else {
        const dhlRes = await fetch("/api/dhl", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ country: c, weightKg }),
        });

        const dhlData = await dhlRes.json();

        if (dhlData.ok && dhlData.price) {
          options.push({
            carrier: "dhl",
            min: dhlData.price,
            max: dhlData.price,
            ...CARRIERS.dhl,
          });
        } else {
          // fallback to your old estimate if DHL API fails
          options.push({
            carrier: "dhl",
            ...calcDHL(c, weightKg),
            ...CARRIERS.dhl,
          });
        }
      }


    setResult({ country: c, city: city.trim(), options });
    setLoading(false);
  };

  return (
    <div className="bg-card border border-border rounded-xl p-5">
      <p className="font-mono-code text-xs text-primary mb-4">SHIPPING CALCULATOR</p>
      <form onSubmit={calculate} className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-muted-foreground mb-1">Country</label>
            <input
              value={country}
              onChange={e => { setCountry(e.target.value); setResult(null); }}
              placeholder="e.g. Greece, Germany"
              className="w-full px-3 py-2 bg-secondary/50 border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 transition-all"
            />
          </div>
          <div>
            <label className="block text-xs text-muted-foreground mb-1">City (optional)</label>
            <input
              value={city}
              onChange={e => setCity(e.target.value)}
              placeholder="e.g. Athens"
              className="w-full px-3 py-2 bg-secondary/50 border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 transition-all"
            />
          </div>
        </div>
        <button type="submit" disabled={loading || !country.trim()}
          className="w-full py-2 bg-primary text-primary-foreground text-sm font-semibold rounded-lg hover:opacity-90 disabled:opacity-50 transition-all flex items-center justify-center gap-2">
          {loading ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Calculating…</> : <><MapPin className="w-3.5 h-3.5" /> Calculate Shipping</>}
        </button>
      </form>

      <AnimatePresence>
        {result && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-4 space-y-2">
            <p className="font-mono-code text-xs text-muted-foreground mb-3">
              SHIPPING OPTIONS → {result.city ? `${result.city}, ` : ''}{result.country}
            </p>
            {result.options.map((opt, i) => {
              const Icon = opt.icon;
              return (
                <div key={opt.carrier} className={`flex items-center justify-between p-3 rounded-lg border text-sm ${opt.color} ${i === 0 ? 'ring-1 ring-current/20' : ''}`}>
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    <div>
                      <div className="font-semibold flex items-center gap-1.5">
                        {opt.name}
                        {i === 0 && <span className="text-[9px] px-1.5 py-0.5 rounded bg-current/10 font-mono-code">RECOMMENDED</span>}
                      </div>
                      <div className="text-xs opacity-70">{opt.desc} · {opt.eta}</div>
                    </div>
                  </div>
                  <div className="font-display font-bold text-right">
                    €{opt.min.toFixed(0)}–{opt.max.toFixed(0)}
                    <div className="text-[10px] font-normal opacity-60">estimate</div>
                  </div>
                </div>
              );
            })}
            <p className="text-xs text-muted-foreground/50 font-mono-code pt-1">
              * Final shipping cost confirmed at checkout. Based on ~{weightKg}kg package.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}