"use client";

import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import Link from "next/link";
import { Download, ArrowUpRight, Sparkles } from "lucide-react";

const PLUGIN_ID = "134225039028358";
const STORE_URL = "https://create.roblox.com/store/asset/134225039028358/SlateUI-Installer";


type InstallButtonProps = React.ComponentPropsWithoutRef<'a'> & {
  /** 'full' renders the large CTA button, 'compact' is a small label+icon, 'icon' is icon-only for headers */
  variant?: 'full' | 'compact' | 'icon';
};

export function InstallButton({ variant = 'full', className, ...props }: InstallButtonProps) {
  const isIcon = variant === 'icon';
  const isCompact = variant === 'compact';

  // icon-only variant (for nav)
  if (isIcon) {
    return (
      <a
        {...props}
        href={STORE_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Install SlateUI Plugin"
        className={`inline-flex items-center justify-center w-9 h-9 rounded-full border border-transparent hover:border-slate-600 transition-colors ${className ?? ''}`}
        style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01))' }}
      >
        <span className="sr-only">Install SlateUI Plugin</span>
        <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} className="flex items-center justify-center">
          <Download className="w-4 h-4 text-slate-300" strokeWidth={1.5} />
        </motion.div>
      </a>
    );
  }

  // full or compact (label + icon)
  const defaultClass = isCompact
    ? 'group relative flex items-center gap-2 px-2 py-2 rounded-lg overflow-hidden'
    : 'group relative flex items-center gap-4 px-6 py-4 rounded-2xl overflow-hidden';
  const mergedClass = `${defaultClass} ${className ?? ''}`.trim();

  const iconSizeClass = isCompact ? 'w-3.5 h-3.5' : 'w-4.5 h-4.5';
  const eyebrow = isCompact ? 'text-[9px]' : 'text-[10px]';
  const headline = isCompact ? 'text-xs font-medium' : 'text-sm font-semibold';

  return (
    <a
      {...props}
      href={STORE_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={mergedClass}
      style={{
        background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
        border: '1px solid #334155',
        boxShadow:
          '0 0 0 1px rgba(71,85,105,0.2), 0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)',
      }}
    >
      {/* Animated shimmer on hover */}
      <motion.div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: 'linear-gradient(105deg, transparent 30%, rgba(148,163,184,0.06) 50%, transparent 70%)',
          backgroundSize: '200% 100%',
        }}
        animate={{ backgroundPosition: ['200% 0', '-200% 0'] }}
        transition={{ repeat: Infinity, duration: 2.4, ease: 'linear' }}
      />

      {/* Icon container */}
      <div
        className={`relative flex items-center justify-center ${isCompact ? 'w-8 h-8' : 'w-10 h-10'} rounded-xl shrink-0`}
        style={{ background: 'rgba(71,85,105,0.25)', border: '1px solid rgba(71,85,105,0.4)' }}
      >
        <motion.div animate={{ y: [0, -2, 0] }} transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}>
          <Download className={`${iconSizeClass} text-slate-300`} strokeWidth={1.5} />
        </motion.div>
      </div>

      {/* Text */}
      <div className="flex flex-col gap-0.5 flex-1">
        <span className={`${eyebrow} font-mono uppercase tracking-widest text-slate-500`}>Roblox Creator Store</span>
        <span className={`${headline} text-white group-hover:text-slate-100 transition-colors`}>Install SlateUI Plugin</span>
      </div>

      {/* Arrow */}
      <ArrowUpRight
        className={`w-4 h-4 text-slate-600 group-hover:text-slate-300 transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 shrink-0`}
        strokeWidth={1.5}
      />
    </a>
  );
}

export default function CTA() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(PLUGIN_ID).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <section ref={ref} className="py-28 border-t border-[#1E1E1E]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="rounded-2xl border border-[#1E1E1E] bg-[#0D0D0D] p-12 lg:p-16 relative overflow-hidden">
          {/* Subtle background accent */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse 50% 60% at 50% 100%, rgba(71,85,105,0.07) 0%, transparent 70%)",
            }}
            aria-hidden
          />

          <div className="relative flex flex-col lg:flex-row items-start lg:items-center justify-between gap-10">
            {/* Left */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4 }}
              className="max-w-lg"
            >
              <p className="text-[10px] font-mono uppercase tracking-widest text-slate-600 mb-3">
                Get started
              </p>
              <h2 className="text-3xl lg:text-4xl font-bold text-white tracking-tight mb-4">
                One plugin. Five minutes.
              </h2>
              <p className="text-slate-500 text-base leading-7">
                Install the plugin, require the services, and write less Roblox UI code from now on.
                The docs cover every service with quick-start and advanced examples.
              </p>
            </motion.div>

            {/* Right: action buttons */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1, duration: 0.4 }}
              className="flex flex-col gap-4 shrink-0 w-full lg:w-auto min-w-72"
            >
              {/* Primary install button */}
              <InstallButton />

                {/* Copy plugin ID */}
                <button
                  onClick={copy}
                  className="flex items-center justify-between gap-3 px-5 py-3 rounded-xl border border-[#2A2A2A] hover:border-slate-600 bg-[#0B0B0B] text-left transition-colors group"
                >
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-slate-600">
                      Roblox Plugin ID
                    </span>
                    <span className="text-sm font-mono text-slate-300 group-hover:text-white transition-colors tabular-nums">
                      {PLUGIN_ID}
                    </span>
                  </div>
                  <AnimatePresence mode="wait">
                    {copied ? (
                      <motion.span
                        key="copied"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.15 }}
                        className="text-xs font-mono text-emerald-400 flex items-center gap-1 shrink-0"
                      >
                        <Sparkles className="w-3 h-3" /> Copied
                      </motion.span>
                    ) : (
                      <motion.span
                        key="copy"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.15 }}
                        className="text-xs font-mono text-slate-600 group-hover:text-slate-400 transition-colors shrink-0"
                      >
                        Copy
                      </motion.span>
                    )}
                  </AnimatePresence>
                </button>

                {/* Docs link */}
                <div className="flex items-center justify-between">
                  <Link
                    href="/docs/installation"
                    className="text-xs font-mono text-slate-600 hover:text-slate-300 transition-colors"
                  >
                    Read the documentation →
                  </Link>
                  <Link
                    href="/docs/button"
                    className="text-xs font-mono text-slate-700 hover:text-slate-500 transition-colors"
                  >
                    Browse components ↗
                  </Link>
                </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
