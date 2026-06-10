import { useEffect, useState } from 'react';

const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState(() => {
    try {
      return window.matchMedia(query).matches;
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      const mql = window.matchMedia(query);
      const onChange = (e: MediaQueryListEvent) => setMatches(e.matches);
      mql.addEventListener('change', onChange);
      return () => mql.removeEventListener('change', onChange);
    } catch {
      return undefined;
    }
  }, [query]);

  return matches;
};

export const useReducedMotion = (): boolean =>
  useMediaQuery('(prefers-reduced-motion: reduce)');

export const usePrefersDark = (): boolean =>
  useMediaQuery('(prefers-color-scheme: dark)');
