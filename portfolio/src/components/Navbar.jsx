import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import { HiMenuAlt3, HiX } from 'react-icons/hi';
import { MdDarkMode, MdLightMode } from 'react-icons/md';
import { IoRocketOutline } from 'react-icons/io5';

const navLinks = [
  { label: 'Home',         href: '#home'         },
  { label: 'About',        href: '#about'        },
  { label: 'Skills',       href: '#skills'       },
  { label: 'Projects',     href: '#projects'     },
  { label: 'Achievements', href: '#achievements' },
  { label: 'Contact',      href: '#contact'      },
];

export default function Navbar({ darkMode, toggleDark }) {
  const [menuOpen, setMenuOpen]   = useState(false);
  const [hidden,   setHidden]     = useState(false);
  const [scrolled, setScrolled]   = useState(false);
  const [active,   setActive]     = useState('#home');
  const lastY = useRef(0);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, 'change', (y) => {
    setHidden(y > lastY.current && y > 100);
    setScrolled(y > 32);
    lastY.current = y;
  });

  // Track active section via IntersectionObserver
  useEffect(() => {
    const sections = navLinks.map((l) => document.querySelector(l.href)).filter(Boolean);
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(`#${entry.target.id}`);
        });
      },
      { rootMargin: '-40% 0px -55% 0px' },
    );
    sections.forEach((s) => obs.observe(s));
    return () => obs.disconnect();
  }, []);

  const go = (href) => {
    setMenuOpen(false);
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: hidden ? -100 : 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 280, damping: 30 }}
        className={`fixed left-0 right-0 top-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'border-b border-slate-200/60 bg-white/80 shadow-xl shadow-black/5 backdrop-blur-2xl dark:border-slate-800/60 dark:bg-slate-950/80'
            : 'bg-transparent'
        }`}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <motion.a
              href="#home"
              onClick={(e) => { e.preventDefault(); go('#home'); }}
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.94 }}
              className="group flex items-center gap-2"
            >
              <motion.div
                animate={{ rotate: [0, 15, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="rounded-xl bg-gradient-to-br from-teal-500 to-cyan-500 p-1.5 text-white"
              >
                <IoRocketOutline size={16} />
              </motion.div>
              <span className="display-font text-xl font-black">
                <span className="bg-gradient-to-r from-teal-500 to-cyan-400 bg-clip-text text-transparent">
                  &lt;Tanuj /&gt;
                </span>
              </span>
            </motion.a>

            {/* Desktop nav */}
            <div className="hidden items-center gap-1 md:flex">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => { e.preventDefault(); go(link.href); }}
                  className="relative px-4 py-2 text-sm font-medium outline-none"
                >
                  {active === link.href && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-xl bg-teal-50 dark:bg-teal-900/35"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span
                    className={`relative transition-colors duration-200 ${
                      active === link.href
                        ? 'text-teal-600 dark:text-teal-400'
                        : 'text-slate-600 hover:text-teal-600 dark:text-slate-400 dark:hover:text-teal-400'
                    }`}
                  >
                    {link.label}
                  </span>
                </a>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {/* Dark mode toggle */}
              <motion.button
                onClick={toggleDark}
                whileHover={{ scale: 1.1, rotate: 20 }}
                whileTap={{ scale: 0.88 }}
                className="rounded-xl p-2 text-slate-500 transition-colors hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
                aria-label="Toggle dark mode"
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={darkMode ? 'sun' : 'moon'}
                    initial={{ rotate: -90, opacity: 0, scale: 0.4 }}
                    animate={{ rotate: 0, opacity: 1, scale: 1 }}
                    exit={{ rotate: 90, opacity: 0, scale: 0.4 }}
                    transition={{ duration: 0.2 }}
                  >
                    {darkMode ? <MdLightMode size={20} /> : <MdDarkMode size={20} />}
                  </motion.div>
                </AnimatePresence>
              </motion.button>

              {/* CTA — visible on desktop */}
              <motion.a
                href="#contact"
                onClick={(e) => { e.preventDefault(); go('#contact'); }}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.94 }}
                className="hidden rounded-full bg-gradient-to-r from-teal-500 to-cyan-500 px-5 py-2 text-sm font-semibold text-white shadow-md shadow-teal-500/25 transition hover:shadow-teal-500/40 md:block"
              >
                Hire Me
              </motion.a>

              {/* Hamburger — mobile only */}
              <motion.button
                onClick={() => setMenuOpen(!menuOpen)}
                whileTap={{ scale: 0.88 }}
                className="rounded-xl p-2 text-slate-500 transition-colors hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 md:hidden"
                aria-label="Open menu"
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={menuOpen ? 'x' : 'menu'}
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    {menuOpen ? <HiX size={22} /> : <HiMenuAlt3 size={22} />}
                  </motion.div>
                </AnimatePresence>
              </motion.button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
              className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
            />
            <motion.div
              key="drawer"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 340, damping: 34 }}
              className="fixed right-0 top-0 z-50 flex h-full w-72 flex-col border-l border-slate-200/60 bg-white/95 shadow-2xl backdrop-blur-2xl dark:border-slate-800/60 dark:bg-slate-950/95"
            >
              <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5 dark:border-slate-800">
                <span className="display-font text-lg font-black">
                  <span className="bg-gradient-to-r from-teal-500 to-cyan-400 bg-clip-text text-transparent">
                    Menu
                  </span>
                </span>
                <motion.button
                  onClick={() => setMenuOpen(false)}
                  whileTap={{ scale: 0.88 }}
                  className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <HiX size={20} />
                </motion.button>
              </div>

              <nav className="flex-1 space-y-1 overflow-y-auto p-6">
                {navLinks.map((link, i) => (
                  <motion.a
                    key={link.href}
                    href={link.href}
                    onClick={(e) => { e.preventDefault(); go(link.href); }}
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: i * 0.06, type: 'spring', stiffness: 340, damping: 30 }}
                    className={`flex items-center gap-3 rounded-2xl px-5 py-3.5 text-sm font-semibold transition-colors ${
                      active === link.href
                        ? 'bg-teal-50 text-teal-600 dark:bg-teal-900/30 dark:text-teal-400'
                        : 'text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    {active === link.href && (
                      <span className="h-1.5 w-1.5 rounded-full bg-teal-500" />
                    )}
                    {link.label}
                  </motion.a>
                ))}
              </nav>

              <div className="border-t border-slate-100 p-6 dark:border-slate-800">
                <motion.a
                  href="#contact"
                  onClick={(e) => { e.preventDefault(); go('#contact'); }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.96 }}
                  className="block w-full rounded-2xl bg-gradient-to-r from-teal-500 to-cyan-500 py-3 text-center text-sm font-bold text-white shadow-lg shadow-teal-500/25"
                >
                  Hire Me
                </motion.a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
