import React, { useEffect, useState } from 'react';
import { clamp } from '../lib/scrollMath';
import { useReducedMotion } from '../hooks/useMediaPreferences';

interface DepthGaugeProps {
  /** Resting depth in metres (negative below the surface). */
  toM: number;
  /** Relay start: the previous chapter's resting depth. */
  fromM: number;
}

/** Container fraction where the gauge reaches its resting depth. */
const SETTLE_AT = 0.3;

const formatDepth = (m: number): string => `${m < 0 ? '−' : ''}${Math.abs(m)} m`;

/**
 * The descent continues below the surface: each chapter's depth mark
 * takes the relay from the previous one and sinks to its own resting
 * depth as it scrolls into reading height. The depths scroll in their
 * own container (found via [data-depths-scroller]), so this listens
 * there rather than on the window.
 */
const DepthGauge: React.FC<DepthGaugeProps> = ({ toM, fromM }) => {
  const reducedMotion = useReducedMotion();
  const [el, setEl] = useState<HTMLSpanElement | null>(null);
  const [shown, setShown] = useState(toM);

  useEffect(() => {
    if (reducedMotion || !el) {
      setShown(toM);
      return;
    }
    const scroller = el.closest('[data-depths-scroller]');
    if (!scroller) {
      setShown(toM);
      return;
    }

    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = el.getBoundingClientRect();
      const vh = Math.max(scroller.clientHeight, 1);
      const approach = clamp((rect.top - vh * SETTLE_AT) / (vh * (1 - SETTLE_AT)), 0, 1);
      setShown(toM + Math.round(approach * (fromM - toM)));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    scroller.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      scroller.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      cancelAnimationFrame(frame);
    };
  }, [el, reducedMotion, toM, fromM]);

  return (
    <span ref={setEl} className="tabular-nums" aria-label={`Depth ${Math.abs(toM)} metres`}>
      {formatDepth(shown)}
    </span>
  );
};

export default DepthGauge;
