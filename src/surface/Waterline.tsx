import React from 'react';
import { ArrowDown } from 'lucide-react';
import SeaCanvas from '../sea/SeaCanvas';
import { createWaterSurface } from '../sea/waterSurface';

interface WaterlineProps {
  onDive: () => void;
  reducedMotion: boolean;
}

/**
 * The bottom of the facade: colophon, the living water surface, and
 * the way down.
 */
const Waterline: React.FC<WaterlineProps> = ({ onDive, reducedMotion }) => (
  <section
    id="waterline"
    aria-label="The waterline"
    className="relative flex h-[78svh] min-h-[520px] flex-col overflow-hidden"
  >
    <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col justify-start px-6 pt-10 md:px-10">
      <div className="flex items-baseline justify-between border-t border-ink/15 pt-4 font-mono text-[11px] uppercase tracking-[0.22em] text-granite/60">
        <span>04 · The waterline</span>
        <span aria-hidden="true">0 m · sea level</span>
      </div>
      <p className="mt-8 max-w-md font-serif text-lg italic leading-relaxed text-granite">
        This page, like its owner, keeps the deeper analysis below the
        surface.
      </p>
      <p className="mt-4 max-w-md font-mono text-[11px] leading-relaxed text-granite/55">
        © 2026 Sander Riedberg · No cookies, no ad-tech, no third
        parties - visits are tallied anonymously in a counting house he
        runs himself. Yes, of course AI built this homepage. It lives
        just below this line.
      </p>
    </div>

    {/* The water itself */}
    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[46%]">
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to bottom, transparent 0%, rgba(20,57,76,0.25) 38%, rgba(12,34,48,0.8) 75%, #0c2230 100%)',
        }}
      />
      <SeaCanvas
        factory={createWaterSurface}
        reduced={reducedMotion}
        className="absolute inset-0 h-full w-full"
      />
    </div>

    <div className="absolute inset-x-0 bottom-[38%] z-10 flex justify-center">
      <button
        type="button"
        onClick={onDive}
        className="anim-bob group inline-flex items-center gap-3 rounded-full border border-foam/40 bg-deep/70 px-6 py-3 font-mono text-[11px] uppercase tracking-[0.22em] text-moon shadow-[0_8px_40px_rgba(7,19,26,0.45)] backdrop-blur-md transition-colors hover:border-biolume/60 hover:text-biolume focus-visible:outline-biolume"
      >
        Dive below the waterline
        <ArrowDown size={14} aria-hidden="true" className="transition-transform group-hover:translate-y-0.5" />
      </button>
    </div>
  </section>
);

export default Waterline;
