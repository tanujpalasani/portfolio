"use client";

import { AnimatePresence } from "framer-motion";
import { Github, Linkedin, Mail, Phone } from "lucide-react";

import ProjectCard from "./ProjectCard";
import SkillBadge from "./SkillBadge";
import Terminal from "./Terminal";
import Window from "./Window";
import { useWindowStore, type WindowId } from "@/store/useWindowStore";

const windowBodyById: Record<WindowId, React.ReactNode> = {
  about: (
    <div className="space-y-5">
      <div className="space-y-1.5">
        <h3 className="text-2xl font-semibold text-white">Palasani Sai Venkata Tanuj</h3>
        <p className="text-sm font-medium text-slate-200/90">
          B.Tech CSE Student | Full-Stack & ML Developer
        </p>
      </div>

      <p className="max-w-2xl text-sm leading-6 text-slate-200/85">
        Computer Science undergraduate at Lovely Professional University (CGPA: 8.71) building practical software
        in full-stack web development and machine learning. I focus on clean architecture, reliable APIs,
        and insight-driven products.
      </p>

      <section className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-300/75">Resume highlights</p>
        <ul className="list-disc space-y-1.5 pl-5 text-sm text-slate-100/90">
          <li>Filed a patent for AI-based personalized chore scheduling (App No: 202511067786)</li>
          <li>Runner-up at Hack-a-Throne 1.0 Hackathon (GeeksforGeeks)</li>
          <li>Hands-on machine learning pipeline work across regression, clustering, and anomaly detection</li>
          <li>Strong soft skills: leadership, communication, critical thinking, time management, creativity</li>
        </ul>
      </section>
    </div>
  ),
  projects: (
    <div className="space-y-4">
      <div className="space-y-1">
        <h3 className="text-lg font-semibold text-white">Featured Projects</h3>
        <p className="text-xs text-slate-300/75">Selected builds with stack and source links.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <ProjectCard
          name="PlanIt - Project Management Platform (Feb 2026)"
          description="Full-stack MERN platform with role-based access control, JWT authentication, and responsive analytics dashboards powered by React Context API."
          techStack={["React.js", "Node.js", "Express.js", "MongoDB", "Tailwind CSS", "JWT"]}
          href="https://github.com/tanujpalasani"
        />
        <ProjectCard
          name="LMS Student Behavior Analytics Dashboard (Nov 2025)"
          description="Analytics app for LMS behavior segmentation using clustering with Elbow/Silhouette model selection and interactive Plotly dashboards."
          techStack={["Python", "Streamlit", "Scikit-learn", "Pandas", "NumPy", "Plotly"]}
          href="https://github.com/tanujpalasani"
        />
        <ProjectCard
          name="Vehicle Load Monitoring System (May 2025)"
          description="Vehicle monitoring system for overload prediction using regression and anomaly detection, with REST-style APIs and historical dashboards."
          techStack={["Python", "Flask", "Scikit-learn", "SQLite", "Chart.js", "Bootstrap"]}
          href="https://github.com/tanujpalasani"
        />
      </div>
    </div>
  ),
  skills: (
    <div className="space-y-5">
      <h3 className="text-lg font-semibold text-white">Skills</h3>

      <section className="space-y-2.5">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-300/75">Languages</p>
        <div className="flex flex-wrap gap-2">
          {["Python", "JavaScript", "C++"].map((skill) => (
            <SkillBadge key={skill} label={skill} />
          ))}
        </div>
      </section>

      <section className="space-y-2.5">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-300/75">Web Technologies</p>
        <div className="flex flex-wrap gap-2">
          {["React.js", "Next.js", "HTML", "CSS", "Tailwind CSS", "Node.js", "Express.js"].map((skill) => (
            <SkillBadge key={skill} label={skill} />
          ))}
        </div>
      </section>

      <section className="space-y-2.5">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-300/75">Database</p>
        <div className="flex flex-wrap gap-2">
          {["MongoDB", "MySQL"].map((skill) => (
            <SkillBadge key={skill} label={skill} />
          ))}
        </div>
      </section>

      <section className="space-y-2.5">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-300/75">Machine Learning</p>
        <div className="flex flex-wrap gap-2">
          {["Classification", "Regression", "Clustering", "NLP (Basics)", "Scikit-learn"].map((skill) => (
            <SkillBadge key={skill} label={skill} />
          ))}
        </div>
      </section>

      <section className="space-y-2.5">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-300/75">Tools & Platforms</p>
        <div className="flex flex-wrap gap-2">
          {["Git", "GitHub", "Postman", "VS Code", "Linux", "Streamlit", "Google Colab"].map((skill) => (
            <SkillBadge key={skill} label={skill} />
          ))}
        </div>
      </section>
    </div>
  ),
  contact: (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white">Contact</h3>
      <div className="space-y-2.5">
        <a
          href="mailto:tanujpalasani@gmail.com"
          className="flex items-center gap-3 rounded-lg border border-white/8 bg-white/[0.025] px-3 py-2.5 text-sm text-slate-100/90 transition hover:border-white/15 hover:bg-white/[0.045]"
        >
          <Mail size={16} />
          <span>tanujpalasani@gmail.com</span>
        </a>
        <a
          href="tel:+917981533673"
          className="flex items-center gap-3 rounded-lg border border-white/8 bg-white/[0.025] px-3 py-2.5 text-sm text-slate-100/90 transition hover:border-white/15 hover:bg-white/[0.045]"
        >
          <Phone size={16} />
          <span>+91-7981533673</span>
        </a>
        <a
          href="https://linkedin.com/in/tanujpalasani"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 rounded-lg border border-white/8 bg-white/[0.025] px-3 py-2.5 text-sm text-slate-100/90 transition hover:border-white/15 hover:bg-white/[0.045]"
        >
          <Linkedin size={16} />
          <span>linkedin.com/in/tanujpalasani</span>
        </a>
        <a
          href="https://github.com/tanujpalasani"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 rounded-lg border border-white/8 bg-white/[0.025] px-3 py-2.5 text-sm text-slate-100/90 transition hover:border-white/15 hover:bg-white/[0.045]"
        >
          <Github size={16} />
          <span>github.com/tanujpalasani</span>
        </a>
      </div>
    </div>
  ),
  terminal: (
    <Terminal />
  ),
};

export default function WindowManager() {
  const windows = useWindowStore((state) => state.windows);
  const activeWindowId = useWindowStore((state) => state.activeWindowId);
  const closeWindow = useWindowStore((state) => state.closeWindow);
  const minimizeWindow = useWindowStore((state) => state.minimizeWindow);
  const toggleMaximizeWindow = useWindowStore((state) => state.toggleMaximizeWindow);
  const focusWindow = useWindowStore((state) => state.focusWindow);

  return (
    <section className="pointer-events-none absolute inset-0 z-30">
      <AnimatePresence>
        {windows.filter((windowItem) => !windowItem.isMinimized).map((windowItem) => (
          <div key={windowItem.id} className="pointer-events-auto">
            <Window
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
              {windowBodyById[windowItem.id]}
            </Window>
          </div>
        ))}
      </AnimatePresence>
    </section>
  );
}
