"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

import BootScreen from "@/components/BootScreen";
import DesktopBackground from "@/components/DesktopBackground";
import Desktop from "@/components/Desktop";
import Dock from "@/components/Dock";
import StartScreen from "@/components/StartScreen";
import WindowManager from "@/components/WindowManager";

export default function Home() {
  const [screen, setScreen] = useState<"start" | "booting" | "desktop">("start");

  return (
    <main className="relative h-screen w-screen overflow-hidden text-white">
      <AnimatePresence mode="wait" initial={false}>
        {screen === "start" ? (
          <motion.div
            key="start-screen"
            initial={{ opacity: 0.6 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="absolute inset-0"
          >
            <StartScreen onStart={() => setScreen("booting")} />
          </motion.div>
        ) : screen === "booting" ? (
          <motion.div
            key="boot-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <BootScreen onComplete={() => setScreen("desktop")} />
          </motion.div>
        ) : (
          <motion.div
            key="desktop-shell"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.55, ease: "easeOut" }}
            className="absolute inset-0"
          >
            <DesktopBackground />
            <Desktop />
            <WindowManager />
            <Dock />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
