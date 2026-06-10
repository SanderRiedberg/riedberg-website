import type { TimeOfDay } from '../voice/types';

const DAWN_START = 5;
const DAY_START = 8;
const GOLDEN_START = 17;
const NIGHT_START = 21;

/**
 * Maps a local hour (0-23) to the site's light theme.
 * Out-of-range input degrades to 'night' rather than throwing:
 * the sky should never crash.
 */
export const timeOfDayFor = (hour: number): TimeOfDay => {
  if (!Number.isFinite(hour) || hour < 0 || hour > 23) return 'night';
  if (hour >= NIGHT_START || hour < DAWN_START) return 'night';
  if (hour < DAY_START) return 'dawn';
  if (hour < GOLDEN_START) return 'day';
  return 'golden';
};
