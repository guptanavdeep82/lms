"use client";

const STUDENT_SESSION_KEY = "kr_student_session";
const STUDENT_PROFILE_KEY = "kr_student_profiles";

export type StudentSession = {
  name: string;
  email: string;
  mobile?: string;
  stateId?: number;
  stateName?: string;
  provider?: "password" | "google" | "otp";
  referralCode?: string | null;
  referralDiscountType?: "percentage" | "fixed" | null;
  referralDiscountValue?: number | null;
  referralDiscountLabel?: string | null;
  loggedInAt: string;
};

export type StudentLoginInput = string | {
  name?: string;
  email: string;
  mobile?: string;
  stateId?: number;
  stateName?: string;
  provider?: StudentSession["provider"];
  referralCode?: string | null;
  referralDiscountType?: "percentage" | "fixed" | null;
  referralDiscountValue?: number | null;
  referralDiscountLabel?: string | null;
};

export type StudentProfile = {
  name: string;
  email: string;
  mobile?: string;
  stateId?: number;
  stateName?: string;
  provider?: StudentSession["provider"];
  mobileVerified?: boolean;
  referralCode?: string | null;
  referralDiscountType?: "percentage" | "fixed" | null;
  referralDiscountValue?: number | null;
  referralDiscountLabel?: string | null;
  createdAt: string;
  updatedAt: string;
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

export function getStudentProfiles(): StudentProfile[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(STUDENT_PROFILE_KEY);
    return raw ? (JSON.parse(raw) as StudentProfile[]) : [];
  } catch {
    return [];
  }
}

export function getStudentProfile(email: string) {
  const normalizedEmail = email.trim().toLowerCase();
  return getStudentProfiles().find((profile) => profile.email.toLowerCase() === normalizedEmail) || null;
}

export function saveStudentProfile(input: Omit<StudentProfile, "createdAt" | "updatedAt">) {
  const now = new Date().toISOString();
  const profiles = getStudentProfiles();
  const normalizedEmail = input.email.trim().toLowerCase();
  const existingIndex = profiles.findIndex((profile) => profile.email.toLowerCase() === normalizedEmail);
  const existing = existingIndex >= 0 ? profiles[existingIndex] : null;
  const profile: StudentProfile = {
    createdAt: existing?.createdAt || now,
    ...existing,
    ...input,
    email: normalizedEmail,
    updatedAt: now,
  };

  if (existingIndex >= 0) {
    profiles[existingIndex] = profile;
  } else {
    profiles.push(profile);
  }

  window.localStorage.setItem(STUDENT_PROFILE_KEY, JSON.stringify(profiles));
  return profile;
}

export function loginStudent(input: StudentLoginInput) {
  const email = typeof input === "string" ? input : input.email;
  const normalizedEmail = email.trim().toLowerCase();
  const name = typeof input === "string"
    ? normalizedEmail.includes("@") ? normalizedEmail.split("@")[0] : "Student"
    : input.name || (normalizedEmail.includes("@") ? normalizedEmail.split("@")[0] : "Student");
  const session: StudentSession = {
    name,
    email: normalizedEmail,
    mobile: typeof input === "string" ? undefined : input.mobile,
    stateId: typeof input === "string" ? undefined : input.stateId,
    stateName: typeof input === "string" ? undefined : input.stateName,
    provider: typeof input === "string" ? "password" : input.provider || "password",
    referralCode: typeof input === "string" ? undefined : input.referralCode,
    referralDiscountType: typeof input === "string" ? undefined : input.referralDiscountType,
    referralDiscountValue: typeof input === "string" ? undefined : input.referralDiscountValue,
    referralDiscountLabel: typeof input === "string" ? undefined : input.referralDiscountLabel,
    loggedInAt: new Date().toISOString(),
  };

  window.localStorage.setItem(STUDENT_SESSION_KEY, JSON.stringify(session));
  return session;
}

export function logoutStudent() {
  window.localStorage.removeItem(STUDENT_SESSION_KEY);
}
