import { publicBackendBaseUrl } from "@/lib/mock-tests";
import type { StudentLibraryResponse } from "@/lib/packages";

export type StudentProfileResponse = {
  id: number;
  name: string;
  email: string;
  mobile?: string | null;
  provider?: string;
  mobile_verified?: boolean;
  state?: { id: number; name: string; code: string } | null;
  referral_code?: string | null;
  referral_discount_label?: string | null;
  custom_discount_percent?: number | null;
  invite_code?: string | null;
  coupons?: Array<{
    id: number;
    code?: string;
    discount_type?: string;
    discount_value?: number;
    status: string;
  }>;
};

export type MockTestAttemptRecord = {
  id: number;
  slug: string;
  test_title: string;
  attempt_type: "daily_practice" | "mock_test";
  total_questions: number;
  answered_count: number;
  correct_count: number;
  score: number;
  submitted_at: string;
};

export type ReferEarnData = {
  invite_code: string;
  invite_link: string;
  referrals_count: number;
  earned_amount: number;
  instructions: string[];
};

export type SupportTicketRecord = {
  id: number;
  ticket_no: string;
  subject: string;
  category: string;
  message: string;
  status: string;
  admin_reply?: string | null;
  replied_at?: string | null;
  created_at?: string | null;
};

function apiUrl(path: string) {
  return typeof window !== "undefined"
    ? `/api/student-dashboard${path}`
    : `${publicBackendBaseUrl}${path}`;
}

export async function fetchStudentProfile(email: string): Promise<StudentProfileResponse | null> {
  const response = await fetch(apiUrl(`/profile?email=${encodeURIComponent(email)}`), { cache: "no-store" });
  if (!response.ok) return null;
  const data = await response.json() as { student?: StudentProfileResponse };
  return data.student || null;
}

export async function updateStudentProfile(input: {
  email: string;
  name: string;
  mobile?: string;
  state_id?: number;
}) {
  const response = await fetch(typeof window !== "undefined" ? "/api/student/sync" : `${publicBackendBaseUrl}/api/student/sync`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(input),
  });
  const data = await response.json().catch(() => ({})) as { student?: StudentProfileResponse; message?: string; errors?: Record<string, string[]> };
  if (!response.ok) {
    const fieldError = data.errors ? Object.values(data.errors)[0]?.[0] : null;
    throw new Error(fieldError || data.message || "Unable to update profile.");
  }
  return data.student || null;
}

export async function fetchTestAttempts(email: string, type?: "daily_practice" | "mock_test") {
  const query = new URLSearchParams({ email });
  if (type) query.set("type", type);
  const response = await fetch(apiUrl(`/test-results?${query.toString()}`), { cache: "no-store" });
  if (!response.ok) return [] as MockTestAttemptRecord[];
  const data = await response.json() as { attempts?: MockTestAttemptRecord[] };
  return data.attempts || [];
}

export async function saveTestAttempt(input: {
  email: string;
  slug: string;
  test_title: string;
  test_type?: string;
  total_questions: number;
  answered_count: number;
  correct_count: number;
  score: number;
  submitted_at?: string;
}) {
  const response = await fetch(apiUrl("/test-results"), {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(input),
  });
  if (!response.ok) return null;
  return response.json();
}

export async function fetchReferEarn(email: string): Promise<ReferEarnData | null> {
  const response = await fetch(apiUrl(`/refer-earn?email=${encodeURIComponent(email)}`), { cache: "no-store" });
  if (!response.ok) return null;
  return response.json() as Promise<ReferEarnData>;
}

export async function fetchSupportTickets(email: string) {
  const response = await fetch(apiUrl(`/tickets?email=${encodeURIComponent(email)}`), { cache: "no-store" });
  if (!response.ok) return [] as SupportTicketRecord[];
  const data = await response.json() as { tickets?: SupportTicketRecord[] };
  return data.tickets || [];
}

export async function createSupportTicket(input: {
  email: string;
  subject: string;
  category?: string;
  message: string;
}) {
  const response = await fetch(apiUrl("/tickets"), {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(input),
  });
  const data = await response.json().catch(() => ({})) as { ticket?: SupportTicketRecord; message?: string };
  if (!response.ok) throw new Error(data.message || "Unable to create ticket.");
  return data.ticket || null;
}

export async function fetchStudentLibraryData(email: string): Promise<StudentLibraryResponse | null> {
  const response = await fetch(apiUrl(`/library?email=${encodeURIComponent(email)}`), { cache: "no-store" });
  if (!response.ok) return null;
  return response.json() as Promise<StudentLibraryResponse>;
}

export function studentInitials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || "")
    .join("") || "ST";
}
