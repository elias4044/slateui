"use client";

import { motion, type Transition } from "framer-motion";

export default function ProgressBarPreview({
  props,
}: {
  props: Record<string, unknown>;
}) {
  const percent = (props.Percent as number) ?? 60;
  const spring = (props.Spring as boolean) ?? false;

  const filled = Math.max(0, Math.min(100, percent));
  const spring_transition: Transition = { type: "spring", stiffness: 120, damping: 18 };
  const tween_transition: Transition = { duration: 0.3, ease: "easeOut" };

  return (
    <div className="w-full max-w-xs flex flex-col gap-4 select-none">
      {/* Value */}
      <div className="flex justify-between items-center">
        <span className="text-xs font-mono text-slate-500">progress</span>
        <motion.span
          key={filled}
          initial={{ scale: 0.85, opacity: 0.4 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 500, damping: 28 }}
          className="text-sm font-mono text-slate-200 tabular-nums"
        >
          {filled}%
        </motion.span>
      </div>

      {/* Track */}
      <div className="relative h-1.5 w-full rounded-full bg-[#2A2A2A] overflow-hidden">
        <motion.div
          className="absolute left-0 top-0 h-full rounded-full bg-slate-500"
          animate={{ width: `${filled}%` }}
          transition={spring ? spring_transition : tween_transition}
        />
      </div>

      {/* Spring label */}
      <p className="text-[10px] font-mono text-slate-700 uppercase tracking-widest text-center">
        {spring ? "spring easing" : "quad easing"}
      </p>
    </div>
  );
}
