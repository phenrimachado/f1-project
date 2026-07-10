const TEAM_COLORS: Record<string, string> = {
  McLaren: "#FF8000",
  Ferrari: "#E8002D",
  "Red Bull Racing": "#3671C6",
  Mercedes: "#27F4D2",
  "Aston Martin": "#229971",
  Alpine: "#FF87BC",
  Williams: "#64C4FF",
  "Racing Bulls": "#6692FF",
  Audi: "#BB0A30",
  Cadillac: "#B8860B",
  "Haas F1 Team": "#B6BABD",
};

const FALLBACK_COLOR = "#737373";

export function getTeamColor(teamName: string | null): string {
  if (!teamName) return FALLBACK_COLOR;
  return TEAM_COLORS[teamName] ?? FALLBACK_COLOR;
}
