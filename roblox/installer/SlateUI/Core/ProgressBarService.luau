--[[
SlateUI – ProgressBarService
    Copyright 2026, Elias – All rights reserved.

API:
- ProgressBarService.Set(barObject, percent, instant, opts)

barObject: The root Frame of the progress bar.
percent: Number from 0 to 1 (0% to 100%).
instant: If true, sets instantly. Otherwise, tweens.
opts: { spring = true/false } -- enables spring/bounce effect.


--]]

local TweenService = game:GetService("TweenService")
local ProgressBarService = {}

local TWEEN_TIME = 0.3
local TWEEN_EASING = Enum.EasingStyle.Quad
local TWEEN_DIRECTION = Enum.EasingDirection.Out
local SPRING_EASING = Enum.EasingStyle.Back
local SPRING_DIRECTION = Enum.EasingDirection.Out

-- Helper: Find fill element and return (fillFrame, "minimal"|"regular")
local function getFill(barObject)
	if barObject:FindFirstChild("Bar") then
		return barObject.Bar, "minimal"
	elseif barObject:FindFirstChild("Fill_Container") and barObject.Fill_Container:FindFirstChild("Fill") then
		return barObject.Fill_Container.Fill, "regular"
	else
		return nil, nil
	end
end

-- Main API
function ProgressBarService.Set(barObject, percent, instant, opts)
	assert(barObject and typeof(barObject) == "Instance", "barObject must be a Frame")
	local fill, mode = getFill(barObject)
	assert(fill, "ProgressBar: Could not find fill element (Bar or Fill_Container.Fill)")
	percent = math.clamp(percent, 0, 1)
	opts = opts or {}

	local yScale = fill.Size.Y.Scale
	local yOffset = fill.Size.Y.Offset
	local newSize = UDim2.new(percent, 0, yScale, yOffset)

	if instant then
		fill.Size = newSize
	else
		local easing = opts.spring and SPRING_EASING or TWEEN_EASING
		local direction = opts.spring and SPRING_DIRECTION or TWEEN_DIRECTION
		TweenService:Create(fill, TweenInfo.new(TWEEN_TIME, easing, direction), {Size = newSize}):Play()
	end
end

return ProgressBarService
