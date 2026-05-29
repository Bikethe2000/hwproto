import React, { useState, useEffect } from 'react';
import { api } from '@/api/apiClient';
import { Plus, Pencil, Trash2, X, Loader2, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import ImageUploader from '../../components/admin/ImageUploader';

const STATUS_LABELS = {
  in_stock: { label: 'In Stock', class: 'bg-signal/10 text-signal border-signal/20' },
  made_to_order: { label: 'Made to Order', class: 'bg-primary/10 text-primary border-primary/20' },
  custom_build: { label: 'Custom Build', class: 'bg-accent/10 text-accent border-accent/20' },
  out_of_stock: { label: 'Out of Stock', class: 'bg-muted text-muted-foreground border-border' },
};

const EMPTY = { title: '', description: '', price: '', price_label: '', category: 'Electronics', status: 'in_stock', image_url: '', featured: false, sort_order: 0 };

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    const data = await api.entities.Product.list('-sort_order');
    setProducts(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openNew = () => { setForm(EMPTY); setEditing(null); setShowForm(true); };
  const openEdit = (p) => { setForm({ ...p, price: p.price ?? '' }); setEditing(p.id); setShowForm(true); };

  const save = async () => {
    if (!form.title) return toast.error('Title is required');
    setSaving(true);
    const data = { ...form, price: form.price !== '' ? parseFloat(form.price) : null };
    if (editing) {
      await api.entities.Product.update(editing, data);
      toast.success('Product updated');
    } else {
      await api.entities.Product.create(data);
      toast.success('Product created');
    }
    setShowForm(false);
    await load();
    setSaving(false);
  };

  const remove = async (id) => {
    if (!confirm('Delete this product?')) return;
    await api.entities.Product.delete(id);
    toast.success('Deleted');
    await load();
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display font-bold text-2xl text-foreground mb-1">Store Products</h1>
          <p className="text-sm text-muted-foreground">{products.length} products</p>
        </div>
        <Button onClick={openNew} className="bg-primary text-primary-foreground hover:bg-primary/90">
          <Plus className="w-4 h-4 mr-2" /> Add Product
        </Button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="font-display font-semibold text-foreground">{editing ? 'Edit Product' : 'New Product'}</h2>
              <button onClick={() => setShowForm(false)}><X className="w-5 h-5 text-muted-foreground" /></button>
            </div>
            <div className="p-6 space-y-4">
              <ImageUploader label="Product Image" value={form.image_url} onChange={(url) => setForm({ ...form, image_url: url })} />
              <div>
                <label className="block text-sm font-medium text-foreground/80 mb-1">Title *</label>
                <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Product name" className="bg-background border-border" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground/80 mb-1">Description</label>
                <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Product description" rows={3} className="bg-background border-border" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground/80 mb-1">Price (€)</label>
                  <Input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="Leave blank for quote" className="bg-background border-border" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground/80 mb-1">Price Label</label>
                  <Input value={form.price_label} onChange={(e) => setForm({ ...form, price_label: e.target.value })} placeholder="e.g. From €8" className="bg-background border-border" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground/80 mb-1">Category</label>
                  <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                    <SelectTrigger className="bg-background border-border"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {['Electronics', 'Hardware', 'Connectors', 'Magnets', 'Kits', 'Other'].map(c => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground/80 mb-1">Status</label>
                  <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
                    <SelectTrigger className="bg-background border-border"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="in_stock">In Stock</SelectItem>
                      <SelectItem value="made_to_order">Made to Order</SelectItem>
                      <SelectItem value="custom_build">Custom Build</SelectItem>
                      <SelectItem value="out_of_stock">Out of Stock</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="featured" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="accent-primary" />
                <label htmlFor="featured" className="text-sm text-foreground/80">Featured product</label>
              </div>
            </div>
            <div className="flex gap-3 p-6 pt-0">
              <Button onClick={save} disabled={saving} className="flex-1 bg-primary text-primary-foreground">
                {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                {editing ? 'Update' : 'Create'}
              </Button>
              <Button variant="outline" onClick={() => setShowForm(false)} className="border-border">Cancel</Button>
            </div>
          </div>
        </div>
      )}

      {/* Products grid */}
      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
      ) : products.length === 0 ? (
        <div className="text-center py-20 border-2 border-dashed border-border rounded-xl">
          <Package className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">No products yet. Click "Add Product" to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {products.map((p) => (
            <div key={p.id} className="bg-card border border-border rounded-xl overflow-hidden">
              {p.image_url && <img src={p.image_url} alt={p.title} className="w-full h-40 object-cover" />}
              <div className="p-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-display font-semibold text-foreground text-sm">{p.title}</h3>
                  <span className={`font-mono-code text-[10px] px-2 py-0.5 rounded-full border flex-shrink-0 ${STATUS_LABELS[p.status]?.class}`}>
                    {STATUS_LABELS[p.status]?.label}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{p.description}</p>
                <div className="flex items-center justify-between">
                  <span className="font-display font-bold text-primary text-sm">
                    {p.price_label || (p.price != null ? `€${p.price}` : 'Request Quote')}
                  </span>
                  <div className="flex gap-2">
                    <button onClick={() => openEdit(p)} className="p-1.5 rounded-md border border-border text-muted-foreground hover:text-primary hover:border-primary/30 transition-all">
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => remove(p.id)} className="p-1.5 rounded-md border border-border text-muted-foreground hover:text-destructive hover:border-destructive/30 transition-all">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}