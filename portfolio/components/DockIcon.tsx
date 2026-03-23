"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import type { WindowId } from "@/store/useWindowStore";

type DockIconProps = {
  id: WindowId;
  label: string;
  Icon: LucideIcon;
  accentClass: string;
  onOpen: (id: WindowId, title: string) => void;
};

export default function DockIcon({
  id,
  label,
  Icon,
  accentClass,
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
      whileHover={{ scale: 1.22, y: -10 }}
      whileTap={{ scale: 0.96 }}
      transition={{ type: "spring", stiffness: 350, damping: 20 }}
      className="group relative flex h-14 w-14 items-center justify-center rounded-2xl"
    >
      <span
        className={`absolute inset-0 rounded-2xl border border-white/20 bg-gradient-to-br ${accentClass} shadow-md shadow-black/30 transition duration-300 group-hover:shadow-iconGlow`}
      />
      <Icon size={24} className="relative z-10 text-white" strokeWidth={2.3} />
      <span className="pointer-events-none absolute -bottom-6 left-1/2 -translate-x-1/2 rounded-md bg-black/70 px-2 py-1 text-[10px] tracking-wide text-white opacity-0 backdrop-blur-sm transition group-hover:opacity-100">
        {label}
      </span>
    </motion.button>
  );
}
