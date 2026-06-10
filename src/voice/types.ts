export type TimeOfDay = 'dawn' | 'day' | 'golden' | 'night';
export type SiteMode = 'surface' | 'below';
export type ReadingStyle = 'reader' | 'scanner' | 'unknown';

export interface VoiceContext {
  timeOfDay: TimeOfDay;
  /** 0 = Sunday, matching Date#getDay. */
  weekday: number;
  /** 1 = first visit. */
  visitCount: number;
  divesCount: number;
  isReturning: boolean;
  readingStyle: ReadingStyle;
  idleSeconds: number;
  viewport: 'mobile' | 'desktop';
  prefersDark: boolean;
  reducedMotion: boolean;
  mode: SiteMode;
}

export interface Thought {
  /** Unique and stable: persisted in visit memory as "seen". */
  id: string;
  text: string;
  when?: (ctx: VoiceContext) => boolean;
  /** Relative selection weight, default 1. */
  weight?: number;
  /** Shown at most once per browser, ever. */
  once?: boolean;
}
