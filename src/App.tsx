import React, { useEffect } from 'react';
import Hero from './surface/Hero';
import About from './surface/About';
import Values from './surface/Values';
import Projects from './surface/Projects';
import Waterline from './surface/Waterline';
import FacadeCracks from './surface/FacadeCracks';
import { useTimeOfDay } from './hooks/useTimeOfDay';
import { useReducedMotion } from './hooks/useMediaPreferences';
import { useVisitMemory } from './hooks/useVisitMemory';

const App: React.FC = () => {
  const timeOfDay = useTimeOfDay();
  const reducedMotion = useReducedMotion();
  const { memory, dive, noteSeen } = useVisitMemory();

  useEffect(() => {
    document.documentElement.dataset.time = timeOfDay;
  }, [timeOfDay]);

  // Hidden dev aid, sibling of ?t=: ?y=2400 scrolls there after mount
  // so headless screenshots can reach below the hero.
  useEffect(() => {
    const y = Number(new URLSearchParams(window.location.search).get('y'));
    if (Number.isFinite(y) && y > 0) window.scrollTo(0, y);
  }, []);

  // The dive itself arrives with the depths; for now the surface only counts the urge.
  const onDive = () => {
    dive();
  };

  return (
    <div className="min-h-screen bg-mist">
      <Hero />
      <main>
        <About />
        <Values />
        <Projects onDive={onDive} />
      </main>
      <Waterline onDive={onDive} reducedMotion={reducedMotion} />
      <FacadeCracks memory={memory} noteSeen={noteSeen} />
    </div>
  );
};

export default App;
