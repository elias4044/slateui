--!nonstrict
--[[ 
	Cutscenes System
	Author: Elias
	
	This is a part of the Slate UI Framework. https://slateui.elias4044.com
]]

local TweenService = game:GetService("TweenService")
local Players = game:GetService("Players")
local RunService = game:GetService("RunService")
local ContextActionService = game:GetService("ContextActionService")
local Debris = game:GetService("Debris")
local ReplicatedStorage = game:GetService("ReplicatedStorage")
local UserInputService = game:GetService("UserInputService")

-- === Types ===
export type CutsceneStep = {
	Type: string,
	Parallel: boolean?,
	Time: number?,
	[string]: any
}

local Cutscene = {}
Cutscene.__index = Cutscene

-- === Optional Dependencies ===
local function safeRequire(path: Instance?): any
	if path and path:IsA("ModuleScript") then
		local ok, result = pcall(require, path)
		if ok then return result end
		warn("[Cutscene] Failed to load module:", path.Name, "-", result)
	end
	return nil
end

local subtitlesFolder = ReplicatedStorage:FindFirstChild("Subtitles")
local Subtitles: any = safeRequire(if subtitlesFolder then subtitlesFolder:FindFirstChild("SubtitleSystem") else nil)

local effectsFolder = ReplicatedStorage:FindFirstChild("Effects")
local Effects: any = safeRequire(if effectsFolder then effectsFolder:FindFirstChild("ScreenEffectsModule") else nil)

-- === Helpers ===

local currentCameraConnection: RBXScriptConnection?
local FREEZE_ACTION_NAME = "CutsceneDisableMovement"

local function tweenCamera(camera: Camera, cf: CFrame, timeLength: number): Tween
	local tween = TweenService:Create(
		camera,
		TweenInfo.new(timeLength, Enum.EasingStyle.Sine, Enum.EasingDirection.InOut),
		{ CFrame = cf }
	)
	tween:Play()
	return tween
end

local function playAnim(character: Model, animId: string): AnimationTrack?
	local humanoid = character:FindFirstChildOfClass("Humanoid")
	if not humanoid then return nil end

	local animator = humanoid:FindFirstChildOfClass("Animator") or Instance.new("Animator", humanoid)
	local anim = Instance.new("Animation")
	anim.AnimationId = animId
	local track = animator:LoadAnimation(anim)
	track:Play()
	return track
end

local function togglePlayerControls(enable: boolean)
	local player = Players.LocalPlayer
	if not player then return end

	if enable then
		ContextActionService:UnbindAction(FREEZE_ACTION_NAME)
		UserInputService.MouseBehavior = Enum.MouseBehavior.Default
	else
		local actions = Enum.PlayerActions:GetEnumItems()
		ContextActionService:BindAction(
			FREEZE_ACTION_NAME,
			function() return Enum.ContextActionResult.Sink end,
			false,
			table.unpack(actions)
		)
		UserInputService.MouseBehavior = Enum.MouseBehavior.LockCenter
	end

	local playerGui = player:FindFirstChild("PlayerGui")
	if playerGui then
		local camHelpers = playerGui:FindFirstChild("Camera")
		if camHelpers then
			for _, scriptInstance in ipairs(camHelpers:GetChildren()) do
				if scriptInstance:IsA("Script") or scriptInstance:IsA("LocalScript") then
					scriptInstance.Enabled = enable
				end
			end
		end
	end
end

local function builtinFadeScreen(timeLength: number, direction: "In" | "Out")
	local player = Players.LocalPlayer
	if not player then return end

	local playerGui = player:FindFirstChild("PlayerGui")
	if not playerGui then return end

	local fadeGui = playerGui:FindFirstChild("CutsceneFadeGui") :: ScreenGui?
	if not fadeGui then
		fadeGui = Instance.new("ScreenGui")
		fadeGui.Name = "CutsceneFadeGui"
		fadeGui.IgnoreGuiInset = true
		fadeGui.DisplayOrder = 999
		fadeGui.Parent = playerGui

		local newFrame = Instance.new("Frame")
		newFrame.Size = UDim2.new(1, 0, 1, 0)
		newFrame.BackgroundColor3 = Color3.new(0, 0, 0)
		newFrame.BackgroundTransparency = 1
		newFrame.BorderSizePixel = 0
		newFrame.Parent = fadeGui
	end

	-- After the condition above, fadeGui is guaranteed to be a ScreenGui
	local activeGui = fadeGui :: ScreenGui
	local frame = activeGui:FindFirstChildOfClass("Frame")
	if not frame then return end

	local targetTransparency = if direction == "In" then 0 else 1
	local tween = TweenService:Create(
		frame, 
		TweenInfo.new(timeLength, Enum.EasingStyle.Sine), 
		{ BackgroundTransparency = targetTransparency }
	)
	tween:Play()
	tween.Completed:Wait()

	if direction == "Out" then
		activeGui:Destroy()
	end
end

-- === Step Handlers ===

local StepHandlers: { [string]: (CutsceneStep, Camera) -> () } = {}

function StepHandlers.SetCamera(step: CutsceneStep, camera: Camera)
	local targetCF = step.CFrame :: CFrame?
	if targetCF then
		camera.CFrame = targetCF
	end
end

function StepHandlers.MoveCamera(step: CutsceneStep, camera: Camera)
	local targetCF = step.CFrame :: CFrame?
	if not targetCF then return end
	local tween = tweenCamera(camera, targetCF, step.Time or 1)
	tween.Completed:Wait()
end

function StepHandlers.AttachCamera(step: CutsceneStep, camera: Camera)
	if currentCameraConnection then currentCameraConnection:Disconnect() end

	local target = step.Target :: (BasePart | Attachment)?
	local offset = (step.Offset :: CFrame?) or CFrame.new()

	if not target then 
		warn("[Cutscene] AttachCamera requires a Target (BasePart or Attachment)")
		return 
	end

	currentCameraConnection = RunService.RenderStepped:Connect(function()
		if target:IsA("BasePart") then
			camera.CFrame = target.CFrame * offset
		elseif target:IsA("Attachment") then
			camera.CFrame = target.WorldCFrame * offset
		end
	end)
end

function StepHandlers.DetachCamera(step: CutsceneStep, camera: Camera)
	if currentCameraConnection then
		currentCameraConnection:Disconnect()
		currentCameraConnection = nil
	end
end

function StepHandlers.TweenFOV(step: CutsceneStep, camera: Camera)
	local targetFOV = (step.FOV :: number?) or 70
	local tween = TweenService:Create(
		camera,
		TweenInfo.new(step.Time or 1, Enum.EasingStyle.Sine),
		{ FieldOfView = targetFOV }
	)
	tween:Play()
	if not step.Parallel then tween.Completed:Wait() end
end

function StepHandlers.Wait(step: CutsceneStep, camera: Camera)
	task.wait(step.Time or 1)
end

function StepHandlers.Dialogue(step: CutsceneStep, camera: Camera)
	if Subtitles and typeof(Subtitles.Show) == "function" then
		Subtitles:Show(step.Opt)
	else
		warn("[Cutscene] Subtitles module not found. Skipping dialogue.")
	end
end

function StepHandlers.Sound(step: CutsceneStep, camera: Camera)
	local sound = Instance.new("Sound")
	sound.SoundId = (step.SoundId :: string?) or ""
	sound.Volume = (step.Volume :: number?) or 1
	sound.Parent = workspace
	sound:Play()

	local duration = step.Time or sound.TimeLength
	if duration <= 0 then duration = 1 end

	Debris:AddItem(sound, duration + 0.5)
	task.wait(duration)
end

function StepHandlers.AnimateCharacter(step: CutsceneStep, camera: Camera)
	local character = step.Character :: Model?
	local animId = step.AnimationId :: string?
	if character and animId then
		playAnim(character, animId)
	end
end

function StepHandlers.Effect(step: CutsceneStep, camera: Camera)
	local effectName = step.Effect :: string?
	if effectName and Effects and typeof(Effects[effectName]) == "function" then
		local ok, err = pcall(function()
			if typeof(step.Args) == "table" then
				Effects[effectName](Effects, table.unpack(step.Args))
			else
				Effects[effectName](Effects, step.Time)
			end
		end)
		if not ok then warn("[Cutscene] Effect failed:", effectName, err) end
	else
		warn("[Cutscene] Effects module missing or unknown effect:", effectName)
	end
end

function StepHandlers.FadeScreen(step: CutsceneStep, camera: Camera)
	local directionStr = (step.Direction :: string?) or "In"
	local timeLength = step.Time or 1

	if directionStr == "In" or directionStr == "Out" then
		builtinFadeScreen(timeLength, directionStr)
	end
end

function StepHandlers.FireEvent(step: CutsceneStep, camera: Camera)
	local eventInst = step.Event :: Instance?
	if eventInst then
		local args = if typeof(step.Args) == "table" then step.Args else {}
		if eventInst:IsA("RemoteEvent") then
			eventInst:FireServer(table.unpack(args))
		elseif eventInst:IsA("BindableEvent") then
			eventInst:Fire(table.unpack(args))
		end
	end
end

function StepHandlers.MoveCharacter(step: CutsceneStep, camera: Camera)
	local character = step.Character :: Model?
	if not character then return end

	local humanoid = character:FindFirstChildOfClass("Humanoid")
	local root = character:FindFirstChild("HumanoidRootPart") :: BasePart?
	if not humanoid or not root then return end

	local destination = step.Position :: (BasePart | Vector3)?
	if not destination then return end

	local targetPos: Vector3 = if typeof(destination) == "Vector3" then destination else destination.Position
	local track: AnimationTrack?

	local animId = step.AnimationId :: string?
	if animId then
		track = playAnim(character, animId)
		local speed = step.AnimationSpeed :: number?
		if track and speed then
			track:AdjustSpeed(speed)
		end
	end

	local face = step.Face :: (BasePart | Vector3)?
	if face then
		local lookTarget = if typeof(face) == "Vector3" then face else face.Position
		root.CFrame = CFrame.lookAt(root.Position, Vector3.new(lookTarget.X, root.Position.Y, lookTarget.Z))
	end

	local distance = (targetPos - root.Position).Magnitude
	local method = (step.Method :: string?) or "Tween"

	if method == "Tween" then
		local travelSpeed = (step.Speed :: number?) or humanoid.WalkSpeed
		local travelTime = step.Time or (distance / travelSpeed)
		local targetCFrame: CFrame = if typeof(destination) == "Vector3" then CFrame.new(destination) else destination.CFrame

		local tween = TweenService:Create(
			root,
			TweenInfo.new(travelTime, Enum.EasingStyle.Linear),
			{ CFrame = targetCFrame }
		)
		tween:Play()

		local finished = false
		local conn = tween.Completed:Connect(function() finished = true end)
		local start = os.clock()
		local timeout = step.Timeout :: number?

		while not finished do
			if timeout and (os.clock() - start) > timeout then
				tween:Cancel()
				break
			end
			task.wait()
		end
		conn:Disconnect()

	else
		local customSpeed = step.Speed :: number?
		if customSpeed then humanoid.WalkSpeed = customSpeed end
		humanoid:MoveTo(targetPos)

		local reached = false
		local conn = humanoid.MoveToFinished:Connect(function() reached = true end)
		local start = os.clock()
		local timeout = step.Timeout :: number?

		while not reached do
			if timeout and (os.clock() - start) > timeout then
				break
			end
			task.wait()
		end
		conn:Disconnect()
	end

	if track then track:Stop() end
end

function StepHandlers.Run(step: CutsceneStep, camera: Camera)
	local action = step.Action :: any
	if typeof(action) ~= "function" then 
		warn("[Cutscene] Run action must be a function") 
		return 
	end
	local result = action()

	if typeof(result) == "RBXScriptSignal" then
		result:Wait()
	elseif typeof(result) == "Instance" and result:IsA("Tween") then
		result.Completed:Wait()
	elseif typeof(result) == "function" then
		result()
	end
end

-- === Main Logic ===

function Cutscene:Play(cutsceneData: string | {CutsceneStep})
	local camera = workspace.CurrentCamera
	if not camera then 
		warn("[Cutscene] CurrentCamera not found") 
		return 
	end

	local sequence: {CutsceneStep}

	if typeof(cutsceneData) == "string" then
		local cutscenesFolder = ReplicatedStorage:FindFirstChild("Cutscenes")
		local dataFolder = if cutscenesFolder then cutscenesFolder:FindFirstChild("CutsceneData") else nil
		local cutsceneModule = if dataFolder then dataFolder:FindFirstChild(cutsceneData) else nil

		if not cutsceneModule or not cutsceneModule:IsA("ModuleScript") then
			warn("[Cutscene] Cutscene not found or invalid in ReplicatedStorage:", cutsceneData)
			return
		end
		sequence = require(cutsceneModule) :: any
	elseif typeof(cutsceneData) == "table" then
		sequence = cutsceneData
	else
		warn("[Cutscene] Invalid arguments passed to Cutscene:Play()")
		return
	end

	local originalCF = camera.CFrame
	local originalFOV = camera.FieldOfView

	togglePlayerControls(false)
	camera.CameraType = Enum.CameraType.Scriptable

	-- Execute sequence steps
	for _, step in ipairs(sequence) do
		local handler = StepHandlers[step.Type]
		if not handler then
			warn("[Cutscene] Unknown step type:", step.Type)
			continue
		end

		if step.Parallel then
			task.spawn(function()
				handler(step, camera)
			end)
		else
			handler(step, camera)
		end
	end

	-- Cleanup and restore standard environment state
	if currentCameraConnection then
		currentCameraConnection:Disconnect()
		currentCameraConnection = nil
	end

	camera.CameraType = Enum.CameraType.Custom
	camera.CFrame = originalCF
	camera.FieldOfView = originalFOV
	togglePlayerControls(true)
end

return Cutscene