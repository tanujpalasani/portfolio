"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Activity, ArrowUpRight, Box, Database, Rocket, Server } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import { portfolio } from "@/data/portfolio";

type ProjectStatus = "Prototype" | "Production";
type ProjectType = "Full Stack" | "Machine Learning" | "Platform";

type ProjectModule = {
  id: string;
  module: string;
  name: string;
  status: ProjectStatus;
  type: ProjectType;
  stack: string[];
  features: string[];
  impact: string;
  accent: string;
  previewIcon: LucideIcon;
  logs: string[];
  launchUrl: string;
};

const PROJECTS: ProjectModule[] = portfolio.projects.map((project, index) => {
  const projectType: ProjectType = project.techStack.some((item) =>
    ["Scikit-learn", "Pandas", "NumPy", "Plotly", "Machine Learning"].includes(item),
  )
    ? "Machine Learning"
    : index === 0
      ? "Full Stack"
      : "Platform";

  const previewIcon: LucideIcon =
    projectType === "Machine Learning" ? Activity : index === 0 ? Box : Server;

  const accent =
    projectType === "Machine Learning"
      ? "from-fuchsia-300/40 via-violet-400/30 to-blue-400/30"
      : index === 0
        ? "from-cyan-300/40 via-blue-400/30 to-indigo-400/30"
        : "from-emerald-300/40 via-cyan-400/30 to-blue-400/30";

  return {
    id: project.id,
    module: `portfolio.${project.id}`,
    name: project.name,
    status: projectType === "Machine Learning" ? "Prototype" : "Production",
    type: projectType,
    stack: project.techStack,
    features: project.highlights,
    impact: project.description,
    accent,
    previewIcon,
    logs: [
      `[ INIT ] Loading ${project.name}...`,
      "[ INFO ] Compiling frontend...",
      "[ OK ] Frontend ready",
      "[ INFO ] Connecting backend...",
      "[ OK ] API connected",
      "[ INFO ] Syncing data layer...",
      "[ OK ] Data layer synced",
      "[ DONE ] Deployment successful",
    ],
    launchUrl: project.repoUrl,
  };
});

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

const PREVIEW_SEQUENCE_LINES = [
  "[ INITIALIZING PREVIEW... ]",
  "[ LOADING COMPONENTS... ]",
  "[ RENDER COMPLETE ]",
] as const;

export default function ProjectsWindow() {
  const [selectedId, setSelectedId] = useState(PROJECTS[0].id);
  const [typedLogs, setTypedLogs] = useState<string[]>([]);
  const [previewLoaded, setPreviewLoaded] = useState(false);
  const [previewStep, setPreviewStep] = useState(-1);
  const [logsReplayKey, setLogsReplayKey] = useState(0);
  const [isLaunching, setIsLaunching] = useState(false);

  const logsRunId = useRef(0);
  const previewRunId = useRef(0);

  const selected = useMemo(
    () => PROJECTS.find((project) => project.id === selectedId) ?? PROJECTS[0],
    [selectedId],
  );

  useEffect(() => {
    const runId = ++previewRunId.current;
    const stale = () => runId !== previewRunId.current;

    const runPreviewSequence = async () => {
      setPreviewLoaded(false);
      setPreviewStep(-1);

      for (let i = 0; i < PREVIEW_SEQUENCE_LINES.length; i += 1) {
        if (stale()) {
          return;
        }

        setPreviewStep(i);
        await sleep(260 + Math.floor(Math.random() * 80));
      }

      await sleep(140);
      if (stale()) {
        return;
      }

      setPreviewLoaded(true);
    };

    runPreviewSequence();

    return () => {
      previewRunId.current += 1;
    };
  }, [selectedId]);

  useEffect(() => {
    const runId = ++logsRunId.current;
    const stale = () => runId !== logsRunId.current;

    const runLogs = async () => {
      setTypedLogs([]);

      for (let i = 0; i < selected.logs.length; i += 1) {
        if (stale()) {
          return;
        }

        const fullLine = selected.logs[i];
        setTypedLogs((prev) => {
          const next = [...prev];
          next[i] = "";
          return next;
        });

        for (let c = 0; c < fullLine.length; c += 1) {
          if (stale()) {
            return;
          }

          const segment = fullLine.slice(0, c + 1);
          setTypedLogs((prev) => {
            const next = [...prev];
            next[i] = segment;
            return next;
          });

          await sleep(10 + Math.floor(Math.random() * 14));
        }

        await sleep(120 + Math.floor(Math.random() * 120));
      }
    };

    runLogs();

    return () => {
      logsRunId.current += 1;
    };
  }, [selected, logsReplayKey]);

  const handleSelectProject = (projectId: string) => {
    if (projectId === selectedId) {
      return;
    }

    setSelectedId(projectId);
  };

  const handleLaunch = async () => {
    if (isLaunching) {
      return;
    }

    setIsLaunching(true);
    setLogsReplayKey((prev) => prev + 1);

    await sleep(640);
    window.open(selected.launchUrl, "_blank", "noopener,noreferrer");

    setIsLaunching(false);
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
          PROJECT DEPLOYMENT SYSTEM
        </div>

        <div className="grid gap-4 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.2fr)_minmax(0,1fr)]">
          <section className="overflow-hidden rounded-xl border border-cyan-300/16 bg-black/48 backdrop-blur-xl">
            <div className="border-b border-cyan-300/14 bg-cyan-300/5 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-cyan-200/80">
              Project Modules
            </div>
            <div className="space-y-1.5 p-3 font-mono text-sm">
              {PROJECTS.map((project, index) => {
                const active = selectedId === project.id;
                return (
                  <motion.button
                    key={project.id}
                    type="button"
                    onClick={() => handleSelectProject(project.id)}
                    whileHover={{ x: 6, scale: 1.01 }}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.08 + index * 0.05, duration: 0.2 }}
                    className={`group relative w-full rounded-md border px-3 py-2 text-left transition-all ${
                      active
                        ? "border-cyan-200/50 bg-cyan-300/15 text-cyan-100 shadow-[0_0_20px_rgba(34,211,238,0.14)]"
                        : "border-white/10 bg-white/[0.03] text-slate-200/82 hover:border-cyan-200/40 hover:bg-cyan-300/[0.08] hover:text-cyan-100"
                    }`}
                  >
                    <motion.span
                      animate={{
                        opacity: active ? [0.6, 1, 0.6] : 0.55,
                        boxShadow: active
                          ? [
                              "0 0 10px rgba(34,211,238,0.55)",
                              "0 0 18px rgba(34,211,238,0.92)",
                              "0 0 10px rgba(34,211,238,0.55)",
                            ]
                          : "0 0 6px rgba(34,211,238,0.4)",
                      }}
                      transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                      className="absolute left-2 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-cyan-300"
                    />
                    <span className="ml-3.5 block tracking-[0.03em]">
                      <span className="mr-1.5 text-cyan-200/90">&gt;</span>
                      {project.module}
                    </span>
                  </motion.button>
                );
              })}
            </div>
          </section>

          <section className="overflow-hidden rounded-xl border border-white/12 bg-white/[0.04] backdrop-blur-xl">
            <div className="border-b border-white/10 bg-white/[0.03] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-200/85">
              Project Preview
            </div>
            <div className="relative h-[320px] p-4 [perspective:1100px]">
              <div className="pointer-events-none absolute inset-4 rounded-lg border border-cyan-300/22 shadow-[0_0_24px_rgba(34,211,238,0.12)]" />

              <AnimatePresence mode="wait">
                {!previewLoaded ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="relative flex h-full items-center justify-center overflow-hidden rounded-lg border border-white/12 bg-[linear-gradient(160deg,rgba(2,6,23,0.88)_0%,rgba(3,10,26,0.82)_52%,rgba(3,6,18,0.9)_100%)]"
                  >
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-cyan-300/10 via-transparent to-violet-300/10" />
                    <div className="relative z-10 space-y-2 font-mono text-xs text-cyan-100/90">
                      {PREVIEW_SEQUENCE_LINES.map((line, index) => (
                        <p
                          key={line}
                          className={`transition-opacity duration-200 ${
                            index <= previewStep ? "opacity-100" : "opacity-25"
                          } ${index === previewStep ? "text-cyan-100 drop-shadow-[0_0_10px_rgba(34,211,238,0.35)]" : ""}`}
                        >
                          {line}
                          {index === previewStep ? (
                            <motion.span
                              animate={{ opacity: [1, 0, 1] }}
                              transition={{ duration: 0.9, repeat: Infinity, ease: "linear" }}
                              className="ml-0.5"
                            >
                              _
                            </motion.span>
                          ) : null}
                        </p>
                      ))}
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key={selected.id}
                    initial={{ opacity: 0, scale: 0.98, y: 8 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.98, y: -4 }}
                    transition={{ duration: 0.28 }}
                    whileHover={{ scale: 1.015, y: -2 }}
                    className="relative h-full overflow-hidden rounded-lg border border-white/12 bg-[linear-gradient(160deg,rgba(2,6,23,0.9)_0%,rgba(3,10,26,0.8)_52%,rgba(3,6,18,0.9)_100%)]"
                  >
                    <motion.div
                      className={`pointer-events-none absolute -inset-10 bg-gradient-to-br ${selected.accent} blur-3xl`}
                      animate={{ scale: [1, 1.06, 1], opacity: [0.35, 0.55, 0.35] }}
                      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                    />

                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/[0.08] via-transparent to-black/35" />
                    <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_65px_rgba(2,6,23,0.8)]" />

                    <div className="relative z-10 flex h-full flex-col justify-between p-4">
                      <div className="flex items-center gap-2 text-cyan-100">
                        <selected.previewIcon size={16} />
                        <p className="text-xs font-semibold uppercase tracking-[0.14em]">Preview Runtime</p>
                      </div>

                      <div className="space-y-2">
                        <p className="text-lg font-semibold text-white">{selected.name}</p>
                        <p className="text-sm text-slate-200/85">{selected.type} system module</p>
                        <div className="flex flex-wrap gap-1.5 text-[11px] text-slate-100/85">
                          {selected.stack.slice(0, 4).map((item) => (
                            <span key={item} className="rounded-md border border-white/15 bg-white/[0.06] px-2 py-1">
                              {item}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </section>

          <section className="overflow-hidden rounded-xl border border-white/12 bg-white/[0.04] p-4 backdrop-blur-xl">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/25 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.13em] text-slate-200/85">
              <Database size={12} /> Project Details
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={selected.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.24 }}
                className="space-y-3"
              >
                <div>
                  <h3 className="text-lg font-semibold text-white">{selected.name}</h3>
                  <p className="text-xs text-slate-300/75">{selected.module}</p>
                </div>

                <div className="grid gap-2 sm:grid-cols-2">
                  <div className="rounded-md border border-white/12 bg-black/20 px-2.5 py-2">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-300/70">Status</p>
                    <p className="mt-1 text-sm text-cyan-100">{selected.status}</p>
                  </div>
                  <div className="rounded-md border border-white/12 bg-black/20 px-2.5 py-2">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-300/70">Type</p>
                    <p className="mt-1 text-sm text-cyan-100">{selected.type}</p>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-300/70">Tech Stack</p>
                  <p className="text-sm text-slate-200/85">{selected.stack.join(" - ")}</p>
                </div>

                <div className="space-y-1.5">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-300/70">Key Features</p>
                  {selected.features.map((feature) => (
                    <p key={feature} className="text-sm text-slate-200/88">- {feature}</p>
                  ))}
                </div>

                <div className="space-y-1.5">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-300/70">Impact</p>
                  <p className="text-sm text-slate-200/88">{selected.impact}</p>
                </div>

                <motion.button
                  type="button"
                  onClick={handleLaunch}
                  disabled={isLaunching}
                  whileHover={{ y: isLaunching ? 0 : -2 }}
                  whileTap={{ scale: isLaunching ? 1 : 0.98 }}
                  className="inline-flex items-center gap-2 rounded-md border border-cyan-200/35 bg-cyan-300/10 px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-cyan-100 disabled:cursor-wait disabled:opacity-80"
                >
                  <Rocket size={12} />
                  {isLaunching ? "Launching..." : "Launch Project"}
                  <ArrowUpRight size={12} />
                </motion.button>
              </motion.div>
            </AnimatePresence>
          </section>
        </div>

        <section className="overflow-hidden rounded-xl border border-emerald-300/16 bg-black/50 backdrop-blur-xl">
          <div className="border-b border-emerald-300/14 bg-emerald-400/5 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-emerald-200/80">
            Deployment Logs
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
                {selected.logs.map((line, index) => {
                  const rendered = typedLogs[index] ?? "";
                  return (
                    <p key={`${line}-${index}`} className={logSeverityClass(line)}>
                      {rendered}
                      {index === typedLogs.length - 1 && rendered.length < line.length ? (
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
