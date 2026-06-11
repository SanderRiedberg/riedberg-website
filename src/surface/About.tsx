import React from 'react';
import Section from './Section';
import Reveal from './Reveal';

const CHART_DATA = [
  ['Base', 'Nacka, Stockholm'],
  ['In medtech since', '2016'],
  ['Frameworks', 'ISO 13485 · PRRC · EU MDR · EU AI Act'],
  ['Roots', 'Finland · Belgium · Spain'],
] as const;

const About: React.FC = () => (
  <Section id="who" index="01" label="Who" altitudeM={21} altitudeFromM={30}>
    <div className="grid gap-12 md:grid-cols-[3fr_2fr]">
      <Reveal className="space-y-6 text-lg leading-relaxed text-granite">
        <p>
          I have spent my working life where medical technology meets the
          rules that keep it honest: regulatory strategy, quality systems,
          ISO 13485, PRRC duties, and lately the EU AI Act. The work I
          love has many dimensions and no given answer - you weigh safety
          against speed, evidence against ambition, and you get to be
          precise about all of it.
        </p>
        <p>
          I grew up European: a German-Estonian father, a Finnish mother,
          childhood years in Finland and Belgium, and a second home in
          Spain through my wife's family. These days I live in a house in
          Nacka, just east of Stockholm, where the garden never stops
          asking for attention and the sea is never far.
        </p>
      </Reveal>
      <Reveal index={1} className="h-fit">
        <dl className="space-y-4 border-l border-ink/15 pl-6 font-mono text-xs leading-relaxed">
          {CHART_DATA.map(([k, v]) => (
            <div key={k}>
              <dt className="uppercase tracking-[0.18em] text-granite/55">{k}</dt>
              <dd className="mt-1 text-ink">{v}</dd>
            </div>
          ))}
        </dl>
      </Reveal>
    </div>
  </Section>
);

export default About;
