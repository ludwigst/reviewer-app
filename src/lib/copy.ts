export const GREETINGS = [
  { main: "Get that bread,", sub: "Your license isn't gonna get itself." },
  { main: "Padayon,", sub: "Keep moving. You're closer than you think." },
  { main: "I believe in you,", sub: "Now go prove yourself right." },
  { main: "Basic yan sayo,", sub: "You've studied harder things than this." },
  { main: "No sweat,", sub: "One question at a time. Let's go." },
  { main: "Laban lang,", sub: "The board exam won't know what hit it." },
  { main: "You've got this,", sub: "Consistency beats cramming every time." },
  { main: "Charge it to the game,", sub: "Miss one, learn one. That's the process." },
  { main: "Para sa lisensya,", sub: "Every session gets you closer. Grind on." },
  { main: "Ikaw na,", sub: "The future Teacher Board Passer is here." },
] as const;

export const RESULTS_MESSAGES = [
  {
    hi: { main: "Slay!", sub: "That's a passing score. Keep that energy." },
    mid: { main: "Not bad!", sub: "You're getting there. One more round?" },
    lo: { main: "Charge it,", sub: "Miss now, pass later. Review those weak spots." },
  },
  {
    hi: { main: "Basic yan sayo!", sub: "Told you. Now do it again." },
    mid: { main: "Padayon!", sub: "Progress is progress. Keep going." },
    lo: { main: "No sweat,", sub: "This is what practice is for. You'll get it." },
  },
  {
    hi: { main: "LET passer behavior!", sub: "This is exactly what we're going for." },
    mid: { main: "I believe in you,", sub: "You're building the habit. That matters." },
    lo: { main: "Laban lang,", sub: "The grind is the point. Don't stop now." },
  },
] as const;

export const SPECIALIZATIONS = [
  "English",
  "Filipino",
  "Mathematics",
  "Biology",
  "Chemistry",
  "Physics",
  "Social Studies",
  "Values Education",
  "MAPEH",
  "TLE",
] as const;

export function pickRandom<T>(items: readonly T[]): T {
  return items[Math.floor(Math.random() * items.length)]!;
}
