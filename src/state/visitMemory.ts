export interface VisitMemory {
  version: 1;
  firstVisitIso: string;
  visitCount: number;
  divesCount: number;
  thoughtsSeen: readonly string[];
}

export const STORAGE_KEY = 'riedberg.visitMemory.v1';

const freshMemory = (nowIso: string): VisitMemory => ({
  version: 1,
  firstVisitIso: nowIso,
  visitCount: 0,
  divesCount: 0,
  thoughtsSeen: [],
});

const isStringArray = (value: unknown): value is string[] =>
  Array.isArray(value) && value.every((v) => typeof v === 'string');

const isValidMemory = (value: unknown): value is VisitMemory => {
  if (typeof value !== 'object' || value === null) return false;
  const m = value as Record<string, unknown>;
  return (
    m.version === 1 &&
    typeof m.firstVisitIso === 'string' &&
    typeof m.visitCount === 'number' &&
    typeof m.divesCount === 'number' &&
    isStringArray(m.thoughtsSeen)
  );
};

/**
 * Reads visit memory from storage. Anything unexpected (missing,
 * corrupt, wrong version, storage blocked) degrades to a fresh
 * memory: stored data is a system boundary and is never trusted.
 */
export const loadMemory = (
  storage: Pick<Storage, 'getItem'>,
  nowIso: string,
): VisitMemory => {
  try {
    const raw = storage.getItem(STORAGE_KEY);
    if (raw === null) return freshMemory(nowIso);
    const parsed: unknown = JSON.parse(raw);
    return isValidMemory(parsed) ? parsed : freshMemory(nowIso);
  } catch {
    return freshMemory(nowIso);
  }
};

export const recordVisit = (m: VisitMemory): VisitMemory => ({
  ...m,
  visitCount: m.visitCount + 1,
});

export const recordDive = (m: VisitMemory): VisitMemory => ({
  ...m,
  divesCount: m.divesCount + 1,
});

export const markSeen = (
  m: VisitMemory,
  ids: readonly string[],
): VisitMemory => ({
  ...m,
  thoughtsSeen: [...new Set([...m.thoughtsSeen, ...ids])],
});

/** Persisting memory is best-effort: quota or private mode never throws. */
export const saveMemory = (
  storage: Pick<Storage, 'setItem'>,
  m: VisitMemory,
): void => {
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(m));
  } catch {
    // The site forgets. That is acceptable; crashing is not.
  }
};
