import React from 'react';
import Section from './Section';
import Reveal from './Reveal';

const Values: React.FC = () => (
  <Section id="practice" index="02" label="In practice" altitudeM={13} altitudeFromM={21}>
    <div className="grid gap-6 md:grid-cols-[1fr_2fr] md:gap-10">
      <Reveal>
        <h3 className="font-serif text-2xl font-medium text-ink">
          Building the foundation with the product
        </h3>
      </Reveal>
      <Reveal index={1}>
        <p className="leading-relaxed text-granite">
          I joined a team early as they explored new language-model-based
          functionality for an existing product. Product and engineering
          shaped the technology and experience; I helped clarify the intended
          purpose, the regulatory boundary and what the first release needed
          to support over time. Because that reasoning happened alongside
          development - not after it - the team could build within clearer
          boundaries while the rationale and documentation took shape with
          the product.
        </p>
      </Reveal>
    </div>
  </Section>
);

export default Values;
