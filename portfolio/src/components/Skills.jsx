import { useRef, useCallback } from 'react';
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useInView,
} from 'framer-motion';
import { FaComments, FaDatabase, FaLinux } from 'react-icons/fa';
import {
  SiC, SiCplusplus, SiCss, SiGit, SiHtml5,
  SiJavascript, SiMysql, SiOpenjdk, SiPython,
} from 'react-icons/si';

// ── Data ─────────────────────────────────────────────────────────────────────
const categories = [
  {
    label: 'Languages',
    tone: 'teal',
    skills: [
      { name: 'Python',  icon: SiPython,   level: 90 },
      { name: 'C++',     icon: SiCplusplus, level: 88 },
      { name: 'C',       icon: SiC,         level: 82 },
      { name: 'Java',    icon: SiOpenjdk,  level: 72 },
    ],
  },
  {
    label: 'Web & Tools',
    tone: 'amber',
    skills: [
      { name: 'HTML',       icon: SiHtml5,      level: 88 },
      { name: 'JavaScript', icon: SiJavascript, level: 82 },
      { name: 'CSS',        icon: SiCss,        level: 84 },
      { name: 'Git',        icon: SiGit,        level: 86 },
    ],
  },
  {
    label: 'Platforms & Core',
    tone: 'violet',
    skills: [
      { name: 'MySQL',           icon: SiMysql,    level: 76 },
      { name: 'Linux',           icon: FaLinux,    level: 72 },
      { name: 'Problem Solving', icon: FaDatabase, level: 87 },
      { name: 'Communication',   icon: FaComments, level: 84 },
    ],
  },
];

const toneMap = {
  teal:   { text: 'text-teal-600 dark:text-teal-400',   bar: 'from-teal-500 to-cyan-400',   ring: '#14b8a6', pill: 'bg-teal-500/10 text-teal-700 dark:text-teal-300',   border: 'border-teal-400/30',   header: 'from-teal-500/15 to-cyan-500/5' },
  amber:  { text: 'text-amber-600 dark:text-amber-400', bar: 'from-amber-500 to-orange-400', ring: '#f59e0b', pill: 'bg-amber-500/10 text-amber-700 dark:text-amber-300', border: 'border-amber-400/30', header: 'from-amber-500/15 to-orange-500/5' },
  violet: { text: 'text-violet-600 dark:text-violet-400', bar: 'from-violet-500 to-purple-400', ring: '#8b5cf6', pill: 'bg-violet-500/10 text-violet-700 dark:text-violet-300', border: 'border-violet-400/30', header: 'from-violet-500/15 to-purple-500/5' },
};

// ── SVG Arc ring ─────────────────────────────────────────────────────────────
function ArcRing({ level, color, size = 52 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const R = (size - 8) / 2;
  const circ = 2 * Math.PI * R;
  const offset = circ * (1 - level / 100);

  return (
    <div ref={ref} className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={R} strokeWidth={5} stroke="currentColor"
          className="text-slate-200 dark:text-slate-700" fill="none" />
        <motion.circle
          cx={size / 2} cy={size / 2} r={R} strokeWidth={5}
          stroke={color} fill="none"
          strokeLinecap="round"
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={inView ? { strokeDashoffset: offset } : { strokeDashoffset: circ }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-slate-700 dark:text-slate-200">
        {level}%
      </span>
    </div>
  );
}

// ── Skill bar row ─────────────────────────────────────────────────────────────
function SkillRow({ name, icon: Icon, level, tone, index }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const s = toneMap[tone];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -24 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.55, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className="group"
    >
      <div className="mb-1.5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <motion.div
            whileHover={{ scale: 1.2, rotate: 10 }}
            className={`rounded-lg p-1.5 ${s.pill}`}
          >
            <Icon size={13} />
          </motion.div>
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{name}</span>
        </div>
        <span className={`text-xs font-bold tabular-nums ${s.text}`}>{level}%</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
        <motion.div
          className={`h-full rounded-full bg-gradient-to-r ${s.bar}`}
          initial={{ width: 0 }}
          animate={inView ? { width: `${level}%` } : { width: 0 }}
          transition={{ duration: 1.1, delay: 0.15 + index * 0.08, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
    </motion.div>
  );
}

// ── Category card with 3D tilt ───────────────────────────────────────────────
function CategoryCard({ label, tone, skills }) {
  const ref = useRef(null);
  const rotX = useMotionValue(0);
  const rotY = useMotionValue(0);
  const sRotX = useSpring(rotX, { stiffness: 200, damping: 28 });
  const sRotY = useSpring(rotY, { stiffness: 200, damping: 28 });
  const s = toneMap[tone];

  const onMove = useCallback((e) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    rotX.set(((e.clientY - rect.top)  / rect.height - 0.5) * -10);
    rotY.set(((e.clientX - rect.left) / rect.width  - 0.5) *  10);
  }, [rotX, rotY]);

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={() => { rotX.set(0); rotY.set(0); }}
      style={{ rotateX: sRotX, rotateY: sRotY, transformStyle: 'preserve-3d' }}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      className="perspective-1000 glass-panel rounded-[2rem] overflow-hidden"
    >
      {/* Card header */}
      <div className={`bg-gradient-to-br ${s.header} border-b ${s.border} p-5`}>
        <div className="flex items-center justify-between">
          <span className={`text-sm font-black uppercase tracking-widest ${s.text}`}>{label}</span>
          <div className="flex -space-x-1">
            {skills.map(({ name, icon: Icon, level }) => (
              <ArcRing key={name} level={level} color={s.ring} size={40} />
            ))}
          </div>
        </div>
      </div>

      {/* Skill rows */}
      <div className="space-y-4 p-5">
        {skills.map(({ name, icon, level }, idx) => (
          <SkillRow key={name} name={name} icon={icon} level={level} tone={tone} index={idx} />
        ))}
      </div>
    </motion.div>
  );
}

// ── Extra tech chips ─────────────────────────────────────────────────────────
const extras = ['Flask', 'SQLite', 'Scikit-learn', 'NumPy', 'Pandas', 'VS Code', 'GitHub Actions', 'Linux CLI', 'REST APIs', 'OOP', 'DSA', 'OS Concepts'];

// ── Component ─────────────────────────────────────────────────────────────────
export default function Skills() {
  return (
    <section id="skills" className="section-shell px-4 py-28 sm:px-6 lg:px-8">
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
              Skills
            </p>
            <h2 className="display-font mt-3 text-4xl font-black text-slate-950 dark:text-white sm:text-5xl">
              Technical{' '}
              <span className="bg-gradient-to-r from-teal-500 to-cyan-400 bg-clip-text text-transparent">
                arsenal
              </span>
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-7 text-slate-500 dark:text-slate-400">
            Languages, frameworks, and tools I use across machine learning, web development, and systems programming.
          </p>
        </motion.div>

        {/* Category cards */}
        <div className="mb-10 grid gap-6 md:grid-cols-3">
          {categories.map((cat) => (
            <CategoryCard key={cat.label} {...cat} />
          ))}
        </div>

        {/* Extra chips */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="glass-panel rounded-[2rem] p-7"
        >
          <p className="mb-5 text-xs font-bold uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
            Also proficient in
          </p>
          <div className="flex flex-wrap gap-2.5">
            {extras.map((t, i) => (
              <motion.span
                key={t}
                initial={{ opacity: 0, scale: 0.7 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04, type: 'spring', stiffness: 300 }}
                whileHover={{ scale: 1.1, y: -2 }}
                className="cursor-default rounded-full border border-slate-200 bg-white/70 px-4 py-2 text-sm font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-200"
              >
                {t}
              </motion.span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
