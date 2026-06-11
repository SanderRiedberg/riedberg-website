import { subscribeScroll } from '../lib/scrollBus';

/**
 * A shared "sea energy" value, 0..1, that rises with scroll velocity
 * and is decayed each animation frame by the water engine. Lets the
 * waves swell when the visitor scrolls quickly and settle when they
 * stop - without the engine knowing anything about scrolling.
 */
let energy = 0;
let lastY = 0;
let initialised = false;

const ensure = () => {
  if (initialised || typeof window === 'undefined') return;
  initialised = true;
  lastY = window.scrollY;
  subscribeScroll(() => {
    const y = window.scrollY;
    energy = Math.min(1, energy + Math.abs(y - lastY) / 1400);
    lastY = y;
  });
};

/** Current energy, 0..1. Lazily attaches the scroll listener. */
export const readSeaEnergy = (): number => {
  ensure();
  return energy;
};

/** Called once per rendered frame by the engine to let the swell settle. */
export const decaySeaEnergy = (factor = 0.94): void => {
  energy *= factor;
};
