//
// SlateUI documentation data layer
// All doc pages are defined here as plain TypeScript objects.
// Saves a LOT of time. Trust me.
//

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


const componentsDoc: DocPage = {
  slug: "components",
  title: "UI Components",
  description: "Pre-built UI components and design resources for SlateUI.",
  sections: [
    {
      type: "TextSection",
      heading: "Overview",
      body: "SlateUI comes shipped with countless fully built UI Components, built to scale for every device and compatible with SlateUI's theming system. It includes frames, buttons, cards, inputs, loading screens, menus, notifications, progressbars, sidebars, and text elements.",
    },
    {
      type: "TextSection",
      heading: "Penpot Design File",
      body: "SlateUI also comes with a Penpot design file for easy designing and wireframing outside of Roblox Studio. You can use it to mock up your UI rapidly before implementation.\n\n[Download Penpot File](https://github.com/elias4044/slateui/releases/download/1.1.0/SlateUI.penpot)",
    },
    {
      type: "TextSection",
      heading: "Available Prebuilt Components",
      body: "The following component categories are available in the SlateUI model:\n\n- **Frames**: Basic structural elements for holding other UI components.\n- **Buttons**: Pre-configured buttons ready to be used with `ButtonService`.\n- **Cards**: Stylized containers for grouping related information.\n- **Inputs**: Text fields, sliders, and switches ready to be bound with `InputsService`.\n- **Loading Screens**: Full-screen layouts configured for `LoadingService`.\n- **Menus**: Navigational layouts for use with `RouterService`.\n- **Notifications**: Toast templates designed for `NotificationService`.\n- **Progressbars**: Status bars compatible with `ProgressBarService`.\n- **Sidebars**: Collapsible or static side navigation panels.\n- **Text**: Standardized text labels with SlateUI typography.",
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
      body: "Each tagged part must have a BillboardGui child containing two frames: Small (always visible at range) and Expanded (the panel that slides open when near). The service drives Expanded.Size and Expanded.BackgroundTransparency. A pre-made one is available in the SlateUI Services folder under Intereaction for easy setup.",
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
// CutsceneSystem
// ─────────────────────────────────────────────────────────────────────────────

const cutsceneDoc: DocPage = {
  slug: "cutscene",
  title: "CutsceneSystem",
  description:
    "A sequence-based cinematic controller. Chain camera movements, dialogues, screen effects, and character animations using a simple step-by-step table structure.",
  sections: [
    {
      type: "TextSection",
      heading: "Overview",
      body: "The Cutscene module locks the player's controls, takes over the camera, and processes an ordered sequence of events. Steps can run sequentially (one after another) or in parallel. It handles tweening, yielding, and cleanup automatically, ensuring the player is safely returned to normal gameplay when the sequence concludes.",
    },
    {
      type: "TextSection",
      heading: "Setup & Dependencies",
      body: "Place the Cutscene module in ReplicatedStorage. The module is built to seamlessly integrate with the SubtitleSystem and ScreenEffectsModule if they are present. It attempts to load them via safe pcalls:\n\n• Subtitles: ReplicatedStorage.Subtitles.SubtitleSystem\n• Effects: ReplicatedStorage.Effects.ScreenEffectsModule\n\nIf you prefer to load cutscenes by name rather than passing table data directly, store your sequence ModuleScripts in ReplicatedStorage.Cutscenes.CutsceneData.",
    },
    {
      type: "CodeBlock",
      language: "luau",
      caption: "Basic Usage — Inline Sequence",
      code: `local Cutscene = require(game.ReplicatedStorage.SlateUI.Cutscene)

local sequence = {
    -- 1. Snap camera to a part and fade in
    { Type = "SetCamera", CFrame = workspace.CutsceneCams.Cam1.CFrame },
    { Type = "FadeScreen", Direction = "In", Time = 1 },
    
    -- 2. Tween camera to another part over 4 seconds
    { Type = "MoveCamera", CFrame = workspace.CutsceneCams.Cam2.CFrame, Time = 4 },
    
    -- 3. Fade to black
    { Type = "FadeScreen", Direction = "Out", Time = 1 }
}

-- Play the cutscene (yields internally but runs asynchronously via task.spawn if needed)
Cutscene:Play(sequence)`,
    },
    {
      type: "CodeBlock",
      language: "luau",
      caption: "Advanced Usage — Parallel execution, Dialogue, and Events",
      code: `local Cutscene = require(game.ReplicatedStorage.SlateUI.Cutscene)

Cutscene:Play({
    { Type = "SetCamera", CFrame = workspace.Cams.Start.CFrame },
    { Type = "FadeScreen", Direction = "In", Time = 1 },
    
    -- Parallel = true means the next step starts IMMEDIATELY alongside this one
    { 
        Type = "MoveCamera", 
        CFrame = workspace.Cams.End.CFrame, 
        Time = 5, 
        Parallel = true 
    },
    
    -- This dialogue plays while the camera is still moving
    { 
        Type = "Dialogue", 
        Opt = { 
            character = "commander", 
            text = "Target sighted. Moving to intercept.", 
            duration = 3 
        } 
    },
    
    { Type = "Wait", Time = 2 },
    
    -- Fire a RemoteEvent to tell the server to spawn enemies
    { 
        Type = "FireEvent", 
        Event = game.ReplicatedStorage.Events.SpawnEnemies, 
        Args = { "Sector7" } 
    },
    
    -- Trigger a screen shake effect from the Effects module
    { 
        Type = "Effect", 
        Effect = "Shake", 
        Args = { 1, 15 } -- Duration 1s, Intensity 15
    },
    
    { Type = "FadeScreen", Direction = "Out", Time = 1 }
})`,
    },
    {
      type: "TextSection",
      heading: "Character Manipulation",
      body: "You can move NPCs or the player's character during a cutscene using the `MoveCharacter` and `AnimateCharacter` steps. MoveCharacter supports both physical walking (via Humanoid:MoveTo) and Tweening.",
    },
    {
      type: "CodeBlock",
      language: "luau",
      caption: "Walking and Animating NPCs",
      code: `local npc = workspace.NPCs.Guard

local seq = {
    -- Walk the NPC to a part
    { 
        Type = "MoveCharacter", 
        Character = npc, 
        Position = workspace.Waypoints.Door.Position, 
        Method = "Walk", 
        Speed = 16,
        Timeout = 5 -- Skip if they get stuck for 5 seconds
    },
    -- Turn NPC to face the player
    { 
        Type = "MoveCharacter", 
        Character = npc, 
        Face = game.Players.LocalPlayer.Character.PrimaryPart 
    },
    -- Play an animation track
    { 
        Type = "AnimateCharacter", 
        Character = npc, 
        AnimationId = "rbxassetid://1234567890" 
    }
}
Cutscene:Play(seq)`,
    },
    {
      type: "PropTable",
      heading: "API — Step Types & Properties",
      rows: [
        {
          name: "SetCamera / MoveCamera",
          type: "Step",
          default: "—",
          description: "Requires a `CFrame` property. `MoveCamera` also requires `Time` (number) to dictate the tween duration.",
        },
        {
          name: "AttachCamera / DetachCamera",
          type: "Step",
          default: "—",
          description: "Attaches the camera to a `Target` (BasePart or Attachment) on RenderStepped. Optional `Offset` (CFrame). Use `DetachCamera` to stop tracking.",
        },
        {
          name: "Dialogue",
          type: "Step",
          default: "—",
          description: "Passes the `Opt` (table) property directly to `SubtitleSystem:Show()`. Skips if Subtitles module is absent.",
        },
        {
          name: "Effect",
          type: "Step",
          default: "—",
          description: "Requires `Effect` (string, e.g., 'Shake', 'Glitch'). Passes `Args` (array) or `Time` to the ScreenEffects module.",
        },
        {
          name: "MoveCharacter",
          type: "Step",
          default: "—",
          description: "Requires `Character` (Model). Accepts `Position` (Vector3/BasePart), `Method` ('Walk' or 'Tween'), `Speed`, `Face` (Vector3/BasePart), and `Timeout`.",
        },
        {
          name: "FireEvent",
          type: "Step",
          default: "—",
          description: "Fires a RemoteEvent or BindableEvent provided in `Event`. Passes the array provided in `Args`.",
        },
        {
          name: "Run",
          type: "Step",
          default: "—",
          description: "Executes a custom function provided in `Action`. If the function returns a Tween or Signal, the step will yield until completion.",
        },
      ],
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// ScreenEffectsModule
// ─────────────────────────────────────────────────────────────────────────────

const effectsDoc: DocPage = {
  slug: "effects",
  title: "ScreenEffectsModule",
  description:
    "A powerful screen effects system. Apply blurs, glitches, camera shakes, and color tints with single function calls.",
  sections: [
    {
      type: "TextSection",
      heading: "Overview",
      body: "The Effects module dynamically creates necessary GUI elements (like full-screen frames and ImageLabels) and Lighting instances (BlurEffects) on the fly. It is entirely client-side and automatically handles Z-indexing and cleanup.",
    },
    {
      type: "TextSection",
      heading: "Setup",
      body: "No manual GUI setup is required! The module automatically constructs a `ScreenEffectsGui` inside the LocalPlayer's `PlayerGui` the first time an effect is called. It uses `RunService.RenderStepped` for high-performance visual loops.",
    },
    {
      type: "CodeBlock",
      language: "luau",
      caption: "Basic Usage",
      code: `local Effects = require(game.ReplicatedStorage.Effects.ScreenEffectsModule)

-- Fade out to black over 2 seconds
Effects:FadeIn(2)

task.wait(2)

-- Fade back to clear over 2 seconds
Effects:FadeOut(2)`,
    },
    {
      type: "CodeBlock",
      language: "luau",
      caption: "Advanced Usage — Combining Effects",
      code: `local Effects = require(game.ReplicatedStorage.Effects.ScreenEffectsModule)

-- Taking damage effect
local function onDamageTaken()
    -- Flash red quickly
    Effects:Strobe(0.5, Color3.fromRGB(255, 0, 0), 0.1)
    
    -- Shake the screen intensely for 0.3 seconds
    Effects:Shake(0.3, 15)
    
    -- Add a short glitch overlay to disorient the player
    Effects:Glitch(0.4, 8)
end`,
    },
    {
      type: "PropTable",
      heading: "API Methods",
      rows: [
        {
          name: "Effects:FadeIn(duration)",
          type: "Method",
          default: "duration: 1",
          description: "Tweens a full-screen black overlay from transparent to opaque.",
        },
        {
          name: "Effects:FadeOut(duration)",
          type: "Method",
          default: "duration: 1",
          description: "Tweens the full-screen black overlay from opaque to transparent.",
        },
        {
          name: "Effects:Blink(duration, color)",
          type: "Method",
          default: "dur: 1, col: White",
          description: "Quickly fades a colored overlay in and out over the specified duration.",
        },
        {
          name: "Effects:Glitch(duration, intensity)",
          type: "Method",
          default: "dur: 0.5, int: 5",
          description: "Overlays a jittering noise texture (rbxassetid://13754189844) over the screen.",
        },
        {
          name: "Effects:Shake(duration, intensity)",
          type: "Method",
          default: "dur: 0.5, int: 10",
          description: "Shakes the UI overlay layer randomly. Note: This simulates screen shake via 2D GUI offset, making it safe to use alongside locked 3D cameras.",
        },
        {
          name: "Effects:Tint(color, duration, intensity)",
          type: "Method",
          default: "dur: 1, int: 0.5",
          description: "Applies a persistent translucent colored overlay over the screen.",
        },
        {
          name: "Effects:Flicker(duration, min, max, speed)",
          type: "Method",
          default: "min: 0.3, max: 0.7, spd: 0.05",
          description: "Randomly modulates the transparency of a black overlay to simulate a flickering light/camera.",
        },
        {
          name: "Effects:Strobe(duration, color, speed)",
          type: "Method",
          default: "dur: 1, col: Red, spd: 0.1",
          description: "Harshly flashes a solid color on and off at a fixed interval. Great for alarms/warnings.",
        },
        {
          name: "Effects:Blur(intensity, duration)",
          type: "Method",
          default: "int: 24, dur: 1",
          description: "Tweens a Lighting BlurEffect. Set intensity to 0 to remove the blur.",
        },
      ],
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// SubtitleSystem
// ─────────────────────────────────────────────────────────────────────────────

const subtitlesDoc: DocPage = {
  slug: "subtitles",
  title: "SubtitleSystem",
  description:
    "A cinematic subtitle manager featuring a character registry, typewriter text effects, color-coded names, and synced voice blips.",
  sections: [
    {
      type: "TextSection",
      heading: "Overview",
      body: "Subtitles can be displayed manually or triggered automatically via the Cutscene module. By utilizing the Character Registry, you can define an NPC's display name, text color, and talking sound once, and the system will automatically format all of their lines.",
    },
    {
      type: "TextSection",
      heading: "GUI Hierarchy Requirements",
      body: "This module expects a specific GUI structure to exist in the player's PlayerGui. Ensure you have the following hierarchy created:\n\n`PlayerGui`\n └─ `SubtitleGui` (ScreenGui)\n      └─ `SubtitleContainer` (Frame)\n           └─ `SubtitleLabel` (TextLabel, with RichText enabled)",
    },
    {
      type: "CodeBlock",
      language: "luau",
      caption: "Global Configuration",
      code: `local Subtitles = require(game.ReplicatedStorage.Subtitles.SubtitleSystem)

-- You can mutate the global config table at runtime to fit your game's pacing
Subtitles.Config.TypeSpeed = 0.05        -- Seconds between each character in typewriter mode
Subtitles.Config.FadeTime = 0.3          -- UI fade in/out duration
Subtitles.Config.BackgroundOpacity = 0.6 -- How dark the container frame gets
Subtitles.Config.UseTypewriter = true    -- Default typewriter state for all subtitles`,
    },
    {
      type: "CodeBlock",
      language: "luau",
      caption: "Registering Characters",
      code: `Subtitles:RegisterCharacter("commander", {
    Name = "Cmdr. Shepard",
    Color = Color3.fromRGB(56, 189, 248),
    SoundId = "rbxassetid://123456789" -- Short blip sound played on reveal
})

Subtitles:RegisterCharacter("ai", {
    Name = "SYSTEM",
    Color = Color3.fromRGB(239, 68, 68),
    SoundId = "rbxassetid://987654321"
})`,
    },
    {
      type: "CodeBlock",
      language: "luau",
      caption: "Showing Subtitles & Using Callbacks",
      code: `-- Simple usage
Subtitles:Show({
    character = "commander",
    text = "We need to move, now!",
    duration = 3
})

-- Advanced usage with a callback when the subtitle finishes reading
Subtitles:Show({
    character = "ai",
    text = "WARNING: Core temperature critical.",
    duration = 4,
    typewriter = true,
    onComplete = function()
        print("Subtitle finished! Trigger explosion here.")
    end
})`,
    },
    {
      type: "PropTable",
      heading: "Show() Options Dictionary",
      rows: [
        {
          name: "text",
          type: "string",
          default: '""',
          description: "The line of dialogue to display. HTML tags are stripped during character counting.",
        },
        {
          name: "character",
          type: "string",
          default: "nil",
          description: "The ID of a pre-registered character to fetch Name, Color, and SoundId from.",
        },
        {
          name: "duration",
          type: "number",
          default: "2",
          description: "Time in seconds to keep the subtitle on screen after typing finishes.",
        },
        {
          name: "typewriter",
          type: "boolean",
          default: "Config default",
          description: "Overrides the global UseTypewriter config for this specific line.",
        },
        {
          name: "speaker / speakerColor",
          type: "string / Color3",
          default: "nil",
          description: "Allows you to bypass the registry and provide a one-off speaker name and color.",
        },
        {
          name: "onComplete",
          type: "function",
          default: "nil",
          description: "Task spawned when the subtitle duration ends and the fade-out begins.",
        },
      ],
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// Camera+
// ─────────────────────────────────────────────────────────────────────────────

const cameraPlusDoc: DocPage = {
  slug: "cameraplus",
  title: "Camera+",
  description:
    "An advanced first-person camera controller with dynamic FOV scaling, directional movement speeds, and an integrated stamina & exhaustion blur system.",
  sections: [
    {
      type: "TextSection",
      heading: "Overview",
      body: "Camera+ is a drop-in LocalScript replacement for the default Roblox camera. It forces a highly immersive first-person perspective by overriding the `CurrentCamera` to `Scriptable` mode. It features dynamic Field of View transitions based on movement state, smooth head-bobbing calculations, and a fully integrated stamina system.",
    },
    {
      type: "TextSection",
      heading: "Installation & Setup",
      body: "Because Camera+ completely overrides core Roblox camera and control mechanics on every RenderStepped frame, it **must** be placed in `StarterPlayerScripts` as a `LocalScript`. \n\nNo external modules are required. By default, it expects the character to have a `Humanoid` and `HumanoidRootPart`.",
    },
    {
      type: "CodeBlock",
      language: "luau",
      caption: "Configuration: Movement & FOV",
      code: `-- Found at the top of the Camera+ script
local walkspeeds = {
    enabled = true,
    walkingspeed = 12,        -- Default W key speed
    backwardsspeed = 10,      -- S key speed
    sidewaysspeed = 15,       -- A / D key speed
    diagonalspeed = 16,       -- W+A / W+D speed
    runningspeed = 20,        -- LShift speed
    runningFOV = 76,          -- FOV widens for a sense of speed
}`,
    },
    {
      type: "CodeBlock",
      language: "luau",
      caption: "Configuration: Stamina & Exhaustion",
      code: `-- The stamina system physically restricts running and applies screen effects
local StaminaSettings = {
    enabled = true,
    maxStamina = 100,
    drainRate = 10,           -- Stamina lost per second of running
    regenRate = 12.5,         -- Stamina gained per second walking/idle
    recoveryLimit = 25,       -- Stamina needed before you are allowed to run again
    blurThreshold = 20,       -- When stamina drops below this, blur begins
    maxBlur = 32,             -- The maximum intensity of the Lighting.BlurEffect
}`,
    },
    {
      type: "TextSection",
      heading: "Multi-Platform Support",
      body: "Camera+ is cross-platform ready out of the box:\n\n• **PC:** Mouse movement is tied to delta capture. The `F` key toggles mouse freedom (configurable via `CanToggleMouse`).\n• **Gamepad:** Bound to Thumbstick2 with a hardcoded `deadzone` of `0.1` to prevent controller drift. `X` and `Y` axes are correctly clamped.\n• **Mobile / Touch:** Delta swipes are normalized across screen space for smooth turning.",
    },
    {
      type: "TextSection",
      heading: "Body Visibility & Transparency",
      body: "The script runs an internal `updatechar()` loop. If `CanViewBody` is set to `true`, the script hides only the character's Head and accessories while keeping the torso and limbs visible. If set to `false`, it sets the `LocalTransparencyModifier` of the entire character to 1, acting as a pure floating camera.",
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// Registry — add new doc pages here
// ─────────────────────────────────────────────────────────────────────────────

const registry: Record<string, DocPage> = {
  installation: installationDoc,
  components: componentsDoc,
  button: buttonDoc,
  inputs: inputsDoc,
  notification: notificationDoc,
  progressbar: progressBarDoc,
  loading: loadingDoc,
  proximity: proximityDoc,
  router: routerDoc,
  cutscene:      cutsceneDoc,
  effects:       effectsDoc,
  subtitles:     subtitlesDoc,
  cameraplus:    cameraPlusDoc,
};

export function getDocBySlug(slug: string): DocPage | null {
  return registry[slug] ?? null;
}

export function getAllSlugs(): string[] {
  return Object.keys(registry);
}
