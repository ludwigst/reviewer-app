import type { PersistedState } from "@/lib/types";
import {
  defaults,
  hasProfile,
  loadStore,
  saveStore,
  withUpdatedStreak,
} from "@/lib/store";

let snapshot: PersistedState = defaults();
let hydrated = false;
const listeners = new Set<() => void>();

function emit() {
  for (const listener of listeners) listener();
}

export function subscribeStore(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getStoreSnapshot() {
  return snapshot;
}

export function getServerStoreSnapshot() {
  return snapshot;
}

export function isStoreHydrated() {
  return hydrated;
}

export function hydrateStore() {
  if (typeof window === "undefined" || hydrated) return;
  const saved = loadStore();
  snapshot = { ...saved, stats: withUpdatedStreak(saved.stats) };
  if (hasProfile(snapshot)) saveStore(snapshot);
  hydrated = true;
  emit();
}

export function setStore(next: PersistedState | ((prev: PersistedState) => PersistedState)) {
  snapshot = typeof next === "function" ? next(snapshot) : next;
  saveStore(snapshot);
  emit();
}
