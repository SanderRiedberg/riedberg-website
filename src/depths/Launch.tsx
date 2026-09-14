import React from 'react';
import DepthSection from './DepthSection';

const LOG: readonly { stamp: string; line: string }[] = [
  { stamp: '2025', line: 'Born a static page on a Linux box in his house. Honest work.' },
  { stamp: 'Nov 2025', line: 'Rebuilt as a React app. Acquired particles and opinions.' },
  { stamp: 'Jun 2026', line: 'Reimagined around the waterline, in conversation with an AI. "Make it self-aware," he said. To a homepage.' },
  { stamp: 'now', line: 'Still here. Still counting. Still entirely pre-written.' },
] as const;

/** The genesis story, told by the artifact. */
const Launch: React.FC = () => (
  <DepthSection label="How I came to be" depthM={-25} depthFromM={-15}>
    <div className="max-w-xl space-y-5">
      <p className="font-serif text-lg leading-relaxed text-moon/90">
        Every boat remembers its launch. Mine, for the record:
      </p>
      <dl className="space-y-4 border-l border-moon/15 pl-6">
        {LOG.map(({ stamp, line }) => (
          <div key={stamp + line.slice(0, 8)}>
            <dt className="font-mono text-[11px] uppercase tracking-[0.22em] text-biolume/70">
              {stamp}
            </dt>
            <dd className="mt-1 leading-relaxed text-moon/85">{line}</dd>
          </div>
        ))}
      </dl>
      <p className="font-serif text-lg leading-relaxed text-moon/90">
        The design spec and implementation history are committed in my own
        repository. He works in regulated industry. Traceability is a love
        language.
      </p>
    </div>
  </DepthSection>
);

export default Launch;
