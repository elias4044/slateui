"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Box } from "lucide-react";

import { InstallButton } from "./CTA";

export default function Nav() {
  const [copied, setCopied] = useState(false);

  const copyPluginId = () => {
    navigator.clipboard.writeText("123159360689128").then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <header className="fixed top-0 inset-x-0 z-50 border-b border-[#1E1E1E] bg-[#0B0B0B]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
        {/* Wordmark */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <span className="w-6 h-6 rounded bg-none flex items-center justify-center">
            <Box className="w-6 h-6 text-white group-hover:text-slate-400 transition-colors" />
          </span>
          <span className="font-semibold text-white tracking-tight text-sm">
            Slate<span className="text-slate-400">UI</span>
          </span>
        </Link>

        {/* Nav links */}
        <nav className="hidden md:flex items-center gap-6">
          {[
            { label: "Docs", href: "/docs/installation" },
            { label: "Components", href: "/docs/button" },
            { label: "GitHub", href: "https://github.com/elias4044/slateui" },
          ].map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              className="text-sm text-slate-500 hover:text-slate-200 transition-colors"
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Install button */}
        <div className="hidden sm:flex items-center gap-4 m-2">
         <InstallButton variant="icon" />
        </div>
      </div>
    </header>
  );
}
