import React from 'react';
import { useReveal } from '../hooks/useReveal';

interface RevealProps {
  children: React.ReactNode;
  /** Stagger index: each step delays the reveal by ~90ms. */
  index?: number;
  as?: 'div' | 'section' | 'article' | 'li';
  className?: string;
}

const STAGGER_MS = 90;

/**
 * Wraps content so it rises and fades in when scrolled into view.
 * Honours reduced motion (renders revealed immediately, no transition).
 */
const Reveal: React.FC<RevealProps> = ({ children, index = 0, as = 'div', className = '' }) => {
  const { ref, revealed } = useReveal<HTMLElement>();
  const Tag = as as React.ElementType;
  return (
    <Tag
      ref={ref}
      data-revealed={revealed}
      className={`reveal ${className}`}
      style={{ transitionDelay: `${index * STAGGER_MS}ms` }}
    >
      {children}
    </Tag>
  );
};

export default Reveal;
