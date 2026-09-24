const PREFIX = "kr-video-position:";

function storageKey(progressKey: string) {
  return `${PREFIX}${progressKey}`;
}

export function loadVideoPosition(progressKey: string): number {
  if (!progressKey || typeof window === "undefined") return 0;

  try {
    const raw = window.localStorage.getItem(storageKey(progressKey));
    const seconds = Number(raw);
    return Number.isFinite(seconds) && seconds > 0 ? seconds : 0;
  } catch {
    return 0;
  }
}

export function saveVideoPosition(progressKey: string, seconds: number, duration = 0) {
  if (!progressKey || typeof window === "undefined") return;

  const position = Math.floor(seconds);
  if (position < 3) return;
  if (duration > 0 && position >= duration - 5) {
    clearVideoPosition(progressKey);
    return;
  }

  try {
    window.localStorage.setItem(storageKey(progressKey), String(position));
  } catch {
    // Ignore storage failures.
  }
}

export function clearVideoPosition(progressKey: string) {
  if (!progressKey || typeof window === "undefined") return;

  try {
    window.localStorage.removeItem(storageKey(progressKey));
  } catch {
    // Ignore storage failures.
  }
}
