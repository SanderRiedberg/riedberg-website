import { describe, it, expect } from 'vitest';
import { THOUGHTS } from '../src/voice/thoughts';

describe('tankebanken', () => {
  it('har unika, stabila id:n', () => {
    const ids = THOUGHTS.map((t) => t.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('har text i varje tanke', () => {
    for (const t of THOUGHTS) {
      expect(t.text.trim().length).toBeGreaterThan(0);
    }
  });

  it('har bara giltiga vikter', () => {
    for (const t of THOUGHTS) {
      if (t.weight !== undefined) expect(t.weight).toBeGreaterThan(0);
    }
  });

  it('inga when-villkor kraschar på en standardkontext', () => {
    const ctx = {
      timeOfDay: 'day',
      weekday: 3,
      visitCount: 1,
      divesCount: 0,
      isReturning: false,
      readingStyle: 'unknown',
      idleSeconds: 0,
      viewport: 'desktop',
      prefersDark: false,
      reducedMotion: false,
      mode: 'surface',
    } as const;
    for (const t of THOUGHTS) {
      expect(() => t.when?.(ctx)).not.toThrow();
    }
  });
});
