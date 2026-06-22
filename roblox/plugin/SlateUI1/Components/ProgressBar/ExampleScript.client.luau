-- Example script for using the ProgressBar module. Test by simply changing your humanoid's health in test.



local Pbs = require(game.ReplicatedStorage.SlateUI.ProgressBarService)

local plr = game.Players.LocalPlayer
local char = plr.Character or plr.CharacterAdded:Wait()
local hum = char:WaitForChild("Humanoid")

while true do
	wait(1)
	local percent = hum.Health / hum.MaxHealth
	Pbs.Set(script.Parent.Regular, percent, false, { spring = false })
	Pbs.Set(script.Parent.Minimal, percent, false, { spring = true })
end