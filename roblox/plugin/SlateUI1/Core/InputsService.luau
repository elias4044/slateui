-- SlateUI - InputsService
-- MIT license

local TweenService = game:GetService("TweenService")
local UserInputService = game:GetService("UserInputService")
local ThemeService = require(script.Parent.ThemeService)

local InputsService = {}

local TWEEN_TIME = 0.2
local TWEEN_EASING = Enum.EasingStyle.Quad
local TWEEN_DIRECTION = Enum.EasingDirection.Out
local ACTIVE_COLOR = ThemeService.GetActiveColor()

-- helper: tween properties
local function tween(obj: GuiObject, props: { [string]: any })
	TweenService:Create(obj, TweenInfo.new(TWEEN_TIME, TWEEN_EASING, TWEEN_DIRECTION), props):Play()
end

-- helper: inputsink
local function createInputSink(parent: Instance): TextButton
	local sink = Instance.new("TextButton")
	sink.Name = "InputSink"
	sink.BackgroundTransparency = 1
	sink.Size = UDim2.fromScale(1, 1)
	sink.Position = UDim2.fromScale(0, 0)
	sink.ZIndex = 1e6
	sink.Text = ""
	sink.AutoButtonColor = false
	sink.Modal = true
	sink.Parent = parent
	return sink
end

-- helper: clean up connections
local function cleanup(conns: { RBXScriptConnection })
	for _, c in ipairs(conns) do
		if typeof(c) == "RBXScriptConnection" then c:Disconnect() end
	end
end

-- slider: track mouse x, tween knob color, block input, callback(value)
function InputsService.Slider(track: Frame, callback: ((number) -> ())?)
	local knob = track:FindFirstChild("Knob") :: Frame
	assert(knob, "slider: knob not found")
	local dragging = false
	local conns = {}
	local sink: TextButton? = nil

	local function setValueFromX(x: number)
		local rel = math.clamp((x - track.AbsolutePosition.X) / track.AbsoluteSize.X, 0, 1)
		local value = math.floor(rel * 100 + 0.5)
		knob.Position = UDim2.new(rel, -knob.AbsoluteSize.X/2, 0.5, -knob.AbsoluteSize.Y/2)
		if typeof(callback) == "function" then callback(value) end
	end

	table.insert(conns, knob.InputBegan:Connect(function(input: InputObject)
		if input.UserInputType == Enum.UserInputType.MouseButton1 then
			dragging = true
			tween(knob, {BackgroundColor3 = ACTIVE_COLOR})
			sink = createInputSink(track)
			table.insert(conns, UserInputService.InputChanged:Connect(function(inp: InputObject)
				if dragging and inp.UserInputType == Enum.UserInputType.MouseMovement then
					setValueFromX(inp.Position.X)
				end
			end))
			table.insert(conns, UserInputService.InputEnded:Connect(function(inp: InputObject)
				if inp.UserInputType == Enum.UserInputType.MouseButton1 and dragging then
					dragging = false
					tween(knob, {BackgroundColor3 = knob:GetAttribute("DefaultColor") or knob.BackgroundColor3})
					if sink then sink:Destroy() sink = nil end
				end
			end))
		end
	end))
	-- clean up on destroy
	if knob.AncestryChanged then
		table.insert(conns, knob.AncestryChanged:Connect(function(_, parent: Instance?)
			if not parent then
				cleanup(conns)
				if sink then sink:Destroy() end
			end
		end))
	end
	-- store default color
	knob:SetAttribute("DefaultColor", knob.BackgroundColor3)
end

-- text: tween uistroke color on focus, restore on lost, callback(text)
function InputsService.Text(frame: Frame, callback: ((string, boolean) -> ())?)
	local input = frame:FindFirstChild("Input") :: TextBox
	local stroke = frame:FindFirstChildOfClass("UIStroke") :: UIStroke
	assert(input and stroke, "text: input or uistroke not found")
	local defaultColor = stroke.Color
	local conns = {}
	table.insert(conns, input.Focused:Connect(function()
		tween(stroke, {Color = ACTIVE_COLOR})
	end))
	table.insert(conns, input.FocusLost:Connect(function(enter: boolean)
		tween(stroke, {Color = defaultColor})
		if typeof(callback) == "function" then callback(input.Text, enter) end
	end))
	if input.AncestryChanged then
		table.insert(conns, input.AncestryChanged:Connect(function(_, parent: Instance?)
			if not parent then cleanup(conns) end
		end))
	end
end

-- switch: toggle state, tween knob position and stroke, callback(state)
function InputsService.Switch(frame: Frame, callback: ((boolean) -> ())?)
	local knob = frame:FindFirstChild("Knob") :: Frame
	local stroke = frame:FindFirstChildOfClass("UIStroke") :: UIStroke
	local onTarget = frame:FindFirstChild("OnTarget") :: Frame
	local offTarget = frame:FindFirstChild("OffTarget") :: Frame
	assert(knob and stroke and onTarget and offTarget, "switch: missing child")
	local state = false
	local defaultColor = stroke.Color
	local conns = {}

	local function setState(s: boolean)
		state = s
		local target = state and onTarget or offTarget 	
		tween(knob, {Position = target.Position})
		tween(stroke, {Color = state and ACTIVE_COLOR or defaultColor})
		if typeof(callback) == "function" then callback(state) end
	end

	table.insert(conns, frame.InputBegan:Connect(function(input: InputObject)
		if input.UserInputType == Enum.UserInputType.MouseButton1 then
			setState(not state)
		end
	end))
	if frame.AncestryChanged then
		table.insert(conns, frame.AncestryChanged:Connect(function(_, parent: Instance?)
			if not parent then cleanup(conns) end
		end))
	end
end

return InputsService
