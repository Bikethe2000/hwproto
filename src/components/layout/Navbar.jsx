import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Cpu } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';
import { api } from '@/api/apiClient';
import { motion, AnimatePresence } from 'framer-motion';

const DEFAULT_SERVICE_LINKS = [
  { label: 'PCB Design', path: '/services/pcb-design' },
  { label: '3D CAD Design', path: '/services/3d-cad' },
  { label: '3D Printing', path: '/services/3d-printing' },
  { label: 'Micro Soldering', path: '/services/micro-soldering' },
  { label: 'Engineering Projects', path: '/services/engineering' },
  { label: 'AI Chatbots', path: '/services/ai-chatbots' },
  { label: 'Smart Home & Automation', path: '/services/smart-home' },
  { label: 'Website Development', path: '/services/web-development' },
  { label: 'Dashboard & Admin Panels', path: '/services/dashboard-dev' },
  { label: 'MVP Development', path: '/services/mvp-dev' },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [serviceLinks, setServiceLinks] = useState(DEFAULT_SERVICE_LINKS);
  const location = useLocation();
  const { user } = useAuth();

  // Load any dynamically added services from Firestore and merge them in
  useEffect(() => {
    const loadDynamic = async () => {
      try {
        const all = await api.entities.ServiceContent.list();
        const defaultPaths = new Set(DEFAULT_SERVICE_LINKS.map(s => s.path));
        const extra = all
          .filter(s => {
            const path = `/services/${s.service_key}`;
            return !defaultPaths.has(path);
          })
          .map(s => ({
            label: s.title || s.service_key.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
            path: `/services/${s.service_key}`,
          }));
        if (extra.length > 0) {
          setServiceLinks(prev => [...prev, ...extra]);
        }
      } catch (e) {
        // non-critical, keep defaults
      }
    };
    loadDynamic();
  }, []);

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'About', path: '/about' },
    {
      label: 'Services',
      path: '/services/pcb-design',
      children: serviceLinks,
    },
    { label: 'Store', path: '/store' },
    { label: 'Portfolio', path: '/portfolio' },
    { label: 'Track Order', path: '/track' },
    { label: 'Contact', path: '/contact' },
  ];

  const isActive = (path) => location.pathname === path;
  const isServiceActive = () => location.pathname.startsWith('/services');

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-md bg-primary/10 border border-primary/30 flex items-center justify-center group-hover:glow-cyan transition-all">
              <Cpu className="w-4 h-4 text-primary" />
            </div>
            <span className="font-display font-bold text-sm tracking-tight text-foreground">
              HW<span className="text-primary">PROTO</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) =>
              link.children ? (
                <div
                  key={link.label}
                  className="relative"
                  onMouseEnter={() => setServicesOpen(true)}
                  onMouseLeave={() => setServicesOpen(false)}
                >
                  <button
                    className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      isServiceActive() ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {link.label}
                  </button>
                  <AnimatePresence>
                    {servicesOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        transition={{ duration: 0.15 }}
                        className="absolute top-full left-0 mt-1 w-64 bg-card border border-border rounded-lg shadow-2xl overflow-hidden max-h-[70vh] overflow-y-auto"
                      >
                        {link.children.map((child) => (
                          <Link
                            key={child.path}
                            to={child.path}
                            className={`block px-4 py-2.5 text-sm transition-colors ${
                              isActive(child.path)
                                ? 'text-primary bg-primary/5'
                                : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                            }`}
                          >
                            {child.label}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    isActive(link.path) ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {link.label}
                </Link>
              )
            )}
          </div>

          <div className="hidden lg:flex items-center gap-3">
            {user?.role === 'admin' && (
              <Link
                to="/admin"
                className="px-3 py-2 text-xs font-mono-code text-muted-foreground hover:text-foreground transition-colors"
              >
                Admin
              </Link>
            )}
            {!user && (
              <Link
                to="/login"
                className="px-3 py-2 text-xs font-mono-code text-muted-foreground hover:text-foreground transition-colors"
              >
                Login
              </Link>
            )}
            <Link
              to="/contact"
              className="px-4 py-2 text-xs font-mono-code font-medium border border-primary/40 text-primary rounded-md hover:bg-primary/10 active:scale-[0.98] transition-all"
            >
              GET A QUOTE
            </Link>
          </div>

          <button
            className="lg:hidden p-2 text-muted-foreground hover:text-foreground"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="lg:hidden bg-card border-b border-border overflow-hidden"
          >
            <div className="px-4 py-4 space-y-1">
              {navLinks.map((link) =>
                link.children ? (
                  <div key={link.label}>
                    <p className="px-3 py-2 text-xs font-mono-code text-muted-foreground uppercase tracking-wider">
                      Services
                    </p>
                    {link.children.map((child) => (
                      <Link
                        key={child.path}
                        to={child.path}
                        onClick={() => setMobileOpen(false)}
                        className={`block px-3 py-2 text-sm rounded-md ${
                          isActive(child.path)
                            ? 'text-primary bg-primary/5'
                            : 'text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                ) : (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setMobileOpen(false)}
                    className={`block px-3 py-2 text-sm rounded-md ${
                      isActive(link.path)
                        ? 'text-primary bg-primary/5'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {link.label}
                  </Link>
                )
              )}
              <div className="pt-3 space-y-2">
                {user?.role === 'admin' && (
                  <Link
                    to="/admin"
                    onClick={() => setMobileOpen(false)}
                    className="block text-center px-4 py-2.5 text-sm font-mono-code text-muted-foreground border border-border rounded-md"
                  >
                    Admin Panel
                  </Link>
                )}

                <Link to="/login" onClick={() => setMobileOpen(false)} className="block text-center px-4 py-2.5 text-sm font-mono-code text-muted-foreground border border-border rounded-md">
                  Login
                </Link>
                <Link
                  to="/contact"
                  onClick={() => setMobileOpen(false)}
                  className="block text-center px-4 py-2.5 text-sm font-mono-code font-medium border border-primary/40 text-primary rounded-md"
                >
                  GET A QUOTE
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}