import Desktop from "@/components/Desktop";
import Dock from "@/components/Dock";
import WindowManager from "@/components/WindowManager";

export default function Home() {
  return (
    <main className="relative h-screen w-screen overflow-hidden bg-[radial-gradient(circle_at_18%_20%,rgba(24,93,138,0.45),transparent_35%),radial-gradient(circle_at_78%_16%,rgba(29,78,216,0.3),transparent_30%),linear-gradient(160deg,#04070d_0%,#0b1220_45%,#05070d_100%)] text-white">
      <div className="pointer-events-none absolute inset-0 opacity-[0.08] [background-size:22px_22px] [background-image:linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)]" />
      <div className="pointer-events-none absolute -left-28 top-20 h-64 w-64 rounded-full bg-cyan-400/20 blur-[90px]" />
      <div className="pointer-events-none absolute right-10 top-12 h-52 w-52 rounded-full bg-indigo-500/25 blur-[85px]" />
      <div className="pointer-events-none absolute bottom-6 left-1/2 h-40 w-3/5 -translate-x-1/2 rounded-full bg-sky-400/10 blur-[70px]" />

      <Desktop />
      <WindowManager />
      <Dock />
    </main>
  );
}
