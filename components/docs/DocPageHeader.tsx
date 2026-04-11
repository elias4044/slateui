"use client";

import { motion } from "framer-motion";

export default function DocPageHeader({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <motion.header
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="mb-12"
    >
      <div className="mb-3">
        <span className="inline-block text-[10px] font-mono uppercase tracking-widest text-slate-600 border border-[#1E1E1E] rounded-full px-3 py-1">
          Component
        </span>
      </div>
      <h1 className="text-4xl font-bold text-white tracking-tight mb-4 leading-tight">
        {title}
      </h1>
      <p className="text-slate-400 text-base leading-7 max-w-prose">
        {description}
      </p>
      <div className="mt-8 h-px bg-[#1E1E1E]" />
    </motion.header>
  );
}
