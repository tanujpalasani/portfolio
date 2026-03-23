"use client";

import { motion } from "framer-motion";
import { ExternalLink, MapPin, MessageSquare, Users } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import { portfolio } from "@/data/portfolio";

type ActivityCard = {
  title: string;
  category: "Projects" | "Learning" | "Achievements";
  summary: string;
};

const ACTIVITY_CARDS: ActivityCard[] = [
  ...portfolio.projects.slice(0, 1).map((project) => ({
    title: project.name,
    category: "Projects" as const,
    summary: project.description,
  })),
  ...portfolio.education.slice(0, 1).map((item) => ({
    title: `${item.degree.split(" - ")[0]} @ ${item.institution}`,
    category: "Learning" as const,
    summary: item.scoreLabel,
  })),
  ...portfolio.achievements.slice(0, 1).map((item) => ({
    title: item.title,
    category: "Achievements" as const,
    summary: item.impact,
  })),
];

const LOG_LINES = [
  "[ INIT ] Connecting to LinkedIn...",
  "[ OK ] Profile fetched",
  "[ INFO ] Activity synced",
  "[ DONE ] Ready",
] as const;

function sleep(ms: number) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

function logSeverityClass(line: string) {
  if (line.includes("[ DONE ]")) {
    return "text-cyan-200/95";
  }
  if (line.includes("[ OK ]")) {
    return "text-emerald-200/92";
  }
  if (line.includes("[ INFO ]")) {
    return "text-slate-200/88";
  }
  return "text-amber-200/90";
}

export default function LinkedInWindow() {
  const [typedLogs, setTypedLogs] = useState<string[]>([]);
  const [activeLogIndex, setActiveLogIndex] = useState(-1);

  const logRunRef = useRef(0);

  useEffect(() => {
    const runId = ++logRunRef.current;
    const stale = () => runId !== logRunRef.current;

    const runLogs = async () => {
      setTypedLogs(LOG_LINES.map(() => ""));
      setActiveLogIndex(LOG_LINES.length ? 0 : -1);

      for (let lineIndex = 0; lineIndex < LOG_LINES.length; lineIndex += 1) {
        if (stale()) {
          return;
        }

        setActiveLogIndex(lineIndex);
        const fullLine = LOG_LINES[lineIndex];

        for (let charIndex = 0; charIndex < fullLine.length; charIndex += 1) {
          if (stale()) {
            return;
          }

          const segment = fullLine.slice(0, charIndex + 1);
          setTypedLogs((prev) => {
            const next = [...prev];
            next[lineIndex] = segment;
            return next;
          });

          await sleep(10 + Math.floor(Math.random() * 12));
        }

        await sleep(110 + Math.floor(Math.random() * 90));
      }
    };

    runLogs();

    return () => {
      logRunRef.current += 1;
    };
  }, []);

  const cardNodes = useMemo(
    () =>
      ACTIVITY_CARDS.map((card, index) => (
        <motion.article
          key={card.title}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 + index * 0.05, duration: 0.25 }}
          whileHover={{ y: -3 }}
          className="group relative overflow-hidden rounded-lg border border-white/12 bg-white/[0.04] p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]"
        >
          <div className="pointer-events-none absolute -right-10 -top-10 h-20 w-20 rounded-full bg-cyan-300/15 opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100" />
          <div className="relative space-y-1.5">
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-cyan-100/85">{card.category}</p>
            <h4 className="text-sm font-semibold text-white">{card.title}</h4>
            <p className="text-xs leading-relaxed text-slate-300/82">{card.summary}</p>
          </div>
        </motion.article>
      )),
    [],
  );

  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="relative isolate overflow-hidden rounded-2xl border border-white/12 bg-[linear-gradient(160deg,rgba(2,8,23,0.95)_0%,rgba(3,11,31,0.92)_60%,rgba(3,6,18,0.96)_100%)] p-4 sm:p-5"
    >
      <div className="pointer-events-none absolute inset-0 opacity-[0.05] [background-image:linear-gradient(rgba(148,163,184,0.3)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.26)_1px,transparent_1px)] [background-size:24px_24px]" />
      <motion.div
        className="pointer-events-none absolute -left-24 top-4 h-64 w-64 rounded-full bg-cyan-400/15 blur-3xl"
        animate={{ x: [0, 12, 0], y: [0, -10, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative z-10 space-y-4">
        <div className="inline-flex items-center rounded-full border border-blue-300/25 bg-blue-300/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-blue-100/85">
          PROFESSIONAL PROFILE SYSTEM
        </div>

        <div className="grid gap-4 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.3fr)]">
          <section className="rounded-xl border border-blue-300/18 bg-black/48 p-4 backdrop-blur-xl">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full border border-blue-200/35 bg-gradient-to-br from-blue-400/20 to-cyan-400/15 text-lg font-semibold text-blue-100">
                    {portfolio.personal.shortName.slice(0, 2).toUpperCase()}
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border border-white/30 bg-emerald-300 shadow-[0_0_10px_rgba(110,231,183,0.9)]" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">{portfolio.personal.name}</h3>
                  <p className="text-sm text-blue-100/88">{portfolio.personal.role}</p>
                </div>
              </div>

              <div className="space-y-2 rounded-lg border border-white/10 bg-white/[0.03] p-3 text-sm text-slate-200/88">
                <p className="inline-flex items-center gap-2">
                  <MapPin size={14} className="text-blue-200/85" /> {portfolio.personal.location}
                </p>
                <p className="inline-flex items-center gap-2">
                  <Users size={14} className="text-blue-200/85" /> {portfolio.personal.connections} Connections
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <motion.a
                  href={portfolio.personal.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="inline-flex items-center gap-2 rounded-md border border-blue-300/35 bg-blue-300/10 px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-blue-100"
                >
                  Open LinkedIn <ExternalLink size={12} />
                </motion.a>

                <motion.button
                  type="button"
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="inline-flex items-center gap-2 rounded-md border border-cyan-300/35 bg-cyan-300/10 px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-cyan-100"
                >
                  Message <MessageSquare size={12} />
                </motion.button>
              </div>
            </div>
          </section>

          <section className="rounded-xl border border-white/12 bg-white/[0.04] p-4 backdrop-blur-xl">
            <div className="mb-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-blue-200/82">
              Activity and Highlights
            </div>
            <div className="space-y-2.5">{cardNodes}</div>
          </section>
        </div>

        <section className="overflow-hidden rounded-xl border border-emerald-300/16 bg-black/50 backdrop-blur-xl">
          <div className="border-b border-emerald-300/14 bg-emerald-400/5 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-emerald-200/80">
            System Logs
          </div>

          <div className="space-y-1.5 px-4 py-3 font-mono text-xs sm:text-[13px]">
            {LOG_LINES.map((line, index) => {
              const rendered = typedLogs[index] ?? "";
              const isTyping = index === activeLogIndex && rendered.length < line.length;

              return (
                <p key={`${line}-${index}`} className={logSeverityClass(line)}>
                  {rendered}
                  {isTyping ? (
                    <motion.span
                      animate={{ opacity: [1, 0, 1] }}
                      transition={{ duration: 0.9, repeat: Infinity, ease: "linear" }}
                      className="ml-0.5"
                    >
                      _
                    </motion.span>
                  ) : null}
                </p>
              );
            })}
          </div>
        </section>
      </div>
    </motion.section>
  );
}
