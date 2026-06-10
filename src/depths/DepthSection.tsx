import React from 'react';

interface DepthSectionProps {
  label: string;
  depth: string;
  children: React.ReactNode;
}

/** Shared shell for the chapters down here: keyline, label, depth mark. */
const DepthSection: React.FC<DepthSectionProps> = ({ label, depth, children }) => (
  <section className="mt-20">
    <div className="flex items-baseline justify-between border-t border-moon/15 pt-4 font-mono text-[11px] uppercase tracking-[0.22em] text-moon/50">
      <span>{label}</span>
      <span aria-hidden="true">{depth}</span>
    </div>
    <div className="mt-8">{children}</div>
  </section>
);

export default DepthSection;
