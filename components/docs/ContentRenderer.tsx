import type { DocSection } from "@/lib/docs";
import ComponentPreview from "@/components/docs/ComponentPreview";
import { LuauHighlighter } from "@/components/docs/LuauHighlighter";

export default function ContentRenderer({ sections }: { sections: DocSection[] }) {
  return (
    <div className="flex flex-col gap-10">
      {sections.map((section, i) => {
        switch (section.type) {
          case "TextSection":
            return <TextSection key={i} {...section} />;
          case "CodeBlock":
            return <CodeBlock key={i} {...section} />;
          case "PropTable":
            return <PropTable key={i} {...section} />;
          case "ComponentPreview":
            return (
              <ComponentPreview key={i} componentId={section.componentId} />
            );
        }
      })}
    </div>
  );
}

// ─── TextSection ──────────────────────────────────────────────────────────────

function TextSection({
  heading,
  body,
}: {
  heading?: string;
  body: string;
}) {
  return (
    <section>
      {heading && (
        <h2 className="text-xl font-semibold text-slate-100 mb-3 tracking-tight">
          {heading}
        </h2>
      )}
      <p className="text-slate-400 leading-7 text-[15px] max-w-prose">{body}</p>
    </section>
  );
}

// ─── CodeBlock ────────────────────────────────────────────────────────────────

function CodeBlock({
  language,
  code,
  caption,
}: {
  language: string;
  code: string;
  caption?: string;
}) {
  const isLuau = language === "luau";

  return (
    <div className="flex flex-col gap-2">
      {caption && (
        <p className="text-xs font-mono text-slate-500 uppercase tracking-widest">
          {caption}
        </p>
      )}
      <div className="rounded-xl border border-[#1E1E1E] bg-[#0B0B0B] overflow-hidden">
        {/* Language badge */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-[#1E1E1E]">
          <span className="text-[10px] font-mono uppercase tracking-widest text-slate-600">
            {language}
          </span>
        </div>
        <div className="px-4 py-4">
          {isLuau ? (
            <LuauHighlighter code={code} />
          ) : (
            <pre className="text-xs font-mono text-slate-300 leading-relaxed overflow-x-auto whitespace-pre">
              {code}
            </pre>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── PropTable ────────────────────────────────────────────────────────────────

function PropTable({
  heading,
  rows,
}: {
  heading?: string;
  rows: { name: string; type: string; default: string; description: string }[];
}) {
  return (
    <section>
      {heading && (
        <h2 className="text-xl font-semibold text-slate-100 mb-4 tracking-tight">
          {heading}
        </h2>
      )}
      <div className="rounded-xl border border-[#1E1E1E] overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead>
            <tr className="border-b border-[#1E1E1E] bg-[#0D0D0D]">
              {["Prop", "Type", "Default", "Description"].map((h) => (
                <th
                  key={h}
                  className="px-4 py-3 text-[10px] font-mono uppercase tracking-widest text-slate-600 font-normal"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr
                key={row.name}
                className={`border-b border-[#1E1E1E] last:border-0 transition-colors hover:bg-[#0F0F0F] ${
                  i % 2 === 0 ? "bg-[#0B0B0B]" : "bg-[#0D0D0D]"
                }`}
              >
                <td className="px-4 py-3 font-mono text-slate-200 text-xs whitespace-nowrap">
                  {row.name}
                </td>
                <td className="px-4 py-3 font-mono text-violet-400 text-xs whitespace-nowrap">
                  {row.type}
                </td>
                <td className="px-4 py-3 font-mono text-amber-400 text-xs whitespace-nowrap">
                  {row.default}
                </td>
                <td className="px-4 py-3 text-slate-400 text-xs leading-relaxed">
                  {row.description}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
