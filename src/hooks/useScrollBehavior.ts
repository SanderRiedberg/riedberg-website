import { useEffect, useState } from 'react';
import type { ReadingStyle } from '../voice/types';

const CLASSIFY_AFTER_MS = 8_000;
const RECLASSIFY_INTERVAL_MS = 5_000;
const SCANNER_VIEWPORTS_PER_10S = 2.5;

/**
 * Classifies how the visitor moves through the page: a 'scanner'
 * rushes (multiple viewport-heights of scroll in their first
 * seconds), a 'reader' lingers. Stays 'unknown' until there is
 * enough signal to say something honest.
 */
export const useScrollBehavior = (): ReadingStyle => {
  const [style, setStyle] = useState<ReadingStyle>('unknown');

  useEffect(() => {
    const start = Date.now();
    let scrolled = 0;
    let lastY = window.scrollY;

    const onScroll = () => {
      const y = window.scrollY;
      scrolled += Math.abs(y - lastY);
      lastY = y;
    };

    const classify = () => {
      const elapsed = Date.now() - start;
      if (elapsed < CLASSIFY_AFTER_MS) return;
      const viewportsPer10s =
        (scrolled / Math.max(window.innerHeight, 1)) / (elapsed / 10_000);
      setStyle(viewportsPer10s > SCANNER_VIEWPORTS_PER_10S ? 'scanner' : 'reader');
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    const interval = window.setInterval(classify, RECLASSIFY_INTERVAL_MS);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.clearInterval(interval);
    };
  }, []);

  return style;
};
