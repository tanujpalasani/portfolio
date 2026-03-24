"use client";

import { AnimatePresence, motion, useMotionValue } from "framer-motion";
import { useMemo, useState } from "react";

import DockIcon from "./DockIcon";
import { tanuOSApps } from "./tanuos-apps";
import { useWindowStore } from "@/store/useWindowStore";

export default function Dock() {
  const openWindow = useWindowStore((state) => state.openWindow);
  const windows = useWindowStore((state) => state.windows);
  const recentApps = useWindowStore((state) => state.recentApps);
  const activeWindowId = useWindowStore((state) => state.activeWindowId);
  const mouseX = useMotionValue(Number.POSITIVE_INFINITY);
  const [isDockHovered, setIsDockHovered] = useState(false);

  const appById = useMemo(
    () => new Map(tanuOSApps.map((app) => [app.id, app])),
    [],
  );

  const dockApps = useMemo(
    () =>
      recentApps
        .map((recentApp) => {
          const app = appById.get(recentApp.id);
          if (!app) {
            return null;
          }

          return {
            ...app,
            label: recentApp.name,
          };
        })
        .filter((app): app is NonNullable<typeof app> => app !== null),
    [appById, recentApps],
  );

  const isDockIconActive = (id: (typeof tanuOSApps)[number]["id"]) =>
    windows.some((windowItem) => windowItem.id === id && !windowItem.isMinimized && !windowItem.isClosing);

  return (
    <footer className="pointer-events-auto absolute inset-x-0 bottom-5 z-40 flex justify-center px-4 sm:bottom-8">
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 28, delay: 0.1 }}
        className="relative"
      >
        <motion.div
          className="pointer-events-none absolute left-1/2 top-[80%] h-28 w-[120%] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(56,189,248,0.3)_0%,rgba(59,130,246,0.12)_38%,transparent_74%)] blur-3xl"
          animate={{ opacity: isDockHovered ? 0.95 : 0.58, scale: isDockHovered ? 1.1 : 1 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />

        <motion.div
          className="pointer-events-none absolute left-1/2 top-full h-14 w-[92%] -translate-x-1/2 rounded-full bg-gradient-to-r from-cyan-400/35 via-blue-400/30 to-violet-400/30 blur-2xl"
          animate={{ opacity: isDockHovered ? 0.88 : 0.46, scaleX: isDockHovered ? 1.08 : 1 }}
          transition={{ duration: 0.4 }}
        />

        <motion.div
          className="absolute inset-0 rounded-[2rem] bg-gradient-to-t from-cyan-400/24 via-blue-400/16 to-transparent blur-2xl"
          animate={{ opacity: isDockHovered ? 0.95 : 0.38 }}
          transition={{ duration: 0.35 }}
        />

        <motion.div
          className="relative flex items-end gap-3 rounded-[2rem] border border-cyan-100/25 bg-white/[0.07] px-4 py-3 shadow-[0_26px_70px_rgba(2,6,23,0.5),inset_0_1px_0_rgba(255,255,255,0.3)] backdrop-blur-2xl"
          onMouseEnter={() => setIsDockHovered(true)}
          onMouseMove={(event) => mouseX.set(event.clientX)}
          onMouseLeave={() => {
            setIsDockHovered(false);
            mouseX.set(Number.POSITIVE_INFINITY);
          }}
          whileHover={{
            borderColor: "rgba(186,230,253,0.5)",
            boxShadow: "0 30px 78px rgba(2,6,23,0.55), inset 0 1px 0 rgba(255,255,255,0.35)",
            transition: { duration: 0.35 },
          }}
        >
          <div className="pointer-events-none absolute inset-x-3 -top-2 h-4 rounded-full bg-gradient-to-b from-white/20 to-transparent blur-[1px]" />

          <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[2rem]">
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent"
              animate={{ x: ["-100%", "200%"] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear", repeatDelay: 2 }}
            />
          </div>

          <div
            className="pointer-events-none absolute inset-0 rounded-[2rem] opacity-30 mix-blend-soft-light"
            style={{
              backgroundImage: "radial-gradient(rgba(255, 255, 255, 0.1) 0.5px, transparent 0.5px)",
              backgroundSize: "3px 3px",
            }}
          />

          <div className="relative z-10 flex items-end gap-3">
            <AnimatePresence initial={false} mode="popLayout">
              {dockApps.map((app, index) => (
                <motion.div
                  key={app.id}
                  layout
                  initial={{ opacity: 0, y: 14, scale: 0.88 }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    scale: index === 0 ? 1.06 : 1,
                  }}
                  exit={{ opacity: 0, y: 10, scale: 0.9 }}
                  transition={{
                    layout: { type: "spring", stiffness: 340, damping: 26 },
                    opacity: { duration: 0.22 },
                    y: { type: "spring", stiffness: 360, damping: 24 },
                    scale: { type: "spring", stiffness: 360, damping: 24 },
                  }}
                >
                  <DockIcon
                    id={app.id}
                    label={app.label}
                    Icon={app.icon}
                    accentClass={app.accentClass}
                    isActive={isDockIconActive(app.id) || activeWindowId === app.id}
                    mouseX={mouseX}
                    onOpen={openWindow}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>
    </footer>
  );
}
