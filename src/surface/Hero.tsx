import React, { useEffect, useRef } from 'react';
import { Mail, Phone, PenTool, Linkedin } from 'lucide-react';
import { useParallax } from '../hooks/useParallax';
import { useReducedMotion } from '../hooks/useMediaPreferences';

// Email and phone are assembled at render time from parts, so the
// complete address never appears as a contiguous string in either the
// served HTML or the JS bundle. Cheap insurance against harvesters.
const EMAIL = ['sander', 'riedberg.se'].join('@');
const PHONE_PARTS = ['+46', '70', '720', '88', '88'] as const;
const PHONE_DISPLAY = PHONE_PARTS.join(' ');
const PHONE_HREF = `tel:${PHONE_PARTS.join('')}`;

const CONTACTS = [
  { label: EMAIL, href: `mailto:${EMAIL}`, icon: Mail, external: false },
  { label: PHONE_DISPLAY, href: PHONE_HREF, icon: Phone, external: false },
  { label: 'blog.riedberg.se', href: 'https://blog.riedberg.se', icon: PenTool, external: true },
  { label: 'linkedin', href: 'https://www.linkedin.com/in/sander-riedberg/', icon: Linkedin, external: true },
] as const;

const DISC_GRADIENT =
  'radial-gradient(circle at center, var(--disc) 0%, var(--disc) 16%, var(--disc-glow) 40%, transparent 72%)';

/**
 * Full-viewport sky. The gradient, the disc and the text colour all
 * follow the visitor's local time via data-time CSS variables. The sun
 * and grid drift gently with scroll; a soft light follows the pointer.
 */
const Hero: React.FC = () => {
  const reducedMotion = useReducedMotion();
  const headerRef = useRef<HTMLElement>(null);
  const discWrap = useParallax<HTMLDivElement>(0.16);
  const gridRef = useParallax<HTMLDivElement>(0.08);

  // Soft pointer light. Cheap style mutation, no re-render; off when the
  // visitor prefers reduced motion.
  useEffect(() => {
    if (reducedMotion) return;
    const el = headerRef.current;
    if (!el) return;
    let frame = 0;
    const onMove = (e: PointerEvent) => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const rect = el.getBoundingClientRect();
        const mx = ((e.clientX - rect.left) / rect.width) * 100;
        const my = ((e.clientY - rect.top) / rect.height) * 100;
        el.style.setProperty('--mx', `${mx.toFixed(1)}%`);
        el.style.setProperty('--my', `${my.toFixed(1)}%`);
      });
    };
    el.addEventListener('pointermove', onMove);
    return () => {
      el.removeEventListener('pointermove', onMove);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [reducedMotion]);

  return (
    <header
      ref={headerRef}
      className="grain pointer-light relative flex min-h-[100svh] flex-col overflow-hidden"
      style={{
        background:
          'linear-gradient(to bottom, var(--sky-top) 0%, var(--sky-mid) 55%, var(--sky-low) 100%)',
        color: 'var(--hero-ink)',
      }}
    >
      {/* Faint chart grid, drifting */}
      <div
        ref={gridRef}
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.05]"
        style={{
          transform: 'translate3d(0, var(--parallax, 0), 0)',
          backgroundImage:
            'linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)',
          backgroundSize: '120px 120px',
        }}
      />

      {/* Sun or moon, depending on when you arrive */}
      <div
        ref={discWrap}
        aria-hidden="true"
        className="absolute"
        style={{
          left: 'var(--disc-x)',
          top: 'var(--disc-y)',
          transform: 'translate3d(0, var(--parallax, 0), 0)',
        }}
      >
        <div
          className="h-64 w-64 -translate-x-1/2 -translate-y-1/2 anim-bob"
          style={{ background: DISC_GRADIENT }}
        />
      </div>

      {/* Horizon glow at the bottom edge */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-24"
        style={{ background: 'linear-gradient(to top, var(--horizon-glow), transparent)' }}
      />

      <div className="relative z-10 flex items-baseline justify-between px-6 pt-6 font-mono text-[11px] uppercase tracking-[0.22em] md:px-10 anim-rise" style={{ color: 'var(--hero-sub)' }}>
        <span>riedberg.se</span>
        <span className="hidden sm:inline">59.31° N · 18.16° E — Nacka, Sweden</span>
        <span className="sm:hidden">59.31° N · 18.16° E</span>
      </div>

      <div className="relative z-10 flex flex-1 flex-col justify-center px-6 md:px-10">
        <p
          className="anim-rise mb-5 font-mono text-[11px] uppercase tracking-[0.3em]"
          style={{ color: 'var(--hero-sub)', animationDelay: '0.15s' }}
        >
          Technology &amp; Regulatory Quality
        </p>
        <h1
          className="anim-rise max-w-4xl font-serif text-6xl font-medium leading-[0.98] tracking-tight md:text-8xl"
          style={{ animationDelay: '0.3s' }}
        >
          Sander Riedberg
        </h1>
        <p
          className="anim-rise mt-7 max-w-md font-serif text-lg italic leading-relaxed md:text-xl"
          style={{ color: 'var(--hero-sub)', animationDelay: '0.5s' }}
        >
          I help make medical technology worth trusting - and I like that
          the right answer is rarely simple.
        </p>
      </div>

      <div className="relative z-10 flex flex-col gap-5 px-6 pb-10 md:flex-row md:items-end md:justify-between md:px-10">
        <nav
          aria-label="Contact"
          className="anim-rise flex flex-wrap gap-x-7 gap-y-3 font-mono text-xs tracking-wide"
          style={{ animationDelay: '0.65s' }}
        >
          {CONTACTS.map(({ label, href, icon: Icon, external }) => (
            <a
              key={href}
              href={href}
              {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              className="contact-link group inline-flex items-center gap-2 opacity-80 transition-opacity hover:opacity-100"
            >
              <span
                className="contact-tile inline-flex h-7 w-7 items-center justify-center rounded-md border"
                style={{ borderColor: 'color-mix(in srgb, currentColor 22%, transparent)' }}
              >
                <Icon size={13} aria-hidden="true" />
              </span>
              <span className="contact-underline">{label}</span>
            </a>
          ))}
        </nav>
        <a
          href="#who"
          className="anim-rise inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.22em] opacity-70 transition-opacity hover:opacity-100"
          style={{ animationDelay: '0.8s' }}
        >
          Soundings below ↓
        </a>
      </div>
    </header>
  );
};

export default Hero;
