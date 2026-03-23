"use client";

import { AnimatePresence, motion } from "framer-motion";
import { BadgeCheck, ExternalLink, FileBadge2, Hash, ShieldCheck } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import { portfolio } from "@/data/portfolio";

type CertificateStatus = "verified" | "pending";

type CertificateRecord = {
  id: string;
  moduleName: string;
  displayName: string;
  issuer: string;
  issueDate: string;
  status: CertificateStatus;
  certificateHash: string;
  skills: string[];
  verifyUrl: string;
  logs: string[];
};

const CERTIFICATES: CertificateRecord[] = portfolio.certificates.map((item) => ({
  id: item.id,
  moduleName: item.moduleName,
  displayName: item.displayName,
  issuer: item.issuer,
  issueDate: item.issueDate,
  status: item.status,
  certificateHash: item.certificateHash,
  skills: item.skills,
  verifyUrl: item.verifyUrl,
  logs: [
    "[ INIT ] Loading certificate registry...",
    item.status === "verified" ? "[ OK ] Certificate verified" : "[ INFO ] Verification pending",
    `[ INFO ] Issuer: ${item.issuer}`,
    "[ DONE ] Credential synced",
  ],
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

export default function CertificatesWindow() {
  const [selectedId, setSelectedId] = useState(CERTIFICATES[0].id);
  const [typedLogs, setTypedLogs] = useState<string[]>([]);
  const [activeLogIndex, setActiveLogIndex] = useState(-1);

  const logsRunRef = useRef(0);

  const selected = useMemo(
    () => CERTIFICATES.find((item) => item.id === selectedId) ?? CERTIFICATES[0],
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

          await sleep(10 + Math.floor(Math.random() * 12));
        }

        await sleep(115 + Math.floor(Math.random() * 85));
      }
    };

    runLogs();

    return () => {
      logsRunRef.current += 1;
    };
  }, [selected]);

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
        className="pointer-events-none absolute -right-24 bottom-4 h-72 w-72 rounded-full bg-emerald-500/14 blur-3xl"
        animate={{ x: [0, -14, 0], y: [0, 10, 0] }}
        transition={{ duration: 13, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative z-10 space-y-4">
        <div className="inline-flex items-center rounded-full border border-cyan-300/25 bg-cyan-300/8 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-cyan-100/85">
          CREDENTIAL VERIFICATION SYSTEM
        </div>

        <div className="grid gap-4 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.25fr)]">
          <section className="rounded-xl border border-cyan-300/16 bg-black/50 p-4 backdrop-blur-xl">
            <div className="mb-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-cyan-200/80">
              Certificate Registry
            </div>

            <div className="space-y-2 font-mono text-sm">
              {CERTIFICATES.map((record, index) => {
                const active = record.id === selectedId;
                const verified = record.status === "verified";

                return (
                  <motion.button
                    key={record.id}
                    type="button"
                    onClick={() => setSelectedId(record.id)}
                    whileHover={{ x: 5, scale: 1.01 }}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.08 + index * 0.05, duration: 0.2 }}
                    className={`group relative w-full rounded-lg border px-3 py-2.5 text-left transition-all ${
                      active
                        ? "border-cyan-200/50 bg-cyan-300/12 shadow-[0_0_20px_rgba(34,211,238,0.12)]"
                        : "border-white/10 bg-white/[0.03] hover:border-cyan-200/35 hover:bg-cyan-300/[0.07]"
                    }`}
                  >
                    <span
                      className={`absolute left-2 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full ${
                        verified
                          ? "bg-emerald-300 shadow-[0_0_10px_rgba(110,231,183,0.9)]"
                          : "bg-amber-300 shadow-[0_0_10px_rgba(252,211,77,0.8)]"
                      }`}
                    />
                    <span className="ml-3 block tracking-[0.03em]">
                      <span className="mr-1.5 text-cyan-200/85">&gt;</span>
                      {record.moduleName}
                    </span>
                    <span className="ml-6 mt-1 block text-[11px] uppercase tracking-[0.1em] text-slate-300/72">
                      {verified ? "verified" : "pending"}
                    </span>
                  </motion.button>
                );
              })}
            </div>
          </section>

          <section className="rounded-xl border border-white/12 bg-white/[0.04] p-4 backdrop-blur-xl">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/25 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.13em] text-slate-200/85">
              <FileBadge2 size={12} /> Certificate Viewer
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={selected.id}
                initial={{ opacity: 0, y: 8, scale: 0.99 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.99 }}
                transition={{ duration: 0.26 }}
                className="space-y-3"
              >
                <motion.div
                  whileHover={{ y: -2, scale: 1.01 }}
                  className="relative overflow-hidden rounded-xl border border-cyan-300/20 bg-[linear-gradient(160deg,rgba(3,10,26,0.92)_0%,rgba(2,7,20,0.9)_100%)] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_0_28px_rgba(34,211,238,0.12)]"
                >
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-cyan-300/10 via-transparent to-emerald-300/8" />
                  <div className="pointer-events-none absolute -inset-x-20 top-0 h-20 rotate-2 bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                  <div className="relative space-y-3">
                    <div className="flex items-center gap-2 text-cyan-100">
                      <BadgeCheck size={16} />
                      <p className="text-xs font-semibold uppercase tracking-[0.14em]">Credential Hologram</p>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-white">{selected.displayName}</h3>
                      <p className="text-xs text-slate-300/75">Issued by {selected.issuer}</p>
                    </div>

                    <div className="grid gap-2 sm:grid-cols-2">
                      <div className="rounded-md border border-white/12 bg-black/20 px-2.5 py-2">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-300/70">Date</p>
                        <p className="mt-1 text-sm text-cyan-100">{selected.issueDate}</p>
                      </div>
                      <div className="rounded-md border border-white/12 bg-black/20 px-2.5 py-2">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-300/70">Status</p>
                        <p className="mt-1 inline-flex items-center gap-1.5 text-sm text-emerald-200">
                          <ShieldCheck size={14} /> {selected.status === "verified" ? "Verified" : "Pending"}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-300/70">Skills Gained</p>
                      <div className="flex flex-wrap gap-1.5 text-[11px] text-slate-100/85">
                        {selected.skills.map((skill) => (
                          <span key={skill} className="rounded-md border border-white/15 bg-white/[0.06] px-2 py-1">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-md border border-cyan-300/25 bg-cyan-300/8 px-2.5 py-2 text-xs text-cyan-100/90">
                      <span className="inline-flex items-center gap-1.5 font-semibold uppercase tracking-[0.12em]">
                        <Hash size={11} /> Certificate ID
                      </span>
                      <p className="mt-1 font-mono text-[11px] tracking-[0.04em] text-cyan-100/88">{selected.certificateHash}</p>
                    </div>
                  </div>
                </motion.div>

                <motion.a
                  href={selected.verifyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="inline-flex items-center gap-2 rounded-md border border-cyan-200/35 bg-cyan-300/10 px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-cyan-100"
                >
                  Verify Certificate <ExternalLink size={12} />
                </motion.a>
              </motion.div>
            </AnimatePresence>
          </section>
        </div>

        <section className="overflow-hidden rounded-xl border border-emerald-300/16 bg-black/50 backdrop-blur-xl">
          <div className="border-b border-emerald-300/14 bg-emerald-400/5 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-emerald-200/80">
            Verification Logs
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
