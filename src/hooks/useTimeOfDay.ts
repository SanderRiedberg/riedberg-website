import { useEffect, useState } from 'react';
import type { TimeOfDay } from '../voice/types';
import { timeOfDayFor } from '../theme/timeTheme';

const VALID: readonly TimeOfDay[] = ['dawn', 'day', 'golden', 'night'];

/**
 * Hidden developer override: ?t=dawn|day|golden|night freezes the
 * light. Harmless in production, invaluable for verifying themes.
 */
const overrideFromUrl = (): TimeOfDay | null => {
  try {
    const t = new URLSearchParams(window.location.search).get('t');
    return VALID.includes(t as TimeOfDay) ? (t as TimeOfDay) : null;
  } catch {
    return null;
  }
};

export const useTimeOfDay = (): TimeOfDay => {
  const [time, setTime] = useState<TimeOfDay>(
    () => overrideFromUrl() ?? timeOfDayFor(new Date().getHours()),
  );

  useEffect(() => {
    if (overrideFromUrl()) return;
    const tick = () => setTime(timeOfDayFor(new Date().getHours()));
    const interval = window.setInterval(tick, 60_000);
    return () => window.clearInterval(interval);
  }, []);

  return time;
};
