-- SlateUI - ThemeService
-- MIT License

export type Theme = {
	DefaultColor: Color3,
	HoverColor: Color3,
	PressColor: Color3,	
	DefaultStroke: Color3,
	HoverStroke: Color3,
}

export type StatusColor = {
	info: Color3,
	success: Color3,
	error: Color3,
	warning: Color3,
}

local ThemeService = {}

local themes: { [string]: Theme } = {
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

local statusColors: StatusColor = {
	info = Color3.fromRGB(71, 85, 105),
	success = Color3.fromRGB(34, 197, 94),
	error = Color3.fromRGB(239, 68, 68),
	warning = Color3.fromRGB(251, 191, 36),
}

function ThemeService.GetTheme(name: string?): Theme
	local themeName = name or "primary"
	return themes[themeName] or themes.primary
end

function ThemeService.GetStatusColor(status: string?): Color3
	local statusName = status or "info"
	return statusColors[statusName] or statusColors.info
end

function ThemeService.GetActiveColor(): Color3
	return Color3.fromRGB(71, 85, 105)
end

return ThemeService