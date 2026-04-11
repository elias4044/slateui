// ─────────────────────────────────────────────────────────────────────────────
// SlateUI documentation data layer
// All doc pages are defined here as plain TypeScript objects.
// Saves a LOT of time. Trust me.
// ─────────────────────────────────────────────────────────────────────────────

export type PropRow = {
  name: string;
  type: string;
  default: string;
  description: string;
};

export type DocSection =
  | { type: "TextSection"; heading?: string; body: string }
  | { type: "CodeBlock"; language: string; code: string; caption?: string }
  | { type: "PropTable"; heading?: string; rows: PropRow[] }
  | { type: "ComponentPreview"; componentId: string };

export type DocPage = {
  slug: string;
  title: string;
  description: string;
  sections: DocSection[];
};



const installationDoc: DocPage = {
  slug: "installation",
  title: "Installation",
  description: "Get SlateUI up and running in your Roblox Studio project in less than a minute.",
  sections: [
    {
      type: "TextSection",
      heading: "The Plugin Method (Recommended)",
      body: "The easiest way to install and update SlateUI is via the official Roblox Plugin. It automatically fetches the latest stable release and places the Core and Component folders into their correct directories.",
    },
      {
        type: "ComponentPreview",
        componentId: "install",
      },
    {
      type: "TextSection",
      heading: "Manual Model Injection",
      body: "If you prefer not to use plugins, you can manually require the initialization module from the Roblox Cloud. Run the following code once in your command bar to structure your workspace.",
    },
    {
      type: "CodeBlock",
      language: "luau",
      caption: "Run in Studio Command Bar",
      code: `local InsertService = game:GetService("InsertService")
local ASSET_ID = 123159360689128

local success, model = pcall(function()
    return InsertService:LoadAsset(ASSET_ID)
end)

if success then
    model.SlateUI.Parent = game.ReplicatedStorage
    print("SlateUI Installed Successfully")
end`,
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// ButtonService
// ─────────────────────────────────────────────────────────────────────────────

const buttonDoc: DocPage = {
  slug: "button",
  title: "ButtonService",
  description:
    "Adds hover, press, and release animations to any TextButton. Supports built-in theme presets and fully custom theme tables — no extra instances required.",
  sections: [
    {
      type: "TextSection",
      heading: "Overview",
      body: "ButtonService.Init() attaches all mouse event listeners to a TextButton and manages color and scale transitions via TweenService. It handles the edge case where the cursor leaves while the button is held — the button correctly resets on MouseLeave. AnchorPoint is automatically corrected to (0.5, 0.5) so the press-scale tween shrinks from the center.",
    },
    {
      type: "ComponentPreview",
      componentId: "button",
    },
    {
      type: "TextSection",
      heading: "Quick Use",
      body: "Pass the TextButton instance, a theme name, and optional press/release callbacks. The service takes over from there — no return value is needed for basic usage.",
    },
    {
      type: "CodeBlock",
      language: "luau",
      caption: "Minimal setup — primary theme",
      code: `local ButtonService = require(game.ReplicatedStorage.SlateUI.ButtonService)

-- Attach to any TextButton
ButtonService.Init(script.Parent.MyButton, "primary")`,
    },
    {
      type: "CodeBlock",
      language: "luau",
      caption: "With press and release callbacks",
      code: `ButtonService.Init(script.Parent.ConfirmButton, "primary",
    function(btn) -- onPress
        print("Button pressed:", btn.Name)
    end,
    function(btn) -- onRelease
        print("Button released:", btn.Name)
    end
)`,
    },
    {
      type: "TextSection",
      heading: "Built-in Themes",
      body: "Two presets are included: 'primary' uses the slate-600 palette (the default SlateUI accent), and 'secondary' uses a near-black palette for subtle ghost-style buttons. Both include separate DefaultColor, HoverColor, PressColor, DefaultStroke, and HoverStroke values.",
    },
    {
      type: "CodeBlock",
      language: "luau",
      caption: "Using the secondary theme",
      code: `ButtonService.Init(script.Parent.CancelButton, "secondary")`,
    },
    {
      type: "TextSection",
      heading: "Custom Themes",
      body: "Pass a table directly as the second argument instead of a string. Your table must include the five color keys: DefaultColor, HoverColor, PressColor, DefaultStroke, and HoverStroke — all Color3 values.",
    },
    {
      type: "CodeBlock",
      language: "luau",
      caption: "Fully custom theme — red destructive button",
      code: `local dangerTheme = {
    DefaultColor  = Color3.fromRGB(185, 28, 28),
    HoverColor    = Color3.fromRGB(220, 38, 38),
    PressColor    = Color3.fromRGB(153, 27, 27),
    DefaultStroke = Color3.fromRGB(127, 29, 29),
    HoverStroke   = Color3.fromRGB(185, 28, 28),
}

ButtonService.Init(script.Parent.DeleteButton, dangerTheme,
    function() print("Deleting...") end
)`,
    },
    {
      type: "PropTable",
      heading: "API — ButtonService.Init",
      rows: [
        {
          name: "button",
          type: "TextButton",
          default: "—",
          description: "The TextButton instance to attach behavior to.",
        },
        {
          name: "theme",
          type: '"primary" | "secondary" | table',
          default: '"primary"',
          description: 'Theme preset name or a custom table with five Color3 fields. Falls back to "primary" if unrecognized.',
        },
        {
          name: "onPress",
          type: "(button: TextButton) -> ()?",
          default: "nil",
          description: "Optional callback fired on MouseButton1Down.",
        },
        {
          name: "onRelease",
          type: "(button: TextButton) -> ()?",
          default: "nil",
          description: "Optional callback fired on MouseButton1Up or MouseLeave-while-pressed.",
        },
      ],
    },
    {
      type: "TextSection",
      heading: "How It Works Internally",
      body: "The service stores the button's original Size on init and computes a pressedScale at 95% of that size. A shared UserInputService.InputEnded listener ensures the button always resets even if the cursor teleports off-screen. The UIStroke child (if present) is tweened separately for the border color effect.",
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// InputsService
// ─────────────────────────────────────────────────────────────────────────────

const inputsDoc: DocPage = {
  slug: "inputs",
  title: "InputsService",
  description:
    "One service, three input primitives: Slider (drag), Text (focus), and Switch (toggle). Each attaches to an existing Roblox GUI hierarchy and fires a callback with the current value.",
  sections: [
    {
      type: "TextSection",
      heading: "Overview",
      body: "InputsService expects you to have already built the GUI hierarchy in Studio. Each function receives the root container and wires up all input logic, tweens, and cleanup internally. Connections are automatically disconnected when the root instance leaves the DataModel via AncestryChanged.",
    },
    {
      type: "TextSection",
      heading: "Slider",
      body: "Slider() tracks MouseMovement across the track's absolute width and converts it to a 0–100 integer. An invisible InputSink TextButton is injected into the track during a drag so no other GUI elements steal input.",
    },
    {
      type: "ComponentPreview",
      componentId: "slider",
    },
    {
      type: "CodeBlock",
      language: "luau",
      caption: "Wiring up a Slider",
      code: `local InputsService = require(game.ReplicatedStorage.SlateUI.InputsService)

-- Expected hierarchy:
--   SliderFrame (Frame)
--     └─ Knob (Frame / ImageLabel)

InputsService.Slider(script.Parent.SliderFrame, function(value: number)
    print("Slider →", value) -- 0 to 100
end)`,
    },
    {
      type: "CodeBlock",
      language: "luau",
      caption: "Advanced — live-update a TextLabel with the value",
      code: `local slider = script.Parent.VolumeSlider
local label  = script.Parent.VolumeLabel

InputsService.Slider(slider, function(value: number)
    label.Text = "Volume: " .. value .. "%"
    -- Drive game audio
    SoundService.AmbientReverb = value / 100
end)`,
    },
    {
      type: "TextSection",
      heading: "Text Input",
      body: "Text() tweens a UIStroke from its default color to the SlateUI active color (slate-600, RGB 71 85 105) when the TextBox gains focus, and restores it on FocusLost. The callback receives both the final text and a boolean indicating whether Enter was pressed.",
    },
    {
      type: "ComponentPreview",
      componentId: "text",
    },
    {
      type: "CodeBlock",
      language: "luau",
      caption: "Wiring up a Text input",
      code: `-- Expected hierarchy:
--   InputFrame (Frame)
--     ├─ Input (TextBox)
--     └─ UIStroke

InputsService.Text(script.Parent.InputFrame, function(text: string, submitted: boolean)
    if submitted then
        print("Submitted:", text)
    end
end)`,
    },
    {
      type: "CodeBlock",
      language: "luau",
      caption: "Advanced — validate on submit, show error stroke",
      code: `local frame  = script.Parent.UsernameField
local stroke = frame:FindFirstChildOfClass("UIStroke")

InputsService.Text(frame, function(text: string, submitted: boolean)
    if submitted then
        if #text < 3 then
            -- Flash a red stroke for invalid input
            stroke.Color = Color3.fromRGB(239, 68, 68)
            task.delay(1.5, function()
                stroke.Color = Color3.fromRGB(42, 42, 42)
            end)
        else
            print("Valid username:", text)
        end
    end
end)`,
    },
    {
      type: "TextSection",
      heading: "Switch",
      body: "Switch() toggles a boolean state on each MouseButton1 click. It tweens the Knob between two named position anchors (OnTarget and OffTarget) and tweens the UIStroke to the active color when on.",
    },
    {
      type: "ComponentPreview",
      componentId: "switch",
    },
    {
      type: "CodeBlock",
      language: "luau",
      caption: "Wiring up a Switch",
      code: `-- Expected hierarchy:
--   SwitchFrame (Frame)
--     ├─ Knob (Frame)
--     ├─ UIStroke
--     ├─ OnTarget  (Frame — marks the 'on' knob position)
--     └─ OffTarget (Frame — marks the 'off' knob position)

InputsService.Switch(script.Parent.SwitchFrame, function(state: boolean)
    print("Switch is now:", state)
end)`,
    },
    {
      type: "CodeBlock",
      language: "luau",
      caption: "Advanced — drive a setting from a switch",
      code: `local switch = script.Parent.MusicToggle

InputsService.Switch(switch, function(enabled: boolean)
    if enabled then
        SoundService.MusicVolume = 1
    else
        SoundService.MusicVolume = 0
    end
end)`,
    },
    {
      type: "PropTable",
      heading: "API",
      rows: [
        {
          name: "InputsService.Slider",
          type: "(track: Frame, callback: (value: number) -> ())",
          default: "—",
          description: "Attaches drag logic to track. Requires a Knob child. Fires callback with 0–100.",
        },
        {
          name: "InputsService.Text",
          type: "(frame: Frame, callback: (text: string, submitted: boolean) -> ())",
          default: "—",
          description: "Requires Input (TextBox) and UIStroke children. Fires callback on FocusLost.",
        },
        {
          name: "InputsService.Switch",
          type: "(frame: Frame, callback: (state: boolean) -> ())",
          default: "—",
          description: "Requires Knob, UIStroke, OnTarget, and OffTarget children.",
        },
      ],
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// NotificationService
// ─────────────────────────────────────────────────────────────────────────────

const notificationDoc: DocPage = {
  slug: "notification",
  title: "NotificationService",
  description:
    "A unified client/server notification system. Fire toasts from the server to individual players or all players, or trigger them locally on the client — same API either way.",
  sections: [
    {
      type: "TextSection",
      heading: "Overview",
      body: "NotificationService uses a single RemoteEvent (SlateUINotification, auto-created in ReplicatedStorage) to bridge server-to-client calls. The client listens for the event and renders toasts from a pre-built GUI template at GUI.SlateUI.Notification.List. Notifications fade in, optionally auto-dismiss, and can be manually closed.",
    },
    {
      type: "ComponentPreview",
      componentId: "notification",
    },
    {
      type: "TextSection",
      heading: "Client Usage",
      body: "Call Notify() from a LocalScript to show a notification immediately on the calling client. No server involvement needed for client-initiated toasts.",
    },
    {
      type: "CodeBlock",
      language: "luau",
      caption: "Client — simple info toast",
      code: `-- LocalScript
local NotificationService = require(game.ReplicatedStorage.SlateUI.NotificationService)

NotificationService.Notify("Settings saved.", { status = "success", duration = 3 })`,
    },
    {
      type: "CodeBlock",
      language: "luau",
      caption: "Client — all status variants",
      code: `NotificationService.Notify("Connection lost.",   { status = "error",   duration = 5 })
NotificationService.Notify("Match starting…",  { status = "warning", duration = 4 })
NotificationService.Notify("Round complete.",  { status = "success", duration = 3 })
NotificationService.Notify("New item found.",  { status = "info",    duration = 3 })`,
    },
    {
      type: "TextSection",
      heading: "Server Usage",
      body: "Use ServerNotify() to push a notification to a specific player, or ServerNotifyAll() to broadcast to every connected client. Both accept the same opts table as the client API.",
    },
    {
      type: "CodeBlock",
      language: "luau",
      caption: "Server — notify a single player",
      code: `-- Script (server)
local NotificationService = require(game.ReplicatedStorage.SlateUI.NotificationService)

game.Players.PlayerAdded:Connect(function(player)
    NotificationService.ServerNotify(player, "Welcome to the game!", {
        status   = "info",
        duration = 4,
    })
end)`,
    },
    {
      type: "CodeBlock",
      language: "luau",
      caption: "Server — broadcast to all players",
      code: `-- Announce a round start to everyone
NotificationService.ServerNotifyAll("Round 3 is starting!", {
    status   = "warning",
    duration = 5,
})`,
    },
    {
      type: "TextSection",
      heading: "Customizing Status Colors",
      body: "Status colors are defined in the STATUS_COLORS table inside NotificationService. Edit or extend it directly. The mapping is also exposed as NotificationService.STATUS_COLORS so you can reference or override it at runtime from another script.",
    },
    {
      type: "CodeBlock",
      language: "luau",
      caption: "Adding a custom status type",
      code: `local NotificationService = require(game.ReplicatedStorage.SlateUI.NotificationService)

-- Add a custom "system" status
NotificationService.STATUS_COLORS["system"] = Color3.fromRGB(139, 92, 246) -- violet

NotificationService.Notify("System update applied.", { status = "system", duration = 3 })`,
    },
    {
      type: "TextSection",
      heading: "GUI Hierarchy Required",
      body: "The GUI must exist at PlayerGui.SlateUI.Notification with a Base template frame inside a List container. The Base frame must contain a Text (TextLabel), a Status (Frame for the color indicator), and an optional Button (TextButton) for manual close and Icon (ImageLabel).",
    },
    {
      type: "PropTable",
      heading: "API",
      rows: [
        {
          name: "Notify",
          type: "(message: string, opts?: table) -> ()",
          default: "—",
          description: "Client-side. Shows a notification immediately on the local player's screen.",
        },
        {
          name: "ServerNotify",
          type: "(player: Player, message: string, opts?: table) -> ()",
          default: "—",
          description: "Server-side. Fires the RemoteEvent to one player.",
        },
        {
          name: "ServerNotifyAll",
          type: "(message: string, opts?: table) -> ()",
          default: "—",
          description: "Server-side. Fires the RemoteEvent to all connected players.",
        },
        {
          name: "opts.status",
          type: '"info" | "success" | "error" | "warning" | string',
          default: '"info"',
          description: "Controls the Status indicator color. Extensible via STATUS_COLORS.",
        },
        {
          name: "opts.duration",
          type: "number",
          default: "3",
          description: "Seconds before the notification auto-dismisses.",
        },
        {
          name: "STATUS_COLORS",
          type: "{ [string]: Color3 }",
          default: "—",
          description: "Exposed table — read or mutate to customize or extend status colors.",
        },
      ],
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// ProgressBarService
// ─────────────────────────────────────────────────────────────────────────────

const progressBarDoc: DocPage = {
  slug: "progressbar",
  title: "ProgressBarService",
  description:
    "Sets a progress bar to any 0–1 value with a smooth tween or an optional spring bounce. Supports both the minimal single-bar layout and a full fill-container layout.",
  sections: [
    {
      type: "TextSection",
      heading: "Overview",
      body: "ProgressBarService.Set() is a single-function API. It locates the correct fill element automatically by checking for a Bar child (minimal mode) or a Fill_Container.Fill hierarchy (regular mode), then tweens its X-axis scale to the target percentage.",
    },
    {
      type: "ComponentPreview",
      componentId: "progressbar",
    },
    {
      type: "CodeBlock",
      language: "luau",
      caption: "Minimal setup — tween to 75%",
      code: `local ProgressBarService = require(game.ReplicatedStorage.SlateUI.ProgressBarService)

-- barObject must contain a child named "Bar"
ProgressBarService.Set(script.Parent.MyProgressBar, 0.75)`,
    },
    {
      type: "CodeBlock",
      language: "luau",
      caption: "Instant set — no tween (e.g. on init)",
      code: `ProgressBarService.Set(script.Parent.MyProgressBar, 0, true)  -- instant reset to 0%`,
    },
    {
      type: "CodeBlock",
      language: "luau",
      caption: "Spring bounce effect",
      code: `-- Great for XP bars, achievement fills, etc.
ProgressBarService.Set(script.Parent.XPBar, 0.9, false, { spring = true })`,
    },
    {
      type: "TextSection",
      heading: "Advanced — Animated Loading Loop",
      body: "Drive the bar from a loop, updating it in real time. The tween time is 0.3s by default so frequent updates look smooth without jumping.",
    },
    {
      type: "CodeBlock",
      language: "luau",
      caption: "Real-time asset preload progress",
      code: `local ProgressBarService = require(game.ReplicatedStorage.SlateUI.ProgressBarService)
local ContentProvider = game:GetService("ContentProvider")

local assets = { ... } -- your asset list
local bar = script.Parent.LoadingBar
local loaded = 0

ProgressBarService.Set(bar, 0, true) -- reset

for _, asset in ipairs(assets) do
    ContentProvider:PreloadAsync({ asset }, function()
        loaded += 1
        ProgressBarService.Set(bar, loaded / #assets)
    end)
end

ProgressBarService.Set(bar, 1)        -- ensure 100% on finish`,
    },
    {
      type: "TextSection",
      heading: "GUI Hierarchy",
      body: "Minimal layout: a Frame with a direct child named Bar whose Size.X.Scale is driven by the service. Regular layout: a Frame with Fill_Container > Fill where Fill is sized. The service auto-detects which layout is present.",
    },
    {
      type: "PropTable",
      heading: "API — ProgressBarService.Set",
      rows: [
        {
          name: "barObject",
          type: "Frame",
          default: "—",
          description: "Root frame of the progress bar. Must have a Bar or Fill_Container.Fill child.",
        },
        {
          name: "percent",
          type: "number",
          default: "—",
          description: "Target fill amount, clamped 0–1.",
        },
        {
          name: "instant",
          type: "boolean",
          default: "false",
          description: "If true, sets the size immediately without tweening.",
        },
        {
          name: "opts.spring",
          type: "boolean",
          default: "false",
          description: "Uses Enum.EasingStyle.Back (overshoot) instead of Quad for a springy feel.",
        },
      ],
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// LoadingService
// ─────────────────────────────────────────────────────────────────────────────

const loadingDoc: DocPage = {
  slug: "loading",
  title: "LoadingService",
  description:
    "A full-featured loading screen controller. Fades in the GUI, drives a progress bar while preloading assets or counting down a fixed duration, then fades out and destroys itself.",
  sections: [
    {
      type: "TextSection",
      heading: "Overview",
      body: "LoadingService.Start() accepts either an asset table or a plain number (duration in seconds). In asset mode it preloads each asset via ContentProvider and updates a ProgressBar live. In duration mode it advances the bar over time. Both modes call an onComplete callback when finished. A skip safety fires automatically after 5 seconds if preloading stalls.",
    },
    {
      type: "CodeBlock",
      language: "luau",
      caption: "Asset preload mode",
      code: `-- LocalScript inside a ScreenGui
local LoadingService = require(game.ReplicatedStorage.SlateUI.LoadingService)

local assetsToLoad = {
    "rbxassetid://123456789",
    "rbxassetid://987654321",
}

LoadingService.Start(script.Parent, assetsToLoad, function()
    -- All assets loaded — transition to game
    LoadingService.UpdateStatus("Done! Entering world…")
    task.wait(0.5)
    LoadingService.Exit()
end)`,
    },
    {
      type: "CodeBlock",
      language: "luau",
      caption: "Timed mode — fixed duration loading bar",
      code: `-- Show a 3-second cinematic loading bar
LoadingService.Start(script.Parent, 3, function()
    LoadingService.Exit()
end)`,
    },
    {
      type: "TextSection",
      heading: "Updating Status Text",
      body: "UpdateStatus() sets the Status TextLabel in real time. It uses a fast fade-in by default. Pass { typewriter = true } in opts for a character-by-character reveal effect.",
    },
    {
      type: "CodeBlock",
      language: "luau",
      caption: "Status messages during loading",
      code: `-- Immediately update the status label
LoadingService.UpdateStatus("Connecting to server…")

-- Or with typewriter effect
LoadingService.UpdateStatus("Loading world data…", { typewriter = true })`,
    },
    {
      type: "TextSection",
      heading: "Advanced — Multi-Phase Loading",
      body: "Call UpdateStatus() between logical loading phases to give players feedback. The skip timeout only applies from the moment Start() is called, so long sync operations won't leave the screen stuck.",
    },
    {
      type: "CodeBlock",
      language: "luau",
      caption: "Multi-phase with status updates",
      code: `LoadingService.Start(script.Parent, coreAssets, function()
    LoadingService.UpdateStatus("Assets ready. Building world…")

    -- Simulate world-build step
    task.wait(1)

    LoadingService.UpdateStatus("Done!")
    task.wait(0.4)
    LoadingService.Exit()
end)`,
    },
    {
      type: "TextSection",
      heading: "GUI Hierarchy Required",
      body: "The guiObject (passed as the first argument) must be parented to a CanvasGroup for the fade effect. It should also contain: Status (TextLabel), optionally Logo (Frame/ImageLabel for scale-out on exit), and optionally ProgressBar (a frame compatible with ProgressBarService).",
    },
    {
      type: "PropTable",
      heading: "API",
      rows: [
        {
          name: "Start",
          type: "(gui: GuiObject, assetsOrDuration: {Instance} | number, onComplete: () -> (), opts?: table)",
          default: "—",
          description: "Fades in the GUI and begins loading. Calls onComplete when done.",
        },
        {
          name: "UpdateStatus",
          type: "(message: string, opts?: { typewriter: boolean? })",
          default: "—",
          description: "Updates the Status label. Use typewriter = true for a reveal animation.",
        },
        {
          name: "Exit",
          type: "() -> ()",
          default: "—",
          description: "Fades out the GUI, scales the Logo up, waits, then destroys the root frame.",
        },
      ],
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// ProximityService
// ─────────────────────────────────────────────────────────────────────────────

const proximityDoc: DocPage = {
  slug: "proximity",
  title: "ProximityService",
  description:
    "Automatically expands and collapses BillboardGui UI on parts tagged with 'SlateInteraction' based on camera distance and look direction — no per-part scripting required.",
  sections: [
    {
      type: "TextSection",
      heading: "Overview",
      body: "ProximityService runs on a Heartbeat loop and checks every managed part each frame. It uses hysteresis (separate expand/shrink thresholds) to prevent flickering at the boundary. A dot-product check ensures the player is also looking toward the part — distance alone is not enough to trigger expansion.",
    },
    {
      type: "CodeBlock",
      language: "luau",
      caption: "Initialize once in a LocalScript",
      code: `-- LocalScript in StarterPlayerScripts
local ProximityService = require(game.ReplicatedStorage.SlateUI.ProximityService)

ProximityService.Init()
-- That's all — it now manages every part tagged "SlateInteraction"`,
    },
    {
      type: "TextSection",
      heading: "Tagging Parts",
      body: "Open the Tag Editor in Studio (View → Tag Editor) and apply the 'SlateInteraction' tag to any BasePart. The service picks it up immediately via CollectionService — no restart required.",
    },
    {
      type: "TextSection",
      heading: "GUI Hierarchy Required",
      body: "Each tagged part must have a BillboardGui child containing two frames: Small (always visible at range) and Expanded (the panel that slides open when near). The service drives Expanded.Size and Expanded.BackgroundTransparency. A pre-made one is available in the SlateUI Services folder under ProximityExample for easy setup.",
    },
    {
      type: "CodeBlock",
      language: "luau",
      caption: "Hierarchy example",
      code: `-- Part (tagged "SlateInteraction")
--   └─ BillboardGui
--        ├─ Small    (Frame — the always-on chip)
--        └─ Expanded (Frame — the detail panel)`,
    },
    {
      type: "TextSection",
      heading: "Customizing Thresholds",
      body: "The constants EXPAND_DISTANCE, SHRINK_DISTANCE, EXPAND_DOT, and SHRINK_DOT are defined at the top of ProximityService. Increase EXPAND_DISTANCE for wider activation zones, or lower EXPAND_DOT to allow activation from a wider angle.",
    },
    {
      type: "CodeBlock",
      language: "luau",
      caption: "Default threshold values for reference",
      code: `local EXPAND_DISTANCE = 8   -- studs to trigger expand
local SHRINK_DISTANCE = 9   -- studs to trigger shrink (hysteresis gap)
local EXPAND_DOT      = 0.85 -- camera must be ~32° or less off-axis to expand
local SHRINK_DOT      = 0.80 -- shrinks if angle exceeds ~37°`,
    },
    {
      type: "PropTable",
      heading: "API",
      rows: [
        {
          name: "Init",
          type: "() -> ()",
          default: "—",
          description: "Scans for all tagged parts, sets up CollectionService listeners, and connects the Heartbeat loop.",
        },
        {
          name: "Update",
          type: "() -> ()",
          default: "—",
          description: "Called automatically each Heartbeat. Can also be called manually if you need frame-locked updates.",
        },
      ],
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// RouterService
// ─────────────────────────────────────────────────────────────────────────────

const routerDoc: DocPage = {
  slug: "router",
  title: "RouterService",
  description:
    "A multi-group view navigation system. Register named frames as views inside independent groups, then navigate between them with animated transitions — forward, back, or toggling.",
  sections: [
    {
      type: "TextSection",
      heading: "Overview",
      body: "RouterService manages any number of independent navigation groups (e.g., MainMenu, HUD, Settings). Each group tracks its current view and transitions between frames using positional tweens plus optional CanvasGroup fade. Pressing navigate on the currently-open view closes it (toggle behavior).",
    },
    {
      type: "CodeBlock",
      language: "luau",
      caption: "Quick start — two views in one group",
      code: `local RouterService = require(game.ReplicatedStorage.SlateUI.RouterService)

-- Register views
RouterService.RegisterView("MainMenu", "Home",     script.Parent.HomeFrame)
RouterService.RegisterView("MainMenu", "Settings", script.Parent.SettingsFrame)

-- Navigate to Home on startup
RouterService.Navigate("MainMenu", "Home")

-- Wire buttons
script.Parent.SettingsButton.MouseButton1Click:Connect(function()
    RouterService.Navigate("MainMenu", "Settings")
end)
script.Parent.BackButton.MouseButton1Click:Connect(function()
    RouterService.Navigate("MainMenu", "Home")
end)`,
    },
    {
      type: "TextSection",
      heading: "Transition Directions",
      body: "Each view can have its own enter/exit direction. The default is 'up' — the frame slides in from below and exits upward. Pass a direction in the opts table when registering.",
    },
    {
      type: "CodeBlock",
      language: "luau",
      caption: "Per-view directions",
      code: `RouterService.RegisterView("MainMenu", "Home", homeFrame, {
    direction  = "right",  -- "left" | "right" | "up" | "down"
    tweenTime  = 0.35,
    easing     = Enum.EasingStyle.Sine,
    startVisible = true,   -- start open instead of hidden
})

RouterService.RegisterView("MainMenu", "Profile", profileFrame, {
    direction = "left",
})`,
    },
    {
      type: "TextSection",
      heading: "Open and Close Callbacks",
      body: "Register onOpen and onClose callbacks per view. These fire synchronously before the tween plays, so you can pre-populate content before a frame is visible.",
    },
    {
      type: "CodeBlock",
      language: "luau",
      caption: "View lifecycle callbacks",
      code: `RouterService.RegisterView("MainMenu", "Store", storeFrame, {
    onOpen = function(frame)
        print("Store opened — fetch inventory here")
    end,
    onClose = function(frame)
        print("Store closed")
    end,
})`,
    },
    {
      type: "TextSection",
      heading: "Auto Close Button",
      body: "If a view's frame contains a child named CloseButton (TextButton), RouterService automatically connects MouseButton1Click to close the current view — no manual wiring needed.",
    },
    {
      type: "TextSection",
      heading: "Advanced — Navigate Callbacks and Multiple Groups",
      body: "RouterService.Navigate() accepts an opts table with onBefore and onAfter callbacks. onBefore fires with the old and new view names before any tween starts. onAfter fires after the new view opens.",
    },
    {
      type: "CodeBlock",
      language: "luau",
      caption: "Navigate with callbacks + multiple groups",
      code: `-- Two completely independent navigation stacks
RouterService.RegisterView("HUD",      "Main",   hudMain)
RouterService.RegisterView("HUD",      "Map",    hudMap)
RouterService.RegisterView("Settings", "Audio",  settingsAudio)
RouterService.RegisterView("Settings", "Video",  settingsVideo)

-- Navigate with lifecycle hooks
RouterService.Navigate("Settings", "Audio", {
    onBefore = function(from, to)
        print("Leaving", from, "→ going to", to)
    end,
    onAfter = function(view, opened)
        print(view, opened and "opened" or "toggled closed")
    end,
})`,
    },
    {
      type: "PropTable",
      heading: "API",
      rows: [
        {
          name: "RegisterView",
          type: "(group: string, name: string, frame: Frame, opts?: table)",
          default: "—",
          description: "Adds a frame to a named group. Creates the group automatically if it doesn't exist.",
        },
        {
          name: "Navigate",
          type: "(group: string, name: string, opts?: table)",
          default: "—",
          description: "Opens the named view and closes the previously open one. Toggling the current view closes it.",
        },
        {
          name: "GetCurrent",
          type: "(group: string) -> string?",
          default: "—",
          description: "Returns the name of the currently open view in the group, or nil.",
        },
        {
          name: "GetViews",
          type: "(group: string) -> {string}",
          default: "—",
          description: "Returns a list of all registered view names in the group.",
        },
        {
          name: "opts.direction",
          type: '"left" | "right" | "up" | "down"',
          default: '"up"',
          description: "Slide direction for enter/exit animation.",
        },
        {
          name: "opts.tweenTime",
          type: "number",
          default: "0.4",
          description: "Duration of the slide tween in seconds.",
        },
        {
          name: "opts.startVisible",
          type: "boolean",
          default: "false",
          description: "If true, the view starts in its natural position rather than offscreen.",
        },
        {
          name: "opts.onOpen",
          type: "(frame: Frame) -> ()?",
          default: "nil",
          description: "Fires when this view begins opening.",
        },
        {
          name: "opts.onClose",
          type: "(frame: Frame) -> ()?",
          default: "nil",
          description: "Fires when this view begins closing.",
        },
      ],
    },
  ],
};



// ─────────────────────────────────────────────────────────────────────────────
// Registry — add new doc pages here
// ─────────────────────────────────────────────────────────────────────────────

const registry: Record<string, DocPage> = {
  installation:  installationDoc,
  button:        buttonDoc,
  inputs:        inputsDoc,
  notification:  notificationDoc,
  progressbar:   progressBarDoc,
  loading:       loadingDoc,
  proximity:     proximityDoc,
  router:        routerDoc,
};

export function getDocBySlug(slug: string): DocPage | null {
  return registry[slug] ?? null;
}

export function getAllSlugs(): string[] {
  return Object.keys(registry);
}
