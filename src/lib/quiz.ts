import { getPool, pickQuestion } from "@/lib/questions";
import type { BeginQuizOpts, QuizState } from "@/lib/types";

export function emptyQuiz(): QuizState {
  return {
    component: "Gen Ed",
    difficulty: "mixed",
    mode: "quick",
    topic: null,
    topicGroup: null,
    subtopic: null,
    instant: true,
    questions: [],
    current: 0,
    chosen: [],
    sessionCorrect: 0,
    sessionTotal: 0,
    sessionWrong: [],
    totalQuestions: 10,
    timerRemaining: null,
  };
}

export function buildQuiz(opts: BeginQuizOpts, spec: string): QuizState | { error: string } {
  const component = opts.component;
  const difficulty = opts.difficulty || "mixed";
  const mode = opts.mode || "quick";
  const topic = opts.topic || null;
  const topicGroup = opts.topicGroup || null;
  const subtopic = opts.subtopic || null;
  const instant = opts.instant !== undefined ? opts.instant : mode !== "mock";
  const totalQ = mode === "mock" ? 20 : 10;
  const pool = getPool(component, difficulty, spec, topic, topicGroup, subtopic);

  if (pool.length === 0) {
    return {
      error:
        "No questions available for that selection. Try Mixed difficulty or another topic.",
    };
  }

  const usedIds = new Set<number>();
  const questions = Array.from({ length: totalQ }, () => {
    const q = pickQuestion(pool, usedIds);
    if (q) usedIds.add(q.id);
    return q;
  }).filter((q): q is NonNullable<typeof q> => Boolean(q));

  const timerRemaining =
    mode === "mock" ? totalQ * 60 : mode === "topic" ? 12 * 60 : null;

  return {
    component,
    difficulty,
    mode,
    topic,
    topicGroup,
    subtopic,
    instant,
    questions,
    current: 0,
    chosen: [],
    sessionCorrect: 0,
    sessionTotal: 0,
    sessionWrong: [],
    totalQuestions: questions.length,
    timerRemaining,
  };
}

export function formatTimer(seconds: number) {
  const m = Math.floor(Math.max(0, seconds) / 60);
  const s = Math.max(0, seconds) % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}
