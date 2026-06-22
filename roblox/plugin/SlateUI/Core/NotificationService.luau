-- SlateUI - NotificationService
-- MIT license

local NotificationService = {}
local RunService = game:GetService("RunService")
local ReplicatedStorage = game:GetService("ReplicatedStorage")
local ThemeService = require(script.Parent.ThemeService)

export type NotificationOpts = {
	status: string?,
	duration: number?,
	custom: { [string]: any }?
}

-- utility: get/create remoteevent
local function getRemote(): RemoteEvent
	local events = ReplicatedStorage:FindFirstChild("SlateUI") and ReplicatedStorage.SlateUI:FindFirstChild("Events")
	local remote: RemoteEvent? = events and events:FindFirstChild("SlateUINotification") :: RemoteEvent
	if not remote then
		remote = Instance.new("RemoteEvent")
		remote.Name = "SlateUINotification"
		remote.Parent = ReplicatedStorage
	end
	return remote :: RemoteEvent
end

-- client: notification handler
local function OnNotification(message: string, opts: NotificationOpts?)
	opts = opts or {}
	local Players = game:GetService("Players")
	local player = Players.LocalPlayer
	local gui = player:WaitForChild("PlayerGui")
	local slateUi = gui:FindFirstChild("SlateUI")
	local baseTemplate = slateUi and slateUi:FindFirstChild("Notification") and slateUi.Notification:FindFirstChild("Base") :: Frame

	if not baseTemplate then
		warn("notification template not found at gui.slateui.notification.base")
		return
	end

	-- clone and parent the notification
	local notif = baseTemplate:Clone()
	notif.Parent = slateUi.Notification:FindFirstChild("List")
	notif.Visible = true

	-- set text and status color
	local textLabel = notif:FindFirstChild("Text") :: TextLabel
	local statusFrame = notif:FindFirstChild("Status") :: Frame

	if textLabel then textLabel.Text = message end
	if statusFrame then statusFrame.BackgroundColor3 = ThemeService.GetStatusColor(opts.status) end

	local TweenService = game:GetService("TweenService")

	-- animation: fade in (no slide)
	notif.AnchorPoint = Vector2.new(0.5, 0)
	notif.Position = UDim2.new(0.5, 0, 0, 20)
	notif.BackgroundTransparency = 1
	if textLabel then textLabel.TextTransparency = 1 end
	if statusFrame then statusFrame.BackgroundTransparency = 1 end

	local icon = notif:FindFirstChild("Icon") :: ImageLabel
	if icon then icon.ImageTransparency = 1 end
	local stroke = notif:FindFirstChildOfClass("UIStroke")
	if stroke then stroke.Transparency = 1 end

	TweenService:Create(notif, TweenInfo.new(0.25, Enum.EasingStyle.Quad), {BackgroundTransparency = 0}):Play()
	if textLabel then TweenService:Create(textLabel, TweenInfo.new(0.25), {TextTransparency = 0}):Play() end
	if statusFrame then TweenService:Create(statusFrame, TweenInfo.new(0.25), {BackgroundTransparency = 0}):Play() end
	if icon then TweenService:Create(icon, TweenInfo.new(0.25), {ImageTransparency = 0}):Play() end
	if stroke then TweenService:Create(stroke, TweenInfo.new(0.25), {Transparency = 0}):Play() end

	-- close logic
	local function closeNotification()
		-- animate out
		TweenService:Create(notif, TweenInfo.new(0.2, Enum.EasingStyle.Quad), {BackgroundTransparency = 1}):Play()
		if textLabel then TweenService:Create(textLabel, TweenInfo.new(0.2), {TextTransparency = 1}):Play() end
		if statusFrame then TweenService:Create(statusFrame, TweenInfo.new(0.2), {BackgroundTransparency = 1}):Play() end
		if icon then TweenService:Create(icon, TweenInfo.new(0.2), {ImageTransparency = 1}):Play() end
		if stroke then TweenService:Create(stroke, TweenInfo.new(0.2), {Transparency = 1}):Play() end
		task.wait(0.22)
		notif:Destroy()
	end

	-- button close
	local button = notif:FindFirstChild("Button") :: TextButton
	if button then
		button.MouseButton1Click:Connect(closeNotification)
	end

	-- auto-dismiss after duration
	local duration = (opts and opts.duration) or 3
	task.spawn(function()
		task.wait(duration)
		if notif and notif.Parent then
			closeNotification()
		end
	end)
end

-- client: listen for notifications from server
if RunService:IsClient() then
	getRemote().OnClientEvent:Connect(function(message: string, opts: NotificationOpts?)
		NotificationService.Notify(message, opts)
	end)
end

-- client: show notification
function NotificationService.Notify(message: string, opts: NotificationOpts?)
	opts = opts or {}
	OnNotification(message, opts)
end

-- server: send notification to a player
function NotificationService.ServerNotify(player: Player, message: string, opts: NotificationOpts?)
	getRemote():FireClient(player, message, opts or {})
end

-- server: send notification to all players
function NotificationService.ServerNotifyAll(message: string, opts: NotificationOpts?)
	getRemote():FireAllClients(message, opts or {})
end

return NotificationService