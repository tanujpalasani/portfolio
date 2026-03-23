"use client";

import { motion } from "framer-motion";
import { useEffect, useRef } from "react";

export default function DesktopBackground() {
  const backgroundRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const midgroundRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const target = { x: 0, y: 0 };
    const current = { x: 0, y: 0 };
    let rafId = 0;

    const updateParallax = () => {
      current.x += (target.x - current.x) * 0.06;
      current.y += (target.y - current.y) * 0.06;

      if (backgroundRef.current) {
        backgroundRef.current.style.transform = `translate3d(${current.x * 8}px, ${current.y * 8}px, 0)`;
      }
      if (gridRef.current) {
        gridRef.current.style.transform = `translate3d(${current.x * 14}px, ${current.y * 14}px, 0)`;
      }
      if (midgroundRef.current) {
        midgroundRef.current.style.transform = `translate3d(${current.x * 18}px, ${current.y * 18}px, 0)`;
      }

      rafId = window.requestAnimationFrame(updateParallax);
    };

    const handleMove = (event: MouseEvent) => {
      const x = event.clientX / window.innerWidth - 0.5;
      const y = event.clientY / window.innerHeight - 0.5;
      target.x = x;
      target.y = y;
    };

    const resetTarget = () => {
      target.x = 0;
      target.y = 0;
    };

    window.addEventListener("mousemove", handleMove, { passive: true });
    window.addEventListener("mouseleave", resetTarget);
    rafId = window.requestAnimationFrame(updateParallax);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseleave", resetTarget);
      window.cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {/* Background layer */}
      <div ref={backgroundRef} className="absolute inset-[-4%] transform-gpu will-change-transform">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_92%,rgba(59,130,246,0.18)_0%,rgba(56,189,248,0.08)_18%,transparent_48%),linear-gradient(160deg,#020617_0%,#020617_60%,#0f172a_100%)]" />

        <motion.div
          className="absolute left-1/2 bottom-[-18rem] h-[42rem] w-[42rem] -translate-x-1/2 rounded-full blur-3xl"
          style={{
            background:
              "radial-gradient(circle, rgba(59,130,246,0.3) 0%, rgba(99,102,241,0.17) 40%, rgba(147,51,234,0.14) 58%, transparent 78%)",
          }}
          animate={{
            opacity: [0.34, 0.62, 0.34],
            scale: [1, 1.08, 1],
            filter: ["hue-rotate(0deg)", "hue-rotate(16deg)", "hue-rotate(0deg)"],
          }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        />

        <motion.div
          className="absolute -left-[45%] top-[10%] h-[18rem] w-[110rem] -rotate-[8deg]"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, rgba(56,189,248,0.14) 25%, rgba(99,102,241,0.09) 46%, transparent 72%)",
            filter: "blur(20px)",
          }}
          animate={{ x: ["-4%", "10%", "-4%"] }}
          transition={{ duration: 36, repeat: Infinity, ease: "easeInOut" }}
        />

        <motion.div
          className="absolute -right-[55%] bottom-[12%] h-[14rem] w-[120rem] rotate-[10deg]"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, rgba(168,85,247,0.12) 28%, rgba(59,130,246,0.08) 52%, transparent 78%)",
            filter: "blur(22px)",
          }}
          animate={{ x: ["6%", "-10%", "6%"] }}
          transition={{ duration: 42, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Grid layer */}
      <div ref={gridRef} className="absolute inset-[-4%] transform-gpu will-change-transform">
        <div
          className="absolute inset-0 opacity-[0.065]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px), radial-gradient(circle at 1px 1px, rgba(125,211,252,0.25) 0.7px, transparent 1px)",
            backgroundSize: "40px 40px, 40px 40px, 40px 40px",
          }}
        />
      </div>

      {/* Midground layer */}
      <div ref={midgroundRef} className="absolute inset-[-4%] transform-gpu will-change-transform">
        <div className="absolute left-[6%] top-[14%] h-px w-[22rem] bg-gradient-to-r from-cyan-300/0 via-cyan-200/15 to-cyan-300/0" />
        <div className="absolute left-[20%] top-[14%] h-20 w-px bg-gradient-to-b from-cyan-200/13 to-transparent" />
        <div className="absolute right-[8%] top-[22%] h-px w-[18rem] bg-gradient-to-r from-violet-300/0 via-violet-200/14 to-violet-300/0" />
        <div className="absolute right-[26%] top-[22%] h-16 w-px bg-gradient-to-b from-violet-200/13 to-transparent" />
        <div className="absolute left-[32%] bottom-[24%] h-px w-[30rem] bg-gradient-to-r from-sky-200/0 via-sky-200/13 to-sky-200/0" />
        <div className="absolute left-[48%] bottom-[24%] h-12 w-px bg-gradient-to-t from-sky-200/13 to-transparent" />
        <div className="absolute left-[12%] bottom-[34%] h-px w-[14rem] bg-gradient-to-r from-cyan-300/0 via-cyan-200/12 to-cyan-300/0" />
        <div className="absolute left-[18%] bottom-[34%] h-10 w-px bg-gradient-to-t from-cyan-200/12 to-transparent" />
        <div className="absolute right-[12%] bottom-[30%] h-px w-[12rem] bg-gradient-to-r from-fuchsia-300/0 via-fuchsia-200/12 to-fuchsia-300/0" />
        <div className="absolute right-[22%] bottom-[30%] h-8 w-px bg-gradient-to-t from-fuchsia-200/12 to-transparent" />
      </div>

      {/* Dock-side dual glow */}
      <motion.div
        className="absolute -left-40 bottom-[-14rem] h-[34rem] w-[34rem] rounded-full bg-[radial-gradient(circle,rgba(56,189,248,0.3)_0%,rgba(56,189,248,0.14)_34%,transparent_72%)] blur-3xl"
        animate={{ opacity: [0.45, 0.82, 0.45], scale: [1, 1.1, 1] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -right-40 bottom-[-13rem] h-[34rem] w-[34rem] rounded-full bg-[radial-gradient(circle,rgba(168,85,247,0.3)_0%,rgba(147,51,234,0.14)_34%,transparent_72%)] blur-3xl"
        animate={{ opacity: [0.42, 0.78, 0.42], scale: [1, 1.1, 1] }}
        transition={{ duration: 13, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Noise + vignette */}
      <div className="absolute inset-0 opacity-[0.03] [background-image:radial-gradient(rgba(255,255,255,0.45)_0.55px,transparent_0.55px)] [background-size:3px_3px]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,rgba(2,6,23,0.42)_74%,rgba(2,6,23,0.8)_100%)]" />
    </div>
  );
}
