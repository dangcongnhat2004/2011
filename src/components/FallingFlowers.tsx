import { useEffect, useRef } from 'react';

interface FallingFlowersProps {
  active: boolean;
  burstKey?: number;
}

interface Petal {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  swayAmp: number;
  swayFreq: number;
  angle: number;
  spin: number;
  opacity: number;
  kind: 'sakura' | 'petal' | 'heart';
  color: string;
  phase: number;
}

const PALETTE_SAKURA = ['#FBCFE8', '#F9A8D4', '#FFF1F2', '#BAE6FD', '#93C5FD'];

export function FallingFlowers({ active, burstKey = 0 }: FallingFlowersProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const petalsRef = useRef<Petal[]>([]);

  useEffect(() => {
    if (!active || burstKey === 0) return;
    const width = window.innerWidth;
    const extra: Petal[] = Array.from({ length: 18 }, (_, idx) => ({
      x: width * (0.15 + Math.random() * 0.7),
      y: -15 - Math.random() * 60,
      size: 7 + Math.random() * 6,
      speedY: 1.5 + Math.random() * 1.4,
      speedX: -0.9 + Math.random() * 1.8,
      swayAmp: 0.7 + Math.random() * 1.1,
      swayFreq: 0.015 + Math.random() * 0.015,
      angle: Math.random() * Math.PI * 2,
      spin: -0.03 + Math.random() * 0.06,
      opacity: 0.8 + Math.random() * 0.2,
      kind: idx % 3 === 0 ? 'heart' : idx % 2 === 0 ? 'sakura' : 'petal',
      color: PALETTE_SAKURA[idx % PALETTE_SAKURA.length],
      phase: Math.random() * Math.PI * 2,
    }));
    petalsRef.current = [...petalsRef.current.slice(-55), ...extra];
  }, [active, burstKey]);

  useEffect(() => {
    if (!active) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const count = Math.min(46, Math.max(24, Math.floor(width / 32)));
    petalsRef.current = Array.from({ length: count }, (_, idx) => {
      const kind: Petal['kind'] = idx % 5 === 0 ? 'heart' : idx % 2 === 0 ? 'sakura' : 'petal';
      const color = PALETTE_SAKURA[idx % PALETTE_SAKURA.length];

      return {
        x: Math.random() * width,
        y: Math.random() * -height,
        size: kind === 'sakura' ? 7 + Math.random() * 5 : 6 + Math.random() * 5.5,
        speedY: 0.75 + Math.random() * 1.15,
        speedX: -0.3 + Math.random() * 0.6,
        swayAmp: 0.45 + Math.random() * 0.9,
        swayFreq: 0.009 + Math.random() * 0.012,
        angle: Math.random() * Math.PI * 2,
        spin: -0.018 + Math.random() * 0.036,
        opacity: 0.62 + Math.random() * 0.34,
        kind,
        color,
        phase: Math.random() * Math.PI * 2,
      };
    });

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    let frame = 0;
    let rafId = 0;

    const drawPetal = (p: Petal) => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.angle);
      ctx.globalAlpha = p.opacity;

      if (p.kind === 'sakura') {
        ctx.fillStyle = p.color;
        for (let i = 0; i < 5; i += 1) {
          ctx.rotate((Math.PI * 2) / 5);
          ctx.beginPath();
          ctx.ellipse(0, p.size * 0.52, p.size * 0.34, p.size * 0.52, 0, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.fillStyle = '#F59E0B';
        ctx.beginPath();
        ctx.arc(0, 0, p.size * 0.2, 0, Math.PI * 2);
        ctx.fill();
      } else if (p.kind === 'heart') {
        ctx.fillStyle = p.color;
        const s = p.size * 0.55;
        ctx.beginPath();
        ctx.moveTo(0, s * 0.6);
        ctx.bezierCurveTo(-s * 1.3, -s * 0.3, -s * 0.7, -s * 1.3, 0, -s * 0.4);
        ctx.bezierCurveTo(s * 0.7, -s * 1.3, s * 1.3, -s * 0.3, 0, s * 0.6);
        ctx.fill();
      } else {
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.moveTo(0, -p.size * 0.85);
        ctx.bezierCurveTo(p.size * 0.8, -p.size * 0.3, p.size * 0.6, p.size * 0.8, 0, p.size * 0.9);
        ctx.bezierCurveTo(-p.size * 0.6, p.size * 0.8, -p.size * 0.8, -p.size * 0.3, 0, -p.size * 0.85);
        ctx.fill();
      }

      ctx.restore();
    };

    const tick = () => {
      frame += 1;
      ctx.clearRect(0, 0, width, height);

      for (const p of petalsRef.current) {
        p.y += p.speedY;
        p.x += p.speedX + Math.sin(frame * p.swayFreq + p.phase) * p.swayAmp;
        p.angle += p.spin;

        if (p.y > height + 24) {
          p.y = -24;
          p.x = Math.random() * width;
        }
        if (p.x > width + 24) p.x = -24;
        if (p.x < -24) p.x = width + 24;

        drawPetal(p);
      }

      rafId = window.requestAnimationFrame(tick);
    };

    rafId = window.requestAnimationFrame(tick);

    return () => {
      window.cancelAnimationFrame(rafId);
      window.removeEventListener('resize', handleResize);
    };
  }, [active]);

  if (!active) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-30 h-full w-full"
    />
  );
}
