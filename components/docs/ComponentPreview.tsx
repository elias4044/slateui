"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SliderPreview from "@/components/docs/SliderPreview";
import ButtonPreview from "@/components/docs/ButtonPreview";
import SwitchPreview from "@/components/docs/SwitchPreview";
import TextPreview from "@/components/docs/TextPreview";
import NotificationPreview from "@/components/docs/NotificationPreview";
import ProgressBarPreview from "@/components/docs/ProgressBarPreview";
import InstallPreview from "@/components/docs/InstallPreview";

// ─── Types ────────────────────────────────────────────────────────────────────

type ControlType =
  | { kind: "toggle"; label: string; key: string; default: boolean }
  | {
      kind: "number";
      label: string;
      key: string;
      min: number;
      max: number;
      step: number;
      default: number;
    };

type ComponentConfig = {
  controls: ControlType[];
  generateCode: (props: Record<string, unknown>) => string;
  Preview: React.ComponentType<{ props: Record<string, unknown> }>;
};

// ─── Per-component configs ────────────────────────────────────────────────────

const CONFIGS: Record<string, ComponentConfig> = {
  slider: {
    controls: [
      { kind: "number", label: "Min", key: "Min", min: 0, max: 50, step: 1, default: 0 },
      { kind: "number", label: "Max", key: "Max", min: 50, max: 200, step: 1, default: 100 },
      { kind: "number", label: "Step", key: "Step", min: 0, max: 10, step: 1, default: 1 },
      { kind: "number", label: "Default", key: "Default", min: 0, max: 100, step: 1, default: 50 },
      { kind: "toggle", label: "Disabled", key: "Disabled", default: false },
    ],
    generateCode: (p) =>
      `InputsService.Slider(script.Parent.SliderFrame, function(value)\n    print("Value:", value) -- ${p.Min}–${p.Max}, step ${p.Step}\nend)`,
    Preview: SliderPreview,
  },
  button: {
    controls: [
      { kind: "toggle", label: "Secondary theme", key: "Secondary", default: false },
    ],
    generateCode: (p) =>
      `ButtonService.Init(script.Parent.MyButton, "${p.Secondary ? "secondary" : "primary"}"${p.Disabled ? ", nil, nil -- (disabled state shown for demo)" : ""})`,
    Preview: ButtonPreview,
  },
  switch: {
    controls: [
      { kind: "toggle", label: "Start enabled", key: "StartOn", default: false },
    ],
    generateCode: () =>
      `InputsService.Switch(script.Parent.SwitchFrame, function(state: boolean)\n    print("Switch →", state)\nend)`,
    Preview: SwitchPreview,
  },
  text: {
    controls: [
      { kind: "toggle", label: "Show error state", key: "Error", default: false },
    ],
    generateCode: () =>
      `InputsService.Text(script.Parent.InputFrame, function(text: string, submitted: boolean)\n    if submitted then print("Submitted:", text) end\nend)`,
    Preview: TextPreview,
  },
  notification: {
    controls: [
      { kind: "toggle", label: "Success", key: "Success", default: false },
      { kind: "toggle", label: "Error", key: "Error", default: false },
      { kind: "toggle", label: "Warning", key: "Warning", default: false },
      { kind: "number", label: "Duration (s)", key: "Duration", min: 1, max: 10, step: 1, default: 3 },
    ],
    generateCode: (p) => {
      const status = p.Success ? "success" : p.Error ? "error" : p.Warning ? "warning" : "info";
      return `NotificationService.Notify("Your message here.", {\n    status   = "${status}",\n    duration = ${p.Duration},\n})`;
    },
    Preview: NotificationPreview,
  },
  progressbar: {
    controls: [
      { kind: "number", label: "Percent", key: "Percent", min: 0, max: 100, step: 1, default: 60 },
      { kind: "toggle", label: "Spring effect", key: "Spring", default: false },
    ],
    generateCode: (p) =>
      `ProgressBarService.Set(script.Parent.Bar, ${(p.Percent as number) / 100}${p.Spring ? ", false, { spring = true }" : ""})`,
    Preview: ProgressBarPreview,
  },
  install: {
    controls: [],
    generateCode: () => `-- Install from Creator Store:\n-- https://create.roblox.com/store/asset/134225039028358/SlateUI-Installer`,
    Preview: InstallPreview,
  },
};

// ─── Copy-code hook ───────────────────────────────────────────────────────────

function useCopy() {
  const [copied, setCopied] = useState(false);
  const copy = useCallback((text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, []);
  return { copied, copy };
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function ComponentPreview({ componentId }: { componentId: string }) {
  const config = CONFIGS[componentId];
  if (!config) return null;

  // Build initial state from control defaults
  const initialProps = Object.fromEntries(
    config.controls.map((c) => [c.key, c.default])
  ) as Record<string, unknown>;

  const [props, setProps] = useState<Record<string, unknown>>(initialProps);
  const { copied, copy } = useCopy();

  const setKey = (key: string, value: unknown) =>
    setProps((prev) => ({ ...prev, [key]: value }));

  const code = config.generateCode(props);
  const { Preview } = config;

  return (
    <div className="my-8 rounded-xl border border-[#1E1E1E] bg-[#0F0F0F] overflow-hidden">
      {/* Header bar */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-[#1E1E1E]">
        <span className="text-xs font-mono text-slate-500 uppercase tracking-widest">
          Interactive Preview
        </span>
        <button
          onClick={() => copy(code)}
          className="relative flex items-center gap-1.5 text-xs font-mono px-3 py-1.5 rounded-md border border-[#2A2A2A] bg-[#141414] text-slate-400 hover:text-slate-100 hover:border-slate-600 transition-colors"
        >
          <AnimatePresence mode="wait" initial={false}>
            {copied ? (
              <motion.span
                key="copied"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.15 }}
                className="text-emerald-400"
              >
                ✓ Copied
              </motion.span>
            ) : (
              <motion.span
                key="copy"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.15 }}
              >
                Copy Luau
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>

      {/* Body: preview + controls */}
      <div className="flex flex-col md:flex-row min-h-60">
        {/* Live preview pane */}
        <div className="flex-1 flex items-center justify-center p-10 bg-[#0B0B0B]">
          <Preview props={props} />
        </div>

        {/* Property controller sidebar */}
        <div className="md:w-56 shrink-0 border-t md:border-t-0 md:border-l border-[#1E1E1E] p-4 flex flex-col gap-4 bg-[#0D0D0D]">
          <p className="text-[10px] font-mono uppercase tracking-widest text-slate-600">
            Properties
          </p>
          {config.controls.map((ctrl) =>
            ctrl.kind === "toggle" ? (
              <ToggleControl
                key={ctrl.key}
                label={ctrl.label}
                value={props[ctrl.key] as boolean}
                onChange={(v) => setKey(ctrl.key, v)}
              />
            ) : (
              <NumberControl
                key={ctrl.key}
                label={ctrl.label}
                min={ctrl.min}
                max={ctrl.max}
                step={ctrl.step}
                value={props[ctrl.key] as number}
                onChange={(v) => setKey(ctrl.key, v)}
              />
            )
          )}
        </div>
      </div>

      {/* Generated code strip */}
      <div className="border-t border-[#1E1E1E] bg-[#0B0B0B]">
        <pre className="px-5 py-4 text-xs font-mono text-slate-400 leading-relaxed overflow-x-auto whitespace-pre">
          {code}
        </pre>
      </div>
    </div>
  );
}

// ─── Sub-controls ─────────────────────────────────────────────────────────────

function ToggleControl({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="text-xs text-slate-400 select-none">{label}</span>
      <button
        role="switch"
        aria-checked={value}
        onClick={() => onChange(!value)}
        className={`relative w-9 h-5 rounded-full transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 ${
          value ? "bg-slate-500" : "bg-[#2A2A2A]"
        }`}
      >
        <motion.span
          layout
          transition={{ type: "spring", stiffness: 700, damping: 30 }}
          className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow ${
            value ? "left-4.5" : "left-0.5"
          }`}
        />
      </button>
    </div>
  );
}

function NumberControl({
  label,
  value,
  min,
  max,
  step,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <span className="text-xs text-slate-400 select-none">{label}</span>
        <span className="text-xs font-mono text-slate-300 tabular-nums">{value}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-slate-500 cursor-pointer"
      />
    </div>
  );
}
