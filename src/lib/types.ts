export type Track = "Elementary" | "Secondary";

export type ComponentName = "Gen Ed" | "Prof Ed" | "Specialization";

export type Difficulty = "easy" | "medium" | "hard" | "mixed";

export type QuizMode = "quick" | "topic" | "mock";

export type ScreenId =
  | "onboarding"
  | "home"
  | "mode"
  | "quiz"
  | "results"
  | "review"
  | "progress";

export type Question = {
  id: number;
  component: ComponentName;
  topic: string;
  topicGroup: string;
  difficulty: Exclude<Difficulty, "mixed">;
  stem: string;
  choices: string[];
  answer: number;
  explanation: string;
  bloom: string | null;
};

export type ScorePair = { total: number; correct: number };

export type UserProfile = {
  name: string;
  track: Track;
  spec: string;
  examDate: string | null;
};

export type Stats = {
  total: number;
  correct: number;
  streak: number;
  lastActive: string | null;
  sessions: SessionSummary[];
  byComponent: Record<ComponentName, ScorePair>;
  byTopic: Record<string, Record<string, ScorePair>>;
};

export type SessionSummary = {
  date: string;
  score: number;
  component: ComponentName;
  correct: number;
  total: number;
};

export type Collection = {
  id: string;
  name: string;
  qIds: number[];
};

export type HistoryItem = {
  q: Question;
  chosen: number | undefined;
};

export type ReviewPayload = {
  component: ComponentName;
  mode: QuizMode;
  topic: string | null;
  score: number;
  items: HistoryItem[];
};

export type PersistedState = {
  version: number;
  user: UserProfile;
  stats: Stats;
  history: ReviewPayload[];
  collections: Collection[];
};

export type QuizState = {
  component: ComponentName;
  difficulty: Difficulty;
  mode: QuizMode;
  topic: string | null;
  instant: boolean;
  questions: Question[];
  current: number;
  chosen: Array<number | undefined>;
  sessionCorrect: number;
  sessionTotal: number;
  sessionWrong: string[];
  totalQuestions: number;
  timerRemaining: number | null;
};

export type BeginQuizOpts = {
  component: ComponentName;
  difficulty?: Difficulty;
  mode?: QuizMode;
  topic?: string | null;
  instant?: boolean;
};
