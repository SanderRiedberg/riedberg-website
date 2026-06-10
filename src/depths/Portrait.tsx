import React from 'react';
import DepthSection from './DepthSection';

/** The site's own, unvarnished account of its owner. */
const Portrait: React.FC = () => (
  <DepthSection label="The owner, unvarnished" depth="−15 m">
    <div className="max-w-xl space-y-5 font-serif text-lg leading-relaxed text-moon/90">
      <p>
        He made me presentable. Up there: clean keylines, considered
        greys, a tidy account of a man who works where medical technology
        meets the rules. All true. But a website hears things, so here is
        what I actually know.
      </p>
      <p>
        He chose medical technology because he wanted the work itself to
        leave the world better, and he stayed because the problems are
        gloriously difficult — many dimensions, no clean answers,
        every choice a trade-off you must be able to defend out loud.
        Some people relax with simple things. He relaxes by weighing
        complicated ones.
      </p>
      <p>
        He is European in the lived sense, not the abstract one: a
        German-Estonian father, a Finnish mother, childhood years in
        Finland and Belgium, long Spanish stretches with his wife's
        family. Home is a house in Nacka — a garden that always wins,
        and the sea within reach. There is also a 3D printer he
        describes as "practical". I have seen the print history. It is
        not practical.
      </p>
      <p>
        The values are older than the CV. Scout summers on an island in
        the Stockholm archipelago — different backgrounds, one campfire —
        grew into years in KFUM Sweden, the YMCA, including a term as
        vice chair of the national board. And the most important things
        in his life are not on this website at all. They are at home,
        and he keeps them there on purpose. I respect it. I am, after
        all, very public.
      </p>
    </div>
  </DepthSection>
);

export default Portrait;
