import { lmsApiUrl } from "@/lib/mock-tests";
import { getStudentSession, studentAuthHeaders } from "@/lib/student-auth";

const PREFIX = "kr-video-position:";

export type VideoProgressMeta = {
  courseId?: number | null;
  lessonId?: number | null;
  mediaId?: number | null;
};

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

let syncTimer: ReturnType<typeof setTimeout> | null = null;
let lastSyncedKey = "";
let lastSyncedAt = 0;

function syncLessonProgress(progressKey: string, seconds: number, duration = 0, meta: VideoProgressMeta = {}) {
  const session = getStudentSession();
  if (!session?.email || !progressKey) return;

  const position = Math.floor(seconds);
  if (position < 5) return;
  if (progressKey === lastSyncedKey && Math.abs(position - lastSyncedAt) < 8) return;

  lastSyncedKey = progressKey;
  lastSyncedAt = position;

  const body = {
    email: session.email,
    source_key: progressKey,
    position_seconds: position,
    duration_seconds: Math.max(0, Math.floor(duration || 0)),
    course_id: meta.courseId || undefined,
    lesson_id: meta.lessonId || undefined,
    media_id: meta.mediaId || undefined,
  };

  void fetch(lmsApiUrl("/api/student/lesson-progress"), {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...studentAuthHeaders(),
    },
    body: JSON.stringify(body),
    keepalive: true,
  }).catch(() => undefined);
}

export function saveVideoPosition(
  progressKey: string,
  seconds: number,
  duration = 0,
  meta: VideoProgressMeta = {},
) {
  if (!progressKey || typeof window === "undefined") return;

  const position = Math.floor(seconds);
  if (position < 3) return;
  if (duration > 0 && position >= duration - 5) {
    clearVideoPosition(progressKey);
    syncLessonProgress(progressKey, duration, duration, meta);
    return;
  }

  try {
    window.localStorage.setItem(storageKey(progressKey), String(position));
  } catch {
    // Ignore storage failures.
  }

  if (syncTimer) window.clearTimeout(syncTimer);
  syncTimer = window.setTimeout(() => {
    syncLessonProgress(progressKey, position, duration, meta);
  }, 2500);
}

export function clearVideoPosition(progressKey: string) {
  if (!progressKey || typeof window === "undefined") return;

  try {
    window.localStorage.removeItem(storageKey(progressKey));
  } catch {
    // Ignore storage failures.
  }
}
