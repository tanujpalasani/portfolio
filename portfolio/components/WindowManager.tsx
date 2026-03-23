"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Download } from "lucide-react";

import AboutWindow from "./AboutWindow";
import AchievementsWindow from "./AchievementsWindow";
import CertificatesWindow from "./CertificatesWindow";
import ContactWindow from "./ContactWindow";
import EducationWindow from "./EducationWindow";
import GitHubWindow from "./GitHubWindow";
import LinkedInWindow from "./LinkedInWindow";
import ProjectsWindow from "./ProjectsWindow";
import SkillsWindow from "./SkillsWindow";
import TerminalWindow from "./TerminalWindow";
import Window from "./Window";
import { portfolio } from "@/data/portfolio";
import { useWindowStore, type WindowId } from "@/store/useWindowStore";

const windowBodyById: Record<WindowId, React.ReactNode> = {
  about: (
    <AboutWindow />
  ),
  education: (
    <EducationWindow />
  ),
  certificates: (
    <CertificatesWindow />
  ),
  projects: (
    <ProjectsWindow />
  ),
  skills: (
    <SkillsWindow />
  ),
  resume: (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="space-y-4"
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <h3 className="text-lg font-semibold text-white">Resume</h3>
          <p className="text-xs text-slate-300/70">{portfolio.personal.name} - Latest PDF</p>
        </div>
        <motion.a
          href={portfolio.personal.resumePath}
          download
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          className="group inline-flex items-center gap-2 rounded-xl border border-cyan-300/30 bg-gradient-to-br from-cyan-400/15 to-blue-500/10 px-4 py-2.5 text-xs font-semibold text-cyan-100 shadow-[inset_0_1px_0_rgba(147,197,253,0.2),0_4px_12px_rgba(34,211,238,0.2)] transition-all hover:border-cyan-300/40 hover:from-cyan-400/20 hover:to-blue-500/15 hover:shadow-[inset_0_1px_0_rgba(147,197,253,0.25),0_8px_20px_rgba(34,211,238,0.3)]"
        >
          <Download size={15} />
          <span>Download Resume</span>
        </motion.a>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1, duration: 0.4 }}
        className="overflow-hidden rounded-2xl border border-white/12 bg-black/40 shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_8px_24px_rgba(0,0,0,0.4)]"
      >
        <iframe
          src={`${portfolio.personal.resumePath}#view=FitH`}
          title={`${portfolio.personal.shortName} Resume`}
          className="h-[380px] w-full"
        />
      </motion.div>
    </motion.div>
  ),
  github: (
    <GitHubWindow />
  ),
  linkedin: (
    <LinkedInWindow />
  ),
  achievements: (
    <AchievementsWindow />
  ),
  contact: (
    <ContactWindow />
  ),
  terminal: (
    <TerminalWindow />
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
            {windowBodyById[windowItem.id]}
          </Window>
        ))}
      </AnimatePresence>
    </section>
  );
}
