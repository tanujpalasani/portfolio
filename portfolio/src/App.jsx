import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import Navbar       from './components/Navbar';
import Hero         from './components/Hero';
import About        from './components/About';
import Skills       from './components/Skills';
import Projects     from './components/Projects';
import Achievements from './components/Achievements';
import Contact      from './components/Contact';
import Footer       from './components/Footer';

// ─── Canvas Particle Network ────────────────────────────────────────────────
function ParticleCanvas({ darkMode }) {
  const canvasRef = useRef(null);
  const rafRef    = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let W = window.innerWidth;
    let H = document.documentElement.scrollHeight;

    const resize = () => {
      W = window.innerWidth;
      H = document.documentElement.scrollHeight;
      canvas.width  = W;
      canvas.height = H;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(document.body);

    const COLORS_DARK  = ['rgba(20,184,166,', 'rgba(6,182,212,',  'rgba(139,92,246,', 'rgba(245,158,11,'];
    const COLORS_LIGHT = ['rgba(13,148,136,', 'rgba(8,145,178,',  'rgba(124,58,237,', 'rgba(217,119,6,'];
    const COUNT = Math.min(60, Math.floor(W / 22));

    const particles = Array.from({ length: COUNT }, () => ({
      x:   Math.random() * W,
      y:   Math.random() * H,
      vx:  (Math.random() - 0.5) * 0.35,
      vy:  (Math.random() - 0.5) * 0.35,
      r:   1.2 + Math.random() * 2,
      ci:  Math.floor(Math.random() * 4),
      o:   0.35 + Math.random() * 0.45,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      const palette = darkMode ? COLORS_DARK : COLORS_LIGHT;
      const linkDist = 160;
      const linkDistSq = linkDist * linkDist;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = W; else if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H; else if (p.y > H) p.y = 0;

        // dot
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = palette[p.ci] + p.o + ')';
        ctx.fill();

        // links
        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j];
          const dx = p.x - q.x, dy = p.y - q.y;
          const dSq = dx * dx + dy * dy;
          if (dSq < linkDistSq) {
            const alpha = (1 - dSq / linkDistSq) * (darkMode ? 0.14 : 0.09);
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = palette[p.ci] + alpha + ')';
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }
      rafRef.current = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
    };
  }, [darkMode]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0 opacity-70"
    />
  );
}

// ─── Aurora bands ────────────────────────────────────────────────────────────
function Aurora() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {/* band 1 – teal */}
      <motion.div
        className="absolute h-[55vh] w-[90vw] rounded-full blur-[120px]"
        style={{ background: 'radial-gradient(ellipse, rgba(20,184,166,0.18) 0%, transparent 70%)', top: '-10vh', left: '-10vw' }}
        animate={{ x: [0, 80, -40, 60, 0], y: [0, 40, -20, 30, 0], scale: [1, 1.12, 0.93, 1.05, 1] }}
        transition={{ duration: 28, repeat: Infinity, ease: 'easeInOut' }}
      />
      {/* band 2 – amber / gold */}
      <motion.div
        className="absolute h-[50vh] w-[80vw] rounded-full blur-[110px]"
        style={{ background: 'radial-gradient(ellipse, rgba(245,158,11,0.13) 0%, transparent 70%)', top: '10vh', right: '-15vw' }}
        animate={{ x: [0, -60, 30, -50, 0], y: [0, 60, -30, 50, 0], scale: [1, 0.9, 1.1, 0.95, 1] }}
        transition={{ duration: 22, delay: 4, repeat: Infinity, ease: 'easeInOut' }}
      />
      {/* band 3 – violet */}
      <motion.div
        className="absolute h-[60vh] w-[70vw] rounded-full blur-[130px]"
        style={{ background: 'radial-gradient(ellipse, rgba(139,92,246,0.12) 0%, transparent 70%)', top: '35vh', left: '20vw' }}
        animate={{ x: [0, 50, -70, 30, 0], y: [0, -50, 30, -40, 0], scale: [1, 1.08, 0.96, 1.04, 1] }}
        transition={{ duration: 32, delay: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
      {/* band 4 – cyan bottom */}
      <motion.div
        className="absolute h-[40vh] w-[65vw] rounded-full blur-[100px]"
        style={{ background: 'radial-gradient(ellipse, rgba(6,182,212,0.11) 0%, transparent 70%)', bottom: '-5vh', right: '10vw' }}
        animate={{ x: [0, -40, 60, -30, 0], y: [0, -40, 20, -30, 0], scale: [1, 1.1, 0.92, 1.06, 1] }}
        transition={{ duration: 25, delay: 12, repeat: Infinity, ease: 'easeInOut' }}
      />
      {/* band 5 – rose accent */}
      <motion.div
        className="absolute h-[35vh] w-[55vw] rounded-full blur-[100px]"
        style={{ background: 'radial-gradient(ellipse, rgba(244,63,94,0.07) 0%, transparent 70%)', top: '60vh', left: '-5vw' }}
        animate={{ x: [0, 70, -30, 50, 0], y: [0, 30, -50, 20, 0], scale: [1, 1.06, 0.94, 1.03, 1] }}
        transition={{ duration: 36, delay: 6, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  );
}

// ─── Dot grid overlay ────────────────────────────────────────────────────────
function DotGrid() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 opacity-[0.022] dark:opacity-[0.045]"
      style={{
        backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)',
        backgroundSize: '28px 28px',
        color: '#14b8a6',
      }}
    />
  );
}

// ─── Noise grain overlay ──────────────────────────────────────────────────────
function Grain() {
  return (
    <div
      className="grain-overlay pointer-events-none fixed inset-0 z-[1] opacity-[0.028] dark:opacity-[0.045]"
    />
  );
}

// ─── Enhanced cursor spotlight ───────────────────────────────────────────────
function CursorSpot({ darkMode }) {
  const mx = useMotionValue(-600);
  const my = useMotionValue(-600);
  const sx = useSpring(mx, { stiffness: 60, damping: 18 });
  const sy = useSpring(my, { stiffness: 60, damping: 18 });

  // second ring – lags more
  const sx2 = useSpring(mx, { stiffness: 30, damping: 16 });
  const sy2 = useSpring(my, { stiffness: 30, damping: 16 });

  useEffect(() => {
    const move = (e) => { mx.set(e.clientX); my.set(e.clientY); };
    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, [mx, my]);

  const alpha = darkMode ? '0.15' : '0.08';
  const alpha2 = darkMode ? '0.06' : '0.035';

  return (
    <>
      {/* Primary glow */}
      <motion.div
        className="pointer-events-none fixed z-[2] rounded-full"
        style={{
          width: 520, height: 520,
          x: useTransform(sx, v => v - 260),
          y: useTransform(sy, v => v - 260),
          background: `radial-gradient(circle, rgba(20,184,166,${alpha}) 0%, rgba(6,182,212,${alpha}) 30%, transparent 70%)`,
          filter: 'blur(1px)',
        }}
      />
      {/* Secondary ring – larger, slower */}
      <motion.div
        className="pointer-events-none fixed z-[2] rounded-full"
        style={{
          width: 900, height: 900,
          x: useTransform(sx2, v => v - 450),
          y: useTransform(sy2, v => v - 450),
          background: `radial-gradient(circle, rgba(139,92,246,${alpha2}) 0%, transparent 65%)`,
          filter: 'blur(2px)',
        }}
      />
    </>
  );
}

export default function App() {
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('theme');
      if (stored) return stored === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return true;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) { root.classList.add('dark'); localStorage.setItem('theme', 'dark'); }
    else { root.classList.remove('dark'); localStorage.setItem('theme', 'light'); }
  }, [darkMode]);

  return (
    <div className="min-h-screen text-slate-900 dark:text-slate-100">
      {/* ── Layer 0: animated gradient body bg handled via CSS ── */}

      {/* ── Layer 1: Aurora bands ── */}
      <Aurora />

      {/* ── Layer 2: Particle network canvas ── */}
      <ParticleCanvas darkMode={darkMode} />

      {/* ── Layer 3: Dot grid ── */}
      <DotGrid />

      {/* ── Layer 4: Noise grain texture ── */}
      <Grain />

      {/* ── Layer 5: Cursor dual-spotlight (desktop only) ── */}
      <div className="hidden lg:block">
        <CursorSpot darkMode={darkMode} />
      </div>

      <Navbar darkMode={darkMode} toggleDark={() => setDarkMode(!darkMode)} />
      <main className="relative z-10">
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Achievements />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
