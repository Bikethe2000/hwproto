import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Upload, FileCheck, Loader2, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';
import ShippingCalculator from '../shipping/ShippingCalculator';

const SERVICES = [
  'PCB Design', '3D CAD Design', '3D Printing', 'Micro Soldering',
  'Engineering Project', 'Custom Build', "I don't know what I need",
];
const BUDGETS = ['< €50', '€50 – €150', '€150 – €500', '€500 – €1000', '€1000+', 'Not sure yet'];
const DEADLINES = ['ASAP (rush)', '1–2 weeks', '2–4 weeks', '1–2 months', 'Flexible'];

export default function QuoteForm({ compact = false }) {
  const fileRef = useRef();
  const [form, setForm] = useState({
    name: '', email: '', whatsapp: '', service: '', budget: '', deadline: '',
    description: '', address: '',
  });
  const [file, setFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [showShipping, setShowShipping] = useState(false);

  const handleFile = (f) => {
    if (!f) return;
    if (f.size > 50 * 1024 * 1024) { toast.error('File too large (max 50MB)'); return; }
    setFile(f);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.description) return toast.error('Name, email, and description are required');
    setSubmitting(true);

    let file_url = null;
    if (file) {
      const res = await base44.integrations.Core.UploadFile({ file });
      file_url = res.file_url;
    }

    // Send email notification
    const emailBody = `
New Quote Request from ${form.name}

Service: ${form.service || 'Not specified'}
Budget: ${form.budget || 'Not specified'}
Deadline: ${form.deadline || 'Not specified'}
Email: ${form.email}
WhatsApp: ${form.whatsapp || 'Not provided'}
Address: ${form.address || 'Not provided'}

Description:
${form.description}

${file_url ? `Attached file: ${file_url}` : 'No file attached'}
    `.trim();

    await base44.integrations.Core.SendEmail({
      to: form.email,
      subject: `Quote Request Received — ${form.service || 'General Enquiry'}`,
      body: `Hi ${form.name},\n\nThank you for your quote request! We've received your message and will get back to you within 24 hours.\n\nService: ${form.service || 'General'}\nBudget: ${form.budget || 'TBD'}\nDeadline: ${form.deadline || 'Flexible'}\n\nIf you need a faster response, message us on WhatsApp.\n\nBest,\nHW Proto Studio`,
      from_name: 'HW Proto Studio',
    });

    setSubmitting(false);
    setDone(true);
    toast.success('Quote request sent! Check your email.');
  };

  if (done) {
    return (
      <div className="text-center py-10">
        <div className="w-14 h-14 rounded-full bg-signal/10 border border-signal/30 flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-7 h-7 text-signal" />
        </div>
        <h3 className="font-display font-bold text-xl text-foreground mb-2">Request Sent!</h3>
        <p className="text-muted-foreground text-sm max-w-xs mx-auto mb-6">
          We'll review your project and reply within 24 hours. Check your email for confirmation.
        </p>
        <a href="https://wa.me/1234567890" target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-signal text-background font-semibold text-sm rounded-lg hover:opacity-90 transition-all">
          Chat on WhatsApp
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-mono-code text-muted-foreground mb-1">NAME *</label>
          <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required
            placeholder="Your name"
            className="w-full px-3 py-2.5 bg-secondary/50 border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 transition-all" />
        </div>
        <div>
          <label className="block text-xs font-mono-code text-muted-foreground mb-1">EMAIL *</label>
          <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required
            placeholder="you@email.com"
            className="w-full px-3 py-2.5 bg-secondary/50 border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 transition-all" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-mono-code text-muted-foreground mb-1">SERVICE</label>
          <select value={form.service} onChange={e => setForm(f => ({ ...f, service: e.target.value }))}
            className="w-full px-3 py-2.5 bg-secondary/50 border border-border rounded-lg text-sm text-foreground focus:outline-none focus:border-primary/50 transition-all">
            <option value="">Select service…</option>
            {SERVICES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-mono-code text-muted-foreground mb-1">WHATSAPP (OPTIONAL)</label>
          <input value={form.whatsapp} onChange={e => setForm(f => ({ ...f, whatsapp: e.target.value }))}
            placeholder="+30 69…"
            className="w-full px-3 py-2.5 bg-secondary/50 border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 transition-all" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-mono-code text-muted-foreground mb-1">BUDGET RANGE</label>
          <select value={form.budget} onChange={e => setForm(f => ({ ...f, budget: e.target.value }))}
            className="w-full px-3 py-2.5 bg-secondary/50 border border-border rounded-lg text-sm text-foreground focus:outline-none focus:border-primary/50 transition-all">
            <option value="">Select budget…</option>
            {BUDGETS.map(b => <option key={b} value={b}>{b}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-mono-code text-muted-foreground mb-1">DEADLINE</label>
          <select value={form.deadline} onChange={e => setForm(f => ({ ...f, deadline: e.target.value }))}
            className="w-full px-3 py-2.5 bg-secondary/50 border border-border rounded-lg text-sm text-foreground focus:outline-none focus:border-primary/50 transition-all">
            <option value="">Select deadline…</option>
            {DEADLINES.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-xs font-mono-code text-muted-foreground mb-1">PROJECT DESCRIPTION *</label>
        <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} required
          rows={4} placeholder="Describe your project, requirements, or idea…"
          className="w-full px-3 py-2.5 bg-secondary/50 border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 transition-all resize-none" />
      </div>

      {/* File upload */}
      <div>
        <label className="block text-xs font-mono-code text-muted-foreground mb-1">ATTACH FILE (STL, PDF, ZIP, etc.)</label>
        <div onClick={() => fileRef.current?.click()}
          className={`relative border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all ${
            file ? 'border-signal/40 bg-signal/5' : 'border-border hover:border-primary/40'
          }`}>
          {file ? (
            <div className="flex items-center justify-center gap-3">
              <FileCheck className="w-5 h-5 text-signal" />
              <span className="font-mono-code text-sm text-signal">{file.name}</span>
              <button type="button" onClick={e => { e.stopPropagation(); setFile(null); }}
                className="text-xs text-muted-foreground hover:text-destructive ml-2">✕</button>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Upload className="w-4 h-4" />
              <span>Click to attach a file <span className="text-muted-foreground/50">(max 50MB)</span></span>
            </div>
          )}
        </div>
        <input ref={fileRef} type="file" className="hidden" onChange={e => handleFile(e.target.files?.[0])} />
      </div>

      {/* Shipping calc toggle */}
      <div>
        <button type="button" onClick={() => setShowShipping(v => !v)}
          className="flex items-center gap-2 text-xs font-mono-code text-primary hover:text-primary/80 transition-colors">
          {showShipping ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          ESTIMATE SHIPPING COST
        </button>
        <AnimatePresence>
          {showShipping && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mt-3 overflow-hidden">
              <ShippingCalculator />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <button type="submit" disabled={submitting}
        className="w-full py-3 bg-primary text-primary-foreground font-display font-semibold text-sm rounded-lg hover:opacity-90 disabled:opacity-60 active:scale-[0.98] transition-all flex items-center justify-center gap-2">
        {submitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Sending…</> : <><Send className="w-4 h-4" /> Send Quote Request</>}
      </button>
    </form>
  );
}