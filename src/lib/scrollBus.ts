/**
 * One scroll/resize listener for the whole page, batched into a single
 * rAF tick. Components subscribe instead of each attaching their own
 * listener - so ten parallax elements still cost one handler and one
 * layout read pass per frame.
 */
type Listener = () => void;

const listeners = new Set<Listener>();
let ticking = false;
let attached = false;

const flush = () => {
  ticking = false;
  listeners.forEach((listen) => {
    try {
      listen();
    } catch {
      // A misbehaving subscriber must not stall the others.
    }
  });
};

const onActivity = () => {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(flush);
};

/**
 * Subscribe to scroll/resize. The listener fires once immediately so
 * it can set its initial state. Returns an unsubscribe function.
 */
export const subscribeScroll = (listen: Listener): (() => void) => {
  if (!attached) {
    window.addEventListener('scroll', onActivity, { passive: true });
    window.addEventListener('resize', onActivity, { passive: true });
    attached = true;
  }
  listeners.add(listen);
  listen();
  return () => {
    listeners.delete(listen);
    if (listeners.size === 0 && attached) {
      window.removeEventListener('scroll', onActivity);
      window.removeEventListener('resize', onActivity);
      attached = false;
    }
  };
};
