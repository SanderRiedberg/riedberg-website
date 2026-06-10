import React, { useEffect, useState } from 'react';
import type { DivePhase } from '../voice/types';

interface DiveTransitionProps {
  phase: DivePhase;
}

/**
 * The signature moment: a sheet of deep water that rises over the
 * viewport on the way down, and drains away on the way up.
 *
 * Choreography: 'diving' slides the sheet up from below. On
 * 'surfacing' the sheet first covers instantly (seamless against the
 * equally dark depths) and then drains downward to reveal the surface.
 */
const DiveTransition: React.FC<DiveTransitionProps> = ({ phase }) => {
  const [covering, setCovering] = useState(false);

  useEffect(() => {
    if (phase !== 'surfacing') {
      setCovering(false);
      return;
    }
    setCovering(true);
    // Two frames so the covering position paints before the drain starts.
    let raf2 = 0;
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => setCovering(false));
    });
    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
    };
  }, [phase]);

  const up = phase === 'diving' || covering;
  const visible = phase === 'diving' || phase === 'surfacing';

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-50"
      style={{
        transform: up ? 'translateY(0%)' : 'translateY(102%)',
        transition: covering
          ? 'none'
          : 'transform 1150ms cubic-bezier(0.65, 0, 0.35, 1)',
        visibility: visible ? 'visible' : 'hidden',
        background:
          'linear-gradient(to bottom, rgba(111,162,154,0.85) 0%, #14394c 6%, #0c2230 30%, #07131a 100%)',
      }}
    >
      {/* Foam crest along the moving edge */}
      <div
        className="absolute inset-x-0 top-0 h-1.5"
        style={{ background: 'rgba(253,254,254,0.55)', filter: 'blur(2px)' }}
      />
    </div>
  );
};

export default DiveTransition;
