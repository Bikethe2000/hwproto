import React, { useState } from 'react';
import { Link, useLocation, Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '@/lib/AuthContext';
import {
  LayoutDashboard, Package, FolderOpen, Settings, Printer, ChevronLeft, ChevronRight, LogOut, ClipboardList
} from 'lucide-react';

const navItems = [
  { label: 'Dashboard',      path: '/admin',               icon: LayoutDashboard },
  { label: 'Client Orders',  path: '/admin/orders',        icon: ClipboardList },
  { label: 'Store Products', path: '/admin/products',      icon: Package },
  { label: 'Portfolio',      path: '/admin/portfolio',     icon: FolderOpen },
  { label: 'Print Requests', path: '/admin/print-requests',icon: Printer },
  { label: 'Services',       path: '/admin/services',      icon: Settings },
];

export default function AdminLayout() {
  const { user } = useAuth();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== 'admin') return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center p-8 bg-card border border-border rounded-2xl max-w-sm">
        <div className="w-14 h-14 rounded-xl bg-destructive/10 border border-destructive/20 flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">🔒</span>
        </div>
        <h1 className="font-display font-bold text-xl text-foreground mb-2">Access Denied</h1>
        <p className="text-muted-foreground text-sm mb-4">This panel is restricted to the studio owner only.</p>
        <Link to="/" className="text-primary hover:underline text-sm">Return to site</Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className={`${collapsed ? 'w-16' : 'w-56'} bg-card border-r border-border flex flex-col transition-all duration-200 flex-shrink-0`}>
        <div className="p-4 border-b border-border flex items-center justify-between">
          {!collapsed && (
            <span className="font-display font-bold text-sm text-primary tracking-tight">ADMIN</span>
          )}
          <button onClick={() => setCollapsed(!collapsed)} className="text-muted-foreground hover:text-foreground transition-colors ml-auto">
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>
        <nav className="flex-1 p-2 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                title={collapsed ? item.label : undefined}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                  isActive ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                }`}
              >
                <item.icon className="w-4 h-4 flex-shrink-0" />
                {!collapsed && <span className="font-medium">{item.label}</span>}
              </Link>
            );
          })}
        </nav>
        <div className="p-2 border-t border-border">
          <Link
            to="/"
            title={collapsed ? 'View Site' : undefined}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-all"
          >
            <LogOut className="w-4 h-4 flex-shrink-0" />
            {!collapsed && <span>View Site</span>}
          </Link>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}