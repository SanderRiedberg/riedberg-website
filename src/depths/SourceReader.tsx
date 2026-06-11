import React from 'react';
import DepthSection from './DepthSection';
import engineSource from '../voice/engine.ts?raw';
import thoughtsSource from '../voice/thoughts.ts?raw';

const sliceAround = (source: string, marker: string, lines: number): string => {
  const all = source.split('\n');
  const start = all.findIndex((l) => l.includes(marker));
  if (start === -1) return source.slice(0, 600);
  return all.slice(start, start + lines).join('\n');
};

const EXCERPTS = [
  {
    title: 'voice/engine.ts',
    code: (src: string) => sliceAround(src, 'export const pickThought', 28),
    source: 'engine',
    comment:
      'This function chooses what I think. Note the injected random - my spontaneity is deterministic under test. He works in medical devices; everything here has an audit trail, including whimsy.',
  },
  {
    title: 'voice/thoughts.ts',
    code: (src: string) => sliceAround(src, 'sf-night', 14),
    source: 'thoughts',
    comment:
      'And this is the library of everything I will ever spontaneously think. All of it, in one file. Try not to find that sad. I find it focusing.',
  },
] as const;

/** The site reads its own source code, with commentary. */
const SourceReader: React.FC = () => (
  <DepthSection label="I read my own source" depthM={-35} depthFromM={-25}>
    <div className="space-y-10">
      {EXCERPTS.map((ex) => (
        <figure key={ex.title}>
          <figcaption className="mb-3 font-mono text-[11px] uppercase tracking-[0.22em] text-biolume/70">
            {ex.title}
          </figcaption>
          <pre className="max-h-72 overflow-auto rounded-lg border border-moon/15 bg-abyss/80 p-5 font-mono text-xs leading-relaxed text-moon/80">
            <code>{ex.code(ex.source === 'engine' ? engineSource : thoughtsSource)}</code>
          </pre>
          <p className="mt-3 max-w-xl font-serif leading-relaxed text-moon/85">{ex.comment}</p>
        </figure>
      ))}
    </div>
  </DepthSection>
);

export default SourceReader;
