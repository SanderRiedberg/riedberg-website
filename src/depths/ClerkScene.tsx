import React from 'react';
import { clamp } from '../lib/scrollMath';

interface ClerkSceneProps {
  /** Today's visitors; drives the gauge needle. Null = off duty. */
  visitorsToday: number | null;
}

const GAUGE_MAX = 30;

/**
 * The counting house: a small clerk perched on the owner's server,
 * cranking a brass tallying machine. Data pulses travel the cable from
 * the server to the machine; bubbles rise, because we are forty metres
 * down. Pure SVG + CSS keyframes; reduced motion stills everything.
 */
const ClerkScene: React.FC<ClerkSceneProps> = ({ visitorsToday }) => {
  const fraction = visitorsToday === null ? 0 : clamp(visitorsToday / GAUGE_MAX, 0, 1);
  const needleAngle = -80 + fraction * 160;

  return (
    <svg
      viewBox="0 0 320 240"
      className="w-full max-w-[420px]"
      aria-hidden="true"
      style={{ color: '#bfd6dd' }}
    >
      {/* Floor */}
      <line x1="16" y1="212" x2="304" y2="212" stroke="currentColor" strokeOpacity="0.3" />

      {/* The server (his perch) */}
      <g stroke="currentColor" strokeOpacity="0.75" fill="none" strokeWidth="1.5">
        <rect x="42" y="122" width="78" height="90" rx="4" />
        <line x1="42" y1="140" x2="120" y2="140" strokeOpacity="0.35" />
        <line x1="42" y1="158" x2="120" y2="158" strokeOpacity="0.35" />
        <line x1="42" y1="176" x2="120" y2="176" strokeOpacity="0.35" />
        <line x1="42" y1="194" x2="120" y2="194" strokeOpacity="0.35" />
      </g>
      <text x="50" y="208" fontSize="7" fill="currentColor" fillOpacity="0.45" fontFamily="monospace">
        ubuntu-server
      </text>
      {/* Rack LEDs */}
      <circle cx="112" cy="131" r="1.8" fill="#5fd3bc" className="anim-led" />
      <circle cx="106" cy="131" r="1.8" fill="#5fd3bc" className="anim-led" style={{ animationDelay: '0.7s' }} />
      <circle cx="112" cy="149" r="1.8" fill="#e0a458" className="anim-led" style={{ animationDelay: '1.3s' }} />
      <circle cx="112" cy="167" r="1.8" fill="#5fd3bc" className="anim-led" style={{ animationDelay: '0.4s' }} />

      {/* The clerk, perched */}
      <g stroke="currentColor" strokeOpacity="0.9" fill="none" strokeWidth="1.8" strokeLinecap="round">
        {/* head */}
        <circle cx="103" cy="74" r="8.5" />
        {/* flat cap */}
        <path d="M 94 70 Q 103 63 113 69" strokeWidth="2.2" />
        {/* torso, leaning toward the work */}
        <path d="M 100 82 Q 96 100 98 118" />
        {/* legs hanging off the rack */}
        <path d="M 98 118 L 90 142 L 92 156" />
        <path d="M 98 118 L 104 144 L 100 158" />
        {/* resting arm on knee */}
        <path d="M 99 92 Q 92 104 92 116" strokeOpacity="0.7" />
        {/* working arm to the crank */}
        <g className="anim-crank-arm" style={{ transformOrigin: '101px 92px' }}>
          <path d="M 101 92 Q 122 100 138 108" />
        </g>
      </g>

      {/* Cable: server -> machine, with travelling data pulses */}
      <path
        d="M 120 200 C 150 200 150 170 168 150"
        fill="none"
        stroke="#5fd3bc"
        strokeOpacity="0.5"
        strokeWidth="1.5"
        strokeDasharray="3 9"
        className="anim-dataflow"
      />

      {/* The tallying machine */}
      <g stroke="currentColor" strokeOpacity="0.8" fill="none" strokeWidth="1.5">
        <rect x="152" y="118" width="74" height="58" rx="5" />
        <line x1="152" y1="176" x2="146" y2="212" />
        <line x1="226" y1="176" x2="232" y2="212" />
        {/* punched tape spilling out */}
        <path d="M 226 140 q 18 4 22 22 q 3 14 -8 26 q -6 7 -2 14" strokeOpacity="0.45" />
      </g>
      {/* Crank wheel the clerk drives */}
      <g className="anim-crank-wheel" style={{ transformOrigin: '152px 134px' }}>
        <circle cx="152" cy="134" r="13" fill="none" stroke="#e0a458" strokeOpacity="0.85" strokeWidth="1.8" />
        <line x1="152" y1="134" x2="152" y2="122" stroke="#e0a458" strokeWidth="1.8" />
        <circle cx="152" cy="122" r="2.4" fill="#e0a458" />
      </g>
      {/* Machine face: rivets + plate */}
      <circle cx="218" cy="124" r="1.2" fill="currentColor" fillOpacity="0.5" />
      <circle cx="218" cy="170" r="1.2" fill="currentColor" fillOpacity="0.5" />
      <circle cx="160" cy="170" r="1.2" fill="currentColor" fillOpacity="0.5" />
      <rect x="166" y="138" width="48" height="22" rx="2" stroke="#e0a458" strokeOpacity="0.5" fill="none" />
      <text x="171" y="152" fontSize="7.5" fill="#e0a458" fillOpacity="0.8" fontFamily="monospace">
        TALLY
      </text>

      {/* Gauge: today's visitors */}
      <g stroke="currentColor" strokeOpacity="0.8" fill="none" strokeWidth="1.5">
        <path d="M 244 104 A 26 26 0 0 1 296 104" />
        <line x1="244" y1="104" x2="296" y2="104" strokeOpacity="0.35" />
        {/* ticks */}
        <line x1="248" y1="92" x2="252" y2="95" strokeOpacity="0.5" />
        <line x1="270" y1="80" x2="270" y2="85" strokeOpacity="0.5" />
        <line x1="292" y1="92" x2="288" y2="95" strokeOpacity="0.5" />
      </g>
      <line x1="270" y1="104" x2="270" y2="84" stroke="#e0a458" strokeWidth="2" strokeLinecap="round"
        style={{
          transformOrigin: '270px 104px',
          transform: `rotate(${needleAngle.toFixed(1)}deg)`,
          transition: 'transform 1.8s cubic-bezier(0.25, 0.8, 0.3, 1)',
        }}
      />
      <circle cx="270" cy="104" r="2.6" fill="#e0a458" />
      <text x="247" y="118" fontSize="7" fill="currentColor" fillOpacity="0.45" fontFamily="monospace">
        souls today
      </text>
      {/* gauge stand */}
      <line x1="270" y1="106" x2="270" y2="212" stroke="currentColor" strokeOpacity="0.3" strokeWidth="1.5" />

      {/* Bubbles - forty metres down, after all */}
      <circle cx="84" cy="108" r="2.5" fill="none" stroke="currentColor" strokeOpacity="0.5" className="anim-bubble" />
      <circle cx="188" cy="100" r="2" fill="none" stroke="currentColor" strokeOpacity="0.5" className="anim-bubble" style={{ animationDelay: '1.6s' }} />
      <circle cx="120" cy="96" r="1.6" fill="none" stroke="currentColor" strokeOpacity="0.5" className="anim-bubble" style={{ animationDelay: '3.1s' }} />
    </svg>
  );
};

export default ClerkScene;
