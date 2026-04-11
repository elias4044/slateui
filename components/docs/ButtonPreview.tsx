"use client";

import { motion } from "framer-motion";

export default function ButtonPreview({
  props,
}: {
  props: Record<string, unknown>;
}) {
  const disabled = (props.Disabled as boolean) ?? false;
  const secondary = (props.Secondary as boolean) ?? false;

  const base =
    "relative px-5 py-2.5 rounded-lg text-sm font-medium tracking-wide transition-all duration-150 select-none focus:outline-none";

  const variants = {
    primary:
      "bg-slate-600 text-white border border-[#2c3642] hover:bg-[#3d4a5b] hover:border-[#35414f]",
    secondary:
      "bg-[#1e1e1e] text-slate-300 border border-[#2A2A2A] hover:bg-[#161616] hover:border-[#353535] hover:text-white",
    disabled: "bg-[#1A1A1A] text-slate-600 border border-[#1E1E1E] cursor-not-allowed",
  };

  const variant = disabled ? "disabled" : secondary ? "secondary" : "primary";

  return (
    <motion.button
      whileTap={disabled ? {} : { scale: 0.97 }}
      whileHover={disabled ? {} : { scale: 1.02 }}
      transition={{ type: "spring", stiffness: 600, damping: 30 }}
      disabled={disabled}
      className={`${base} ${variants[variant]}`}
    >
      Confirm
    </motion.button>
  );
}
