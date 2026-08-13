import nursingSeed from "@/data/nursing-questions.json";
import { createClient } from "@/lib/supabase/client";
import { QUESTION_BANK, SPEC_QUESTIONS } from "@/lib/questions-local";
import type { Question } from "@/lib/types";

type RemoteQuestionRow = {
  id: number;
  stem: string;
  choices: string[];
  answer: number;
  explanation: string;
  component: string;
  topic: string;
  topic_group: string;
  difficulty: "easy" | "medium" | "hard";
  bloom: string | null;
};

function mapRow(row: RemoteQuestionRow): Question {
  return {
    id: Number(row.id),
    component: row.component,
    topic: row.topic,
    topicGroup: row.topic_group,
    difficulty: row.difficulty,
    stem: row.stem,
    choices: row.choices,
    answer: row.answer,
    explanation: row.explanation,
    bloom: row.bloom,
  };
}

function nursingFallback(): Question[] {
  return (nursingSeed as Array<{
    source_id: number;
    stem: string;
    choices: string[];
    answer: number;
    explanation: string;
    component: string;
    topic: string;
    topic_group: string;
    difficulty: "easy" | "medium" | "hard";
    bloom: string | null;
  }>).map((row) => ({
    id: row.source_id,
    component: row.component,
    topic: row.topic,
    topicGroup: row.topic_group,
    difficulty: row.difficulty,
    stem: row.stem,
    choices: row.choices,
    answer: row.answer,
    explanation: row.explanation,
    bloom: row.bloom,
  }));
}

function letFallback(): Question[] {
  return [...QUESTION_BANK, ...Object.values(SPEC_QUESTIONS).flat()];
}

let remoteQuestions: Question[] | null = null;
let version = 0;
const listeners = new Set<() => void>();

function emit() {
  version += 1;
  for (const listener of listeners) listener();
}

export function subscribeQuestions(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getQuestionsVersion() {
  return version;
}

export function getServerQuestionsVersion() {
  return 0;
}

export function getAllQuestions(): Question[] {
  if (remoteQuestions && remoteQuestions.length) return remoteQuestions;
  const nursing = nursingFallback();
  return nursing.length ? nursing : letFallback();
}

export function setRemoteQuestions(questions: Question[]) {
  remoteQuestions = questions;
  emit();
}

export async function loadRemoteQuestions() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return;

  const supabase = createClient();
  const { data, error } = await supabase
    .from("questions")
    .select(
      "id, stem, choices, answer, explanation, component, topic, topic_group, difficulty, bloom"
    )
    .order("id");

  if (error) {
    console.warn("Supabase questions load skipped:", error.message);
    return;
  }
  if (!data?.length) return;
  setRemoteQuestions(data.map((row) => mapRow(row as RemoteQuestionRow)));
}
