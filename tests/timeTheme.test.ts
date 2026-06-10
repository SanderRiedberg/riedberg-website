import { describe, it, expect } from 'vitest';
import { timeOfDayFor } from '../src/theme/timeTheme';

describe('timeOfDayFor', () => {
  it.each([
    [4, 'night'],
    [5, 'dawn'],
    [7, 'dawn'],
    [8, 'day'],
    [16, 'day'],
    [17, 'golden'],
    [20, 'golden'],
    [21, 'night'],
    [0, 'night'],
  ] as const)('hour %i -> %s', (hour, expected) => {
    expect(timeOfDayFor(hour)).toBe(expected);
  });

  it('kastar inte på ogiltiga timmar utan klampar till night', () => {
    expect(timeOfDayFor(-1)).toBe('night');
    expect(timeOfDayFor(99)).toBe('night');
  });
});
