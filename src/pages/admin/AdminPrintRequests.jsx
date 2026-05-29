import React, { useState, useEffect } from 'react';
import { api } from '@/api/apiClient';
import { Loader2, MessageCircle, ExternalLink } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

const STATUS_STYLES = {
  pending: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  reviewed: 'bg-primary/10 text-primary border-primary/20',
  quoted: 'bg-accent/10 text-accent border-accent/20',
  in_progress: 'bg-signal/10 text-signal border-signal/20',
  completed: 'bg-green-500/10 text-green-400 border-green-500/20',
  cancelled: 'bg-muted text-muted-foreground border-border',
};

const MATERIAL_LABELS = { PLA: 'PLA', PETG: 'PETG', TPU: 'TPU' };
const QUALITY_LABELS = { draft: 'Draft', standard: 'Standard', high_detail: 'High Detail' };

export default function AdminPrintRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const data = await api.entities.PrintRequest.list('-created_date');
    setRequests(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const updateStatus = async (id, status) => {
    await api.entities.PrintRequest.update(id, { status });
    toast.success('Status updated');
    await load();
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="font-display font-bold text-2xl text-foreground mb-1">3D Print Requests</h1>
        <p className="text-sm text-muted-foreground">{requests.length} total requests</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
      ) : requests.length === 0 ? (
        <div className="text-center py-20 border-2 border-dashed border-border rounded-xl">
          <p className="text-muted-foreground">No print requests yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map((req) => (
            <div key={req.id} className="bg-card border border-border rounded-xl p-5">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <h3 className="font-display font-semibold text-foreground">{req.name}</h3>
                    <span className={`font-mono-code text-[10px] px-2 py-0.5 rounded-full border ${STATUS_STYLES[req.status]}`}>
                      {req.status?.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-1 text-sm text-muted-foreground mb-3">
                    <span>📧 {req.email}</span>
                    {req.whatsapp && <span>📱 {req.whatsapp}</span>}
                    <span>🧱 {MATERIAL_LABELS[req.material]} — {req.color}</span>
                    <span>🎯 Quality: {QUALITY_LABELS[req.quality]}</span>
                    <span>🔢 Qty: {req.quantity}</span>
                    {(req.estimated_cost_min || req.estimated_cost_max) && (
                      <span>💰 Est: €{req.estimated_cost_min}–€{req.estimated_cost_max}</span>
                    )}
                  </div>
                  {req.notes && (
                    <p className="text-sm text-muted-foreground bg-secondary/50 rounded-lg px-3 py-2 mb-3 italic">"{req.notes}"</p>
                  )}
                  {req.file_url && (
                    <a href={req.file_url} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline">
                      <ExternalLink className="w-3 h-3" />
                      {req.file_name || 'Download STL file'}
                    </a>
                  )}
                </div>
                <div className="flex flex-col gap-3 sm:items-end">
                  <Select value={req.status} onValueChange={(v) => updateStatus(req.id, v)}>
                    <SelectTrigger className="w-36 bg-background border-border text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {['pending', 'reviewed', 'quoted', 'in_progress', 'completed', 'cancelled'].map(s => (
                        <SelectItem key={s} value={s}>{s.replace('_', ' ')}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {req.whatsapp && (
                    <a
                      href={`https://wa.me/${req.whatsapp.replace(/\D/g, '')}?text=Hi ${req.name}! Your 3D print request has been reviewed.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono-code text-signal border border-signal/30 rounded-md hover:bg-signal/10 transition-all"
                    >
                      <MessageCircle className="w-3 h-3" />
                      Reply on WhatsApp
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}