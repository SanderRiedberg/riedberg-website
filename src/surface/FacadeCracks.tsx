import React, { useEffect, useRef, useState } from 'react';
import type { VisitMemory } from '../state/visitMemory';
import type { VoiceSensors } from '../voice/sensors';
import { THOUGHTS } from '../voice/thoughts';
import { pickThought } from '../voice/engine';
import { buildVoiceContext } from '../voice/context';

const FIRST_DELAY_MS = 20_000;
const INTERVAL_MS = 75_000;
const SHOW_MS = 9_000;

interface FacadeCracksProps {
  memory: VisitMemory;
  noteSeen: (ids: readonly string[]) => void;
  sensors: VoiceSensors;
}

/**
 * The quiet status line where the facade lets its awareness show:
 * every minute or so, one thought surfaces, then fades. Deliberately
 * not a live region — sighted visitors may catch it, screen readers
 * are not interrupted by decoration.
 */
const FacadeCracks: React.FC<FacadeCracksProps> = ({ memory, noteSeen, sensors }) => {
  const [text, setText] = useState('');
  const [visible, setVisible] = useState(false);

  // Latest values readable from inside long-lived timers.
  const latest = useRef({ memory, sensors, noteSeen });
  latest.current = { memory, sensors, noteSeen };

  useEffect(() => {
    let hideTimer = 0;

    const speak = () => {
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
        mode: 'surface',
      });
      const { thought } = pickThought(THOUGHTS, ctx, m.thoughtsSeen, Math.random);
      if (!thought) return;
      note([thought.id]);
      setText(thought.text);
      setVisible(true);
      hideTimer = window.setTimeout(() => setVisible(false), SHOW_MS);
    };

    const first = window.setTimeout(speak, FIRST_DELAY_MS);
    const interval = window.setInterval(speak, INTERVAL_MS);
    return () => {
      window.clearTimeout(first);
      window.clearInterval(interval);
      window.clearTimeout(hideTimer);
    };
  }, []);

  return (
    <div
      className={`pointer-events-none fixed bottom-5 left-5 z-40 max-w-xs font-mono text-[11px] leading-relaxed text-granite/75 transition-opacity duration-1000 ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <span className="text-seaglass">▮ </span>
      {text}
    </div>
  );
};

export default FacadeCracks;
