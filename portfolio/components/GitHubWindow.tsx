"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Clock3, GitBranch, Star } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import { portfolio } from "@/data/portfolio";

type RepoRecord = {
  id: string;
  name: string;
  description: string;
  stack: string[];
  language: string;
  source: string;
  updated: string;
  readmePreview: string;
};

const REPOSITORIES: RepoRecord[] = portfolio.projects.map((project) => ({
  id: project.id,
  name: project.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
  description: project.description,
  stack: project.techStack,
  language: project.techStack.includes("Python") ? "Python" : "JavaScript/TypeScript",
  source: portfolio.personal.githubHandle,
  updated: project.date,
  readmePreview: project.highlights.join(" | "),
}));

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

export default function GitHubWindow() {
  const [selectedId, setSelectedId] = useState(REPOSITORIES[0].id);
  const [typedLogs, setTypedLogs] = useState<string[]>([]);
  const [activeLogIndex, setActiveLogIndex] = useState(-1);

  const logRunRef = useRef(0);

  const selected = useMemo(
    () => REPOSITORIES.find((repo) => repo.id === selectedId) ?? REPOSITORIES[0],
    [selectedId],
  );

  const logs = useMemo(
    () => [
      "[ INIT ] Connecting to GitHub...",
      "[ OK ] Repo fetched",
      `[ INFO ] Data synced (${selected.name})`,
      "[ DONE ] Ready",
    ],
    [selected.name],
  );

  useEffect(() => {
    const runId = ++logRunRef.current;
    const stale = () => runId !== logRunRef.current;

    const runLogs = async () => {
      setTypedLogs(logs.map(() => ""));
      setActiveLogIndex(logs.length ? 0 : -1);

      for (let lineIndex = 0; lineIndex < logs.length; lineIndex += 1) {
        if (stale()) {
          return;
        }

        setActiveLogIndex(lineIndex);
        const fullLine = logs[lineIndex];

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
  }, [logs]);

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
        <div className="inline-flex items-center rounded-full border border-slate-300/20 bg-slate-300/8 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-100/85">
          CODE REPOSITORY SYSTEM
        </div>

        <div className="grid gap-4 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.2fr)_minmax(0,0.9fr)]">
          <section className="rounded-xl border border-cyan-300/16 bg-black/48 p-3.5 backdrop-blur-xl">
            <div className="mb-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-cyan-200/80">Repo List</div>
            <div className="space-y-1.5 font-mono text-sm">
              {REPOSITORIES.map((repo, index) => {
                const active = repo.id === selectedId;
                return (
                  <motion.button
                    key={repo.id}
                    type="button"
                    onClick={() => setSelectedId(repo.id)}
                    whileHover={{ x: 4 }}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.08 + index * 0.05, duration: 0.2 }}
                    className={`group relative w-full rounded-md border px-3 py-2 text-left transition-all ${
                      active
                        ? "border-cyan-200/50 bg-cyan-300/12 text-cyan-100 shadow-[0_0_20px_rgba(34,211,238,0.12)]"
                        : "border-white/10 bg-white/[0.03] text-slate-200/82 hover:border-cyan-200/30 hover:text-cyan-100"
                    }`}
                  >
                    <span className="mr-1.5 text-cyan-200/90">&gt;</span>
                    {repo.name}
                  </motion.button>
                );
              })}
            </div>
          </section>

          <section className="rounded-xl border border-white/12 bg-white/[0.04] p-4 backdrop-blur-xl">
            <div className="mb-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-cyan-200/80">Repo Preview</div>
            <AnimatePresence mode="wait">
              <motion.div
                key={selected.id}
                initial={{ opacity: 0, y: 8, scale: 0.99 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.99 }}
                transition={{ duration: 0.24 }}
                className="space-y-3"
              >
                <h3 className="text-lg font-semibold text-white">{selected.name}</h3>
                <p className="text-sm leading-relaxed text-slate-200/85">{selected.description}</p>

                <div className="flex flex-wrap gap-1.5 text-[11px] text-slate-100/85">
                  {selected.stack.map((item) => (
                    <span key={item} className="rounded-md border border-white/15 bg-white/[0.06] px-2 py-1">
                      {item}
                    </span>
                  ))}
                </div>

                <div className="rounded-lg border border-white/12 bg-black/20 p-3 text-xs text-slate-300/86">
                  <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-cyan-200/78">README Preview</p>
                  {selected.readmePreview}
                </div>
              </motion.div>
            </AnimatePresence>
          </section>

          <section className="rounded-xl border border-white/12 bg-white/[0.04] p-4 backdrop-blur-xl">
            <div className="mb-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-cyan-200/80">Repo Details</div>
            <AnimatePresence mode="wait">
              <motion.div
                key={selected.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.24 }}
                className="space-y-2.5"
              >
                <div className="rounded-md border border-white/12 bg-black/20 px-2.5 py-2 text-sm text-slate-100/88">
                  <p className="text-[10px] uppercase tracking-[0.14em] text-slate-300/70">Language</p>
                  <p className="mt-1">{selected.language}</p>
                </div>

                <div className="rounded-md border border-white/12 bg-black/20 px-2.5 py-2 text-sm text-slate-100/88">
                  <p className="inline-flex items-center gap-2"><Star size={14} className="text-amber-200/90" /> Source: {selected.source}</p>
                </div>

                <div className="rounded-md border border-white/12 bg-black/20 px-2.5 py-2 text-sm text-slate-100/88">
                  <p className="inline-flex items-center gap-2"><GitBranch size={14} className="text-cyan-200/90" /> Repo Base: {portfolio.personal.githubHandle}</p>
                </div>

                <div className="rounded-md border border-white/12 bg-black/20 px-2.5 py-2 text-sm text-slate-100/88">
                  <p className="inline-flex items-center gap-2"><Clock3 size={14} className="text-emerald-200/90" /> Updated: {selected.updated}</p>
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
            {logs.map((line, index) => {
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
