"use client";

import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect } from "react";

// ─── Animated Slider demo ─────────────────────────────────────────────────────

function SliderDemo() {
  const [value, setValue] = useState(42);
  useEffect(() => {
    const id = setInterval(() => {
      setValue((v) => {
        const next = v + (Math.random() > 0.5 ? 5 : -5);
        return Math.max(5, Math.min(95, next));
      });
    }, 900);
    return () => clearInterval(id);
  }, []);

  const pct = value;

  return (
    <div className="flex flex-col gap-3 w-full">
      <div className="flex justify-between">
        <span className="text-[10px] font-mono text-slate-600">InputsService.Slider</span>
        <motion.span
          key={value}
          initial={{ opacity: 0.4, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-xs font-mono text-slate-300 tabular-nums overflow-hidden"
        >
          {value}
        </motion.span>
      </div>
      <div className="relative h-1.5 w-full rounded-full bg-[#1E1E1E]">
        <motion.div
          className="absolute left-0 top-0 h-full rounded-full bg-slate-500"
          animate={{ width: `${pct}%` }}
          transition={{ type: "spring", stiffness: 120, damping: 22 }}
        />
        <motion.div
          className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full border-2 border-slate-400 bg-[#0B0B0B] -ml-1.5 shadow overflow-hidden"
          animate={{ left: `${pct}%` }}
          transition={{ type: "spring", stiffness: 120, damping: 22 }}
        />
      </div>
    </div>
  );
}

// ─── Animated Switch demo ─────────────────────────────────────────────────────

function SwitchDemo() {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const id = setInterval(() => setOn((v) => !v), 1800);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex items-center justify-between w-full">
      <span className="text-[10px] font-mono text-slate-600">InputsService.Switch</span>
      <div className="flex items-center gap-3">
        <AnimatePresence mode="wait">
          <motion.span
            key={String(on)}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className={`text-xs font-mono ${on ? "text-emerald-400" : "text-slate-700"}`}
          >
            {on ? "true" : "false"}
          </motion.span>
        </AnimatePresence>
        <button
          onClick={() => setOn((v) => !v)}
          className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${on ? "bg-slate-500" : "bg-[#2A2A2A]"}`}
        >
          <motion.span
            layout
            transition={{ type: "spring", stiffness: 700, damping: 32 }}
            className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow ${on ? "left-6" : "left-1"}`}
          />
        </button>
      </div>
    </div>
  );
}

// ─── Animated Proximity UI demo ───────────────────────────────────────────────

function ProximityDemo() {
  const [expanded, setExpanded] = useState(false);
  useEffect(() => {
    const id = setInterval(() => setExpanded((v) => !v), 2200);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex flex-col gap-3 w-full">
      <span className="text-[10px] font-mono text-slate-600">ProximityService — BillboardGui</span>
      <div className="flex items-center gap-3">
        {/* Small chip — always visible */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-[#2A2A2A] bg-[#111111]">
          <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />
          <span className="text-[10px] font-mono text-slate-500">Interact</span>
        </div>

        {/* Expanded panel */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "auto" }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="overflow-hidden"
            >
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#2A2A2A] bg-[#0F0F0F] whitespace-nowrap">
                <span className="text-xs text-slate-300">Press E to open</span>
                <span className="text-[10px] font-mono text-slate-600 border border-[#2A2A2A] px-1.5 py-0.5 rounded">E</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <span className="text-[10px] font-mono text-slate-700 ml-auto">
          {expanded ? "≤8 studs" : ">8 studs"}
        </span>
      </div>
    </div>
  );
}

// ─── Notification demo ────────────────────────────────────────────────────────

const NOTIF_QUEUE = [
  { status: "success", color: "bg-emerald-500", msg: "Settings saved." },
  { status: "warning", color: "bg-amber-400",   msg: "Match starting in 10s." },
  { status: "error",   color: "bg-red-500",      msg: "Connection dropped." },
  { status: "info",    color: "bg-slate-500",    msg: "New item found." },
];

function NotificationDemo() {
  const [idx, setIdx] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const id = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIdx((i) => (i + 1) % NOTIF_QUEUE.length);
        setVisible(true);
      }, 300);
    }, 2500);
    return () => clearInterval(id);
  }, []);

  const n = NOTIF_QUEUE[idx];

  return (
    <div className="flex flex-col gap-2 w-full">
      <span className="text-[10px] font-mono text-slate-600">NotificationService</span>
      <AnimatePresence mode="wait">
        {visible && (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.2 }}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg border border-[#2A2A2A] bg-[#0F0F0F]"
          >
            <span className={`w-2 h-2 rounded-full shrink-0 ${n.color}`} />
            <span className="text-sm text-slate-300">{n.msg}</span>
            <span className="ml-auto text-[10px] font-mono text-slate-600 uppercase">{n.status}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Gallery card ─────────────────────────────────────────────────────────────

function GalleryCard({
  label,
  description,
  delay,
  children,
}: {
  label: string;
  description: string;
  delay: number;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ delay, duration: 0.4, ease: "easeOut" }}
      className="rounded-xl border border-[#1E1E1E] bg-[#0D0D0D] overflow-hidden flex flex-col"
    >
      {/* Live demo area */}
      <div className="flex-1 flex items-center justify-center p-8 bg-[#0B0B0B] min-h-32">
        {children}
      </div>

      {/* Label */}
      <div className="px-5 py-4 border-t border-[#1E1E1E]">
        <p className="text-sm font-medium text-slate-200 mb-1">{label}</p>
        <p className="text-xs text-slate-600 leading-5">{description}</p>
      </div>
    </motion.div>
  );
}

// ─── Section ──────────────────────────────────────────────────────────────────

export default function Gallery() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.1 });

  return (
    <section ref={ref} className="py-28 border-t border-[#1E1E1E]">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4 }}
          className="mb-12"
        >
          <p className="text-[10px] font-mono uppercase tracking-widest text-slate-600 mb-3">
            Show, don't tell
          </p>
          <h2 className="text-3xl lg:text-4xl font-bold text-white tracking-tight mb-4">
            Live components
          </h2>
          <p className="text-slate-500 text-base leading-7 max-w-xl">
            Every animation is driven by the same logic that runs in your game. Not CSS simulations.
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <GalleryCard
            label="Smooth Slider"
            description="Spring-physics knob. Zero jitter at boundary."
            delay={0}
          >
            <SliderDemo />
          </GalleryCard>

          <GalleryCard
            label="Switch Toggle"
            description="Instant state flip with layout-animated knob."
            delay={0.08}
          >
            <SwitchDemo />
          </GalleryCard>

          <GalleryCard
            label="Proximity UI"
            description="Unfurls on approach. Hysteresis prevents flicker."
            delay={0.16}
          >
            <ProximityDemo />
          </GalleryCard>

          <GalleryCard
            label="Notifications"
            description="Client or server. Four statuses. Auto-dismiss."
            delay={0.24}
          >
            <NotificationDemo />
          </GalleryCard>
        </div>
      </div>
    </section>
  );
}
