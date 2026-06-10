import React from 'react';

interface SectionProps {
  id: string;
  index: string;
  label: string;
  /** Chart-style altitude annotation; the page descends toward sea level. */
  altitude: string;
  children: React.ReactNode;
}

/** Shared editorial shell: keyline, mono chart annotations, content. */
const Section: React.FC<SectionProps> = ({ id, index, label, altitude, children }) => (
  <section id={id} className="mx-auto max-w-5xl px-6 py-16 md:px-10 md:py-24">
    <div className="mb-10 flex items-baseline justify-between border-t border-ink/15 pt-4 font-mono text-[11px] uppercase tracking-[0.22em] text-granite/60">
      <span>
        {index} · {label}
      </span>
      <span aria-hidden="true">{altitude}</span>
    </div>
    {children}
  </section>
);

export default Section;
