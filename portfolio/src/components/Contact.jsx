import { useRef, useState, useCallback } from 'react';
import {
  motion,
  useMotionValue,
  useSpring,
  AnimatePresence,
} from 'framer-motion';
import {
  FaEnvelope, FaLinkedin, FaGithub,
  FaMapMarkerAlt, FaPaperPlane, FaCheckCircle,
} from 'react-icons/fa';
import { HiSparkles } from 'react-icons/hi';

// ── Floating label input ──────────────────────────────────────────────────────
function FloatField({ id, label, type = 'text', multiline = false, value, onChange }) {
  const [focused, setFocused] = useState(false);
  const lifted = focused || value.length > 0;
  const Tag = multiline ? 'textarea' : 'input';

  return (
    <div className="relative">
      <motion.label
        htmlFor={id}
        animate={{ y: lifted ? -22 : 0, scale: lifted ? 0.78 : 1, color: focused ? '#14b8a6' : '#94a3b8' }}
        transition={{ type: 'spring', stiffness: 300, damping: 28 }}
        className="pointer-events-none absolute left-4 top-4 origin-left text-sm font-medium"
        style={{ transformOrigin: 'left center' }}
      >
        {label}
      </motion.label>
      <Tag
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        rows={multiline ? 4 : undefined}
        className={`w-full rounded-2xl border bg-white/70 px-4 pb-3.5 text-sm font-medium text-slate-900 outline-none transition-all dark:bg-slate-900/60 dark:text-white ${
          multiline ? 'resize-none pt-7' : 'pt-7 h-14'
        } ${
          focused
            ? 'border-teal-400 ring-2 ring-teal-400/20'
            : 'border-slate-200 hover:border-slate-300 dark:border-slate-700 dark:hover:border-slate-600'
        }`}
      />
    </div>
  );
}

// ── Magnetic send button ──────────────────────────────────────────────────────
function SendButton({ status }) {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 22 });
  const sy = useSpring(y, { stiffness: 200, damping: 22 });
  const shineX = useMotionValue('-100%');

  const onMove = (e) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    x.set((e.clientX - (rect.left + rect.width / 2)) * 0.3);
    y.set((e.clientY - (rect.top + rect.height / 2)) * 0.3);
    shineX.set(`${((e.clientX - rect.left) / rect.width) * 100 - 50}%`);
  };
  const onLeave = () => { x.set(0); y.set(0); };

  return (
    <motion.button
      ref={ref}
      type="submit"
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ x: sx, y: sy }}
      whileTap={{ scale: 0.94 }}
      disabled={status !== 'idle'}
      className="group relative w-full overflow-hidden rounded-2xl bg-gradient-to-r from-teal-500 to-cyan-500 py-4 text-sm font-bold text-white shadow-lg shadow-teal-500/25 transition hover:shadow-teal-500/40 disabled:cursor-not-allowed disabled:opacity-70"
    >
      {/* Shine sweep */}
      <motion.div
        style={{ x: shineX }}
        className="pointer-events-none absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/25 to-transparent"
      />
      <AnimatePresence mode="wait">
        {status === 'idle' && (
          <motion.span
            key="idle"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="relative flex items-center justify-center gap-2"
          >
            <FaPaperPlane size={14} />
            Send Message
          </motion.span>
        )}
        {status === 'sending' && (
          <motion.span
            key="sending"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="relative flex items-center justify-center gap-2"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 0.7, repeat: Infinity, ease: 'linear' }}
              className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white"
            />
            Sending…
          </motion.span>
        )}
        {status === 'sent' && (
          <motion.span
            key="sent"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="relative flex items-center justify-center gap-2"
          >
            <FaCheckCircle size={14} />
            Message Sent!
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

// ── Contact links ─────────────────────────────────────────────────────────────
const links = [
  { icon: FaEnvelope,      label: 'Email',    value: 'tanujpalasani@gmail.com',         href: 'mailto:tanujpalasani@gmail.com' },
  { icon: FaLinkedin,      label: 'LinkedIn', value: 'linkedin.com/in/tanujpalasani',   href: 'https://linkedin.com/in/tanujpalasani' },
  { icon: FaGithub,        label: 'GitHub',   value: 'github.com/tanujpalasani',        href: 'https://github.com/tanujpalasani' },
  { icon: FaMapMarkerAlt,  label: 'Location', value: 'Jalandhar, Punjab, India',        href: null },
];

// ── Component ─────────────────────────────────────────────────────────────────
export default function Contact() {
  const [fields, setFields] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState('idle'); // idle | sending | sent

  const set = (key) => (val) => setFields((f) => ({ ...f, [key]: val }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus('sending');
    setTimeout(() => {
      setStatus('sent');
      setTimeout(() => {
        setStatus('idle');
        setFields({ name: '', email: '', subject: '', message: '' });
      }, 3000);
    }, 1400);
  };

  return (
    <section id="contact" className="section-shell px-4 py-28 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mb-16 text-center"
        >
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-teal-600 dark:text-teal-400">
            Contact
          </p>
          <h2 className="display-font mt-3 text-4xl font-black text-slate-950 dark:text-white sm:text-5xl">
            Let's{' '}
            <span className="bg-gradient-to-r from-teal-500 to-cyan-400 bg-clip-text text-transparent">
              build together
            </span>
          </h2>
          <p className="mx-auto mt-4 max-w-md text-base text-slate-500 dark:text-slate-400">
            Open for internships, collaborations, and interesting projects. Reach out anytime.
          </p>
        </motion.div>

        <div className="grid gap-10 lg:grid-cols-[1fr_0.85fr]">
          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="glass-panel rounded-[2rem] p-8">
              <div className="mb-7 flex items-center gap-3">
                <motion.div
                  animate={{ rotate: [0, 20, -15, 0], scale: [1, 1.2, 1] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="text-teal-500"
                >
                  <HiSparkles size={22} />
                </motion.div>
                <p className="text-sm font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
                  Send a message
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <FloatField id="name"    label="Your name"  value={fields.name}    onChange={set('name')} />
                  <FloatField id="email"   label="Email address" type="email" value={fields.email}  onChange={set('email')} />
                </div>
                <FloatField id="subject" label="Subject"    value={fields.subject} onChange={set('subject')} />
                <FloatField id="message" label="Message"    value={fields.message} onChange={set('message')} multiline />
                <SendButton status={status} />
              </form>
            </div>
          </motion.div>

          {/* Info side */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-6"
          >
            {/* Availability badge */}
            <div className="glass-panel rounded-[2rem] p-7">
              <div className="mb-4 flex items-center gap-3">
                <motion.span
                  animate={{ scale: [1, 1.5, 1], opacity: [1, 0.6, 1] }}
                  transition={{ duration: 1.6, repeat: Infinity }}
                  className="h-3 w-3 rounded-full bg-teal-500 shadow-lg shadow-teal-500/50"
                />
                <span className="text-sm font-bold text-teal-600 dark:text-teal-400">
                  Currently available
                </span>
              </div>
              <p className="text-sm leading-7 text-slate-600 dark:text-slate-300">
                Actively seeking internship opportunities in ML engineering, backend development,
                and full-stack roles. Response within 24 hours.
              </p>
            </div>

            {/* Contact links */}
            <div className="space-y-3">
              {links.map(({ icon: Icon, label, value, href }, i) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.5 }}
                  whileHover={{ x: 6 }}
                >
                  {href ? (
                    <a
                      href={href}
                      target={href.startsWith('http') ? '_blank' : undefined}
                      rel="noopener noreferrer"
                      className="glass-panel flex items-center gap-4 rounded-2xl p-5 transition hover:border-teal-400/40"
                    >
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-teal-500/10 text-teal-500">
                        <Icon size={18} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold uppercase tracking-widest text-slate-400">{label}</p>
                        <p className="truncate text-sm font-semibold text-slate-800 dark:text-slate-100">{value}</p>
                      </div>
                    </a>
                  ) : (
                    <div className="glass-panel flex items-center gap-4 rounded-2xl p-5">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-teal-500/10 text-teal-500">
                        <Icon size={18} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold uppercase tracking-widest text-slate-400">{label}</p>
                        <p className="truncate text-sm font-semibold text-slate-800 dark:text-slate-100">{value}</p>
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
