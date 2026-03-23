"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { useState } from "react";
import type { WindowId } from "@/store/useWindowStore";

type DesktopIconProps = {
  id: WindowId;
  label: string;
  Icon: LucideIcon;
  accentClass: string;
  isActive: boolean;
  onOpen: (id: WindowId, title: string) => void;
};

export default function DesktopIcon({
  id,
  label,
  Icon,
  accentClass,
  isActive,
  onOpen,
}: DesktopIconProps) {
  const [rippleId, setRippleId] = useState(0);

  const handleClick = () => {
    setRippleId((prev) => prev + 1);
    onOpen(id, label);
  };

  return (
    <motion.button
      type="button"
      onClick={handleClick}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
      whileHover={{ scale: 1.05, y: -3, transition: { type: "spring", stiffness: 380, damping: 18 } }}
      whileTap={{ scale: 0.96, transition: { type: "spring", stiffness: 400, damping: 17 } }}
      className="group relative flex w-full flex-col items-center gap-2.5 overflow-hidden rounded-2xl p-2.5 text-center transition-colors duration-200 hover:bg-white/5"
    >
      <motion.span
        key={rippleId}
        initial={{ scale: 0, opacity: 0.35 }}
        animate={{ scale: 2.5, opacity: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="pointer-events-none absolute left-1/2 top-8 h-10 w-10 -translate-x-1/2 rounded-full bg-cyan-300/30 blur-sm"
      />

      <motion.span
        initial={{ opacity: 0, y: -4 }}
        className="pointer-events-none absolute -top-9 left-1/2 z-50 -translate-x-1/2 whitespace-nowrap rounded-lg border border-white/15 bg-black/80 px-3 py-1.5 text-[11px] font-medium tracking-wide text-white/95 opacity-0 shadow-lg backdrop-blur-xl transition-opacity duration-200 group-hover:opacity-100"
      >
        <span className="drop-shadow-sm">Open {label}</span>
        <span className="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 border-b border-r border-white/15 bg-black/80" />
      </motion.span>

      <motion.div
        className="relative"
        whileHover={{ filter: "brightness(1.16)", transition: { duration: 0.2 } }}
      >
        <motion.div
          className={`absolute inset-0 rounded-[18px] bg-gradient-to-br ${accentClass} blur-xl transition-opacity duration-300 ${isActive ? "opacity-75" : "opacity-0 group-hover:opacity-70"}`}
          initial={{ scale: 0.84 }}
          whileHover={{ scale: 1.2 }}
          transition={{ duration: 0.3 }}
        />

        <motion.span
          className={`relative flex h-16 w-16 items-center justify-center rounded-[18px] border bg-gradient-to-br ${accentClass} shadow-[0_8px_24px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.4)] transition-all duration-300 group-hover:shadow-[0_12px_32px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.5)] ${
            isActive
              ? "border-cyan-200/70 ring-2 ring-cyan-300/35"
              : "border-white/25 group-hover:border-white/40"
          }`}
          whileHover={{ scale: 1.05, transition: { type: "spring", stiffness: 400, damping: 17 } }}
        >
          <span className={`absolute inset-0 rounded-[18px] bg-white/10 transition-opacity duration-300 ${isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`} />

          <Icon
            size={32}
            className={`relative z-10 text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.3)] transition-all duration-200 ${
              isActive ? "brightness-110" : ""
            }`}
            strokeWidth={2.2}
          />
        </motion.span>
      </motion.div>

      <motion.span
        className={`text-xs font-semibold tracking-[0.02em] drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] transition-colors duration-200 ${
          isActive ? "text-cyan-100" : "text-white/85 group-hover:text-white"
        }`}
        style={{ textShadow: "0 1px 3px rgba(0,0,0,0.8)" }}
      >
        {label}
      </motion.span>
    </motion.button>
  );
}
