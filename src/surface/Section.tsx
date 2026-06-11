import React from 'react';
import { useReveal } from '../hooks/useReveal';
import AltitudeReadout from './AltitudeReadout';

interface SectionProps {
  id: string;
  index: string;
  label: string;
  /** Chart-style altitude in metres; the page descends toward sea level. */
  altitudeM: number;
  children: React.ReactNode;
}

/** Shared editorial shell: a self-drawing keyline, chart annotations, content. */
const Section: React.FC<SectionProps> = ({ id, index, label, altitudeM, children }) => {
  const { ref, revealed } = useReveal<HTMLDivElement>();
  return (
    <section id={id} className="mx-auto max-w-5xl px-6 py-16 md:px-10 md:py-24">
      <div ref={ref} className="relative mb-10">
        <div
          data-revealed={revealed}
          className="keyline-draw absolute left-0 right-0 top-0 h-px bg-ink/20"
        />
        <div className="flex items-baseline justify-between pt-4 font-mono text-[11px] uppercase tracking-[0.22em] text-granite/60">
          <span>
            {index} · {label}
          </span>
          <AltitudeReadout meters={altitudeM} className="tabular-nums" />
        </div>
      </div>
      {children}
    </section>
  );
};

export default Section;
