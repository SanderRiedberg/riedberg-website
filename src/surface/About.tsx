import React from 'react';
import Section from './Section';
import Reveal from './Reveal';

const CHART_DATA = [
  ['Base', 'Nacka, Stockholm'],
  ['In medtech since', '2016'],
  ['Focus', 'Regulatory strategy · Quality · Product development'],
  ['Background', 'Finland · Belgium · Sweden'],
] as const;

const About: React.FC = () => (
  <Section id="who" index="01" label="Who" altitudeM={21} altitudeFromM={30}>
    <div className="grid gap-12 md:grid-cols-[3fr_2fr]">
      <Reveal className="space-y-6 text-lg leading-relaxed text-granite">
        <p>
          I work where product development meets regulatory strategy. By
          getting involved early, I help teams clarify what they are
          building, establish a sound regulatory foundation and make
          informed trade-offs before they become costly.
        </p>
        <p>
          I tend to ask: What are we actually building - and where is it
          going? I care more about reaching a sound answer than defending
          my first one.
        </p>
        <p>
          Curious by disposition, I can happily lose track of time exploring
          technology, books, cars and whatever subject has caught my
          attention. I appreciate things that are thoughtfully made and
          properly finished - not necessarily perfect.
        </p>
      </Reveal>
      <Reveal index={1} className="h-fit">
        <dl className="space-y-4 border-l border-ink/15 pl-6 font-mono text-xs leading-relaxed">
          {CHART_DATA.map(([k, v]) => (
            <div key={k}>
              <dt className="uppercase tracking-[0.18em] text-granite/80">{k}</dt>
              <dd className="mt-1 text-ink">{v}</dd>
            </div>
          ))}
        </dl>
      </Reveal>
    </div>
  </Section>
);

export default About;
