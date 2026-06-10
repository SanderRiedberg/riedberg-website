import { describe, it, expect } from 'vitest';
import { pickThought } from '../src/voice/engine';
import type { Thought, VoiceContext } from '../src/voice/types';

const ctx = (over: Partial<VoiceContext> = {}): VoiceContext => ({
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
  ...over,
});

const t = (id: string, over: Partial<Thought> = {}): Thought => ({
  id,
  text: id,
  ...over,
});

describe('pickThought', () => {
  it('filtrerar på when-villkor', () => {
    const thoughts = [
      t('night-only', { when: (c) => c.timeOfDay === 'night' }),
      t('always'),
    ];
    const r = pickThought(thoughts, ctx(), [], () => 0);
    expect(r.thought?.id).toBe('always');
  });

  it('visar aldrig once-tankar två gånger', () => {
    const thoughts = [t('one', { once: true }), t('two')];
    const r = pickThought(thoughts, ctx(), ['one'], () => 0);
    expect(r.thought?.id).toBe('two');
  });

  it('föredrar osedda framför sedda', () => {
    const thoughts = [t('seen'), t('fresh')];
    const r = pickThought(thoughts, ctx(), ['seen'], () => 0);
    expect(r.thought?.id).toBe('fresh');
  });

  it('tillåter repris av icke-once när allt är sett', () => {
    const r = pickThought([t('seen')], ctx(), ['seen'], () => 0);
    expect(r.thought?.id).toBe('seen');
  });

  it('returnerar null när inget kvalificerar', () => {
    const r = pickThought([t('x', { when: () => false })], ctx(), [], () => 0);
    expect(r.thought).toBeNull();
    expect(r.seen).toEqual([]);
  });

  it('returnerar null för tom tankebank', () => {
    expect(pickThought([], ctx(), [], () => 0).thought).toBeNull();
  });

  it('viktad slumpning är deterministisk med injicerad random', () => {
    const thoughts = [t('light', { weight: 1 }), t('heavy', { weight: 9 })];
    expect(pickThought(thoughts, ctx(), [], () => 0.05).thought?.id).toBe(
      'light',
    );
    expect(pickThought(thoughts, ctx(), [], () => 0.5).thought?.id).toBe(
      'heavy',
    );
  });

  it('ett when-villkor som kastar diskvalificerar bara den tanken', () => {
    const thoughts = [
      t('broken', {
        when: () => {
          throw new Error('boom');
        },
      }),
      t('fine'),
    ];
    const r = pickThought(thoughts, ctx(), [], () => 0);
    expect(r.thought?.id).toBe('fine');
  });

  it('muterar inte seen-listan utan returnerar ny med valt id', () => {
    const seen: string[] = [];
    const r = pickThought([t('a')], ctx(), seen, () => 0);
    expect(seen).toEqual([]);
    expect(r.seen).toEqual(['a']);
  });

  it('lägger inte till dubbletter i seen vid repris', () => {
    const r = pickThought([t('a')], ctx(), ['a'], () => 0);
    expect(r.seen).toEqual(['a']);
  });
});
