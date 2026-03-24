"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import {
  BadgeCheck,
  Bot,
  Brain,
  Code2,
  FileText,
  Github,
  Linkedin,
  MonitorCog,
  Server,
  Wrench,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";

import { portfolio } from "@/data/portfolio";

type Capability = {
  title: string;
  Icon: React.ComponentType<{ size?: number; className?: string }>;
  items: string;
  glow: string;
};

const TERMINAL_LINES = [
  "> initializing profile...",
  "> loading modules...",
  "",
  "> whoami",
  `> ${portfolio.personal.shortName} - ${portfolio.personal.role}`,
  "",
  "> status",
  `> ${portfolio.personal.summary} | ${portfolio.personal.location}`,
  "",
  "> skills --core",
  `> ${portfolio.skills.coreStack.join(" - ")}`,
  "",
  "> current_focus",
  "> Building practical AI systems + scalable architecture",
];

const CAPABILITIES: Capability[] = [
  {
    title: "Languages",
    Icon: Code2,
    items: portfolio.skills.languages.join(", "),
    glow: "from-cyan-400/35 to-blue-500/20",
  },
  {
    title: "Stack",
    Icon: Server,
    items: portfolio.skills.web.join(", "),
    glow: "from-indigo-400/35 to-violet-500/20",
  },
  {
    title: "AI/ML",
    Icon: Brain,
    items: portfolio.skills.machineLearning.join(", "),
    glow: "from-fuchsia-400/35 to-purple-500/20",
  },
  {
    title: "Tools",
    Icon: Wrench,
    items: portfolio.skills.tools.join(", "),
    glow: "from-emerald-400/35 to-teal-500/20",
  },
];

function sleep(ms: number) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

function TerminalPanel() {
  const [typed, setTyped] = useState<string[]>(() => TERMINAL_LINES.map(() => ""));
  const [currentIndex, setCurrentIndex] = useState(0);
  const runIdRef = useRef(0);

  useEffect(() => {
    const runId = ++runIdRef.current;
    const isStale = () => runId !== runIdRef.current;

    const typeAll = async () => {
      setTyped(TERMINAL_LINES.map(() => ""));
      setCurrentIndex(0);

      for (let i = 0; i < TERMINAL_LINES.length; i += 1) {
        if (isStale()) {
          return;
        }

        setCurrentIndex(i);
        const line = TERMINAL_LINES[i];

        if (!line) {
          await sleep(120 + Math.floor(Math.random() * 100));
          continue;
        }

        for (let c = 0; c < line.length; c += 1) {
          if (isStale()) {
            return;
          }

          const text = line.slice(0, c + 1);
          setTyped((prev) => {
            if (isStale()) {
              return prev;
            }
            const next = [...prev];
            next[i] = text;
            return next;
          });

          await sleep(18 + Math.floor(Math.random() * 28));
        }

        const isCommand = line.startsWith("> ");
        await sleep((isCommand ? 180 : 120) + Math.floor(Math.random() * 140));
      }
    };

    typeAll();

    return () => {
      runIdRef.current += 1;
    };
  }, []);

  return (
    <motion.section
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="overflow-hidden rounded-2xl border border-cyan-300/18 bg-black/55 shadow-[inset_0_1px_0_rgba(255,255,255,0.06),inset_0_-24px_34px_rgba(2,6,23,0.45),0_24px_60px_rgba(0,0,0,0.35)] backdrop-blur-xl"
    >
      <div className="flex items-center gap-2 border-b border-cyan-200/15 bg-cyan-300/5 px-4 py-2">
        <span className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
        <span className="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
        <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
        <span className="ml-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-cyan-200/70">tanuos shell</span>
      </div>

      <div className="space-y-1.5 px-5 py-4 font-mono text-[13px] leading-6 sm:text-sm">
        {typed.map((line, index) => (
          <p key={index} className={line.startsWith("> ") ? "text-cyan-200/92 drop-shadow-[0_0_10px_rgba(34,211,238,0.22)]" : "text-emerald-200/90"}>
            {line}
            {index === currentIndex && (
              <motion.span
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 0.9, repeat: Infinity, ease: "linear" }}
                className="ml-0.5 text-cyan-200"
              >
                _
              </motion.span>
            )}
          </p>
        ))}
      </div>
    </motion.section>
  );
}

function ProfileCard() {
  const profileSrc = "/tanuj_image/profile.jpg";
  const quickActions = [
    { label: "Resume", href: portfolio.personal.resumePath, Icon: FileText, primary: true },
    { label: "LinkedIn", href: portfolio.personal.linkedin, Icon: Linkedin, primary: false },
    { label: "GitHub", href: portfolio.personal.github, Icon: Github, primary: false },
  ];

  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const springX = useSpring(rotateX, { stiffness: 220, damping: 24, mass: 0.5 });
  const springY = useSpring(rotateY, { stiffness: 220, damping: 24, mass: 0.5 });

  const handleMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;

    rotateY.set((x - 0.5) * 8);
    rotateX.set((0.5 - y) * 8);
  };

  const handleLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  return (
    <motion.section
      initial={{ opacity: 0, x: 24, scale: 0.96 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      className="relative"
    >
      <motion.div
        className="pointer-events-none absolute -inset-1.5 rounded-3xl bg-gradient-to-br from-cyan-300/40 via-blue-400/28 to-violet-400/35 blur-2xl"
        animate={{ opacity: [0.45, 0.78, 0.45] }}
        transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        style={{ rotateX: springX, rotateY: springY, transformPerspective: 1200 }}
        whileHover={{
          y: -6,
          borderColor: "rgba(186,230,253,0.38)",
          boxShadow: "0 40px 94px rgba(0,0,0,0.52), 0 0 32px rgba(56,189,248,0.22)",
        }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="relative overflow-hidden rounded-3xl border border-cyan-100/18 bg-black/45 p-4 shadow-[0_30px_70px_rgba(0,0,0,0.42),inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-2xl"
      >
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/[0.05] via-transparent to-transparent" />
        <div className="pointer-events-none absolute -bottom-14 left-1/2 h-44 w-[75%] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(56,189,248,0.18)_0%,rgba(59,130,246,0.08)_42%,transparent_72%)] blur-3xl" />

        <motion.div
          className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/2 bg-gradient-to-r from-transparent via-white/10 to-transparent"
          animate={{ x: ["-80%", "220%"] }}
          transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut", repeatDelay: 2.2 }}
        />

        <div className="relative space-y-4 rounded-2xl border border-cyan-100/15 bg-gradient-to-br from-white/[0.08] to-white/[0.03] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.06),inset_0_-20px_30px_rgba(2,6,23,0.35)]">
          <div className="pointer-events-none absolute inset-0 rounded-2xl bg-[radial-gradient(circle_at_18%_12%,rgba(255,255,255,0.12)_0%,transparent_35%),radial-gradient(circle_at_82%_88%,rgba(56,189,248,0.1)_0%,transparent_38%)]" />

          <div className="relative mx-auto h-48 w-48">
            <motion.div
              className="pointer-events-none absolute -inset-0.5 rounded-full border border-cyan-100/55"
              animate={{ opacity: [0.65, 1, 0.65] }}
              transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
            />

            <motion.div
              className="pointer-events-none absolute -inset-3 rounded-full border border-cyan-200/25 blur-[1px]"
              animate={{ opacity: [0.35, 0.75, 0.35], scale: [0.97, 1.05, 0.97] }}
              transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
            />

            <motion.div
              className="pointer-events-none absolute -inset-6 rounded-full bg-[radial-gradient(circle,rgba(56,189,248,0.24)_0%,rgba(59,130,246,0.11)_45%,transparent_72%)] blur-2xl"
              animate={{ opacity: [0.32, 0.66, 0.32], scale: [0.95, 1.06, 0.95] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />

            <motion.div
              whileHover={{ scale: 1.04 }}
              className="relative h-full w-full overflow-hidden rounded-full border border-cyan-200/35 bg-gradient-to-br from-cyan-500/18 to-violet-500/14"
            >
              {profileSrc ? (
                <motion.div whileHover={{ scale: 1.1 }} transition={{ duration: 0.35 }} className="h-full w-full">
                  <Image src={profileSrc} alt={portfolio.personal.name} fill sizes="192px" className="object-cover" />
                </motion.div>
              ) : (
                <div className="flex h-full flex-col items-center justify-center gap-2 text-center">
                  <MonitorCog size={34} className="text-cyan-200/80" />
                  <p className="text-sm font-semibold text-slate-100">Profile Placeholder</p>
                  <p className="text-xs text-slate-400">Upload image</p>
                </div>
              )}
            </motion.div>
          </div>

          <div className="space-y-1 text-center">
            <p className="bg-gradient-to-r from-cyan-100 via-sky-100 to-cyan-300 bg-clip-text text-lg font-semibold tracking-[0.04em] text-transparent drop-shadow-[0_0_14px_rgba(56,189,248,0.3)]">
              {portfolio.personal.name}
            </p>
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-cyan-100/85">{portfolio.personal.role}</p>
          </div>

          <div className="flex flex-wrap justify-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-300/35 bg-emerald-400/12 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.13em] text-emerald-200 backdrop-blur-sm">
              <motion.span
                className="h-1.5 w-1.5 rounded-full bg-emerald-300"
                animate={{ opacity: [0.45, 1, 0.45], scale: [0.9, 1.12, 0.9] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.span
                animate={{ textShadow: ["0 0 4px rgba(110,231,183,0.35)", "0 0 10px rgba(110,231,183,0.72)", "0 0 4px rgba(110,231,183,0.35)"] }}
                transition={{ duration: 2.1, repeat: Infinity, ease: "easeInOut" }}
              >
                Status: Active
              </motion.span>
            </span>
            <span className="inline-flex items-center rounded-full border border-cyan-300/35 bg-cyan-400/12 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.13em] text-cyan-100 backdrop-blur-sm">
              Location: India
            </span>
            <span className="inline-flex items-center rounded-full border border-violet-300/35 bg-violet-400/12 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.13em] text-violet-100 backdrop-blur-sm">
              Availability: Open to Work
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {quickActions.map(({ label, href, Icon, primary }) => (
              <motion.a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                whileHover={{ y: -2, scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className={`inline-flex items-center justify-center gap-1.5 rounded-lg border px-2 py-1.5 text-[11px] font-semibold transition-all duration-300 ${
                  primary
                    ? "border-cyan-100/60 bg-cyan-300/26 text-cyan-50 shadow-[0_10px_26px_rgba(56,189,248,0.34)] hover:border-cyan-50 hover:bg-cyan-300/32 hover:shadow-[0_14px_32px_rgba(56,189,248,0.46)]"
                    : "border-cyan-200/25 bg-cyan-300/10 text-cyan-100 shadow-[0_8px_20px_rgba(2,6,23,0.3)] hover:border-cyan-100/55 hover:bg-cyan-300/18 hover:shadow-[0_10px_26px_rgba(56,189,248,0.28)]"
                }`}
              >
                <Icon size={12} />
                <span>{label}</span>
              </motion.a>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.section>
  );
}

function CapabilityCard({ title, Icon, items, glow, index }: Capability & { index: number }) {
  const progressByTitle: Record<string, string> = {
    Languages: "86%",
    Stack: "84%",
    "AI/ML": "78%",
    Tools: "82%",
  };

  const barWidth = progressByTitle[title] ?? "80%";

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35 + index * 0.07, duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{
        y: -5,
        boxShadow: "0 16px 36px rgba(2,6,23,0.46), 0 0 24px rgba(56,189,248,0.12)",
        borderColor: "rgba(186,230,253,0.28)",
        backgroundColor: "rgba(255,255,255,0.065)",
      }}
      className="group relative overflow-hidden rounded-xl border border-white/12 bg-white/[0.04] p-3.5 opacity-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.05),inset_0_-18px_24px_rgba(2,6,23,0.24)] backdrop-blur-lg transition-[opacity,background-color,border-color,box-shadow] duration-300 group-hover/capabilities:opacity-75 hover:!opacity-100"
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/[0.04] via-transparent to-cyan-300/[0.03]" />
      <div className={`pointer-events-none absolute -right-8 -top-8 h-20 w-20 rounded-full bg-gradient-to-br ${glow} opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100`} />
      <div className="relative space-y-2">
        <div className="flex items-center gap-2">
          <motion.div
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ duration: 4.6, repeat: Infinity, ease: "easeInOut", delay: index * 0.2 }}
            className="rounded-md border border-white/12 bg-white/[0.04] p-1.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:scale-110"
          >
            <Icon size={14} className="text-cyan-100 drop-shadow-[0_0_8px_rgba(56,189,248,0)] transition-all duration-300 group-hover:drop-shadow-[0_0_10px_rgba(56,189,248,0.45)]" />
          </motion.div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-200/90">{title}</p>
        </div>
        <p className="text-xs leading-5 text-slate-300/80">{items}</p>
        <div className="relative h-1 overflow-hidden rounded-full bg-white/10">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: barWidth }}
            transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1], delay: 0.42 + index * 0.08 }}
            className={`h-full rounded-full bg-gradient-to-r ${glow}`}
            style={{ boxShadow: "0 0 12px rgba(56,189,248,0.35)" }}
          />

          <motion.div
            className="pointer-events-none absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/45 to-transparent"
            animate={{ x: ["-120%", "320%"] }}
            transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut", repeatDelay: 1.6, delay: index * 0.12 }}
          />
        </div>
      </div>
    </motion.article>
  );
}

export default function AboutWindow() {
  const capabilityNodes = useMemo(
    () => CAPABILITIES.map((item, index) => <CapabilityCard key={item.title} {...item} index={index} />),
    [],
  );

  return (
    <motion.section
      initial={{ opacity: 0, scale: 0.97, y: 16 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className="relative isolate overflow-hidden rounded-2xl border border-white/12 bg-[linear-gradient(160deg,rgba(2,8,23,0.95)_0%,rgba(5,10,30,0.9)_55%,rgba(3,6,16,0.95)_100%)] p-4 sm:p-5"
    >
      <motion.div
        className="pointer-events-none absolute -left-20 -top-16 h-56 w-56 rounded-full bg-cyan-400/18 blur-3xl"
        animate={{ x: [0, 16, 0], y: [0, -10, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="pointer-events-none absolute -bottom-20 -right-12 h-64 w-64 rounded-full bg-violet-500/18 blur-3xl"
        animate={{ x: [0, -14, 0], y: [0, 8, 0] }}
        transition={{ duration: 13, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="pointer-events-none absolute inset-0 opacity-[0.04] [background-image:linear-gradient(rgba(148,163,184,0.3)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.28)_1px,transparent_1px)] [background-size:26px_26px]" />

      <div className="relative z-10 space-y-4">
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
          <TerminalPanel />
          <ProfileCard />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.22, duration: 0.35 }}
          className="flex flex-wrap items-center gap-2"
        >
          <span className="rounded-md border border-emerald-300/25 bg-emerald-400/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-emerald-200">
            [ PROFILE INITIALIZED ]
          </span>
          <span className="rounded-md border border-cyan-300/25 bg-cyan-400/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-cyan-200">
            [ TANUOS USER PROFILE LOADED ]
          </span>
        </motion.div>

        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.28, duration: 0.4 }}
          className="relative space-y-2 overflow-hidden rounded-xl"
        >
          <div className="pointer-events-none absolute inset-0 opacity-[0.04] [background-image:linear-gradient(rgba(148,163,184,0.25)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.24)_1px,transparent_1px)] [background-size:18px_18px]" />
          <div className="pointer-events-none absolute -left-10 top-0 h-28 w-28 rounded-full bg-cyan-400/10 blur-2xl" />
          <div className="pointer-events-none absolute -right-8 bottom-0 h-24 w-24 rounded-full bg-violet-400/10 blur-2xl" />

          <div className="inline-flex items-center gap-2 rounded-full border border-white/14 bg-white/[0.04] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-200/85">
            <Bot size={12} />
            System Capabilities
          </div>
          <div className="group/capabilities grid gap-3 md:grid-cols-2 lg:grid-cols-4">{capabilityNodes}</div>
        </motion.section>
      </div>
    </motion.section>
  );
}
