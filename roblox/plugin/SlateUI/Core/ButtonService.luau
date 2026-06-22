-- SlateUI - ButtonService
-- MIT license

local TweenService = game:GetService("TweenService")
local UserInputService = game:GetService("UserInputService")
local ThemeService = require(script.Parent.ThemeService)

local ButtonService = {}

-- helper: tween properties
local function tween(obj: GuiObject, props: { [string]: any }, t: number?, easing: Enum.EasingStyle?)
	TweenService:Create(obj, TweenInfo.new(t or 0.12, easing or Enum.EasingStyle.Quad, Enum.EasingDirection.Out), props):Play()
end

-- improved init: supports optional callbacks for press/release
-- theme can be a string ("primary", "secondary") or a custom theme table
function ButtonService.Init(button: GuiButton, theme: (string | ThemeService.Theme)?, onPress: ((GuiButton) -> ())?, onRelease: ((GuiButton) -> ())?)
	local stroke = button:FindFirstChildOfClass("UIStroke")
	local defaultSize = button.Size
	local pressedScale = UDim2.new(
		defaultSize.X.Scale * 0.95,
		math.floor(defaultSize.X.Offset * 0.98),
		defaultSize.Y.Scale * 0.95,
		math.floor(defaultSize.Y.Offset * 0.98)
	)

	-- select theme
	local THEME: ThemeService.Theme
	if typeof(theme) == "table" then
		THEME = theme
	elseif typeof(theme) == "string" then
		THEME = ThemeService.GetTheme(theme)
	else
		THEME = ThemeService.GetTheme("primary")
	end

	-- ensure scaling is from center
	if button.AnchorPoint ~= Vector2.new(0.5, 0.5) then
		button.AnchorPoint = Vector2.new(0.5, 0.5)
		if button.Position == UDim2.new(0,0,0,0) then
			button.Position = UDim2.new(0.5, 0, 0.5, 0)
		end
	end

	-- state tracking
	local isHovered = false
	local isPressed = false

	-- set initial state
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

	UserInputService.InputEnded:Connect(function(input: InputObject)
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