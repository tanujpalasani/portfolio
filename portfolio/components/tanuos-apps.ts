import {
  BadgeCheck,
  FileText,
  FolderKanban,
  GraduationCap,
  Github,
  Linkedin,
  LucideIcon,
  Mail,
  Sparkles,
  TerminalSquare,
  Trophy,
  UserRound,
} from "lucide-react";
import type { WindowId } from "@/store/useWindowStore";

export type TanuOSApp = {
  id: WindowId;
  label: string;
  icon: LucideIcon;
  accentClass: string;
};

export const tanuOSApps: TanuOSApp[] = [
  {
    id: "about",
    label: "About",
    icon: UserRound,
    accentClass: "from-cyan-300/90 to-sky-500/90",
  },
  {
    id: "skills",
    label: "Skills",
    icon: Sparkles,
    accentClass: "from-fuchsia-300/90 to-indigo-500/90",
  },
  {
    id: "projects",
    label: "Projects",
    icon: FolderKanban,
    accentClass: "from-emerald-300/90 to-teal-500/90",
  },
  {
    id: "education",
    label: "Education",
    icon: GraduationCap,
    accentClass: "from-indigo-300/90 to-cyan-500/90",
  },
  {
    id: "certificates",
    label: "Certificates",
    icon: BadgeCheck,
    accentClass: "from-emerald-300/90 to-cyan-500/90",
  },
  {
    id: "achievements",
    label: "Achievements",
    icon: Trophy,
    accentClass: "from-amber-300/90 to-orange-500/90",
  },
  {
    id: "resume",
    label: "Resume",
    icon: FileText,
    accentClass: "from-sky-300/90 to-blue-500/90",
  },
  {
    id: "github",
    label: "GitHub",
    icon: Github,
    accentClass: "from-slate-300/90 to-zinc-500/90",
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    icon: Linkedin,
    accentClass: "from-cyan-300/90 to-blue-500/90",
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

export const desktopAppGroups: WindowId[][] = [
  ["about", "education", "certificates"],
  ["projects", "skills", "resume"],
  ["github", "linkedin", "achievements"],
  ["contact", "terminal"],
];

export const dockAppIds: WindowId[] = ["about", "projects", "skills", "contact", "terminal"];
