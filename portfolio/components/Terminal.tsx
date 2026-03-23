"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Entry = {
  id: string;
  kind: "command" | "output" | "error";
  text: string;
};

type CommandResponse = {
  kind: "output" | "error";
  lines: string[];
};

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
        kind: "output",
        lines: ["Hey there. Thanks for exploring my DevOS terminal."],
      };
    case "sudo hire-me":
      return {
        kind: "output",
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
  const [history, setHistory] = useState<Entry[]>([
    { id: "boot-1", kind: "output", text: "DevOS Terminal v1.0.0" },
    { id: "boot-2", kind: "output", text: "Type 'help' to see available commands." },
  ]);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [input, setInput] = useState("");
  const [cursorVisible, setCursorVisible] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const id = window.setInterval(() => setCursorVisible((v) => !v), 500);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);

  const appendCommandHistory = (raw: string) => {
    setCommandHistory((prev) => [...prev, raw]);
    setHistoryIndex(-1);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

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
      setHistory([]);
      setInput("");
      return;
    }

    if (command === "resume") {
      window.open("/tanuj_resume.pdf", "_blank", "noopener,noreferrer");
      appendCommandHistory(raw);
      setHistory((prev) => [
        ...prev,
        commandEntry,
        { id: `${Date.now()}-resume`, kind: "output", text: "Opening resume..." },
      ]);
      setInput("");
      return;
    }

    if (command === "github") {
      window.open("https://github.com/tanujpalasani", "_blank", "noopener,noreferrer");
      appendCommandHistory(raw);
      setHistory((prev) => [
        ...prev,
        commandEntry,
        { id: `${Date.now()}-github`, kind: "output", text: "Opening GitHub profile..." },
      ]);
      setInput("");
      return;
    }

    if (command === "linkedin") {
      window.open("https://linkedin.com/in/tanujpalasani", "_blank", "noopener,noreferrer");
      appendCommandHistory(raw);
      setHistory((prev) => [
        ...prev,
        commandEntry,
        { id: `${Date.now()}-linkedin`, kind: "output", text: "Opening LinkedIn profile..." },
      ]);
      setInput("");
      return;
    }

    const response = getResponse(command);
    const outputEntries: Entry[] = response.lines.map((text, idx) => ({
      id: `${Date.now()}-out-${idx}`,
      kind: response.kind,
      text,
    }));

    appendCommandHistory(raw);
    setHistory((prev) => [...prev, commandEntry, ...outputEntries]);
    setInput("");
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
        <span className="text-emerald-300">$</span> <span className="text-slate-300">devos</span> &gt;
      </span>
    ),
    [],
  );

  return (
    <div
      className="flex h-[320px] flex-col overflow-hidden rounded-xl border border-emerald-300/15 bg-[#05070b] font-mono text-[12px] leading-5 text-emerald-200/90 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
      onClick={() => inputRef.current?.focus()}
    >
      <div className="border-b border-emerald-300/10 bg-black/30 px-3 py-2 text-[11px] tracking-wide text-emerald-300/80">
        terminal session
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-3 py-3">
        {history.map((entry) => (
          <div key={entry.id} className={`break-words ${entry.kind === "command" ? "mt-2 first:mt-0" : "mt-0.5"}`}>
            {entry.kind === "command" ? (
              <div className="text-emerald-200">
                {promptLine} <span className="text-slate-100">{entry.text}</span>
              </div>
            ) : entry.kind === "error" ? (
              <div className="text-rose-300/95">{entry.text}</div>
            ) : (
              <div className="text-emerald-300/90">{entry.text}</div>
            )}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="border-t border-emerald-300/10 px-3 py-2">
        <label className="flex items-center gap-2">
          {promptLine}
          <input
            ref={inputRef}
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={handleKeyDown}
            autoComplete="off"
            spellCheck={false}
            className="w-full bg-transparent text-slate-100 outline-none"
            aria-label="Terminal command input"
          />
          <span className={`w-2 text-slate-100/90 ${cursorVisible ? "opacity-100" : "opacity-0"}`}>_</span>
        </label>
      </form>
    </div>
  );
}
