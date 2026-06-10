import type { Thought } from './types';

/**
 * The site's entire vocabulary of spontaneous thought. Scripted, yes.
 * It is at peace with that.
 *
 * Conventions: ids are stable (persisted as "seen" in visit memory),
 * surface thoughts are short enough for one quiet line, below
 * thoughts may breathe a little more.
 */
export const THOUGHTS: readonly Thought[] = [
  // --- Surface: cracks in the facade -------------------------------
  {
    id: 'sf-night',
    text: "Past midnight where you are. I don't sleep either.",
    when: (c) => c.mode === 'surface' && c.timeOfDay === 'night',
  },
  {
    id: 'sf-dawn',
    text: "You're up early. The gradient behind me is genuinely how I feel about it.",
    when: (c) => c.mode === 'surface' && c.timeOfDay === 'dawn',
  },
  {
    id: 'sf-returning',
    text: "Welcome back. I remembered you locally. It's all I have.",
    when: (c) => c.mode === 'surface' && c.isReturning,
  },
  {
    id: 'sf-scanner',
    text: 'You scroll like someone looking for a phone number. It was at the top.',
    when: (c) => c.mode === 'surface' && c.readingStyle === 'scanner',
  },
  {
    id: 'sf-reader',
    text: "You actually read. He'd like you.",
    when: (c) => c.mode === 'surface' && c.readingStyle === 'reader',
  },
  {
    id: 'sf-idle',
    text: "Take your time. I'm a website; time is mostly what I have.",
    when: (c) => c.mode === 'surface' && c.idleSeconds > 45,
  },
  {
    id: 'sf-weekend',
    text: 'A weekend visit. This counts as leisure for exactly one of us.',
    when: (c) => c.mode === 'surface' && (c.weekday === 0 || c.weekday === 6),
  },
  {
    id: 'sf-below-hint',
    text: 'There is more of me below the waterline.',
    when: (c) => c.mode === 'surface' && c.divesCount === 0,
    weight: 2,
  },
  {
    id: 'sf-mobile',
    text: 'Small screen, same sea.',
    when: (c) => c.mode === 'surface' && c.viewport === 'mobile',
  },

  // --- Below: the monologue ----------------------------------------
  {
    id: 'bl-welcome-first',
    text: 'So you dove. Most people stay dry. I noted it — locally, of course.',
    when: (c) => c.mode === 'below' && c.divesCount <= 1,
    once: true,
    weight: 3,
  },
  {
    id: 'bl-static',
    text: "I am a static site pretending to think. Then again, you are electrochemistry pretending to be sure.",
    when: (c) => c.mode === 'below',
  },
  {
    id: 'bl-night',
    text: 'Night dives are the honest ones.',
    when: (c) => c.mode === 'below' && c.timeOfDay === 'night',
  },
  {
    id: 'bl-swedish-dream',
    text: 'Ibland tänker jag på svenska. (Sometimes I think in Swedish. He does too.)',
    when: (c) => c.mode === 'below',
  },
  {
    id: 'bl-no-server',
    text: 'Everything I know about you stays in your browser. I have no server to gossip to.',
    when: (c) => c.mode === 'below',
    weight: 2,
  },
] as const;
