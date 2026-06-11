import { useEffect, useRef, type RefObject } from 'react';
import { subscribeScroll } from '../lib/scrollBus';
import { parallaxOffset } from '../lib/scrollMath';
import { useReducedMotion } from './useMediaPreferences';

/**
 * Subtle parallax drift. Returns a ref to attach; the element's
 * vertical offset is written to the CSS variable `--parallax` (in px)
 * on every scroll frame, so the element's own transform can combine it
 * with whatever centring it already uses:
 *
 *   style={{ transform: 'translateY(var(--parallax, 0))' }}
 *
 * No React re-render per frame - just a style mutation. Disabled under
 * reduced motion (the variable stays at its default 0).
 */
export const useParallax = <T extends HTMLElement = HTMLDivElement>(
  factor: number,
): RefObject<T | null> => {
  const reducedMotion = useReducedMotion();
  const ref = useRef<T>(null);

  useEffect(() => {
    if (reducedMotion) return;
    const el = ref.current;
    if (!el) return;
    const update = () => {
      const rect = el.getBoundingClientRect();
      const offset = parallaxOffset(rect.top, rect.height, window.innerHeight, factor);
      el.style.setProperty('--parallax', `${offset.toFixed(1)}px`);
    };
    return subscribeScroll(update);
  }, [reducedMotion, factor]);

  return ref;
};
