"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

// ─── Pillar data ──────────────────────────────────────────────────────────────

const PILLARS = [
  {
    index: "01",
    title: "Zero Global Pollution",
    body: "Every component is a self-contained object returned from a constructor. Event connections are stored internally and torn down in a single .Destroy() call. Nothing leaks into _G, shared, or ReplicatedStorage by default.",
    code: `-- Create
local slider = InputsService.Slider(frame, cb)

-- Destroy — disconnects everything
slider:Destroy()`,
    tag: "Memory safety",
  },
  {
    index: "02",
    title: "Router-Driven Navigation",
    body: "RouterService manages independent navigation groups. Calling Navigate() closes the previous view and opens the next one with a configurable tween. No manual Visible toggling. No z-index fights. No spaghetti.",
    code: `RouterService.RegisterView("HUD", "Map", mapFrame)
RouterService.Navigate("HUD", "Map")
-- Previous view auto-closes`,
    tag: "State management",
  },
  {
    index: "03",
    title: "Single-Source Theme",
    body: "Color palettes and tween parameters live in one place inside each service module. Changing DefaultColor in ButtonService immediately affects every button in the game. No hunting through LocalScripts for hardcoded RGB values.",
    code: `-- In ButtonService.luau
local THEMES = {
  primary = {
    DefaultColor = Color3.fromRGB(71, 85, 105),
    HoverColor   = Color3.fromRGB(61, 74, 91),
    -- edit once, applies everywhere
  },
}`,
    tag: "Theming",
  },
];

// ─── Animated connector line ──────────────────────────────────────────────────

function ConnectorLine({ delay }: { delay: number }) {
  return (
    <motion.div
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ delay, duration: 0.5, ease: "easeOut" }}
      style={{ originX: 0 }}
      className="hidden lg:block absolute top-7 left-full w-full h-px bg-[#1E1E1E] origin-left"
    />
  );
}

// ─── Individual pillar card ───────────────────────────────────────────────────

function Pillar({
  pillar,
  delay,
  isLast,
}: {
  pillar: (typeof PILLARS)[0];
  delay: number;
  isLast: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ delay, duration: 0.45, ease: "easeOut" }}
      className="relative flex flex-col"
    >
      {/* Connector line between cards */}
      {!isLast && <ConnectorLine delay={delay + 0.15} />}

      {/* Header row */}
      <div className="flex items-start gap-4 mb-5">
        <div className="flex flex-col items-center gap-1.5 shrink-0">
          <span className="w-8 h-8 rounded-lg border border-[#2A2A2A] bg-[#111111] flex items-center justify-center text-[10px] font-mono text-slate-600">
            {pillar.index}
          </span>
        </div>
        <div>
          <span className="inline-block text-[10px] font-mono uppercase tracking-widest text-slate-600 border border-[#1E1E1E] rounded-full px-2.5 py-0.5 mb-2">
            {pillar.tag}
          </span>
          <h3 className="text-lg font-semibold text-white leading-tight tracking-tight">
            {pillar.title}
          </h3>
        </div>
      </div>

      {/* Body */}
      <p className="text-slate-500 text-sm leading-7 mb-5">{pillar.body}</p>

      {/* Code block */}
      <div className="mt-auto rounded-lg border border-[#1E1E1E] bg-[#0B0B0B] overflow-hidden">
        <pre className="px-4 py-4 text-xs font-mono text-slate-400 leading-relaxed overflow-x-auto whitespace-pre">
          {pillar.code}
        </pre>
      </div>
    </motion.div>
  );
}

// ─── Section ──────────────────────────────────────────────────────────────────

export default function Pillars() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.15 });

  return (
    <section ref={ref} className="py-28 border-t border-[#1E1E1E]">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4 }}
          className="mb-16"
        >
          <p className="text-[10px] font-mono uppercase tracking-widest text-slate-600 mb-3">
            Architecture
          </p>
          <h2 className="text-3xl lg:text-4xl font-bold text-white tracking-tight mb-4">
            Under the Hood
          </h2>
          <p className="text-slate-500 text-base leading-7 max-w-xl">
            Three structural decisions that make SlateUI maintainable at scale — not just in demos.
          </p>
        </motion.div>

        {/* Pillars grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {PILLARS.map((p, i) => (
            <Pillar key={p.index} pillar={p} delay={i * 0.1} isLast={i === PILLARS.length - 1} />
          ))}
        </div>
      </div>
    </section>
  );
}
