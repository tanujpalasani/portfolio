"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  Brain,
  Boxes,
  Code2,
  Cpu,
  Database,
  GitBranch,
  Layers,
  Server,
  Wrench,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import { portfolio } from "@/data/portfolio";

type SkillStatus = "Beginner" | "Intermediate" | "Production Ready";

type SkillModule = {
  id: string;
  name: string;
  status: SkillStatus;
  years: string;
  confidence: number;
  capabilities: string[];
  icon: LucideIcon;
  node: { x: number; y: number };
  links: string[];
};

const MODULES: SkillModule[] = [
  {
    id: "languages",
    name: "Languages",
    status: "Production Ready",
    years: "Resume validated",
    confidence: 92,
    capabilities: portfolio.skills.languages,
    icon: Code2,
    node: { x: 22, y: 28 },
    links: ["web", "ml"],
  },
  {
    id: "web",
    name: "Web Stack",
    status: "Production Ready",
    years: "Resume validated",
    confidence: 90,
    capabilities: portfolio.skills.web,
    icon: Layers,
    node: { x: 44, y: 24 },
    links: ["languages", "database", "tools"],
  },
  {
    id: "database",
    name: "Database",
    status: "Intermediate",
    years: "Resume validated",
    confidence: 82,
    capabilities: portfolio.skills.database,
    icon: Database,
    node: { x: 66, y: 44 },
    links: ["web", "ml"],
  },
  {
    id: "ml",
    name: "Machine Learning",
    status: "Intermediate",
    years: "Resume validated",
    confidence: 80,
    capabilities: portfolio.skills.machineLearning,
    icon: Brain,
    node: { x: 30, y: 62 },
    links: ["languages", "database", "tools"],
  },
  {
    id: "tools",
    name: "Tools",
    status: "Production Ready",
    years: "Resume validated",
    confidence: 88,
    capabilities: portfolio.skills.tools,
    icon: Wrench,
    node: { x: 56, y: 78 },
    links: ["web", "ml", "soft"],
  },
  {
    id: "soft",
    name: "Soft Skills",
    status: "Production Ready",
    years: "Resume validated",
    confidence: 86,
    capabilities: portfolio.skills.softSkills,
    icon: Boxes,
    node: { x: 76, y: 66 },
    links: ["tools", "languages"],
  },
  {
    id: "core",
    name: "Core Stack",
    status: "Production Ready",
    years: "Resume validated",
    confidence: 91,
    capabilities: portfolio.skills.coreStack,
    icon: Server,
    node: { x: 52, y: 46 },
    links: ["languages", "web", "database", "ml"],
  },
  {
    id: "runtime",
    name: "Execution Layer",
    status: "Production Ready",
    years: "Resume validated",
    confidence: 87,
    capabilities: ["System integration", "Product delivery", "Iteration speed"],
    icon: Cpu,
    node: { x: 28, y: 84 },
    links: ["core", "tools"],
  },
];

function sleep(ms: number) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

function severityClass(line: string) {
  if (line.includes("[ WARN ]")) {
    return "text-amber-200/90";
  }
  if (line.includes("[ OK ]")) {
    return "text-emerald-200/90";
  }
  return "text-cyan-200/90";
}

export default function SkillsWindow() {
  const [selectedId, setSelectedId] = useState<string>(MODULES[0].id);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [rippleNodeId, setRippleNodeId] = useState<string | null>(null);
  const [rippleSeed, setRippleSeed] = useState(0);
  const [scanSeed, setScanSeed] = useState(0);
  const [typedLogs, setTypedLogs] = useState<string[]>([]);
  const logsRunRef = useRef(0);

  const selected = useMemo(
    () => MODULES.find((module) => module.id === selectedId) ?? MODULES[0],
    [selectedId],
  );

  const moduleById = useMemo(() => new Map(MODULES.map((module) => [module.id, module])), []);

  const edges = useMemo(() => {
    const unique = new Set<string>();
    return MODULES.flatMap((module) =>
      module.links
        .map((targetId) => {
          const key = [module.id, targetId].sort().join("::");
          if (unique.has(key)) {
            return null;
          }
          unique.add(key);

          const target = moduleById.get(targetId);
          if (!target) {
            return null;
          }

          return { from: module, to: target, key };
        })
        .filter((item): item is NonNullable<typeof item> => Boolean(item)),
    );
  }, [moduleById]);

  const activeLogs = useMemo(
    () => [
      `[ INFO ] Switching module: ${selected.name}`,
      `[ INFO ] Loading capabilities...`,
      `[ OK ] Status: ${selected.status}`,
      `[ OK ] Confidence synced`,
    ],
    [selected],
  );

  useEffect(() => {
    const runId = ++logsRunRef.current;
    const isStale = () => runId !== logsRunRef.current;

    const animateLogs = async () => {
      setTypedLogs([]);

      for (let i = 0; i < activeLogs.length; i += 1) {
        if (isStale()) {
          return;
        }

        const line = activeLogs[i];
        setTypedLogs((prev) => {
          const next = [...prev];
          next[i] = "";
          return next;
        });

        for (let c = 0; c < line.length; c += 1) {
          if (isStale()) {
            return;
          }

          const segment = line.slice(0, c + 1);
          setTypedLogs((prev) => {
            const next = [...prev];
            next[i] = segment;
            return next;
          });
          await sleep(10 + Math.floor(Math.random() * 16));
        }

        await sleep(120 + Math.floor(Math.random() * 110));
      }
    };

    animateLogs();

    return () => {
      logsRunRef.current += 1;
    };
  }, [activeLogs]);

  const isRelated = (sourceId: string, targetId: string) => {
    const source = moduleById.get(sourceId);
    if (!source) {
      return false;
    }
    return source.links.includes(targetId);
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
        className="pointer-events-none absolute -left-24 top-2 h-64 w-64 rounded-full bg-cyan-400/16 blur-3xl"
        animate={{ x: [0, 18, 0], y: [0, -10, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="pointer-events-none absolute -right-24 bottom-2 h-72 w-72 rounded-full bg-violet-500/14 blur-3xl"
        animate={{ x: [0, -18, 0], y: [0, 10, 0] }}
        transition={{ duration: 13, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative z-10 space-y-4">
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)]">
          <section className="overflow-hidden rounded-2xl border border-cyan-300/16 bg-black/45 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-xl">
            <div className="border-b border-cyan-300/15 bg-cyan-300/5 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-cyan-100/75">
              System Scanner
            </div>

            <div className="relative h-[320px] p-4">
              <motion.div
                key={scanSeed}
                className="pointer-events-none absolute inset-x-4 top-0 h-12 bg-gradient-to-b from-cyan-200/18 via-cyan-300/10 to-transparent"
                initial={{ y: 0, opacity: 0.08 }}
                animate={{ y: 268, opacity: [0.08, 0.4, 0.08] }}
                transition={{ duration: 0.65, ease: "easeOut" }}
              />

              <motion.div
                className="pointer-events-none absolute inset-x-4 top-0 h-12 bg-gradient-to-b from-cyan-300/12 to-transparent"
                animate={{ y: [0, 268, 0], opacity: [0.2, 0.42, 0.2] }}
                transition={{ duration: 7.5, repeat: Infinity, ease: "easeInOut" }}
              />

              <p className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-xs font-semibold uppercase tracking-[0.3em] text-white/10">
                SKILL MATRIX
              </p>

              <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                <defs>
                  <filter id="scannerEdgeGlow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="1.2" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                {edges.map(({ from, to, key }) => {
                  const active =
                    (hoveredId && (hoveredId === from.id || hoveredId === to.id)) ||
                    (selectedId && (selectedId === from.id || selectedId === to.id));

                  const selectedEdge = selectedId === from.id || selectedId === to.id;

                  return (
                    <g key={key}>
                      <motion.line
                        x1={from.node.x}
                        y1={from.node.y}
                        x2={to.node.x}
                        y2={to.node.y}
                        animate={{
                          opacity: active ? [0.6, 0.82, 0.6] : [0.24, 0.32, 0.24],
                        }}
                        transition={{ duration: active ? 1.8 : 2.4, ease: "easeInOut", repeat: Infinity }}
                        stroke={active ? "rgba(103,232,249,0.58)" : "rgba(148,163,184,0.24)"}
                        strokeWidth={active ? 1.16 : 0.82}
                        filter={active ? "url(#scannerEdgeGlow)" : undefined}
                      />

                      {selectedEdge && (
                        <>
                          <motion.line
                            x1={from.node.x}
                            y1={from.node.y}
                            x2={to.node.x}
                            y2={to.node.y}
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1, opacity: [0.35, 0.9, 0.35] }}
                            transition={{ duration: 1.25, ease: "easeInOut" }}
                            stroke="rgba(125,211,252,0.9)"
                            strokeWidth={1.24}
                            strokeLinecap="round"
                          />

                          <motion.circle
                            r={0.85}
                            fill="rgba(186,230,253,0.95)"
                            filter="url(#scannerEdgeGlow)"
                            animate={{
                              cx: [from.node.x, to.node.x],
                              cy: [from.node.y, to.node.y],
                              opacity: [0, 1, 1, 0],
                            }}
                            transition={{ duration: 1.45, repeat: Infinity, ease: "easeInOut" }}
                          />
                        </>
                      )}
                    </g>
                  );
                })}
              </svg>

              {MODULES.map((module, index) => {
                const selectedNode = selectedId === module.id;
                const hoveredNode = hoveredId === module.id;
                const related =
                  (hoveredId && isRelated(hoveredId, module.id)) ||
                  (selectedId && isRelated(selectedId, module.id));

                return (
                  <div
                    key={module.id}
                    className="absolute"
                    style={{ left: `${module.node.x}%`, top: `${module.node.y}%` }}
                  >
                    <div className="-translate-x-1/2 -translate-y-1/2">
                      <motion.button
                        type="button"
                        onMouseEnter={() => setHoveredId(module.id)}
                        onMouseLeave={() => setHoveredId(null)}
                        onClick={() => {
                          setSelectedId(module.id);
                          setRippleNodeId(module.id);
                          setRippleSeed((prev) => prev + 1);
                          setScanSeed((prev) => prev + 1);
                        }}
                        initial={{ opacity: 0, scale: 0.7 }}
                        animate={{
                          opacity: 1,
                          scale: selectedNode ? 1.26 : hoveredNode ? 1.1 : 1,
                        }}
                        transition={{
                          opacity: { delay: 0.12 + index * 0.035, duration: 0.26 },
                          scale: { type: "spring", stiffness: 360, damping: 22 },
                        }}
                        className="group relative transform-gpu"
                      >
                        <motion.span
                          animate={{
                            boxShadow: selectedNode || hoveredNode || related
                              ? "0 0 30px rgba(34,211,238,0.86)"
                              : "0 0 0px rgba(34,211,238,0)",
                          }}
                          transition={{ duration: 0.22 }}
                          className={`relative flex h-11 w-11 items-center justify-center rounded-full border backdrop-blur-sm ${
                            selectedNode
                              ? "border-cyan-100/95 bg-cyan-300/38"
                              : hoveredNode || related
                                ? "border-cyan-200/52 bg-cyan-300/18"
                                : "border-white/18 bg-white/[0.06]"
                          }`}
                        >
                          <motion.span
                            animate={{ scale: [1, 1.14, 1], opacity: selectedNode ? [0.65, 1, 0.65] : [0.38, 0.75, 0.38] }}
                            transition={{ duration: selectedNode ? 1.8 : 2.4, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute inset-0 rounded-full bg-cyan-300/10"
                          />

                          {rippleNodeId === module.id && (
                            <motion.span
                              key={`${module.id}-${rippleSeed}`}
                              initial={{ scale: 0.2, opacity: 0.5 }}
                              animate={{ scale: 2.1, opacity: 0 }}
                              transition={{ duration: 0.42, ease: "easeOut" }}
                              className="pointer-events-none absolute inset-0 rounded-full border border-cyan-200/70"
                            />
                          )}

                          <module.icon size={15} className="relative z-10 text-cyan-100" />
                        </motion.span>
                        <span className="pointer-events-none absolute left-1/2 top-full mt-1.5 -translate-x-1/2 whitespace-nowrap text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-200/80">
                          {module.name}
                        </span>
                      </motion.button>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="rounded-2xl border border-white/12 bg-white/[0.04] p-4 backdrop-blur-xl">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/25 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.13em] text-slate-200/85">
              <GitBranch size={12} /> Skill Details
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={selected.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.28, ease: "easeOut" }}
                className="space-y-4"
              >
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-cyan-100/80">
                  {`[ ANALYZING MODULE: ${selected.name.toUpperCase()} ]`}
                </p>

                <div className="flex items-center gap-2">
                  <div className="rounded-lg border border-cyan-200/25 bg-cyan-300/12 p-2 text-cyan-100">
                    <selected.icon size={16} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">{selected.name}</h3>
                    <p className="text-xs text-slate-300/75">Experience: {selected.years}</p>
                  </div>
                </div>

                <div className="grid gap-2 sm:grid-cols-2">
                  <div className="rounded-lg border border-white/12 bg-black/20 p-2.5">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-300/70">Status</p>
                    <p className="mt-1 text-sm font-medium text-cyan-100">{selected.status}</p>
                  </div>
                  <div className="rounded-lg border border-white/12 bg-black/20 p-2.5">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-300/70">Confidence</p>
                    <p className="mt-1 text-sm font-medium text-cyan-100">{selected.confidence}%</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="relative h-2 overflow-hidden rounded-full bg-white/10">
                    <motion.div
                      key={selected.id}
                      initial={{ width: 0 }}
                      animate={{ width: `${selected.confidence}%` }}
                      transition={{ duration: 0.62, ease: [0.16, 1, 0.3, 1] }}
                      className="h-full rounded-full bg-gradient-to-r from-cyan-300 via-blue-300 to-violet-300"
                      style={{ boxShadow: `0 0 ${Math.max(10, Math.floor(selected.confidence / 6))}px rgba(56,189,248,0.68)` }}
                    />
                    <motion.span
                      className="pointer-events-none absolute inset-y-0 w-8 bg-gradient-to-r from-transparent via-white/45 to-transparent"
                      animate={{ x: ["-60%", "260%"] }}
                      transition={{ duration: 1.8, repeat: Infinity, ease: "linear" }}
                    />
                  </div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-300/70">Skill Confidence Meter</p>
                </div>

                <div className="space-y-1.5">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-300/70">Key Capabilities</p>
                  {selected.capabilities.map((item) => (
                    <p key={item} className="text-sm text-slate-200/88">- {item}</p>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </section>
        </div>

        <section className="overflow-hidden rounded-xl border border-emerald-300/16 bg-black/50 backdrop-blur-xl">
          <div className="border-b border-emerald-300/14 bg-emerald-400/5 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-emerald-200/80">
            System Logs
          </div>

          <div className="space-y-1.5 px-4 py-3 font-mono text-xs sm:text-[13px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={selected.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.24 }}
                className="space-y-1.5"
              >
                {activeLogs.map((line, index) => {
                  const rendered = typedLogs[index] ?? "";
                  const isLastVisibleLine = index === Math.max(typedLogs.length - 1, activeLogs.length - 1);
                  return (
                    <p key={`${line}-${index}`} className={severityClass(line)}>
                      {rendered}
                      {isLastVisibleLine ? (
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
              </motion.div>
            </AnimatePresence>
          </div>
        </section>
      </div>
    </motion.section>
  );
}
