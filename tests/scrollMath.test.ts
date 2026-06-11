import { describe, it, expect } from 'vitest';
import { clamp, elementProgress, parallaxOffset } from '../src/lib/scrollMath';

describe('clamp', () => {
  it('begränsar till intervallet', () => {
    expect(clamp(5, 0, 10)).toBe(5);
    expect(clamp(-3, 0, 10)).toBe(0);
    expect(clamp(99, 0, 10)).toBe(10);
  });
});

describe('elementProgress', () => {
  const VH = 800;
  const EL = 2000; // 1200 px scrollbar sträcka

  it('är 0 innan elementet börjar passera', () => {
    expect(elementProgress(0, EL, VH)).toBe(0);
    expect(elementProgress(50, EL, VH)).toBe(0);
  });

  it('är 1 när hela sträckan passerats', () => {
    expect(elementProgress(-1200, EL, VH)).toBe(1);
    expect(elementProgress(-9999, EL, VH)).toBe(1);
  });

  it('är 0.5 mitt i sträckan', () => {
    expect(elementProgress(-600, EL, VH)).toBeCloseTo(0.5, 5);
  });

  it('ger 0 för element som inte är högre än viewporten', () => {
    expect(elementProgress(-100, 800, 800)).toBe(0);
    expect(elementProgress(-100, 500, 800)).toBe(0);
  });
});

describe('parallaxOffset', () => {
  const VH = 800;
  const EL = 200;

  it('är 0 när elementets centrum är i viewportens centrum', () => {
    // centrum = rectTop + EL/2 = 300 + 100 = 400 = VH/2
    expect(parallaxOffset(300, EL, VH, 0.2)).toBeCloseTo(0, 5);
  });

  it('skalar med avståndet och faktorn', () => {
    // centrum 100 px under mitten -> offset 100 * 0.2 = 20
    expect(parallaxOffset(400, EL, VH, 0.2)).toBeCloseTo(20, 5);
  });

  it('byter tecken ovanför mitten', () => {
    expect(parallaxOffset(100, EL, VH, 0.2)).toBeCloseTo(-40, 5);
  });
});
