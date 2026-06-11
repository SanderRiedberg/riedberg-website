import React, { useEffect, useState } from 'react';
import { useReducedMotion } from '../hooks/useMediaPreferences';

interface OdometerProps {
  value: number;
  /** Minimum number of wheels, zero-padded like real hardware. */
  minDigits?: number;
}

const DIGIT_STRIP = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

/**
 * A mechanical counter: one vertical digit strip per wheel, rolled into
 * place with a transition. On mount it rolls up from zero; reduced
 * motion shows the figure immediately.
 */
const Odometer: React.FC<OdometerProps> = ({ value, minDigits = 5 }) => {
  const reducedMotion = useReducedMotion();
  const [shown, setShown] = useState(reducedMotion ? value : 0);

  useEffect(() => {
    if (reducedMotion) {
      setShown(value);
      return;
    }
    // Let the wheels rest at zero for a beat before rolling up.
    const t = window.setTimeout(() => setShown(value), 400);
    return () => window.clearTimeout(t);
  }, [value, reducedMotion]);

  const digits = String(Math.max(0, Math.floor(shown))).padStart(minDigits, '0').split('');

  return (
    <span
      className="inline-flex gap-[3px] rounded-md border border-sun/30 bg-abyss/80 p-[5px]"
      role="img"
      aria-label={String(value)}
    >
      {digits.map((d, i) => (
        <span
          key={`${digits.length}-${i}`}
          className="relative inline-block h-[1.4em] w-[0.95em] overflow-hidden rounded-[3px] bg-deep font-mono text-sun"
          aria-hidden="true"
        >
          <span
            className="absolute left-0 top-0 flex w-full flex-col items-center leading-[1.4em]"
            style={{
              transform: `translateY(-${Number(d) * 1.4}em)`,
              transition: 'transform 2.6s cubic-bezier(0.25, 0.8, 0.3, 1)',
            }}
          >
            {DIGIT_STRIP.map((n) => (
              <span key={n}>{n}</span>
            ))}
          </span>
        </span>
      ))}
    </span>
  );
};

export default Odometer;
