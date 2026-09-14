import { createEngine, mulberry32, type CanvasEngine, type EngineOpts } from './engine';

const MOTE_COUNT = 64;
const MOTE_COUNT_COMPACT = 28;
const NODE_COUNT = 9;
const CLOUD_COUNT = 4;
const COLOR_REFRESH_FRAMES = 90;

const drawBathymetry = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  t: number,
  compact: boolean,
  rgb: readonly [number, number, number],
) => {
  const rings = compact ? 4 : 7;
  const maxRx = Math.min(width * 0.44, 540);
  const maxRy = Math.min(height * 0.42, 350);
  const cx = width * 0.72;
  const cy = height * 0.56;
  const [r, g, b] = rgb;

  ctx.lineWidth = 0.75;
  for (let ring = 1; ring <= rings; ring += 1) {
    const scale = ring / rings;
    ctx.beginPath();
    for (let point = 0; point <= 80; point += 1) {
      const angle = (point / 80) * Math.PI * 2;
      const wobble =
        1 +
        Math.sin(angle * 3 + ring * 0.8) * 0.035 +
        Math.sin(angle * 7 - ring * 0.45) * 0.018 +
        Math.sin(t * 0.035 + ring) * 0.008;
      const x = cx + Math.cos(angle) * maxRx * scale * wobble;
      const y = cy + Math.sin(angle) * maxRy * scale * wobble;
      if (point === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${compact ? 0.035 : 0.045})`;
    ctx.stroke();
  }
};

interface Mote {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  twinklePhase: number;
}

interface Cloud {
  x: number;
  y: number;
  radius: number;
  vx: number;
  phase: number;
}

/** Parses "rgb(r, g, b)" / "rgba(...)" into channels; falls back to ink. */
const parseColor = (css: string): [number, number, number] => {
  const m = css.match(/(\d+)[, ]+(\d+)[, ]+(\d+)/);
  return m ? [Number(m[1]), Number(m[2]), Number(m[3])] : [27, 34, 40];
};

/**
 * The hero's ambient field: slow-drifting motes, a few brighter pulsing
 * nodes, large ultra-faint cloud masses and chart-like depth contours. Drawn in the hero's
 * currentColor, so it follows the time-of-day ink automatically -
 * dark particles on the day sky, pale ones at night.
 */
export const createHeroField = (
  canvas: HTMLCanvasElement,
  opts: EngineOpts,
): CanvasEngine => {
  const rand = mulberry32(2026);
  const motes: Mote[] = Array.from({ length: MOTE_COUNT }, () => ({
    x: rand(),
    y: rand(),
    vx: 2 + rand() * 7,
    vy: -(1 + rand() * 3.5),
    size: 0.6 + rand() * 1.5,
    alpha: 0.12 + rand() * 0.3,
    twinklePhase: rand() * Math.PI * 2,
  }));
  const nodes = Array.from({ length: NODE_COUNT }, () => ({
    x: rand(),
    y: rand(),
    vx: 1 + rand() * 3,
    size: 1.4 + rand() * 1.2,
    pulseSpeed: 0.25 + rand() * 0.4,
    pulsePhase: rand() * Math.PI * 2,
  }));
  const clouds: Cloud[] = Array.from({ length: CLOUD_COUNT }, () => ({
    x: rand(),
    y: 0.15 + rand() * 0.6,
    radius: 130 + rand() * 130,
    vx: 1.5 + rand() * 2.5,
    phase: rand() * Math.PI * 2,
  }));

  let rgb: [number, number, number] = [27, 34, 40];
  let frame = 0;

  return createEngine(canvas, opts, ({ ctx, width, height, t, compact }) => {
    if (frame % COLOR_REFRESH_FRAMES === 0) {
      rgb = parseColor(getComputedStyle(canvas).color);
    }
    frame += 1;
    const [r, g, b] = rgb;

    // A quiet topographic echo of the world below the waterline.
    drawBathymetry(ctx, width, height, t, compact, rgb);

    // Cloud masses: edgeless, barely-there depth.
    clouds.forEach((c) => {
      const cx = ((c.x * width + t * c.vx) % (width + c.radius * 2)) - c.radius;
      const cy = c.y * height + Math.sin(c.phase + t * 0.05) * 22;
      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, c.radius);
      grad.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0.030)`);
      grad.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
      ctx.fillStyle = grad;
      ctx.fillRect(cx - c.radius, cy - c.radius, c.radius * 2, c.radius * 2);
    });

    // Drifting motes.
    const visible = compact ? MOTE_COUNT_COMPACT : MOTE_COUNT;
    for (let i = 0; i < visible; i++) {
      const m = motes[i];
      const x = ((m.x * width + t * m.vx) % (width + 8)) - 4;
      const y = ((m.y * height + t * m.vy) % (height + 8) + height + 8) % (height + 8) - 4;
      const twinkle = 0.7 + 0.3 * Math.sin(m.twinklePhase + t * 0.7);
      ctx.beginPath();
      ctx.arc(x, y, m.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${(m.alpha * twinkle).toFixed(3)})`;
      ctx.fill();
    }

    // Pulsing nodes: quiet hints of signal.
    nodes.forEach((n) => {
      const x = ((n.x * width + t * n.vx) % (width + 10)) - 5;
      const y = n.y * height;
      const pulse = 0.5 + 0.5 * Math.sin(n.pulsePhase + t * n.pulseSpeed * Math.PI * 2);
      ctx.beginPath();
      ctx.arc(x, y, n.size + pulse * 0.8, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${(0.12 + pulse * 0.26).toFixed(3)})`;
      ctx.fill();
    });
  });
};
