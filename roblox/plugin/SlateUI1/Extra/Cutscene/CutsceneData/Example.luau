-- OpeningCutscene (example)
local workspace = game:GetService("Workspace")

return {
	{
		Type = "MoveCamera",
		CFrame = workspace.CutscenePoints.Start.CFrame,
		Time = 2,
	},
	{
		Type = "Dialogue",
		Text = "I thought this place was abandoned...",
		Time = 3,
		Parallel = true, -- optional: let dialogue show while camera moves
	},
	{
		Type = "MoveCamera",
		CFrame = workspace.CutscenePoints.End.CFrame,
		Time = 5,
		Parallel = true, -- camera keeps moving while an anim plays
	},
	{
		Type = "AnimateCharacter",
		Character = workspace.Archivist,
		AnimationId = "rbxassetid://71085740116053", -- test animation
		Parallel = true
	},
	{
		Type = "Wait",
		Time = 7
	},
	{
		Type = "Dialogue",
		Text = "Wait... did you hear that?",
		Time = 2,
	},
}
