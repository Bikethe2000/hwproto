import React from 'react';
import { motion } from 'framer-motion';
import { CircuitBoard, Box, Code, Trophy, Zap, Clock, Target } from 'lucide-react';
import PageHero from '../components/shared/PageHero';
import SectionLabel from '../components/shared/SectionLabel';
import { WhatsAppButton, QuoteButton } from '../components/shared/CTAButtons';

import ABOUT_IMG from '../assets/about.png';

const skills = [
  { icon: CircuitBoard, title: 'PCB Design', description: 'KiCad & EasyEDA — schematic capture, multi-layer PCB layout, DFM optimization' },
  { icon: Box, title: 'CAD / 3D Modeling', description: 'SolidWorks, Fusion 360 — mechanical design, enclosures, robotics assemblies' },
  { icon: Code, title: 'Arduino / Python', description: 'Embedded firmware, sensor integration, control systems, rapid prototyping' },
  { icon: Trophy, title: 'Competition Ready', description: 'Extensive experience in robotics competitions — line followers, sumo bots, and more' },
];

const whyWorkWithMe = [
  { icon: Zap, title: 'Hands-on Prototyping', description: 'Every project gets built, tested, and iterated in a real lab environment.' },
  { icon: Clock, title: 'Fast Iteration', description: 'Tight feedback loops. PCB revisions and 3D prints delivered in days, not weeks.' },
  { icon: Target, title: 'Robotics Specialist', description: 'Deep expertise in robotics systems — electronics, mechanics, and software integration.' },
];

export default function About() {
  return (
    <div>
      <PageHero
        label="About Me"
        title="Young robotics engineer & maker"
        description="Passionate about turning ideas into working hardware. Specializing in robotics, electronics design, and rapid prototyping with competition-proven expertise."
      />

      {/* Intro section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="relative rounded-xl overflow-hidden border border-border">
                <img src={ABOUT_IMG} alt="Engineer working in the lab" className="w-full aspect-[3/4] object-cover" />
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background to-transparent">
                  <span className="font-mono-code text-[10px] text-muted-foreground/50">IMG: ENG-PORTRAIT-001</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <SectionLabel text="Background" coord="SEC: ABT-001" />
              <h2 className="font-display font-bold text-2xl sm:text-3xl tracking-tight text-foreground uppercase mb-6">
                From competitions to client projects
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  I started building robots and electronics projects as a teenager, competing in national and international robotics competitions. That hands-on experience taught me how to design, build, and debug hardware under pressure.
                </p>
                <p>
                  Today, I run a hardware prototyping studio that helps startups, engineers, and makers bring their ideas to life. From PCB design to 3D printing to full system integration — I handle the complete prototyping pipeline.
                </p>
                <p>
                  Every project I take on benefits from the same rigor and problem-solving mindset I developed in competition environments.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Skills */}
      <section className="py-24 bg-card/50 border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionLabel text="Skills & Tools" />
          <h2 className="font-display font-bold text-2xl sm:text-3xl tracking-tight text-foreground uppercase mb-12">
            Technical capabilities
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {skills.map((skill, i) => (
              <motion.div
                key={skill.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-6 rounded-xl border border-border bg-card"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
                  <skill.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-display font-semibold text-foreground mb-2">{skill.title}</h3>
                <p className="text-sm text-muted-foreground">{skill.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why work with me */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionLabel text="Why Work With Me" />
          <h2 className="font-display font-bold text-2xl sm:text-3xl tracking-tight text-foreground uppercase mb-12">
            What sets me apart
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {whyWorkWithMe.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className="w-14 h-14 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-display font-semibold text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </motion.div>
            ))}
          </div>
          <div className="mt-16 text-center flex flex-wrap gap-4 justify-center">
            <WhatsAppButton text="Let's Work Together" />
            <QuoteButton />
          </div>
        </div>
      </section>
    </div>
  );
}