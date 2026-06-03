--[[
SlateUI – A modular notification system for both client and server.
	Copyright 2026, Elias – All rights reserved.
--

API:
- NotificationService.Server.Notify(player, message, opts) -- (server) Send to a player
- NotificationService.Server.NotifyAll(message, opts)      -- (server) Send to all players
- NotificationService.Notify(message, opts)         -- (client) Show notification

Options (opts):
{
    status = "info" | "success" | "error" | "warning", -- Color/status indicator
    duration = number,                                -- How long to show (seconds)
    custom = table,                                   -- Any custom fields for your UI
}

Customization:
- Edit STATUS_COLORS for your theme.
- UI logic is in OnNotification (client-side).

Example:
    NotificationService.Notify(player, "Hello, world!", {
        status = "success",
        duration = 3,
    })

]]

local NotificationService = {}
local RunService = game:GetService("RunService")
local ReplicatedStorage = game:GetService("ReplicatedStorage")

-- Status color mapping (customize as needed)
local STATUS_COLORS = {
    info = Color3.fromRGB(71, 85, 105),
    success = Color3.fromRGB(34, 197, 94),
    error = Color3.fromRGB(239, 68, 68),
    warning = Color3.fromRGB(251, 191, 36),
}

-- Utility: Get/create RemoteEvent
local function getRemote()
    local remote = ReplicatedStorage.SlateUI.Events:FindFirstChild("SlateUINotification")
    if not remote then
        remote = Instance.new("RemoteEvent")
        remote.Name = "SlateUINotification"
        remote.Parent = ReplicatedStorage
    end
    return remote
end

-- CLIENT: Notification handler
local function OnNotification(message, opts)
    opts = opts or {}
    local Players = game:GetService("Players")
    local player = Players.LocalPlayer
    local gui = player:WaitForChild("PlayerGui")
    local baseTemplate = gui:FindFirstChild("SlateUI") and gui.SlateUI.Notification:FindFirstChild("Base")
    if not baseTemplate then
        warn("Notification template not found at GUI.SlateUI.Notification.Base")
        return
    end

    -- Clone and parent the notification
    local notif = baseTemplate:Clone()
    notif.Parent = gui.SlateUI.Notification.List
    notif.Visible = true

    -- Set text and status color
    notif.Text.Text = message
    notif.Status.BackgroundColor3 = NotificationService.STATUS_COLORS[opts.status or "info"] or NotificationService.STATUS_COLORS.info

    local TweenService = game:GetService("TweenService")

    -- Animation: fade in (no slide)
    notif.AnchorPoint = Vector2.new(0.5, 0)
    notif.Position = UDim2.new(0.5, 0, 0, 20)
    notif.BackgroundTransparency = 1
    notif.Text.TextTransparency = 1
    notif.Status.BackgroundTransparency = 1
    if notif:FindFirstChild("Icon") then notif.Icon.ImageTransparency = 1 end
    local stroke = notif:FindFirstChildOfClass("UIStroke")
    if stroke then stroke.Transparency = 1 end

    TweenService:Create(notif, TweenInfo.new(0.25, Enum.EasingStyle.Quad), {
        BackgroundTransparency = 0,
    }):Play()
    TweenService:Create(notif.Text, TweenInfo.new(0.25), {TextTransparency = 0}):Play()
    TweenService:Create(notif.Status, TweenInfo.new(0.25), {BackgroundTransparency = 0}):Play()
    if notif:FindFirstChild("Icon") then
        TweenService:Create(notif.Icon, TweenInfo.new(0.25), {ImageTransparency = 0}):Play()
    end
    if stroke then
        TweenService:Create(stroke, TweenInfo.new(0.25), {Transparency = 0}):Play()
    end

    -- Close logic
    local function closeNotification()
        -- Animate out
        TweenService:Create(notif, TweenInfo.new(0.2, Enum.EasingStyle.Quad), {
            BackgroundTransparency = 1,
        }):Play()
        TweenService:Create(notif.Text, TweenInfo.new(0.2), {TextTransparency = 1}):Play()
        TweenService:Create(notif.Status, TweenInfo.new(0.2), {BackgroundTransparency = 1}):Play()
        if notif:FindFirstChild("Icon") then
            TweenService:Create(notif.Icon, TweenInfo.new(0.2), {ImageTransparency = 1}):Play()
        end
        if stroke then
            TweenService:Create(stroke, TweenInfo.new(0.2), {Transparency = 1}):Play()
        end
        task.wait(0.22)
        notif:Destroy()
    end

    -- Button close
    if notif:FindFirstChild("Button") then
        notif.Button.MouseButton1Click:Connect(closeNotification)
    end

    -- Auto-dismiss after duration
    local duration = opts.duration or 3
    task.spawn(function()
        task.wait(duration)
        if notif and notif.Parent then
            closeNotification()
        end
    end)
end

-- CLIENT: Listen for notifications from server
if RunService:IsClient() then
    getRemote().OnClientEvent:Connect(function(message, opts)
        NotificationService.Notify(message, opts)
    end)
end

-- CLIENT: Show notification
function NotificationService.Notify(message, opts)
    opts = opts or {}
    OnNotification(message, opts)
end

-- SERVER: Send notification to a player
function NotificationService.ServerNotify(player, message, opts)
    getRemote():FireClient(player, message, opts or {})
end

-- SERVER: Send notification to all players
function NotificationService.ServerNotifyAll(message, opts)
    getRemote():FireAllClients(message, opts or {})
end

-- Expose status colors for UI use/customization
NotificationService.STATUS_COLORS = STATUS_COLORS

return NotificationService