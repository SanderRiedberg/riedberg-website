import { useEffect, useRef, useState, type RefObject } from 'react';
import { subscribeScroll } from '../lib/scrollBus';
import { elementProgress } from '../lib/scrollMath';
import { useReducedMotion } from './useMediaPreferences';

/**
 * Tracks how far a tall element has been scrolled through, 0..1, for
 * scroll-scrubbed scenes (the pinned waterline). Quantised to coarse
 * steps so it re-renders a few dozen times across the whole scroll,
 * not once per pixel.
 *
 * Returns `null` under reduced motion: the caller should then render a
 * static, non-scrubbed version.
 */
export const useElementProgress = <T extends HTMLElement = HTMLDivElement>(
  steps = 200,
): { ref: RefObject<T | null>; progress: number | null } => {
  const reducedMotion = useReducedMotion();
  const ref = useRef<T>(null);
  const [progress, setProgress] = useState<number | null>(reducedMotion ? null : 0);

  useEffect(() => {
    if (reducedMotion) {
      setProgress(null);
      return;
    }
    const el = ref.current;
    if (!el) return;
    let last = -1;
    const update = () => {
      const rect = el.getBoundingClientRect();
      const raw = elementProgress(rect.top, el.offsetHeight, window.innerHeight);
      const quantised = Math.round(raw * steps) / steps;
      if (quantised !== last) {
        last = quantised;
        setProgress(quantised);
      }
    };
    return subscribeScroll(update);
  }, [reducedMotion, steps]);

  return { ref, progress };
};
