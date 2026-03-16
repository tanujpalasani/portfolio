import { useRef, useCallback, useState } from 'react';
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  AnimatePresence,
} from 'framer-motion';
import {
  FaGithub, FaExternalLinkAlt, FaPython, FaBrain,
  FaDatabase, FaChartBar, FaReact, FaFlask,
} from 'react-icons/fa';
import { SiJavascript, SiMysql, SiFlask, SiSqlite } from 'react-icons/si';

// ── Project data ──────────────────────────────────────────────────────────────
const projects = [
  {
    title: 'Anomaly-Aware Load Prediction',
    subtitle: 'ML System',
    desc: 'End-to-end machine learning pipeline for power grid load forecasting with integrated anomaly detection using Random Forest regression and Isolation Forest algorithms, served via a Flask REST API.',
    tags: ['Python', 'Random Forest', 'Isolation Forest', 'Flask', 'SQLite', 'REST API'],
    tagIcons: [FaPython, FaBrain, FaBrain, SiFlask, SiSqlite, FaDatabase],
    github: 'https://github.com/tanujpalasani',
    live: null,
    tone: 'teal',
    emoji: '⚡',
    year: '2025',
    badge: 'Featured',
  },
  {
    title: 'DSA Problem Tracker',
    subtitle: 'Web Application',
    desc: 'Full-stack web application to organize, tag, and track competitive programming problems with progress analytics, category filters, and a personal dashboard for LeetCode and Codeforces grinding.',
    tags: ['HTML', 'CSS', 'JavaScript', 'MySQL', 'Flask'],
    tagIcons: [FaDatabase, FaChartBar, SiJavascript, SiMysql, SiFlask],
    github: 'https://github.com/tanujpalasani',
    live: null,
    tone: 'amber',
    emoji: '🧩',
    year: '2024',
    badge: 'Personal',
  },
  {
    title: 'OS Scheduling Simulator',
    subtitle: 'Systems Project',
    desc: 'Interactive visualizer for CPU scheduling algorithms (FCFS, SJF, Round Robin, Priority) with Gantt chart generation, average turnaround/waiting time calculations, and comparative analysis mode.',
    tags: ['C', 'C++', 'Algorithm Design', 'Systems'],
    tagIcons: [FaDatabase, FaDatabase, FaBrain, FaDatabase],
    github: 'https://github.com/tanujpalasani',
    live: null,
    tone: 'violet',
    emoji: '🖥️',
    year: '2024',
    badge: 'Academic',
  },
];

// ── Tone map ──────────────────────────────────────────────────────────────────
const toneMap = {
  teal:   { grad: 'from-teal-500/20 to-cyan-500/10',    border: 'border-teal-400/30',   accent: 'bg-teal-500',   accentText: 'text-teal-600 dark:text-teal-400',   shadow: 'shadow-teal-500/15',   button: 'from-teal-500 to-cyan-500' },
  amber:  { grad: 'from-amber-500/20 to-orange-500/10', border: 'border-amber-400/30',  accent: 'bg-amber-500',  accentText: 'text-amber-600 dark:text-amber-400',  shadow: 'shadow-amber-500/15',  button: 'from-amber-500 to-orange-500' },
  violet: { grad: 'from-violet-500/20 to-purple-500/10', border: 'border-violet-400/30', accent: 'bg-violet-500', accentText: 'text-violet-600 dark:text-violet-400', shadow: 'shadow-violet-500/15', button: 'from-violet-500 to-purple-500' },
};

// ── Project card ──────────────────────────────────────────────────────────────
function ProjectCard({ project, index }) {
  const ref = useRef(null);
  const [hovered, setHovered] = useState(false);
  const rotX = useMotionValue(0);
  const rotY = useMotionValue(0);
  const sRotX = useSpring(rotX, { stiffness: 200, damping: 28 });
  const sRotY = useSpring(rotY, { stiffness: 200, damping: 28 });
  const shadowX = useTransform(sRotY, [-14, 14], ['-12px', '12px']);
  const shadowY = useTransform(sRotX, [-14, 14], ['12px', '-12px']);
  const s = toneMap[project.tone];

  const onMove = useCallback((e) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    rotX.set(((e.clientY - rect.top)  / rect.height - 0.5) * -14);
    rotY.set(((e.clientX - rect.left) / rect.width  - 0.5) *  14);
  }, [rotX, rotY]);

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { rotX.set(0); rotY.set(0); setHovered(false); }}
      style={{
        rotateX: sRotX,
        rotateY: sRotY,
        transformStyle: 'preserve-3d',
        boxShadow: useTransform(
          [sRotX, sRotY],
          ([rx, ry]) => `${ry * -0.8}px ${rx * 0.8}px 40px rgba(0,0,0,0.12)`,
        ),
      }}
      initial={{ opacity: 0, y: 50, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.12, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      className={`perspective-1000 glass-panel relative overflow-hidden rounded-[2rem] border ${s.border}`}
    >
      {/* Shimmer on hover */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ x: '-100%', opacity: 0 }}
            animate={{ x: '100%', opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.55, ease: 'easeInOut' }}
            className="pointer-events-none absolute inset-0 z-20 bg-gradient-to-r from-transparent via-white/10 to-transparent"
          />
        )}
      </AnimatePresence>

      {/* Top accent bar */}
      <div className={`h-1 w-full bg-gradient-to-r ${s.button}`} />

      <div className="p-7">
        {/* Header row */}
        <div className="mb-5 flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <motion.span
              animate={hovered ? { rotate: [0, -15, 15, 0], scale: [1, 1.2, 1] } : {}}
              transition={{ duration: 0.5 }}
              className="text-3xl"
            >
              {project.emoji}
            </motion.span>
            <div>
              <div className="flex items-center gap-2">
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${s.accentText} bg-current/10`}>
                  {project.badge}
                </span>
                <span className="text-xs text-slate-400">{project.year}</span>
              </div>
              <h3 className="display-font mt-1 text-xl font-black text-slate-950 dark:text-white">
                {project.title}
              </h3>
            </div>
          </div>
          <span className={`shrink-0 text-xs font-semibold uppercase tracking-widest ${s.accentText}`}>
            {project.subtitle}
          </span>
        </div>

        {/* Description */}
        <p className="mb-6 text-sm leading-[1.85] text-slate-600 dark:text-slate-300">
          {project.desc}
        </p>

        {/* Tags */}
        <div className="mb-6 flex flex-wrap gap-2">
          {project.tags.map((tag, i) => {
            const Icon = project.tagIcons[i];
            return (
              <motion.span
                key={tag}
                whileHover={{ scale: 1.08, y: -2 }}
                className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-white/70 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-200"
              >
                <Icon size={11} />
                {tag}
              </motion.span>
            );
          })}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <motion.a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.06, y: -2 }}
            whileTap={{ scale: 0.94 }}
            className="flex items-center gap-2 rounded-full border border-slate-200/80 bg-white/80 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-teal-400 hover:text-teal-700 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-200"
          >
            <FaGithub size={14} />
            View Code
          </motion.a>
          {project.live && (
            <motion.a
              href={project.live}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.06, y: -2 }}
              whileTap={{ scale: 0.94 }}
              className={`flex items-center gap-2 rounded-full bg-gradient-to-r ${s.button} px-4 py-2.5 text-sm font-semibold text-white shadow-md ${s.shadow}`}
            >
              <FaExternalLinkAlt size={12} />
              Live Demo
            </motion.a>
          )}
          {!project.live && (
            <span className="text-xs text-slate-400 dark:text-slate-500">Private / Academic</span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function Projects() {
  return (
    <section id="projects" className="section-shell px-4 py-28 sm:px-6 lg:px-8">
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
              Work
            </p>
            <h2 className="display-font mt-3 text-4xl font-black text-slate-950 dark:text-white sm:text-5xl">
              Featured{' '}
              <span className="bg-gradient-to-r from-teal-500 to-cyan-400 bg-clip-text text-transparent">
                projects
              </span>
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-7 text-slate-500 dark:text-slate-400">
            Production-quality systems built across machine learning, web applications, and systems programming.
          </p>
        </motion.div>

        {/* Cards grid */}
        <div className="grid gap-7 lg:grid-cols-3">
          {projects.map((project, i) => (
            <ProjectCard key={project.title} project={project} index={i} />
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mt-12 text-center"
        >
          <motion.a
            href="https://github.com/tanujpalasani"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.96 }}
            className="inline-flex items-center gap-2.5 rounded-full border border-slate-200/80 bg-white/80 px-7 py-3.5 text-sm font-bold text-slate-700 shadow-sm transition hover:border-teal-400 hover:text-teal-700 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-200 dark:hover:border-teal-500 dark:hover:text-teal-300"
          >
            <FaGithub size={16} />
            See all on GitHub
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
