import {
  FolderKanban,
  LucideIcon,
  Mail,
  Sparkles,
  TerminalSquare,
  UserRound,
} from "lucide-react";
import type { WindowId } from "@/store/useWindowStore";

export type DevOSApp = {
  id: WindowId;
  label: string;
  icon: LucideIcon;
  accentClass: string;
};

export const devOSApps: DevOSApp[] = [
  {
    id: "about",
    label: "About",
    icon: UserRound,
    accentClass: "from-cyan-300/90 to-sky-500/90",
  },
  {
    id: "projects",
    label: "Projects",
    icon: FolderKanban,
    accentClass: "from-emerald-300/90 to-teal-500/90",
  },
  {
    id: "skills",
    label: "Skills",
    icon: Sparkles,
    accentClass: "from-fuchsia-300/90 to-indigo-500/90",
  },
  {
    id: "contact",
    label: "Contact",
    icon: Mail,
    accentClass: "from-amber-300/90 to-orange-500/90",
  },
  {
    id: "terminal",
    label: "Terminal",
    icon: TerminalSquare,
    accentClass: "from-slate-300/90 to-zinc-500/90",
  },
];
