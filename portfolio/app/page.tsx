import DesktopBackground from "@/components/DesktopBackground";
import Desktop from "@/components/Desktop";
import Dock from "@/components/Dock";
import WindowManager from "@/components/WindowManager";

export default function Home() {
  return (
    <main className="relative h-screen w-screen overflow-hidden text-white">
      <DesktopBackground />

      <Desktop />
      <WindowManager />
      <Dock />
    </main>
  );
}
