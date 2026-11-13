"use client";

import { lmsApiUrl } from "@/lib/mock-tests";
import { getStudentSession, studentAuthHeaders } from "@/lib/student-auth";

export type CommunityAttachment = {
  kind: "image" | "audio" | "document";
  name: string | null;
  mime: string | null;
  url: string;
};

export type CommunitySummary = {
  id: number;
  name: string;
  description: string | null;
  course_id: number;
  course_title: string | null;
  members_count: number;
  last_message: string | null;
  last_message_at: string | null;
};

export type CommunityMessage = {
  id: number;
  sender_type: "student" | "admin";
  sender_name: string;
  is_mine: boolean;
  body: string | null;
  attachment: CommunityAttachment | null;
  created_at: string | null;
  time_label: string | null;
};

export type CommunityThread = {
  community: CommunitySummary;
  messages: CommunityMessage[];
  has_more: boolean;
};

function studentEmail() {
  const email = getStudentSession()?.email?.trim().toLowerCase();
  if (!email) throw new Error("Please log in again to open communities.");
  return email;
}

async function readError(response: Response) {
  const payload = (await response.json().catch(() => ({}))) as {
    message?: string;
    errors?: Record<string, string[]>;
  };
  const first = payload.errors ? Object.values(payload.errors)[0]?.[0] : undefined;
  return first || payload.message || "Something went wrong. Please try again.";
}

export async function fetchCommunities() {
  const email = studentEmail();
  const response = await fetch(lmsApiUrl(`/api/student/communities?email=${encodeURIComponent(email)}`), {
    headers: { Accept: "application/json", ...studentAuthHeaders() },
    cache: "no-store",
  });
  if (!response.ok) throw new Error(await readError(response));
  const payload = (await response.json()) as { communities?: CommunitySummary[] };
  return payload.communities ?? [];
}

export async function fetchCommunityMessages(communityId: number, options: { afterId?: number; beforeId?: number } = {}) {
  const email = studentEmail();
  const params = new URLSearchParams({ email });
  if (options.afterId) params.set("after_id", String(options.afterId));
  if (options.beforeId) params.set("before_id", String(options.beforeId));
  const response = await fetch(lmsApiUrl(`/api/student/communities/${communityId}/messages?${params.toString()}`), {
    headers: { Accept: "application/json", ...studentAuthHeaders() },
    cache: "no-store",
  });
  if (!response.ok) throw new Error(await readError(response));
  return (await response.json()) as CommunityThread;
}

export async function sendCommunityMessage(communityId: number, body: string, file?: File | null) {
  const email = studentEmail();
  const data = new FormData();
  data.append("email", email);
  if (body.trim()) data.append("body", body.trim());
  if (file) data.append("file", file);
  const response = await fetch(lmsApiUrl(`/api/student/communities/${communityId}/messages`), {
    method: "POST",
    headers: { Accept: "application/json", ...studentAuthHeaders() },
    body: data,
  });
  if (!response.ok) throw new Error(await readError(response));
  const payload = (await response.json()) as { message: CommunityMessage };
  return payload.message;
}
