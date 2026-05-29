import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Plus, Pencil, Trash2, X, Loader2, FolderOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import ImageUploader from '../../components/admin/ImageUploader';

const EMPTY = {
  title: '', description: '', category: 'Robotics', image_url: '',
  tags: [], technical_details: '', results: '', featured: false, sort_order: 0
};

export default function AdminPortfolio() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [tagsInput, setTagsInput] = useState('');
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    const data = await base44.entities.PortfolioProject.list('-sort_order');
    setProjects(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openNew = () => { setForm(EMPTY); setTagsInput(''); setEditing(null); setShowForm(true); };
  const openEdit = (p) => {
    setForm(p);
    setTagsInput((p.tags || []).join(', '));
    setEditing(p.id);
    setShowForm(true);
  };

  const save = async () => {
    if (!form.title) return toast.error('Title is required');
    setSaving(true);
    const tags = tagsInput.split(',').map(t => t.trim()).filter(Boolean);
    const data = { ...form, tags };
    if (editing) {
      await base44.entities.PortfolioProject.update(editing, data);
      toast.success('Project updated');
    } else {
      await base44.entities.PortfolioProject.create(data);
      toast.success('Project created');
    }
    setShowForm(false);
    await load();
    setSaving(false);
  };

  const remove = async (id) => {
    if (!confirm('Delete this project?')) return;
    await base44.entities.PortfolioProject.delete(id);
    toast.success('Deleted');
    await load();
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display font-bold text-2xl text-foreground mb-1">Portfolio Projects</h1>
          <p className="text-sm text-muted-foreground">{projects.length} projects</p>
        </div>
        <Button onClick={openNew} className="bg-primary text-primary-foreground hover:bg-primary/90">
          <Plus className="w-4 h-4 mr-2" /> Add Project
        </Button>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="font-display font-semibold text-foreground">{editing ? 'Edit Project' : 'New Project'}</h2>
              <button onClick={() => setShowForm(false)}><X className="w-5 h-5 text-muted-foreground" /></button>
            </div>
            <div className="p-6 space-y-4">
              <ImageUploader label="Main Image" value={form.image_url} onChange={(url) => setForm({ ...form, image_url: url })} />
              <div>
                <label className="block text-sm font-medium text-foreground/80 mb-1">Title *</label>
                <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="bg-background border-border" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground/80 mb-1">Description</label>
                <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="bg-background border-border" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground/80 mb-1">Category</label>
                <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                  <SelectTrigger className="bg-background border-border"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {['Robotics', 'PCB', '3D Print', 'Engineering', 'Other'].map(c => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground/80 mb-1">Tags (comma-separated)</label>
                <Input value={tagsInput} onChange={(e) => setTagsInput(e.target.value)} placeholder="Arduino, PCB Design, PID Control" className="bg-background border-border" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground/80 mb-1">Technical Details</label>
                <Textarea value={form.technical_details} onChange={(e) => setForm({ ...form, technical_details: e.target.value })} placeholder="Specs, components used, methods..." rows={3} className="bg-background border-border" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground/80 mb-1">Results / Awards</label>
                <Textarea value={form.results} onChange={(e) => setForm({ ...form, results: e.target.value })} placeholder="Competition results, outcomes..." rows={2} className="bg-background border-border" />
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="featured2" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="accent-primary" />
                <label htmlFor="featured2" className="text-sm text-foreground/80">Featured project</label>
              </div>
            </div>
            <div className="flex gap-3 p-6 pt-0">
              <Button onClick={save} disabled={saving} className="flex-1 bg-primary text-primary-foreground">
                {saving && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                {editing ? 'Update' : 'Create'}
              </Button>
              <Button variant="outline" onClick={() => setShowForm(false)} className="border-border">Cancel</Button>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
      ) : projects.length === 0 ? (
        <div className="text-center py-20 border-2 border-dashed border-border rounded-xl">
          <FolderOpen className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">No projects yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {projects.map((p) => (
            <div key={p.id} className="bg-card border border-border rounded-xl overflow-hidden">
              {p.image_url && <img src={p.image_url} alt={p.title} className="w-full h-40 object-cover" />}
              <div className="p-4">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h3 className="font-display font-semibold text-foreground text-sm">{p.title}</h3>
                  <span className="font-mono-code text-[10px] px-2 py-0.5 rounded-full border border-border text-muted-foreground flex-shrink-0">{p.category}</span>
                </div>
                <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{p.description}</p>
                {p.tags?.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {p.tags.slice(0, 3).map(t => (
                      <span key={t} className="font-mono-code text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary">{t}</span>
                    ))}
                  </div>
                )}
                <div className="flex justify-end gap-2">
                  <button onClick={() => openEdit(p)} className="p-1.5 rounded-md border border-border text-muted-foreground hover:text-primary hover:border-primary/30 transition-all">
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => remove(p.id)} className="p-1.5 rounded-md border border-border text-muted-foreground hover:text-destructive hover:border-destructive/30 transition-all">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}