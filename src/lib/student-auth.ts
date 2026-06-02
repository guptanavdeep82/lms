"use client";

const STUDENT_SESSION_KEY = "kr_student_session";

export type StudentSession = {
  name: string;
  email: string;
  loggedInAt: string;
};

export function getStudentSession(): StudentSession | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem(STUDENT_SESSION_KEY);
    return raw ? (JSON.parse(raw) as StudentSession) : null;
  } catch {
    return null;
  }
}

export function isStudentLoggedIn() {
  return Boolean(getStudentSession());
}

export function loginStudent(email: string) {
  const session: StudentSession = {
    name: email.includes("@") ? email.split("@")[0] : "Student",
    email,
    loggedInAt: new Date().toISOString(),
  };

  window.localStorage.setItem(STUDENT_SESSION_KEY, JSON.stringify(session));
  return session;
}

export function logoutStudent() {
  window.localStorage.removeItem(STUDENT_SESSION_KEY);
}
