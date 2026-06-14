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
  title: string;
  description: string | null;
  faculty_name: string | null;
  scheduled_at: string;
  duration_minutes: number;
  status: string;
  display_status: "live" | "scheduled" | "replay";
  has_recording: boolean;
  course: LiveSessionCourse;
  access: LiveSessionAccess;
};

function liveSessionsUrl(email?: string) {
  const base = `${publicBackendBaseUrl}/api/live-sessions`;
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
  const response = await fetch(`${publicBackendBaseUrl}/api/live-sessions/${sessionId}/join`, {
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
  const response = await fetch(`${publicBackendBaseUrl}/api/live-sessions/${sessionId}/recording`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

  const data = (await response.json().catch(() => ({}))) as {
    recording_url?: string;
    password?: string | null;
    title?: string;
    message?: string;
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
