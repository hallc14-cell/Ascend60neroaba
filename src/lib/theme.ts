// Time-of-day theme: bright AM, soft PM, dark night
export type TOD = "day" | "dusk" | "night";

export function timeOfDay(d = new Date()): TOD {
  const h = d.getHours();
  if (h >= 5 && h < 16) return "day";
  if (h >= 16 && h < 20) return "dusk";
  return "night";
}

export function applyTOD(tod: TOD) {
  const root = document.documentElement;
  root.classList.remove("tod-day", "tod-dusk", "tod-night");
  if (tod === "dusk") root.classList.add("tod-dusk");
  else if (tod === "night") root.classList.add("tod-night");
}