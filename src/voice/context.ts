import type { ReadingStyle, SiteMode, VoiceContext } from './types';
import { timeOfDayFor } from '../theme/timeTheme';

export const MOBILE_BREAKPOINT = 768;

export interface ContextDeps {
  hour: number;
  weekday: number;
  visitCount: number;
  divesCount: number;
  readingStyle: ReadingStyle;
  idleSeconds: number;
  viewportWidth: number;
  prefersDark: boolean;
  reducedMotion: boolean;
  mode: SiteMode;
}

/** Pure mapping from primitive sensor readings to the voice's context. */
export const buildVoiceContext = (deps: ContextDeps): VoiceContext => ({
  timeOfDay: timeOfDayFor(deps.hour),
  weekday: deps.weekday,
  visitCount: deps.visitCount,
  divesCount: deps.divesCount,
  isReturning: deps.visitCount > 1,
  readingStyle: deps.readingStyle,
  idleSeconds: deps.idleSeconds,
  viewport: deps.viewportWidth < MOBILE_BREAKPOINT ? 'mobile' : 'desktop',
  prefersDark: deps.prefersDark,
  reducedMotion: deps.reducedMotion,
  mode: deps.mode,
});
