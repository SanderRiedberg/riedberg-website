import React, { Suspense, useCallback, useEffect, useRef, useState } from 'react';
import Hero from './surface/Hero';
import About from './surface/About';
import Values from './surface/Values';
import Projects from './surface/Projects';
import Waterline from './surface/Waterline';
import FacadeCracks from './surface/FacadeCracks';
import DiveTransition from './surface/DiveTransition';
import { useTimeOfDay } from './hooks/useTimeOfDay';
import { useReducedMotion } from './hooks/useMediaPreferences';
import { useVisitMemory } from './hooks/useVisitMemory';
import type { DivePhase } from './voice/types';

const Depths = React.lazy(() => import('./depths/Depths'));

const DIVE_MS = 1150;
const OVERSCROLL_TRIGGER_PX = 320;

const App: React.FC = () => {
  const timeOfDay = useTimeOfDay();
  const reducedMotion = useReducedMotion();
  const { memory, dive, noteSeen } = useVisitMemory();
  const [phase, setPhase] = useState<DivePhase>(() =>
    window.location.hash === '#below' ? 'below' : 'surface',
  );
  const phaseTimer = useRef(0);

  useEffect(() => {
    document.documentElement.dataset.time = timeOfDay;
  }, [timeOfDay]);

  // Hidden dev aid, sibling of ?t=: ?y=2400 scrolls there after mount
  // so headless screenshots can reach below the hero.
  useEffect(() => {
    const y = Number(new URLSearchParams(window.location.search).get('y'));
    if (Number.isFinite(y) && y > 0) window.scrollTo(0, y);
  }, []);

  const transitionTo = useCallback(
    (target: 'below' | 'surface') => {
      window.clearTimeout(phaseTimer.current);
      if (reducedMotion) {
        setPhase(target);
        return;
      }
      setPhase(target === 'below' ? 'diving' : 'surfacing');
      phaseTimer.current = window.setTimeout(() => setPhase(target), DIVE_MS);
    },
    [reducedMotion],
  );

  const goBelow = useCallback(() => {
    setPhase((current) => {
      if (current !== 'surface') return current;
      dive();
      window.history.pushState(null, '', '#below');
      transitionTo('below');
      return current;
    });
  }, [dive, transitionTo]);

  const goSurface = useCallback(() => {
    setPhase((current) => {
      if (current !== 'below') return current;
      if (window.location.hash === '#below') {
        window.history.pushState(
          null,
          '',
          window.location.pathname + window.location.search,
        );
      }
      transitionTo('surface');
      return current;
    });
  }, [transitionTo]);

  // Back/forward buttons follow the same water.
  useEffect(() => {
    const onPopState = () => {
      const wantsBelow = window.location.hash === '#below';
      setPhase((current) => {
        if (wantsBelow && current === 'surface') {
          transitionTo('below');
        } else if (!wantsBelow && current === 'below') {
          transitionTo('surface');
        }
        return current;
      });
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, [transitionTo]);

  // Escape resurfaces.
  useEffect(() => {
    if (phase !== 'below') return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') goSurface();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [phase, goSurface]);

  // Insisting on scrolling past the bottom of the page is also a dive.
  useEffect(() => {
    if (phase !== 'surface') return;
    let accumulated = 0;
    const onWheel = (e: WheelEvent) => {
      const atBottom =
        window.scrollY + window.innerHeight >=
        document.documentElement.scrollHeight - 2;
      if (!atBottom || e.deltaY <= 0) {
        accumulated = 0;
        return;
      }
      accumulated += e.deltaY;
      if (accumulated > OVERSCROLL_TRIGGER_PX) {
        accumulated = 0;
        goBelow();
      }
    };
    window.addEventListener('wheel', onWheel, { passive: true });
    return () => window.removeEventListener('wheel', onWheel);
  }, [phase, goBelow]);

  // While below, the surface neither scrolls nor receives focus.
  const belowActive = phase === 'below' || phase === 'surfacing';
  useEffect(() => {
    document.body.style.overflow = phase === 'surface' ? '' : 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [phase]);

  return (
    <div className="min-h-screen bg-mist">
      <div inert={belowActive ? true : undefined}>
        <Hero />
        <main>
          <About />
          <Values />
          <Projects onDive={goBelow} />
        </main>
        <Waterline onDive={goBelow} reducedMotion={reducedMotion} />
      </div>

      {phase === 'surface' && <FacadeCracks memory={memory} noteSeen={noteSeen} />}

      {belowActive && (
        <div className="fixed inset-0 z-40 overflow-y-auto bg-abyss">
          <Suspense fallback={<div className="min-h-full bg-abyss" />}>
            <Depths
              onSurface={goSurface}
              memory={memory}
              noteSeen={noteSeen}
              reducedMotion={reducedMotion}
            />
          </Suspense>
        </div>
      )}

      <DiveTransition phase={phase} />
    </div>
  );
};

export default App;
