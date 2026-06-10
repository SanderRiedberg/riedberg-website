import { useCallback, useEffect, useRef, useState } from 'react';
import {
  loadMemory,
  markSeen,
  recordDive,
  recordVisit,
  saveMemory,
  type VisitMemory,
} from '../state/visitMemory';

export interface VisitMemoryApi {
  memory: VisitMemory;
  dive: () => void;
  noteSeen: (ids: readonly string[]) => void;
}

/**
 * Owns the site's only long-term memory. Loads from localStorage,
 * counts this visit exactly once (StrictMode double-effects guarded),
 * and persists every change best-effort.
 */
export const useVisitMemory = (): VisitMemoryApi => {
  const [memory, setMemory] = useState<VisitMemory>(() =>
    loadMemory(window.localStorage, new Date().toISOString()),
  );
  const countedRef = useRef(false);

  useEffect(() => {
    if (countedRef.current) return;
    countedRef.current = true;
    setMemory((m) => recordVisit(m));
  }, []);

  useEffect(() => {
    saveMemory(window.localStorage, memory);
  }, [memory]);

  const dive = useCallback(() => setMemory((m) => recordDive(m)), []);
  const noteSeen = useCallback(
    (ids: readonly string[]) => setMemory((m) => markSeen(m, ids)),
    [],
  );

  return { memory, dive, noteSeen };
};
