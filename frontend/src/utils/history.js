const HISTORY_KEY = "clarity_history";
const MAX_HISTORY = 5;

export function getHistory() {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function addToHistory(repo, mode) {
  try {
    const history = getHistory();

    // Remove if already exists
    const filtered = history.filter((h) => h.repo.full_name !== repo.full_name);

    // Add to front
    const updated = [
      {
        repo,
        mode,
        analyzedAt: Date.now(),
      },
      ...filtered,
    ].slice(0, MAX_HISTORY);

    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
  } catch {}
}

export function clearHistory() {
  localStorage.removeItem(HISTORY_KEY);
}