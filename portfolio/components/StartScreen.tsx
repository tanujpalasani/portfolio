"use client";

import { motion } from "framer-motion";

type StartScreenProps = {
  onStart: () => void;
};

export default function StartScreen({ onStart }: StartScreenProps) {
  return (
    <motion.section
      className="relative flex h-screen w-screen items-center justify-center overflow-hidden bg-black text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_18%,rgba(56,189,248,0.25),transparent_42%),radial-gradient(circle_at_78%_78%,rgba(14,165,233,0.2),transparent_48%),linear-gradient(155deg,#020617_0%,#02050f_45%,#000000_100%)]" />
      <div className="absolute inset-0 opacity-35 [background-image:linear-gradient(rgba(148,163,184,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.07)_1px,transparent_1px)] [background-size:42px_42px]" />

      <motion.div
        className="absolute h-[18rem] w-[18rem] rounded-full bg-cyan-400/20 blur-[100px]"
        animate={{ scale: [0.95, 1.08, 0.95], opacity: [0.22, 0.34, 0.22] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        className="relative z-10 mx-4 w-full max-w-2xl rounded-[2rem] border border-white/15 bg-black/30 px-8 py-14 text-center shadow-[0_35px_120px_rgba(14,116,144,0.3)] backdrop-blur-2xl sm:px-12"
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut" }}
      >
        <p className="text-xs uppercase tracking-[0.32em] text-sky-300/80">Boot Sequence</p>
        <h1 className="mt-4 bg-gradient-to-r from-cyan-100 via-sky-200 to-cyan-300 bg-clip-text text-5xl font-bold tracking-[0.1em] text-transparent drop-shadow-[0_0_20px_rgba(125,211,252,0.3)] sm:text-7xl">
          TanuOS
        </h1>
        <p className="mt-4 text-sm tracking-[0.2em] text-slate-300 sm:text-base">Interactive Portfolio</p>

        <motion.button
          type="button"
          onClick={onStart}
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: "spring", stiffness: 320, damping: 20 }}
          className="mt-10 inline-flex origin-center items-center justify-center rounded-2xl border border-sky-300/55 bg-sky-400/15 px-9 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-sky-100 shadow-[0_16px_36px_rgba(14,165,233,0.26)] transition-all duration-400 ease-in-out hover:border-sky-100/80 hover:bg-sky-300/24 hover:shadow-[0_20px_50px_rgba(56,189,248,0.45)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300/80 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
        >
          Start System
        </motion.button>

        <div className="mt-6 flex items-center justify-center gap-2 text-xs uppercase tracking-[0.18em] text-slate-300/80">
          <motion.span
            className="inline-block h-1.5 w-1.5 rounded-full bg-cyan-300"
            animate={{ opacity: [0.35, 1, 0.35], scale: [0.95, 1.15, 0.95] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          />
          Click to start system
        </div>
      </motion.div>
    </motion.section>
  );
}
