import React, { useEffect, useRef } from 'react';
import { clamp } from '../lib/scrollMath';
import { useReducedMotion } from '../hooks/useMediaPreferences';

interface ClerkSceneProps {
  /** Today's visitors; drives the gauge needle. Null = off duty. */
  visitorsToday: number | null;
}

const GAUGE_MAX = 30;
const BRASS = '#e0a458';

/**
 * The counting house, engraved: a Victorian clerk in a top hat keeps
 * the ledger with a quill, perched beside the owner's server, while a
 * geared tallying machine takes its feed down the cable. Hand-drawn
 * SVG in a copperplate manner - hatched shading, monochrome lines, one
 * brass accent - in three depth layers that lean with the pointer.
 * Reduced motion stills the quill, the gears and the parallax alike.
 */
const ClerkScene: React.FC<ClerkSceneProps> = ({ visitorsToday }) => {
  const reducedMotion = useReducedMotion();
  const wrapRef = useRef<HTMLDivElement>(null);

  const fraction = visitorsToday === null ? 0 : clamp(visitorsToday / GAUGE_MAX, 0, 1);
  const needleAngle = -80 + fraction * 160;

  // 2.5D: the layers lean a few px toward the pointer.
  useEffect(() => {
    if (reducedMotion) return;
    const el = wrapRef.current;
    if (!el) return;
    let frame = 0;
    let cancelled = false;
    const onMove = (e: PointerEvent) => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        if (cancelled) return;
        const rect = el.getBoundingClientRect();
        const px = clamp(((e.clientX - rect.left) / rect.width) * 2 - 1, -1, 1);
        const py = clamp(((e.clientY - rect.top) / rect.height) * 2 - 1, -1, 1);
        el.style.setProperty('--plx', px.toFixed(3));
        el.style.setProperty('--ply', py.toFixed(3));
      });
    };
    const onLeave = () => {
      el.style.setProperty('--plx', '0');
      el.style.setProperty('--ply', '0');
    };
    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerleave', onLeave);
    return () => {
      cancelled = true;
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerleave', onLeave);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [reducedMotion]);

  const layer = (depth: number): React.CSSProperties => ({
    transform: `translate3d(calc(var(--plx, 0) * ${depth}px), calc(var(--ply, 0) * ${depth * 0.6}px), 0)`,
    transition: 'transform 0.5s cubic-bezier(0.2, 0.6, 0.2, 1)',
  });

  return (
    <div ref={wrapRef}>
      <svg
        viewBox="0 0 480 320"
        className="w-full max-w-[460px]"
        aria-hidden="true"
        style={{ color: '#bfd6dd' }}
      >
        <defs>
          <pattern id="hatchA" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="5" stroke="currentColor" strokeWidth="0.55" opacity="0.3" />
          </pattern>
          <pattern id="hatchX" width="4.5" height="4.5" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="4.5" stroke="currentColor" strokeWidth="0.55" opacity="0.4" />
            <line x1="0" y1="2.2" x2="4.5" y2="2.2" stroke="currentColor" strokeWidth="0.45" opacity="0.3" />
          </pattern>
        </defs>

        {/* ---- Back layer: floor and the server ---- */}
        <g style={layer(3)}>
          <line x1="14" y1="292" x2="466" y2="292" stroke="currentColor" strokeOpacity="0.35" />
          {/* floor hatching strip */}
          <rect x="14" y="292" width="452" height="9" fill="url(#hatchA)" opacity="0.5" />

          <g stroke="currentColor" strokeOpacity="0.8" fill="none" strokeWidth="1.6">
            <rect x="38" y="158" width="102" height="134" rx="4" />
            {/* side shading */}
            <rect x="118" y="158" width="22" height="134" fill="url(#hatchA)" stroke="none" />
            <line x1="38" y1="186" x2="140" y2="186" strokeOpacity="0.4" />
            <line x1="38" y1="214" x2="140" y2="214" strokeOpacity="0.4" />
            <line x1="38" y1="242" x2="140" y2="242" strokeOpacity="0.4" />
            <line x1="38" y1="270" x2="140" y2="270" strokeOpacity="0.4" />
            {/* vents */}
            <g strokeOpacity="0.35" strokeWidth="1">
              <line x1="48" y1="166" x2="48" y2="180" /><line x1="56" y1="166" x2="56" y2="180" />
              <line x1="64" y1="166" x2="64" y2="180" /><line x1="72" y1="166" x2="72" y2="180" />
              <line x1="48" y1="194" x2="48" y2="208" /><line x1="56" y1="194" x2="56" y2="208" />
              <line x1="64" y1="194" x2="64" y2="208" /><line x1="72" y1="194" x2="72" y2="208" />
            </g>
          </g>
          <text x="46" y="286" fontSize="8" fill="currentColor" fillOpacity="0.5" fontFamily="monospace">
            ubuntu-server
          </text>
          <circle cx="128" cy="170" r="2" fill="#5fd3bc" className="anim-led" />
          <circle cx="128" cy="198" r="2" fill="#5fd3bc" className="anim-led" style={{ animationDelay: '0.9s' }} />
          <circle cx="128" cy="226" r="2" fill={BRASS} className="anim-led" style={{ animationDelay: '1.5s' }} />

          {/* bubbles live deep in the scene */}
          <circle cx="90" cy="140" r="2.6" fill="none" stroke="currentColor" strokeOpacity="0.45" className="anim-bubble" />
          <circle cx="300" cy="120" r="2" fill="none" stroke="currentColor" strokeOpacity="0.45" className="anim-bubble" style={{ animationDelay: '1.8s' }} />
          <circle cx="440" cy="130" r="1.7" fill="none" stroke="currentColor" strokeOpacity="0.45" className="anim-bubble" style={{ animationDelay: '3.2s' }} />
        </g>

        {/* ---- Middle layer: cable and the tallying machine ---- */}
        <g style={layer(6)}>
          <path
            d="M 140 282 C 200 286 260 286 330 262"
            fill="none"
            stroke="#5fd3bc"
            strokeOpacity="0.45"
            strokeWidth="1.4"
            strokeDasharray="3 9"
            className="anim-dataflow"
          />

          <g stroke="currentColor" strokeOpacity="0.85" fill="none" strokeWidth="1.6">
            {/* cabinet */}
            <rect x="332" y="178" width="104" height="84" rx="6" />
            <rect x="414" y="178" width="22" height="84" fill="url(#hatchA)" stroke="none" />
            {/* legs */}
            <line x1="344" y1="262" x2="338" y2="292" />
            <line x1="424" y1="262" x2="430" y2="292" />
            {/* punched tape spilling out and curling on the floor */}
            <path d="M 436 236 q 22 6 24 26 q 2 16 -12 22 q -10 5 -6 8" strokeOpacity="0.5" strokeWidth="1.2" />
            <path d="M 436 240 q 16 8 16 22" strokeOpacity="0.3" strokeWidth="1" />
          </g>

          {/* gears: dashed rings read as teeth */}
          <g className="anim-crank-wheel" style={{ transformOrigin: '362px 220px' }}>
            <circle cx="362" cy="220" r="17" fill="none" stroke="currentColor" strokeWidth="5" strokeDasharray="4.5 3.2" strokeOpacity="0.85" />
            <circle cx="362" cy="220" r="8" fill="none" stroke="currentColor" strokeWidth="1.4" strokeOpacity="0.7" />
            <line x1="354" y1="220" x2="370" y2="220" stroke="currentColor" strokeOpacity="0.7" strokeWidth="1.2" />
            <line x1="362" y1="212" x2="362" y2="228" stroke="currentColor" strokeOpacity="0.7" strokeWidth="1.2" />
            <circle cx="362" cy="220" r="2.4" fill={BRASS} />
          </g>
          <g className="anim-gear-ccw" style={{ transformOrigin: '394px 207px' }}>
            <circle cx="394" cy="207" r="10" fill="none" stroke="currentColor" strokeWidth="4" strokeDasharray="3.4 2.6" strokeOpacity="0.75" />
            <circle cx="394" cy="207" r="2" fill="currentColor" fillOpacity="0.7" />
          </g>
          <rect x="350" y="240" width="56" height="14" rx="2" stroke={BRASS} strokeOpacity="0.55" fill="none" />
          <text x="357" y="250" fontSize="8" fill={BRASS} fillOpacity="0.85" fontFamily="monospace">
            TALLY
          </text>

          {/* gauge on top of the machine */}
          <g stroke="currentColor" strokeOpacity="0.85" fill="none" strokeWidth="1.5">
            <path d="M 360 172 A 26 26 0 0 1 412 172" />
            <line x1="360" y1="172" x2="412" y2="172" strokeOpacity="0.4" />
            <line x1="364" y1="160" x2="368" y2="163" strokeOpacity="0.5" />
            <line x1="386" y1="148" x2="386" y2="153" strokeOpacity="0.5" />
            <line x1="408" y1="160" x2="404" y2="163" strokeOpacity="0.5" />
          </g>
          <line
            x1="386" y1="172" x2="386" y2="152"
            stroke={BRASS} strokeWidth="2" strokeLinecap="round"
            style={{
              transformOrigin: '386px 172px',
              transform: `rotate(${needleAngle.toFixed(1)}deg)`,
              transition: 'transform 1.8s cubic-bezier(0.25, 0.8, 0.3, 1)',
            }}
          />
          <circle cx="386" cy="172" r="2.6" fill={BRASS} />
          <text x="362" y="186" fontSize="7" fill="currentColor" fillOpacity="0.5" fontFamily="monospace">
            souls today
          </text>
        </g>

        {/* ---- Front layer: the clerk at his standing desk ---- */}
        <g style={layer(10)} stroke="currentColor" fill="none" strokeWidth="1.7" strokeLinecap="round" strokeOpacity="0.95">
          {/* frock coat, hatched, leaning slightly into the work */}
          <path
            d="M 200 166 Q 192 170 190 186 Q 186 214 190 246 L 186 254 L 198 256 L 200 250 Q 208 252 214 250 L 217 256 L 228 253 L 222 244 Q 224 212 218 188 Q 215 172 210 166 Q 205 163 200 166 Z"
            fill="url(#hatchA)"
            strokeWidth="1.5"
          />
          {/* legs and shoes */}
          <line x1="196" y1="255" x2="195" y2="288" />
          <path d="M 195 288 l -7 4 l 10 0" strokeWidth="1.4" />
          <line x1="215" y1="255" x2="217" y2="288" />
          <path d="M 217 288 l 9 4 l -10 0" strokeWidth="1.4" />
          {/* head in clean profile, facing the desk */}
          <path d="M 206 136 Q 214 131 220 136 Q 224 140 224 146 L 228 150 L 223 152 Q 223 157 218 159 Q 210 161 206 155 Q 203 145 206 136 Z" />
          {/* eye */}
          <line x1="218" y1="144" x2="221" y2="144" strokeWidth="1.3" strokeOpacity="0.8" />
          {/* collar knot */}
          <path d="M 207 161 q 4 3 8 1" strokeOpacity="0.7" strokeWidth="1.2" />
          {/* top hat, hatched crown */}
          <path d="M 196 134 L 230 134" strokeWidth="2" />
          <path d="M 201 134 L 201 112 Q 213 106 225 111 L 225 134 Z" fill="url(#hatchX)" strokeWidth="1.5" />
          <line x1="201" y1="127" x2="225" y2="127" strokeOpacity="0.55" strokeWidth="1.1" />
          {/* writing arm: shoulder -> elbow -> wrist */}
          <path d="M 210 178 Q 226 192 238 197 L 252 196" />
          {/* hand + quill, scribbling */}
          <g className="anim-quill" style={{ transformOrigin: '252px 196px' }}>
            <path d="M 252 196 L 257 199" strokeWidth="1.5" />
            {/* nib to paper */}
            <line x1="257" y1="199" x2="262" y2="206" strokeWidth="1.3" />
            {/* feather */}
            <path d="M 257 199 C 262 184 268 172 280 160" strokeWidth="1.4" />
            <path d="M 261 188 q 5 -1 8 -5 M 265 178 q 5 -1 8 -5 M 270 169 q 4 -1 6 -4" strokeOpacity="0.6" strokeWidth="1" />
          </g>
          {/* high desk with slanted top */}
          <path d="M 232 206 L 318 198 L 318 204 L 234 212 Z" fill="url(#hatchA)" strokeWidth="1.5" />
          <line x1="240" y1="212" x2="242" y2="292" />
          <line x1="312" y1="205" x2="314" y2="292" />
          <line x1="240" y1="250" x2="313" y2="246" strokeOpacity="0.45" strokeWidth="1.2" />
          {/* open ledger on the desk */}
          <path d="M 248 203 Q 262 196 276 200 Q 290 194 302 198" strokeWidth="1.3" />
          <path d="M 248 203 L 249 207 Q 263 201 276 204 Q 289 199 303 202 L 302 198" strokeWidth="1.1" strokeOpacity="0.7" />
          <line x1="276" y1="200" x2="276" y2="204" strokeWidth="1" strokeOpacity="0.6" />
          {/* ink pot */}
          <path d="M 306 192 l 8 -1 l -1 6 l -6 1 Z" fill="url(#hatchX)" strokeWidth="1.2" />
        </g>
      </svg>
    </div>
  );
};

export default ClerkScene;
