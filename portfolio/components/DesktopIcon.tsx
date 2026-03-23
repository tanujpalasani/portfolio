"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import type { WindowId } from "@/store/useWindowStore";

type DesktopIconProps = {
  id: WindowId;
  label: string;
  Icon: LucideIcon;
  accentClass: string;
  onOpen: (id: WindowId, title: string) => void;
};

export default function DesktopIcon({
  id,
  label,
  Icon,
  accentClass,
  onOpen,
}: DesktopIconProps) {
  const handleClick = () => {
    onOpen(id, label);
  };

  return (
    <motion.button
      type="button"
      onClick={handleClick}
      whileHover={{ scale: 1.1, y: -3 }}
      whileTap={{ scale: 0.96 }}
      transition={{ type: "spring", stiffness: 320, damping: 22 }}
      className="group relative flex w-24 flex-col items-center gap-2 rounded-2xl p-2 text-center"
    >
      <span className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md border border-white/10 bg-black/70 px-2 py-1 text-[10px] tracking-wide text-white/90 opacity-0 backdrop-blur-sm transition duration-200 group-hover:opacity-100">
        Open {label}
      </span>
      <span
        className={`flex h-14 w-14 items-center justify-center rounded-2xl border border-white/20 bg-gradient-to-br ${accentClass} shadow-lg shadow-black/35 transition duration-300 group-hover:scale-110 group-hover:shadow-[0_0_25px_rgba(0,255,255,0.3)]`}
      >
        <Icon size={28} className="text-white" strokeWidth={2.2} />
      </span>
      <span className="text-xs font-semibold tracking-[0.06em] text-white/70">{label}</span>
    </motion.button>
  );
}
