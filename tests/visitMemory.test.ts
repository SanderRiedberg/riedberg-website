import { describe, it, expect } from 'vitest';
import {
  loadMemory,
  recordVisit,
  recordDive,
  markSeen,
  saveMemory,
} from '../src/state/visitMemory';

const NOW = '2026-06-10T20:00:00.000Z';
const fakeGet = (value: string | null) => ({ getItem: () => value });

describe('loadMemory', () => {
  it('ger färskt minne när storage är tomt', () => {
    const m = loadMemory(fakeGet(null), NOW);
    expect(m).toEqual({
      version: 1,
      firstVisitIso: NOW,
      visitCount: 0,
      divesCount: 0,
      thoughtsSeen: [],
    });
  });

  it('läser tillbaka ett sparat minne', () => {
    const stored = JSON.stringify({
      version: 1,
      firstVisitIso: '2026-01-01T00:00:00.000Z',
      visitCount: 4,
      divesCount: 2,
      thoughtsSeen: ['a', 'b'],
    });
    const m = loadMemory(fakeGet(stored), NOW);
    expect(m.visitCount).toBe(4);
    expect(m.thoughtsSeen).toEqual(['a', 'b']);
  });

  it('ger färskt minne vid korrupt JSON och vid fel version', () => {
    expect(loadMemory(fakeGet('{nope'), NOW).visitCount).toBe(0);
    expect(loadMemory(fakeGet('{"version":99}'), NOW).visitCount).toBe(0);
  });

  it('ger färskt minne vid fel fälttyper', () => {
    const bad = JSON.stringify({
      version: 1,
      firstVisitIso: 7,
      visitCount: 'many',
      divesCount: null,
      thoughtsSeen: 'abc',
    });
    expect(loadMemory(fakeGet(bad), NOW).visitCount).toBe(0);
  });

  it('ger färskt minne om getItem kastar', () => {
    const throwing = {
      getItem: () => {
        throw new Error('blocked');
      },
    };
    expect(loadMemory(throwing, NOW).visitCount).toBe(0);
  });
});

describe('uppdateringar är immutabla', () => {
  it('recordVisit ökar räknaren utan att mutera', () => {
    const m = loadMemory(fakeGet(null), NOW);
    const m2 = recordVisit(m);
    expect(m2.visitCount).toBe(1);
    expect(m.visitCount).toBe(0);
  });

  it('recordDive ökar divesCount', () => {
    expect(recordDive(loadMemory(fakeGet(null), NOW)).divesCount).toBe(1);
  });

  it('markSeen dedupar', () => {
    const m = markSeen(loadMemory(fakeGet(null), NOW), ['a', 'a', 'b']);
    expect([...m.thoughtsSeen].sort()).toEqual(['a', 'b']);
    expect(markSeen(m, ['a']).thoughtsSeen.length).toBe(2);
  });
});

describe('saveMemory', () => {
  it('sväljer setItem-fel (quota/privat läge)', () => {
    const throwing = {
      setItem: () => {
        throw new Error('quota');
      },
    };
    expect(() =>
      saveMemory(throwing, loadMemory(fakeGet(null), NOW)),
    ).not.toThrow();
  });

  it('skriver JSON som loadMemory kan läsa tillbaka', () => {
    let written = '';
    const storage = {
      setItem: (_k: string, v: string) => {
        written = v;
      },
    };
    const m = markSeen(recordVisit(loadMemory(fakeGet(null), NOW)), ['x']);
    saveMemory(storage, m);
    expect(loadMemory(fakeGet(written), NOW)).toEqual(m);
  });
});
