-- ProximityService ModuleScript for SlateUI
-- Handles proximity-based UI expansion for parts tagged with 'SlateInteraction'

local CollectionService = game:GetService("CollectionService")
local RunService = game:GetService("RunService")
local TweenService = game:GetService("TweenService")
local Players = game:GetService("Players")

local ProximityService = {}



local TAG = "SlateInteraction"
local EXPAND_DISTANCE = 8
local SHRINK_DISTANCE = 9 -- Hysteresis: slightly larger than expand
local EXPAND_DOT = 0.85
local SHRINK_DOT = 0.8 -- Hysteresis: slightly smaller than expand

local TWEEN_INFO = TweenInfo.new(0.2, Enum.EasingStyle.Quad, Enum.EasingDirection.Out)

-- Track all managed objects
local managed = {}

local function getFrames(part)
    local billboard = part:FindFirstChildWhichIsA("BillboardGui")
    if not billboard then return nil end
    local small = billboard:FindFirstChild("Small")
    local expanded = billboard:FindFirstChild("Expanded")
    if not (small and expanded) then return nil end
    return {
        Part = part,
        Billboard = billboard,
        Small = small,
        Expanded = expanded,
        State = "Small", -- or "Expanded"
        Tween = nil
    }
end


local function addPart(part)
    local frames = getFrames(part)
    if frames then
        managed[part] = frames
    end
end

local function removePart(part)
    managed[part] = nil
end

function ProximityService.Update()
    local camera = workspace.CurrentCamera
    if not camera then return end
    local camPos = camera.CFrame.Position
    local camLook = camera.CFrame.LookVector

    for part, frames in pairs(managed) do
        -- Validate part and UI references
        if not part or not part:IsDescendantOf(workspace) then
            removePart(part)
        elseif not frames.Billboard or not frames.Billboard.Parent or not frames.Small or not frames.Expanded then
            removePart(part)
        else
            local partPos = part.Position
            local toPart = (partPos - camPos)
            local dist = toPart.Magnitude
            local dir = toPart.Unit
            local dot = camLook:Dot(dir)

            local shouldExpand = dist <= EXPAND_DISTANCE and dot >= EXPAND_DOT
            local shouldShrink = dist >= SHRINK_DISTANCE or dot <= SHRINK_DOT

            if frames.State == "Small" and shouldExpand then
                frames.State = "Expanded"
                if frames.Tween then frames.Tween:Cancel() end
                frames.Expanded.Visible = true
                frames.Expanded.Size = UDim2.new(0, 0, 1, 0)
                frames.Expanded.BackgroundTransparency = 1
                frames.Tween = TweenService:Create(frames.Expanded, TWEEN_INFO, {
                    Size = UDim2.new(1, 0, 1, 0),
                    BackgroundTransparency = 0
                })
                frames.Tween.Completed:Connect(function()
                    frames.Tween = nil
                end)
                frames.Tween:Play()
            elseif frames.State == "Expanded" and shouldShrink then
                frames.State = "Small"
                if frames.Tween then frames.Tween:Cancel() end
                frames.Tween = TweenService:Create(frames.Expanded, TWEEN_INFO, {
                    Size = UDim2.new(0, 0, 1, 0),
                    BackgroundTransparency = 1
                })
                frames.Tween.Completed:Connect(function()
                    frames.Expanded.Visible = false
                    frames.Small.Visible = true
                    frames.Tween = nil
                end)
                frames.Tween:Play()
            end
        end
    end
end

function ProximityService.Init()
	-- Initial scan
	for _, part in ipairs(CollectionService:GetTagged(TAG)) do
		addPart(part)
	end
	-- Listen for new tags
	CollectionService:GetInstanceAddedSignal(TAG):Connect(addPart)
	CollectionService:GetInstanceRemovedSignal(TAG):Connect(removePart)
	-- Connect update loop
	RunService.Heartbeat:Connect(ProximityService.Update)
end

return ProximityService
