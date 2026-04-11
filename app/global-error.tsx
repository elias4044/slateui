"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[SlateUI] Unhandled error:", error);
  }, [error]);

  return (
    <html lang="en" className="bg-[#0B0B0B]">
      <body className="bg-[#0B0B0B] antialiased font-sans min-h-screen flex flex-col items-center justify-center px-6 text-center text-white">
        <div className="flex flex-col items-center gap-5 max-w-md">
          <p className="text-[10px] font-mono uppercase tracking-widest text-slate-600">
            Unhandled Error
          </p>
          <h1 className="text-2xl font-bold tracking-tight">Something went wrong</h1>
          <p className="text-slate-500 text-sm leading-6">
            An unexpected error occurred. Try refreshing, or go back home.
            {error.digest && (
              <span className="block mt-1 font-mono text-[11px] text-slate-700">
                ref: {error.digest}
              </span>
            )}
          </p>
          <div className="flex items-center gap-3">
            <button
              onClick={reset}
              className="px-5 py-2.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-white text-sm font-medium transition-colors"
            >
              Try again
            </button>
            <Link
              href="/"
              className="px-5 py-2.5 rounded-xl border border-[#2A2A2A] hover:border-slate-500 text-slate-400 hover:text-white text-sm font-medium transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}
