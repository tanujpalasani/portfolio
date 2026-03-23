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
      whileHover={{ scale: 1.06, y: -2 }}
      whileTap={{ scale: 0.96 }}
      transition={{ type: "spring", stiffness: 320, damping: 22 }}
      className="group flex w-24 flex-col items-center gap-2 rounded-2xl p-2 text-center"
    >
      <span
        className={`flex h-14 w-14 items-center justify-center rounded-2xl border border-white/20 bg-gradient-to-br ${accentClass} shadow-lg shadow-black/35 transition duration-300 group-hover:shadow-iconGlow`}
      >
        <Icon size={28} className="text-white" strokeWidth={2.2} />
      </span>
      <span className="text-xs font-medium tracking-wide text-white/90">{label}</span>
    </motion.button>
  );
}
