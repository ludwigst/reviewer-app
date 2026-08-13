import data from "@/data/questions.json";
import type { Question } from "@/lib/types";

type LegacyQuestion = Omit<Question, "subtopic"> & { subtopic?: string };

function withSubtopic(q: LegacyQuestion): Question {
  return { ...q, subtopic: q.subtopic ?? q.topic };
}

export const QUESTION_BANK = (data.QUESTION_BANK as LegacyQuestion[]).map(withSubtopic);
export const SPEC_QUESTIONS = Object.fromEntries(
  Object.entries(data.SPEC_QUESTIONS as Record<string, LegacyQuestion[]>).map(([key, questions]) => [
    key,
    questions.map(withSubtopic),
  ])
) as Record<string, Question[]>;
