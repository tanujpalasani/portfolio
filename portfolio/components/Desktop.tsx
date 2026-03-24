"use client";

import { motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";

import DesktopIcon from "./DesktopIcon";
import { tanuOSApps } from "./tanuos-apps";
import { useWindowStore } from "@/store/useWindowStore";

const SYSTEM_LINES = ["SYSTEM ACTIVE", "TANUOS v1.0", "USER: TANUJ"];

function sleep(ms: number) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

export default function Desktop() {
  const openWindow = useWindowStore((state) => state.openWindow);
  const windows = useWindowStore((state) => state.windows);
  const activeWindowId = useWindowStore((state) => state.activeWindowId);

  const [now, setNow] = useState(() => new Date());
  const [typedLines, setTypedLines] = useState<string[]>(() => SYSTEM_LINES.map(() => ""));
  const [activeLine, setActiveLine] = useState(0);
  const typingRunRef = useRef(0);

  const iconParallaxRef = useRef<HTMLDivElement>(null);
  const systemTextRef = useRef<HTMLDivElement>(null);
  const cursorGlowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tick = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(tick);
  }, []);

  useEffect(() => {
    const runId = ++typingRunRef.current;
    const isStale = () => runId !== typingRunRef.current;

    const runTyping = async () => {
      setTypedLines(SYSTEM_LINES.map(() => ""));
      setActiveLine(0);

      for (let lineIndex = 0; lineIndex < SYSTEM_LINES.length; lineIndex += 1) {
        if (isStale()) {
          return;
        }

        setActiveLine(lineIndex);
        const line = SYSTEM_LINES[lineIndex];

        for (let charIndex = 0; charIndex < line.length; charIndex += 1) {
          if (isStale()) {
            return;
          }

          const nextText = line.slice(0, charIndex + 1);
          setTypedLines((prev) => {
            if (isStale()) {
              return prev;
            }
            const next = [...prev];
            next[lineIndex] = nextText;
            return next;
          });
          await sleep(26 + Math.floor(Math.random() * 36));
        }

        await sleep(170 + Math.floor(Math.random() * 170));
      }

      setActiveLine(SYSTEM_LINES.length - 1);
    };

    runTyping();

    return () => {
      typingRunRef.current += 1;
    };
  }, []);

  useEffect(() => {
    const target = { x: 0, y: 0, px: window.innerWidth * 0.5, py: window.innerHeight * 0.5 };
    const current = { x: 0, y: 0, px: target.px, py: target.py };
    let rafId = 0;

    const updateFrame = () => {
      current.x += (target.x - current.x) * 0.07;
      current.y += (target.y - current.y) * 0.07;
      current.px += (target.px - current.px) * 0.08;
      current.py += (target.py - current.py) * 0.08;

      if (iconParallaxRef.current) {
        iconParallaxRef.current.style.transform = `translate3d(${current.x * -12}px, ${current.y * -10}px, 0)`;
      }
      if (systemTextRef.current) {
        systemTextRef.current.style.transform = `translate3d(${current.x * 6}px, ${current.y * 5}px, 0)`;
      }
      if (cursorGlowRef.current) {
        cursorGlowRef.current.style.transform = `translate3d(${current.px - 170}px, ${current.py - 170}px, 0)`;
      }

      rafId = window.requestAnimationFrame(updateFrame);
    };

    const handleMove = (event: MouseEvent) => {
      target.x = event.clientX / window.innerWidth - 0.5;
      target.y = event.clientY / window.innerHeight - 0.5;
      target.px = event.clientX;
      target.py = event.clientY;
    };

    const handleLeave = () => {
      target.x = 0;
      target.y = 0;
      target.px = window.innerWidth * 0.5;
      target.py = window.innerHeight * 0.5;
    };

    window.addEventListener("mousemove", handleMove, { passive: true });
    window.addEventListener("mouseleave", handleLeave);
    rafId = window.requestAnimationFrame(updateFrame);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseleave", handleLeave);
      window.cancelAnimationFrame(rafId);
    };
  }, []);

  const timeLabel = useMemo(
    () =>
      now.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      }),
    [now],
  );

  const dateLabel = useMemo(
    () =>
      now.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
      }),
    [now],
  );

  const systemStatus = useMemo(() => {
    const labels = [
      "All systems operational",
      "Runtime stable",
      "Pipelines synchronized",
      "Network secure",
    ];
    return labels[now.getSeconds() % labels.length];
  }, [now]);

  const isIconActive = (id: (typeof tanuOSApps)[number]["id"]) =>
    windows.some((windowItem) => windowItem.id === id && !windowItem.isMinimized && !windowItem.isClosing);

  return (
    <section className="pointer-events-none absolute inset-0 z-20">
      <motion.div
        ref={cursorGlowRef}
        className="pointer-events-none absolute z-0 h-[340px] w-[340px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(56,189,248,0.18) 0%, rgba(99,102,241,0.11) 36%, rgba(139,92,246,0.06) 58%, transparent 78%)",
          filter: "blur(20px)",
          transform: "translate3d(calc(50vw - 170px), calc(50vh - 170px), 0)",
        }}
        animate={{ opacity: [0.42, 0.66, 0.42], scale: [0.98, 1.05, 0.98] }}
        transition={{ duration: 9.5, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 28 }}
        className="pointer-events-auto absolute inset-x-0 top-0 z-50 h-10 border-b border-white/12 bg-gradient-to-b from-black/40 to-black/25 shadow-[0_4px_24px_rgba(0,0,0,0.25)] backdrop-blur-2xl"
      >
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.02] to-transparent"
            animate={{ x: ["-100%", "200%"] }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear", repeatDelay: 3 }}
          />
        </div>

        <div className="relative flex h-full items-center justify-between px-5 text-xs">
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="flex items-center gap-2.5 font-semibold tracking-wide"
          >
            <motion.span
              animate={{
                boxShadow: [
                  "0 0 10px rgba(34,211,238,0.6)",
                  "0 0 16px rgba(34,211,238,0.9)",
                  "0 0 10px rgba(34,211,238,0.6)",
                ],
              }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="h-1.5 w-1.5 rounded-full bg-cyan-300"
            />
            <span className="bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent">TanuOS</span>
          </motion.div>

          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="flex items-center gap-3 font-medium tracking-wide"
          >
            <div className="hidden items-center gap-2.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/60 sm:flex">
              <span className="inline-flex items-center gap-1.5">
                <motion.span
                  className="h-1.5 w-1.5 rounded-full bg-emerald-300/90 shadow-[0_0_8px_rgba(110,231,183,0.8)]"
                  animate={{ opacity: [0.45, 1, 0.45] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                Net Stable
              </span>
              <span className="inline-flex items-center gap-1.5">
                <motion.span
                  className="h-1.5 w-1.5 rounded-full bg-cyan-300/90 shadow-[0_0_8px_rgba(103,232,249,0.8)]"
                  animate={{ opacity: [0.45, 1, 0.45] }}
                  transition={{ duration: 2.4, repeat: Infinity }}
                />
                Secure
              </span>
            </div>
            <span suppressHydrationWarning className="text-white/60">{dateLabel}</span>
            <span suppressHydrationWarning className="text-white/80">{timeLabel}</span>
          </motion.div>
        </div>
      </motion.div>

      <div ref={systemTextRef} className="pointer-events-none absolute inset-0 transform-gpu will-change-transform">
        <div className="absolute left-1/2 top-1/2 w-[min(92vw,460px)] -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-cyan-100/15 bg-black/25 p-4 shadow-[0_26px_90px_rgba(2,6,23,0.52),0_0_30px_rgba(59,130,246,0.14)] backdrop-blur-xl sm:p-5">
          <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-b from-white/[0.08] via-transparent to-transparent" />

          <div className="relative flex items-center justify-between border-b border-white/10 pb-2.5 text-[10px] uppercase tracking-[0.16em] text-cyan-100/75">
            <span>Live System Widget</span>
            <span suppressHydrationWarning>{timeLabel}</span>
          </div>

          <div className="relative mt-3.5 grid grid-cols-2 gap-3 text-[11px] uppercase tracking-[0.14em] text-slate-200/75">
            <div className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2">System Active</div>
            <div className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2">TanuOS v1.0</div>
            <div className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2">User: Tanuj</div>
            <div className="rounded-lg border border-emerald-300/25 bg-emerald-400/10 px-3 py-2 text-emerald-100">
              {systemStatus}
            </div>
          </div>

          <div className="relative mt-3.5 space-y-1.5 font-mono text-[11px] uppercase tracking-[0.18em] text-cyan-100/60 sm:text-xs">
            {typedLines.map((line, index) => (
              <p key={SYSTEM_LINES[index]}>
                {`> ${line}`}
                {index === activeLine && (
                  <motion.span
                    className="ml-0.5 inline-block text-cyan-100/70"
                    animate={{ opacity: [1, 0, 1] }}
                    transition={{ duration: 0.85, repeat: Infinity, ease: "linear" }}
                  >
                    _
                  </motion.span>
                )}
              </p>
            ))}
          </div>
        </div>
      </div>

      <motion.aside
        initial={{ x: -60, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 26, delay: 0.3 }}
        className="pointer-events-auto absolute left-4 top-16 z-20 sm:left-8 sm:top-20"
      >
        <div
          ref={iconParallaxRef}
          className="flex max-h-[calc(100vh-12rem)] w-[min(340px,calc(100vw-2rem))] transform-gpu flex-col flex-wrap content-start gap-x-3 gap-y-4 overflow-hidden pr-2 will-change-transform sm:max-h-[calc(100vh-14rem)] sm:gap-x-4"
        >
          {tanuOSApps.map((app, index) => (
            <motion.div
              key={app.id}
              className="w-[92px] shrink-0 sm:w-[100px]"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 + index * 0.05, type: "spring", stiffness: 260, damping: 24 }}
            >
              <motion.div
                animate={{ y: [0, -1.8, 0] }}
                transition={{ duration: 3.2 + (index % 3) * 0.6, repeat: Infinity, ease: "easeInOut" }}
              >
                <DesktopIcon
                  id={app.id}
                  label={app.label}
                  Icon={app.icon}
                  accentClass={app.accentClass}
                  isActive={isIconActive(app.id) || activeWindowId === app.id}
                  onOpen={openWindow}
                />
              </motion.div>
            </motion.div>
          ))}
        </div>
      </motion.aside>

      <motion.div
        className="pointer-events-none absolute bottom-0 left-1/2 z-10 h-48 w-[min(94vw,920px)] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(56,189,248,0.22)_0%,rgba(59,130,246,0.14)_36%,rgba(147,51,234,0.08)_58%,transparent_78%)] blur-3xl"
        animate={{ opacity: [0.32, 0.72, 0.32], scale: [0.95, 1.06, 0.95] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 28, delay: 0.5 }}
        className="pointer-events-auto absolute bottom-6 left-5 z-20 space-y-2 sm:left-8"
      >
        <div className="group relative inline-flex items-center">
          <motion.span
            animate={{
              boxShadow: [
                "0 0 14px rgba(74,222,128,0.6)",
                "0 0 20px rgba(74,222,128,0.85)",
                "0 0 14px rgba(74,222,128,0.6)",
              ],
              opacity: [0.6, 1, 0.6],
            }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
            className="inline-flex h-3 w-3 rounded-full bg-emerald-400 ring-2 ring-emerald-400/30 ring-offset-2 ring-offset-transparent"
          />
          <span className="pointer-events-none absolute -top-9 left-1/2 z-50 -translate-x-1/2 whitespace-nowrap rounded-lg border border-white/15 bg-black/85 px-3 py-1.5 text-[11px] font-medium tracking-wide text-white/95 opacity-0 shadow-lg backdrop-blur-xl transition-opacity duration-200 group-hover:opacity-100">
            <span className="drop-shadow-sm">System Online</span>
            <span className="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 border-b border-r border-white/15 bg-black/85" />
          </span>
        </div>

        <div className="space-y-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/55">
          <p>[ Runtime Stable ]</p>
          <p>[ AI Services Online ]</p>
          <p>[ GPU Pipeline Warm ]</p>
        </div>
      </motion.div>
    </section>
  );
}
