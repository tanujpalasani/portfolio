"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import type { WindowId } from "@/store/useWindowStore";

type DockIconProps = {
  id: WindowId;
  label: string;
  Icon: LucideIcon;
  accentClass: string;
  scale: number;
  offsetY: number;
  isHovered: boolean;
  onHoverStart: () => void;
  onHoverEnd: () => void;
  onOpen: (id: WindowId, title: string) => void;
};

export default function DockIcon({
  id,
  label,
  Icon,
  accentClass,
  scale,
  offsetY,
  isHovered,
  onHoverStart,
  onHoverEnd,
  onOpen,
}: DockIconProps) {
  const handleClick = () => {
    onOpen(id, label);
  };

  return (
    <motion.button
      type="button"
      onClick={handleClick}
      aria-label={label}
      onHoverStart={onHoverStart}
      onHoverEnd={onHoverEnd}
      animate={{
        scale,
        y: offsetY,
      }}
      whileTap={{ scale: Math.max(0.9, scale - 0.2) }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="group relative flex h-14 w-14 items-center justify-center rounded-2xl"
    >
      <span
        className={`absolute inset-0 rounded-2xl border border-white/20 bg-gradient-to-br ${accentClass} transition duration-300 ${
          isHovered
            ? "shadow-[0_10px_25px_rgba(34,211,238,0.3)]"
            : "shadow-md shadow-black/30"
        }`}
      />
      <Icon size={24} className="relative z-10 text-white" strokeWidth={2.3} />
      <span
        className={`pointer-events-none absolute -bottom-6 left-1/2 -translate-x-1/2 rounded-md bg-black/70 px-2 py-1 text-[10px] tracking-wide text-white backdrop-blur-sm transition ${
          isHovered ? "opacity-100" : "opacity-0"
        }`}
      >
        {label}
      </span>
    </motion.button>
  );
}
