import { publicBackendBaseUrl } from "@/lib/mock-tests";

export type LiveSessionAccess = {
  allowed: boolean;
  reason: "free" | "purchased" | "login_required" | "purchase_required";
  requires_login: boolean;
  requires_purchase: boolean;
};

export type LiveSessionCourse = {
  id: number;
  title: string;
  slug: string;
  price: number;
  sale_price: number | null;
  effective_price: number;
  is_free: boolean;
  category: string | null;
  exam_type: string | null;
  subject: string | null;
  image_url: string | null;
};

export type LiveClassSessionItem = {
  id: number;
  source: "session" | "course";
  title: string;
  description: string | null;
  faculty_name: string | null;
  scheduled_at: string | null;
  duration_minutes: number;
  status: string;
  display_status: "live" | "scheduled" | "replay";
  has_recording: boolean;
  recording_ready?: boolean;
  can_join?: boolean;
  course: LiveSessionCourse;
  access: LiveSessionAccess;
};

export function liveSessionsUrl(email?: string) {
  const base = typeof window !== "undefined" ? "/api/live-sessions" : `${publicBackendBaseUrl}/api/live-sessions`;
  if (!email) return base;
  return `${base}?email=${encodeURIComponent(email)}`;
}

export async function fetchLiveSessions(email?: string): Promise<LiveClassSessionItem[]> {
  const response = await fetch(liveSessionsUrl(email), { cache: "no-store" });
  if (!response.ok) return [];
  const data = (await response.json()) as { sessions?: LiveClassSessionItem[] };
  return data.sessions || [];
}

export async function joinLiveSession(sessionId: number, email: string) {
  const url = typeof window !== "undefined"
    ? `/api/live-sessions/${sessionId}/join`
    : `${publicBackendBaseUrl}/api/live-sessions/${sessionId}/join`;
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

  const data = (await response.json().catch(() => ({}))) as {
    join_url?: string;
    password?: string | null;
    title?: string;
    message?: string;
    errors?: Record<string, string[]>;
  };

  if (!response.ok) {
    const message = Object.values(data.errors || {})[0]?.[0] || data.message || "Unable to join live class.";
    throw new Error(message);
  }

  return data;
}

export async function fetchLiveSessionRecording(sessionId: number, email: string) {
  const url = typeof window !== "undefined"
    ? `/api/live-sessions/${sessionId}/recording`
    : `${publicBackendBaseUrl}/api/live-sessions/${sessionId}/recording`;
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

  const data = (await response.json().catch(() => ({}))) as {
    recording_url?: string;
    password?: string | null;
    passcode?: string | null;
    title?: string;
    message?: string | null;
    errors?: Record<string, string[]>;
  };

  if (!response.ok) {
    const message = Object.values(data.errors || {})[0]?.[0] || data.message || "Recording not available.";
    throw new Error(message);
  }

  return data;
}

export function formatLiveSessionTime(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString("en-IN", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function liveSessionStatusLabel(status: LiveClassSessionItem["display_status"]) {
  if (status === "live") return "Live";
  if (status === "replay") return "Replay";
  return "Upcoming";
}

export function openMeetingUrl(url: string, password?: string | null) {
  let target = url.trim();
  if (!target) return false;

  const isRecordingUrl = /\/rec\/|recording|zoom\.us\/rec/i.test(target);
  if (!isRecordingUrl && password && !target.includes("pwd=")) {
    target += `${target.includes("?") ? "&" : "?"}pwd=${encodeURIComponent(password)}`;
  }

  const opened = window.open(target, "_blank", "noopener,noreferrer");
  if (!opened) {
    window.location.assign(target);
  }

  return true;
}

export function formatLiveSessionSchedule(value: string | null) {
  if (!value) return "Schedule coming soon";
  return formatLiveSessionTime(value);
}

export function formatLiveSessionDateKey(value: string | null) {
  if (!value) return "Schedule coming soon";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Schedule coming soon";
  return date.toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function groupLiveSessionsByDate(sessions: LiveClassSessionItem[]) {
  const groups = new Map<string, LiveClassSessionItem[]>();

  for (const session of sessions) {
    const key = formatLiveSessionDateKey(session.scheduled_at);
    const bucket = groups.get(key) || [];
    bucket.push(session);
    groups.set(key, bucket);
  }

  return Array.from(groups.entries());
}

export type LiveCourseDetail = {
  course: {
    id: number;
    title: string;
    slug: string;
    description: string | null;
    short_description: string | null;
    price: number;
    sale_price: number | null;
    effective_price: number;
    is_free: boolean;
    duration_hours: number;
    category: string | null;
    exam_type: string | null;
    subject: string | null;
    image_url: string | null;
  };
  access: LiveSessionAccess;
  sessions: LiveClassSessionItem[];
  recordings: LiveClassSessionItem[];
};

export function liveCourseDetailUrl(slug: string, email?: string) {
  const base = typeof window !== "undefined"
    ? `/api/live-courses/${encodeURIComponent(slug)}`
    : `${publicBackendBaseUrl}/api/live-courses/${encodeURIComponent(slug)}`;
  if (!email) return base;
  return `${base}?email=${encodeURIComponent(email)}`;
}

export async function fetchLiveCourseDetail(slug: string, email?: string): Promise<LiveCourseDetail | null> {
  const response = await fetch(liveCourseDetailUrl(slug, email), { cache: "no-store" });
  if (!response.ok) return null;
  return (await response.json()) as LiveCourseDetail;
}
