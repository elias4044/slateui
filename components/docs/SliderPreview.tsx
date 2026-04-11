"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function SliderPreview({
  props,
}: {
  props: Record<string, unknown>;
}) {
  const min = (props.Min as number) ?? 0;
  const max = (props.Max as number) ?? 100;
  const step = (props.Step as number) ?? 1;
  const defaultVal = (props.Default as number) ?? 50;
  const disabled = (props.Disabled as boolean) ?? false;

  // Clamp value whenever bounds change
  const [value, setValue] = useState<number>(
    Math.min(Math.max(defaultVal, min), max)
  );

  useEffect(() => {
    setValue((v) => Math.min(Math.max(v, min), max));
  }, [min, max]);

  const pct = max === min ? 0 : ((value - min) / (max - min)) * 100;

  return (
    <div className="w-full max-w-xs flex flex-col gap-4 select-none">
      {/* Value badge */}
      <div className="flex justify-between items-center">
        <span className="text-xs font-mono text-slate-500">value</span>
        <motion.span
          key={value}
          initial={{ scale: 0.85, opacity: 0.4 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 500, damping: 28 }}
          className="text-sm font-mono text-slate-200 tabular-nums"
        >
          {value}
        </motion.span>
      </div>

      {/* Track + thumb */}
      <div className="relative flex items-center h-6">
        {/* Background track */}
        <div
          className={`absolute inset-x-0 h-0.75 rounded-full transition-colors ${
            disabled ? "bg-[#1E1E1E]" : "bg-[#2A2A2A]"
          }`}
        />
        {/* Filled portion */}
        <motion.div
          className={`absolute left-0 h-0.75 rounded-full ${
            disabled ? "bg-slate-700" : "bg-slate-500"
          }`}
          style={{ width: `${pct}%` }}
          layout
          transition={{ type: "spring", stiffness: 600, damping: 40 }}
        />
        {/* Native input (invisible, drives state) */}
        <input
          type="range"
          min={min}
          max={max}
          step={step === 0 ? "any" : step}
          value={value}
          disabled={disabled}
          onChange={(e) => setValue(Number(e.target.value))}
          className="absolute inset-0 w-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
        />
        {/* Styled thumb */}
        <motion.div
          className={`absolute w-4 h-4 rounded-full border-2 shadow-lg z-10 pointer-events-none transition-colors ${
            disabled
              ? "bg-[#1E1E1E] border-[#2A2A2A]"
              : "bg-[#0B0B0B] border-slate-400"
          }`}
          style={{ left: `calc(${pct}% - 8px)` }}
          layout
          transition={{ type: "spring", stiffness: 600, damping: 40 }}
        />
      </div>

      {/* Min / Max labels */}
      <div className="flex justify-between">
        <span className="text-[10px] font-mono text-slate-600">{min}</span>
        <span className="text-[10px] font-mono text-slate-600">{max}</span>
      </div>

      {disabled && (
        <p className="text-center text-[10px] font-mono text-slate-600 uppercase tracking-widest">
          Disabled
        </p>
      )}
    </div>
  );
}
