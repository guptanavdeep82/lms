"use client";

import { saveTestAttempt } from "@/lib/student-dashboard";
import { getStudentSession } from "@/lib/student-auth";
import type { MockAttemptAnswerInput } from "@/lib/mock-attempt-analysis";

const resultKey = (slug: string) => `kr_mock_result_${slug}`;

export type MockResult = {
  slug: string;
  testTitle: string;
  testType?: string;
  attemptId?: number;
  total: number;
  answered: number;
  correct: number;
  score: number;
  submittedAt: string;
  timeUtilizedSeconds?: number;
  durationSeconds?: number;
};

export function getMockResult(slug: string): MockResult | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem(resultKey(slug));
    return raw ? (JSON.parse(raw) as MockResult) : null;
  } catch {
    return null;
  }
}

export async function saveMockResult(
  result: MockResult,
  answers: MockAttemptAnswerInput[] = []
): Promise<number | null> {
  window.localStorage.setItem(resultKey(result.slug), JSON.stringify(result));

  const session = getStudentSession();
  if (!session?.email) return null;

  const payload = await saveTestAttempt({
    email: session.email,
    slug: result.slug,
    test_title: result.testTitle,
    test_type: result.testType,
    total_questions: result.total,
    answered_count: result.answered,
    correct_count: result.correct,
    score: result.score,
    submitted_at: result.submittedAt,
    time_utilized_seconds: result.timeUtilizedSeconds,
    duration_seconds: result.durationSeconds,
    answers,
  });

  const attemptId = payload?.attempt?.id ?? null;
  if (attemptId) {
    window.localStorage.setItem(
      resultKey(result.slug),
      JSON.stringify({ ...result, attemptId })
    );
  }

  return attemptId;
}

export function hasCompletedMock(slug: string) {
  return Boolean(getMockResult(slug));
}
