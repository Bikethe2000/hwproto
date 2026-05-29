import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Plus, Search, Loader2, Pencil, Trash2, Save, X, MessageCircle } from 'lucide-react';

const STATUS_OPTIONS = [
  'submitted', 'in_review', 'sourcing_components', 'in_production', 'quality_check', 'shipped', 'delivered', 'on_hold', 'cancelled'
];
const STATUS_LABELS = {
  submitted: 'Submitted', in_review: 'In Review', sourcing_components: 'Sourcing Components',
  in_production: 'In Production', quality_check: 'Quality Check', shipped: 'Shipped',
  delivered: 'Delivered', on_hold: 'On Hold', cancelled: 'Cancelled',
};
const STATUS_COLORS = {
  submitted: 'text-muted-foreground bg-muted/30', in_review: 'text-primary bg-primary/10',
  sourcing_components: 'text-yellow-400 bg-yellow-400/10', in_production: 'text-accent bg-accent/10',
  quality_check: 'text-blue-400 bg-blue-400/10', shipped: 'text-signal bg-signal/10',
  delivered: 'text-signal bg-signal/10', on_hold: 'text-orange-400 bg-orange-400/10',
  cancelled: 'text-destructive bg-destructive/10',
};
const SERVICE_OPTIONS = ['PCB Design', '3D CAD Design', '3D Printing', 'Micro Soldering', 'Engineering Project', 'Custom Build'];

const EMPTY_FORM = {
  order_id: '', client_name: '', client_email: '', service_type: 'PCB Design',
  project_title: '', project_description: '', status: 'submitted', status_message: '',
  estimated_delivery: '', tracking_number: '', shipping_carrier: '', notes: '',
};

function generateOrderId(service) {
  const prefix = { 'PCB Design': 'PCB', '3D Printing': 'PRT', '3D CAD Design': 'CAD', 'Micro Soldering': 'SOL', 'Engineering Project': 'ENG', 'Custom Build': 'CBL' }[service] || 'ORD';
  return `${prefix}-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 900) + 100)}`;
}

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const load = () => base44.entities.ClientOrder.list('-created_date', 100).then(setOrders).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const openNew = () => {
    setForm({ ...EMPTY_FORM, order_id: generateOrderId('PCB Design') });
    setEditing(null);
    setShowForm(true);
  };
  const openEdit = (o) => { setForm({ ...EMPTY_FORM, ...o }); setEditing(o); setShowForm(true); };
  const closeForm = () => { setShowForm(false); setEditing(null); };

  const handleSave = async () => {
    setSaving(true);
    const statusChanged = editing && editing.status !== form.status;

    if (editing) {
      await base44.entities.ClientOrder.update(editing.id, form);
    } else {
      await base44.entities.ClientOrder.create(form);
    }

    // Send email notification if status changed or new order
    const shouldNotify = (statusChanged || !editing) && form.client_email;
    if (shouldNotify) {
      const isNew = !editing;
      const subject = isNew
        ? `Order ${form.order_id} Confirmed — ${form.service_type}`
        : `Order ${form.order_id} Update — ${STATUS_LABELS[form.status]}`;

      const body = isNew
        ? `Hi ${form.client_name || 'there'},\n\nYour order has been received!\n\nOrder ID: ${form.order_id}\nService: ${form.service_type}\nProject: ${form.project_title || '—'}\n\nWe'll review your request and get back to you soon.\n\nTrack your order at: https://hwproto.studio/track\n\nBest,\nHW Proto Studio`
        : `Hi ${form.client_name || 'there'},\n\nYour order status has been updated.\n\nOrder ID: ${form.order_id}\nProject: ${form.project_title || form.service_type}\nNew Status: ${STATUS_LABELS[form.status]}${form.status_message ? `\n\nMessage from studio:\n${form.status_message}` : ''}${form.tracking_number ? `\n\nTracking: ${form.shipping_carrier || ''} ${form.tracking_number}` : ''}${form.estimated_delivery ? `\nEstimated Delivery: ${form.estimated_delivery}` : ''}\n\nTrack your order: https://hwproto.studio/track\n\nBest,\nHW Proto Studio`;

      await base44.integrations.Core.SendEmail({
        to: form.client_email,
        subject,
        body,
        from_name: 'HW Proto Studio',
      }).catch(() => {}); // don't block UI on email failure
    }

    setSaving(false);
    closeForm();
    load();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this order?')) return;
    await base44.entities.ClientOrder.delete(id);
    load();
  };

  const filtered = orders.filter(o =>
    !search ||
    o.order_id?.toLowerCase().includes(search.toLowerCase()) ||
    o.client_email?.toLowerCase().includes(search.toLowerCase()) ||
    o.client_name?.toLowerCase().includes(search.toLowerCase())
  );

  const field = (key, label, type = 'text', opts = null) => (
    <div>
      <label className="block text-xs font-mono-code text-muted-foreground mb-1">{label}</label>
      {opts ? (
        <select value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value, ...(key === 'service_type' ? { order_id: generateOrderId(e.target.value) } : {}) }))}
          className="w-full px-3 py-2 bg-secondary border border-border rounded-lg text-sm text-foreground focus:outline-none focus:border-primary/50">
          {opts.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
      ) : type === 'textarea' ? (
        <textarea value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} rows={3}
          className="w-full px-3 py-2 bg-secondary border border-border rounded-lg text-sm text-foreground focus:outline-none focus:border-primary/50 resize-none" />
      ) : (
        <input type={type} value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
          className="w-full px-3 py-2 bg-secondary border border-border rounded-lg text-sm text-foreground focus:outline-none focus:border-primary/50" />
      )}
    </div>
  );

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display font-bold text-2xl text-foreground">Client Orders</h1>
          <p className="text-muted-foreground text-sm mt-1">{orders.length} total orders</p>
        </div>
        <button onClick={openNew} className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground font-semibold text-sm rounded-lg hover:opacity-90 transition-all">
          <Plus className="w-4 h-4" /> New Order
        </button>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input placeholder="Search by name, email, or order ID…" value={search} onChange={e => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-card border border-border rounded-lg text-sm text-foreground focus:outline-none focus:border-primary/50" />
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      ) : (
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/30">
                {['Order ID', 'Client', 'Service', 'Project', 'Status', 'Actions'].map(h => (
                  <th key={h} className="text-left px-4 py-3 font-mono-code text-xs text-muted-foreground">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="text-center py-12 text-muted-foreground">No orders found</td></tr>
              )}
              {filtered.map(o => (
                <tr key={o.id} className="hover:bg-secondary/20 transition-colors">
                  <td className="px-4 py-3 font-mono-code text-xs text-primary">{o.order_id}</td>
                  <td className="px-4 py-3">
                    <div className="font-medium text-foreground">{o.client_name || '—'}</div>
                    <div className="text-xs text-muted-foreground">{o.client_email}</div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{o.service_type}</td>
                  <td className="px-4 py-3 text-foreground max-w-[200px] truncate">{o.project_title || '—'}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[o.status]}`}>
                      {STATUS_LABELS[o.status]}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button onClick={() => openEdit(o)} className="p-1.5 text-muted-foreground hover:text-foreground transition-colors"><Pencil className="w-3.5 h-3.5" /></button>
                      {o.client_email && (
                        <a href={`mailto:${o.client_email}?subject=Order ${o.order_id} Update`} className="p-1.5 text-muted-foreground hover:text-primary transition-colors">
                          <MessageCircle className="w-3.5 h-3.5" />
                        </a>
                      )}
                      <button onClick={() => handleDelete(o.id)} className="p-1.5 text-muted-foreground hover:text-destructive transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Form modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4" onClick={closeForm}>
          <div className="bg-card border border-border rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-border flex items-center justify-between">
              <h2 className="font-display font-bold text-lg text-foreground">{editing ? 'Edit Order' : 'New Order'}</h2>
              <button onClick={closeForm} className="text-muted-foreground hover:text-foreground"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {field('order_id', 'ORDER ID')}
              {field('service_type', 'SERVICE TYPE', 'text', SERVICE_OPTIONS)}
              {field('client_name', 'CLIENT NAME')}
              {field('client_email', 'CLIENT EMAIL', 'email')}
              {field('project_title', 'PROJECT TITLE')}
              {field('status', 'STATUS', 'text', STATUS_OPTIONS.map(s => s))}
              <div className="sm:col-span-2">{field('status_message', 'STATUS MESSAGE (shown to client)', 'textarea')}</div>
              {field('estimated_delivery', 'ESTIMATED DELIVERY', 'date')}
              {field('shipping_carrier', 'SHIPPING CARRIER')}
              {field('tracking_number', 'TRACKING NUMBER')}
              <div className="sm:col-span-2">{field('notes', 'INTERNAL NOTES', 'textarea')}</div>
            </div>
            <div className="p-6 border-t border-border flex justify-end gap-3">
              <button onClick={closeForm} className="px-4 py-2 border border-border text-muted-foreground text-sm rounded-lg hover:text-foreground transition-colors">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-6 py-2 bg-primary text-primary-foreground text-sm font-semibold rounded-lg hover:opacity-90 disabled:opacity-60">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {saving ? 'Saving…' : 'Save Order'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}