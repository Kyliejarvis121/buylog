export function generateInitials(name) {
  if (!name || typeof name !== "string") {
    return "U";
  }

  const words = name.trim().split(" ").filter(Boolean);

  if (words.length === 0) return "U";

  const firstInitial = words[0]?.[0]?.toUpperCase() || "";
  const secondInitial =
    words.length > 1 ? words[1]?.[0]?.toUpperCase() || "" : "";

  return (firstInitial + secondInitial) || "U";
}