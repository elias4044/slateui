"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

type NotifStatus = "info" | "success" | "error" | "warning";

const STATUS: Record<NotifStatus, { dot: string; label: string }> = {
  info:    { dot: "bg-slate-500",   label: "Info"    },
  success: { dot: "bg-emerald-500", label: "Success" },
  error:   { dot: "bg-red-500",     label: "Error"   },
  warning: { dot: "bg-amber-400",   label: "Warning" },
};

const MESSAGES: Record<NotifStatus, string> = {
  info:    "New item found in your inventory.",
  success: "Settings saved successfully.",
  error:   "Connection to server lost.",
  warning: "Match starting in 10 seconds.",
};

export default function NotificationPreview({
  props,
}: {
  props: Record<string, unknown>;
}) {
  const status: NotifStatus = props.Success
    ? "success"
    : props.Error
    ? "error"
    : props.Warning
    ? "warning"
    : "info";

  const [visible, setVisible] = useState(true);
  const [key, setKey] = useState(0);

  // Re-show whenever props change
  useEffect(() => {
    setVisible(true);
    setKey((k) => k + 1);
  }, [status]);

  return (
    <div className="w-full max-w-xs flex flex-col items-center gap-4">
      <AnimatePresence mode="wait">
        {visible && (
          <motion.div
            key={key}
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="w-full flex items-center gap-3 rounded-lg border border-[#2A2A2A] bg-[#0F0F0F] px-4 py-3"
          >
            {/* Status dot */}
            <span className={`w-2 h-2 rounded-full shrink-0 ${STATUS[status].dot}`} />
            {/* Message */}
            <p className="flex-1 text-sm text-slate-300 leading-snug">
              {MESSAGES[status]}
            </p>
            {/* Close button */}
            <button
              onClick={() => setVisible(false)}
              className="text-slate-600 hover:text-slate-300 transition-colors text-lg leading-none"
            >
              ×
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {!visible && (
        <button
          onClick={() => { setKey((k) => k + 1); setVisible(true); }}
          className="text-xs font-mono text-slate-600 hover:text-slate-400 transition-colors"
        >
          ↩ Show again
        </button>
      )}

      <p className="text-[10px] font-mono text-slate-700 uppercase tracking-widest">
        {STATUS[status].label}
      </p>
    </div>
  );
}
