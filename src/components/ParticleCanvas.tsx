import React, { useEffect, useRef } from 'react';
import { Particle, MousePosition } from '../types';

const PARTICLE_COUNT_DESKTOP = 100;
const PARTICLE_COUNT_MOBILE = 40;
const CONNECTION_DISTANCE = 140;
const MOUSE_RADIUS = 250;
const SCAN_RADIUS = 120; // Radius where coordinates appear
const CLICK_PULL_FORCE = 0.08;
const CLICK_SWIRL_FORCE = 0.02;

// Japandi palette for particles
const COLORS = ['#4A5D4F', '#8C7B6D', '#2C2A25'];

const ParticleCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number>(0);
  const mouseRef = useRef<MousePosition>({ x: -1000, y: -1000 });
  const isMouseDownRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let particles: Particle[] = [];
    let width = window.innerWidth;
    let height = window.innerHeight;

    const setCanvasSize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      initParticles();
    };

    const initParticles = () => {
      particles = [];
      const count = width < 768 ? PARTICLE_COUNT_MOBILE : PARTICLE_COUNT_DESKTOP;
      
      for (let i = 0; i < count; i++) {
        // Much slower base velocity for a relaxing feel
        const baseVx = (Math.random() - 0.5) * 0.2;
        const baseVy = (Math.random() - 0.5) * 0.2;
        
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: baseVx,
          vy: baseVy,
          baseVx: baseVx,
          baseVy: baseVy,
          size: Math.random() * 2 + 0.5,
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
          hasLabel: Math.random() > 0.6 // 40% of particles have metadata
        });
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p, index) => {
        // 1. Physics: Return to base velocity (Damping)
        // This prevents the "stress" of constantly increasing speed.
        // The particle smoothly interpolates back to its calm wandering state.
        p.vx += (p.baseVx - p.vx) * 0.05;
        p.vy += (p.baseVy - p.vy) * 0.05;

        // 2. Update Position
        p.x += p.vx;
        p.y += p.vy;

        // 3. Boundary wrap (infinite canvas feel)
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        // 4. Mouse Interaction
        const dx = mouseRef.current.x - p.x;
        const dy = mouseRef.current.y - p.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Mouse interaction: pull while clicking, repel while idle
        if (distance < MOUSE_RADIUS && distance > 0.001) {
          const forceDirectionX = dx / distance;
          const forceDirectionY = dy / distance;
          const force = (MOUSE_RADIUS - distance) / MOUSE_RADIUS;

          if (isMouseDownRef.current) {
            // Playful tug toward the cursor with a tiny swirl so particles orbit slightly
            p.vx += forceDirectionX * force * CLICK_PULL_FORCE;
            p.vy += forceDirectionY * force * CLICK_PULL_FORCE;
            p.vx += -forceDirectionY * force * CLICK_SWIRL_FORCE;
            p.vy += forceDirectionX * force * CLICK_SWIRL_FORCE;
          } else {
            // Gentle repulsion when idle
            // We affect velocity directly, but the damping above (step 1) will clean it up
            p.vx -= forceDirectionX * force * 0.03;
            p.vy -= forceDirectionY * force * 0.03;
          }
        }

        // 5. Draw Point
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();

        // 6. Draw Connections
        for (let j = index + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const distX = p.x - p2.x;
          const distY = p.y - p2.y;
          const dist = Math.sqrt(distX * distX + distY * distY);

          if (dist < CONNECTION_DISTANCE) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(74, 93, 79, ${0.6 * (1 - dist / CONNECTION_DISTANCE)})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }

        // 7. Playful Data (Coordinates/Scanner)
        // Only show if close to mouse AND particle has the label flag
        if (distance < SCAN_RADIUS && p.hasLabel) {
            ctx.font = '10px monospace';
            ctx.fillStyle = 'rgba(140, 123, 109, 0.8)'; // Soft brown
            // Calculate a "techy" coordinate relative to screen center
            const relX = Math.round(p.x - width/2);
            const relY = Math.round(p.y - height/2);
            ctx.fillText(`[${relX}, ${relY}]`, p.x + 8, p.y - 8);
            
            // Draw a tiny connecting line to the label
            ctx.beginPath();
            ctx.strokeStyle = 'rgba(140, 123, 109, 0.4)';
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p.x + 6, p.y - 6);
            ctx.stroke();
        }
      });

      requestRef.current = requestAnimationFrame(animate);
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    };

    const handleTouchMove = (e: TouchEvent) => {
      const rect = canvas.getBoundingClientRect();
      if (e.touches.length > 0) {
        mouseRef.current = {
          x: e.touches[0].clientX - rect.left,
          y: e.touches[0].clientY - rect.top
        };
      }
    };

    const handleMouseDown = () => {
      isMouseDownRef.current = true;
    };

    const handleMouseUp = () => {
      isMouseDownRef.current = false;
    };

    const handleMouseLeave = () => {
      isMouseDownRef.current = false;
    };

    const handleTouchStart = () => {
      isMouseDownRef.current = true;
    };

    const handleTouchEnd = () => {
      isMouseDownRef.current = false;
    };

    window.addEventListener('resize', setCanvasSize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchend', handleTouchEnd);
    
    setCanvasSize();
    animate();

    return () => {
      window.removeEventListener('resize', setCanvasSize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
      cancelAnimationFrame(requestRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0"
    />
  );
};

export default ParticleCanvas;
