import React, { useEffect, useRef } from 'react';
import type { CanvasEngine, EngineOpts } from './engine';

interface SeaCanvasProps {
  factory: (canvas: HTMLCanvasElement, opts: EngineOpts) => CanvasEngine;
  reduced: boolean;
  active?: boolean;
  className?: string;
}

/** Thin lifecycle wrapper around a canvas engine. Purely decorative. */
const SeaCanvas: React.FC<SeaCanvasProps> = ({ factory, reduced, active = true, className }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !active) return;
    const engine = factory(canvas, { reduced });
    if (typeof IntersectionObserver === 'undefined') {
      engine.start();
      return () => engine.destroy();
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (entry?.isIntersecting) engine.start();
      else engine.stop();
    });
    observer.observe(canvas);
    return () => {
      observer.disconnect();
      engine.destroy();
    };
  }, [factory, reduced, active]);

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
};

export default SeaCanvas;
