import { describe, it, expect } from 'vitest';
import { parseStats, parseShareGrant } from '../src/lib/umamiShare';

describe('parseStats', () => {
  it('läser umami v2-format ({ value, prev })', () => {
    const body = {
      pageviews: { value: 123, prev: 50 },
      visitors: { value: 45, prev: 20 },
    };
    expect(parseStats(body)).toEqual({ pageviews: 123, visitors: 45 });
  });

  it('läser släta tal', () => {
    expect(parseStats({ pageviews: 7, visitors: 3 })).toEqual({
      pageviews: 7,
      visitors: 3,
    });
  });

  it.each([
    [null],
    ['sträng'],
    [{}],
    [{ pageviews: { value: -1 }, visitors: { value: 2 } }],
    [{ pageviews: { value: NaN }, visitors: { value: 2 } }],
    [{ pageviews: 'många', visitors: 2 }],
  ])('förkastar otillförlitliga kroppar: %j', (body) => {
    expect(parseStats(body)).toBeNull();
  });
});

describe('parseShareGrant', () => {
  it('läser id + token', () => {
    expect(parseShareGrant({ id: 'abc', token: 't0k' })).toEqual({
      websiteId: 'abc',
      token: 't0k',
    });
  });

  it('förkastar ofullständiga svar', () => {
    expect(parseShareGrant({ id: 'abc' })).toBeNull();
    expect(parseShareGrant(null)).toBeNull();
    expect(parseShareGrant({ id: 1, token: 't' })).toBeNull();
  });
});
