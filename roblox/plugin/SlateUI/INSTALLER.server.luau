-- SlateUI Plugin Installer
-- Uses a pre-built InstallerUI Frame (child of this script) rendered inside a
-- DockWidgetPluginGui.

local TweenService = game:GetService("TweenService")

--  Toolbar 
local toolbar  = plugin:CreateToolbar("SlateUI")
local openBtn  = toolbar:CreateButton("SlateUI Installer", "Open the SlateUI installation wizard", "rbxassetid://108928475371560")
openBtn.ClickableWhenViewportHidden = true

--  Widget 
local widgetInfo = DockWidgetPluginGuiInfo.new(
	Enum.InitialDockState.Float,
	false, false,   -- starts hidden
	360, 560,       -- default size
	340, 420        -- minimum size
)
local widget       = plugin:CreateDockWidgetPluginGuiAsync("SlateUIInstaller", widgetInfo)
widget.Title       = "SlateUI Installer"
widget.ZIndexBehavior = Enum.ZIndexBehavior.Sibling

--  Source references 
local SOURCE     = script.Parent
local CORE       = SOURCE:FindFirstChild("Core")
local COMPONENTS = SOURCE:FindFirstChild("Components")
local EXTRA      = SOURCE:FindFirstChild("Extra")   -- optional; items need InstallTarget attribute

--  UI 
local uiTemplate = script:FindFirstChild("InstallerUI")
if not uiTemplate then
	warn("[SlateUI] InstallerUI Frame not found as a child of the INSTALLER script.")
	warn("[SlateUI] See UI_STRUCTURE.md in the plugin folder to build the required UI.")
	openBtn.Click:Connect(function() widget.Enabled = not widget.Enabled end)
	return
end

local ui = uiTemplate:Clone()
ui.Parent = widget

--  Switch wiring 
local TWEEN   = TweenInfo.new(0.18, Enum.EasingStyle.Quad, Enum.EasingDirection.Out)
local CLR_ON  = Color3.fromRGB(71, 85, 105)

local function wireSwitch(sw)
	local knob      = sw:FindFirstChild("Knob")
	local stroke    = sw:FindFirstChildOfClass("UIStroke")
	local onTarget  = sw:FindFirstChild("OnTarget")
	local offTarget = sw:FindFirstChild("OffTarget")

	if not (knob and stroke and onTarget and offTarget) then
		warn("[SlateUI] Switch '" .. sw:GetFullName() .. "' is missing required children (Knob, UIStroke, OnTarget, OffTarget).")
		return
	end

	local defaultColor = stroke.Color

	-- Initialise attribute if not set (default ON)
	if sw:GetAttribute("Enabled") == nil then
		sw:SetAttribute("Enabled", true)
	end

	local function applyState(state, animate)
		local targetPos = (state and onTarget or offTarget).Position
		if animate then
			TweenService:Create(knob,   TWEEN, { Position = targetPos }):Play()
			TweenService:Create(stroke, TWEEN, { Color = state and CLR_ON or defaultColor }):Play()
		else
			knob.Position = targetPos
			stroke.Color  = state and CLR_ON or defaultColor
		end
		sw:SetAttribute("Enabled", state)
	end

	applyState(sw:GetAttribute("Enabled"), false)

	sw.InputBegan:Connect(function(input)
		if input.UserInputType == Enum.UserInputType.MouseButton1 then
			applyState(not sw:GetAttribute("Enabled"), true)
		end
	end)
end

-- Wire every Switch inside an Items frame inside any Section_* frame
local function initSwitches()
	for _, section in ipairs(ui:GetDescendants()) do
		if section:IsA("Frame") and section.Name:sub(1, 8) == "Section_" then
			local items = section:FindFirstChild("Items")
			if not items then continue end
			for _, item in ipairs(items:GetChildren()) do
				if item:IsA("Frame") then
					local sw = item:FindFirstChild("Switch")
					if sw and sw:IsA("Frame") then
						wireSwitch(sw)
					end
				end
			end
		end
	end
end

--  Installation helpers 

-- Returns whether Item_<name>.Switch is enabled (defaults to true when missing)
local function isItemEnabled(section, name)
	local items = section:FindFirstChild("Items")
	if not items then return true end
	local item = items:FindFirstChild("Item_" .. name)
	if not item then return true end
	local sw = item:FindFirstChild("Switch")
	if not sw then return true end
	local v = sw:GetAttribute("Enabled")
	return v == nil or v == true
end

-- Guarantees a Folder exists at parent with the given name; returns it
local function ensureFolder(parent, name)
	local f = parent:FindFirstChild(name)
	if not f then
		f = Instance.new("Folder")
		f.Name   = name
		f.Parent = parent
	end
	return f
end

-- Clones src into dest; skips and logs if a child with the same name exists
local function installChild(src, dest, log, skipped)
	if dest:FindFirstChild(src.Name) then
		table.insert(skipped, src.Name)
	else
		src:Clone().Parent = dest
		table.insert(log, src.Name)
	end
end

--  Main install 
local function runInstall()
	local log     = {}   -- successfully installed names
	local skipped = {}   -- already-existed names
	local errors  = {}   -- error strings

	--  Modules (Core → ReplicatedStorage/SlateUI) 
	local modSection = ui:FindFirstChild("Section_Modules", true)
	if CORE and modSection then
		local dest = ensureFolder(game.ReplicatedStorage, "SlateUI")
		for _, child in ipairs(CORE:GetChildren()) do
			if isItemEnabled(modSection, child.Name) then
				installChild(child, dest, log, skipped)
			end
		end
	elseif not CORE then
		table.insert(errors, "Core folder missing from plugin source.")
	end

	--  Components (Components → StarterGui/SlateUI_Components) 
	local compSection = ui:FindFirstChild("Section_Components", true)
	if COMPONENTS and compSection then
		local dest       = ensureFolder(game.StarterGui, "SlateUI_Components")
		local anyInstalled = false

		for _, child in ipairs(COMPONENTS:GetChildren()) do
			-- Skip the init script here; we handle it separately below
			if child.Name == "SlateUI_Init" or child.ClassName == "LocalScript" then continue end
			if isItemEnabled(compSection, child.Name) then
				installChild(child, dest, log, skipped)
				anyInstalled = true
			end
		end

		-- Always co-install SlateUI_Init when at least one component is installed
		if anyInstalled then
			local init = COMPONENTS:FindFirstChild("SlateUI_Init")
			if init and not game.StarterGui:FindFirstChild("SlateUI_Init") then
				init:Clone().Parent = game.StarterGui
				table.insert(log, "SlateUI_Init")
			end
		end
	elseif not COMPONENTS then
		table.insert(errors, "Components folder missing from plugin source.")
	end

	--  Extras (custom install paths via InstallTarget attribute) 
	local extraSection = ui:FindFirstChild("Section_Extra", true)
	if EXTRA and extraSection then
		local items = extraSection:FindFirstChild("Items")
		if items then
			for _, item in ipairs(items:GetChildren()) do
				if not item:IsA("Frame") then continue end
				local itemName = item.Name:gsub("^Item_", "")
				local sw       = item:FindFirstChild("Switch")
				local enabled  = (not sw) or (sw:GetAttribute("Enabled") ~= false)
				if not enabled then continue end

				local source = EXTRA:FindFirstChild(itemName)
				if not source then
					table.insert(errors, "Extra source not found in plugin: '" .. itemName .. "'")
					continue
				end

				-- InstallTarget attribute on the source folder, e.g. "ServerScriptService"
				local targetName = source:GetAttribute("InstallTarget")
				if not targetName or targetName == "" then
					table.insert(errors, "Extra '" .. itemName .. "' has no InstallTarget attribute.")
					continue
				end

				local ok, targetService = pcall(function() return game:GetService(targetName) end)
				if not ok or not targetService then
					table.insert(errors, "Extra '" .. itemName .. "': unknown service '" .. targetName .. "'")
					continue
				end

				installChild(source, targetService, log, skipped)
			end
		end
	end

	--  Report 
	print(" SlateUI Installation Report ")
	if #log > 0 then
		print("Installed (" .. #log .. "):")
		for _, name in ipairs(log) do print("  ✓ " .. name) end
	end
	if #skipped > 0 then
		print("Skipped – already exist (" .. #skipped .. "):")
		for _, name in ipairs(skipped) do print("  – " .. name) end
	end
	if #errors > 0 then
		print("Errors (" .. #errors .. "):")
		for _, e in ipairs(errors) do warn("  ✗ " .. e) end
	end
	print("")

	--  Update status label in UI 
	local statusLabel = ui:FindFirstChild("StatusLabel", true)
	if statusLabel and statusLabel:IsA("TextLabel") then
		local hasErrors = #errors > 0
		statusLabel.Text = hasErrors
			and ("Done with " .. #errors .. " error(s) — check Output for details.")
			or  ("Installed " .. #log .. " item(s) successfully.")
		statusLabel.TextColor3 = hasErrors
			and Color3.fromRGB(248, 113, 113)
			or  Color3.fromRGB(74, 222, 128)
	end
end

--  Wire install button 
local installBtn = ui:FindFirstChild("InstallButton", true)
if installBtn and installBtn:IsA("TextButton") then
	installBtn.MouseButton1Click:Connect(runInstall)
else
	warn("[SlateUI] InstallButton TextButton not found inside InstallerUI.")
end

--  Boot 
initSwitches()

openBtn.Click:Connect(function()
	widget.Enabled = not widget.Enabled
end)