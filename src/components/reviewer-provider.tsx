"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react";
import { GREETINGS, pickRandom, RESULTS_MESSAGES } from "@/lib/copy";
import { buildQuiz, emptyQuiz } from "@/lib/quiz";
import { bumpTopic, hasProfile } from "@/lib/store";
import { getComponents } from "@/lib/questions";
import {
  getQuestionsVersion,
  getServerQuestionsVersion,
  loadRemoteQuestions,
  subscribeQuestions,
} from "@/lib/question-bank";
import {
  getServerStoreSnapshot,
  getStoreSnapshot,
  hydrateStore,
  isStoreHydrated,
  setStore,
  subscribeStore,
} from "@/lib/store-client";
import type {
  BeginQuizOpts,
  Collection,
  ComponentName,
  Difficulty,
  QuizMode,
  QuizState,
  ReviewPayload,
  ScreenId,
  Stats,
  UserProfile,
} from "@/lib/types";

type ReviewerContextValue = {
  hydrated: boolean;
  screen: ScreenId;
  user: UserProfile;
  stats: Stats;
  collections: Collection[];
  quiz: QuizState;
  lastReview: ReviewPayload | null;
  selectedComponent: ComponentName;
  selectedDiff: Difficulty;
  selectedMode: QuizMode;
  selectedInstant: boolean;
  selectedProgressComponent: ComponentName;
  greeting: { main: string; sub: string };
  resultCopy: { main: string; sub: string } | null;
  goTo: (id: ScreenId) => void;
  setUser: (patch: Partial<UserProfile>) => void;
  completeOnboarding: (profile: UserProfile) => void;
  setSelectedComponent: (c: ComponentName) => void;
  setSelectedDiff: (d: Difficulty) => void;
  setSelectedMode: (m: QuizMode) => void;
  toggleInstant: () => void;
  setSelectedProgressComponent: (c: ComponentName) => void;
  startQuizFromMode: () => string | null;
  startTopicDrill: (component: ComponentName, topic: string) => string | null;
  selectAnswer: (choice: number) => void;
  nextQuestion: () => void;
  endSession: () => void;
  resetQuiz: () => void;
  toggleBookmark: (qId: number) => void;
  isBookmarked: (qId: number) => boolean;
};

const ReviewerContext = createContext<ReviewerContextValue | null>(null);

export function ReviewerProvider({ children }: { children: React.ReactNode }) {
  const persisted = useSyncExternalStore(
    subscribeStore,
    getStoreSnapshot,
    getServerStoreSnapshot
  );
  const hydrated = useSyncExternalStore(
    subscribeStore,
    isStoreHydrated,
    () => false
  );
  useSyncExternalStore(
    subscribeQuestions,
    getQuestionsVersion,
    getServerQuestionsVersion
  );
  const [screenOverride, setScreenOverride] = useState<ScreenId | null>(null);
  const [quiz, setQuiz] = useState<QuizState>(emptyQuiz);
  const [lastReview, setLastReview] = useState<ReviewPayload | null>(null);
  const [componentOverride, setComponentOverride] = useState<ComponentName | null>(null);
  const [selectedDiff, setSelectedDiff] = useState<Difficulty>("mixed");
  const [selectedMode, setSelectedMode] = useState<QuizMode>("quick");
  const [selectedInstant, setSelectedInstant] = useState(true);
  const [progressComponentOverride, setProgressComponentOverride] =
    useState<ComponentName | null>(null);
  const [greeting] = useState(() => pickRandom(GREETINGS));
  const [resultCopy, setResultCopy] = useState<{ main: string; sub: string } | null>(null);

  useEffect(() => {
    hydrateStore();
    void loadRemoteQuestions();
  }, []);

  const components = getComponents(persisted.user.track);
  const selectedComponent =
    (componentOverride && components.includes(componentOverride)
      ? componentOverride
      : components[0]) || "Gen Ed";
  const selectedProgressComponent =
    (progressComponentOverride && components.includes(progressComponentOverride)
      ? progressComponentOverride
      : components[0]) || "Gen Ed";
  const setSelectedComponent = setComponentOverride;
  const setSelectedProgressComponent = setProgressComponentOverride;

  const screen: ScreenId =
    screenOverride ?? (hydrated && hasProfile(persisted) ? "home" : "onboarding");

  const goTo = useCallback((id: ScreenId) => {
    setScreenOverride(id);
    if (id !== "quiz") {
      setQuiz((q) => ({ ...q, timerRemaining: null }));
    }
  }, []);

  const setUser = useCallback((patch: Partial<UserProfile>) => {
    setStore((p) => ({ ...p, user: { ...p.user, ...patch } }));
  }, []);

  const completeOnboarding = useCallback((profile: UserProfile) => {
    setStore((p) => ({
      ...p,
      user: profile,
      stats: { ...p.stats, streak: p.stats.streak || 1 },
    }));
    setScreenOverride("home");
  }, []);

  const begin = useCallback((opts: BeginQuizOpts) => {
    const built = buildQuiz(opts, getStoreSnapshot().user.spec);
    if ("error" in built) return built.error;
    setQuiz(built);
    setScreenOverride("quiz");
    return null;
  }, []);

  const startQuizFromMode = useCallback(() => {
    return begin({
      component: selectedComponent,
      difficulty: selectedDiff,
      mode: selectedMode,
      instant: selectedMode === "mock" ? false : selectedInstant,
    });
  }, [begin, selectedComponent, selectedDiff, selectedInstant, selectedMode]);

  const startTopicDrill = useCallback(
    (component: ComponentName, topic: string) => {
      return begin({
        component,
        difficulty: "mixed",
        mode: "topic",
        topic,
        instant: true,
      });
    },
    [begin]
  );

  const selectAnswer = useCallback((choice: number) => {
    setQuiz((q) => {
      if (q.chosen[q.current] !== undefined) return q;
      const question = q.questions[q.current];
      if (!question) return q;
      const correct = choice === question.answer;
      const chosen = [...q.chosen];
      chosen[q.current] = choice;
      setStore((p) => {
        const byComponent = { ...p.stats.byComponent };
        const current = byComponent[question.component] || { total: 0, correct: 0 };
        byComponent[question.component] = {
          total: current.total + 1,
          correct: current.correct + (correct ? 1 : 0),
        };
        return {
          ...p,
          stats: {
            ...p.stats,
            total: p.stats.total + 1,
            correct: p.stats.correct + (correct ? 1 : 0),
            byComponent,
            byTopic: bumpTopic(
              p.stats.byTopic,
              question.component,
              question.topic,
              correct
            ),
          },
        };
      });
      return {
        ...q,
        chosen,
        sessionTotal: q.sessionTotal + 1,
        sessionCorrect: q.sessionCorrect + (correct ? 1 : 0),
        sessionWrong: correct ? q.sessionWrong : [...q.sessionWrong, question.topic],
      };
    });
  }, []);

  const finishSession = useCallback((q: QuizState) => {
    const pct = Math.round((q.sessionCorrect / Math.max(1, q.sessionTotal)) * 100) || 0;
    const tier = pct >= 75 ? "hi" : pct >= 50 ? "mid" : "lo";
    setResultCopy(pickRandom(RESULTS_MESSAGES)[tier]);
    const review: ReviewPayload = {
      component: q.component,
      mode: q.mode,
      topic: q.topic,
      score: pct,
      items: q.questions
        .map((question, i) => ({ q: question, chosen: q.chosen[i] }))
        .filter((it) => it.chosen !== undefined),
    };
    setLastReview(review);
    setStore((p) => ({
      ...p,
      stats: {
        ...p.stats,
        sessions: [
          ...p.stats.sessions,
          {
            date: new Date().toISOString(),
            score: pct,
            component: q.component,
            correct: q.sessionCorrect,
            total: q.sessionTotal,
          },
        ],
      },
      history: [...p.history, review],
    }));
    setQuiz((prev) => ({ ...prev, timerRemaining: null }));
    setScreenOverride("results");
  }, []);

  const nextQuestion = useCallback(() => {
    setQuiz((q) => {
      const next = q.current + 1;
      if (next >= q.totalQuestions) {
        queueMicrotask(() => finishSession(q));
        return q;
      }
      return { ...q, current: next };
    });
  }, [finishSession]);

  const endSession = useCallback(() => {
    setQuiz((q) => {
      queueMicrotask(() => finishSession(q));
      return { ...q, timerRemaining: null };
    });
  }, [finishSession]);

  const timerActive = quiz.timerRemaining !== null && screen === "quiz";
  useEffect(() => {
    if (!timerActive) return;
    const id = window.setInterval(() => {
      setQuiz((q) => {
        if (q.timerRemaining === null) return q;
        if (q.timerRemaining <= 1) {
          queueMicrotask(() => finishSession({ ...q, timerRemaining: 0 }));
          return { ...q, timerRemaining: 0 };
        }
        return { ...q, timerRemaining: q.timerRemaining - 1 };
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, [finishSession, timerActive]);

  const resetQuiz = useCallback(() => {
    setQuiz(emptyQuiz());
    setResultCopy(null);
  }, []);

  const isBookmarked = useCallback(
    (qId: number) => {
      const col = persisted.collections.find((c) => c.id === "saved");
      return Boolean(col?.qIds.includes(qId));
    },
    [persisted.collections]
  );

  const toggleBookmark = useCallback((qId: number) => {
    setStore((p) => {
      const collections = [...p.collections];
      let col = collections.find((c) => c.id === "saved");
      if (!col) {
        col = { id: "saved", name: "Saved", qIds: [] };
        collections.push(col);
      }
      const qIds = col.qIds.includes(qId)
        ? col.qIds.filter((id) => id !== qId)
        : [...col.qIds, qId];
      return {
        ...p,
        collections: collections.map((c) => (c.id === "saved" ? { ...c, qIds } : c)),
      };
    });
  }, []);

  const value = useMemo<ReviewerContextValue>(
    () => ({
      hydrated,
      screen,
      user: persisted.user,
      stats: persisted.stats,
      collections: persisted.collections,
      quiz,
      lastReview,
      selectedComponent,
      selectedDiff,
      selectedMode,
      selectedInstant,
      selectedProgressComponent,
      greeting,
      resultCopy,
      goTo,
      setUser,
      completeOnboarding,
      setSelectedComponent,
      setSelectedDiff,
      setSelectedMode,
      toggleInstant: () => {
        if (selectedMode === "mock") return;
        setSelectedInstant((v) => !v);
      },
      setSelectedProgressComponent,
      startQuizFromMode,
      startTopicDrill,
      selectAnswer,
      nextQuestion,
      endSession,
      resetQuiz,
      toggleBookmark,
      isBookmarked,
    }),
    [
      completeOnboarding,
      endSession,
      goTo,
      greeting,
      hydrated,
      isBookmarked,
      lastReview,
      nextQuestion,
      persisted.collections,
      persisted.stats,
      persisted.user,
      quiz,
      resetQuiz,
      resultCopy,
      screen,
      selectAnswer,
      selectedComponent,
      selectedDiff,
      selectedInstant,
      selectedMode,
      selectedProgressComponent,
      setSelectedComponent,
      setSelectedProgressComponent,
      setUser,
      startQuizFromMode,
      startTopicDrill,
      toggleBookmark,
    ]
  );

  return <ReviewerContext.Provider value={value}>{children}</ReviewerContext.Provider>;
}

export function useReviewer() {
  const ctx = useContext(ReviewerContext);
  if (!ctx) throw new Error("useReviewer must be used within ReviewerProvider");
  return ctx;
}
