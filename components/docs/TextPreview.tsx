"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function TextPreview({
  props,
}: {
  props: Record<string, unknown>;
}) {
  const showError = (props.Error as boolean) ?? false;
  const [focused, setFocused] = useState(false);
  const [value, setValue] = useState("");

  const strokeColor = showError
    ? "border-red-500"
    : focused
    ? "border-slate-500"
    : "border-[#2A2A2A]";

  return (
    <div className="w-full max-w-xs flex flex-col gap-3 select-none">
      <label className="text-xs font-mono text-slate-500">Username</label>

      <motion.div
        animate={{ borderColor: showError ? "#ef4444" : focused ? "#64748b" : "#2A2A2A" }}
        transition={{ duration: 0.2 }}
        className={`flex items-center rounded-lg border bg-[#0D0D0D] px-3 py-2 gap-2 ${strokeColor}`}
      >
        <input
          type="text"
          placeholder="Enter text…"
          value={value}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onChange={(e) => setValue(e.target.value)}
          className="flex-1 bg-transparent text-sm text-slate-200 placeholder-slate-600 focus:outline-none font-mono"
        />
      </motion.div>

      {showError && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs text-red-400 font-mono"
        >
          Value must be at least 3 characters
        </motion.p>
      )}

      <p className="text-[10px] font-mono text-slate-600">
        focused = <span className={focused ? "text-slate-400" : "text-slate-700"}>{String(focused)}</span>
      </p>
    </div>
  );
}
