"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0B0B0B] flex flex-col items-center justify-center px-6 text-center">
      {/* Glow backdrop */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 40% 30% at 50% 40%, rgba(71,85,105,0.06) 0%, transparent 70%)",
        }}
        aria-hidden
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative flex flex-col items-center gap-6"
      >
        {/* Error code */}
        <p className="text-[10px] font-mono uppercase tracking-widest text-slate-600">
          Error 404
        </p>

        {/* Big number */}
        <span
          className="text-[120px] text-white font-bold leading-none select-none"
          style={{
            backgroundImage:
              "linear-gradient(180deg, rgba(71,85,105,0.5) 0%, rgba(71,85,105,0.08) 100%)",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
          }}
        >
          404
        </span>

        <div className="flex flex-col items-center gap-2 -mt-4">
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Page not found
          </h1>
          <p className="text-slate-500 text-sm max-w-sm leading-6">
            The page you were looking for doesn&apos;t exist or has been moved.
          </p>
        </div>

        <div className="flex items-center gap-3 mt-2">
          <Link
            href="/"
            className="px-5 py-2.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-white text-sm font-medium transition-colors"
          >
            Back to Home
          </Link>
          <Link
            href="/docs/installation"
            className="px-5 py-2.5 rounded-xl border border-[#2A2A2A] hover:border-slate-500 text-slate-400 hover:text-white text-sm font-medium transition-colors"
          >
            View Docs
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
