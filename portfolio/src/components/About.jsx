import { useRef, useState, useCallback } from 'react';
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  AnimatePresence,
} from 'framer-motion';
import {
  FaBrain,
  FaChalkboardTeacher,
  FaGraduationCap,
  FaLaptopCode,
  FaCode,
  FaAward,
  FaUsers,
  FaRocket,
} from 'react-icons/fa';

// ── Section reveal container ────────────────────────────────────────────────
const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};
const item = {
  hidden: { opacity: 0, y: 36, filter: 'blur(6px)' },
  show:   { opacity: 1, y: 0,  filter: 'blur(0px)', transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

// ── 3-D flip card ───────────────────────────────────────────────────────────
function FlipCard({ front, back, tone }) {
  const [flipped, setFlipped] = useState(false);

  const toneGrad = {
    teal:   'from-teal-500/20 to-cyan-500/10',
    amber:  'from-amber-500/20 to-orange-500/10',
    cyan:   'from-cyan-500/20 to-sky-500/10',
    violet: 'from-violet-500/20 to-purple-500/10',
  };
  const toneBorder = {
    teal:   'border-teal-400/30',
    amber:  'border-amber-400/30',
    cyan:   'border-cyan-400/30',
    violet: 'border-violet-400/30',
  };
  const toneText = {
    teal:   'text-teal-600 dark:text-teal-300',
    amber:  'text-amber-600 dark:text-amber-300',
    cyan:   'text-cyan-600 dark:text-cyan-300',
    violet: 'text-violet-600 dark:text-violet-300',
  };
  const toneIcon = {
    teal:   'bg-teal-500/15 text-teal-600 dark:text-teal-300',
    amber:  'bg-amber-500/15 text-amber-600 dark:text-amber-300',
    cyan:   'bg-cyan-500/15 text-cyan-600 dark:text-cyan-300',
    violet: 'bg-violet-500/15 text-violet-600 dark:text-violet-300',
  };

  return (
    <div
      className="group relative h-60 cursor-pointer perspective-1000"
      onClick={() => setFlipped((f) => !f)}
      onMouseLeave={() => setFlipped(false)}
    >
      <motion.div
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 26 }}
        style={{ transformStyle: 'preserve-3d' }}
        className="relative h-full w-full"
      >
        {/* Front */}
        <div
          className={`absolute inset-0 overflow-hidden rounded-[1.75rem] border bg-gradient-to-br p-6 ${toneGrad[tone]} ${toneBorder[tone]} glass-panel`}
          style={{ backfaceVisibility: 'hidden' }}
        >
          <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl ${toneIcon[tone]}`}>
            <front.icon size={22} />
          </div>
          <h3 className="display-font text-lg font-bold text-slate-950 dark:text-white">{front.title}</h3>
          <p className="mt-2 text-sm leading-[1.75] text-slate-600 dark:text-slate-300">{front.desc}</p>
          <p className={`mt-4 text-xs font-semibold uppercase tracking-widest ${toneText[tone]}`}>
            Tap to flip →
          </p>
        </div>

        {/* Back */}
        <div
          className={`absolute inset-0 overflow-hidden rounded-[1.75rem] border bg-gradient-to-br p-6 ${toneGrad[tone]} ${toneBorder[tone]}`}
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          <p className={`mb-3 text-xs font-semibold uppercase tracking-widest ${toneText[tone]}`}>
            Key highlights
          </p>
          <ul className="space-y-1.5">
            {back.points.map((p) => (
              <li key={p} className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-200">
                <span className={`mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-current ${toneText[tone]}`} />
                {p}
              </li>
            ))}
          </ul>
        </div>
      </motion.div>
    </div>
  );
}

// ── Tilt glare wrapper ───────────────────────────────────────────────────────
function TiltInfo({ children }) {
  const ref = useRef(null);
  const rotX = useMotionValue(0);
  const rotY = useMotionValue(0);
  const sRotX = useSpring(rotX, { stiffness: 200, damping: 28 });
  const sRotY = useSpring(rotY, { stiffness: 200, damping: 28 });

  const onMove = useCallback((e) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    rotX.set(((e.clientY - rect.top)  / rect.height - 0.5) * -12);
    rotY.set(((e.clientX - rect.left) / rect.width  - 0.5) *  12);
  }, [rotX, rotY]);

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={() => { rotX.set(0); rotY.set(0); }}
      style={{ rotateX: sRotX, rotateY: sRotY, transformStyle: 'preserve-3d' }}
      className="perspective-1000"
    >
      {children}
    </motion.div>
  );
}

// ── Timeline item ────────────────────────────────────────────────────────────
function TimelineItem({ year, label, sub, color }) {
  return (
    <motion.div
      variants={item}
      className="flex gap-4"
    >
      <div className="flex flex-col items-center">
        <motion.div
          whileHover={{ scale: 1.25 }}
          className={`h-3 w-3 rounded-full ${color} shadow-lg`}
        />
        <div className="mt-1 w-px flex-1 bg-slate-200 dark:bg-slate-700" />
      </div>
      <div className="pb-6">
        <span className="text-xs font-bold uppercase tracking-widest text-slate-400">{year}</span>
        <p className="mt-0.5 font-semibold text-slate-900 dark:text-white">{label}</p>
        <p className="text-sm text-slate-500 dark:text-slate-400">{sub}</p>
      </div>
    </motion.div>
  );
}

// ── Data ─────────────────────────────────────────────────────────────────────
const cards = [
  {
    tone: 'teal',
    front: {
      icon: FaGraduationCap,
      title: 'Academic Foundation',
      desc: 'B.Tech CSE @ LPU with a current CGPA of 8.71.',
    },
    back: {
      points: ['CGPA 8.71 / 10', '93% Intermediate', '99% Matriculation', 'Core CS curriculum — OS, DBMS, CN, DSA'],
    },
  },
  {
    tone: 'amber',
    front: {
      icon: FaBrain,
      title: 'Machine Learning',
      desc: 'Built anomaly-detection systems using Random Forest and Isolation Forest.',
    },
    back: {
      points: ['Random Forest regression', 'Isolation Forest anomaly detection', 'Flask REST API deployment', 'SQLite data management'],
    },
  },
  {
    tone: 'cyan',
    front: {
      icon: FaLaptopCode,
      title: 'Full-Stack Builder',
      desc: 'End-to-end web apps with HTML, CSS, JS, and Flask.',
    },
    back: {
      points: ['HTML · CSS · JavaScript', 'Flask backend', 'MySQL + SQLite databases', 'Responsive, deployable apps'],
    },
  },
  {
    tone: 'violet',
    front: {
      icon: FaChalkboardTeacher,
      title: 'Leadership',
      desc: 'Led programming teaching initiatives and mentored peers.',
    },
    back: {
      points: ['Mentorship of 20+ students', 'Communication & critical thinking', 'Time management under deadlines', 'Team collaboration'],
    },
  },
];

const timeline = [
  { year: '2021', label: '99% in Matriculation', sub: 'Top academic result', color: 'bg-teal-500' },
  { year: '2023', label: 'Started B.Tech CSE @ LPU', sub: 'Lovely Professional University', color: 'bg-amber-500' },
  { year: '2024', label: 'ML Training Program', sub: 'Anomaly detection & predictive systems', color: 'bg-cyan-500' },
  { year: '2025', label: 'Portfolio Projects Live', sub: 'ML, Web, OS Scheduler', color: 'bg-violet-500' },
];

// ── Component ─────────────────────────────────────────────────────────────────
export default function About() {
  return (
    <section id="about" className="section-shell px-4 py-28 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mb-16 grid gap-8 lg:grid-cols-[0.9fr_1.1fr]"
        >
          <div>
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-sm font-bold uppercase tracking-[0.3em] text-teal-600 dark:text-teal-400"
            >
              About me
            </motion.p>
            <h2 className="display-font mt-4 text-4xl font-black leading-[1.08] text-slate-950 dark:text-white sm:text-5xl">
              CS student with{' '}
              <span className="bg-gradient-to-r from-teal-500 to-cyan-400 bg-clip-text text-transparent">
                strong results
              </span>{' '}
              &amp; hands-on depth.
            </h2>
          </div>

          <TiltInfo>
            <div className="glass-panel rounded-[2rem] p-7">
              <p className="text-base leading-[1.9] text-slate-600 dark:text-slate-300">
                I focus on practical execution — ML systems, AI-assisted web apps, scheduling simulations,
                and structured training. Beyond code, communication, leadership, and critical thinking
                define how I build and collaborate.
              </p>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {[
                  { label: 'Soft Skills', value: 'Leadership · Communication · Critical Thinking', dark: true },
                  { label: 'Schooling', value: '93% Intermediate · 99% Matriculation', dark: false },
                ].map(({ label, value, dark }) => (
                  <motion.div
                    key={label}
                    whileHover={{ scale: 1.03, y: -2 }}
                    className={`rounded-3xl px-5 py-4 ${
                      dark
                        ? 'bg-slate-950 text-white dark:bg-slate-100 dark:text-slate-950'
                        : 'border border-slate-200/80 dark:border-slate-700'
                    }`}
                  >
                    <p className="text-xs uppercase tracking-[0.24em] opacity-60">{label}</p>
                    <p className="mt-2 text-sm font-semibold leading-snug">{value}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </TiltInfo>
        </motion.div>

        {/* Flip cards */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          className="mb-16 grid gap-5 sm:grid-cols-2 xl:grid-cols-4"
        >
          {cards.map((c) => (
            <motion.div key={c.front.title} variants={item}>
              <FlipCard {...c} />
            </motion.div>
          ))}
        </motion.div>

        {/* Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="glass-panel rounded-[2rem] p-8"
        >
          <p className="mb-8 text-sm font-bold uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
            Journey timeline
          </p>
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid gap-0 sm:grid-cols-2 md:grid-cols-4"
          >
            {timeline.map((t) => (
              <TimelineItem key={t.year} {...t} />
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
