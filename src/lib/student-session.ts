"use client";

import { publicBackendBaseUrl } from "@/lib/mock-tests";
import {
  getStudentSession,
  loginStudent,
  logoutStudent,
  type StudentSession,
} from "@/lib/student-auth";

const DEVICE_ID_KEY = "kr_student_device_id";

function sessionStartUrl() {
  return `${publicBackendBaseUrl}/api/student/session/start`;
}

function sessionValidateUrl() {
  return `${publicBackendBaseUrl}/api/student/session/validate`;
}

function sessionLogoutUrl() {
  return `${publicBackendBaseUrl}/api/student/session/logout`;
}

function createDeviceId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `web-${Date.now()}-${Math.random().toString(36).slice(2, 12)}`;
}

/** Stable per-browser device id stored in localStorage. */
export function getOrCreateStudentDeviceId(): string {
  if (typeof window === "undefined") return "";

  try {
    const existing = window.localStorage.getItem(DEVICE_ID_KEY)?.trim();
    if (existing) return existing;
  } catch {
    // fall through
  }

  const deviceId = createDeviceId();
  try {
    window.localStorage.setItem(DEVICE_ID_KEY, deviceId);
  } catch {
    // ignore quota / private mode
  }
  return deviceId;
}

export async function startStudentDeviceSession(email: string): Promise<{
  sessionToken: string;
  deviceId: string;
} | null> {
  const normalizedEmail = email.trim().toLowerCase();
  if (!normalizedEmail) return null;

  const deviceId = getOrCreateStudentDeviceId();
  if (!deviceId) return null;

  const response = await fetch(sessionStartUrl(), {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      email: normalizedEmail,
      device_id: deviceId,
      platform: "web",
    }),
  });

  const payload = (await response.json().catch(() => ({}))) as {
    session_token?: string;
    message?: string;
  };

  if (!response.ok || !payload.session_token) {
    throw new Error(payload.message || "Unable to start student session.");
  }

  return { sessionToken: payload.session_token, deviceId };
}

/** Start backend single-device session and merge tokens into local student session. */
export async function attachStudentDeviceSession(
  sessionOrEmail: StudentSession | string,
): Promise<StudentSession | null> {
  const email = typeof sessionOrEmail === "string" ? sessionOrEmail : sessionOrEmail.email;
  const base =
    typeof sessionOrEmail === "string"
      ? getStudentSession()
      : sessionOrEmail;

  if (!base && typeof sessionOrEmail === "string") {
    return null;
  }

  try {
    const started = await startStudentDeviceSession(email);
    if (!started) return base || getStudentSession();

    const current = base || getStudentSession();
    if (!current) return null;

    return loginStudent({
      ...current,
      sessionToken: started.sessionToken,
      deviceId: started.deviceId,
    });
  } catch {
    // Local login should still work if session API is briefly unavailable.
    return base || getStudentSession();
  }
}

export async function validateStudentDeviceSession(): Promise<boolean> {
  const session = getStudentSession();
  if (!session?.email || !session.sessionToken || !session.deviceId) {
    return false;
  }

  try {
    const response = await fetch(sessionValidateUrl(), {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        email: session.email,
        device_id: session.deviceId,
        session_token: session.sessionToken,
      }),
    });

    if (!response.ok) {
      // Server errors should not force logout.
      return true;
    }

    const payload = (await response.json().catch(() => ({}))) as { valid?: boolean };
    return payload.valid === true;
  } catch {
    // Network errors: do not treat as kicked; caller keeps session.
    return true;
  }
}

export async function logoutStudentDeviceSession(): Promise<void> {
  const session = getStudentSession();
  if (session?.email && session.deviceId) {
    try {
      await fetch(sessionLogoutUrl(), {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          email: session.email,
          device_id: session.deviceId,
          session_token: session.sessionToken || undefined,
        }),
      });
    } catch {
      // Local logout still proceeds.
    }
  }
  logoutStudent();
}
