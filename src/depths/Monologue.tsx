import React, { useEffect, useRef, useState } from 'react';
import type { VisitMemory } from '../state/visitMemory';
import type { VoiceSensors } from '../voice/sensors';
import { THOUGHTS } from '../voice/thoughts';
import { pickThought } from '../voice/engine';
import { buildVoiceContext } from '../voice/context';

const THINK_INTERVAL_MS = 8_000;
const TYPE_SPEED_MS = 28;
const KEEP_THOUGHTS = 6;

interface Entry {
  id: string;
  stamp: string;
  text: string;
}

interface MonologueProps {
  memory: VisitMemory;
  noteSeen: (ids: readonly string[]) => void;
  sensors: VoiceSensors;
}

const timestamp = () =>
  new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

/**
 * The live thought stream. A new thought surfaces every few seconds,
 * typed out character by character (instantly under reduced motion).
 */
const Monologue: React.FC<MonologueProps> = ({ memory, noteSeen, sensors }) => {
  const [entries, setEntries] = useState<readonly Entry[]>([]);
  const [typedChars, setTypedChars] = useState(0);

  const latest = useRef({ memory, sensors, noteSeen });
  latest.current = { memory, sensors, noteSeen };

  useEffect(() => {
    const think = () => {
      const { memory: m, sensors: s, noteSeen: note } = latest.current;
      const ctx = buildVoiceContext({
        hour: new Date().getHours(),
        weekday: new Date().getDay(),
        visitCount: m.visitCount,
        divesCount: m.divesCount,
        readingStyle: s.readingStyle,
        idleSeconds: s.getIdleSeconds(),
        viewportWidth: window.innerWidth,
        prefersDark: s.prefersDark,
        reducedMotion: s.reducedMotion,
        mode: 'below',
      });
      const { thought } = pickThought(THOUGHTS, ctx, m.thoughtsSeen, Math.random);
      if (!thought) return;
      note([thought.id]);
      setEntries((prev) =>
        [...prev, { id: `${thought.id}-${prev.length}`, stamp: timestamp(), text: thought.text }].slice(
          -KEEP_THOUGHTS,
        ),
      );
      setTypedChars(0);
    };

    think();
    const interval = window.setInterval(think, THINK_INTERVAL_MS);
    return () => window.clearInterval(interval);
  }, []);

  const newest = entries[entries.length - 1];
  const newestDone =
    !newest || latest.current.sensors.reducedMotion || typedChars >= newest.text.length;

  useEffect(() => {
    if (newestDone) return;
    const t = window.setInterval(
      () => setTypedChars((n) => n + 1),
      TYPE_SPEED_MS,
    );
    return () => window.clearInterval(t);
  }, [newest?.id, newestDone]);

  return (
    <div className="space-y-4 font-mono text-sm leading-relaxed">
      {entries.map((e, i) => {
        const isNewest = i === entries.length - 1;
        const text =
          isNewest && !newestDone ? e.text.slice(0, typedChars) : e.text;
        const age = entries.length - 1 - i;
        return (
          <p key={e.id} style={{ opacity: 1 - age * 0.13 }}>
            <span className="mr-3 text-moon/40">{e.stamp}</span>
            <span className="text-biolume/90">{text}</span>
            {isNewest && !newestDone && (
              <span className="anim-caret text-biolume">▍</span>
            )}
          </p>
        );
      })}
    </div>
  );
};

export default Monologue;
