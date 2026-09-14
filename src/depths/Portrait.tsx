import React from 'react';
import DepthSection from './DepthSection';

/** The site's own, unvarnished account of its owner. */
const Portrait: React.FC = () => (
  <DepthSection label="The owner, unvarnished" depthM={-15} depthFromM={-5}>
    <div className="max-w-xl space-y-5 font-serif text-lg leading-relaxed text-moon/90">
      <p>
        He made me presentable. Clean keylines, considered greys, a tidy
        account of a man who works where medical technology meets the rules.
        All true. But a website hears things.
      </p>
      <p>
        He is often the person who asks, "Have we thought about this?" It is
        not hesitation so much as a dislike of false speed. Give him a better
        argument, though, and he will change his mind quickly. He would rather
        improve the answer than own it.
      </p>
      <p>
        Curiosity is the less orderly part. Technology, cars, books, personal
        finance, or some entirely new subject can consume an evening without
        warning. He appreciates good design and a proper finish, while
        insisting he is not a perfectionist. The distinction matters to him.
      </p>
      <p>
        He grew up between countries and now lives in Nacka, with the sea in
        reach, a garden that always wins and a 3D printer described as
        "practical". The most important things remain at home and off the
        record. I am, after all, a public website.
      </p>
    </div>
  </DepthSection>
);

export default Portrait;
