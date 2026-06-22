-- SlateUI - LoadingService
-- MIT license

local TweenService = game:GetService("TweenService")
local ContentProvider = game:GetService("ContentProvider")
local ProgressBarService = require(script.Parent.ProgressBarService)

local LoadingService = {}

local FADE_TIME = 0.4
local EXIT_TIME = 0.5
local TYPEWRITER_SPEED = 0.025
local SKIP_TIMEOUT = 5 -- seconds

export type LoadingOpts = {
	typewriter: boolean?
}

local currentGui: GuiObject? = nil
local statusLabel: TextLabel? = nil
local logo: GuiObject? = nil
local progressBar: Frame? = nil
local countLabel: TextLabel? = nil
local skipFlag = false

-- helper: tween property
local function tween(obj: Instance, props: { [string]: any }, t: number?, easing: Enum.EasingStyle?)
	TweenService:Create(obj, TweenInfo.new(t or 0.2, easing or Enum.EasingStyle.Quad, Enum.EasingDirection.Out), props):Play()
end

-- helper: fade all descendants transparency
local function fadeElements(parent: GuiObject, targetAlpha: number, time: number)
	local tInfo = TweenInfo.new(time, Enum.EasingStyle.Quad, Enum.EasingDirection.Out)
	local elements = parent:GetDescendants()
	table.insert(elements, parent)

	for _, el in ipairs(elements) do
		if el:IsA("GuiObject") then
			TweenService:Create(el, tInfo, {BackgroundTransparency = targetAlpha}):Play()
		end
		if el:IsA("TextLabel") or el:IsA("TextBox") or el:IsA("TextButton") then
			TweenService:Create(el, tInfo, {TextTransparency = targetAlpha}):Play()
		end
		if el:IsA("ImageLabel") or el:IsA("ImageButton") then
			TweenService:Create(el, tInfo, {ImageTransparency = targetAlpha}):Play()
		end
		if el:IsA("UIStroke") then
			TweenService:Create(el, tInfo, {Transparency = targetAlpha}):Play()
		end
	end
end

-- typewriter effect
local function typewriter(label: TextLabel, text: string)
	label.Text = ""
	for i = 1, #text do
		label.Text = string.sub(text, 1, i)
		task.wait(TYPEWRITER_SPEED)
	end
end

-- fade text instantly or smoothly
local function fadeText(label: TextLabel, text: string)
	label.TextTransparency = 1
	label.Text = text
	tween(label, {TextTransparency = 0}, 0.25)
end

-- start loading screen
function LoadingService.Start(guiObject: GuiObject, assetsOrDuration: number | {string|Instance}, onComplete: (() -> ())?, opts: LoadingOpts?)
	opts = opts or {}
	currentGui = guiObject
	statusLabel = guiObject:FindFirstChild("Status") :: TextLabel
	logo = guiObject:FindFirstChild("Logo") :: GuiObject
	progressBar = guiObject:FindFirstChild("ProgressBar") :: Frame
	countLabel = guiObject:FindFirstChild("Count") :: TextLabel
	skipFlag = false

	-- fade in hardcoded from 1 to 0
	fadeElements(guiObject, 0, FADE_TIME)

	if statusLabel then
		statusLabel.Text = ""
	end

	if countLabel then
		countLabel.Text = ""
	end

	if progressBar then
		ProgressBarService.Set(progressBar, 0, true)
	end

	local done = false
	local function finish()
		done = true
		if onComplete then onComplete() end
	end

	-- if a number is passed, treat as duration (preset time mode)
	if typeof(assetsOrDuration) == "number" then
		local duration = assetsOrDuration :: number
		if progressBar then
			ProgressBarService.Set(progressBar, 0, true)
		end
		if countLabel then
			countLabel.Text = ""
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

	-- otherwise, treat as asset table
	local assets = assetsOrDuration :: {string|Instance}
	-- preload assets with progress
	local loaded = 0
	local total = #assets

	local function updateProgress()
		if progressBar then
			ProgressBarService.Set(progressBar, loaded / total, false)
		end
		if countLabel then
			countLabel.Text = tostring(loaded) .. "/" .. tostring(total)
		end
	end

	-- initial count label
	updateProgress()

	-- skip logic
	task.spawn(function()
		task.wait(SKIP_TIMEOUT)
		if not done then
			skipFlag = true
			LoadingService.UpdateStatus("loading took too long. skipping...")
			finish()
		end
	end)

	-- preload with progress
	for _, asset in ipairs(assets) do
		if skipFlag then break end
		ContentProvider:PreloadAsync({asset}, function()
			loaded = loaded + 1
			updateProgress()
		end)
	end
	finish()
end

-- update status message
function LoadingService.UpdateStatus(message: string, opts: LoadingOpts?)
	if not statusLabel then return end
	opts = opts or {}
	if opts and opts.typewriter then
		typewriter(statusLabel, message)
	else
		fadeText(statusLabel, message)
	end
end

-- exit loading screen
function LoadingService.Exit()
	if not currentGui then return end

	-- fade out hardcoded from 0 to 1
	fadeElements(currentGui, 1, EXIT_TIME)

	if logo then
		tween(logo, {Size = logo.Size + UDim2.new(0.1,0,0.1,0)}, EXIT_TIME, Enum.EasingStyle.Sine)
	end

	task.wait(EXIT_TIME + 0.1)
	currentGui:Destroy()
	currentGui = nil
	statusLabel = nil
	logo = nil
	progressBar = nil
	countLabel = nil
end

return LoadingService
