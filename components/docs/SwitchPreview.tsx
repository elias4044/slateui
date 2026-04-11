"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function SwitchPreview({
  props,
}: {
  props: Record<string, unknown>;
}) {
  const [on, setOn] = useState<boolean>((props.StartOn as boolean) ?? false);

  return (
    <div className="flex flex-col items-center gap-5 select-none">
      <button
        role="switch"
        aria-checked={on}
        onClick={() => setOn((v) => !v)}
        className={`relative w-14 h-7 rounded-full transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 ${
          on ? "bg-slate-500" : "bg-[#2A2A2A]"
        }`}
      >
        {/* UIStroke simulation */}
        <span
          className={`absolute inset-0 rounded-full border transition-colors duration-200 ${
            on ? "border-slate-400" : "border-[#3A3A3A]"
          }`}
        />
        {/* Knob */}
        <motion.span
          layout
          transition={{ type: "spring", stiffness: 700, damping: 32 }}
          className={`absolute top-1 w-5 h-5 rounded-full shadow-md ${
            on ? "left-7.5 bg-white" : "left-1 bg-slate-400"
          }`}
        />
      </button>

      <motion.p
        key={String(on)}
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.15 }}
        className="text-xs font-mono text-slate-400"
      >
        state = <span className={on ? "text-emerald-400" : "text-slate-600"}>{String(on)}</span>
      </motion.p>
    </div>
  );
}
