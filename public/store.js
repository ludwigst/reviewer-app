// ─── PERSISTENCE STORE ─────────────────────────────────────────────────────────
// All durable app state lives under a single localStorage key as one JSON blob.
// Public API: Store.load(), Store.save(snapshot), Store.migrate(data),
//             Store.clear(), Store.defaults(), Store.hasProfile(snapshot).

const Store = (() => {
  const KEY = 'letReviewer.v1';
  const VERSION = 1;

  // Shape of a fresh save. New durable fields must be added here so that
  // migrate() can backfill them onto older saves.
  function defaults() {
    return {
      version: VERSION,
      user: { name: '', track: 'Elementary', spec: 'English', examDate: null },
      stats: {
        total: 0,
        correct: 0,
        streak: 0,
        lastActive: null, // 'YYYY-MM-DD' of the last day the user was active
        sessions: [],
        byComponent: {
          'Gen Ed': { total: 0, correct: 0 },
          'Prof Ed': { total: 0, correct: 0 },
          'Specialization': { total: 0, correct: 0 },
        },
        byTopic: {}, // byTopic[component][topic] = { total, correct }
      },
      history: [],      // { id, date, mode, component, topic, score, items:[...] }
      collections: [],  // { id, name, qIds:[] }
    };
  }

  function load() {
    let raw;
    try {
      raw = localStorage.getItem(KEY);
    } catch (e) {
      console.warn('Store: localStorage unavailable, using in-memory defaults.', e);
      return defaults();
    }
    if (!raw) return defaults();
    let data;
    try {
      data = JSON.parse(raw);
    } catch (e) {
      console.warn('Store: corrupt save detected, resetting to defaults.', e);
      return defaults();
    }
    return migrate(data);
  }

  function save(snapshot) {
    try {
      localStorage.setItem(KEY, JSON.stringify(snapshot));
      return true;
    } catch (e) {
      console.warn('Store: save failed (quota or unavailable).', e);
      return false;
    }
  }

  // Merge a loaded blob onto the current defaults so missing/new fields are
  // backfilled. Future schema bumps add `if (data.version < N) {...}` steps.
  function migrate(data) {
    if (!data || typeof data !== 'object') return defaults();
    const base = defaults();
    const inStats = (data.stats && typeof data.stats === 'object') ? data.stats : {};
    const merged = {
      version: VERSION,
      user: { ...base.user, ...(data.user || {}) },
      stats: {
        ...base.stats,
        ...inStats,
        byComponent: { ...base.stats.byComponent, ...(inStats.byComponent || {}) },
        byTopic: { ...(inStats.byTopic || {}) },
        sessions: Array.isArray(inStats.sessions) ? inStats.sessions : [],
      },
      history: Array.isArray(data.history) ? data.history : [],
      collections: Array.isArray(data.collections) ? data.collections : [],
    };
    return merged;
  }

  function clear() {
    try {
      localStorage.removeItem(KEY);
    } catch (e) {
      console.warn('Store: clear failed.', e);
    }
  }

  function hasProfile(snapshot) {
    return !!(snapshot && snapshot.user && snapshot.user.name);
  }

  return { load, save, migrate, clear, defaults, hasProfile, KEY, VERSION };
})();
