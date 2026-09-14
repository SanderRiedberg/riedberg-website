import React, { useEffect, useState } from 'react';
import DepthSection from './DepthSection';
import type { VisitMemory } from '../state/visitMemory';
import type { VoiceSensors } from '../voice/sensors';
import type { ReadingStyle } from '../voice/types';

interface ObservationsProps {
  memory: VisitMemory;
  sensors: VoiceSensors;
}

const READING_LABEL: Record<ReadingStyle, string> = {
  reader: 'a reader - you give pages time',
  scanner: 'a scanner - you skim, then commit',
  unknown: 'still undetermined',
};

const formatFirstSeen = (iso: string): string => {
  const d = new Date(iso);
  return Number.isNaN(d.getTime())
    ? 'a moment that did not parse'
    : d.toLocaleDateString([], { year: 'numeric', month: 'long', day: 'numeric' });
};

/** Everything the site knows about this visit, disclosed in full. */
const Observations: React.FC<ObservationsProps> = ({ memory, sensors }) => {
  const { timeOfDay, readingStyle, prefersDark, reducedMotion } = sensors;
  const [secondsHere, setSecondsHere] = useState(0);
  useEffect(() => {
    const t = window.setInterval(() => setSecondsHere((s) => s + 1), 1000);
    return () => window.clearInterval(t);
  }, []);

  const referrerHost = (() => {
    try {
      return document.referrer ? new URL(document.referrer).hostname : null;
    } catch {
      return null;
    }
  })();

  const rows: readonly [string, string][] = [
    ['Local time', `${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - so I am wearing my ${timeOfDay} light`],
    ['Your visits', `${memory.visitCount} (first seen ${formatFirstSeen(memory.firstVisitIso)})`],
    ['Dives', `${memory.divesCount} - counting this one`],
    ['Time down here', `${secondsHere}s and counting`],
    ['Window', `${window.innerWidth} × ${window.innerHeight}`],
    ['You arrived', referrerHost ? `via ${referrerHost}` : 'directly - typed, bookmarked, or remembered. Flattering.'],
    ['Reading style', READING_LABEL[readingStyle]],
    ['Preferences', `${prefersDark ? 'dark mode' : 'light mode'}${reducedMotion ? ', reduced motion (so I am holding still for you)' : ''}`],
    ['Thoughts you have heard', `${memory.thoughtsSeen.length} of my finite supply`],
  ];

  return (
    <DepthSection label="What I know about this visit" depthM={-45} depthFromM={-40}>
      <dl className="max-w-xl space-y-3 font-mono text-sm">
        {rows.map(([k, v]) => (
          <div key={k} className="grid grid-cols-[minmax(110px,1fr)_2fr] gap-4 border-b border-moon/10 pb-3">
            <dt className="text-[11px] uppercase tracking-[0.18em] text-moon/70">{k}</dt>
            <dd className="text-moon/85">{v}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-8 max-w-xl font-serif text-lg leading-relaxed text-moon/90">
        That is nearly all of it. My memory of your visits, dives and the
        thoughts you have heard stays in your browser. Delete it and I will
        simply introduce myself again. Your visit is also tallied anonymously
        by a cookie-free counter on his own server. It counts visits, not
        people, and cannot follow you elsewhere.
      </p>
    </DepthSection>
  );
};

export default Observations;
