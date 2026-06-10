import { createEngine, mulberry32, type CanvasEngine, type EngineOpts } from './engine';

const SNOW_COUNT = 90;
const SNOW_COUNT_COMPACT = 40;
const SHAFT_COUNT = 4;

interface Speck {
  x: number;
  y: number;
  size: number;
  fallSpeed: number;
  swayPhase: number;
  /** 0 = far layer (slow, dim), 1 = near layer. */
  layer: number;
}

/**
 * The depths: slow marine snow in two parallax layers and faint
 * caustic light shafts swaying from the surface far above.
 */
export const createDepthsBackdrop = (
  canvas: HTMLCanvasElement,
  opts: EngineOpts,
): CanvasEngine => {
  const rand = mulberry32(4242);
  const specks: Speck[] = Array.from({ length: SNOW_COUNT }, () => ({
    x: rand(),
    y: rand(),
    size: 0.6 + rand() * 1.6,
    fallSpeed: 4 + rand() * 9,
    swayPhase: rand() * Math.PI * 2,
    layer: rand() > 0.6 ? 1 : 0,
  }));
  const shafts = Array.from({ length: SHAFT_COUNT }, (_, i) => ({
    x: (i + 0.5) / SHAFT_COUNT + (rand() - 0.5) * 0.1,
    width: 0.10 + rand() * 0.10,
    swaySpeed: 0.05 + rand() * 0.05,
    swayPhase: rand() * Math.PI * 2,
  }));

  return createEngine(canvas, opts, ({ ctx, width, height, t, compact }) => {
    shafts.forEach((s) => {
      const cx = (s.x + 0.04 * Math.sin(s.swayPhase + t * s.swaySpeed * Math.PI * 2)) * width;
      const w = s.width * width;
      const grad = ctx.createLinearGradient(0, 0, 0, height * 0.85);
      grad.addColorStop(0, 'rgba(95, 211, 188, 0.07)');
      grad.addColorStop(0.5, 'rgba(95, 211, 188, 0.025)');
      grad.addColorStop(1, 'rgba(95, 211, 188, 0)');
      ctx.beginPath();
      ctx.moveTo(cx - w * 0.25, 0);
      ctx.lineTo(cx + w * 0.25, 0);
      ctx.lineTo(cx + w * 0.7, height * 0.85);
      ctx.lineTo(cx - w * 0.7, height * 0.85);
      ctx.closePath();
      ctx.fillStyle = grad;
      ctx.fill();
    });

    const visible = compact ? SNOW_COUNT_COMPACT : SNOW_COUNT;
    for (let i = 0; i < visible; i++) {
      const p = specks[i];
      const depthFactor = p.layer === 1 ? 1 : 0.45;
      const y = ((p.y * height + t * p.fallSpeed * depthFactor) % (height + 10)) - 5;
      const x =
        p.x * width +
        Math.sin(p.swayPhase + t * 0.3 + y * 0.004) * 14 * depthFactor;
      const alpha = p.layer === 1 ? 0.35 : 0.16;
      ctx.beginPath();
      ctx.arc(x, y, p.size * depthFactor, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(191, 214, 221, ${alpha})`;
      ctx.fill();
    }
  });
};
