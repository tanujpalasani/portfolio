import Desktop from "@/components/Desktop";
import Dock from "@/components/Dock";
import WindowManager from "@/components/WindowManager";

export default function Home() {
  return (
    <main className="relative h-screen w-screen overflow-hidden bg-[radial-gradient(circle_at_15%_18%,rgba(34,211,238,0.16),transparent_32%),radial-gradient(circle_at_86%_80%,rgba(59,130,246,0.14),transparent_36%),radial-gradient(circle_at_72%_14%,rgba(168,85,247,0.12),transparent_30%),linear-gradient(160deg,#02050b_0%,#08101c_48%,#03060d_100%)] text-white">
      <div className="pointer-events-none absolute -left-24 top-8 h-[26rem] w-[26rem] rounded-full bg-cyan-500/10 blur-3xl bg-float-cyan" />
      <div className="pointer-events-none absolute right-[-5rem] top-24 h-[24rem] w-[24rem] rounded-full bg-blue-500/10 blur-3xl bg-float-blue" />
      <div className="pointer-events-none absolute bottom-[-8rem] left-[35%] h-[28rem] w-[28rem] rounded-full bg-purple-500/10 blur-3xl bg-float-purple" />

      <div className="pointer-events-none absolute inset-0 opacity-[0.05] [background-size:30px_30px] [background-image:linear-gradient(rgba(255,255,255,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_38%,rgba(2,6,23,0.22)_72%,rgba(0,0,0,0.45)_100%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.035] [background-image:radial-gradient(rgba(255,255,255,0.4)_0.6px,transparent_0.6px)] [background-size:3px_3px]" />

      <Desktop />
      <WindowManager />
      <Dock />
    </main>
  );
}
