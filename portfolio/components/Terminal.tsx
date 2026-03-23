"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useWindowStore } from "@/store/useWindowStore";

type EntryKind = "command" | "output" | "error" | "success";

type Entry = {
  id: string;
  kind: EntryKind;
  text: string;
};

type CommandResponse = {
  kind: "output" | "error" | "success";
  lines: string[];
};

const KNOWN_COMMANDS = [
  "help",
  "about",
  "projects",
  "skills",
  "contact",
  "whoami",
  "resume",
  "github",
  "linkedin",
  "hello",
  "sudo hire-me",
  "clear",
] as const;

const DEFAULT_SUGGESTIONS = ["about", "projects", "skills"] as const;
const TYPE_SPEED_MS = 18;

function getResponse(command: string): CommandResponse {
  switch (command) {
    case "help":
      return {
        kind: "output",
        lines: [
          "Available commands:",
          "help, about, projects, skills, contact, whoami, resume, github, linkedin, hello, sudo hire-me, clear",
        ],
      };
    case "about":
      return {
        kind: "output",
        lines: [
          "Palasani Sai Venkata Tanuj",
          "B.Tech CSE student focused on full-stack development and machine learning.",
        ],
      };
    case "projects":
      return {
        kind: "output",
        lines: [
          "- PlanIt - Project Management Platform (Feb 2026)",
          "- LMS Student Behavior Analytics Dashboard (Nov 2025)",
          "- Vehicle Load Monitoring System (May 2025)",
        ],
      };
    case "skills":
      return {
        kind: "output",
        lines: [
          "Languages: Python, JavaScript, C++",
          "Web: React.js, Next.js, HTML, CSS, Tailwind CSS, Node.js, Express.js",
          "Database: MongoDB, MySQL",
          "ML: Classification, Regression, Clustering, NLP (Basics), Scikit-learn",
          "Tools: Git, GitHub, Postman, VS Code, Linux, Streamlit, Google Colab",
        ],
      };
    case "contact":
      return {
        kind: "output",
        lines: [
          "Email: tanujpalasani@gmail.com",
          "Mobile: +91-7981533673",
          "GitHub: github.com/tanujpalasani",
          "LinkedIn: linkedin.com/in/tanujpalasani",
        ],
      };
    case "whoami":
      return {
        kind: "output",
        lines: ["Palasani Sai Venkata Tanuj", "Full-Stack & ML Developer"],
      };
    case "hello":
      return {
        kind: "success",
        lines: ["Hey there. Thanks for exploring my DevOS terminal."],
      };
    case "sudo hire-me":
      return {
        kind: "success",
        lines: ["Permission granted. Hiring recommended."],
      };
    default:
      return {
        kind: "error",
        lines: [`command not found: ${command}`, "Type 'help' to list available commands."],
      };
  }
}

export default function Terminal() {
  const openWindow = useWindowStore((state) => state.openWindow);
  const [history, setHistory] = useState<Entry[]>([]);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [input, setInput] = useState("");
  const [cursorVisible, setCursorVisible] = useState(true);
  const [isBooting, setIsBooting] = useState(true);

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const queueRef = useRef<Promise<void>>(Promise.resolve());
  const streamTokenRef = useRef(0);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;
      streamTokenRef.current += 1;
    };
  }, []);

  useEffect(() => {
    const id = window.setInterval(() => setCursorVisible((v) => !v), 500);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [history]);

  const resetTypingQueue = () => {
    streamTokenRef.current += 1;
    queueRef.current = Promise.resolve();
  };

  const appendCommandHistory = (raw: string) => {
    setCommandHistory((prev) => [...prev, raw]);
    setHistoryIndex(-1);
  };

  const typeLine = (kind: EntryKind, text: string, token: number, speed = TYPE_SPEED_MS): Promise<void> =>
    new Promise((resolve) => {
      if (!mountedRef.current || streamTokenRef.current !== token) {
        resolve();
        return;
      }

      const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
      setHistory((prev) => [...prev, { id, kind, text: "" }]);

      let index = 0;
      const step = () => {
        if (!mountedRef.current || streamTokenRef.current !== token) {
          resolve();
          return;
        }

        index += 1;
        setHistory((prev) =>
          prev.map((entry) => (entry.id === id ? { ...entry, text: text.slice(0, index) } : entry)),
        );

        if (index < text.length) {
          window.setTimeout(step, speed);
        } else {
          resolve();
        }
      };

      if (!text.length) {
        resolve();
        return;
      }

      window.setTimeout(step, speed);
    });

  const enqueueTypedLines = (kind: EntryKind, lines: string[]) => {
    const token = streamTokenRef.current;
    lines.forEach((line) => {
      queueRef.current = queueRef.current.then(() => typeLine(kind, line, token));
    });
  };

  useEffect(() => {
    resetTypingQueue();

    const token = streamTokenRef.current;
    const bootLines = [
      "DevOS Booting...",
      "Loading modules...",
      "Initializing system...",
      "Ready.",
    ];

    bootLines.forEach((line) => {
      queueRef.current = queueRef.current.then(() => typeLine("success", line, token, 22));
    });

    queueRef.current = queueRef.current.then(() => {
      if (!mountedRef.current || streamTokenRef.current !== token) {
        return;
      }

      setIsBooting(false);
      window.setTimeout(() => inputRef.current?.focus(), 60);
    });
  }, []);

  const normalizedInput = input.trim().toLowerCase();
  const commandSuggestions = useMemo(() => {
    if (!normalizedInput) {
      return [...DEFAULT_SUGGESTIONS];
    }

    const matches = KNOWN_COMMANDS
      .filter((candidate) => candidate.startsWith(normalizedInput) && candidate !== normalizedInput)
      .slice(0, 3);

    return matches.length ? matches : [...DEFAULT_SUGGESTIONS];
  }, [normalizedInput]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (isBooting) {
      return;
    }

    const raw = input.trim();
    if (!raw) {
      return;
    }

    const command = raw.toLowerCase().replace(/\s+/g, " ");
    const commandEntry: Entry = {
      id: `${Date.now()}-cmd`,
      kind: "command",
      text: raw,
    };

    if (command === "clear") {
      appendCommandHistory(raw);
      resetTypingQueue();
      setHistory([]);
      setInput("");
      return;
    }

    appendCommandHistory(raw);
    setHistory((prev) => [...prev, commandEntry]);

    if (command === "resume") {
      window.open("/tanuj_resume.pdf", "_blank", "noopener,noreferrer");
      enqueueTypedLines("success", ["Opening resume..."]);
      setInput("");
      return;
    }

    if (command === "github") {
      window.open("https://github.com/tanujpalasani", "_blank", "noopener,noreferrer");
      enqueueTypedLines("success", ["Opening GitHub profile..."]);
      setInput("");
      return;
    }

    if (command === "linkedin") {
      window.open("https://linkedin.com/in/tanujpalasani", "_blank", "noopener,noreferrer");
      enqueueTypedLines("success", ["Opening LinkedIn profile..."]);
      setInput("");
      return;
    }

    if (command === "sudo hire-me") {
      openWindow("contact", "Contact");
      enqueueTypedLines("success", ["Access granted.", "Opening contact portal..."]);
      setInput("");
      return;
    }

    const response = getResponse(command);
    enqueueTypedLines(response.kind, response.lines);
    setInput("");
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Tab") {
      const match = KNOWN_COMMANDS.find(
        (candidate) => candidate.startsWith(normalizedInput) && candidate !== normalizedInput,
      );

      if (match) {
        event.preventDefault();
        setInput(match);
        return;
      }
    }

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

      if (historyIndex === commandHistory.length - 1) {
        setHistoryIndex(-1);
        setInput("");
        return;
      }

      const nextIndex = historyIndex + 1;
      setHistoryIndex(nextIndex);
      setInput(commandHistory[nextIndex]);
    }
  };

  const promptLine = useMemo(
    () => (
      <span className="select-none">
        <span className="text-emerald-300 drop-shadow-[0_0_6px_rgba(74,222,128,0.7)]">{"\u279C"}</span>{" "}
        <span className="text-cyan-300">devos</span> <span className="text-slate-400">~</span>{" "}
        <span className="text-slate-200">%</span>
      </span>
    ),
    [],
  );

  return (
    <div
      className="mx-auto flex h-[320px] w-full max-w-3xl flex-col overflow-hidden rounded-xl border border-green-500/10 bg-black/80 font-mono text-[13px] leading-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] shadow-inner"
      onClick={() => inputRef.current?.focus()}
    >
      <div className="border-b border-green-500/10 bg-black/40 px-3 py-2 text-[11px] tracking-wide text-emerald-300/80">
        terminal session
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-3 py-3">
        {history.map((entry) => (
          <div key={entry.id} className={`break-words ${entry.kind === "command" ? "mt-2 first:mt-0" : "mt-0.5"}`}>
            {entry.kind === "command" ? (
              <div className="text-cyan-400">
                {promptLine} <span className="text-cyan-300">{entry.text}</span>
              </div>
            ) : entry.kind === "error" ? (
              <div className="text-red-400">{entry.text}</div>
            ) : entry.kind === "success" ? (
              <div className="text-green-400">{entry.text}</div>
            ) : (
              <div className="text-white/80">{entry.text}</div>
            )}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="border-t border-green-500/10 px-3 py-2">
        <label className="flex items-center gap-2">
          {promptLine}
          <input
            ref={inputRef}
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={handleKeyDown}
            autoComplete="off"
            spellCheck={false}
            disabled={isBooting}
            className="w-full bg-transparent text-white/90 outline-none disabled:cursor-not-allowed disabled:opacity-60"
            aria-label="Terminal command input"
          />
          <span
            className={`inline-block h-4 w-2 align-middle rounded-[1px] bg-emerald-300/90 transition-opacity duration-100 ${
              cursorVisible ? "opacity-100" : "opacity-0"
            }`}
          />
        </label>
        <div className="mt-1 text-[10px] text-slate-400/90">
          <p>Suggestions:</p>
          {commandSuggestions.map((suggestion) => (
            <p key={suggestion} className="text-slate-300/80">
              {"\u2192"} {suggestion}
            </p>
          ))}
        </div>
      </form>
    </div>
  );
}
