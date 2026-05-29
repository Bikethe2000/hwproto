import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { Loader2, FolderOpen, ChevronDown } from 'lucide-react';
import PageHero from '../components/shared/PageHero';
import SectionLabel from '../components/shared/SectionLabel';
import { WhatsAppButton } from '../components/shared/CTAButtons';

const LINE_FOLLOWER_IMG = 'https://media.base44.com/images/public/6a183d82770ee575c3658f58/1dff870d7_generated_98882691.png';
const SUMO_IMG = 'https://media.base44.com/images/public/6a183d82770ee575c3658f58/ae5983445_generated_d8144de5.png';
const PCB_IMG = 'https://media.base44.com/images/public/6a183d82770ee575c3658f58/aab26640b_generated_515f32a3.png';
const PRINT_IMG = 'https://media.base44.com/images/public/6a183d82770ee575c3658f58/5fd405f6f_generated_6ada00a9.png';
const LAB_IMG = 'https://media.base44.com/images/public/6a183d82770ee575c3658f58/4c5b0814e_generated_5a7e46e3.png';
const CAD_IMG = 'https://media.base44.com/images/public/6a183d82770ee575c3658f58/c1f40b78e_generated_d277a8cd.png';

const FALLBACK = [
  { id: 'f1', title: 'Autonomous Line Follower', category: 'Robotics', image_url: LINE_FOLLOWER_IMG, description: 'Competition-grade line follower robot with PID control, IR sensor array, and custom PCB. Multiple competition wins.', tags: ['Arduino', 'PCB Design', 'PID Control'], results: '1st Place — National Robotics Championship' },
  { id: 'f2', title: 'Mini Sumo Robot', category: 'Robotics', image_url: SUMO_IMG, description: 'Compact sumo robot with aggressive wedge design, proximity sensors, and high-torque motors.', tags: ['3D Print', 'Motor Control', 'Sensors'], results: 'Top 3 — Regional Sumo Competition' },
  { id: 'f3', title: 'Custom Motor Driver PCB', category: 'PCB', image_url: PCB_IMG, description: 'Dual H-bridge motor driver in KiCad. 4-layer PCB with integrated current sensing.', tags: ['KiCad', '4-Layer', 'DFM'] },
  { id: 'f4', title: 'Robotic Arm Enclosure', category: '3D Print', image_url: CAD_IMG, description: 'Full mechanical design and 3D printing of a 6-DOF robotic arm. PETG with metal inserts.', tags: ['CAD', 'PETG', 'Assembly'] },
  { id: 'f5', title: 'IoT Weather Station', category: 'Engineering', image_url: LAB_IMG, description: 'Complete IoT system with custom PCB, 3D printed enclosure, ESP32 firmware, and cloud dashboard.', tags: ['ESP32', 'IoT', 'Full Stack'] },
  { id: 'f6', title: 'Drone Motor Mount', category: '3D Print', image_url: PRINT_IMG, description: 'Lightweight TPU motor mounts for racing drones. Optimized for vibration dampening.', tags: ['TPU', 'FEA Tested', 'Drone'] },
];

const ALL_CATS = 'All';
const CAT_LIST = ['All', 'Robotics', 'PCB', '3D Print', 'Engineering', 'Other'];

export default function Portfolio() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState(ALL_CATS);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    base44.entities.PortfolioProject.list('-sort_order').then((data) => {
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