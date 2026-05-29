import React, { useState } from 'react';
import { Mail, Loader2, CheckCircle2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';

export default function NewsletterSignup({ source = 'footer', compact = false }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    setError('');

    const existing = await base44.entities.NewsletterSubscriber.filter({ email: email.trim() }).catch(() => []);
    if (existing.length > 0) {
      setError('This email is already subscribed.');
      setLoading(false);
      return;
    }

    await base44.entities.NewsletterSubscriber.create({ email: email.trim(), source });
    setLoading(false);
    setDone(true);
  };

  if (done) {
    return (
      <div className={`flex items-center gap-3 ${compact ? 'text-sm' : ''}`}>
        <CheckCircle2 className="w-5 h-5 text-signal flex-shrink-0" />
        <span className="text-signal font-mono-code text-sm">Subscribed! We'll keep you posted.</span>
      </div>
    );
  }

  return (
    <div>
      {!compact && (
        <p className="font-mono-code text-xs uppercase tracking-wider text-muted-foreground mb-3">
          Studio Updates
        </p>
      )}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="relative flex-1">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground/50" />
          <input
            type="email"
            value={email}
            onChange={e => { setEmail(e.target.value); setError(''); }}
            placeholder="your@email.com"
            required
            className="w-full pl-9 pr-3 py-2.5 bg-secondary/50 border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 transition-all"
          />
        </div>
        <button
          type="submit"
          disabled={loading || !email.trim()}
          className="px-4 py-2.5 bg-primary text-primary-foreground text-sm font-semibold rounded-lg hover:opacity-90 disabled:opacity-50 transition-all flex items-center gap-1.5 whitespace-nowrap"
        >
          {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Subscribe'}
        </button>
      </form>
      {error && <p className="text-xs text-destructive mt-1.5 font-mono-code">{error}</p>}
      {!compact && (
        <p className="text-xs text-muted-foreground/50 mt-2">Product updates & studio announcements. No spam.</p>
      )}
    </div>
  );
}