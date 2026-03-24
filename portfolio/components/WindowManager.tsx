"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Download, FileText, Lock, ScanLine } from "lucide-react";
import dynamic from "next/dynamic";
import { useEffect, useMemo, useRef, useState } from "react";

import Window from "./Window";
import { portfolio } from "@/data/portfolio";
import { useWindowStore, type WindowId } from "@/store/useWindowStore";

const AboutWindow = dynamic(() => import("./AboutWindow"));
const EducationWindow = dynamic(() => import("./EducationWindow"));
const CertificatesWindow = dynamic(() => import("./CertificatesWindow"));
const ProjectsWindow = dynamic(() => import("./ProjectsWindow"));
const SkillsWindow = dynamic(() => import("./SkillsWindow"));
const GitHubWindow = dynamic(() => import("./GitHubWindow"));
const LinkedInWindow = dynamic(() => import("./LinkedInWindow"));
const AchievementsWindow = dynamic(() => import("./AchievementsWindow"));
const ContactWindow = dynamic(() => import("./ContactWindow"));
const TerminalWindow = dynamic(() => import("./TerminalWindow"));

const DOCUMENT_LOADING_LINES = ["[ LOADING DOCUMENT ]", "[ RENDERING PAGES ]", "[ READY ]"] as const;

function sleep(ms: number) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

function ResumeViewerModule() {
  const [typedLines, setTypedLines] = useState<string[]>([]);
  const [viewerReady, setViewerReady] = useState(false);
  const [pdfLoaded, setPdfLoaded] = useState(false);
  const [focusMode, setFocusMode] = useState(false);
  const [scrollSignal, setScrollSignal] = useState(0);
  const runRef = useRef(0);

  useEffect(() => {
    const runId = ++runRef.current;
    const stale = () => runId !== runRef.current;

    const runSequence = async () => {
      setTypedLines([]);
      setViewerReady(false);

      for (let i = 0; i < DOCUMENT_LOADING_LINES.length; i += 1) {
        if (stale()) {
          return;
        }

        const line = DOCUMENT_LOADING_LINES[i];
        setTypedLines((prev) => {
          const next = [...prev];
          next[i] = "";
          return next;
        });

        for (let c = 0; c < line.length; c += 1) {
          if (stale()) {
            return;
          }

          const segment = line.slice(0, c + 1);
          setTypedLines((prev) => {
            const next = [...prev];
            next[i] = segment;
            return next;
          });

          await sleep(12 + Math.floor(Math.random() * 14));
        }

        await sleep(140 + Math.floor(Math.random() * 80));
      }

      if (!stale()) {
        await sleep(120);
        setViewerReady(true);
      }
    };

    runSequence();

    return () => {
      runRef.current += 1;
    };
  }, []);

  useEffect(() => {
    if (scrollSignal === 0) {
      return;
    }

    const timer = window.setTimeout(() => setScrollSignal(0), 420);
    return () => window.clearTimeout(timer);
  }, [scrollSignal]);

  const statusPhase = !viewerReady ? "Loading" : !pdfLoaded ? "Rendering" : "Ready";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="relative isolate space-y-4"
    >
      <div className="relative z-10 space-y-4">
        <div
          className={`rounded-xl border border-cyan-300/22 bg-[linear-gradient(140deg,rgba(3,11,31,0.68),rgba(3,8,22,0.72))] p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_10px_28px_rgba(0,0,0,0.34)] backdrop-blur-xl transition-opacity duration-250 ${focusMode ? "opacity-70" : "opacity-100"}`}
        >
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-cyan-200/28 bg-cyan-300/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-cyan-100/90">
            <FileText size={12} /> [ DOCUMENT VIEWER ]
          </div>
          <div className="grid gap-2 text-[11px] text-slate-200/86 sm:grid-cols-2">
            <p><span className="text-slate-400">File:</span> tanuj_resume.pdf</p>
            <p>
              <span className="text-slate-400">Status:</span>{" "}
              <AnimatePresence mode="wait">
                <motion.span
                  key={statusPhase}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.2 }}
                  className="inline-block"
                >
                  {statusPhase}
                </motion.span>
              </AnimatePresence>
            </p>
            <p><span className="text-slate-400">Mode:</span> Read-Only</p>
            <p><span className="text-slate-400">Format:</span> PDF</p>
          </div>
        </div>

        <div
          className={`flex flex-wrap items-center justify-between gap-4 rounded-xl border border-white/14 bg-white/[0.04] px-3 py-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_8px_20px_rgba(0,0,0,0.22)] backdrop-blur-xl transition-all duration-300 hover:border-cyan-200/30 hover:bg-white/[0.05] ${focusMode ? "opacity-70" : "opacity-100"}`}
        >
          <div className="space-y-1">
            <h3 className="text-lg font-semibold text-white">Resume</h3>
            <p className="text-xs text-slate-300/70">{portfolio.personal.name} - Latest PDF</p>
          </div>
          <motion.a
            href={portfolio.personal.resumePath}
            download
            whileHover={{ scale: 1.04, y: -1 }}
            whileTap={{ scale: 0.97 }}
            className="group inline-flex items-center gap-2 rounded-xl border border-cyan-300/30 bg-gradient-to-br from-cyan-400/15 to-blue-500/10 px-4 py-2.5 text-xs font-semibold text-cyan-100 shadow-[inset_0_1px_0_rgba(147,197,253,0.2),0_4px_12px_rgba(34,211,238,0.2)] transition-all hover:border-cyan-300/48 hover:from-cyan-400/22 hover:to-blue-500/16 hover:shadow-[inset_0_1px_0_rgba(147,197,253,0.25),0_10px_24px_rgba(34,211,238,0.34)]"
          >
            <Download size={15} />
            <span>Download Resume</span>
            <ArrowUpRight size={13} className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </motion.a>
        </div>

        <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_200px]">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: focusMode ? 1.015 : 1 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className={`relative overflow-hidden rounded-2xl border bg-black/40 p-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_8px_24px_rgba(0,0,0,0.4)] transition-all duration-300 ${
              focusMode
                ? "border-cyan-200/48 shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_20px_42px_rgba(2,6,23,0.56),0_0_0_1px_rgba(34,211,238,0.18)]"
                : "border-white/12"
            }`}
            onClick={() => setFocusMode(true)}
            onWheelCapture={() => setScrollSignal((prev) => prev + 1)}
          >
          {focusMode && <div className="pointer-events-none absolute inset-0 z-[1] bg-black/30" />}

          <div className="pointer-events-none absolute inset-0 rounded-2xl bg-[radial-gradient(120%_80%_at_50%_0%,rgba(56,189,248,0.16),transparent_52%)]" />
          <div className="pointer-events-none absolute inset-0 rounded-2xl shadow-[inset_0_0_20px_rgba(34,211,238,0.12)]" />

          <AnimatePresence mode="wait">
            {!viewerReady ? (
              <motion.div
                key="doc-loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="relative z-10 flex h-[390px] items-center justify-center rounded-xl border border-white/12 bg-[linear-gradient(160deg,rgba(2,6,23,0.9)_0%,rgba(3,10,26,0.82)_52%,rgba(3,6,18,0.92)_100%)]"
              >
                <div className="space-y-2 font-mono text-xs text-cyan-100/90">
                  {DOCUMENT_LOADING_LINES.map((line, index) => {
                    const rendered = typedLines[index] ?? "";
                    const typing = index === typedLines.length - 1 && rendered.length < line.length;
                    const showLoaderCursor = index === 0 && rendered.length > 0;
                    const splitWithClosing = showLoaderCursor && rendered.endsWith(" ]");

                    return (
                      <p key={line} className="tracking-[0.04em]">
                        {splitWithClosing ? rendered.slice(0, -2) : rendered}
                        {typing || showLoaderCursor ? (
                          <motion.span
                            animate={{ opacity: [1, 0, 1] }}
                            transition={{ duration: 0.9, repeat: Infinity, ease: "linear" }}
                            className="ml-0.5"
                          >
                            _
                          </motion.span>
                        ) : null}
                        {splitWithClosing ? " ]" : null}
                      </p>
                    );
                  })}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="doc-viewer"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.28 }}
                className="relative z-10"
              >
                <iframe
                  src={`${portfolio.personal.resumePath}#view=FitH`}
                  title={`${portfolio.personal.shortName} Resume`}
                  onLoad={() => setPdfLoaded(true)}
                  className="h-[390px] w-full rounded-xl border border-white/10 bg-slate-950"
                />
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div
            className="pointer-events-none absolute inset-x-2 top-2 z-20 h-12 rounded-t-xl bg-gradient-to-b from-slate-950/74 to-transparent"
            animate={{ opacity: scrollSignal > 0 ? 0.98 : 0.76 }}
            transition={{ duration: 0.22 }}
          />
          <motion.div
            className="pointer-events-none absolute inset-x-2 bottom-2 z-20 h-12 rounded-b-xl bg-gradient-to-t from-slate-950/78 to-transparent"
            animate={{ opacity: scrollSignal > 0 ? 0.98 : 0.76 }}
            transition={{ duration: 0.22 }}
          />
          <motion.div
            className="pointer-events-none absolute inset-x-2 top-2 z-20 h-12 rounded-t-xl shadow-[inset_0_14px_16px_-14px_rgba(2,6,23,0.86)]"
            animate={{ opacity: scrollSignal > 0 ? 1 : 0.72 }}
            transition={{ duration: 0.22 }}
          />
          <motion.div
            className="pointer-events-none absolute inset-x-2 bottom-2 z-20 h-12 rounded-b-xl shadow-[inset_0_-14px_16px_-14px_rgba(2,6,23,0.9)]"
            animate={{ opacity: scrollSignal > 0 ? 1 : 0.72 }}
            transition={{ duration: 0.22 }}
          />
          </motion.div>

          <motion.div
            animate={{ opacity: focusMode ? 0.42 : 1, y: focusMode ? 2 : 0 }}
            whileHover={{ y: focusMode ? 2 : -2 }}
            transition={{ duration: 0.24, ease: "easeOut" }}
            className="rounded-xl border border-white/12 bg-black/25 p-3 text-xs text-slate-300/84 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] transition-all duration-250 hover:border-cyan-200/28 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.07),0_10px_20px_rgba(2,6,23,0.36),0_0_0_1px_rgba(34,211,238,0.08)]"
          >
          <p className="mb-2 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-200/82">
            <ScanLine size={12} /> Document Metadata
          </p>
          <div className="space-y-1.5">
            <p><span className="text-slate-400">File Name:</span> tanuj_resume.pdf</p>
            <p><span className="text-slate-400">File Size:</span> 1.2 MB</p>
            <p><span className="text-slate-400">Last Updated:</span> Feb 2026</p>
            <p><span className="text-slate-400">Format:</span> PDF</p>
          </div>
          <button
            type="button"
            onClick={() => setFocusMode((prev) => !prev)}
            className="mt-3 inline-flex items-center gap-1.5 rounded-md border border-white/14 bg-white/[0.03] px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-200/86 transition-colors hover:border-cyan-200/35 hover:text-cyan-100"
          >
            <Lock size={11} />
            {focusMode ? "Exit Focus" : "Focus Mode"}
          </button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

const windowBodyById: Record<WindowId, () => React.ReactNode> = {
  about: () => <AboutWindow />,
  education: () => <EducationWindow />,
  certificates: () => <CertificatesWindow />,
  projects: () => <ProjectsWindow />,
  skills: () => <SkillsWindow />,
  resume: () => <ResumeViewerModule />,
  github: () => <GitHubWindow />,
  linkedin: () => <LinkedInWindow />,
  achievements: () => <AchievementsWindow />,
  contact: () => <ContactWindow />,
  terminal: () => <TerminalWindow />,
};

export default function WindowManager() {
  const windows = useWindowStore((state) => state.windows);
  const activeWindowId = useWindowStore((state) => state.activeWindowId);
  const closeWindow = useWindowStore((state) => state.closeWindow);
  const minimizeWindow = useWindowStore((state) => state.minimizeWindow);
  const toggleMaximizeWindow = useWindowStore((state) => state.toggleMaximizeWindow);
  const focusWindow = useWindowStore((state) => state.focusWindow);

  const visibleWindows = useMemo(
    () => windows.filter((windowItem) => !windowItem.isMinimized),
    [windows],
  );

  return (
    <section className="pointer-events-none absolute inset-0 z-30">
      <AnimatePresence>
        {visibleWindows.map((windowItem) => (
          <Window
            key={windowItem.id}
            id={windowItem.id}
            title={windowItem.title}
            zIndex={windowItem.zIndex}
            maximized={windowItem.isMaximized}
            minimizing={windowItem.isMinimizing}
            closing={windowItem.isClosing}
            initialPosition={windowItem.initialPosition}
            active={activeWindowId === windowItem.id}
            onClose={closeWindow}
            onMinimize={minimizeWindow}
            onMaximize={toggleMaximizeWindow}
            onFocus={focusWindow}
          >
            {windowBodyById[windowItem.id]()}
          </Window>
        ))}
      </AnimatePresence>
    </section>
  );
}
