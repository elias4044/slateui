"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import Nav from "@/components/landing/Nav";

export default function DocsNotFound() {
  return (
    <div className="flex flex-col min-h-screen bg-[#0B0B0B] text-white">
      <header className="sticky top-0 z-50 shrink-0">
        <Nav />
      </header>

      <div className="flex flex-1 items-center justify-center px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="flex flex-col items-center gap-5"
        >
          <p className="text-[10px] font-mono uppercase tracking-widest text-slate-600">
            Docs — 404
          </p>
          <h1 className="text-3xl font-bold tracking-tight">
            This doc doesn&apos;t exist
          </h1>
          <p className="text-slate-500 text-sm max-w-sm leading-6">
            The documentation page you requested could not be found. It may have
            been renamed or removed.
          </p>
          <div className="flex items-center gap-3 mt-2">
            <Link
              href="/docs/installation"
              className="px-5 py-2.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-white text-sm font-medium transition-colors"
            >
              Installation Guide
            </Link>
            <Link
              href="/docs/button"
              className="px-5 py-2.5 rounded-xl border border-[#2A2A2A] hover:border-slate-500 text-slate-400 hover:text-white text-sm font-medium transition-colors"
            >
              Browse Components
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
