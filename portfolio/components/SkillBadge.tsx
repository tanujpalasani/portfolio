"use client";

import { motion } from "framer-motion";

type SkillBadgeProps = {
  label: string;
};

export default function SkillBadge({ label }: SkillBadgeProps) {
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{
        scale: 1.05,
        y: -2,
        backgroundColor: "rgba(255, 255, 255, 0.08)",
        borderColor: "rgba(255, 255, 255, 0.22)",
        boxShadow: "0 4px 12px rgba(34, 211, 238, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
        transition: { type: "spring", stiffness: 400, damping: 17 }
      }}
      whileTap={{
        scale: 0.98,
        transition: { duration: 0.1 }
      }}
      className="inline-block cursor-default rounded-lg border border-white/12 bg-white/[0.045] px-3 py-1.5 text-xs font-medium text-slate-100/90 shadow-[inset_0_1px_0_rgba(255,255,255,0.04),0_2px_8px_rgba(0,0,0,0.2)] transition-colors"
    >
      {label}
    </motion.span>
  );
}
