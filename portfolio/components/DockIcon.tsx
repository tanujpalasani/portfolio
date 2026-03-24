"use client";

import { motion, useSpring, useTransform, type MotionValue } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { useRef, useState } from "react";
import type { WindowId } from "@/store/useWindowStore";

type DockIconProps = {
  id: WindowId;
  label: string;
  Icon: LucideIcon;
  accentClass: string;
  isActive: boolean;
  mouseX: MotionValue<number>;
  onOpen: (id: WindowId, title: string) => void;
};

export default function DockIcon({
  id,
  label,
  Icon,
  accentClass,
  isActive,
  mouseX,
  onOpen,
}: DockIconProps) {
  const iconRef = useRef<HTMLButtonElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const distance = useTransform(mouseX, (value) => {
    if (!Number.isFinite(value)) {
      return 300;
    }

    const bounds = iconRef.current?.getBoundingClientRect();
    if (!bounds) {
      return 300;
    }

    return Math.abs(value - (bounds.left + bounds.width / 2));
  });

  const rawScale = useTransform(distance, [0, 80, 170], [1.62, 1.26, 1]);
  const rawY = useTransform(distance, [0, 80, 170], [-17, -8, 0]);

  const scale = useSpring(rawScale, { stiffness: 340, damping: 28, mass: 0.5 });
  const y = useSpring(rawY, { stiffness: 340, damping: 28, mass: 0.5 });

  const handleClick = () => {
    onOpen(id, label);
  };

  return (
    <motion.button
      ref={iconRef}
      type="button"
      onClick={handleClick}
      aria-label={label}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      style={{ scale, y }}
      whileTap={{ scale: 0.9 }}
      transition={{ type: "spring", stiffness: 420, damping: 22 }}
      className="group relative flex h-14 w-14 transform-gpu items-center justify-center will-change-transform"
    >
      <motion.span
        className="pointer-events-none absolute -bottom-2 left-1/2 h-3.5 w-8 -translate-x-1/2 rounded-full bg-cyan-300/70 blur-[8px]"
        animate={{
          opacity: isActive ? [0.65, 1, 0.65] : isHovered ? 0.6 : 0,
          scale: isActive ? [0.9, 1.15, 0.9] : isHovered ? 1 : 0.7,
        }}
        transition={{ duration: 1.8, repeat: isActive ? Infinity : 0, ease: "easeInOut" }}
      />

      <motion.span
        className={`absolute inset-0 rounded-[20px] bg-gradient-to-br ${accentClass} blur-xl`}
        animate={{
          opacity: isActive ? 0.82 : isHovered ? 0.72 : 0.28,
          scale: isActive ? 1.4 : isHovered ? 1.32 : 1.02,
        }}
        transition={{ duration: 0.3 }}
      />

      <motion.span
        className={`absolute inset-0 rounded-[20px] border bg-gradient-to-br ${accentClass}`}
        animate={{
          borderColor: isActive
            ? "rgba(186, 230, 253, 0.75)"
            : isHovered
              ? "rgba(255, 255, 255, 0.38)"
              : "rgba(255, 255, 255, 0.24)",
          boxShadow: isActive
            ? "0 16px 36px rgba(0, 0, 0, 0.55), 0 0 22px rgba(56,189,248,0.5), inset 0 1px 0 rgba(255, 255, 255, 0.5)"
            : isHovered
            ? "0 14px 34px rgba(0, 0, 0, 0.52), inset 0 1px 0 rgba(255, 255, 255, 0.42)"
            : "0 8px 20px rgba(0, 0, 0, 0.42), inset 0 1px 0 rgba(255, 255, 255, 0.35)",
        }}
        transition={{ duration: 0.25 }}
      />

      <motion.span
        className="absolute inset-0 rounded-[20px]"
        animate={{
          background: isHovered
            ? "linear-gradient(135deg, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0.06) 100%)"
            : "rgba(255,255,255,0)",
        }}
        transition={{ duration: 0.25 }}
      />

      <Icon
        size={26}
        className="relative z-10 text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.4)]"
        strokeWidth={2.3}
      />

      <motion.span
        initial={{ opacity: 0, y: -2 }}
        animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : -2 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="pointer-events-none absolute -bottom-10 left-1/2 z-50 -translate-x-1/2 whitespace-nowrap rounded-lg border border-white/15 bg-black/85 px-3 py-1.5 text-[11px] font-medium tracking-wide text-white/95 shadow-lg backdrop-blur-xl"
      >
        <span className="drop-shadow-sm">{label}</span>
        <span className="absolute -top-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 border-l border-t border-white/15 bg-black/85" />
      </motion.span>

      <motion.span
        className="absolute -bottom-1 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-cyan-100"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: isActive ? 1 : isHovered ? 0.85 : 0, opacity: isActive ? 1 : isHovered ? 0.82 : 0 }}
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
      />
    </motion.button>
  );
}
