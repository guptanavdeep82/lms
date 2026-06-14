"use client";

const AFFILIATE_SESSION_KEY = "kr_affiliate_session";

export type AffiliateSession = {
  id: number;
  name: string;
  email: string;
  loggedInAt: string;
};

export type AffiliateCodeSummary = {
  id: number;
  code: string;
  discount_type: "percentage" | "fixed";
  discount_value: number;
  discount_label: string;
  used_count: number;
  usage_limit: number | null;
  status: string;
  students_count: number;
};

export type AffiliateStudentSummary = {
  id: number;
  name: string;
  email: string;
  mobile: string | null;
  state: string | null;
  referral_code: string | null;
  discount_label: string;
  registered_at: string | null;
};

export type AffiliateDashboardResponse = {
  affiliate: AffiliateSession;
  codes: AffiliateCodeSummary[];
  students: AffiliateStudentSummary[];
  stats: {
    total_codes: number;
    total_students: number;
  };
};

export function getAffiliateSession(): AffiliateSession | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem(AFFILIATE_SESSION_KEY);
    return raw ? (JSON.parse(raw) as AffiliateSession) : null;
  } catch {
    return null;
  }
}

export function saveAffiliateSession(session: Omit<AffiliateSession, "loggedInAt">) {
  const payload: AffiliateSession = {
    ...session,
    loggedInAt: new Date().toISOString(),
  };
  window.localStorage.setItem(AFFILIATE_SESSION_KEY, JSON.stringify(payload));
  return payload;
}

export function logoutAffiliate() {
  window.localStorage.removeItem(AFFILIATE_SESSION_KEY);
}
