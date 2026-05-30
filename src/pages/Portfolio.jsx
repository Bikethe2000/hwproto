import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '@/api/apiClient';
import { Loader2, FolderOpen, ChevronDown } from 'lucide-react';
import PageHero from '../components/shared/PageHero';
import SectionLabel from '../components/shared/SectionLabel';
import { WhatsAppButton } from '../components/shared/CTAButtons';

import LINE_FOLLOWER_IMG from '@/assets/line_follower.svg';
import SUMO_IMG from '@/assets/sumo.svg';
import PCB_IMG from '@/assets/pcb.svg';
import PRINT_IMG from '@/assets/print.svg';
import LAB_IMG from '@/assets/lab.svg';
import CAD_IMG from '@/assets/cad.svg';


const ALL_CATS = 'All';
const CAT_LIST = ['All', 'Robotics', 'PCB', '3D Print', 'Engineering', 'Other'];

export default function Portfolio() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState(ALL_CATS);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    api.entities.PortfolioProject.list('-sort_order').then((data) => {
      setProjects(data.length > 0 ? data : FALLBACK);
      setLoading(false);
    }).catch(() => { setProjects(FALLBACK); setLoading(false); });
  }, []);

  const filtered = filter === ALL_CATS ? projects : projects.filter(p => p.category === filter);

  return (
    <div>
      <PageHero
        label="Portfolio"
        title="Projects & Builds"
        description="A showcase of robotics, electronics, and engineering projects — competition-tested and client-approved."
      />

      <section className="py-16 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Filters */}
          <div className="flex flex-wrap gap-2 mb-10">
            {CAT_LIST.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-4 py-2 text-xs font-mono-code rounded-md border transition-all active:scale-[0.98] ${
                  filter === cat ? 'border-primary text-primary bg-primary/10' : 'border-border text-muted-foreground hover:text-foreground'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="flex justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <FolderOpen className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">No projects in this category yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence mode="popLayout">
                {filtered.map((project) => (
                  <motion.div
                    key={project.id}
                    layout
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.3 }}
                    className="group rounded-xl border border-border bg-card/50 overflow-hidden hover:border-primary/30 transition-all"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden">
                      {project.image_url ? (
                        <img src={project.image_url} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <div className="w-full h-full bg-secondary/30 flex items-center justify-center">
                          <FolderOpen className="w-8 h-8 text-muted-foreground/30" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="absolute top-3 left-3">
                        <span className="font-mono-code text-[10px] px-2 py-1 rounded-md bg-background/80 border border-border text-muted-foreground backdrop-blur-sm">
                          {project.category}
                        </span>
                      </div>
                      {project.featured && (
                        <div className="absolute top-3 right-3">
                          <span className="font-mono-code text-[10px] px-2 py-1 rounded-md bg-primary/80 text-primary-foreground">Featured</span>
                        </div>
                      )}
                    </div>
                    <div className="p-5">
                      <h3 className="font-display font-semibold text-foreground mb-2">{project.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed mb-3">{project.description}</p>

                      {project.results && (
                        <div className="mb-3 px-3 py-2 bg-signal/5 border border-signal/20 rounded-lg">
                          <p className="text-xs text-signal font-mono-code">🏆 {project.results}</p>
                        </div>
                      )}

                      {project.tags?.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-3">
                          {project.tags.map((tag) => (
                            <span key={tag} className="font-mono-code text-[10px] px-2 py-0.5 rounded-full border border-primary/20 text-primary/70">{tag}</span>
                          ))}
                        </div>
                      )}

                      {project.technical_details && (
                        <button
                          onClick={() => setExpanded(expanded === project.id ? null : project.id)}
                          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors font-mono-code"
                        >
                          <ChevronDown className={`w-3 h-3 transition-transform ${expanded === project.id ? 'rotate-180' : ''}`} />
                          Technical Details
                        </button>
                      )}
                      <AnimatePresence>
                        {expanded === project.id && project.technical_details && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                          >
                            <p className="text-xs text-muted-foreground mt-2 pt-2 border-t border-border leading-relaxed">{project.technical_details}</p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}

          <div className="mt-16 text-center">
            <p className="text-muted-foreground mb-6 text-sm">Want your project built? Let's talk.</p>
            <WhatsAppButton text="Start Your Project" />
          </div>
        </div>
      </section>
    </div>
  );
}