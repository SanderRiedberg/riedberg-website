export interface CanvasEngine {
  start(): void;
  stop(): void;
  destroy(): void;
}

export interface EngineOpts {
  reduced: boolean;
}

const FPS_CAP = 30;
const FRAME_MS = 1000 / FPS_CAP;
const DPR_CAP = 2;

export interface FrameContext {
  ctx: CanvasRenderingContext2D;
  width: number;
  height: number;
  /** Seconds since the engine started. */
  t: number;
  /** True below the mobile breakpoint: draw fewer things. */
  compact: boolean;
}

/**
 * Shared chassis for the site's two canvas engines. Owns sizing
 * (ResizeObserver, devicePixelRatio capped at 2), the 30 fps loop,
 * pausing when the tab is hidden, and the guarantee that a drawing
 * error stops the loop instead of taking the page down. With
 * `reduced` motion a single static frame is drawn and no loop runs.
 */
export const createEngine = (
  canvas: HTMLCanvasElement,
  opts: EngineOpts,
  draw: (frame: FrameContext) => void,
): CanvasEngine => {
  const ctx = canvas.getContext('2d');
  let rafId = 0;
  let running = false;
  let lastFrame = 0;
  let startTime = performance.now();
  let observer: ResizeObserver | null = null;

  const size = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, DPR_CAP);
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    if (w === 0 || h === 0) return;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);
  };

  const renderFrame = () => {
    if (!ctx) return;
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    ctx.clearRect(0, 0, w, h);
    draw({
      ctx,
      width: w,
      height: h,
      t: (performance.now() - startTime) / 1000,
      compact: w < 768,
    });
  };

  const loop = (now: number) => {
    if (!running) return;
    rafId = requestAnimationFrame(loop);
    if (now - lastFrame < FRAME_MS) return;
    lastFrame = now;
    try {
      renderFrame();
    } catch {
      // A broken effect degrades to the CSS backdrop; it never crashes the site.
      stop();
    }
  };

  const start = () => {
    if (!ctx || running) return;
    size();
    if (opts.reduced) {
      try {
        renderFrame();
      } catch {
        // Static frame failed; the CSS backdrop carries the scene.
      }
      return;
    }
    running = true;
    startTime = performance.now();
    rafId = requestAnimationFrame(loop);
  };

  const stop = () => {
    running = false;
    cancelAnimationFrame(rafId);
  };

  const onVisibility = () => {
    if (document.hidden) {
      stop();
    } else if (!opts.reduced) {
      running = true;
      rafId = requestAnimationFrame(loop);
    }
  };

  try {
    observer = new ResizeObserver(() => {
      size();
      if (opts.reduced) {
        try {
          renderFrame();
        } catch {
          // Same degradation as above.
        }
      }
    });
    observer.observe(canvas);
  } catch {
    observer = null;
  }
  document.addEventListener('visibilitychange', onVisibility);

  return {
    start,
    stop,
    destroy: () => {
      stop();
      observer?.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
    },
  };
};

/** Deterministic pseudo-random stream so effects are stable across frames. */
export const mulberry32 = (seed: number) => {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};
