"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

// ─── Table data ───────────────────────────────────────────────────────────────

const ROWS = [
  {
    topic: "Navigation",
    standard: "Manually toggle .Visible on each frame, no state tracking",
    slate: "RouterService.Navigate() — closes old, opens new, fires callbacks",
  },
  {
    topic: "Animations",
    standard: "Copy-pasted TweenService calls scattered across dozens of scripts",
    slate: "Centralized tween parameters per service, one edit propagates everywhere",
  },
  {
    topic: "Input handling",
    standard: "UserInputService listeners in random LocalScripts, rarely cleaned up",
    slate: "InputsService attaches and disconnects on AncestryChanged automatically",
  },
  {
    topic: "Theming",
    standard: "Hardcoded Color3 values duplicated across every button and frame",
    slate: "THEMES table in ButtonService — one RGB change updates the entire game",
  },
  {
    topic: "Notifications",
    standard: "Custom RemoteEvent per feature, no standard animation or lifetime",
    slate: "NotificationService client/server API, auto-dismiss, 4 built-in statuses",
  },
  {
    topic: "Cleanup",
    standard: "Connections leak; instances stay in memory after the GUI is destroyed",
    slate: ":Destroy() disconnects every connection and removes the frame",
  },
  {
    topic: "Proximity UI",
    standard: "Per-part scripts with duplicated distance checks on every Heartbeat",
    slate: "ProximityService.Init() — tag once, hysteresis + dot-product handled",
  },
];

// ─── Row component ────────────────────────────────────────────────────────────

function Row({
  row,
  index,
}: {
  row: (typeof ROWS)[0];
  index: number;
}) {
  return (
    <motion.tr
      initial={{ opacity: 0, x: -8 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ delay: index * 0.06, duration: 0.3, ease: "easeOut" }}
      className="border-b border-[#1E1E1E] last:border-0 group"
    >
      {/* Topic */}
      <td className="py-4 px-4 w-36 shrink-0">
        <span className="text-xs font-mono text-slate-600 uppercase tracking-widest">
          {row.topic}
        </span>
      </td>

      {/* Standard */}
      <td className="py-4 px-4 text-sm text-slate-600 leading-6">
        <div className="flex items-start gap-2.5">
          <span className="mt-1 shrink-0 w-1.5 h-1.5 rounded-full bg-[#2A2A2A]" />
          {row.standard}
        </div>
      </td>

      {/* Divider */}
      <td className="py-4 px-2 text-center text-[#1E1E1E] select-none">→</td>

      {/* SlateUI */}
      <td className="py-4 px-4 text-sm text-slate-300 leading-6">
        <div className="flex items-start gap-2.5">
          <span className="mt-1 shrink-0 w-1.5 h-1.5 rounded-full bg-slate-500" />
          {row.slate}
        </div>
      </td>
    </motion.tr>
  );
}

// ─── Section ──────────────────────────────────────────────────────────────────

export default function Comparison() {
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
            Real-world proof
          </p>
          <h2 className="text-3xl lg:text-4xl font-bold text-white tracking-tight mb-4">
            Not just another UI kit.
          </h2>
          <p className="text-slate-500 text-base leading-7 max-w-xl">
            Here is what the same problem looks like before and after SlateUI. No benchmarks — just code.
          </p>
        </motion.div>

        {/* Table */}
        <div className="rounded-xl border border-[#1E1E1E] overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-[#1E1E1E] bg-[#0D0D0D]">
                <th className="py-3 px-4 text-[10px] font-mono uppercase tracking-widest text-slate-700 font-normal w-36">
                  Topic
                </th>
                <th className="py-3 px-4 text-[10px] font-mono uppercase tracking-widest text-slate-600 font-normal">
                  Standard Roblox Workflow
                </th>
                <th className="py-3 px-2 w-6" />
                <th className="py-3 px-4 text-[10px] font-mono uppercase tracking-widest text-slate-400 font-normal">
                  SlateUI Workflow
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#111111]">
              {ROWS.map((row, i) => (
                <Row key={row.topic} row={row} index={i} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
