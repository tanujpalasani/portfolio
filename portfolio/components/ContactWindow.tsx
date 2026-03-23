"use client";

import { motion } from "framer-motion";
import { Github, Linkedin, Mail, Radio } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import { portfolio } from "@/data/portfolio";

type Channel = {
  label: string;
  href: string;
  Icon: LucideIcon;
  colorClass: string;
  value: string;
};

const CHANNELS: Channel[] = [
  {
    label: "Email",
    href: `mailto:${portfolio.personal.email}`,
    Icon: Mail,
    colorClass: "from-cyan-300/35 to-sky-400/25",
    value: portfolio.personal.email,
  },
  {
    label: "LinkedIn",
    href: portfolio.personal.linkedin,
    Icon: Linkedin,
    colorClass: "from-blue-300/35 to-indigo-400/25",
    value: portfolio.personal.linkedinHandle,
  },
  {
    label: "GitHub",
    href: portfolio.personal.github,
    Icon: Github,
    colorClass: "from-slate-300/30 to-zinc-400/20",
    value: portfolio.personal.githubHandle,
  },
];

const IDLE_LOGS = [
  "[ INIT ] Communication terminal online",
  "[ OK ] Awaiting encrypted payload",
];

const SEND_LOGS = [
  "[ INIT ] Establishing connection...",
  "[ OK ] Secure channel created",
  "[ INFO ] Encrypting payload...",
  "[ INFO ] Sending message...",
  "[ DONE ] Message delivered",
];

function sleep(ms: number) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

function getSeverityClass(line: string) {
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

function estimateTypingDuration(lines: string[]) {
  const charTime = lines.reduce((total, line) => total + line.length * 14, 0);
  const linePause = lines.length * 140;
  return charTime + linePause;
}

export default function ContactWindow() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [cursorVisible, setCursorVisible] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [isDelivered, setIsDelivered] = useState(false);
  const [logScript, setLogScript] = useState<string[]>(IDLE_LOGS);
  const [typedLogs, setTypedLogs] = useState<string[]>([]);
  const [activeLogIndex, setActiveLogIndex] = useState(-1);

  const logRunRef = useRef(0);

  useEffect(() => {
    const intervalId = window.setInterval(() => setCursorVisible((prev) => !prev), 520);
    return () => window.clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const runId = ++logRunRef.current;
    const stale = () => runId !== logRunRef.current;

    const runLogs = async () => {
      setTypedLogs(logScript.map(() => ""));
      setActiveLogIndex(logScript.length ? 0 : -1);

      for (let lineIndex = 0; lineIndex < logScript.length; lineIndex += 1) {
        if (stale()) {
          return;
        }

        const fullLine = logScript[lineIndex];
        setActiveLogIndex(lineIndex);

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
  }, [logScript]);

  const canSend = useMemo(
    () => Boolean(name.trim() && email.trim() && message.trim()) && !isSending,
    [name, email, message, isSending],
  );

  const runValidationLog = () => {
    setLogScript([
      "[ INIT ] Validating terminal payload...",
      "[ WARN ] Missing fields detected",
      "[ INFO ] Required: name, email, message",
    ]);
  };

  const handleSubmit = async () => {
    if (!canSend) {
      runValidationLog();
      return;
    }

    setIsDelivered(false);
    setIsSending(true);
    setLogScript(SEND_LOGS);

    await sleep(estimateTypingDuration(SEND_LOGS) + 180);

    setName("");
    setEmail("");
    setMessage("");
    setIsSending(false);
    setIsDelivered(true);

    setLogScript([
      "[ DONE ] Message delivered",
      "[ OK ] Terminal reset and ready",
    ]);
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 12, scale: 0.99 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
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
          COMMUNICATION TERMINAL
        </div>

        <div className="grid gap-4 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
          <section className="rounded-xl border border-cyan-300/18 bg-black/52 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] backdrop-blur-xl">
            <div className="mb-3 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-cyan-200/85">
              <Radio size={12} /> Message Terminal
            </div>

            <div className="space-y-3 font-mono text-sm text-slate-200/90">
              <p className="text-cyan-100/90">&gt; initiate.contact</p>

              <label className="block">
                <span className="text-cyan-200/85">&gt; name:</span>
                <input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  disabled={isSending}
                  className="mt-1 w-full rounded-md border border-white/12 bg-white/[0.03] px-3 py-2 text-sm text-white outline-none transition focus:border-cyan-300/45 disabled:opacity-65"
                  placeholder="operator_name"
                />
              </label>

              <label className="block">
                <span className="text-cyan-200/85">&gt; email:</span>
                <input
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  disabled={isSending}
                  className="mt-1 w-full rounded-md border border-white/12 bg-white/[0.03] px-3 py-2 text-sm text-white outline-none transition focus:border-cyan-300/45 disabled:opacity-65"
                  placeholder="operator_email"
                />
              </label>

              <label className="block">
                <span className="text-cyan-200/85">&gt; message:</span>
                <textarea
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  disabled={isSending}
                  rows={4}
                  className="mt-1 w-full resize-none rounded-md border border-white/12 bg-white/[0.03] px-3 py-2 text-sm text-white outline-none transition focus:border-cyan-300/45 disabled:opacity-65"
                  placeholder="transmission_payload"
                />
              </label>

              <div className="flex items-center justify-between gap-3 pt-1">
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSending}
                  className="rounded-md border border-cyan-300/35 bg-cyan-300/10 px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-cyan-100 transition hover:bg-cyan-300/16 disabled:cursor-wait disabled:opacity-80"
                >
                  &gt; {isSending ? "transmitting..." : "send()"}
                </button>

                <p className="text-xs text-slate-300/80">
                  cursor:
                  <span className="ml-1 inline-flex h-4 w-2 translate-y-0.5 rounded-[1px] bg-cyan-300/95 align-middle shadow-[0_0_8px_rgba(34,211,238,0.6)]"
                    style={{ opacity: cursorVisible ? 1 : 0.15 }}
                  />
                </p>
              </div>

              {isDelivered ? (
                <motion.p
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xs font-medium text-emerald-200/90"
                >
                  [ SUCCESS ] Transmission acknowledged.
                </motion.p>
              ) : null}
            </div>
          </section>

          <section className="rounded-xl border border-white/12 bg-white/[0.04] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] backdrop-blur-xl">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/25 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.13em] text-slate-200/85">
              Contact Channels
            </div>

            <div className="mb-3 space-y-2 rounded-lg border border-emerald-300/25 bg-emerald-400/10 p-3 text-xs text-emerald-200/90">
              <p className="font-semibold uppercase tracking-[0.14em]">{portfolio.personal.statusLabel}</p>
              <p>{portfolio.personal.responseTime}</p>
            </div>

            <div className="space-y-2.5">
              {CHANNELS.map((channel) => (
                <motion.a
                  key={channel.label}
                  href={channel.href}
                  target={channel.href.startsWith("http") ? "_blank" : undefined}
                  rel={channel.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  whileHover={{ x: 4, y: -1 }}
                  whileTap={{ scale: 0.99 }}
                  className="group relative flex items-center gap-3 overflow-hidden rounded-lg border border-white/12 bg-white/[0.03] px-3 py-3 text-sm text-slate-100/92 transition hover:border-cyan-300/35"
                >
                  <div className={`pointer-events-none absolute -right-6 -top-6 h-16 w-16 rounded-full bg-gradient-to-br ${channel.colorClass} opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100`} />
                  <div className="rounded-md border border-white/12 bg-white/[0.05] p-2">
                    <channel.Icon size={16} className="text-cyan-100" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-cyan-100/90">{channel.label}</p>
                    <p className="truncate text-xs text-slate-300/85">{channel.value}</p>
                  </div>
                </motion.a>
              ))}
            </div>
          </section>
        </div>

        <section className="overflow-hidden rounded-xl border border-emerald-300/16 bg-black/50 backdrop-blur-xl">
          <div className="border-b border-emerald-300/14 bg-emerald-400/5 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-emerald-200/80">
            Transmission Logs
          </div>

          <div className="space-y-1.5 px-4 py-3 font-mono text-xs sm:text-[13px]">
            {logScript.map((line, index) => {
              const rendered = typedLogs[index] ?? "";
              const isActive = index === activeLogIndex && rendered.length < line.length;

              return (
                <p key={`${line}-${index}`} className={getSeverityClass(line)}>
                  {rendered}
                  {isActive ? (
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
