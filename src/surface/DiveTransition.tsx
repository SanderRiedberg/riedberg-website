import React from 'react';
import type { DivePhase } from '../voice/types';

interface DiveTransitionProps {
  phase: DivePhase;
}

/**
 * The signature moment: a sheet of deep water that rises over the
 * viewport on the way down and drains away on the way up. Sits above
 * everything; its resting states are off-screen or hidden.
 */
const DiveTransition: React.FC<DiveTransitionProps> = ({ phase }) => {
  const transform =
    phase === 'diving' || phase === 'surfacing' ? 'translateY(0%)' : 'translateY(102%)';
  const visible = phase === 'diving' || phase === 'surfacing';

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-50"
      style={{
        transform,
        transition: 'transform 1150ms cubic-bezier(0.65, 0, 0.35, 1)',
        visibility: visible ? 'visible' : 'hidden',
        background:
          'linear-gradient(to bottom, rgba(111,162,154,0.85) 0%, #14394c 6%, #0c2230 30%, #07131a 100%)',
      }}
    >
      {/* Foam crest along the rising edge */}
      <div
        className="absolute inset-x-0 top-0 h-1.5"
        style={{ background: 'rgba(253,254,254,0.55)', filter: 'blur(2px)' }}
      />
    </div>
  );
};

export default DiveTransition;
