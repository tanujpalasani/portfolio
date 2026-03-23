import Link from "next/link";

export default function NotFound() {
  return (
    <main className="grid h-screen w-screen place-items-center bg-slate-950 px-6 text-white">
      <section className="w-full max-w-lg rounded-2xl border border-white/15 bg-white/5 p-6 text-center backdrop-blur-xl">
        <p className="text-xs uppercase tracking-[0.2em] text-amber-300/90">404</p>
        <h1 className="mt-3 text-2xl font-semibold text-white">Page not found</h1>
        <p className="mt-3 text-sm text-slate-200/80">The requested page does not exist in this project.</p>
        <Link
          href="/"
          className="mt-5 inline-flex rounded-xl border border-cyan-300/40 bg-cyan-400/20 px-4 py-2 text-sm font-medium text-cyan-100 transition hover:bg-cyan-300/30"
        >
          Back to desktop
        </Link>
      </section>
    </main>
  );
}
