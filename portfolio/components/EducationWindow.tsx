"use client";

import { AnimatePresence, motion } from "framer-motion";
import { BookOpen, CheckCircle2, GraduationCap, School, Sparkles } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import { portfolio } from "@/data/portfolio";

type EducationStatus = "In Progress" | "Completed";

type EducationNode = {
  id: string;
  year: string;
  institution: string;
  degree: string;
  duration: string;
  status: EducationStatus;
  focusAreas: string[];
  highlights: string[];
  icon: LucideIcon;
  logs: string[];
};

const EDUCATION_NODES: EducationNode[] = [
  ...portfolio.education.map((item, index) => {
    const icon: LucideIcon =
      item.status === "In Progress" ? GraduationCap : index === 1 ? BookOpen : School;

    return {
      id: item.id,
      year: item.year,
      institution: item.institution,
      degree: item.degree,
      duration: `${item.duration} | ${item.scoreLabel}`,
      status: item.status,
      focusAreas: item.focusAreas,
      highlights: item.highlights,
      icon,
      logs: [
        "[ INIT ] Loading academic module...",
        "[ OK ] Institution verified",
        `[ INFO ] ${item.scoreLabel}`,
        "[ DONE ] Synced to system",
      ],
    };
  }),
];

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

export default function EducationWindow() {
  const [selectedId, setSelectedId] = useState(EDUCATION_NODES[0].id);
  const [typedLogs, setTypedLogs] = useState<string[]>([]);
  const [activeLogIndex, setActiveLogIndex] = useState(-1);
  const [pulseNodeId, setPulseNodeId] = useState<string | null>(EDUCATION_NODES[0].id);
  const [pulseSeed, setPulseSeed] = useState(0);

  const logsRunRef = useRef(0);

  const selected = useMemo(
    () => EDUCATION_NODES.find((node) => node.id === selectedId) ?? EDUCATION_NODES[0],
    [selectedId],
  );

  useEffect(() => {
    const runId = ++logsRunRef.current;
    const stale = () => runId !== logsRunRef.current;

    const runLogs = async () => {
      setTypedLogs(selected.logs.map(() => ""));
      setActiveLogIndex(selected.logs.length ? 0 : -1);

      for (let lineIndex = 0; lineIndex < selected.logs.length; lineIndex += 1) {
        if (stale()) {
          return;
        }

        setActiveLogIndex(lineIndex);
        const fullLine = selected.logs[lineIndex];

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

          await sleep(9 + Math.floor(Math.random() * 11));
        }

        await sleep(115 + Math.floor(Math.random() * 90));
      }
    };

    runLogs();

    return () => {
      logsRunRef.current += 1;
    };
  }, [selected]);

  const handleSelectNode = (nodeId: string) => {
    if (nodeId === selectedId) {
      return;
    }

    setSelectedId(nodeId);
    setPulseNodeId(nodeId);
    setPulseSeed((prev) => prev + 1);
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 12, scale: 0.99 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
      className="relative isolate overflow-hidden rounded-2xl border border-white/12 bg-[linear-gradient(160deg,rgba(2,8,23,0.95)_0%,rgba(3,11,31,0.92)_60%,rgba(3,6,18,0.96)_100%)] p-4 sm:p-5"
    >
      <div className="pointer-events-none absolute inset-0 opacity-[0.05] [background-image:linear-gradient(rgba(148,163,184,0.3)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.26)_1px,transparent_1px)] [background-size:24px_24px]" />
      <motion.div
        className="pointer-events-none absolute -left-24 top-4 h-64 w-64 rounded-full bg-cyan-400/15 blur-3xl"
        animate={{ x: [0, 14, 0], y: [0, -10, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="pointer-events-none absolute -right-24 bottom-4 h-72 w-72 rounded-full bg-violet-500/14 blur-3xl"
        animate={{ x: [0, -14, 0], y: [0, 10, 0] }}
        transition={{ duration: 13, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative z-10 space-y-4">
        <div className="inline-flex items-center rounded-full border border-cyan-300/25 bg-cyan-300/8 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-cyan-100/85">
          LEARNING EVOLUTION SYSTEM
        </div>

        <div className="grid gap-4 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.25fr)]">
          <section className="rounded-xl border border-cyan-300/16 bg-black/50 p-4 backdrop-blur-xl">
            <div className="mb-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-cyan-200/80">
              Academic Timeline
            </div>

            <div className="relative pl-4">
              <div className="pointer-events-none absolute left-[7px] top-1 h-[calc(100%-8px)] w-px bg-gradient-to-b from-cyan-300/60 via-cyan-300/22 to-cyan-300/0" />

              <div className="space-y-3">
                {EDUCATION_NODES.map((node, index) => {
                  const active = node.id === selectedId;

                  return (
                    <motion.button
                      key={node.id}
                      type="button"
                      onClick={() => handleSelectNode(node.id)}
                      whileHover={{ x: 5 }}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.08 + index * 0.05, duration: 0.2 }}
                      className={`group relative w-full rounded-lg border px-3 py-3 text-left transition-all ${
                        active
                          ? "border-cyan-200/50 bg-cyan-300/12 shadow-[0_0_20px_rgba(34,211,238,0.12)]"
                          : "border-white/10 bg-white/[0.03] hover:border-cyan-200/35 hover:bg-cyan-300/[0.07]"
                      }`}
                    >
                      <motion.span
                        animate={{
                          opacity: active ? [0.6, 1, 0.6] : 0.55,
                          boxShadow: active
                            ? [
                                "0 0 10px rgba(34,211,238,0.55)",
                                "0 0 18px rgba(34,211,238,0.9)",
                                "0 0 10px rgba(34,211,238,0.55)",
                              ]
                            : "0 0 6px rgba(34,211,238,0.35)",
                        }}
                        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute -left-4 top-1/2 h-3 w-3 -translate-y-1/2 rounded-full border border-cyan-200/55 bg-cyan-300/85"
                      />

                      {pulseNodeId === node.id ? (
                        <motion.span
                          key={`${node.id}-${pulseSeed}`}
                          initial={{ scale: 0.25, opacity: 0.55 }}
                          animate={{ scale: 2.1, opacity: 0 }}
                          transition={{ duration: 0.45, ease: "easeOut" }}
                          className="pointer-events-none absolute -left-4 top-1/2 h-3 w-3 -translate-y-1/2 rounded-full border border-cyan-200/70"
                        />
                      ) : null}

                      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-cyan-100/88">{node.year}</p>
                      <p className="mt-1 text-sm font-semibold text-white">{node.degree.split(" - ")[0]}</p>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </section>

          <section className="rounded-xl border border-white/12 bg-white/[0.04] p-4 backdrop-blur-xl">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/25 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.13em] text-slate-200/85">
              <Sparkles size={12} /> Education Node Details
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={selected.id}
                initial={{ opacity: 0, y: 8, scale: 0.99 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.99 }}
                transition={{ duration: 0.26 }}
                className="space-y-3 rounded-xl border border-cyan-300/18 bg-black/28 p-3.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.04),0_0_18px_rgba(34,211,238,0.08)]"
              >
                <div className="flex items-center gap-2">
                  <div className="rounded-lg border border-cyan-200/25 bg-cyan-300/12 p-2 text-cyan-100">
                    <selected.icon size={16} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">{selected.institution}</h3>
                    <p className="text-xs text-slate-300/75">{selected.duration}</p>
                  </div>
                </div>

                <div className="grid gap-2 sm:grid-cols-2">
                  <div className="rounded-md border border-white/12 bg-black/20 px-2.5 py-2">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-300/70">Degree</p>
                    <p className="mt-1 text-sm text-cyan-100">{selected.degree}</p>
                  </div>
                  <div className="rounded-md border border-white/12 bg-black/20 px-2.5 py-2">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-300/70">Status</p>
                    <p className="mt-1 inline-flex items-center gap-1.5 text-sm text-emerald-200">
                      <CheckCircle2 size={14} /> {selected.status}
                    </p>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-300/70">Focus Areas</p>
                  <div className="flex flex-wrap gap-1.5 text-[11px] text-slate-100/85">
                    {selected.focusAreas.map((area) => (
                      <span key={area} className="rounded-md border border-white/15 bg-white/[0.06] px-2 py-1">
                        {area}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-300/70">Highlights</p>
                  {selected.highlights.map((item) => (
                    <p key={item} className="text-sm text-slate-200/88">- {item}</p>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </section>
        </div>

        <section className="overflow-hidden rounded-xl border border-emerald-300/16 bg-black/50 backdrop-blur-xl">
          <div className="border-b border-emerald-300/14 bg-emerald-400/5 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-emerald-200/80">
            Academic System Logs
          </div>

          <div className="space-y-1.5 px-4 py-3 font-mono text-xs sm:text-[13px]">
            {selected.logs.map((line, index) => {
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
