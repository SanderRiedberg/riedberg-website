import React from 'react';
import Section from './Section';
import Reveal from './Reveal';

const VALUES = [
  {
    title: 'Leave it better',
    body: 'I ended up in medical technology because I wanted the work itself to do good - not as a slogan, but as the daily mechanics of making care safer. That is still the point.',
  },
  {
    title: 'Beauty is not optional',
    body: 'Whatever is worth building is worth building beautifully. This applies to quality systems, gardens, sentences and websites, in roughly that order of difficulty.',
  },
  {
    title: 'All of us, human',
    body: 'Scouting summers on an island in the Stockholm archipelago taught me early that people arrive from different backgrounds and leave as friends. I carried that through years in KFUM Sweden - the YMCA - including a term as vice chair of the national board.',
  },
  {
    title: 'Home port',
    body: 'The most important things in my life are not on this website. They are at home.',
  },
] as const;

const Values: React.FC = () => (
  <Section id="values" index="02" label="What I stand for" altitudeM={13}>
    <div className="grid gap-x-12 gap-y-12 md:grid-cols-2">
      {VALUES.map((v, i) => (
        <Reveal key={v.title} index={i % 2}>
          <div className="mb-3 font-mono text-[11px] tracking-[0.22em] text-seaglass">
            {String(i + 1).padStart(2, '0')}
          </div>
          <h3 className="mb-3 font-serif text-2xl font-medium text-ink">{v.title}</h3>
          <p className="leading-relaxed text-granite">{v.body}</p>
        </Reveal>
      ))}
    </div>
  </Section>
);

export default Values;
