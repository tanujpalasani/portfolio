"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

type BootScreenProps = {
  onComplete: () => void;
};

const BOOT_LINES = ["Initializing system...", "Loading modules...", "Starting services..."];

function sleep(ms: number, timerIds: number[]) {
  return new Promise<void>((resolve) => {
    const id = window.setTimeout(resolve, ms);
    timerIds.push(id);
  });
}

export default function BootScreen({ onComplete }: BootScreenProps) {
  const [typedLines, setTypedLines] = useState<string[]>(() => BOOT_LINES.map(() => ""));
  const [activeLine, setActiveLine] = useState(0);

  useEffect(() => {
    let cancelled = false;
    const timerIds: number[] = [];

    const runBootText = async () => {
      for (let lineIndex = 0; lineIndex < BOOT_LINES.length; lineIndex += 1) {
        if (cancelled) {
          return;
        }

        setActiveLine(lineIndex);
        const line = BOOT_LINES[lineIndex];

        for (let charIndex = 0; charIndex < line.length; charIndex += 1) {
          if (cancelled) {
            return;
          }

          const nextText = line.slice(0, charIndex + 1);
          setTypedLines((prev) => {
            const next = [...prev];
            next[lineIndex] = nextText;
            return next;
          });
          await sleep(20, timerIds);
        }

        await sleep(180, timerIds);
      }
    };

    runBootText();

    const doneId = window.setTimeout(() => {
      if (!cancelled) {
        onComplete();
      }
    }, 2100);
    timerIds.push(doneId);

    return () => {
      cancelled = true;
      timerIds.forEach((id) => window.clearTimeout(id));
    };
  }, [onComplete]);

  return (
    <motion.section
      className="relative flex h-screen w-screen items-center justify-center overflow-hidden bg-black text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.45, ease: "easeInOut" }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(56,189,248,0.12),transparent_45%),linear-gradient(160deg,#01040b_0%,#02040a_55%,#000000_100%)]" />

      <div className="relative z-10 mx-4 w-full max-w-3xl rounded-2xl border border-cyan-200/15 bg-black/55 p-6 shadow-[0_24px_80px_rgba(6,182,212,0.2)] backdrop-blur-md sm:p-8">
        <p className="mb-4 text-[11px] font-medium uppercase tracking-[0.22em] text-cyan-200/75">TanuOS Boot Loader</p>

        <div className="space-y-2 font-mono text-sm text-cyan-100/90 sm:text-base">
          {typedLines.map((line, index) => (
            <p key={BOOT_LINES[index]} className="min-h-6">
              <span className="text-cyan-300/70">$</span> {line}
              {index === activeLine && (
                <motion.span
                  className="ml-1 inline-block text-cyan-200"
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                >
                  _
                </motion.span>
              )}
            </p>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
