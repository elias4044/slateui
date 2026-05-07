-- SlateUI – Centralized button behavior for consistent hover/press effects
-- Copyright 2026, Elias – All rights reserved.


local TweenService = game:GetService("TweenService")
local UserInputService = game:GetService("UserInputService")
local ButtonService = {}


-- Centralized theme constants
local THEMES = {
	primary = {
		DefaultColor = Color3.fromRGB(71, 85, 105),
		HoverColor = Color3.fromRGB(61, 74, 91),
		PressColor = Color3.fromRGB(50, 60, 75),
		DefaultStroke = Color3.fromRGB(44, 54, 66),
		HoverStroke = Color3.fromRGB(53, 65, 79),
	},
	secondary = {
		DefaultColor = Color3.fromRGB(30, 30, 30),
		HoverColor = Color3.fromRGB(22, 22, 22),
		PressColor = Color3.fromRGB(13, 13, 13),
		DefaultStroke = Color3.fromRGB(42, 42, 42),
		HoverStroke = Color3.fromRGB(53, 53, 53),
	},
}

-- Helper: Tween properties
local function tween(obj, props, t, easing)
	TweenService:Create(obj, TweenInfo.new(t or 0.12, easing or Enum.EasingStyle.Quad, Enum.EasingDirection.Out), props):Play()
end

-- Improved Init: supports optional callbacks for press/release


-- theme can be a string ("primary", "secondary") or a custom theme table
function ButtonService.Init(button, theme, onPress, onRelease)
	local stroke = button:FindFirstChildOfClass("UIStroke")
	local defaultSize = button.Size
	local pressedScale = UDim2.new(
		defaultSize.X.Scale * 0.95,
		math.floor(defaultSize.X.Offset * 0.98),
		defaultSize.Y.Scale * 0.95,
		math.floor(defaultSize.Y.Offset * 0.98)
	)

	-- Select theme
	local THEME
	if typeof(theme) == "table" then
		THEME = theme
	elseif typeof(theme) == "string" and THEMES[theme] then
		THEME = THEMES[theme]
	else
		THEME = THEMES.primary
	end

	-- Ensure scaling is from center
	if button.AnchorPoint ~= Vector2.new(0.5, 0.5) then
		button.AnchorPoint = Vector2.new(0.5, 0.5)
		if button.Position == UDim2.new(0,0,0,0) then
			button.Position = UDim2.new(0.5, 0, 0.5, 0)
		end
	end

	-- State tracking
	local isHovered = false
	local isPressed = false

	-- Set initial state
	button.BackgroundColor3 = THEME.DefaultColor
	button.Size = defaultSize
	if stroke then stroke.Color = THEME.DefaultStroke end

	button.MouseEnter:Connect(function()
		isHovered = true
		if not isPressed then
			tween(button, {BackgroundColor3 = THEME.HoverColor})
			if stroke then tween(stroke, {Color = THEME.HoverStroke}) end
		end
	end)

	button.MouseLeave:Connect(function()
		isHovered = false
		if isPressed then
			isPressed = false
			tween(button, {BackgroundColor3 = THEME.DefaultColor, Size = defaultSize})
			if stroke then tween(stroke, {Color = THEME.DefaultStroke}) end
			if typeof(onRelease) == "function" then onRelease(button) end
		else
			tween(button, {BackgroundColor3 = THEME.DefaultColor, Size = defaultSize})
			if stroke then tween(stroke, {Color = THEME.DefaultStroke}) end
		end
	end)

	UserInputService.InputEnded:Connect(function(input)
		if input.UserInputType == Enum.UserInputType.MouseButton1 and isPressed then
			isPressed = false
			local targetColor = isHovered and THEME.HoverColor or THEME.DefaultColor
			tween(button, {BackgroundColor3 = targetColor, Size = defaultSize})
			if stroke then
				local targetStroke = isHovered and THEME.HoverStroke or THEME.DefaultStroke
				tween(stroke, {Color = targetStroke})
			end
			if typeof(onRelease) == "function" then onRelease(button) end
		end
	end)

	button.MouseButton1Down:Connect(function()
		isPressed = true
		tween(button, {BackgroundColor3 = THEME.PressColor, Size = pressedScale})
		if typeof(onPress) == "function" then onPress(button) end
	end)

	button.MouseButton1Up:Connect(function()
		isPressed = false
		local targetColor = isHovered and THEME.HoverColor or THEME.DefaultColor
		tween(button, {BackgroundColor3 = targetColor, Size = defaultSize})
		if stroke then
			local targetStroke = isHovered and THEME.HoverStroke or THEME.DefaultStroke
			tween(stroke, {Color = targetStroke})
		end
		if typeof(onRelease) == "function" then onRelease(button) end
	end)
end

return ButtonService