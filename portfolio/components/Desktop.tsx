"use client";

import { useEffect, useMemo, useState } from "react";

import DesktopIcon from "./DesktopIcon";
import { devOSApps } from "./devos-apps";
import { useWindowStore } from "@/store/useWindowStore";

export default function Desktop() {
  const openWindow = useWindowStore((state) => state.openWindow);
  const [now, setNow] = useState(() => new Date());
  const [pointer, setPointer] = useState({ x: 0.5, y: 0.5 });

  useEffect(() => {
    const tick = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(tick);
  }, []);

  useEffect(() => {
    const handleMove = (event: MouseEvent) => {
      const x = event.clientX / window.innerWidth;
      const y = event.clientY / window.innerHeight;
      setPointer({ x, y });
    };

    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  const timeLabel = useMemo(
    () =>
      now.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      }),
    [now],
  );

  const parallaxX = (pointer.x - 0.5) * 14;
  const parallaxY = (pointer.y - 0.5) * 10;
  const ambientX = pointer.x * 100;
  const ambientY = pointer.y * 100;

  return (
    <section className="pointer-events-none absolute inset-0 z-20">
      <div className="pointer-events-none absolute inset-x-0 top-0 z-30 h-10 border-b border-white/10 bg-black/30 backdrop-blur-md">
        <div className="flex h-full items-center justify-between px-4 text-xs text-white/80">
          <div className="flex items-center gap-2 font-semibold tracking-wide">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-300 shadow-[0_0_10px_rgba(34,211,238,0.85)]" />
            <span>DevOS</span>
          </div>
          <div className="font-medium tracking-wide text-white/75">{timeLabel}</div>
        </div>
      </div>

      <div
        className="pointer-events-none absolute left-1/2 top-1/2 z-0 -translate-x-1/2 -translate-y-1/2 text-center"
        style={{
          transform: `translate(calc(-50% + ${parallaxX}px), calc(-50% + ${parallaxY}px))`,
        }}
      >
        <p className="select-none text-[52px] font-semibold tracking-[0.1em] text-white/[0.05] blur-[1px] sm:text-[72px]">
          DevOS - Tanuj Portfolio
        </p>
      </div>

      <div
        className="pointer-events-none absolute z-0 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(56,189,248,0.24)_0%,rgba(59,130,246,0.12)_40%,rgba(0,0,0,0)_78%)] blur-3xl transition-transform duration-300 ease-out"
        style={{ left: `${ambientX}%`, top: `${ambientY}%` }}
      />

      <aside
        className="pointer-events-auto absolute left-5 top-14 z-20 flex flex-col items-start gap-5 transition-transform duration-300 ease-out sm:left-8 sm:top-16"
        style={{ transform: `translate3d(${parallaxX * -0.35}px, ${parallaxY * -0.35}px, 0)` }}
      >
        {devOSApps.map((app) => (
          <DesktopIcon
            key={app.id}
            id={app.id}
            label={app.label}
            Icon={app.icon}
            accentClass={app.accentClass}
            onOpen={openWindow}
          />
        ))}
      </aside>

      <div className="pointer-events-auto absolute bottom-6 left-5 z-20 sm:left-8">
        <div className="group relative inline-flex items-center">
          <span className="inline-flex h-3 w-3 rounded-full bg-emerald-400 shadow-[0_0_16px_rgba(74,222,128,0.75)] transition duration-300 group-hover:scale-110" />
          <span className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md border border-white/10 bg-black/70 px-2 py-1 text-[10px] text-white/90 opacity-0 backdrop-blur-sm transition group-hover:opacity-100">
            DevOS Active
          </span>
        </div>
      </div>
    </section>
  );
}
