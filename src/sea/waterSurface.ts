import { createEngine, mulberry32, type CanvasEngine, type EngineOpts } from './engine';

interface WaveLayer {
  /** Fraction of canvas height where this layer's surface rests. */
  baseY: number;
  amplitude: number;
  wavelength: number;
  speed: number;
  phase: number;
  color: string;
}

const LAYERS: readonly WaveLayer[] = [
  { baseY: 0.42, amplitude: 7, wavelength: 340, speed: 0.45, phase: 0.0, color: 'rgba(111, 162, 154, 0.35)' },
  { baseY: 0.50, amplitude: 10, wavelength: 220, speed: -0.3, phase: 2.1, color: 'rgba(74, 109, 116, 0.45)' },
  { baseY: 0.58, amplitude: 13, wavelength: 150, speed: 0.22, phase: 4.4, color: 'rgba(20, 57, 76, 0.55)' },
];

const GLINT_COUNT = 26;
const GLINT_COUNT_COMPACT = 12;

const surfaceY = (
  layer: WaveLayer,
  x: number,
  t: number,
  height: number,
): number =>
  layer.baseY * height +
  layer.amplitude * Math.sin((x / layer.wavelength) * Math.PI * 2 + layer.phase + t * layer.speed * Math.PI * 2 * 0.2) +
  layer.amplitude * 0.4 * Math.sin((x / (layer.wavelength * 0.53)) * Math.PI * 2 - t * layer.speed * 1.7);

/**
 * The waterline itself: three translucent wave layers and sun glints
 * drifting along the top surface. Sits at the bottom of the facade.
 */
export const createWaterSurface = (
  canvas: HTMLCanvasElement,
  opts: EngineOpts,
): CanvasEngine => {
  const rand = mulberry32(1717);
  const glints = Array.from({ length: GLINT_COUNT }, () => ({
    x: rand(),
    twinklePhase: rand() * Math.PI * 2,
    twinkleSpeed: 0.5 + rand() * 1.2,
    drift: 4 + rand() * 10,
  }));

  return createEngine(canvas, opts, ({ ctx, width, height, t, compact }) => {
    const step = compact ? 8 : 5;

    LAYERS.forEach((layer) => {
      ctx.beginPath();
      ctx.moveTo(0, surfaceY(layer, 0, t, height));
      for (let x = step; x <= width + step; x += step) {
        ctx.lineTo(x, surfaceY(layer, x, t, height));
      }
      ctx.lineTo(width, height);
      ctx.lineTo(0, height);
      ctx.closePath();
      ctx.fillStyle = layer.color;
      ctx.fill();
    });

    const top = LAYERS[0];
    const visibleGlints = compact ? GLINT_COUNT_COMPACT : GLINT_COUNT;
    for (let i = 0; i < visibleGlints; i++) {
      const g = glints[i];
      const x = ((g.x * width + t * g.drift) % (width + 20)) - 10;
      const y = surfaceY(top, x, t, height) - 1.5;
      const twinkle = 0.5 + 0.5 * Math.sin(g.twinklePhase + t * g.twinkleSpeed * Math.PI);
      const alpha = 0.25 + twinkle * 0.55;
      ctx.beginPath();
      ctx.arc(x, y, 0.8 + twinkle * 1.1, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(253, 254, 254, ${alpha})`;
      ctx.fill();
    }
  });
};
