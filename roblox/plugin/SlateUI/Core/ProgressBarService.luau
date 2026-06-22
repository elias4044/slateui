-- SlateUI - ProgressbarService
-- MIT License

local TweenService = game:GetService("TweenService")
local ProgressBarService = {}

local TWEEN_TIME = 0.3
local TWEEN_EASING = Enum.EasingStyle.Quad
local TWEEN_DIRECTION = Enum.EasingDirection.Out
local SPRING_EASING = Enum.EasingStyle.Back
local SPRING_DIRECTION = Enum.EasingDirection.Out

export type ProgressBarOpts = {
	spring: boolean?
}

-- helper: find fill element and return (fillframe, "minimal"|"regular")
local function getFill(barObject: Frame): (Frame?, string?)
	if barObject:FindFirstChild("Bar") then
		return barObject.Bar :: Frame, "minimal"
	elseif barObject:FindFirstChild("Fill_Container") and (barObject.Fill_Container :: Frame):FindFirstChild("Fill") then
		return (barObject.Fill_Container :: Frame).Fill :: Frame, "regular"
	else
		return nil, nil
	end
end

-- main api
function ProgressBarService.Set(barObject: Frame, percent: number, instant: boolean?, opts: ProgressBarOpts?)
	assert(barObject and typeof(barObject) == "Instance", "barobject must be a frame")
	local fill, mode = getFill(barObject)
	assert(fill, "progressbar: could not find fill element (bar or fill_container.fill)")
	percent = math.clamp(percent, 0, 1)
	opts = opts or {}

	local yScale = fill.Size.Y.Scale
	local yOffset = fill.Size.Y.Offset
	local newSize = UDim2.new(percent, 0, yScale, yOffset)

	if instant then
		fill.Size = newSize
	else
		local easing = (opts and opts.spring) and SPRING_EASING or TWEEN_EASING
		local direction = (opts and opts.spring) and SPRING_DIRECTION or TWEEN_DIRECTION
		TweenService:Create(fill, TweenInfo.new(TWEEN_TIME, easing, direction), {Size = newSize}):Play()
	end
end

return ProgressBarService
