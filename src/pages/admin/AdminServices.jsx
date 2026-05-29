import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Loader2, Save, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import ImageUploader from '../../components/admin/ImageUploader';

const SERVICES = [
  { key: 'pcb-design', label: 'PCB Design' },
  { key: '3d-cad', label: '3D CAD Design' },
  { key: '3d-printing', label: '3D Printing' },
  { key: 'micro-soldering', label: 'Micro Soldering' },
  { key: 'engineering', label: 'Engineering Projects' },
];

export default function AdminServices() {
  const [selectedKey, setSelectedKey] = useState('pcb-design');
  const [record, setRecord] = useState(null);
  const [form, setForm] = useState({ title: '', description: '', includes: [], extras: [], hero_image_url: '', cta_whatsapp_text: '', cta_heading: '' });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [newInclude, setNewInclude] = useState('');
  const [newExtra, setNewExtra] = useState('');

  const load = async (key) => {
    setLoading(true);
    const results = await base44.entities.ServiceContent.filter({ service_key: key });
    if (results.length > 0) {
      setRecord(results[0]);
      setForm({ title: results[0].title || '', description: results[0].description || '', includes: results[0].includes || [], extras: results[0].extras || [], hero_image_url: results[0].hero_image_url || '', cta_whatsapp_text: results[0].cta_whatsapp_text || '', cta_heading: results[0].cta_heading || '' });
    } else {
      setRecord(null);
      setForm({ title: '', description: '', includes: [], extras: [], hero_image_url: '', cta_whatsapp_text: '', cta_heading: '' });
    }
    setLoading(false);
  };

  useEffect(() => { load(selectedKey); }, [selectedKey]);

  const addInclude = () => {
    if (!newInclude.trim()) return;
    setForm({ ...form, includes: [...form.includes, newInclude.trim()] });
    setNewInclude('');
  };

  const removeInclude = (i) => setForm({ ...form, includes: form.includes.filter((_, idx) => idx !== i) });

  const addExtra = () => {
    if (!newExtra.trim()) return;
    setForm({ ...form, extras: [...form.extras, newExtra.trim()] });
    setNewExtra('');
  };

  const removeExtra = (i) => setForm({ ...form, extras: form.extras.filter((_, idx) => idx !== i) });

  const save = async () => {
    setSaving(true);
    const data = { ...form, service_key: selectedKey };
    if (record) {
      await base44.entities.ServiceContent.update(record.id, data);
    } else {
      const created = await base44.entities.ServiceContent.create(data);
      setRecord(created);
    }
    toast.success('Service content saved');
    setSaving(false);
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="font-display font-bold text-2xl text-foreground mb-1">Service Pages</h1>
        <p className="text-sm text-muted-foreground">Edit content for each service page</p>
      </div>

      <div className="flex flex-wrap gap-2 mb-8">
        {SERVICES.map((s) => (
          <button
            key={s.key}
            onClick={() => setSelectedKey(s.key)}
            className={`px-4 py-2 text-sm font-mono-code rounded-md border transition-all ${selectedKey === s.key ? 'border-primary text-primary bg-primary/10' : 'border-border text-muted-foreground hover:text-foreground'}`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
      ) : (
        <div className="max-w-2xl space-y-6">
          <ImageUploader label="Hero Image" value={form.hero_image_url} onChange={(url) => setForm({ ...form, hero_image_url: url })} />

          <div>
            <label className="block text-sm font-medium text-foreground/80 mb-1">Page Title</label>
            <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="bg-card border-border" />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground/80 mb-1">Description</label>
            <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="bg-card border-border" />
          </div>

          {/* Includes */}
          <div>
            <label className="block text-sm font-medium text-foreground/80 mb-2">What's Included</label>
            <div className="space-y-2 mb-2">
              {form.includes.map((item, i) => (
                <div key={i} className="flex items-center gap-2 p-2 bg-card rounded-lg border border-border">
                  <span className="flex-1 text-sm text-foreground/80">{item}</span>
                  <button onClick={() => removeInclude(i)} className="text-muted-foreground hover:text-destructive"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <Input value={newInclude} onChange={(e) => setNewInclude(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addInclude()} placeholder="Add included item..." className="bg-card border-border" />
              <Button type="button" variant="outline" onClick={addInclude} className="border-border"><Plus className="w-4 h-4" /></Button>
            </div>
          </div>

          {/* Extras */}
          <div>
            <label className="block text-sm font-medium text-foreground/80 mb-2">Extras / Add-ons</label>
            <div className="space-y-2 mb-2">
              {form.extras.map((item, i) => (
                <div key={i} className="flex items-center gap-2 p-2 bg-card rounded-lg border border-border">
                  <span className="flex-1 text-sm text-foreground/80">{item}</span>
                  <button onClick={() => removeExtra(i)} className="text-muted-foreground hover:text-destructive"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <Input value={newExtra} onChange={(e) => setNewExtra(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addExtra()} placeholder="Add extra service..." className="bg-card border-border" />
              <Button type="button" variant="outline" onClick={addExtra} className="border-border"><Plus className="w-4 h-4" /></Button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground/80 mb-1">CTA Heading</label>
              <Input value={form.cta_heading} onChange={(e) => setForm({ ...form, cta_heading: e.target.value })} placeholder="Ready to start?" className="bg-card border-border" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground/80 mb-1">WhatsApp CTA Text</label>
              <Input value={form.cta_whatsapp_text} onChange={(e) => setForm({ ...form, cta_whatsapp_text: e.target.value })} placeholder="Request PCB Design" className="bg-card border-border" />
            </div>
          </div>

          <Button onClick={save} disabled={saving} className="bg-primary text-primary-foreground hover:bg-primary/90">
            {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
            Save Changes
          </Button>
        </div>
      )}
    </div>
  );
}