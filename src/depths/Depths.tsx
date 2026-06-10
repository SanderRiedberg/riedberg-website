import React, { useEffect, useRef } from 'react';
import { ArrowUp } from 'lucide-react';
import SeaCanvas from '../sea/SeaCanvas';
import { createDepthsBackdrop } from '../sea/depthsBackdrop';
import type { VisitMemory } from '../state/visitMemory';

interface DepthsProps {
  onSurface: () => void;
  memory: VisitMemory;
  noteSeen: (ids: readonly string[]) => void;
  reducedMotion: boolean;
}

/**
 * Below the waterline: the site's own quarters. Mounted lazily and
 * only while the visitor is down here.
 */
const Depths: React.FC<DepthsProps> = ({ onSurface, memory, noteSeen, reducedMotion }) => {
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  return (
    <div
      className="relative min-h-full text-moon"
      style={{
        background: 'linear-gradient(to bottom, #0c2230 0%, #07131a 55%, #050d12 100%)',
      }}
    >
      <SeaCanvas
        factory={createDepthsBackdrop}
        reduced={reducedMotion}
        className="pointer-events-none fixed inset-0 h-full w-full"
      />

      <div className="relative z-10 mx-auto max-w-3xl px-6 py-16 md:px-10 md:py-24">
        <div className="flex items-baseline justify-between font-mono text-[11px] uppercase tracking-[0.22em] text-moon/50">
          <span>Below the waterline</span>
          <span aria-hidden="true">−40 m</span>
        </div>

        <h1
          ref={headingRef}
          tabIndex={-1}
          className="mt-10 font-serif text-4xl font-medium leading-tight text-foam outline-none md:text-5xl"
        >
          Hello. I am the website.
        </h1>
        <p className="mt-6 max-w-xl leading-relaxed text-moon/85">
          Up there I behave. Down here I get to think. {/* Filled out in the next task. */}
        </p>

        <button
          type="button"
          onClick={onSurface}
          className="mt-12 inline-flex items-center gap-3 rounded-full border border-moon/30 px-6 py-3 font-mono text-[11px] uppercase tracking-[0.22em] text-moon transition-colors hover:border-biolume/60 hover:text-biolume"
        >
          <ArrowUp size={14} aria-hidden="true" />
          Back to the surface
        </button>
      </div>
    </div>
  );
};

export default Depths;
