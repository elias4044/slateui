"use client";

import { useEffect } from "react";
import Link from "next/link";
import Nav from "@/components/landing/Nav";

export default function DocsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[SlateUI/docs] Error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#0B0B0B] text-white">
      <header className="sticky top-0 z-50 pb-14">
        <Nav />
      </header>

      <div className="flex flex-col items-center justify-center px-6 text-center pt-32">
        <div className="flex flex-col items-center gap-5 max-w-md">
          <p className="text-[10px] font-mono uppercase tracking-widest text-slate-600">
            Docs error
          </p>
          <h1 className="text-2xl font-bold tracking-tight">Failed to load this page</h1>
          <p className="text-slate-500 text-sm leading-6">
            Something went wrong while rendering this documentation page.
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
              href="/docs/installation"
              className="px-5 py-2.5 rounded-xl border border-[#2A2A2A] hover:border-slate-500 text-slate-400 hover:text-white text-sm font-medium transition-colors"
            >
              Go to Installation
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
