"use client";

import DesktopIcon from "./DesktopIcon";
import { devOSApps } from "./devos-apps";
import { useWindowStore } from "@/store/useWindowStore";

export default function Desktop() {
  const openWindow = useWindowStore((state) => state.openWindow);

  return (
    <aside className="pointer-events-auto absolute left-5 top-7 z-20 flex flex-col items-start gap-5 sm:left-8 sm:top-10">
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
  );
}
