import React, { useState, useEffect } from 'react';
import { api } from '@/api/apiClient';
import { Loader2, Save, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import ImageUploader from '../../components/admin/ImageUploader';

const DEFAULT_SERVICES = [
  { key: 'pcb-design', label: 'PCB Design' },
  { key: '3d-cad', label: '3D CAD Design' },
  { key: '3d-printing', label: '3D Printing' },
  { key: 'micro-soldering', label: 'Micro Soldering' },
  { key: 'engineering', label: 'Engineering Projects' },
  { key: 'ai-chatbots', label: 'AI Chatbots' },
  { key: 'smart-home-automation', label: 'Smart Home & Automation' },
  { key: 'web-development', label: 'Website Development' },
  { key: 'dashboard-dev', label: 'Dashboard & Admin Panels' },
  { key: 'mvp-dev', label: 'MVP Development' },
];

export default function AdminServices() {
  const [services, setServices] = useState(DEFAULT_SERVICES);
  const [selectedKey, setSelectedKey] = useState('pcb-design');
  const [record, setRecord] = useState(null);
  const [form, setForm] = useState({
    title: '', description: '', includes: [], extras: [],
    hero_image_url: '', cta_whatsapp_text: '', cta_heading: '',
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [newInclude, setNewInclude] = useState('');
  const [newExtra, setNewExtra] = useState('');

  // On mount, also load any extra services persisted in Firestore that aren't in DEFAULT_SERVICES
  useEffect(() => {
    const loadDynamicServices = async () => {
      try {
        const all = await api.entities.ServiceContent.list();
        const extraKeys = all
          .filter(s => !DEFAULT_SERVICES.some(d => d.key === s.service_key))
          .map(s => ({
            key: s.service_key,
            label: s.title || s.service_key.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
          }));
        if (extraKeys.length > 0) {
          setServices(prev => {
            const existing = new Set(prev.map(s => s.key));
            return [...prev, ...extraKeys.filter(e => !existing.has(e.key))];
          });
        }
      } catch (e) {
        // non-critical, ignore
      }
    };
    loadDynamicServices();
  }, []);

  const load = async (key) => {
    setLoading(true);
    try {
      const results = await api.entities.ServiceContent.filter({ service_key: key });
      if (results.length > 0) {
        setRecord(results[0]);
        setForm({
          title: results[0].title || '',
          description: results[0].description || '',
          includes: results[0].includes || [],
          extras: results[0].extras || [],
          hero_image_url: results[0].hero_image_url || '',
          cta_whatsapp_text: results[0].cta_whatsapp_text || '',
          cta_heading: results[0].cta_heading || '',
        });
      } else {
        setRecord(null);
        setForm({ title: '', description: '', includes: [], extras: [], hero_image_url: '', cta_whatsapp_text: '', cta_heading: '' });
      }
    } catch (e) {
      toast.error('Failed to load service content');
    }
    setLoading(false);
  };

  useEffect(() => { load(selectedKey); }, [selectedKey]);

  const addInclude = () => {
    if (!newInclude.trim()) return;
    setForm(f => ({ ...f, includes: [...f.includes, newInclude.trim()] }));
    setNewInclude('');
  };

  const removeInclude = (i) => setForm(f => ({ ...f, includes: f.includes.filter((_, idx) => idx !== i) }));

  const addExtra = () => {
    if (!newExtra.trim()) return;
    setForm(f => ({ ...f, extras: [...f.extras, newExtra.trim()] }));
    setNewExtra('');
  };

  const removeExtra = (i) => setForm(f => ({ ...f, extras: f.extras.filter((_, idx) => idx !== i) }));

  const save = async () => {
    setSaving(true);
    try {
      const data = { ...form, service_key: selectedKey };
      if (record) {
        await api.entities.ServiceContent.update(record.id, data);
      } else {
        const created = await api.entities.ServiceContent.create(data);
        setRecord(created);
      }
      // Keep the label in sync with the title if it was just set
      setServices(prev => prev.map(s =>
        s.key === selectedKey && form.title
          ? { ...s, label: form.title }
          : s
      ));
      toast.success('Service content saved');
    } catch (e) {
      toast.error('Failed to save service content');
    }
    setSaving(false);
  };

  const addNewService = async () => {
    const newKey = prompt('Enter a unique key for the new service (e.g. "drone-repair")');
    if (!newKey || !newKey.trim()) return;
    const sanitized = newKey.trim().toLowerCase().replace(/\s+/g, '-');

    if (services.some(s => s.key === sanitized)) {
      toast.error('A service with that key already exists');
      return;
    }

    const label = sanitized.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    const emptyRecord = {
      service_key: sanitized,
      title: label,
      description: '',
      includes: [],
      extras: [],
      hero_image_url: '',
      cta_whatsapp_text: '',
      cta_heading: '',
    };

    try {
      const created = await api.entities.ServiceContent.create(emptyRecord);
      setServices(prev => [...prev, { key: sanitized, label }]);
      setRecord(created);
      setForm({
        title: label,
        description: '',
        includes: [],
        extras: [],
        hero_image_url: '',
        cta_whatsapp_text: '',
        cta_heading: '',
      });
      setSelectedKey(sanitized);
      toast.success(`Service "${label}" created`);
    } catch (e) {
      toast.error('Failed to create new service');
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="font-display font-bold text-2xl text-foreground mb-1">Service Pages</h1>
        <p className="text-sm text-muted-foreground">Edit content for each service page</p>
      </div>

      <div className="flex flex-wrap gap-2 mb-8">
        {services.map((s) => (
          <button
            key={s.key}
            onClick={() => setSelectedKey(s.key)}
            className={`px-4 py-2 text-sm font-mono-code rounded-md border transition-all ${
              selectedKey === s.key
                ? 'border-primary text-primary bg-primary/10'
                : 'border-border text-muted-foreground hover:text-foreground'
            }`}
          >
            {s.label}
          </button>
        ))}
        <button
          onClick={addNewService}
          className="px-4 py-2 text-sm font-mono-code rounded-md border border-dashed border-border text-muted-foreground hover:text-foreground hover:border-primary/40 transition-all"
        >
          + Add New Service
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      ) : (
        <div className="max-w-2xl space-y-6">
          <ImageUploader
            label="Hero Image"
            value={form.hero_image_url}
            onChange={(url) => setForm(f => ({ ...f, hero_image_url: url }))}
          />

          <div>
            <label className="block text-sm font-medium text-foreground/80 mb-1">Page Title</label>
            <Input
              value={form.title}
              onChange={(e) => setForm(f => ({ ...f, title: e.target.value }))}
              className="bg-card border-border"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground/80 mb-1">Description</label>
            <Textarea
              value={form.description}
              onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))}
              rows={3}
              className="bg-card border-border"
            />
          </div>

          {/* Includes */}
          <div>
            <label className="block text-sm font-medium text-foreground/80 mb-2">What's Included</label>
            <div className="space-y-2 mb-2">
              {form.includes.map((item, i) => (
                <div key={i} className="flex items-center gap-2 p-2 bg-card rounded-lg border border-border">
                  <span className="flex-1 text-sm text-foreground/80">{item}</span>
                  <button onClick={() => removeInclude(i)} className="text-muted-foreground hover:text-destructive">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={newInclude}
                onChange={(e) => setNewInclude(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addInclude()}
                placeholder="Add included item..."
                className="bg-card border-border"
              />
              <Button type="button" variant="outline" onClick={addInclude} className="border-border">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Extras */}
          <div>
            <label className="block text-sm font-medium text-foreground/80 mb-2">Extras / Add-ons</label>
            <div className="space-y-2 mb-2">
              {form.extras.map((item, i) => (
                <div key={i} className="flex items-center gap-2 p-2 bg-card rounded-lg border border-border">
                  <span className="flex-1 text-sm text-foreground/80">{item}</span>
                  <button onClick={() => removeExtra(i)} className="text-muted-foreground hover:text-destructive">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={newExtra}
                onChange={(e) => setNewExtra(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addExtra()}
                placeholder="Add extra service..."
                className="bg-card border-border"
              />
              <Button type="button" variant="outline" onClick={addExtra} className="border-border">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground/80 mb-1">CTA Heading</label>
              <Input
                value={form.cta_heading}
                onChange={(e) => setForm(f => ({ ...f, cta_heading: e.target.value }))}
                placeholder="Ready to start?"
                className="bg-card border-border"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground/80 mb-1">WhatsApp CTA Text</label>
              <Input
                value={form.cta_whatsapp_text}
                onChange={(e) => setForm(f => ({ ...f, cta_whatsapp_text: e.target.value }))}
                placeholder="Request PCB Design"
                className="bg-card border-border"
              />
            </div>
          </div>

          <Button
            onClick={save}
            disabled={saving}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
            Save Changes
          </Button>
        </div>
      )}
    </div>
  );
}