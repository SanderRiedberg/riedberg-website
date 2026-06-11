import React from 'react';
import { ArrowDown } from 'lucide-react';
import SeaCanvas from '../sea/SeaCanvas';
import { createWaterSurface } from '../sea/waterSurface';
import { useElementProgress } from '../hooks/useElementProgress';
import { clamp } from '../lib/scrollMath';

interface WaterlineProps {
  onDive: () => void;
  reducedMotion: boolean;
}

const WaveBand: React.FC<{ reducedMotion: boolean }> = ({ reducedMotion }) => (
  <div className="relative h-[120px] shrink-0">
    <div
      aria-hidden="true"
      className="absolute inset-x-0 top-0 z-10 h-px"
      style={{ background: 'rgba(253,254,254,0.5)', filter: 'blur(1px)' }}
    />
    <SeaCanvas
      factory={createWaterSurface}
      reduced={reducedMotion}
      className="absolute inset-0 h-full w-full"
    />
  </div>
);

const Colophon: React.FC = () => (
  <>
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
      runs himself. Yes, of course AI built this homepage. It lives just
      below this line.
    </p>
  </>
);

const DiveButton: React.FC<{ onDive: () => void; bob?: boolean }> = ({ onDive, bob }) => (
  <button
    type="button"
    onClick={onDive}
    className={`${bob ? 'anim-bob ' : ''}group inline-flex items-center gap-3 rounded-full border border-foam/40 bg-deep/70 px-6 py-3 font-mono text-[11px] uppercase tracking-[0.22em] text-moon shadow-[0_8px_40px_rgba(7,19,26,0.45)] backdrop-blur-md transition-colors hover:border-biolume/60 hover:text-biolume focus-visible:outline-biolume`}
  >
    Dive below the waterline
    <ArrowDown size={14} aria-hidden="true" className="transition-transform group-hover:translate-y-0.5" />
  </button>
);

/**
 * The bottom of the facade. Under reduced motion it is a calm static
 * section. Otherwise it becomes a tall scroll track with a pinned
 * scene: the water rises, scroll-scrubbed, until it fills the view and
 * hands off to the dive at the page's end. It never traps the scroll.
 */
const Waterline: React.FC<WaterlineProps> = ({ onDive, reducedMotion }) => {
  const { ref, progress } = useElementProgress<HTMLElement>();

  // Reduced motion (progress === null): the original calm layout.
  if (progress === null) {
    return (
      <section
        aria-label="The waterline"
        className="relative flex h-[78svh] min-h-[520px] flex-col overflow-hidden"
      >
        <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col justify-start px-6 pt-10 md:px-10">
          <Colophon />
        </div>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[46%]">
          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(to bottom, transparent 0%, rgba(20,57,76,0.25) 38%, rgba(12,34,48,0.8) 75%, #0c2230 100%)',
            }}
          />
          <SeaCanvas factory={createWaterSurface} reduced className="absolute inset-0 h-full w-full" />
        </div>
        <div className="absolute inset-x-0 bottom-[38%] z-10 flex justify-center">
          <DiveButton onDive={onDive} />
        </div>
      </section>
    );
  }

  // Pinned, scroll-scrubbed scene.
  const level = 46 + progress * 54; // % of viewport covered by water
  const colophonOpacity = clamp(1 - progress * 1.8, 0, 1);
  const buttonOpacity = clamp(1 - progress * 2.2, 0, 1);
  // Once it has all but faded, take the button out of the tab order and
  // pointer reach so it is never an invisible click/keyboard target.
  const buttonGone = buttonOpacity < 0.15;

  return (
    <section ref={ref} aria-label="The waterline" className="relative h-[190vh]">
      <div className="sticky top-0 flex h-screen flex-col overflow-hidden">
        <div
          className="mx-auto w-full max-w-5xl flex-1 px-6 pt-12 md:px-10"
          style={{ opacity: colophonOpacity }}
        >
          <Colophon />
        </div>

        {/* Rising water: a fixed-height wave band on top of a deep body. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-col"
          style={{ height: `${level}%` }}
        >
          <div
            className="absolute inset-x-0 -top-16 h-16"
            style={{ background: 'linear-gradient(to top, rgba(20,57,76,0.2), transparent)' }}
          />
          <WaveBand reducedMotion={reducedMotion} />
          <div
            className="flex-1"
            style={{
              background: 'linear-gradient(to bottom, rgba(12,34,48,0.9) 0%, #0c2230 60%, #07131a 100%)',
            }}
          />
        </div>

        <div
          className="absolute inset-x-0 top-1/2 z-10 flex -translate-y-1/2 justify-center"
          style={{ opacity: buttonOpacity, pointerEvents: buttonGone ? 'none' : undefined }}
          aria-hidden={buttonGone || undefined}
          inert={buttonGone || undefined}
        >
          <DiveButton onDive={onDive} bob />
        </div>
      </div>
    </section>
  );
};

export default Waterline;
