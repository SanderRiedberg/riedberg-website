/** Pure scroll math, kept separate from the DOM so it can be tested. */

export const clamp = (value: number, min: number, max: number): number =>
  value < min ? min : value > max ? max : value;

/**
 * How far a tall element has been scrolled through, 0..1.
 *
 * 0 while its top edge is at or below the viewport top; 1 once its
 * bottom edge reaches the viewport bottom. Used to scrub the pinned
 * waterline scene. Degrades to 0 for elements no taller than the
 * viewport (nothing to scrub).
 *
 * @param rectTop  element.getBoundingClientRect().top
 * @param elHeight element.offsetHeight
 * @param viewportH window.innerHeight
 */
export const elementProgress = (
  rectTop: number,
  elHeight: number,
  viewportH: number,
): number => {
  const total = elHeight - viewportH;
  if (total <= 0) return 0;
  // `+ 0` normalises -0 (from rectTop === 0) to +0.
  return clamp(-rectTop / total, 0, 1) + 0;
};

/**
 * Parallax offset in px for an element, based on the distance of its
 * centre from the viewport centre. Multiply by a small factor for a
 * subtle drift; positive factor moves the element with the scroll,
 * trailing the page.
 */
export const parallaxOffset = (
  rectTop: number,
  elHeight: number,
  viewportH: number,
  factor: number,
): number => {
  const elementCentre = rectTop + elHeight / 2;
  const viewportCentre = viewportH / 2;
  return (elementCentre - viewportCentre) * factor;
};
