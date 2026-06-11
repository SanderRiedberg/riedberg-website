import { useEffect, useRef, useState, type RefObject } from 'react';
import { useReducedMotion } from './useMediaPreferences';

interface RevealOptions {
  /** Fraction of the element visible before it counts as revealed. */
  threshold?: number;
  /** Shrink the viewport from the bottom so reveals fire a touch early. */
  rootMargin?: string;
}

/**
 * Reveals an element once, when it scrolls into view. Returns a ref to
 * attach and a boolean that flips to true and stays true. Under
 * reduced motion it starts revealed, so nothing depends on motion to
 * become visible.
 */
export const useReveal = <T extends HTMLElement = HTMLDivElement>(
  options: RevealOptions = {},
): { ref: RefObject<T | null>; revealed: boolean } => {
  const reducedMotion = useReducedMotion();
  const ref = useRef<T>(null);
  const [revealed, setRevealed] = useState(reducedMotion);

  useEffect(() => {
    if (reducedMotion) {
      setRevealed(true);
      return;
    }
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === 'undefined') {
      setRevealed(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setRevealed(true);
          observer.disconnect();
        }
      },
      {
        threshold: options.threshold ?? 0.15,
        rootMargin: options.rootMargin ?? '0px 0px -10% 0px',
      },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [reducedMotion, options.threshold, options.rootMargin]);

  return { ref, revealed };
};
