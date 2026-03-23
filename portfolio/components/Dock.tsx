"use client";

import DockIcon from "./DockIcon";
import { devOSApps } from "./devos-apps";
import { useWindowStore } from "@/store/useWindowStore";

export default function Dock() {
  const openWindow = useWindowStore((state) => state.openWindow);

  return (
    <footer className="pointer-events-auto absolute inset-x-0 bottom-5 z-30 flex justify-center px-4 sm:bottom-8">
      <div className="flex items-end gap-3 rounded-[2rem] border border-white/20 bg-white/10 px-4 py-3 shadow-dock backdrop-blur-2xl">
        {devOSApps.map((app) => (
          <DockIcon
            key={app.id}
            id={app.id}
            label={app.label}
            Icon={app.icon}
            accentClass={app.accentClass}
            onOpen={openWindow}
          />
        ))}
      </div>
    </footer>
  );
}
