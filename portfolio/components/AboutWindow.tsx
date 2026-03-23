"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import {
  BadgeCheck,
  Bot,
  Brain,
  Code2,
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
        <span className="ml-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-cyan-200/70">devos shell</span>
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
  const profileSrc: string | null = null;

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
        className="relative overflow-hidden rounded-3xl border border-white/18 bg-black/45 p-4 shadow-[0_30px_70px_rgba(0,0,0,0.42)] backdrop-blur-2xl"
      >
        <motion.div
          className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/2 bg-gradient-to-r from-transparent via-white/10 to-transparent"
          animate={{ x: ["-80%", "220%"] }}
          transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut", repeatDelay: 2.2 }}
        />

        <div className="space-y-4 rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.08] to-white/[0.03] p-4">
          <motion.div
            whileHover={{ scale: 1.04 }}
            className="relative mx-auto h-52 w-52 overflow-hidden rounded-2xl border border-cyan-200/30 bg-gradient-to-br from-cyan-500/18 to-violet-500/14"
          >
            {profileSrc ? (
              <motion.div whileHover={{ scale: 1.08 }} transition={{ duration: 0.35 }} className="h-full w-full">
                <Image src={profileSrc} alt={portfolio.personal.name} fill sizes="208px" className="object-cover" />
              </motion.div>
            ) : (
              <div className="flex h-full flex-col items-center justify-center gap-2 text-center">
                <MonitorCog size={34} className="text-cyan-200/80" />
                <p className="text-sm font-semibold text-slate-100">Profile Placeholder</p>
                <p className="text-xs text-slate-400">Upload image</p>
              </div>
            )}
          </motion.div>

          <div className="space-y-1 text-center">
            <p className="text-lg font-semibold text-white">{portfolio.personal.name}</p>
            <p className="text-xs font-medium uppercase tracking-[0.13em] text-cyan-100/85">{portfolio.personal.role}</p>
          </div>

          <div className="inline-flex items-center gap-2 rounded-md border border-emerald-300/35 bg-emerald-400/12 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-emerald-200">
            <BadgeCheck size={12} />
            {portfolio.personal.statusLabel}
          </div>
        </div>
      </motion.div>
    </motion.section>
  );
}

function CapabilityCard({ title, Icon, items, glow, index }: Capability & { index: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35 + index * 0.07, duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -4, boxShadow: "0 14px 34px rgba(2,6,23,0.42)" }}
      className="group relative overflow-hidden rounded-xl border border-white/12 bg-white/[0.04] p-3.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] backdrop-blur-md transition-colors"
    >
      <div className={`pointer-events-none absolute -right-8 -top-8 h-20 w-20 rounded-full bg-gradient-to-br ${glow} opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100`} />
      <div className="relative space-y-2">
        <div className="flex items-center gap-2">
          <div className="rounded-md border border-white/12 bg-white/[0.04] p-1.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:scale-110">
            <Icon size={14} className="text-cyan-100" />
          </div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-200/90">{title}</p>
        </div>
        <p className="text-xs leading-5 text-slate-300/80">{items}</p>
        <div className="h-1 overflow-hidden rounded-full bg-white/10">
          <motion.div
            initial={{ width: "22%" }}
            whileHover={{ width: "92%" }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className={`h-full rounded-full bg-gradient-to-r ${glow}`}
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
            [ DEVOS USER PROFILE LOADED ]
          </span>
        </motion.div>

        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.28, duration: 0.4 }}
          className="space-y-2"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-white/14 bg-white/[0.04] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-200/85">
            <Bot size={12} />
            System Capabilities
          </div>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">{capabilityNodes}</div>
        </motion.section>
      </div>
    </motion.section>
  );
}
