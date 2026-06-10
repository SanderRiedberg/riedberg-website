import { describe, it, expect } from 'vitest';
import { buildVoiceContext } from '../src/voice/context';

const baseDeps = {
  hour: 14,
  weekday: 3,
  visitCount: 1,
  divesCount: 0,
  readingStyle: 'unknown' as const,
  idleSeconds: 0,
  viewportWidth: 1280,
  prefersDark: false,
  reducedMotion: false,
  mode: 'surface' as const,
};

describe('buildVoiceContext', () => {
  it('mappar timme till timeOfDay och bredd till viewport', () => {
    const c = buildVoiceContext(baseDeps);
    expect(c.timeOfDay).toBe('day');
    expect(c.viewport).toBe('desktop');
  });

  it('klassar under 768 px som mobil', () => {
    expect(buildVoiceContext({ ...baseDeps, viewportWidth: 767 }).viewport).toBe(
      'mobile',
    );
    expect(buildVoiceContext({ ...baseDeps, viewportWidth: 768 }).viewport).toBe(
      'desktop',
    );
  });

  it('isReturning kräver mer än ett besök', () => {
    expect(buildVoiceContext(baseDeps).isReturning).toBe(false);
    expect(
      buildVoiceContext({ ...baseDeps, visitCount: 2 }).isReturning,
    ).toBe(true);
  });
});
