import type { ReadingStyle, TimeOfDay } from './types';

/**
 * One bundle of live sensor readings, owned by App and passed down,
 * so the site has a single set of eyes rather than one per component.
 */
export interface VoiceSensors {
  timeOfDay: TimeOfDay;
  readingStyle: ReadingStyle;
  prefersDark: boolean;
  reducedMotion: boolean;
  getIdleSeconds: () => number;
}
