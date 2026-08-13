import data from "@/data/questions.json";
import type { Question } from "@/lib/types";

export const QUESTION_BANK = data.QUESTION_BANK as Question[];
export const SPEC_QUESTIONS = data.SPEC_QUESTIONS as Record<string, Question[]>;
