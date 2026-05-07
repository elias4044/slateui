--[[
SlateUI – RouterService
Copyright 2026, Elias – All rights reserved.

API:
- RouterService.RegisterView(groupName, viewName, frame, opts)
- RouterService.Navigate(groupName, viewName)

- Each group is an independent navigation stack (e.g., MainMenu, HUD, etc)
- Uses MenuService for movement and CanvasGroup for fading.
--]]


local TweenService = game:GetService("TweenService")

local RouterService = {}

-- Internal state
local groups = {}

-- Default config for menu transitions
local DEFAULTS = {
	direction = "up", -- "left", "right", "up", "down"
	tweenTime = 0.4,
	easing = Enum.EasingStyle.Sine,
}

-- Helper: get offscreen position for a frame based on direction
local function getOffscreenPosition(frame, direction)
	local pos = frame.Position
	if direction == "right" then
		return UDim2.new(1.5, 0, pos.Y.Scale, pos.Y.Offset)
	elseif direction == "left" then
		return UDim2.new(-0.5, 0, pos.Y.Scale, pos.Y.Offset)
	elseif direction == "up" then
		return UDim2.new(pos.X.Scale, pos.X.Offset, -1, 0)
	elseif direction == "down" then
		return UDim2.new(pos.X.Scale, pos.X.Offset, 2, 0)
	else
		return pos
	end
end

-- Animate menu in/out
local function animateMenu(frame, visible, direction, tweenTime, easing)
	local targetPos = visible and frame:GetAttribute("MenuService_OriginalPos") or getOffscreenPosition(frame, direction)
	TweenService:Create(frame, TweenInfo.new(tweenTime, easing, Enum.EasingDirection.Out), {Position = targetPos}):Play()
end

-- Helper: Tween CanvasGroup transparency
local function tweenGroupTransparency(canvasGroup, target, t, easing)
	if canvasGroup then
		TweenService:Create(canvasGroup, TweenInfo.new(t or 0.4, easing or Enum.EasingStyle.Sine, Enum.EasingDirection.Out), {GroupTransparency = target}):Play()
	end
end

-- Register a view to a group


-- Register a view to a group
-- opts: {direction, tweenTime, easing, onOpen, onClose, startVisible}
function RouterService.RegisterView(groupName, viewName, frame, opts)
	opts = opts or {}
	groups[groupName] = groups[groupName] or {views = {}, current = nil}
	local group = groups[groupName]

	-- Store original position for return
	if not frame:GetAttribute("MenuService_OriginalPos") then
		frame:SetAttribute("MenuService_OriginalPos", frame.Position)
	end

	local direction = opts.direction or DEFAULTS.direction
	local tweenTime = opts.tweenTime or DEFAULTS.tweenTime
	local easing = opts.easing or DEFAULTS.easing
	local canvasGroup = frame:FindFirstChild("CanvasGroup")

	-- Start hidden unless startVisible is true
	if not opts.startVisible then
		frame.Position = getOffscreenPosition(frame, direction)
		frame.Visible = false
		if canvasGroup then canvasGroup.GroupTransparency = 1 end
	else
		frame.Visible = true
		if canvasGroup then canvasGroup.GroupTransparency = 0 end
	end

	-- View API
	local viewObj = {
		frame = frame,
		canvasGroup = canvasGroup,
		direction = direction,
		tweenTime = tweenTime,
		easing = easing,
		onOpen = opts.onOpen,
		onClose = opts.onClose,
	}

	-- Open/Close logic
	function viewObj:Open()
		frame.Visible = true
		animateMenu(frame, true, direction, tweenTime, easing)
		if canvasGroup then
			canvasGroup.GroupTransparency = 1
			tweenGroupTransparency(canvasGroup, 0, tweenTime, easing)
		end
		if self.onOpen then self.onOpen(frame) end
	end
	function viewObj:Close()
		animateMenu(frame, false, direction, tweenTime, easing)
		if canvasGroup then tweenGroupTransparency(canvasGroup, 1, tweenTime, easing) end
		task.spawn(function()
			task.wait(tweenTime)
			frame.Visible = false
		end)
		if self.onClose then self.onClose(frame) end
	end

	-- Attach CloseButton if present
	if frame:FindFirstChild("CloseButton") then
		frame.CloseButton.MouseButton1Click:Connect(function()
			if group.current == viewName then
				viewObj:Close()
				group.current = nil
			end
		end)
	end

	group.views[viewName] = viewObj
end

-- Navigate to a view in a group


-- Navigate to a view in a group
-- opts: {onBefore, onAfter}
function RouterService.Navigate(groupName, viewName, opts)
	opts = opts or {}
	local group = groups[groupName]
	if not group then warn("No such group: "..tostring(groupName)); return end
	local target = group.views[viewName]
	if not target then warn("No such view: "..tostring(viewName)); return end

	-- If already on this view, toggle it off
	if group.current == viewName then
		target:Close()
		group.current = nil
		if opts.onAfter then opts.onAfter(viewName, false) end
		return
	end

	local prev = group.current and group.views[group.current]
	if opts.onBefore then opts.onBefore(group.current, viewName) end
	group.current = viewName

	-- Animate out previous view
	if prev then prev:Close() end

	-- Animate in new view
	target:Open()
	if opts.onAfter then opts.onAfter(viewName, true) end
end

-- Utility: get current view for a group
function RouterService.GetCurrent(groupName)
	local group = groups[groupName]
	return group and group.current or nil
end

-- Utility: get all registered views for a group
function RouterService.GetViews(groupName)
	local group = groups[groupName]
	if not group then return {} end
	local out = {}
	for k, _ in pairs(group.views) do table.insert(out, k) end
	return out
end

return RouterService
