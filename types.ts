import React from 'react';

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  baseVx: number;
  baseVy: number;
  size: number;
  color: string;
  hasLabel: boolean;
}

export interface MousePosition {
  x: number;
  y: number;
}

export interface ContactLink {
  label: string;
  value: string;
  href: string;
  icon: React.ReactNode;
}