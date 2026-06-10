import type { Thought, VoiceContext } from './types';

export interface PickResult {
  thought: Thought | null;
  /** New list; the input is never mutated. */
  seen: readonly string[];
}

const qualifies = (t: Thought, ctx: VoiceContext): boolean => {
  if (!t.when) return true;
  try {
    return t.when(ctx);
  } catch {
    // A broken condition silences that thought, never the whole voice.
    return false;
  }
};

const weightOf = (t: Thought): number =>
  typeof t.weight === 'number' && t.weight > 0 ? t.weight : 1;

const weightedPick = (
  candidates: readonly Thought[],
  random: () => number,
): Thought | null => {
  if (candidates.length === 0) return null;
  const total = candidates.reduce((sum, t) => sum + weightOf(t), 0);
  let target = random() * total;
  for (const t of candidates) {
    target -= weightOf(t);
    if (target < 0) return t;
  }
  return candidates[candidates.length - 1];
};

/**
 * Selects the next thought for the site's voice.
 *
 * Pure and deterministic given (thoughts, ctx, seen, random):
 * - thoughts failing their `when` condition are excluded
 * - `once` thoughts already seen are excluded permanently
 * - unseen thoughts are preferred; if every qualifying thought has
 *   been seen, non-once thoughts may repeat
 * - the final choice is weighted random via the injected `random`
 */
export const pickThought = (
  thoughts: readonly Thought[],
  ctx: VoiceContext,
  seen: readonly string[],
  random: () => number,
): PickResult => {
  const seenSet = new Set(seen);
  const qualifying = thoughts.filter(
    (t) => qualifies(t, ctx) && !(t.once && seenSet.has(t.id)),
  );

  const unseen = qualifying.filter((t) => !seenSet.has(t.id));
  const pool = unseen.length > 0 ? unseen : qualifying;

  const thought = weightedPick(pool, random);
  if (thought === null) return { thought: null, seen };

  return {
    thought,
    seen: seenSet.has(thought.id) ? seen : [...seen, thought.id],
  };
};
