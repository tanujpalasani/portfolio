"use client";

import { useState } from "react";

import DockIcon from "./DockIcon";
import { devOSApps } from "./devos-apps";
import { useWindowStore } from "@/store/useWindowStore";

export default function Dock() {
  const openWindow = useWindowStore((state) => state.openWindow);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const getProximityScale = (iconIndex: number) => {
    if (hoveredIndex === null) {
      return 1;
    }

    const distance = Math.abs(iconIndex - hoveredIndex);
    if (distance === 0) {
      return 1.4;
    }
    if (distance === 1) {
      return 1.18;
    }
    if (distance === 2) {
      return 1.08;
    }

    return 1;
  };

  const getProximityY = (iconIndex: number) => {
    if (hoveredIndex === null) {
      return 0;
    }

    const distance = Math.abs(iconIndex - hoveredIndex);
    if (distance === 0) {
      return -10;
    }
    if (distance === 1) {
      return -6;
    }
    if (distance === 2) {
      return -3;
    }

    return 0;
  };

  return (
    <footer className="pointer-events-auto absolute inset-x-0 bottom-5 z-30 flex justify-center px-4 sm:bottom-8">
      <div
        className="flex items-end gap-3 rounded-[2rem] border border-white/20 bg-white/10 px-4 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.22),0_18px_45px_rgba(0,0,0,0.45)] shadow-inner backdrop-blur-xl"
        onMouseLeave={() => setHoveredIndex(null)}
      >
        {devOSApps.map((app, index) => (
          <DockIcon
            key={app.id}
            id={app.id}
            label={app.label}
            Icon={app.icon}
            accentClass={app.accentClass}
            scale={getProximityScale(index)}
            offsetY={getProximityY(index)}
            isHovered={hoveredIndex === index}
            onHoverStart={() => setHoveredIndex(index)}
            onHoverEnd={() => setHoveredIndex(null)}
            onOpen={openWindow}
          />
        ))}
      </div>
    </footer>
  );
}
