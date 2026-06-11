import React, { useEffect, useRef, useState } from 'react';
import { useReveal } from '../hooks/useReveal';
import { useReducedMotion } from '../hooks/useMediaPreferences';

interface AltitudeReadoutProps {
  /** Target altitude in metres; the readout settles here. */
  meters: number;
  className?: string;
}

const TICK_MS = 55;

/**
 * An altimeter that settles to its value when scrolled into view -
 * counting down the last several metres, the way the page descends
 * toward sea level. Under reduced motion it simply shows the number.
 */
const AltitudeReadout: React.FC<AltitudeReadoutProps> = ({ meters, className = '' }) => {
  const reducedMotion = useReducedMotion();
  const { ref, revealed } = useReveal<HTMLSpanElement>();
  const [shown, setShown] = useState(reducedMotion ? meters : meters + 8);
  const started = useRef(false);

  useEffect(() => {
    if (reducedMotion || !revealed || started.current) {
      if (reducedMotion) setShown(meters);
      return;
    }
    started.current = true;
    let current = meters + 8;
    const timer = window.setInterval(() => {
      current -= 1;
      if (current <= meters) {
        current = meters;
        window.clearInterval(timer);
      }
      setShown(current);
    }, TICK_MS);
    return () => window.clearInterval(timer);
  }, [revealed, reducedMotion, meters]);

  return (
    <span ref={ref} className={className} aria-label={`Altitude ${meters} metres`}>
      alt {shown} m
    </span>
  );
};

export default AltitudeReadout;
