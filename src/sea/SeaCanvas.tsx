import React, { useEffect, useRef } from 'react';
import type { CanvasEngine, EngineOpts } from './engine';

interface SeaCanvasProps {
  factory: (canvas: HTMLCanvasElement, opts: EngineOpts) => CanvasEngine;
  reduced: boolean;
  className?: string;
}

/** Thin lifecycle wrapper around a canvas engine. Purely decorative. */
const SeaCanvas: React.FC<SeaCanvasProps> = ({ factory, reduced, className }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const engine = factory(canvas, { reduced });
    engine.start();
    return () => engine.destroy();
  }, [factory, reduced]);

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
};

export default SeaCanvas;
