"use client";

import { motion, useMotionValue } from "framer-motion";
import { useState } from "react";

import DockIcon from "./DockIcon";
import { devOSApps } from "./devos-apps";
import { useWindowStore } from "@/store/useWindowStore";

export default function Dock() {
  const openWindow = useWindowStore((state) => state.openWindow);
  const mouseX = useMotionValue(Number.POSITIVE_INFINITY);
  const [isDockHovered, setIsDockHovered] = useState(false);

  return (
    <footer className="pointer-events-auto absolute inset-x-0 bottom-5 z-40 flex justify-center px-4 sm:bottom-8">
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 28, delay: 0.1 }}
        className="relative"
      >
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
          className="relative flex items-end gap-3 rounded-[2rem] border border-white/22 bg-white/[0.08] px-4 py-3 shadow-dock backdrop-blur-2xl"
          onMouseEnter={() => setIsDockHovered(true)}
          onMouseMove={(event) => mouseX.set(event.clientX)}
          onMouseLeave={() => {
            setIsDockHovered(false);
            mouseX.set(Number.POSITIVE_INFINITY);
          }}
          whileHover={{ borderColor: "rgba(255, 255, 255, 0.28)", transition: { duration: 0.3 } }}
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
            {devOSApps.map((app) => (
              <DockIcon
                key={app.id}
                id={app.id}
                label={app.label}
                Icon={app.icon}
                accentClass={app.accentClass}
                mouseX={mouseX}
                onOpen={openWindow}
              />
            ))}
          </div>
        </motion.div>
      </motion.div>
    </footer>
  );
}
