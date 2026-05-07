--[[
SlateUI – LoadingService
Copyright 2026, Elias – All rights reserved.

API:
- LoadingService.Start(guiObject, assets, onComplete)
- LoadingService.UpdateStatus(message, opts)
- LoadingService.Exit()

Hierarchy:
- guiObject (ScreenGui or Frame)
  - CanvasGroup (for fading)
  - Status (TextLabel)
  - Logo (Frame/ImageLabel, optional, for scale effect)
  - ProgressBar (Minimal: ProgressBar.Bar)

--]]

local TweenService = game:GetService("TweenService")
local ContentProvider = game:GetService("ContentProvider")
local RunService = game:GetService("RunService")
local ProgressBarService = require(script.Parent.ProgressBarService)

local LoadingService = {}

local FADE_TIME = 0.4
local EXIT_TIME = 0.5
local TYPEWRITER_SPEED = 0.025
local SKIP_TIMEOUT = 5 -- seconds

local currentGui, canvasGroup, statusLabel, logo, progressBar, skipFlag

-- Helper: Tween property
local function tween(obj, props, t, easing)
	TweenService:Create(obj, TweenInfo.new(t or 0.2, easing or Enum.EasingStyle.Quad, Enum.EasingDirection.Out), props):Play()
end

-- Typewriter effect
local function typewriter(label, text)
	label.Text = ""
	for i = 1, #text do
		label.Text = string.sub(text, 1, i)
		wait(TYPEWRITER_SPEED)
	end
end

-- Fade text instantly or smoothly
local function fadeText(label, text)
	label.TextTransparency = 1
	label.Text = text
	tween(label, {TextTransparency = 0}, 0.25)
end

-- Start loading screen
function LoadingService.Start(guiObject, assetsOrDuration, onComplete, opts)
	opts = opts or {}
	currentGui = guiObject
	canvasGroup = guiObject.Parent
	statusLabel = guiObject:FindFirstChild("Status")
	logo = guiObject:FindFirstChild("Logo")
	progressBar = guiObject:FindFirstChild("ProgressBar")
	skipFlag = false

	if canvasGroup then
		canvasGroup.GroupTransparency = 1
		tween(canvasGroup, {GroupTransparency = 0}, FADE_TIME)
	end

	if statusLabel then
		statusLabel.Text = ""
	end

	if progressBar then
		ProgressBarService.Set(progressBar, 0, true)
	end

	local done = false
	local function finish()
		done = true
		if onComplete then onComplete() end
	end

	-- If a number is passed, treat as duration (preset time mode)
	if typeof(assetsOrDuration) == "number" then
		local duration = assetsOrDuration
		if progressBar then
			ProgressBarService.Set(progressBar, 0, true)
		end
		local startTime = tick()
		while not skipFlag and (tick() - startTime) < duration do
			local elapsed = tick() - startTime
			local percent = math.clamp(elapsed / duration, 0, 1)
			if progressBar then
				ProgressBarService.Set(progressBar, percent, false)
			end
			task.wait(0.03)
		end
		finish()
		return
	end

	-- Otherwise, treat as asset table
	local assets = assetsOrDuration
	-- Preload assets with progress
	local loaded = 0
	local total = #assets

	local function updateProgress()
		if progressBar then
			ProgressBarService.Set(progressBar, loaded / total, false)
		end
	end

	-- Skip logic
	task.spawn(function()
		wait(SKIP_TIMEOUT)
		if not done then
			skipFlag = true
			LoadingService.UpdateStatus("Loading took too long. Skipping...")
			finish()
		end
	end)

	-- Preload with progress
	for _, asset in ipairs(assets) do
		if skipFlag then break end
		ContentProvider:PreloadAsync({asset}, function()
			loaded = loaded + 1
			updateProgress()
		end)
	end
	finish()
end

-- Update status message
function LoadingService.UpdateStatus(message, opts)
	if not statusLabel then return end
	opts = opts or {}
	if opts.typewriter then
		typewriter(statusLabel, message)
	else
		fadeText(statusLabel, message)
	end
end

-- Exit loading screen
function LoadingService.Exit()
	if not currentGui then return end
	if canvasGroup then
		tween(canvasGroup, {GroupTransparency = 1}, EXIT_TIME)
	end
	if logo then
		tween(logo, {Size = logo.Size + UDim2.new(0.1,0,0.1,0)}, EXIT_TIME, Enum.EasingStyle.Sine)
	end
	task.wait(EXIT_TIME + 0.1)
	currentGui:Destroy()
	currentGui = nil
	canvasGroup = nil
	statusLabel = nil
	logo = nil
	progressBar = nil
end

return LoadingService
