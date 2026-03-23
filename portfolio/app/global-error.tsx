"use client";

type GlobalErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  return (
    <html lang="en">
      <body className="grid h-screen w-screen place-items-center bg-slate-950 px-6 text-white">
        <section className="w-full max-w-xl rounded-2xl border border-rose-300/25 bg-white/5 p-6 backdrop-blur-xl">
          <p className="text-xs uppercase tracking-[0.2em] text-rose-300/90">Global app error</p>
          <h1 className="mt-3 text-2xl font-semibold text-white">Application could not render</h1>
          <p className="mt-3 text-sm text-slate-200/80">{error.message || "Unexpected application error."}</p>
          <button
            type="button"
            onClick={reset}
            className="mt-5 rounded-xl border border-rose-300/35 bg-rose-400/20 px-4 py-2 text-sm font-medium text-rose-100 transition hover:bg-rose-300/30"
          >
            Reload app
          </button>
        </section>
      </body>
    </html>
  );
}
