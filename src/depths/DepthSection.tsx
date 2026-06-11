import React from 'react';
import DepthGauge from './DepthGauge';

interface DepthSectionProps {
  label: string;
  /** Resting depth in metres (negative). */
  depthM: number;
  /** Relay start: the previous chapter's resting depth. */
  depthFromM: number;
  children: React.ReactNode;
}

/** Shared shell for the chapters down here: keyline, label, live depth mark. */
const DepthSection: React.FC<DepthSectionProps> = ({ label, depthM, depthFromM, children }) => (
  <section className="mt-20">
    <div className="flex items-baseline justify-between border-t border-moon/15 pt-4 font-mono text-[11px] uppercase tracking-[0.22em] text-moon/50">
      <span>{label}</span>
      <DepthGauge toM={depthM} fromM={depthFromM} />
    </div>
    <div className="mt-8">{children}</div>
  </section>
);

export default DepthSection;
