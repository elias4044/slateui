--[[ 

	This is a part of the SlateUI Library. https://slateui.elias4044.com
	
	This is a heavily modified fork of EvelienSterk's script.

	Copyright 2026 Elias - MIT Licensed
]]

task.wait(.5)
repeat wait() until game:GetService("Players").LocalPlayer.Character ~= nil
local runService = game:GetService("RunService")
local input = game:GetService("UserInputService")
local players = game:GetService("Players")

-- you can mess with these settings
CanToggleMouse = {allowed = true; activationkey = Enum.KeyCode.F;} -- lets you move your mouse around in firstperson
CanViewBody = true 		-- whether you see your body
Sensitivity = 0.8		-- anything higher would make looking up and down harder; recommend anything between 0~1
Smoothness = 0.1		-- recommend anything between 0~1
FieldOfView = 70		-- fov 
HeadOffset = CFrame.new(0,0.7,0) -- how far your camera is from your head

local cam = game.Workspace.CurrentCamera
local player = players.LocalPlayer
local m = player:GetMouse()
m.Icon = "http://www.roblox.com/asset/?id=569021388"
local character = player.Character or player.CharacterAdded:wait()
local human = character:WaitForChild("Humanoid")
local humanoidpart = character:WaitForChild("HumanoidRootPart")

local head = character:WaitForChild("Head")
local CamPos,TargetCamPos = cam.CoordinateFrame.Position,cam.CoordinateFrame.Position
local AngleX,TargetAngleX = 0,0
local AngleY,TargetAngleY = 0,0

local running = true
local freemouse = true
local defFOV = FieldOfView

local w, a, s, d, lshift = false, false, false, false, false

-- you can mess with these settings
local easingtime = 0.1 --0~1
local walkspeeds = {
	enabled =		  true;
	walkingspeed =		12;
	backwardsspeed =	10;
	sidewaysspeed =		15;
	diagonalspeed =		16;
	runningspeed =		20;
	runningFOV =		76;
}

-- Stamina Settings
local StaminaSettings = {
	enabled = 			true;
	maxStamina = 		100;
	drainRate = 		10; 	-- Stamina lost per second of running
	regenRate = 		12.5; 	-- Stamina gained per second when not running
	recoveryLimit = 	25; 	-- Stamina needed to be allowed to run again after hitting 0
	blurThreshold = 	20; 	-- Stamina amount when the screen starts to blur
	maxBlur = 			32; 	-- Maximum intensity of the blur when exhausted
}

local currentStamina = StaminaSettings.maxStamina
local canRun = true

-- Setup the Blur Effect for visual feedback
local blurEffect = game:GetService("Lighting"):FindFirstChild("ExhaustionBlur")
if not blurEffect then
	blurEffect = Instance.new("BlurEffect")
	blurEffect.Name = "ExhaustionBlur"
	blurEffect.Size = 0
	blurEffect.Parent = game:GetService("Lighting")
end

---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- 

function updatechar()
	for _, v in pairs(character:GetChildren())do
		if CanViewBody then
			if v.Name == 'Head' then
				v.LocalTransparencyModifier = 1
				v.CanCollide = false
			end
		else
			if v:IsA'Part' or v:IsA'UnionOperation' or v:IsA'MeshPart' then
				v.LocalTransparencyModifier = 1
				v.CanCollide = false
			end
		end
		if v:IsA'Accessory' then
			v:FindFirstChild('Handle').LocalTransparencyModifier = 1
			v:FindFirstChild('Handle').CanCollide = false
		end
		if v:IsA'Hat' then
			v:FindFirstChild('Handle').LocalTransparencyModifier = 1
			v:FindFirstChild('Handle').CanCollide = false
		end
	end
end

-- math, thx roblox wiki
function lerp(a, b, t)
	return a * (1-t) + (b*t)
end


---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- 

input.InputChanged:Connect(function(inputObject)

	-- MOUSE SUPPORT
	if inputObject.UserInputType == Enum.UserInputType.MouseMovement then
		local delta = Vector2.new(inputObject.Delta.x/Sensitivity,inputObject.Delta.y/Sensitivity) * Smoothness

		local X = TargetAngleX - delta.y 
		-- Clamp vertical angle to prevent looking too far up/down
		TargetAngleX = math.clamp(X, -80, 80)
		TargetAngleY = (TargetAngleY - delta.x) % 360 
	end	

	-- CONTROLLER SUPPORT
	if inputObject.UserInputType == Enum.UserInputType.Gamepad1
		and inputObject.KeyCode == Enum.KeyCode.Thumbstick2 then

		local deadzone = 0.1
		local sensitivity = 2.2

		local stick = inputObject.Position

		-- Deadzone (prevents drift)
		if math.abs(stick.X) < deadzone then stick = Vector2.new(0, stick.Y) end
		if math.abs(stick.Y) < deadzone then stick = Vector2.new(stick.X, 0) end

		local deltaX = stick.X * sensitivity
		local deltaY = stick.Y * sensitivity

		-- FIXED Y AXIS
		local X = TargetAngleX + deltaY
		TargetAngleX = math.clamp(X, -80, 80)

		TargetAngleY = (TargetAngleY - deltaX) % 360
	end

	-- MOBILE TOUCH SUPPORT
	if inputObject.UserInputType == Enum.UserInputType.Touch then
		local delta = inputObject.Delta

		local X = TargetAngleX - (delta.Y / Sensitivity) * Smoothness
		TargetAngleX = math.clamp(X, -80, 80)

		TargetAngleY = (TargetAngleY - (delta.X / Sensitivity) * Smoothness) % 360
	end
end)

input.InputBegan:Connect(function(inputObject)
	if inputObject.UserInputType == Enum.UserInputType.Keyboard then
		if inputObject.KeyCode == CanToggleMouse.activationkey then
			if CanToggleMouse.allowed and freemouse == false then
				freemouse = true
			else
				freemouse = false
			end
		end

		if inputObject.KeyCode == Enum.KeyCode.W then w = true end
		if inputObject.KeyCode == Enum.KeyCode.A then a = true end
		if inputObject.KeyCode == Enum.KeyCode.S then s = true end
		if inputObject.KeyCode == Enum.KeyCode.D then d = true end
		if inputObject.KeyCode == Enum.KeyCode.LeftShift then lshift = true end
	end
end)

input.InputEnded:Connect(function(inputObject)
	if inputObject.UserInputType == Enum.UserInputType.Keyboard then
		if inputObject.KeyCode == Enum.KeyCode.W then w = false end
		if inputObject.KeyCode == Enum.KeyCode.A then a = false end
		if inputObject.KeyCode == Enum.KeyCode.S then s = false end
		if inputObject.KeyCode == Enum.KeyCode.D then d = false end
		if inputObject.KeyCode == Enum.KeyCode.LeftShift then lshift = false end
	end
end)

---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- ---- 

-- Added dt (deltaTime) parameter for frame-rate independent stamina drain
runService.RenderStepped:Connect(function(dt) 

	if running then
		updatechar()

		CamPos = CamPos + (TargetCamPos - CamPos) *0.28
		AngleX = AngleX + (TargetAngleX - AngleX) *0.35
		local dist = TargetAngleY - AngleY
		dist = math.abs(dist) > 180 and dist - (dist / math.abs(dist)) * 360 or dist
		AngleY = (AngleY + dist *0.35) %360
		cam.CameraType = Enum.CameraType.Scriptable

		local root = character:FindFirstChild("HumanoidRootPart")
		local head = character:FindFirstChild("Head")

		if head then
			cam.CoordinateFrame = CFrame.new(head.Position)
				* CFrame.Angles(0, math.rad(AngleY), 0)
				* CFrame.Angles(math.rad(AngleX), 0, 0)
				* HeadOffset
		end

		if humanoidpart and root then
			if humanoidpart.Anchored then
				-- Only rotate the head, do NOT rotate the body/root
				if head then
					local headPos = head.Position
					head.CFrame = CFrame.new(headPos) * CFrame.Angles(0, math.rad(AngleY), 0)
				end
			else
				-- Not anchored: rotate the body as usual
				humanoidpart.CFrame = CFrame.new(humanoidpart.Position) * CFrame.Angles(0, math.rad(AngleY), 0)
			end
		end
	else
		game:GetService("UserInputService").MouseBehavior = Enum.MouseBehavior.Default
	end

	if (cam.Focus.p-cam.CoordinateFrame.p).magnitude < 1 then
		running = false
	else
		running = true
		if freemouse == true then
			game:GetService("UserInputService").MouseBehavior = Enum.MouseBehavior.Default
		else
			game:GetService("UserInputService").MouseBehavior = Enum.MouseBehavior.LockCenter
		end
	end

	if not CanToggleMouse.allowed then
		freemouse = false
	end

	cam.FieldOfView = FieldOfView

	if walkspeeds.enabled then
		-- Stamina System Updates
		local isTryingToRun = w and lshift and not s 

		if StaminaSettings.enabled then
			if isTryingToRun and canRun and human.MoveDirection.Magnitude > 0 then
				-- Drain Stamina
				currentStamina = math.clamp(currentStamina - (StaminaSettings.drainRate * dt), 0, StaminaSettings.maxStamina)
				if currentStamina <= 0 then
					canRun = false
				end
			else
				-- Recover Stamina
				currentStamina = math.clamp(currentStamina + (StaminaSettings.regenRate * dt), 0, StaminaSettings.maxStamina)
				if currentStamina >= StaminaSettings.recoveryLimit then
					canRun = true
				end
			end

			-- Dynamic screen blur feedback
			if currentStamina < StaminaSettings.blurThreshold then
				blurEffect.Size = StaminaSettings.maxBlur * (1 - (currentStamina / StaminaSettings.blurThreshold))
			else
				blurEffect.Size = 0
			end
		end

		local actuallyRunning = isTryingToRun and canRun

		-- Movement Speed Updates (Cleaned up structure for reliability)
		if w and s then 
			-- Don't update walkspeed if holding W and S simultaneously to avoid bug
		else
			if actuallyRunning then
				FieldOfView = lerp(FieldOfView, walkspeeds.runningFOV, easingtime)
				human.WalkSpeed = lerp(human.WalkSpeed, walkspeeds.runningspeed, easingtime)
			else
				FieldOfView = lerp(FieldOfView, defFOV, easingtime)

				if w and a then
					human.WalkSpeed = lerp(human.WalkSpeed, walkspeeds.diagonalspeed, easingtime)
				elseif w and d then
					human.WalkSpeed = lerp(human.WalkSpeed, walkspeeds.diagonalspeed, easingtime)
				elseif w then
					human.WalkSpeed = lerp(human.WalkSpeed, walkspeeds.walkingspeed, easingtime)
				elseif s and a then
					human.WalkSpeed = lerp(human.WalkSpeed, walkspeeds.backwardsspeed - (walkspeeds.diagonalspeed - walkspeeds.backwardsspeed), easingtime)
				elseif s and d then
					human.WalkSpeed = lerp(human.WalkSpeed, walkspeeds.backwardsspeed - (walkspeeds.diagonalspeed - walkspeeds.backwardsspeed), easingtime)
				elseif s then
					human.WalkSpeed = lerp(human.WalkSpeed, walkspeeds.backwardsspeed, easingtime)
				elseif d or a then
					human.WalkSpeed = lerp(human.WalkSpeed, walkspeeds.sidewaysspeed, easingtime)
				end	
			end
		end
	end

end)