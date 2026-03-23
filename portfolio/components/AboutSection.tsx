"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  BrainCircuit,
  Cpu,
  Download,
  Github,
  Linkedin,
  Mail,
  MessageSquare,
  Rocket,
  Server,
  Workflow,
  Wrench,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Image from "next/image";

import { portfolio } from "@/data/portfolio";
import { useWindowStore } from "@/store/useWindowStore";

type TechItem = {
  label: string;
  Icon: LucideIcon;
  glow: string;
};

type HighlightItem = {
  label: string;
  value: string;
};

const introLines = [
  "I build fast full-stack products with clean architecture and measurable impact.",
  "I design ML-enabled features that move from prototype to production without friction.",
  "I care deeply about developer experience, reliability, and product clarity.",
];

const techItems: TechItem[] = [
  { label: "React", Icon: Workflow, glow: "from-cyan-400/35 to-blue-500/35" },
  { label: "Next.js", Icon: Cpu, glow: "from-slate-400/35 to-slate-200/35" },
  { label: "Node.js", Icon: Server, glow: "from-emerald-400/35 to-green-500/35" },
  { label: "Python", Icon: BrainCircuit, glow: "from-blue-400/35 to-indigo-500/35" },
  { label: "MongoDB", Icon: Server, glow: "from-emerald-500/35 to-teal-500/35" },
  { label: "MLOps", Icon: Wrench, glow: "from-fuchsia-400/35 to-purple-500/35" },
];

const highlights: HighlightItem[] = [
  { label: "Patent", value: "AI chore scheduler" },
  { label: "Hackathon", value: "Runner-up" },
  { label: "Focus", value: "Scalable systems" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

function SocialButton({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  const isExternal = href.startsWith("http");

  return (
    <motion.a
      href={href}
      aria-label={label}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
      whileHover={{ y: -3, scale: 1.08 }}
      whileTap={{ scale: 0.94 }}
      className="group relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-black/35 text-slate-300 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] transition-all hover:border-cyan-300/45 hover:text-cyan-200"
    >
      <span className="pointer-events-none absolute inset-0 rounded-full bg-cyan-300/0 blur-md transition group-hover:bg-cyan-300/20" />
      <span className="relative z-10">{children}</span>
    </motion.a>
  );
}

function SystemCard({
  title,
  accent,
  children,
  delay,
}: {
  title: string;
  accent: string;
  children: React.ReactNode;
  delay: number;
}) {
  return (
    <motion.article
      variants={fadeUp}
      initial="hidden"
      animate="show"
      transition={{ delay, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -6 }}
      className="group relative overflow-hidden rounded-2xl border border-white/12 bg-gradient-to-br from-white/[0.07] via-white/[0.03] to-transparent p-5 backdrop-blur-md"
    >
      <div className={`pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-gradient-to-br ${accent} opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100`} />
      <div className="relative space-y-3">{children}</div>
      <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-white/0 transition group-hover:ring-cyan-300/25" />
      <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-300/80">{title}</h3>
    </motion.article>
  );
}

function TerminalBlock() {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      animate="show"
      transition={{ delay: 0.45, duration: 0.45 }}
      className="overflow-hidden rounded-xl border border-emerald-300/20 bg-black/70 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
    >
      <div className="flex items-center gap-2 border-b border-emerald-300/15 bg-emerald-400/5 px-3 py-2">
        <span className="h-2 w-2 rounded-full bg-red-400/80" />
        <span className="h-2 w-2 rounded-full bg-yellow-400/80" />
        <span className="h-2 w-2 rounded-full bg-green-400/80" />
        <span className="ml-2 text-[10px] font-medium uppercase tracking-[0.12em] text-emerald-200/70">identity shell</span>
      </div>

      <div className="space-y-1.5 px-4 py-3 font-mono text-xs leading-5 sm:text-sm">
        <p className="text-emerald-300">&gt; whoami</p>
        <p className="pl-4 text-emerald-100/90">Tanuj - full-stack and ML developer</p>
        <p className="pt-1 text-emerald-300">&gt; status</p>
        <p className="pl-4 text-emerald-100/90">building scalable systems...</p>
        <p className="text-emerald-300">
          &gt; <motion.span animate={{ opacity: [1, 0, 1] }} transition={{ duration: 1, repeat: Infinity }} className="inline-block h-4 w-2 translate-y-0.5 bg-emerald-300" />
        </p>
      </div>
    </motion.div>
  );
}

export default function AboutSection() {
  const openWindow = useWindowStore((state) => state.openWindow);
  const profileImageSrc: string | null = null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      className="relative isolate overflow-hidden rounded-2xl border border-white/12 bg-[linear-gradient(160deg,rgba(2,8,23,0.95)_0%,rgba(5,10,30,0.9)_55%,rgba(3,6,16,0.95)_100%)] p-4 sm:p-6"
    >
      <div className="pointer-events-none absolute inset-0 opacity-[0.06] [background-image:linear-gradient(rgba(56,189,248,0.25)_1px,transparent_1px),linear-gradient(90deg,rgba(56,189,248,0.18)_1px,transparent_1px)] [background-size:26px_26px]" />
      <motion.div
        className="pointer-events-none absolute -left-24 -top-20 h-64 w-64 rounded-full bg-cyan-400/20 blur-3xl"
        animate={{ x: [0, 24, 0], y: [0, -14, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="pointer-events-none absolute -bottom-24 -right-20 h-72 w-72 rounded-full bg-purple-500/18 blur-3xl"
        animate={{ x: [0, -20, 0], y: [0, 12, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative z-10 space-y-6">
        <div className="grid gap-5 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
          <div className="space-y-5">
            <motion.span
              variants={fadeUp}
              initial="hidden"
              animate="show"
              transition={{ delay: 0.05, duration: 0.35 }}
              className="inline-flex items-center rounded-full border border-cyan-300/35 bg-cyan-300/10 px-3 py-1 text-xs font-semibold tracking-wide text-cyan-100"
            >
              Hi, I&apos;m Tanuj
            </motion.span>

            <div className="space-y-2">
              <motion.h1
                initial={{ opacity: 0, x: -30, filter: "blur(10px)" }}
                animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                transition={{ delay: 0.12, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                className="text-4xl font-black leading-[1.02] tracking-tight sm:text-5xl lg:text-6xl"
              >
                <span className="bg-gradient-to-r from-cyan-200 via-sky-300 to-violet-300 bg-clip-text text-transparent drop-shadow-[0_0_26px_rgba(56,189,248,0.35)]">
                  Tanuj Palasani
                </span>
              </motion.h1>

              <motion.p
                variants={fadeUp}
                initial="hidden"
                animate="show"
                transition={{ delay: 0.18, duration: 0.4 }}
                className="text-sm font-semibold tracking-[0.03em] text-slate-100/92 sm:text-base"
              >
                Full Stack Developer | ML Engineer
              </motion.p>
            </div>

            <motion.div
              initial="hidden"
              animate="show"
              variants={{ show: { transition: { staggerChildren: 0.08, delayChildren: 0.26 } } }}
              className="max-w-2xl space-y-1.5"
            >
              {introLines.map((line) => (
                <motion.p key={line} variants={fadeUp} className="text-sm leading-6 text-slate-300/85">
                  {line}
                </motion.p>
              ))}
            </motion.div>

            <TerminalBlock />

            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="show"
              transition={{ delay: 0.58, duration: 0.4 }}
              className="flex flex-wrap items-center gap-3"
            >
              <motion.a
                href={portfolio.personal.resumePath}
                download
                whileHover={{ y: -2, scale: 1.03 }}
                whileTap={{ scale: 0.96 }}
                className="group inline-flex items-center gap-2 rounded-xl border border-cyan-300/40 bg-gradient-to-r from-cyan-500/22 to-blue-500/22 px-4 py-2.5 text-sm font-semibold text-cyan-50 shadow-[0_10px_24px_rgba(6,182,212,0.2)]"
              >
                <Download size={15} />
                <span>View Resume</span>
                <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
              </motion.a>

              <motion.button
                type="button"
                onClick={() => openWindow("contact", "Contact")}
                whileHover={{ y: -2, scale: 1.03 }}
                whileTap={{ scale: 0.96 }}
                className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/[0.06] px-4 py-2.5 text-sm font-semibold text-white/90"
              >
                <MessageSquare size={15} />
                <span>Contact</span>
              </motion.button>
            </motion.div>

            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="show"
              transition={{ delay: 0.65, duration: 0.4 }}
              className="flex items-center gap-2"
            >
              <SocialButton href={portfolio.personal.github} label="GitHub">
                <Github size={16} />
              </SocialButton>
              <SocialButton href={portfolio.personal.linkedin} label="LinkedIn">
                <Linkedin size={16} />
              </SocialButton>
              <SocialButton href={`mailto:${portfolio.personal.email}`} label="Email">
                <Mail size={16} />
              </SocialButton>
            </motion.div>
          </div>

          <motion.aside
            initial={{ opacity: 0, scale: 0.92, y: 18 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.22, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-start justify-center lg:justify-end"
          >
            <motion.div
              whileHover={{ y: -6, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 320, damping: 22 }}
              className="group relative w-full max-w-[300px]"
            >
              <motion.div
                className="pointer-events-none absolute -inset-1.5 rounded-3xl bg-gradient-to-br from-cyan-300/40 via-blue-400/30 to-violet-400/40 blur-2xl"
                animate={{ opacity: [0.45, 0.85, 0.45] }}
                transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
              />

              <div className="relative overflow-hidden rounded-3xl border border-white/20 bg-black/55 p-4 backdrop-blur-2xl">
                <div className="space-y-4 rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.08] to-white/[0.02] p-4">
                  <div className="relative mx-auto flex h-52 w-52 items-center justify-center overflow-hidden rounded-full border border-cyan-200/30 bg-gradient-to-br from-cyan-500/15 to-purple-500/15">
                    {profileImageSrc ? (
                      <Image
                        src={profileImageSrc}
                        alt="Tanuj Palasani"
                        fill
                        sizes="208px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="space-y-1 px-6 text-center">
                        <p className="text-sm font-semibold text-slate-100">Upload Profile Image</p>
                        <p className="text-xs text-slate-400">identity not linked yet</p>
                      </div>
                    )}
                  </div>

                  <div className="inline-flex items-center gap-2 rounded-md border border-emerald-300/30 bg-emerald-400/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-emerald-200">
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-300" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-300" />
                    </span>
                    <span>STATUS: AVAILABLE / BUILDING</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.aside>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <SystemCard title="System Summary" accent="from-cyan-400/40 to-blue-500/20" delay={0.75}>
            <div className="flex items-center gap-2 text-cyan-200">
              <Cpu size={16} />
              <p className="text-sm font-semibold text-white">Developer Dashboard</p>
            </div>
            <p className="text-sm leading-6 text-slate-300/85">
              CS undergraduate at LPU building dependable full-stack and ML products with production-oriented thinking.
            </p>
          </SystemCard>

          <SystemCard title="Tech Stack Grid" accent="from-violet-400/45 to-fuchsia-400/20" delay={0.82}>
            <div className="grid grid-cols-2 gap-2.5">
              {techItems.map(({ label, Icon, glow }, index) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.9 + index * 0.04, duration: 0.25 }}
                  whileHover={{ y: -2, scale: 1.03 }}
                  className={`flex items-center gap-2 rounded-lg border border-white/12 bg-gradient-to-br ${glow} px-2.5 py-2 text-xs font-medium text-slate-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]`}
                >
                  <Icon size={13} className="text-white" />
                  <span>{label}</span>
                </motion.div>
              ))}
            </div>
          </SystemCard>

          <SystemCard title="Highlights" accent="from-amber-400/45 to-orange-500/20" delay={0.89}>
            <div className="flex items-center gap-2 text-amber-200">
              <Rocket size={16} />
              <p className="text-sm font-semibold text-white">Impact Signals</p>
            </div>
            <div className="space-y-2">
              {highlights.map((item, index) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.98 + index * 0.06, duration: 0.25 }}
                  className="flex items-center justify-between rounded-lg border border-white/12 bg-white/[0.05] px-3 py-2 text-xs"
                >
                  <span className="text-slate-300">{item.label}</span>
                  <span className="font-semibold text-slate-100">{item.value}</span>
                </motion.div>
              ))}
            </div>
          </SystemCard>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.05, duration: 0.45 }}
          className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-cyan-200/10"
        />
        <motion.div
          initial={{ opacity: 0.4 }}
          animate={{ opacity: [0.25, 0.45, 0.25] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="pointer-events-none absolute inset-0 rounded-2xl bg-[radial-gradient(circle_at_70%_0%,rgba(56,189,248,0.16),transparent_40%)]"
        />
      </div>
    </motion.section>
  );
}
