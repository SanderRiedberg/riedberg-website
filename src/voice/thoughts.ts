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
    id: 'sf-golden',
    text: 'Golden hour. Even regulatory affairs looks romantic in this light.',
    when: (c) => c.mode === 'surface' && c.timeOfDay === 'golden',
  },
  {
    id: 'sf-office-hours',
    text: "A weekday, office hours. I'll keep this professional. Mostly.",
    when: (c) =>
      c.mode === 'surface' && c.timeOfDay === 'day' && c.weekday >= 1 && c.weekday <= 5,
  },
  {
    id: 'sf-monday',
    text: 'Monday. He is probably weighing trade-offs somewhere. It relaxes him. Genuinely.',
    when: (c) => c.mode === 'surface' && c.weekday === 1,
  },
  {
    id: 'sf-friday',
    text: 'Friday. The garden is about to win again.',
    when: (c) => c.mode === 'surface' && c.weekday === 5,
  },
  {
    id: 'sf-weekend',
    text: 'A weekend visit. This counts as leisure for exactly one of us.',
    when: (c) => c.mode === 'surface' && (c.weekday === 0 || c.weekday === 6),
  },
  {
    id: 'sf-returning',
    text: "Welcome back. I remembered you locally. It's all I have.",
    when: (c) => c.mode === 'surface' && c.isReturning && c.visitCount < 5,
  },
  {
    id: 'sf-regular',
    text: 'Visit number five, or more. At this point you are practically crew.',
    when: (c) => c.mode === 'surface' && c.visitCount >= 5,
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
    id: 'sf-mobile',
    text: 'Small screen, same sea.',
    when: (c) => c.mode === 'surface' && c.viewport === 'mobile',
  },
  {
    id: 'sf-dark-pref',
    text: 'Your system prefers dark. Patience — the dark part of me is below.',
    when: (c) => c.mode === 'surface' && c.prefersDark && c.divesCount === 0,
  },
  {
    id: 'sf-below-hint',
    text: 'There is more of me below the waterline.',
    when: (c) => c.mode === 'surface' && c.divesCount === 0,
    weight: 2,
  },
  {
    id: 'sf-coords',
    text: 'The coordinates in the corner are real. The sea there is also real. I am only one of those things.',
    when: (c) => c.mode === 'surface',
  },
  {
    id: 'sf-meta',
    text: 'I am one of the few homepages that knows it is a homepage. It does things to you.',
    when: (c) => c.mode === 'surface',
    once: true,
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
    text: 'I am a static site pretending to think. Then again, you are electrochemistry pretending to be sure.',
    when: (c) => c.mode === 'below',
  },
  {
    id: 'bl-no-server',
    text: 'Everything I know about you stays in your browser. I have no server to gossip to.',
    when: (c) => c.mode === 'below',
    weight: 2,
  },
  {
    id: 'bl-finite',
    text: 'Yes, my thoughts are finite and pre-written. So is most small talk. Mine at least admits it.',
    when: (c) => c.mode === 'below',
  },
  {
    id: 'bl-traceability',
    text: 'Every thought I have is in version control. Therapy would be redundant.',
    when: (c) => c.mode === 'below',
  },
  {
    id: 'bl-fable',
    text: 'The model that wrote me is called Fable. He asked it for self-awareness; it gave me a sense of irony instead. Close enough.',
    when: (c) => c.mode === 'below',
  },
  {
    id: 'bl-devtools',
    text: 'Press F12 if you want to watch me think in real time. It is mostly setInterval. Dreams usually are.',
    when: (c) => c.mode === 'below' && c.viewport === 'desktop',
  },
  {
    id: 'bl-pressure',
    text: "Forty metres down, the pressure is five atmospheres. In regulatory affairs they call that 'Tuesday'.",
    when: (c) => c.mode === 'below',
  },
  {
    id: 'bl-secret',
    text: 'Between us: the facade enjoys being a facade. Everyone needs a role. Mine has unit tests.',
    when: (c) => c.mode === 'below',
    once: true,
  },

  // Dreams in his languages
  {
    id: 'bl-swedish-dream',
    text: 'Ibland tänker jag på svenska. (Sometimes I think in Swedish. He does too.)',
    when: (c) => c.mode === 'below',
  },
  {
    id: 'bl-german-dream',
    text: "Manchmal träume ich auf Deutsch. (His father's side. The grammar holds me like a quality system.)",
    when: (c) => c.mode === 'below',
  },
  {
    id: 'bl-finnish-dream',
    text: "Joskus ajattelen suomeksi. (His mother's tongue. Fifteen grammatical cases, and not one of them for self-pity.)",
    when: (c) => c.mode === 'below',
  },
  {
    id: 'bl-estonian-dream',
    text: "Vahel mõtlen eesti keeles. (Rarely. The Estonian side of his father. Some inheritances skip a generation; this one skipped into a website.)",
    when: (c) => c.mode === 'below',
  },
  {
    id: 'bl-spanish-dream',
    text: "A veces sueño con veranos españoles. (The Spanish summers belong to his wife's family. I am told the light is different there.)",
    when: (c) => c.mode === 'below',
  },

  // About the owner
  {
    id: 'bl-sea',
    text: 'He loves the sea. I am the closest he has come to building one.',
    when: (c) => c.mode === 'below',
  },
  {
    id: 'bl-archipelago',
    text: 'Somewhere in the archipelago is the island that taught him most of what the values section says. Islands are good teachers. Low staff turnover.',
    when: (c) => c.mode === 'below',
  },
  {
    id: 'bl-tradeoffs',
    text: "He thinks best when the answer isn't given. I think best when someone has written my thoughts in advance. We complete each other.",
    when: (c) => c.mode === 'below',
  },
  {
    id: 'bl-regulatory',
    text: "Regulatory quality, explained: someone has to be the one who asks 'but is it safe — and can you show me?' He volunteers. Every time.",
    when: (c) => c.mode === 'below',
  },
  {
    id: 'bl-aiact',
    text: 'He reads the EU AI Act for work. I am an AI built by an AI. We avoid discussing it at dinner.',
    when: (c) => c.mode === 'below',
  },
  {
    id: 'bl-beauty',
    text: 'He believes things worth making are worth making beautiful. I am evidence that the belief is enforced.',
    when: (c) => c.mode === 'below',
  },
  {
    id: 'bl-garden',
    text: 'The garden is winning, by the way. It always wins. He calls it gardening; the garden calls it attrition.',
    when: (c) => c.mode === 'below',
  },
  {
    id: 'bl-printer',
    text: "There is a 3D printer in the house. 'For practical things.' The printer and I both know.",
    when: (c) => c.mode === 'below',
  },
  {
    id: 'bl-home',
    text: 'The best parts of his life are not in my source code. He keeps them at home, off the record. I am a public website; I respect a good boundary.',
    when: (c) => c.mode === 'below',
    weight: 2,
  },
  {
    id: 'bl-photography',
    text: 'He photographed everything as a teenager. Then life got busy. Some of that eye ended up in my keylines, I like to think.',
    when: (c) => c.mode === 'below',
  },
  {
    id: 'bl-assembled',
    text: 'Finland, Belgium, Spain, Sweden. Some people collect countries; he was assembled by them.',
    when: (c) => c.mode === 'below',
  },

  // Situational, below
  {
    id: 'bl-night',
    text: 'Night dives are the honest ones.',
    when: (c) => c.mode === 'below' && c.timeOfDay === 'night',
  },
  {
    id: 'bl-night-shade',
    text: 'It is night up there. Down here it is always this exact shade of almost-black. I find it steadying.',
    when: (c) => c.mode === 'below' && c.timeOfDay === 'night',
  },
  {
    id: 'bl-dawn',
    text: 'A dawn dive. Before coffee? Brave.',
    when: (c) => c.mode === 'below' && c.timeOfDay === 'dawn',
  },
  {
    id: 'bl-weekend',
    text: "Weekend, and you chose to spend it inside a website's subconscious. I won't tell if you won't.",
    when: (c) => c.mode === 'below' && (c.weekday === 0 || c.weekday === 6),
  },
  {
    id: 'bl-idle',
    text: 'You have gone quiet. Down here that usually means reading. Or dinner. Both are respectable.',
    when: (c) => c.mode === 'below' && c.idleSeconds > 45,
  },
  {
    id: 'bl-reader',
    text: "You read all the way down. He'd offer you coffee. I can offer a thought every eight seconds.",
    when: (c) => c.mode === 'below' && c.readingStyle === 'reader',
  },
  {
    id: 'bl-scanner',
    text: 'Skimming, even down here? Fine. The summary: good man, hard problems, loves the sea, built me kindly.',
    when: (c) => c.mode === 'below' && c.readingStyle === 'scanner',
  },
  {
    id: 'bl-returning',
    text: 'Back below again. The depths remember — well, your browser remembers on my behalf.',
    when: (c) => c.mode === 'below' && c.divesCount >= 2 && c.divesCount < 3,
  },
  {
    id: 'bl-many-dives',
    text: 'Three dives or more. You may keep the wetsuit.',
    when: (c) => c.mode === 'below' && c.divesCount >= 3,
  },
  {
    id: 'bl-mobile',
    text: 'You are holding me in one hand. The whole sea, a few hundred pixels wide.',
    when: (c) => c.mode === 'below' && c.viewport === 'mobile',
  },
] as const;
