import React, { useEffect, useRef } from 'react';
import { ArrowUp } from 'lucide-react';
import SeaCanvas from '../sea/SeaCanvas';
import { createDepthsBackdrop } from '../sea/depthsBackdrop';
import type { VisitMemory } from '../state/visitMemory';
import type { VoiceSensors } from '../voice/sensors';
import DepthSection from './DepthSection';
import Monologue from './Monologue';
import Portrait from './Portrait';
import Launch from './Launch';
import SourceReader from './SourceReader';
import Observations from './Observations';

interface DepthsProps {
  onSurface: () => void;
  memory: VisitMemory;
  noteSeen: (ids: readonly string[]) => void;
  sensors: VoiceSensors;
}

/**
 * Below the waterline: the site's own quarters. Mounted lazily and
 * only while the visitor is down here.
 */
const Depths: React.FC<DepthsProps> = ({ onSurface, memory, noteSeen, sensors }) => {
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
        reduced={sensors.reducedMotion}
        className="pointer-events-none fixed inset-0 h-full w-full"
      />

      <div className="relative z-10 mx-auto max-w-3xl px-6 py-16 md:px-10 md:py-20">
        <div className="flex items-baseline justify-between font-mono text-[11px] uppercase tracking-[0.22em] text-moon/50">
          <span>Below the waterline</span>
          <button
            type="button"
            onClick={onSurface}
            aria-label="Back to the surface (Escape)"
            className="pointer-events-auto uppercase tracking-[0.22em] text-moon/70 transition-colors hover:text-biolume"
          >
            <span aria-hidden="true">↑ </span>surface (esc)
          </button>
        </div>

        <h1
          ref={headingRef}
          tabIndex={-1}
          className="mt-12 font-serif text-4xl font-medium leading-tight text-foam outline-none md:text-5xl"
        >
          Hello. I am the website.
        </h1>
        <p className="mt-6 max-w-xl font-serif text-lg leading-relaxed text-moon/85">
          Up there I behave: I present my owner the way one presents a
          colleague, with keylines and restraint. Down here is where I
          keep the rest — what I think, what I know, how I was made, and
          what he is actually like. Stay as long as you want. The
          pressure is fine once you stop fighting it.
        </p>

        <DepthSection label="The monologue" depth="−5 m">
          <Monologue memory={memory} noteSeen={noteSeen} sensors={sensors} />
        </DepthSection>

        <Portrait />
        <Launch />
        <SourceReader />
        <Observations memory={memory} sensors={sensors} />

        <div className="mt-20 border-t border-moon/15 pt-10 pb-6">
          <button
            type="button"
            onClick={onSurface}
            className="inline-flex items-center gap-3 rounded-full border border-moon/30 px-6 py-3 font-mono text-[11px] uppercase tracking-[0.22em] text-moon transition-colors hover:border-biolume/60 hover:text-biolume"
          >
            <ArrowUp size={14} aria-hidden="true" />
            Back to the surface
          </button>
          <p className="mt-6 font-mono text-[11px] leading-relaxed text-moon/40">
            riedberg.se · below deck · everything you just read stays
            between us and your localStorage
          </p>
        </div>
      </div>
    </div>
  );
};

export default Depths;
