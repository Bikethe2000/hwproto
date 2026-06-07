import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Upload, Loader2, FileCheck, MessageCircle, Info, AlertCircle } from 'lucide-react';
import { api } from '@/api/apiClient';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import ServicePage from '../../components/shared/ServicePage';
import SectionLabel from '../../components/shared/SectionLabel';
import { WhatsAppButton } from '../../components/shared/CTAButtons';
import PricingTable from '../../components/services/PricingTable';

const PRINT_IMG = 'https://media.base44.com/images/public/6a183d82770ee575c3658f58/5fd405f6f_generated_6ada00a9.png';

const MATERIAL_COSTS = { PLA: { base: 4, per_mb: 1.2, label: 'PLA (Standard)' }, PETG: { base: 5, per_mb: 1.6, label: 'PETG (Durable)' }, TPU: { base: 7, per_mb: 2.1, label: 'TPU (Flexible)' } };
const QUALITY_MULT = { draft: 0.7, standard: 1.0, high_detail: 1.5 };
const QUALITY_LABELS = { draft: 'Draft (Fast, basic detail)', standard: 'Standard (Recommended)', high_detail: 'High Detail (Best finish)' };

function estimateCost(material, quality, fileSizeMB, qty) {
  const mat = MATERIAL_COSTS[material];
  if (!mat) return null;
  const base = mat.base + (fileSizeMB * mat.per_mb);
  const mult = QUALITY_MULT[quality] || 1;
  const single = base * mult;
  const min = Math.round(single * qty * 0.8);
  const max = Math.round(single * qty * 1.4);
  return { min, max };
}

function STLUploadForm() {
  const fileRef = useRef();
  const [form, setForm] = useState({ name: '', email: '', whatsapp: '', material: 'PLA', color: '', quality: 'standard', quantity: 1, notes: '' });
  const [file, setFile] = useState(null);
  const [estimate, setEstimate] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleFile = (f) => {
    if (!f) return;
    if (!f.name.toLowerCase().endsWith('.stl')) {
      toast.error('Please upload an STL file');
      return;
    }
    setFile(f);
    const sizeMB = f.size / (1024 * 1024);
    setEstimate(estimateCost(form.material, form.quality, sizeMB, form.quantity));
  };

  const recalc = (newForm) => {
    if (file) {
      const sizeMB = file.size / (1024 * 1024);
      setEstimate(estimateCost(newForm.material, newForm.quality, sizeMB, newForm.quantity));
    }
    setForm(newForm);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email) return toast.error('Name and email are required');
    if (!file) return toast.error('Please upload an STL file');
    setUploading(true);
    const { file_url } = await api.integrations.Core.UploadFile({ file });
    await api.entities.PrintRequest.create({
      ...form,
      file_url,
      file_name: file.name,
      quantity: Number(form.quantity),
      estimated_cost_min: estimate?.min,
      estimated_cost_max: estimate?.max,
    });
    setUploading(false);
    setSubmitted(true);
    toast.success('Print request submitted!');
  };

  if (submitted) {
    return (
      <div className="text-center py-12">
        <div className="w-14 h-14 rounded-full bg-signal/10 border border-signal/30 flex items-center justify-center mx-auto mb-4">
          <FileCheck className="w-7 h-7 text-signal" />
        </div>
        <h3 className="font-display font-bold text-xl text-foreground mb-2">Request Submitted!</h3>
        <p className="text-muted-foreground mb-6 max-w-sm mx-auto text-sm">
          We received your file and details. We'll review the print and get back to you within 24 hours.
        </p>
        <WhatsAppButton text="Chat on WhatsApp" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* File Drop */}
      <div>
        <SectionLabel text="Upload STL File" />
        <div
          onClick={() => fileRef.current?.click()}
          className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${file ? 'border-signal/40 bg-signal/5' : 'border-border hover:border-primary/50'}`}
        >
          {file ? (
            <div className="flex flex-col items-center gap-2">
              <FileCheck className="w-8 h-8 text-signal" />
              <p className="font-mono-code text-sm text-signal">{file.name}</p>
              <p className="text-xs text-muted-foreground">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
              <button type="button" onClick={(e) => { e.stopPropagation(); setFile(null); setEstimate(null); }} className="text-xs text-muted-foreground hover:text-destructive mt-1">Remove</button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <Upload className="w-8 h-8 text-muted-foreground" />
              <p className="text-sm font-medium text-foreground">Click to upload STL file</p>
              <p className="text-xs text-muted-foreground">STL files only, max 50MB</p>
            </div>
          )}
        </div>
        <input ref={fileRef} type="file" accept=".stl" className="hidden" onChange={(e) => handleFile(e.target.files?.[0])} />
      </div>

      {/* Print Options */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-foreground/80 mb-1">Material</label>
          <Select value={form.material} onValueChange={(v) => recalc({ ...form, material: v })}>
            <SelectTrigger className="bg-card border-border"><SelectValue /></SelectTrigger>
            <SelectContent>
              {Object.entries(MATERIAL_COSTS).map(([k, v]) => (
                <SelectItem key={k} value={k}>{v.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground/80 mb-1">Quality</label>
          <Select value={form.quality} onValueChange={(v) => recalc({ ...form, quality: v })}>
            <SelectTrigger className="bg-card border-border"><SelectValue /></SelectTrigger>
            <SelectContent>
              {Object.entries(QUALITY_LABELS).map(([k, v]) => (
                <SelectItem key={k} value={k}>{v}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground/80 mb-1">Color</label>
          <Input value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} placeholder="e.g. Black, White, Red" className="bg-card border-border" />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-foreground/80 mb-1">Quantity</label>
        <Input type="number" min="1" max="100" value={form.quantity} onChange={(e) => recalc({ ...form, quantity: Number(e.target.value) })} className="bg-card border-border w-24" />
      </div>

      {/* Estimate */}
      {estimate && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-xl border border-primary/30 bg-primary/5"
        >
          <div className="flex items-center gap-2 mb-1">
            <Info className="w-4 h-4 text-primary" />
            <span className="font-mono-code text-xs text-primary">ESTIMATED PRICE RANGE</span>
          </div>
          <div className="font-display font-bold text-2xl text-primary">€{estimate.min} – €{estimate.max}</div>
          <p className="text-xs text-muted-foreground mt-1">Based on material type, quality, file complexity, and quantity. Final price confirmed after review.</p>
        </motion.div>
      )}

      {/* Contact */}
      <div className="pt-2 border-t border-border">
        <SectionLabel text="Your Details" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground/80 mb-1">Name *</label>
            <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="bg-card border-border" />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground/80 mb-1">Email *</label>
            <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required className="bg-card border-border" />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground/80 mb-1">WhatsApp (optional)</label>
            <Input value={form.whatsapp} onChange={(e) => setForm({ ...form, whatsapp: e.target.value })} placeholder="+30 69..." className="bg-card border-border" />
          </div>
        </div>
        <div className="mt-4">
          <label className="block text-sm font-medium text-foreground/80 mb-1">Notes</label>
          <Textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Infill %, support needs, specific requirements..." rows={3} className="bg-card border-border" />
        </div>
      </div>

      <Button type="submit" disabled={uploading} className="w-full bg-primary text-primary-foreground font-display font-semibold active:scale-[0.98] transition-all">
        {uploading ? <><Loader2 className="w-4 h-4 animate-spin mr-2" />Uploading...</> : <>Submit Print Request</>}
      </Button>
    </form>
  );
}

export default function Printing3D() {
  return (
    <>
      <ServicePage
        label="3D Printing"
        title="3D Printing & Rapid Prototyping"
        description="Fast, reliable 3D printing in PLA, PETG, and TPU. Upload your STL and get an instant price estimate."
        image={PRINT_IMG}
        includes={['Upload STL files directly', 'Materials: PLA / PETG / TPU', 'Prototype and functional parts', 'Robotics and drone parts', 'Post-processing and finishing', 'Multiple color options', 'Small batch production runs']}
        extras={['Combined design + printing service', 'PCB + enclosure integration packages', 'Rush / priority printing', 'Multi-material assemblies']}
        ctaWhatsApp="Send File for Printing"
        ctaText="Ready to print?"
      />

      <PricingTable serviceKey="3d-printing" />

      {/* STL Upload Section */}
      <section className="py-24 border-t border-border bg-card/20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionLabel text="Online Estimator" coord="SEC: EST-001" />
          <h2 className="font-display font-bold text-2xl sm:text-3xl tracking-tight text-foreground uppercase mb-3">
            Upload & Get Estimate
          </h2>
          <p className="text-muted-foreground mb-10 max-w-lg">
            Upload your STL file, choose your material and quality settings, and get an instant price estimate. We'll confirm the final price after reviewing your file.
          </p>
          <div className="bg-card border border-border rounded-2xl p-8">
            <STLUploadForm />
          </div>
        </div>
      </section>
    </>
  );
}