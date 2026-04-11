"use client";

import { motion } from "framer-motion";

const STORE_URL = "https://create.roblox.com/store/asset/134225039028358/SlateUI-Installer";

export default function InstallPreview({ props }: { props: Record<string, unknown> }) {
  return (
    <div className="w-full flex items-center justify-center">
      <a
        href={STORE_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative flex items-center gap-3 px-5 py-3 rounded-lg overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #0f172a 0%, #0b1220 100%)",
          border: "1px solid rgba(71,85,105,0.18)",
          boxShadow: "0 8px 24px rgba(2,6,23,0.6)",
        }}
      >
        <motion.span
          className="inline-flex items-center justify-center w-8 h-8 rounded-md bg-[rgba(71,85,105,0.18)]"
          animate={{ y: [0, -2, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        >
          <svg className="w-4 h-4 text-slate-200" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
            <path d="M12 3v12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M8 11l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <rect x="3" y="17" width="18" height="3" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
          </svg>
        </motion.span>

        <div className="flex flex-col text-left">
          <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400">Creator Store</span>
          <span className="text-sm font-semibold text-white">Install SlateUI Plugin</span>
        </div>

        <svg className="ml-2 w-4 h-4 text-slate-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
          <path d="M17 7l4 4-10 10H7V11L17 7z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </a>
    </div>
  );
}
