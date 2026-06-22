-- SlateUI - RouterService
-- MIT license

local TweenService = game:GetService("TweenService")

local RouterService = {}

export type ViewOpts = {
	direction: string?,
	tweenTime: number?,
	easing: Enum.EasingStyle?,
	onOpen: ((GuiObject) -> ())?,
	onClose: ((GuiObject) -> ())?,
	startVisible: boolean?
}

export type NavigateOpts = {
	onBefore: ((string?, string) -> ())?,
	onAfter: ((string, boolean) -> ())?
}

type ViewObject = {
	frame: GuiObject,
	canvasGroup: CanvasGroup?,
	direction: string,
	tweenTime: number,
	easing: Enum.EasingStyle,
	onOpen: ((GuiObject) -> ())?,
	onClose: ((GuiObject) -> ())?,
	Open: (ViewObject) -> (),
	Close: (ViewObject) -> ()
}

type Group = {
	views: { [string]: ViewObject },
	current: string?
}

-- internal state
local groups: { [string]: Group } = {}

-- default config for menu transitions
local DEFAULTS = {
	direction = "up",
	tweenTime = 0.4,
	easing = Enum.EasingStyle.Sine,
}

-- helper: get offscreen position for a frame based on direction
local function getOffscreenPosition(frame: GuiObject, direction: string): UDim2
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

-- animate menu in/out
local function animateMenu(frame: GuiObject, visible: boolean, direction: string, tweenTime: number, easing: Enum.EasingStyle)
	local originalPos = frame:GetAttribute("MenuService_OriginalPos") :: UDim2
	local targetPos = visible and originalPos or getOffscreenPosition(frame, direction)
	TweenService:Create(frame, TweenInfo.new(tweenTime, easing, Enum.EasingDirection.Out), {Position = targetPos}):Play()
end

-- helper: tween canvasgroup transparency
local function tweenGroupTransparency(canvasGroup: CanvasGroup?, target: number, t: number?, easing: Enum.EasingStyle?)
	if canvasGroup then
		TweenService:Create(canvasGroup, TweenInfo.new(t or 0.4, easing or Enum.EasingStyle.Sine, Enum.EasingDirection.Out), {GroupTransparency = target}):Play()
	end
end

-- register a view to a group
function RouterService.RegisterView(groupName: string, viewName: string, frame: GuiObject, opts: ViewOpts?)
	opts = opts or {}
	if not groups[groupName] then groups[groupName] = {views = {}, current = nil} end
	local group = groups[groupName]

	-- store original position for return
	if not frame:GetAttribute("MenuService_OriginalPos") then
		frame:SetAttribute("MenuService_OriginalPos", frame.Position)
	end

	local direction = (opts and opts.direction) or DEFAULTS.direction
	local tweenTime = (opts and opts.tweenTime) or DEFAULTS.tweenTime
	local easing = (opts and opts.easing) or DEFAULTS.easing
	local canvasGroup = frame:FindFirstChildWhichIsA("CanvasGroup")

	-- start hidden unless startVisible is true
	if opts and not opts.startVisible then
		frame.Position = getOffscreenPosition(frame, direction)
		frame.Visible = false
		if canvasGroup then canvasGroup.GroupTransparency = 1 end
	else
		frame.Visible = true
		if canvasGroup then canvasGroup.GroupTransparency = 0 end
	end

	-- view api
	local viewObj: ViewObject = {
		frame = frame,
		canvasGroup = canvasGroup,
		direction = direction,
		tweenTime = tweenTime,
		easing = easing,
		onOpen = opts and opts.onOpen,
		onClose = opts and opts.onClose,
		Open = function(self)
			frame.Visible = true
			animateMenu(frame, true, direction, tweenTime, easing)
			if canvasGroup then
				canvasGroup.GroupTransparency = 1
				tweenGroupTransparency(canvasGroup, 0, tweenTime, easing)
			end
			if self.onOpen then self.onOpen(frame) end
		end,
		Close = function(self)
			animateMenu(frame, false, direction, tweenTime, easing)
			if canvasGroup then tweenGroupTransparency(canvasGroup, 1, tweenTime, easing) end
			task.spawn(function()
				task.wait(tweenTime)
				frame.Visible = false
			end)
			if self.onClose then self.onClose(frame) end
		end
	}

	-- attach closebutton if present
	local closeBtn = frame:FindFirstChild("CloseButton") :: TextButton
	if closeBtn then
		closeBtn.MouseButton1Click:Connect(function()
			if group.current == viewName then
				viewObj:Close()
				group.current = nil
			end
		end)
	end

	group.views[viewName] = viewObj
end

-- navigate to a view in a group
function RouterService.Navigate(groupName: string, viewName: string, opts: NavigateOpts?)
	opts = opts or {}
	local group = groups[groupName]
	if not group then warn("no such group: "..tostring(groupName)); return end
	local target = group.views[viewName]
	if not target then warn("no such view: "..tostring(viewName)); return end

	-- if already on this view, toggle it off
	if group.current == viewName then
		target:Close()
		group.current = nil
		if opts and opts.onAfter then opts.onAfter(viewName, false) end
		return
	end

	local prev = group.current and group.views[group.current]
	if opts and opts.onBefore then opts.onBefore(group.current, viewName) end
	group.current = viewName

	-- animate out previous view
	if prev then prev:Close() end

	-- animate in new view
	target:Open()
	if opts and opts.onAfter then opts.onAfter(viewName, true) end
end

-- utility: get current view for a group
function RouterService.GetCurrent(groupName: string): string?
	local group = groups[groupName]
	return group and group.current or nil
end

-- utility: get all registered views for a group
function RouterService.GetViews(groupName: string): {string}
	local group = groups[groupName]
	if not group then return {} end
	local out = {}
	for k, _ in pairs(group.views) do table.insert(out, k) end
	return out
end

return RouterService
