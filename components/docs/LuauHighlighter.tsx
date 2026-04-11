"use client";

// ─── Luau syntax highlighter — pure CSS classes, no external libs ─────────────
// Tokens are matched in order; first match wins.

type Token = { text: string; cls: string };

const RULES: [RegExp, string][] = [
  // Comments
  [/^--\[\[[\s\S]*?\]\]/,    "text-slate-600 italic"],
  [/^--[^\n]*/,              "text-slate-600 italic"],
  // Strings
  [/^"(?:[^"\\]|\\.)*"/,     "text-emerald-400"],
  [/^'(?:[^'\\]|\\.)*'/,     "text-emerald-400"],
  [/^\[\[[\s\S]*?\]\]/,      "text-emerald-400"],
  // Keywords
  [/^\b(and|break|continue|do|else|elseif|end|false|for|function|if|in|local|nil|not|or|repeat|return|then|true|until|while|type|export)\b/, "text-violet-400 font-semibold"],
  // Built-in globals
  [/^\b(print|require|game|workspace|script|math|table|string|pairs|ipairs|next|select|tostring|tonumber|typeof|assert|error|warn|task|coroutine|Instance|Vector2|Vector3|UDim2|UDim|Color3|TweenInfo|Enum)\b/, "text-sky-400"],
  // Numbers (hex, float, int)
  [/^0x[0-9a-fA-F]+/,        "text-amber-400"],
  [/^\d+\.?\d*(?:e[+-]?\d+)?/, "text-amber-400"],
  // Operators & punctuation
  [/^[+\-*/%^#&|~<>=!.,;:(){}\[\]]+/, "text-slate-400"],
  // Identifiers (method calls highlighted differently)
  [/^\b[A-Z][A-Za-z0-9_]*(?=\s*[.:(])/,  "text-cyan-300"],
  [/^\b[a-z_][A-Za-z0-9_]*(?=\s*[:(])/,  "text-blue-300"],
  [/^\b[A-Za-z_][A-Za-z0-9_]*/,           "text-slate-200"],
  // Whitespace & newlines
  [/^[ \t]+/,                ""],
  [/^\n/,                    ""],
  // Fallback
  [/^./,                     "text-slate-400"],
];

function tokenize(code: string): Token[] {
  const tokens: Token[] = [];
  let rest = code;
  while (rest.length > 0) {
    let matched = false;
    for (const [re, cls] of RULES) {
      const m = rest.match(re);
      if (m) {
        tokens.push({ text: m[0], cls });
        rest = rest.slice(m[0].length);
        matched = true;
        break;
      }
    }
    if (!matched) {
      tokens.push({ text: rest[0], cls: "text-slate-400" });
      rest = rest.slice(1);
    }
  }
  return tokens;
}

export function LuauHighlighter({ code }: { code: string }) {
  const tokens = tokenize(code);
  const lines = code.split("\n");
  const lineCount = lines.length;

  // Re-render tokens per line for line numbers
  const perLine: Token[][] = [];
  let acc: Token[] = [];
  for (const tok of tokens) {
    if (tok.text === "\n") {
      perLine.push(acc);
      acc = [];
    } else {
      acc.push(tok);
    }
  }
  perLine.push(acc);

  const lineNumWidth = String(lineCount).length;

  return (
    <div className="flex text-xs font-mono leading-relaxed overflow-x-auto">
      {/* Line numbers */}
      <div
        className="select-none pr-4 text-right text-slate-700 border-r border-[#1E1E1E] shrink-0"
        style={{ minWidth: `${lineNumWidth + 2}ch` }}
      >
        {perLine.map((_, i) => (
          <div key={i}>{i + 1}</div>
        ))}
      </div>
      {/* Highlighted code */}
      <div className="pl-4">
        {perLine.map((line, i) => (
          <div key={i} className="whitespace-pre">
            {line.length === 0 ? (
              <span>&nbsp;</span>
            ) : (
              line.map((tok, j) =>
                tok.cls ? (
                  <span key={j} className={tok.cls}>
                    {tok.text}
                  </span>
                ) : (
                  <span key={j}>{tok.text}</span>
                )
              )
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
