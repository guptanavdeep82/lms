"use client";

import { saveTestAttempt } from "@/lib/student-dashboard";
import { getStudentSession } from "@/lib/student-auth";

const resultKey = (slug: string) => `kr_mock_result_${slug}`;

export type MockResult = {
  slug: string;
  testTitle: string;
  testType?: string;
  total: number;
  answered: number;
  correct: number;
  score: number;
  submittedAt: string;
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

export function saveMockResult(result: MockResult) {
  window.localStorage.setItem(resultKey(result.slug), JSON.stringify(result));

  const session = getStudentSession();
  if (!session?.email) return;

  void saveTestAttempt({
    email: session.email,
    slug: result.slug,
    test_title: result.testTitle,
    test_type: result.testType,
    total_questions: result.total,
    answered_count: result.answered,
    correct_count: result.correct,
    score: result.score,
    submitted_at: result.submittedAt,
  });
}

export function hasCompletedMock(slug: string) {
  return Boolean(getMockResult(slug));
}
