import type {
  ComponentName,
  PersistedState,
  ScorePair,
  Stats,
} from "@/lib/types";

export const STORE_KEY = "letReviewer.v1";
export const STORE_VERSION = 1;

const emptyScore = (): ScorePair => ({ total: 0, correct: 0 });

export function defaultStats(): Stats {
  return {
    total: 0,
    correct: 0,
    streak: 0,
    lastActive: null,
    sessions: [],
    byComponent: {
      "Gen Ed": emptyScore(),
      "Prof Ed": emptyScore(),
      Specialization: emptyScore(),
    },
    byTopic: {},
  };
}

export function defaults(): PersistedState {
  return {
    version: STORE_VERSION,
    user: { name: "", track: "Elementary", spec: "English", examDate: null },
    stats: defaultStats(),
    history: [],
    collections: [],
  };
}

export function hasProfile(snapshot: PersistedState) {
  return Boolean(snapshot.user?.name);
}

function migrate(data: unknown): PersistedState {
  if (!data || typeof data !== "object") return defaults();
  const raw = data as Partial<PersistedState>;
  const base = defaults();
  const inStats = raw.stats && typeof raw.stats === "object" ? raw.stats : {};
  return {
    version: STORE_VERSION,
    user: { ...base.user, ...(raw.user || {}) },
    stats: {
      ...base.stats,
      ...inStats,
      byComponent: {
        ...base.stats.byComponent,
        ...((inStats as Stats).byComponent || {}),
      },
      byTopic: { ...((inStats as Stats).byTopic || {}) },
      sessions: Array.isArray((inStats as Stats).sessions)
        ? (inStats as Stats).sessions
        : [],
    },
    history: Array.isArray(raw.history) ? raw.history : [],
    collections: Array.isArray(raw.collections) ? raw.collections : [],
  };
}

export function loadStore(): PersistedState {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (!raw) return defaults();
    return migrate(JSON.parse(raw));
  } catch (error) {
    console.warn("Store: load failed, using defaults.", error);
    return defaults();
  }
}

export function saveStore(snapshot: PersistedState) {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(snapshot));
    return true;
  } catch (error) {
    console.warn("Store: save failed.", error);
    return false;
  }
}

export function dayKey(d = new Date()) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function isYesterday(lastKey: string, todayK: string) {
  const t = new Date(`${todayK}T00:00:00`);
  t.setDate(t.getDate() - 1);
  return dayKey(t) === lastKey;
}

export function withUpdatedStreak(stats: Stats): Stats {
  const today = dayKey();
  const last = stats.lastActive;
  if (last === today) {
    return { ...stats, streak: stats.streak || 1 };
  }
  return {
    ...stats,
    streak: last && isYesterday(last, today) ? (stats.streak || 0) + 1 : 1,
    lastActive: today,
  };
}

export function bumpTopic(
  byTopic: Stats["byTopic"],
  component: ComponentName,
  topic: string,
  correct: boolean
) {
  const next = { ...byTopic };
  const comp = { ...(next[component] || {}) };
  const current = comp[topic] || emptyScore();
  comp[topic] = {
    total: current.total + 1,
    correct: current.correct + (correct ? 1 : 0),
  };
  next[component] = comp;
  return next;
}
