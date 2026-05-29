import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileSpreadsheet, Loader2, AlertCircle, CheckCircle2, X, ChevronDown, ChevronUp, Package } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import SectionLabel from '@/components/shared/SectionLabel';

const COMPONENT_DB = [
  { mpn: 'ATmega328P', desc: 'Microcontroller 8-bit', price: 2.8, available: true },
  { mpn: 'ESP32', desc: 'WiFi+BT MCU', price: 3.5, available: true },
  { mpn: 'STM32F103', desc: 'ARM Cortex-M3 MCU', price: 3.2, available: true },
  { mpn: 'LM358', desc: 'Op-Amp Dual', price: 0.3, available: true },
  { mpn: 'AMS1117-3.3', desc: 'LDO Regulator 3.3V', price: 0.2, available: true },
  { mpn: 'LM7805', desc: 'Voltage Regulator 5V', price: 0.4, available: true },
  { mpn: 'NRF24L01', desc: '2.4GHz RF Module', price: 1.5, available: true },
  { mpn: 'L293D', desc: 'Motor Driver H-Bridge', price: 1.1, available: true },
  { mpn: 'TB6612FNG', desc: 'Dual Motor Driver', price: 1.8, available: true },
  { mpn: 'DRV8833', desc: 'Dual H-Bridge Driver', price: 2.1, available: true },
  { mpn: 'SSD1306', desc: 'OLED Controller', price: 1.2, available: true },
  { mpn: 'BME280', desc: 'Temp/Humidity Sensor', price: 3.0, available: true },
  { mpn: 'MPU6050', desc: 'IMU 6-axis', price: 1.5, available: true },
  { mpn: 'HC-SR04', desc: 'Ultrasonic Sensor', price: 0.8, available: true },
  { mpn: 'MCP2515', desc: 'CAN Controller', price: 1.9, available: true },
  { mpn: 'FT232RL', desc: 'USB-UART Bridge', price: 1.4, available: true },
  { mpn: 'CH340G', desc: 'USB-Serial Chip', price: 0.5, available: true },
  { mpn: 'MAX485', desc: 'RS-485 Transceiver', price: 0.6, available: true },
  { mpn: '1N4007', desc: 'Rectifier Diode', price: 0.05, available: true },
  { mpn: 'BC547', desc: 'NPN Transistor', price: 0.08, available: true },
  { mpn: 'IRFZ44N', desc: 'N-Channel MOSFET', price: 0.7, available: true },
  { mpn: 'W25Q128', desc: 'Flash Memory 128Mb', price: 1.1, available: false },
  { mpn: 'RA-01', desc: 'LoRa Module 433MHz', price: 4.5, available: false },
];

function findComponent(name) {
  const upper = name.trim().toUpperCase();
  return COMPONENT_DB.find(c =>
    c.mpn.toUpperCase().includes(upper) ||
    upper.includes(c.mpn.toUpperCase()) ||
    c.desc.toUpperCase().includes(upper)
  ) || null;
}

function parseCSVText(text) {
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  if (lines.length < 2) return [];
  const headers = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/['"]/g, ''));

  const qtyIdx = headers.findIndex(h => h.includes('qty') || h.includes('quantity') || h === 'count');
  const mpnIdx = headers.findIndex(h => h.includes('mpn') || h.includes('part') || h.includes('component') || h.includes('name') || h.includes('reference'));
  const descIdx = headers.findIndex(h => h.includes('desc') || h.includes('value') || h.includes('comment'));

  return lines.slice(1).map(line => {
    const cols = line.split(',').map(c => c.trim().replace(/['"]/g, ''));
    const name = mpnIdx >= 0 ? cols[mpnIdx] : (cols[0] || '');
    const desc = descIdx >= 0 ? cols[descIdx] : '';
    const qty = parseInt(qtyIdx >= 0 ? cols[qtyIdx] : '1') || 1;
    return { name, desc, qty };
  }).filter(r => r.name);
}

export default function BOMUploader() {
  const [file, setFile] = useState(null);
  const [rows, setRows] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [aiSummary, setAiSummary] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const inputRef = useRef();

  const handleFile = async (f) => {
    setFile(f);
    setRows(null);
    setAiSummary(null);
    setLoading(true);

    const text = await f.text();
    const parsed = parseCSVText(text);

    const enriched = parsed.map(row => {
      const match = findComponent(row.name);
      return { ...row, match };
    });

    setRows(enriched);
    setLoading(false);

    // Ask AI for summary
    setAiLoading(true);
    const found = enriched.filter(r => r.match);
    const missing = enriched.filter(r => !r.match);
    const totalCost = found.reduce((sum, r) => sum + (r.match.price * r.qty), 0);

    base44.integrations.Core.InvokeLLM({
      prompt: `You are a PCB component sourcing assistant. Analyze this BOM data and provide a 2-3 sentence professional summary:
- Total components: ${enriched.length}
- Identified in database: ${found.length}
- Possibly unavailable/unknown: ${missing.length}
- Estimated component cost: €${totalCost.toFixed(2)}
- Missing components: ${missing.map(r => r.name).join(', ') || 'none'}

Give a brief assessment of sourcing complexity, any concerns, and an estimated total project cost including studio sourcing/assembly fee (~20-30% markup). Be concise and technical.`,
    }).then(res => {
      setAiSummary(res);
      setAiLoading(false);
    }).catch(() => setAiLoading(false));
  };

  const onDrop = (e) => {
    e.preventDefault();
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  };

  const totalCost = rows ? rows.filter(r => r.match).reduce((s, r) => s + r.match.price * r.qty, 0) : 0;
  const missingCount = rows ? rows.filter(r => !r.match).length : 0;
  const unavailableCount = rows ? rows.filter(r => r.match && !r.match.available).length : 0;
  const displayRows = showAll ? rows : rows?.slice(0, 8);

  return (
    <section className="py-20 border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionLabel text="BOM Analyser" coord="TOOL: BOM-001" />
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-10">
          <div>
            <h2 className="font-display font-bold text-xl sm:text-2xl tracking-tight text-foreground uppercase">
              Upload Bill of Materials
            </h2>
            <p className="text-muted-foreground text-sm mt-2 max-w-lg">
              Upload your CSV BOM file and get an instant sourcing cost estimate with component availability status.
            </p>
          </div>
        </div>

        {/* Drop zone */}
        <div
          className="border-2 border-dashed border-border rounded-xl p-10 text-center cursor-pointer hover:border-primary/40 hover:bg-primary/5 transition-all mb-8 group"
          onClick={() => inputRef.current?.click()}
          onDrop={onDrop}
          onDragOver={e => e.preventDefault()}
        >
          <input ref={inputRef} type="file" accept=".csv,.xlsx,.xls" className="hidden" onChange={e => e.target.files[0] && handleFile(e.target.files[0])} />
          <div className="w-14 h-14 rounded-xl bg-card border border-border flex items-center justify-center mx-auto mb-4 group-hover:border-primary/30 transition-all">
            {loading ? <Loader2 className="w-6 h-6 text-primary animate-spin" /> : <FileSpreadsheet className="w-6 h-6 text-muted-foreground" />}
          </div>
          <p className="font-display font-semibold text-foreground mb-1">
            {file ? file.name : 'Drop your BOM CSV here'}
          </p>
          <p className="text-muted-foreground text-sm">or click to browse • CSV / Excel</p>
          <p className="text-xs text-muted-foreground/50 font-mono-code mt-3">Expected columns: Part/MPN, Quantity, Description (optional)</p>
        </div>

        <AnimatePresence>
          {rows && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>

              {/* Summary cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {[
                  { label: 'Total Parts', value: rows.length, sub: 'unique line items', color: 'text-foreground' },
                  { label: 'Est. Component Cost', value: `€${totalCost.toFixed(2)}`, sub: 'ex. studio markup', color: 'text-primary' },
                  { label: 'Unrecognised', value: missingCount, sub: 'need manual lookup', color: missingCount > 0 ? 'text-yellow-400' : 'text-signal' },
                  { label: 'Low Availability', value: unavailableCount, sub: 'may cause delays', color: unavailableCount > 0 ? 'text-destructive' : 'text-signal' },
                ].map(c => (
                  <div key={c.label} className="bg-card border border-border rounded-xl p-5">
                    <p className="text-xs font-mono-code text-muted-foreground mb-2">{c.label}</p>
                    <p className={`font-display font-bold text-2xl ${c.color}`}>{c.value}</p>
                    <p className="text-xs text-muted-foreground mt-1">{c.sub}</p>
                  </div>
                ))}
              </div>

              {/* AI Summary */}
              {(aiLoading || aiSummary) && (
                <div className="bg-primary/5 border border-primary/20 rounded-xl p-5 mb-8">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-5 h-5 rounded bg-primary/20 flex items-center justify-center">
                      <Package className="w-3 h-3 text-primary" />
                    </div>
                    <span className="font-mono-code text-xs text-primary">AI SOURCING ANALYSIS</span>
                  </div>
                  {aiLoading ? (
                    <div className="flex items-center gap-2 text-muted-foreground text-sm">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Analysing BOM…
                    </div>
                  ) : (
                    <p className="text-sm text-foreground/80 leading-relaxed">{aiSummary}</p>
                  )}
                </div>
              )}

              {/* Component table */}
              <div className="rounded-xl border border-border overflow-hidden mb-4">
                <div className="bg-secondary/30 px-4 py-3 border-b border-border">
                  <span className="font-mono-code text-xs text-muted-foreground">COMPONENT LIST — {rows.length} ITEMS</span>
                </div>
                <div className="divide-y divide-border">
                  {displayRows.map((row, i) => {
                    const m = row.match;
                    return (
                      <div key={i} className={`flex items-center gap-4 px-4 py-3 text-sm ${!m ? 'bg-yellow-400/5' : !m.available ? 'bg-destructive/5' : ''}`}>
                        <div className="flex-1 min-w-0">
                          <span className="font-mono-code text-foreground">{row.name}</span>
                          {row.desc && <span className="text-muted-foreground ml-2 text-xs">({row.desc})</span>}
                        </div>
                        <span className="text-muted-foreground text-xs w-12 text-right">×{row.qty}</span>
                        <div className="w-28 text-right">
                          {m ? (
                            <span className="text-foreground font-mono-code text-xs">€{(m.price * row.qty).toFixed(2)}</span>
                          ) : (
                            <span className="text-yellow-400 text-xs font-mono-code">manual lookup</span>
                          )}
                        </div>
                        <div className="w-24 flex justify-end">
                          {!m ? (
                            <span className="flex items-center gap-1 text-xs text-yellow-400"><AlertCircle className="w-3 h-3" /> Unknown</span>
                          ) : !m.available ? (
                            <span className="flex items-center gap-1 text-xs text-destructive"><X className="w-3 h-3" /> Low Stock</span>
                          ) : (
                            <span className="flex items-center gap-1 text-xs text-signal"><CheckCircle2 className="w-3 h-3" /> In Stock</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
                {rows.length > 8 && (
                  <button
                    onClick={() => setShowAll(!showAll)}
                    className="w-full py-3 text-xs font-mono-code text-muted-foreground hover:text-foreground flex items-center justify-center gap-1 bg-secondary/20 border-t border-border transition-colors"
                  >
                    {showAll ? <><ChevronUp className="w-3 h-3" /> Show less</> : <><ChevronDown className="w-3 h-3" /> Show all {rows.length} components</>}
                  </button>
                )}
              </div>

              <p className="text-xs text-muted-foreground/50 font-mono-code">
                * Prices are indicative per-unit estimates. Final quote includes sourcing, markup, and assembly.{' '}
                <a href="/contact" className="text-primary hover:underline">Contact us</a> for a confirmed BOM quote.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}