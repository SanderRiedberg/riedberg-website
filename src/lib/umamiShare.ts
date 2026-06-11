/**
 * Read-only access to the site's own Umami instance via its public
 * share token. No cookies, no identification - the same numbers anyone
 * with the share link can see.
 *
 * To activate: enable "Share URL" for the website in Umami and put the
 * id from https://analytics.riedberg.se/share/{SHARE_ID}/... here.
 */
export const SHARE_ID = '';

const BASE = 'https://analytics.riedberg.se';

export interface TallyStats {
  pageviews: number;
  visitors: number;
  visitorsToday: number;
}

interface ShareGrant {
  websiteId: string;
  token: string;
}

const asCount = (value: unknown): number | null => {
  if (typeof value === 'number' && Number.isFinite(value) && value >= 0) {
    return value;
  }
  // Umami v2 wraps stat values as { value, prev }.
  if (typeof value === 'object' && value !== null) {
    const inner = (value as Record<string, unknown>).value;
    if (typeof inner === 'number' && Number.isFinite(inner) && inner >= 0) {
      return inner;
    }
  }
  return null;
};

/** Pure: extracts { pageviews, visitors } from an untrusted stats body. */
export const parseStats = (
  body: unknown,
): { pageviews: number; visitors: number } | null => {
  if (typeof body !== 'object' || body === null) return null;
  const b = body as Record<string, unknown>;
  const pageviews = asCount(b.pageviews);
  const visitors = asCount(b.visitors);
  if (pageviews === null || visitors === null) return null;
  return { pageviews, visitors };
};

/** Pure: extracts the share grant from an untrusted share body. */
export const parseShareGrant = (body: unknown): ShareGrant | null => {
  if (typeof body !== 'object' || body === null) return null;
  const b = body as Record<string, unknown>;
  if (typeof b.id === 'string' && typeof b.token === 'string') {
    return { websiteId: b.id, token: b.token };
  }
  return null;
};

const getJson = async (url: string, token?: string): Promise<unknown> => {
  const res = await fetch(url, {
    headers: token ? { 'x-umami-share-token': token } : {},
  });
  if (!res.ok) throw new Error(`umami ${res.status}`);
  return res.json();
};

/**
 * Fetches all-time and today's tallies. Returns null on any failure -
 * the counting house simply goes off duty; it never breaks the page.
 */
export const fetchTallies = async (
  shareId: string,
  now: Date = new Date(),
): Promise<TallyStats | null> => {
  try {
    const grant = parseShareGrant(await getJson(`${BASE}/api/share/${shareId}`));
    if (!grant) return null;

    const endAt = now.getTime();
    const midnight = new Date(now);
    midnight.setHours(0, 0, 0, 0);

    const statsUrl = (startAt: number) =>
      `${BASE}/api/websites/${grant.websiteId}/stats?startAt=${startAt}&endAt=${endAt}`;

    const [allTime, today] = await Promise.all([
      getJson(statsUrl(0), grant.token),
      getJson(statsUrl(midnight.getTime()), grant.token),
    ]);
    const all = parseStats(allTime);
    const day = parseStats(today);
    if (!all || !day) return null;

    return {
      pageviews: all.pageviews,
      visitors: all.visitors,
      visitorsToday: day.visitors,
    };
  } catch {
    return null;
  }
};
