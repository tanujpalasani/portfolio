import { useEffect, useRef, useState, useCallback } from 'react';
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  AnimatePresence,
  animate,
} from 'framer-motion';
import {
  FaArrowDown, FaEnvelope, FaGithub, FaLinkedin,
  FaPhoneAlt, FaBrain, FaLaptopCode, FaCode,
} from 'react-icons/fa';

// ── Typewriter ─────────────────────────────────────────────────────────────
const ROLES = [
  'ML Engineer',
  'Problem Solver',
  'Full-Stack Developer',
  'Competitive Programmer',
  'CS @ LPU',
];

function Typewriter() {
  const [roleIdx, setRoleIdx] = useState(0);
  const [displayed, setDisplayed] = useState('');
  const [phase, setPhase] = useState('typing'); // typing | pause | erasing
  const tick = useRef(null);

  useEffect(() => {
    const role = ROLES[roleIdx];
    if (phase === 'typing') {
      if (displayed.length < role.length) {
        tick.current = setTimeout(() => setDisplayed(role.slice(0, displayed.length + 1)), 60);
      } else {
        tick.current = setTimeout(() => setPhase('pause'), 1600);
      }
    } else if (phase === 'pause') {
      tick.current = setTimeout(() => setPhase('erasing'), 400);
    } else {
      if (displayed.length > 0) {
        tick.current = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 38);
      } else {
        tick.current = setTimeout(() => {
          setRoleIdx((i) => (i + 1) % ROLES.length);
          setPhase('typing');
        }, 80);
      }
    }
    return () => clearTimeout(tick.current);
  }, [displayed, phase, roleIdx]);

  return (
    <span className="relative inline-block min-w-[2ch]">
      <span className="bg-gradient-to-r from-teal-500 via-cyan-400 to-sky-500 bg-clip-text font-black text-transparent">
        {displayed}
      </span>
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.5, repeat: Infinity, repeatType: 'reverse' }}
        className="ml-0.5 inline-block h-[1em] w-[3px] translate-y-[2px] rounded-sm bg-teal-500"
      />
    </span>
  );
}

// ── Letter-stagger title ────────────────────────────────────────────────────
function SplitWord({ word, delay = 0 }) {
  return (
    <span className="inline-block overflow-hidden">
      {[...word].map((ch, i) => (
        <motion.span
          key={i}
          initial={{ y: '110%', opacity: 0, rotateX: -60 }}
          animate={{ y: 0, opacity: 1, rotateX: 0 }}
          transition={{
            delay: delay + i * 0.035,
            duration: 0.55,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="inline-block"
        >
          {ch}
        </motion.span>
      ))}
    </span>
  );
}

// ── 3-D tilt card ───────────────────────────────────────────────────────────
function TiltCard({ children, className = '' }) {
  const ref = useRef(null);
  const rotX = useMotionValue(0);
  const rotY = useMotionValue(0);
  const sRotX = useSpring(rotX, { stiffness: 200, damping: 28 });
  const sRotY = useSpring(rotY, { stiffness: 200, damping: 28 });
  const glareX = useMotionValue(50);
  const glareY = useMotionValue(50);

  const onMove = useCallback(
    (e) => {
      const rect = ref.current?.getBoundingClientRect();
      if (!rect) return;
      const cx = (e.clientX - rect.left) / rect.width;
      const cy = (e.clientY - rect.top) / rect.height;
      rotX.set((cy - 0.5) * -16);
      rotY.set((cx - 0.5) * 16);
      glareX.set(cx * 100);
      glareY.set(cy * 100);
    },
    [rotX, rotY, glareX, glareY],
  );

  const onLeave = useCallback(() => {
    rotX.set(0);
    rotY.set(0);
    glareX.set(50);
    glareY.set(50);
  }, [rotX, rotY, glareX, glareY]);

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ rotateX: sRotX, rotateY: sRotY, transformStyle: 'preserve-3d' }}
      className={`perspective-1000 ${className}`}
    >
      {/* Glare overlay */}
      <motion.div
        className="pointer-events-none absolute inset-0 z-10 rounded-[inherit] opacity-0 transition-opacity group-hover:opacity-100"
        style={{
          background: useTransform(
            [glareX, glareY],
            ([gx, gy]) =>
              `radial-gradient(circle at ${gx}% ${gy}%, rgba(255,255,255,0.12) 0%, transparent 70%)`,
          ),
        }}
      />
      {children}
    </motion.div>
  );
}

// ── Magnetic button ─────────────────────────────────────────────────────────
function MagBtn({ children, onClick, href, className = '' }) {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 22 });
  const sy = useSpring(y, { stiffness: 200, damping: 22 });

  const onMove = (e) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    x.set((e.clientX - (rect.left + rect.width / 2)) * 0.32);
    y.set((e.clientY - (rect.top + rect.height / 2)) * 0.32);
  };
  const reset = () => { x.set(0); y.set(0); };

  const Tag = href ? motion.a : motion.button;
  const extra = href ? { href, download: true } : { type: 'button', onClick };

  return (
    <Tag
      ref={ref}
      {...extra}
      style={{ x: sx, y: sy }}
      onMouseMove={onMove}
      onMouseLeave={reset}
      whileTap={{ scale: 0.94 }}
      className={className}
    >
      {children}
    </Tag>
  );
}

// ── Floating particle ────────────────────────────────────────────────────────
function Particle({ size, color, style, duration, delay }) {
  return (
    <motion.div
      className={`absolute rounded-full ${color} blur-sm`}
      style={{ width: size, height: size, ...style }}
      animate={{
        y: [0, -40, 10, -25, 0],
        x: [0, 20, -10, 15, 0],
        opacity: [0.5, 0.9, 0.6, 0.85, 0.5],
        scale: [1, 1.15, 0.9, 1.1, 1],
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: 'easeInOut',
        delay,
      }}
    />
  );
}

// ── Count-up stat ────────────────────────────────────────────────────────────
function StatBadge({ value, label }) {
  const nodeRef = useRef(null);
  const [done, setDone] = useState(false);
  const numVal = parseFloat(value.replace(/[^\d.]/g, ''));
  const suffix = value.replace(/[\d.]/g, '');

  useEffect(() => {
    if (done) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        obs.disconnect();
        setDone(true);
        const ctrl = animate(0, numVal, {
          duration: 1.4,
          ease: [0.22, 1, 0.36, 1],
          onUpdate: (v) => {
            if (nodeRef.current)
              nodeRef.current.textContent =
                numVal % 1 === 0 ? Math.round(v) + suffix : v.toFixed(2) + suffix;
          },
        });
        return () => ctrl.stop();
      }
    });
    const el = nodeRef.current?.closest('[data-stat]');
    if (el) obs.observe(el);
    return () => obs.disconnect();
  }, [done, numVal, suffix]);

  return (
    <motion.div
      data-stat
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 260, damping: 22 }}
      whileHover={{ y: -5, scale: 1.04 }}
      className="glass-panel rounded-3xl px-5 py-5"
    >
      <p ref={nodeRef} className="display-font text-3xl font-black text-slate-950 dark:text-white">
        {value}
      </p>
      <p className="mt-1 text-xs font-medium text-slate-500 dark:text-slate-400">{label}</p>
    </motion.div>
  );
}

// ── Socials ──────────────────────────────────────────────────────────────────
const socials = [
  { icon: FaGithub, href: 'https://github.com/tanujpalasani', label: 'GitHub' },
  { icon: FaLinkedin, href: 'https://linkedin.com/in/tanujpalasani', label: 'LinkedIn' },
  { icon: FaEnvelope, href: 'mailto:tanujpalasani@gmail.com', label: 'Email' },
  { icon: FaPhoneAlt, href: 'tel:+917981533673', label: 'Phone' },
];

const stats = [
  { value: '8.71', label: 'CGPA at LPU' },
  { value: '3+', label: 'Major projects' },
  { value: '250+', label: 'LeetCode problems' },
];

const scrollTo = (id) => document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' });

// ── Main Hero ─────────────────────────────────────────────────────────────────
export default function Hero() {
  return (
    <section
      id="home"
      className="section-shell relative overflow-hidden px-4 pb-20 pt-28 sm:px-6 lg:px-8"
    >
      {/* Particles */}
      <div className="pointer-events-none absolute inset-0">
        <Particle size={10} color="bg-teal-400/70" style={{ top: '18%', left: '12%' }} duration={13.2} delay={0.3} />
        <Particle size={8} color="bg-amber-400/70" style={{ top: '35%', left: '75%' }} duration={16.8} delay={1.1} />
        <Particle size={14} color="bg-cyan-400/60" style={{ top: '65%', left: '5%' }} duration={12.7} delay={2.4} />
        <Particle size={7} color="bg-violet-400/70" style={{ top: '20%', left: '55%' }} duration={17.1} delay={0.9} />
        <Particle size={12} color="bg-rose-400/60" style={{ top: '75%', left: '85%' }} duration={14.6} delay={1.8} />
        <Particle size={9} color="bg-sky-400/70" style={{ top: '50%', left: '45%' }} duration={15.4} delay={2.9} />
      </div>

      <div className="mx-auto grid min-h-[calc(100vh-7rem)] max-w-7xl items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
        {/* ── Left Column ── */}
        <div className="space-y-8">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="inline-flex items-center gap-2.5 rounded-full border border-teal-500/25 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-teal-700 dark:border-teal-400/25 dark:bg-slate-900/70 dark:text-teal-300"
          >
            <motion.span
              animate={{ scale: [1, 1.5, 1] }}
              transition={{ duration: 1.8, repeat: Infinity }}
              className="h-2 w-2 rounded-full bg-teal-500"
            />
            Open for internships &amp; collaborations
          </motion.div>

          {/* Name — letter stagger */}
          <div className="space-y-3">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="display-font text-sm font-semibold uppercase tracking-[0.35em] text-slate-500 dark:text-slate-400"
            >
              ML · Web · DSA · Systems
            </motion.p>

            <h1 className="display-font text-5xl font-black leading-[0.92] text-slate-950 dark:text-white sm:text-6xl lg:text-[5.5rem]">
              <div className="overflow-hidden">
                <SplitWord word="Palasani" delay={0.25} />
              </div>
              <div className="overflow-hidden">
                <SplitWord word="Sai Venkata" delay={0.35} />
              </div>
              <div className="overflow-hidden">
                <SplitWord word="Tanuj" delay={0.45} />
              </div>
            </h1>

            {/* Typewriter */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="display-font text-xl font-semibold text-slate-600 dark:text-slate-300 sm:text-2xl"
            >
              <Typewriter />
            </motion.p>
          </div>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.95, duration: 0.6 }}
            className="max-w-xl text-base leading-[1.9] text-slate-600 dark:text-slate-300"
          >
            B.Tech Computer Science student at LPU — building production-ready ML systems,
            full-stack web apps, and algorithmic solutions. Passionate about anomaly detection,
            AI automation, and clean system design.
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.05 }}
            className="flex flex-wrap gap-4"
          >
            <MagBtn
              onClick={() => scrollTo('#projects')}
              className="group relative overflow-hidden rounded-full bg-gradient-to-r from-teal-500 to-cyan-500 px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-teal-500/25 transition-shadow hover:shadow-teal-500/40"
            >
              <span className="relative z-10">Explore Projects</span>
              <motion.span
                className="absolute inset-0 bg-gradient-to-r from-teal-600 to-cyan-600 opacity-0 transition-opacity group-hover:opacity-100"
              />
            </MagBtn>

            <MagBtn
              href="/Resume.pdf"
              className="group relative overflow-hidden rounded-full border border-slate-300/80 bg-white/80 px-8 py-3.5 text-sm font-bold text-slate-800 backdrop-blur transition hover:border-amber-400 hover:text-amber-700 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-100 dark:hover:border-amber-400 dark:hover:text-amber-300"
            >
              Download Resume
            </MagBtn>
          </motion.div>

          {/* Socials */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="flex flex-wrap gap-3"
          >
            {socials.map(({ icon: Icon, href, label }, i) => (
              <motion.a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.25 + i * 0.07, type: 'spring', stiffness: 300, damping: 22 }}
                whileHover={{ y: -4, scale: 1.12 }}
                whileTap={{ scale: 0.92 }}
                className="flex items-center gap-2 rounded-full border border-slate-200/80 bg-white/80 px-4 py-2.5 text-sm font-medium text-slate-700 backdrop-blur transition hover:border-teal-400 hover:text-teal-700 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-200 dark:hover:border-teal-500 dark:hover:text-teal-300"
              >
                <Icon size={14} />
                {label}
              </motion.a>
            ))}
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.35 }}
            className="grid max-w-md grid-cols-3 gap-4"
          >
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.4 + i * 0.1, type: 'spring', stiffness: 260 }}
              >
                <StatBadge {...s} />
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* ── Right Column — 3D Tilt Card ── */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="group"
        >
          <TiltCard className="relative rounded-[2.5rem]">
            <div className="mesh-card rounded-[2.5rem] border border-white/60 p-1.5 shadow-2xl shadow-slate-900/15 dark:border-slate-700/40">
              <div className="rounded-[2.25rem] border border-slate-200/60 bg-slate-950 p-6 text-white dark:border-slate-700/60">
                {/* Header */}
                <div className="mb-6 flex items-start justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-teal-300">
                      Current Focus
                    </p>
                    <h2 className="display-font mt-2 text-2xl font-black leading-[1.1]">
                      Applied AI &amp;<br />System Thinking
                    </h2>
                  </div>
                  <motion.div
                    animate={{ rotate: [0, 8, -8, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                    className="rounded-2xl bg-white/10 p-3"
                  >
                    <FaLaptopCode size={22} className="text-amber-300" />
                  </motion.div>
                </div>

                {/* ML progress card */}
                <div className="mb-4 rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="mb-3 flex items-center gap-3">
                    <div className="rounded-xl bg-teal-400/15 p-2.5 text-teal-300">
                      <FaBrain size={16} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">ML &amp; Anomaly Detection</p>
                      <p className="text-xs text-slate-400">Random Forest · Isolation Forest · Flask</p>
                    </div>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: '86%' }}
                      transition={{ delay: 1, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                      className="h-full rounded-full bg-gradient-to-r from-teal-400 to-cyan-300"
                    />
                  </div>
                  <p className="mt-1.5 text-right text-xs text-teal-300 opacity-70">86%</p>
                </div>

                {/* Tech chips */}
                <div className="mb-4 rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-amber-300">
                    Tech Stack
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {['C', 'C++', 'Python', 'Java', 'HTML', 'CSS', 'JS', 'MySQL', 'Git', 'Linux'].map(
                      (t, i) => (
                        <motion.span
                          key={t}
                          initial={{ opacity: 0, scale: 0.7 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 1.1 + i * 0.04, type: 'spring', stiffness: 300 }}
                          whileHover={{ scale: 1.1, y: -2 }}
                          className="cursor-default rounded-full border border-white/10 bg-white/8 px-3 py-1 text-xs text-slate-100"
                        >
                          {t}
                        </motion.span>
                      ),
                    )}
                  </div>
                </div>

                {/* Info cards */}
                <div className="grid gap-3 sm:grid-cols-2">
                  {[
                    { label: 'Education', value: 'B.Tech CSE @ LPU', icon: FaCode },
                    { label: 'Strength', value: 'Logic → Working products', icon: FaBrain },
                  ].map(({ label, value, icon: Icon }) => (
                    <motion.div
                      key={label}
                      whileHover={{ scale: 1.03, y: -2 }}
                      className="rounded-2xl border border-white/10 bg-white/5 p-4"
                    >
                      <p className="text-xs uppercase tracking-[0.25em] text-slate-400">{label}</p>
                      <p className="mt-2 text-sm font-semibold leading-snug">{value}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </TiltCard>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.button
        type="button"
        onClick={() => scrollTo('#about')}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.8 }}
        className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-1.5"
      >
        <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500">
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          className="rounded-full border border-slate-200/70 bg-white/80 p-1.5 dark:border-slate-700 dark:bg-slate-900/75"
        >
          <FaArrowDown size={10} className="text-slate-500 dark:text-slate-400" />
        </motion.div>
      </motion.button>
    </section>
  );
}
