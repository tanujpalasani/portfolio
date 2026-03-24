"use client";

import { motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";

import { portfolio } from "@/data/portfolio";
import { useWindowStore, type WindowId } from "@/store/useWindowStore";

type EntryKind = "system" | "command" | "output" | "success" | "error";

type TerminalEntry = {
  id: string;
  kind: EntryKind;
  text: string;
};

type CommandResult = {
  kind: Exclude<EntryKind, "command">;
  lines: string[];
  delayMs?: number;
  afterOutput?: () => void;
};

type CommandContext = {
  openWindow: (id: WindowId, title: string) => void;
  clearTerminal: () => void;
};

const BOOT_LINES = [
  "Booting TanuOS v1.0...",
  "Loading modules...",
  "Initializing profile...",
  "System ready.",
] as const;

const COMMANDS = [
  "help",
  "about",
  "skills",
  "skills --core",
  "projects",
  "contact",
  "education",
  "certificates",
  "clear",
  "whoami",
  "hire me",
  "status",
  "hello",
] as const;

const TYPE_SPEED_MS = 20;

function sleep(ms: number) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

function makeId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function createCommandResult(command: string, context: CommandContext): CommandResult {
  switch (command) {
    case "help":
      return {
        kind: "output",
        lines: [
          "SYSTEM COMMANDS:",
          "",
          "[ CORE ]",
          "-> about",
          "-> skills",
          "-> skills --core",
          "-> projects",
          "-> contact",
          "-> education",
          "-> certificates",
          "",
          "[ SYSTEM ]",
          "-> help",
          "-> clear",
          "-> status",
          "",
          "[ USER ]",
          "-> whoami",
          "-> hire me",
          "-> hello",
        ],
      };
    case "about":
      return {
        kind: "success",
        lines: [
          `${portfolio.personal.name} :: ${portfolio.personal.role}`,
          "Opening About module...",
          "Done.",
        ],
        delayMs: 420,
        afterOutput: () => context.openWindow("about", "About"),
      };
    case "skills":
      return {
        kind: "success",
        lines: [
          `Skill modules loaded: ${Object.keys(portfolio.skills).length}`,
          `Core stack: ${portfolio.skills.coreStack.join(", ")}`,
          "Opening Skills module...",
          "Done.",
        ],
        delayMs: 420,
        afterOutput: () => context.openWindow("skills", "Skills"),
      };
    case "skills --core":
      return {
        kind: "output",
        lines: [
          "CORE STACK:",
          ...portfolio.skills.coreStack.map((item) => `-> ${item}`),
        ],
      };
    case "projects":
      return {
        kind: "success",
        lines: [
          `Projects available: ${portfolio.projects.length}`,
          ...portfolio.projects.map((item) => `-> ${item.name}`),
          "Opening Projects module...",
          "Done.",
        ],
        delayMs: 520,
        afterOutput: () => context.openWindow("projects", "Projects"),
      };
    case "contact":
      return {
        kind: "success",
        lines: [
          `Email: ${portfolio.personal.email}`,
          `LinkedIn: ${portfolio.personal.linkedinHandle}`,
          "Opening Contact module...",
          "Done.",
        ],
        delayMs: 420,
        afterOutput: () => context.openWindow("contact", "Contact"),
      };
    case "education":
      return {
        kind: "success",
        lines: ["Opening Education module...", "Initializing UI...", "Done."],
        delayMs: 420,
        afterOutput: () => context.openWindow("education", "Education"),
      };
    case "certificates":
      return {
        kind: "success",
        lines: ["Opening Certificates module...", "Initializing UI...", "Done."],
        delayMs: 520,
        afterOutput: () => context.openWindow("certificates", "Certificates"),
      };
    case "clear":
      context.clearTerminal();
      return {
        kind: "system",
        lines: [],
      };
    case "whoami":
      return {
        kind: "output",
        lines: [
          `${portfolio.personal.name} - ${portfolio.personal.role}`,
          portfolio.personal.summary,
          `Location: ${portfolio.personal.location}`,
        ],
      };
    case "hire me":
      return {
        kind: "success",
        lines: [
          "Smart choice.",
          "Opening communication channel...",
          "Done.",
        ],
        delayMs: 430,
        afterOutput: () => context.openWindow("contact", "Contact"),
      };
    case "status":
      return {
        kind: "output",
        lines: [
          "SYSTEM STATUS:",
          `User: ${portfolio.personal.shortName.toLowerCase()}@tanuos`,
          "Core modules: online",
          "Uptime: stable",
          `Focus: ${portfolio.skills.coreStack.slice(0, 3).join(" + ")}`,
        ],
      };
    case "hello":
      return {
        kind: "success",
        lines: ["Hello, human. TanuOS terminal is online and ready."],
      };
    default:
      return {
        kind: "error",
        lines: [`command not found: ${command}`, "Type 'help' to list available commands."],
      };
  }
}

export default function TerminalWindow() {
  const openWindow = useWindowStore((state) => state.openWindow);

  const [entries, setEntries] = useState<TerminalEntry[]>([]);
  const [input, setInput] = useState("");
  const [cursorVisible, setCursorVisible] = useState(true);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [isBooting, setIsBooting] = useState(true);

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const streamTokenRef = useRef(0);
  const outputQueueRef = useRef<Promise<void>>(Promise.resolve());
  const mountedRef = useRef(true);

  const promptLabel = useMemo(
    () => (
      <span className="select-none">
        <span className="text-emerald-300 drop-shadow-[0_0_6px_rgba(74,222,128,0.7)]">➜</span>{" "}
        <span className="text-cyan-300">tanuos</span> <span className="text-slate-400">~</span>{" "}
        <span className="text-slate-100">%</span>
      </span>
    ),
    [],
  );

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      streamTokenRef.current += 1;
      outputQueueRef.current = Promise.resolve();
    };
  }, []);

  useEffect(() => {
    const intervalId = window.setInterval(() => setCursorVisible((prev) => !prev), 520);
    return () => window.clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (!scrollRef.current) {
      return;
    }

    scrollRef.current.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [entries]);

  useEffect(() => {
    const keepFocus = () => {
      if (document.activeElement !== inputRef.current) {
        inputRef.current?.focus();
      }
    };

    window.setTimeout(keepFocus, 40);
    window.addEventListener("mousedown", keepFocus);

    return () => {
      window.removeEventListener("mousedown", keepFocus);
    };
  }, []);

  const appendEntry = (kind: EntryKind, text: string) => {
    setEntries((prev) => [...prev, { id: makeId(kind), kind, text }]);
  };

  const appendTypedEntry = async (kind: Exclude<EntryKind, "command">, text: string, token: number) => {
    if (!mountedRef.current || token !== streamTokenRef.current) {
      return;
    }

    const id = makeId(kind);
    setEntries((prev) => [...prev, { id, kind, text: "" }]);

    for (let index = 0; index < text.length; index += 1) {
      if (!mountedRef.current || token !== streamTokenRef.current) {
        return;
      }

      const nextText = text.slice(0, index + 1);
      setEntries((prev) => prev.map((entry) => (entry.id === id ? { ...entry, text: nextText } : entry)));
      await sleep(TYPE_SPEED_MS);
    }
  };

  const resetOutputStream = () => {
    streamTokenRef.current += 1;
    outputQueueRef.current = Promise.resolve();
  };

  const enqueueTypedLines = (kind: Exclude<EntryKind, "command">, lines: string[], delayMs?: number) => {
    const token = streamTokenRef.current;
    lines.forEach((line) => {
      outputQueueRef.current = outputQueueRef.current.then(async () => {
        await appendTypedEntry(kind, line, token);
        await sleep(70);
      });
    });

    if (delayMs && delayMs > 0) {
      outputQueueRef.current = outputQueueRef.current.then(async () => {
        await sleep(delayMs);
      });
    }
  };

  useEffect(() => {
    const startId = window.setTimeout(() => {
      const runBootSequence = async () => {
        resetOutputStream();
        const token = ++streamTokenRef.current;
        setEntries([]);

        for (const line of BOOT_LINES) {
          await appendTypedEntry("system", line, token);
          await sleep(130);
        }

        if (!mountedRef.current || token !== streamTokenRef.current) {
          return;
        }

        setIsBooting(false);
        window.setTimeout(() => inputRef.current?.focus(), 60);
      };

      void runBootSequence();
    }, 0);

    return () => {
      window.clearTimeout(startId);
      resetOutputStream();
    };
  }, []);

  const runCommand = async (rawCommand: string) => {
    const normalizedCommand = rawCommand.trim().toLowerCase().replace(/\s+/g, " ");
    if (!normalizedCommand) {
      return;
    }

    appendEntry("command", rawCommand);

    setCommandHistory((prev) => [...prev, rawCommand]);
    setHistoryIndex(-1);

    const clearTerminal = () => {
      resetOutputStream();
      setEntries([]);
    };

    const result = createCommandResult(normalizedCommand, {
      openWindow,
      clearTerminal,
    });

    if (!result.lines.length) {
      return;
    }

    enqueueTypedLines(result.kind, result.lines, result.delayMs);

    if (result.afterOutput) {
      outputQueueRef.current = outputQueueRef.current.then(async () => {
        if (!mountedRef.current) {
          return;
        }
        result.afterOutput?.();
      });
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (isBooting) {
      return;
    }

    const nextInput = input.trim();
    if (!nextInput) {
      return;
    }

    setInput("");
    await runCommand(nextInput);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowUp") {
      event.preventDefault();
      if (!commandHistory.length) {
        return;
      }

      const nextIndex = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(nextIndex);
      setInput(commandHistory[nextIndex]);
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      if (!commandHistory.length || historyIndex === -1) {
        return;
      }

      if (historyIndex >= commandHistory.length - 1) {
        setHistoryIndex(-1);
        setInput("");
        return;
      }

      const nextIndex = historyIndex + 1;
      setHistoryIndex(nextIndex);
      setInput(commandHistory[nextIndex]);
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="flex h-full w-full flex-col overflow-hidden rounded-2xl border border-emerald-400/18 bg-gradient-to-br from-black/85 to-slate-950/90 font-mono text-[13px] leading-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.04),0_16px_40px_rgba(0,0,0,0.55),0_0_42px_rgba(16,185,129,0.08)]"
      onClick={() => inputRef.current?.focus()}
    >
      <header className="relative border-b border-emerald-500/12 bg-gradient-to-r from-black/55 to-black/30 px-4 py-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.9)]" />
            <span className="text-[11px] uppercase tracking-[0.14em] text-emerald-300/85">TanuOS Interactive Terminal</span>
          </div>
          <span className="text-[10px] tracking-[0.12em] text-cyan-200/65">v1.0</span>
        </div>
        <div className="mt-1.5 flex items-center justify-between text-[10px] uppercase tracking-[0.12em] text-slate-300/70">
          <span>User: tanuj@tanuos</span>
          <span className="text-emerald-300/85">Status: Online</span>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-400/25 to-transparent" />
      </header>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4">
        {entries.map((entry) => (
          <div key={entry.id} className={`break-words ${entry.kind === "command" ? "mt-2.5 first:mt-0" : "mt-0.5"}`}>
            {entry.kind === "command" ? (
              <div className="text-cyan-300">
                {promptLabel} <span className="font-semibold text-cyan-200">{entry.text}</span>
              </div>
            ) : entry.kind === "error" ? (
              <p className="text-rose-300">{entry.text}</p>
            ) : entry.kind === "success" ? (
              <p className="text-emerald-300">{entry.text}</p>
            ) : entry.kind === "system" ? (
              <p className="text-amber-200/92">{entry.text}</p>
            ) : (
              <p className="text-slate-100/88">{entry.text}</p>
            )}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="border-t border-emerald-500/12 bg-black/45 p-3">
        <label className="flex items-center gap-2">
          {promptLabel}
          <input
            ref={inputRef}
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={() => window.setTimeout(() => inputRef.current?.focus(), 30)}
            autoComplete="off"
            spellCheck={false}
            disabled={isBooting}
            className="w-full bg-transparent text-white/95 caret-emerald-300 outline-none disabled:cursor-not-allowed disabled:opacity-60"
            aria-label="Terminal command input"
          />
          <span
            className="inline-block h-4 w-2 rounded-[1px] bg-emerald-300/95 shadow-[0_0_8px_rgba(52,211,153,0.6)] transition-opacity"
            style={{ opacity: cursorVisible ? 1 : 0.1 }}
          />
        </label>

        <div className="mt-2 rounded-lg border border-emerald-500/10 bg-emerald-500/[0.03] px-2.5 py-2 text-[10px] text-slate-300/80">
          Commands: {COMMANDS.join(" | ")}
        </div>
      </form>
    </motion.section>
  );
}
