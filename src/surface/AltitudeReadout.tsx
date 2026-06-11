import React, { useEffect, useState } from 'react';
import { subscribeScroll } from '../lib/scrollBus';
import { clamp } from '../lib/scrollMath';
import { useReducedMotion } from '../hooks/useMediaPreferences';

interface AltitudeReadoutProps {
  /** Resting altitude in metres; the readout settles here. */
  meters: number;
  className?: string;
}

/** Extra metres shown while the section is still far below the fold. */
const APPROACH_RANGE_M = 14;
/** Viewport fraction where the readout reaches its resting value. */
const SETTLE_AT = 0.3;

/**
 * A live altimeter: the number descends with the scroll, settling at
 * its resting value once the section header reaches reading height.
 * The page literally counts down toward sea level as you approach the
 * waterline. Static under reduced motion.
 */
const AltitudeReadout: React.FC<AltitudeReadoutProps> = ({ meters, className = '' }) => {
  const reducedMotion = useReducedMotion();
  const [el, setEl] = useState<HTMLSpanElement | null>(null);
  const [shown, setShown] = useState(meters);

  useEffect(() => {
    if (reducedMotion || !el) {
      setShown(meters);
      return;
    }
    return subscribeScroll(() => {
      const rect = el.getBoundingClientRect();
      const vh = Math.max(window.innerHeight, 1);
      // 0 when the header sits at reading height (or above), 1 when it
      // is still a full viewport away below.
      const approach = clamp((rect.top - vh * SETTLE_AT) / (vh * (1 - SETTLE_AT)), 0, 1);
      setShown(meters + Math.round(approach * APPROACH_RANGE_M));
    });
  }, [el, reducedMotion, meters]);

  return (
    <span ref={setEl} className={className} aria-label={`Altitude ${meters} metres`}>
      alt {shown} m
    </span>
  );
};

export default AltitudeReadout;
