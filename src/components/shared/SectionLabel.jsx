import React from 'react';

export default function SectionLabel({ text, coord }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <div className="h-px w-8 bg-primary/40" />
      <span className="font-mono-code text-xs uppercase tracking-widest text-primary/70">{text}</span>
      {coord && (
        <span className="font-mono-code text-[10px] text-muted-foreground/40 ml-auto">{coord}</span>
      )}
    </div>
  );
}