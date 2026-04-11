<div align="center">

<br />

<img src="https://raw.githubusercontent.com/elias4044/slateui/refs/heads/master/public/icon.svg" width="64" height="64" alt="SlateUI logo" />

<h1>SlateUI</h1>

**A modular, event-driven UI framework for Roblox.**  
Zero globals. Router-driven navigation. Single `require()`.

<br />

[![Roblox Plugin](https://img.shields.io/badge/Roblox%20Plugin-134225039028358-3B82F6?style=flat-square&logo=roblox&logoColor=white)](https://create.roblox.com/store/asset/134225039028358/SlateUI-Installer)
[![Docs](https://img.shields.io/badge/Documentation-slateui.elias4044.com-475569?style=flat-square)](https://slateui.elias4044.com/docs/installation)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)](https://nextjs.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38BDF8?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org)

<br />

</div>

---

## What is SlateUI?

SlateUI is a high-quality UI framework for **Roblox Studio** built around the idea that your UI code should be as clean as the rest of your game. It ships as a single Roblox plugin that injects seven purpose-built Luau services into your project — each one handling a distinct UI concern with zero global state, zero boilerplate.

```luau
-- The entire framework, one require()
local SlateUI = require(game.ReplicatedStorage.SlateUI)

-- Attach a button with hover + press animations
ButtonService.Init(script.Parent.ConfirmButton, "primary")

-- Show a server-side notification to every player
NotificationService.ServerNotifyAll("Round starting!", { status = "warning", duration = 4 })

-- Navigate between views with animated transitions
RouterService.Navigate("MainMenu", "Settings")
```

---

## Services

| Service | What it does |
|---|---|
| **ButtonService** | Hover, press, and release animations for any `TextButton`. Supports theme presets and fully custom `Color3` tables. |
| **InputsService** | Three input primitives: `Slider` (drag → 0–100), `Text` (focus tween + stroke highlight), `Switch` (animated toggle). |
| **NotificationService** | Client and server toast notifications. `Notify()`, `ServerNotify(player)`, `ServerNotifyAll()` — same API everywhere. |
| **ProgressBarService** | Tween or spring any progress bar to a 0–1 value. Auto-detects minimal and full-container layouts. |
| **LoadingService** | Full-screen loading controller. Asset preload or timed mode, live status text, typewriter reveal, auto-skip safety. |
| **ProximityService** | Auto-expand/collapse `BillboardGui` on tagged parts using distance + look-direction hysteresis. Tag once in Studio, zero per-part scripting. |
| **RouterService** | Multi-group, multi-view navigation. Slide transitions, open/close callbacks, auto-close buttons, toggle behaviour built in. |

---

## Installation

### Plugin (Recommended)

Install from the **Roblox Creator Store** — it automatically places the correct files into `ReplicatedStorage` and UI Components into `StarterGui`:

**[→ Install SlateUI Plugin](https://create.roblox.com/store/asset/134225039028358/SlateUI-Installer)**

Plugin ID: `134225039028358`

### Manual

Run this once in the Studio **Command Bar**:

```luau
local InsertService = game:GetService("InsertService")

local success, model = pcall(function()
    return InsertService:LoadAsset(134225039028358)
end)

if success then
    model.SlateUI.Parent = game.ReplicatedStorage
    print("SlateUI installed.")
end
```

---

## Docs Site

This repository also contains the full **SlateUI documentation website** — website with interactive component previews, Luau syntax highlighting, and live property controllers.

### Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 (strict) |
| Styling | Tailwind CSS v4 |
| Animations | Framer Motion 12 |
| Icons | Lucide React |
| Fonts | Raleway + JetBrains Mono (via `next/font`) |

### Running locally

```bash
cd slateui
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Building for production

```bash
npm run build
npm run start
```

### Project structure

```
slateui/
├── app/
│   ├── layout.tsx           # Root layout — fonts, metadata, OG tags
│   ├── page.tsx             # Landing page
│   ├── not-found.tsx        # Global 404
│   ├── global-error.tsx     # Root error boundary
│   ├── sitemap.ts           # Auto-generated /sitemap.xml
│   ├── robots.ts            # Auto-generated /robots.txt
│   └── docs/
│       ├── page.tsx         # Redirects → /docs/installation
│       ├── loading.tsx      # Skeleton loading state
│       ├── not-found.tsx    # Docs 404
│       ├── error.tsx        # Docs error boundary
│       └── [slug]/
│           └── page.tsx     # Dynamic doc page
├── components/
│   ├── landing/             # Hero, Nav, Pillars, Comparison, Gallery, CTA
│   └── docs/                # ContentRenderer, ComponentPreview, LuauHighlighter, previews…
├── lib/
│   └── docs.ts              # All documentation content (typed plain TS, no MDX)
└── RobloxServices/          # Source Luau files for each service
```

---

## Design decisions

**No MDX.** All doc content lives in `lib/docs.ts` as typed TypeScript objects. This makes content refactoring trivial, enables full IntelliSense, and removes a build-time dependency.

**No global state.** SlateUI services communicate through return values and callbacks — never through shared upvalues or `_G`.

**Single `require()`.** The entire framework is accessible from one module path. Services are lazily initialised — unused ones add zero overhead.

**Hysteresis in ProximityService.** Expand and shrink distances are intentionally different to prevent flickering at the boundary — a common oversight in proximity UI implementations.

---

## License

MIT — use freely in personal and commercial Roblox projects.

---

<div align="center">
<sub>Built with care for Roblox developers who care about their code.</sub>
</div>
