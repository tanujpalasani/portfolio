"use client";

type ErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function Error({ error, reset }: ErrorProps) {
  return (
    <main className="grid h-screen w-screen place-items-center bg-slate-950 px-6 text-white">
      <section className="w-full max-w-lg rounded-2xl border border-white/15 bg-white/5 p-6 backdrop-blur-xl">
        <p className="text-xs uppercase tracking-[0.2em] text-cyan-300/90">Something went wrong</p>
        <h1 className="mt-3 text-2xl font-semibold text-white">Runtime error in this route</h1>
        <p className="mt-3 text-sm text-slate-200/80">{error.message || "Unexpected application error."}</p>
        <button
          type="button"
          onClick={reset}
          className="mt-5 rounded-xl border border-cyan-300/40 bg-cyan-400/20 px-4 py-2 text-sm font-medium text-cyan-100 transition hover:bg-cyan-300/30"
        >
          Try again
        </button>
      </section>
    </main>
  );
}
