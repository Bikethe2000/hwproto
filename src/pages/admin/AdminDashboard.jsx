import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { Package, FolderOpen, Printer, Settings, ArrowRight, Clock } from 'lucide-react';

export default function AdminDashboard() {
  const [counts, setCounts] = useState({ products: 0, projects: 0, printRequests: 0 });

  useEffect(() => {
    Promise.all([
      base44.entities.Product.list(),
      base44.entities.PortfolioProject.list(),
      base44.entities.PrintRequest.list(),
    ]).then(([products, projects, printReqs]) => {
      setCounts({ products: products.length, projects: projects.length, printRequests: printReqs.length });
    });
  }, []);

  const cards = [
    { label: 'Products in Store', value: counts.products, icon: Package, link: '/admin/products', color: 'text-primary border-primary/20 bg-primary/5' },
    { label: 'Portfolio Projects', value: counts.projects, icon: FolderOpen, link: '/admin/portfolio', color: 'text-accent border-accent/20 bg-accent/5' },
    { label: 'Print Requests', value: counts.printRequests, icon: Printer, link: '/admin/print-requests', color: 'text-signal border-signal/20 bg-signal/5' },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="font-display font-bold text-2xl text-foreground mb-1">Admin Dashboard</h1>
        <p className="text-muted-foreground text-sm font-mono-code">Hardware Prototyping Studio // CMS</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {cards.map((card) => (
          <Link key={card.label} to={card.link} className={`p-6 rounded-xl border ${card.color} hover:opacity-80 transition-all group`}>
            <div className="flex items-center justify-between mb-3">
              <card.icon className="w-5 h-5" />
              <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="font-display font-bold text-3xl mb-1">{card.value}</div>
            <div className="text-sm opacity-70">{card.label}</div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          { label: 'Manage Products', desc: 'Add, edit, remove store products', icon: Package, link: '/admin/products' },
          { label: 'Manage Portfolio', desc: 'Add and update project showcases', icon: FolderOpen, link: '/admin/portfolio' },
          { label: 'Print Requests', desc: 'Review and respond to print orders', icon: Printer, link: '/admin/print-requests' },
          { label: 'Service Pages', desc: 'Edit service descriptions & images', icon: Settings, link: '/admin/services' },
        ].map((item) => (
          <Link key={item.label} to={item.link} className="flex items-start gap-4 p-5 rounded-xl border border-border bg-card/50 hover:border-primary/30 transition-all group">
            <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
              <item.icon className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-display font-semibold text-foreground mb-0.5">{item.label}</h3>
              <p className="text-sm text-muted-foreground">{item.desc}</p>
            </div>
            <ArrowRight className="w-4 h-4 text-primary ml-auto opacity-0 group-hover:opacity-100 transition-opacity self-center" />
          </Link>
        ))}
      </div>
    </div>
  );
}