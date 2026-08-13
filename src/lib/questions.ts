import data from "@/data/questions.json";
import type {
  ComponentName,
  Difficulty,
  Question,
  Track,
  UserProfile,
} from "@/lib/types";

export const QUESTION_BANK = data.QUESTION_BANK as Question[];
export const SPEC_QUESTIONS = data.SPEC_QUESTIONS as Record<string, Question[]>;

export function getComponents(track: Track): ComponentName[] {
  return track === "Elementary"
    ? ["Gen Ed", "Prof Ed"]
    : ["Gen Ed", "Prof Ed", "Specialization"];
}

export function componentLabel(component: ComponentName, spec: string) {
  return component === "Specialization" ? `${spec} (Spec)` : component;
}

export function getComponentPool(component: ComponentName, spec: string): Question[] {
  return component === "Specialization"
    ? SPEC_QUESTIONS[spec] ?? []
    : QUESTION_BANK.filter((q) => q.component === component);
}

export function getPool(
  component: ComponentName,
  difficulty: Difficulty,
  spec: string,
  topic?: string | null
): Question[] {
  let bank = getComponentPool(component, spec);
  if (difficulty !== "mixed") bank = bank.filter((q) => q.difficulty === difficulty);
  if (topic) bank = bank.filter((q) => q.topic === topic);
  return bank;
}

export function getTaxonomy(component: ComponentName, spec: string) {
  const groups: Record<string, Set<string>> = {};
  for (const q of getComponentPool(component, spec)) {
    (groups[q.topicGroup] ??= new Set()).add(q.topic);
  }
  const out: Record<string, string[]> = {};
  for (const g of Object.keys(groups).sort()) {
    out[g] = [...groups[g]!].sort();
  }
  return out;
}

export function pickQuestion(pool: Question[], usedIds: Set<number>): Question | undefined {
  let available = pool.filter((q) => !usedIds.has(q.id));
  if (available.length === 0) {
    usedIds.clear();
    available = pool;
  }
  if (available.length === 0) return undefined;
  return available[Math.floor(Math.random() * available.length)];
}

export function daysUntilExam(user: UserProfile) {
  if (!user.examDate) return null;
  const days = Math.ceil((new Date(user.examDate).getTime() - Date.now()) / 864e5);
  return days > 0 ? days : null;
}

export function initials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function firstName(name: string) {
  return name.split(" ")[0] || "Reviewer";
}

export function pctColor(pct: number | null | undefined) {
  if (pct === null || pct === undefined) return "#B8B29C";
  return pct >= 75 ? "#1D9E75" : pct >= 50 ? "#BA7517" : "#E24B4A";
}

export function scorePct(correct: number, total: number) {
  if (!total) return null;
  return Math.round((correct / total) * 100);
}

export function topicShortName(topic: string) {
  return topic.includes(" - ") ? topic.split(" - ").slice(1).join(" - ") : topic;
}

export function componentTagClass(component: ComponentName) {
  if (component === "Gen Ed") return "tag-gened";
  if (component === "Prof Ed") return "tag-profed";
  return "tag-spec";
}

export function difficultyTagClass(difficulty: Exclude<Difficulty, "mixed">) {
  if (difficulty === "easy") return "tag-easy";
  if (difficulty === "medium") return "tag-medium";
  return "tag-hard";
}
