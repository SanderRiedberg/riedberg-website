import { useCallback, useEffect, useRef } from 'react';

const ACTIVITY_EVENTS = ['pointermove', 'pointerdown', 'keydown', 'scroll', 'touchstart'] as const;

/**
 * Tracks user inactivity without causing re-renders: consumers pull
 * the current idle time when they need it (e.g. on a thought tick).
 */
export const useIdle = (): { getIdleSeconds: () => number } => {
  const lastActivityRef = useRef(Date.now());

  useEffect(() => {
    const onActivity = () => {
      lastActivityRef.current = Date.now();
    };
    ACTIVITY_EVENTS.forEach((e) =>
      window.addEventListener(e, onActivity, { passive: true }),
    );
    return () =>
      ACTIVITY_EVENTS.forEach((e) => window.removeEventListener(e, onActivity));
  }, []);

  const getIdleSeconds = useCallback(
    () => Math.floor((Date.now() - lastActivityRef.current) / 1000),
    [],
  );

  return { getIdleSeconds };
};
