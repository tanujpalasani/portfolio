"use client";

import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";

type ProjectCardProps = {
  name: string;
  description: string;
  techStack: string[];
  href: string;
};

export default function ProjectCard({ name, description, techStack, href }: ProjectCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{
        y: -6,
        transition: { type: "spring", stiffness: 400, damping: 20 }
      }}
      className="group relative flex h-full min-h-[190px] flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_8px_24px_rgba(0,0,0,0.3)] transition-all duration-300 hover:border-white/20 hover:bg-white/[0.05] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_16px_40px_rgba(0,0,0,0.4),0_0_0_1px_rgba(255,255,255,0.05)]"
    >
      {/* Gradient glow on hover */}
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(600px circle at var(--mouse-x) var(--mouse-y), rgba(34, 211, 238, 0.06), transparent 40%)",
        }}
      />

      {/* Shimmer effect */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl">
        <motion.div
          initial={{ x: "-100%" }}
          whileHover={{ x: "100%" }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.04] to-transparent"
        />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-1 flex-col">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <h3 className="flex-1 text-[15px] font-semibold leading-snug text-white">{name}</h3>
          <motion.a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="group/link flex shrink-0 items-center gap-1.5 rounded-lg border border-cyan-300/25 bg-cyan-400/10 px-2.5 py-1.5 text-[11px] font-semibold text-cyan-100 shadow-[0_2px_8px_rgba(34,211,238,0.15)] transition-all duration-200 hover:border-cyan-300/40 hover:bg-cyan-400/20 hover:shadow-[0_4px_12px_rgba(34,211,238,0.25)]"
          >
            <span>View</span>
            <ExternalLink size={11} className="transition-transform group-hover/link:translate-x-0.5" />
          </motion.a>
        </div>

        {/* Description */}
        <p className="mt-3 flex-1 text-[13px] leading-relaxed text-slate-200/80">{description}</p>

        {/* Tech Stack */}
        <div className="mt-4 pt-3 border-t border-white/[0.06]">
          <div className="flex flex-wrap gap-2">
            {techStack.map((tech, index) => (
              <motion.span
                key={tech}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.03, duration: 0.3 }}
                whileHover={{
                  scale: 1.05,
                  backgroundColor: "rgba(255, 255, 255, 0.08)",
                  transition: { duration: 0.2 }
                }}
                className="rounded-md border border-white/12 bg-white/[0.04] px-2.5 py-1 text-[11px] font-medium tracking-wide text-slate-200/90 shadow-sm transition-colors"
              >
                {tech}
              </motion.span>
            ))}
          </div>
        </div>
      </div>

      {/* Corner accent */}
      <div className="pointer-events-none absolute right-0 top-0 h-20 w-20 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
        <div className="absolute right-0 top-0 h-full w-full bg-gradient-to-br from-cyan-400/10 to-transparent blur-2xl" />
      </div>
    </motion.article>
  );
}
