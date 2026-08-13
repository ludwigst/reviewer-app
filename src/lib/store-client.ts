import type { PersistedState } from "@/lib/types";
import {
  defaults,
  hasProfile,
  loadStore,
  saveStore,
  withUpdatedStreak,
} from "@/lib/store";
import { pullRemoteSave, pushRemoteSave } from "@/lib/supabase/persist";

let snapshot: PersistedState = defaults();
let hydrated = false;
let pushTimer: ReturnType<typeof setTimeout> | null = null;
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

function schedulePush(state: PersistedState) {
  if (typeof window === "undefined") return;
  if (pushTimer) clearTimeout(pushTimer);
  pushTimer = setTimeout(() => {
    void pushRemoteSave(state);
  }, 800);
}

function shouldPreferRemote(local: PersistedState, remote: PersistedState) {
  if (!hasProfile(local) && hasProfile(remote)) return true;
  return (remote.stats?.total ?? 0) > (local.stats?.total ?? 0);
}

export function hydrateStore() {
  if (typeof window === "undefined" || hydrated) return;
  const saved = loadStore();
  snapshot = { ...saved, stats: withUpdatedStreak(saved.stats) };
  if (hasProfile(snapshot)) saveStore(snapshot);
  hydrated = true;
  emit();

  void pullRemoteSave().then((remote) => {
    if (!remote) return;
    const merged = { ...remote, stats: withUpdatedStreak(remote.stats) };
    if (shouldPreferRemote(snapshot, merged)) {
      snapshot = merged;
      saveStore(snapshot);
      emit();
    } else if (hasProfile(snapshot)) {
      schedulePush(snapshot);
    }
  });
}

export function setStore(next: PersistedState | ((prev: PersistedState) => PersistedState)) {
  snapshot = typeof next === "function" ? next(snapshot) : next;
  saveStore(snapshot);
  emit();
  schedulePush(snapshot);
}
