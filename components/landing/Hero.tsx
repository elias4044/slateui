"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

// ─── The Luau snippet shown in the right panel ────────────────────────────────

const CODE_LINES = [
  { tokens: [
    { t: "local ", c: "text-violet-400" },
    { t: "RouterService", c: "text-cyan-300" },
    { t: " = ", c: "text-slate-400" },
    { t: "require", c: "text-sky-400" },
    { t: "(ReplicatedStorage.SlateUI.", c: "text-slate-400" },
    { t: "RouterService", c: "text-cyan-300" },
    { t: ")", c: "text-slate-400" },
  ]},
  { tokens: [] },
  { tokens: [
    { t: "-- Register every screen once", c: "text-slate-600 italic" },
  ]},
  { tokens: [
    { t: "RouterService", c: "text-cyan-300" },
    { t: ".", c: "text-slate-400" },
    { t: "RegisterView", c: "text-blue-300" },
    { t: '("Menu", "Home",     HomeFrame)', c: "text-slate-300" },
  ]},
  { tokens: [
    { t: "RouterService", c: "text-cyan-300" },
    { t: ".", c: "text-slate-400" },
    { t: "RegisterView", c: "text-blue-300" },
    { t: '("Menu", "Settings", SettingsFrame)', c: "text-slate-300" },
  ]},
  { tokens: [
    { t: "RouterService", c: "text-cyan-300" },
    { t: ".", c: "text-slate-400" },
    { t: "RegisterView", c: "text-blue-300" },
    { t: '("Menu", "Store",    StoreFrame)', c: "text-slate-300" },
  ]},
  { tokens: [] },
  { tokens: [
    { t: "-- Navigate between them with one call", c: "text-slate-600 italic" },
  ]},
  { tokens: [
    { t: "RouterService", c: "text-cyan-300" },
    { t: ".", c: "text-slate-400" },
    { t: "Navigate", c: "text-blue-300" },
    { t: '("Menu", "Settings")', c: "text-slate-300" },
  ]},
];

function CodeLine({ tokens, index }: { tokens: { t: string; c: string }[]; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.4 + index * 0.06, duration: 0.3, ease: "easeOut" }}
      className="flex whitespace-pre font-mono text-[13px] leading-7"
    >
      <span className="select-none w-8 shrink-0 text-right pr-4 text-slate-700 text-xs leading-7">
        {index + 1}
      </span>
      {tokens.length === 0 ? (
        <span>&nbsp;</span>
      ) : (
        tokens.map((tok, i) => (
          <span key={i} className={tok.c}>
            {tok.t}
          </span>
        ))
      )}
    </motion.div>
  );
}

// ─── Main Hero ────────────────────────────────────────────────────────────────

export default function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Subtle animated grid background
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    let frame = 0;
    let raf: number;
    const draw = () => {
      frame++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const gap = 48;
      const cols = Math.ceil(canvas.width / gap) + 1;
      const rows = Math.ceil(canvas.height / gap) + 1;
      const alpha = 0.025 + 0.012 * Math.sin(frame * 0.012);
      ctx.strokeStyle = `rgba(71,85,105,${alpha})`;
      ctx.lineWidth = 0.5;
      for (let c = 0; c < cols; c++) {
        ctx.beginPath();
        ctx.moveTo(c * gap, 0);
        ctx.lineTo(c * gap, canvas.height);
        ctx.stroke();
      }
      for (let r = 0; r < rows; r++) {
        ctx.beginPath();
        ctx.moveTo(0, r * gap);
        ctx.lineTo(canvas.width, r * gap);
        ctx.stroke();
      }
      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden pt-14">
      {/* Grid canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        aria-hidden
      />

      {/* Radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 40%, rgba(71,85,105,0.07) 0%, transparent 70%)",
        }}
        aria-hidden
      />

      <div className="relative max-w-7xl mx-auto px-6 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center py-24">

          {/* ── Left: Manifest ── */}
          <div>
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center gap-2 mb-6 px-3 py-1 rounded-full border border-[#1E1E1E] bg-[#111111]"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />
              <span className="text-[11px] font-mono text-slate-500 uppercase tracking-widest">
                Roblox UI Framework
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5, ease: "easeOut" }}
              className="text-5xl lg:text-6xl font-bold text-white leading-[1.08] tracking-tight mb-6"
            >
              Roblox UI,
              <br />
              <span className="text-slate-400">done properly.</span>
            </motion.h1>

            {/* Manifest text */}
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.45 }}
              className="text-slate-400 text-lg leading-8 mb-3 max-w-md"
            >
              Roblox UI is usually a mess of global variables and unorganized frames.
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.28, duration: 0.45 }}
              className="text-slate-300 text-lg leading-8 mb-10 max-w-md"
            >
              SlateUI is a{" "}
              <span className="text-white font-medium">modular, event-driven framework</span>{" "}
              built for developers who care about code quality.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.38, duration: 0.4 }}
              className="flex flex-wrap gap-3"
            >
              <Link
                href="/docs/installation"
                className="px-5 py-2.5 rounded-lg bg-slate-600 hover:bg-slate-500 text-white text-sm font-medium transition-colors"
              >
                Read the Docs →
              </Link>
              <Link
                href="/docs/button"
                className="px-5 py-2.5 rounded-lg border border-[#2A2A2A] hover:border-slate-500 text-slate-400 hover:text-white text-sm font-medium transition-colors"
              >
                Browse Components
              </Link>
            </motion.div>

            {/* Stat strip */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.55, duration: 0.5 }}
              className="mt-12 pt-8 border-t border-[#1E1E1E] flex gap-10"
            >
              {[
                { value: "7", label: "Services" },
                { value: "0", label: "Global variables" },
                { value: "1", label: "require() to start" },
              ].map(({ value, label }) => (
                <div key={label}>
                  <p className="text-2xl font-bold text-white tabular-nums">{value}</p>
                  <p className="text-xs font-mono text-slate-600 mt-0.5">{label}</p>
                </div>
              ))}
            </motion.div>
          </div>

          {/* ── Right: Code snippet ── */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5, ease: "easeOut" }}
            className="rounded-xl border border-[#1E1E1E] bg-[#0D0D0D] overflow-hidden"
          >
            {/* Window chrome */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-[#1E1E1E] bg-[#0F0F0F]">
              <div className="flex gap-1.5">
                <span className="w-3 h-3 rounded-full bg-[#2A2A2A]" />
                <span className="w-3 h-3 rounded-full bg-[#2A2A2A]" />
                <span className="w-3 h-3 rounded-full bg-[#2A2A2A]" />
              </div>
              <span className="text-[10px] font-mono text-slate-600">MenuController.client.luau</span>
              <span className="text-[10px] font-mono text-slate-700 uppercase tracking-widest">Luau</span>
            </div>

            {/* Code body */}
            <div className="px-3 py-5">
              {CODE_LINES.map((line, i) => (
                <CodeLine key={i} tokens={line.tokens} index={i} />
              ))}
            </div>

            {/* Footer note */}
            <div className="px-4 py-3 border-t border-[#1E1E1E] flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span className="text-[11px] font-mono text-slate-600">
                Three views registered. One line to navigate. No Visible = true anywhere.
              </span>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
