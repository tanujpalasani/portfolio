import { motion } from 'framer-motion';
import { FaGithub, FaLinkedin, FaEnvelope, FaHeart, FaCode } from 'react-icons/fa';
import { IoRocketOutline } from 'react-icons/io5';

const socials = [
  { icon: FaGithub,   href: 'https://github.com/tanujpalasani',           label: 'GitHub' },
  { icon: FaLinkedin, href: 'https://linkedin.com/in/tanujpalasani',       label: 'LinkedIn' },
  { icon: FaEnvelope, href: 'mailto:tanujpalasani@gmail.com',              label: 'Email' },
];

const nav = [
  { label: 'Home',         href: '#home'         },
  { label: 'About',        href: '#about'        },
  { label: 'Skills',       href: '#skills'       },
  { label: 'Projects',     href: '#projects'     },
  { label: 'Achievements', href: '#achievements' },
  { label: 'Contact',      href: '#contact'      },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.1 } },
};
const itemV = {
  hidden: { opacity: 0, y: 20 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden border-t border-slate-200/60 bg-white/80 backdrop-blur-xl dark:border-slate-800/60 dark:bg-slate-950/80">
      {/* SVG wave top decoration */}
      <div className="pointer-events-none absolute -top-px left-0 right-0 overflow-hidden">
        <svg viewBox="0 0 1440 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <motion.path
            initial={{ pathLength: 0, opacity: 0 }}
            whileInView={{ pathLength: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.8, ease: 'easeInOut' }}
            d="M0 16C240 0 480 32 720 16C960 0 1200 32 1440 16V32H0V16Z"
            fill="url(#footerGrad)"
          />
          <defs>
            <linearGradient id="footerGrad" x1="0" y1="0" x2="1440" y2="0">
              <stop offset="0%" stopColor="#14b8a6" stopOpacity="0.15" />
              <stop offset="50%" stopColor="#06b6d4" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.12" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid gap-12 md:grid-cols-[1.2fr_1fr_1fr]"
        >
          {/* Brand */}
          <motion.div variants={itemV} className="space-y-5">
            <div className="flex items-center gap-2.5">
              <div className="rounded-xl bg-gradient-to-br from-teal-500 to-cyan-500 p-1.5 text-white">
                <IoRocketOutline size={16} />
              </div>
              <span className="display-font text-2xl font-black">
                <span className="bg-gradient-to-r from-teal-500 to-cyan-400 bg-clip-text text-transparent">
                  &lt;Tanuj /&gt;
                </span>
              </span>
            </div>
            <p className="max-w-xs text-sm leading-7 text-slate-500 dark:text-slate-400">
              B.Tech CSE student at LPU — building ML systems, web apps, and algorithmic solutions
              with precision and curiosity.
            </p>
            {/* Socials */}
            <div className="flex gap-3">
              {socials.map(({ icon: Icon, href, label }, i) => (
                <motion.a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  custom={i}
                  initial={{ opacity: 0, scale: 0.6 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, type: 'spring', stiffness: 320 }}
                  whileHover={{ scale: 1.2, y: -4, rotate: 8 }}
                  whileTap={{ scale: 0.9 }}
                  className="flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-white/80 text-slate-600 shadow-sm transition hover:border-teal-400 hover:text-teal-600 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-300 dark:hover:border-teal-500 dark:hover:text-teal-400"
                >
                  <Icon size={16} />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Navigation */}
          <motion.div variants={itemV}>
            <p className="mb-5 text-xs font-bold uppercase tracking-[0.3em] text-slate-400">
              Navigate
            </p>
            <ul className="space-y-2.5">
              {nav.map(({ label, href }) => (
                <li key={href}>
                  <motion.a
                    href={href}
                    onClick={(e) => {
                      e.preventDefault();
                      document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    whileHover={{ x: 6, color: '#14b8a6' }}
                    className="text-sm font-medium text-slate-600 transition dark:text-slate-400"
                  >
                    {label}
                  </motion.a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Quick info */}
          <motion.div variants={itemV}>
            <p className="mb-5 text-xs font-bold uppercase tracking-[0.3em] text-slate-400">
              Quick info
            </p>
            <div className="space-y-4">
              {[
                { label: 'University', value: 'Lovely Professional University' },
                { label: 'CGPA', value: '8.71 / 10' },
                { label: 'Location', value: 'Jalandhar, Punjab, India' },
                { label: 'Status', value: 'Open for internships' },
              ].map(({ label, value }) => (
                <div key={label}>
                  <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">{label}</p>
                  <p className="mt-0.5 text-sm font-medium text-slate-700 dark:text-slate-200">{value}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* Divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="my-10 h-px origin-left bg-gradient-to-r from-teal-500/30 via-cyan-400/20 to-transparent"
        />

        {/* Bottom bar */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left"
        >
          <p className="flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500">
            © {year} Palasani Sai Venkata Tanuj. Built with
            <motion.span
              animate={{ scale: [1, 1.35, 1] }}
              transition={{ duration: 1.2, repeat: Infinity }}
              className="text-rose-500"
            >
              <FaHeart size={11} />
            </motion.span>
            using React &amp; Framer Motion.
          </p>
          <div className="flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500">
            <FaCode size={11} />
            <span>Designed &amp; developed by Tanuj</span>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
