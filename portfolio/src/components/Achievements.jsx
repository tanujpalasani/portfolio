import { useRef, useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring, useInView, animate } from 'framer-motion';
import { FaCode, FaTrophy, FaFire, FaStar, FaCertificate, FaGithub } from 'react-icons/fa';
import { SiLeetcode, SiCodeforces } from 'react-icons/si';

// ── Spring count-up ───────────────────────────────────────────────────────────
function Counter({ to, suffix = '', prefix = '' }) {
  const nodeRef = useRef(null);
  const inView = useInView(nodeRef, { once: true });
  const triggered = useRef(false);

  useEffect(() => {
    if (!inView || triggered.current) return;
    triggered.current = true;
    const ctrl = animate(0, to, {
      duration: 1.8,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => {
        if (nodeRef.current)
          nodeRef.current.textContent = prefix + (Number.isInteger(to) ? Math.round(v) : v.toFixed(2)) + suffix;
      },
    });
    return () => ctrl.stop();
  }, [inView, to, prefix, suffix]);

  return (
    <span ref={nodeRef} className="tabular-nums">
      {prefix}0{suffix}
    </span>
  );
}

// ── Radial SVG ring ───────────────────────────────────────────────────────────
function Ring({ pct, color, size = 90 }) {
  const R = (size - 10) / 2;
  const circ = 2 * Math.PI * R;
  const inView = useInView(useRef(null), { once: true });

  const nodeRef = useRef(null);
  return (
    <div ref={nodeRef} className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size/2} cy={size/2} r={R} strokeWidth={7} stroke="currentColor"
          className="text-slate-100 dark:text-slate-800" fill="none" />
        <motion.circle
          cx={size/2} cy={size/2} r={R} strokeWidth={7}
          stroke={color} fill="none" strokeLinecap="round"
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: circ * (1 - pct / 100) }}
          transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-xs font-black text-slate-700 dark:text-slate-200">
        {pct}%
      </span>
    </div>
  );
}

// ── Data ─────────────────────────────────────────────────────────────────────
const stats = [
  { icon: SiLeetcode,    label: 'LeetCode Problems',   value: 250,  suffix: '+', color: '#f59e0b', ring: 72, tone: 'amber'  },
  { icon: SiCodeforces,  label: 'Codeforces Rating',   value: 850,  suffix: '',  color: '#3b82f6', ring: 60, tone: 'blue'   },
  { icon: FaCode,        label: 'Total DSA Problems',  value: 350,  suffix: '+', color: '#14b8a6', ring: 80, tone: 'teal'   },
  { icon: FaFire,        label: 'Consistency Rate',    value: 92,   suffix: '%', color: '#8b5cf6', ring: 92, tone: 'violet' },
];

const certs = [
  { icon: FaCertificate, title: 'Machine Learning Training', by: 'Internship & Project-based', year: '2025', color: 'text-teal-500' },
  { icon: FaTrophy,      title: 'Problem Solving Excellence', by: 'LeetCode & Codeforces',    year: '2024', color: 'text-amber-500' },
  { icon: FaStar,        title: 'Full-Stack Web Development', by: 'HTML · CSS · JS · Flask',  year: '2024', color: 'text-violet-500' },
  { icon: FaGithub,      title: 'Open Source Contributions',  by: 'GitHub Projects',           year: '2025', color: 'text-cyan-500' },
];

const toneMap = {
  amber:  { pill: 'bg-amber-500/10',  text: 'text-amber-600 dark:text-amber-400',  border: 'border-amber-400/25'  },
  blue:   { pill: 'bg-blue-500/10',   text: 'text-blue-600 dark:text-blue-400',    border: 'border-blue-400/25'   },
  teal:   { pill: 'bg-teal-500/10',   text: 'text-teal-600 dark:text-teal-400',    border: 'border-teal-400/25'   },
  violet: { pill: 'bg-violet-500/10', text: 'text-violet-600 dark:text-violet-400', border: 'border-violet-400/25' },
};

// ── Stat card ─────────────────────────────────────────────────────────────────
function StatCard({ icon: Icon, label, value, suffix, color, ring, tone, index }) {
  const s = toneMap[tone];
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.94 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -8, scale: 1.03 }}
      className={`glass-panel rounded-[2rem] border p-7 ${s.border}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <div className={`mb-4 inline-flex rounded-2xl p-3 ${s.pill} ${s.text}`}>
            <Icon size={22} />
          </div>
          <p className="display-font text-4xl font-black text-slate-950 dark:text-white">
            <Counter to={value} suffix={suffix} />
          </p>
          <p className="mt-2 text-sm font-semibold text-slate-500 dark:text-slate-400">{label}</p>
        </div>
        <Ring pct={ring} color={color} size={84} />
      </div>
    </motion.div>
  );
}

// ── Cert card ─────────────────────────────────────────────────────────────────
function CertCard({ icon: Icon, title, by, year, color, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -24 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ scale: 1.03, x: 4 }}
      className="glass-panel flex items-center gap-5 rounded-[1.5rem] p-5"
    >
      <motion.div
        whileHover={{ rotate: 18, scale: 1.2 }}
        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/60 dark:bg-slate-800/60 ${color}`}
      >
        <Icon size={20} />
      </motion.div>
      <div className="min-w-0">
        <p className="truncate font-bold text-slate-900 dark:text-white">{title}</p>
        <p className="text-sm text-slate-500 dark:text-slate-400">{by} · {year}</p>
      </div>
    </motion.div>
  );
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function Achievements() {
  return (
    <section id="achievements" className="section-shell px-4 py-28 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mb-16 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
        >
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-teal-600 dark:text-teal-400">
              Achievements
            </p>
            <h2 className="display-font mt-3 text-4xl font-black text-slate-950 dark:text-white sm:text-5xl">
              Numbers{' '}
              <span className="bg-gradient-to-r from-teal-500 to-cyan-400 bg-clip-text text-transparent">
                &amp; milestones
              </span>
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-7 text-slate-500 dark:text-slate-400">
            Consistent competitive programming and real-world project delivery.
          </p>
        </motion.div>

        {/* Stats grid */}
        <div className="mb-12 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((s, i) => (
            <StatCard key={s.label} {...s} index={i} />
          ))}
        </div>

        {/* Certs */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="glass-panel rounded-[2rem] p-8"
        >
          <p className="mb-6 text-sm font-bold uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
            Certifications &amp; recognition
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            {certs.map((c, i) => (
              <CertCard key={c.title} {...c} index={i} />
            ))}
          </div>
        </motion.div>

        {/* Quote / call to action */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.7 }}
          className="mt-8 overflow-hidden rounded-[2rem] bg-gradient-to-r from-teal-500 via-cyan-500 to-sky-500 p-px"
        >
          <div className="rounded-[calc(2rem-1px)] bg-white/95 px-8 py-7 text-center dark:bg-slate-950/95">
            <p className="display-font text-lg font-black text-slate-900 dark:text-white sm:text-xl">
              "Consistency beats talent when talent doesn't show up consistently."
            </p>
            <p className="mt-2 text-sm text-slate-400">— a principle I code by every day</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
