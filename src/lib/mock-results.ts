"use client";

import { saveTestAttempt } from "@/lib/student-dashboard";
import { getStudentSession } from "@/lib/student-auth";
import type { MockAttemptAnswerInput } from "@/lib/mock-attempt-analysis";
import type { MockTestProgressResponse } from "@/lib/mock-tests";

const resultKey = (slug: string, sectionSlug?: string) =>
  sectionSlug ? `kr_mock_result_${slug}_${sectionSlug}` : `kr_mock_result_${slug}`;

export type MockResult = {
  slug: string;
  testTitle: string;
  testType?: string;
  attemptId?: number;
  sectionId?: number;
  sectionSlug?: string;
  sectionName?: string;
  passed?: boolean;
  percentage?: number;
  passingPercentage?: number;
  maxMarks?: number;
  total: number;
  answered: number;
  correct: number;
  score: number;
  submittedAt: string;
  timeUtilizedSeconds?: number;
  durationSeconds?: number;
  progress?: MockTestProgressResponse;
};

export function getMockResult(slug: string, sectionSlug?: string): MockResult | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem(resultKey(slug, sectionSlug));
    return raw ? (JSON.parse(raw) as MockResult) : null;
  } catch {
    return null;
  }
}

export async function saveMockResult(
  result: MockResult,
  answers: MockAttemptAnswerInput[] = []
): Promise<MockResult | null> {
  const storageKey = resultKey(result.slug, result.sectionSlug);
  window.localStorage.setItem(storageKey, JSON.stringify(result));

  const session = getStudentSession();
  if (!session?.email) return result;

  const payload = await saveTestAttempt({
    email: session.email,
    slug: result.slug,
    test_title: result.testTitle,
    test_type: result.testType,
    section_id: result.sectionId,
    section_name: result.sectionName,
    total_questions: result.total,
    answered_count: result.answered,
    correct_count: result.correct,
    score: result.score,
    submitted_at: result.submittedAt,
    time_utilized_seconds: result.timeUtilizedSeconds,
    duration_seconds: result.durationSeconds,
    answers,
  });

  const enrichedResult: MockResult = {
    ...result,
    attemptId: payload?.attempt?.id ?? result.attemptId,
    passed: payload?.attempt?.passed ?? result.passed,
    percentage: payload?.attempt?.percentage ?? result.percentage,
    passingPercentage: payload?.attempt?.passing_percentage ?? result.passingPercentage,
    maxMarks: payload?.attempt?.max_marks ?? result.maxMarks,
    sectionSlug: payload?.attempt?.section_slug ?? result.sectionSlug,
    sectionName: payload?.attempt?.section_name ?? result.sectionName,
    timeUtilizedSeconds: payload?.attempt?.time_utilized_seconds ?? result.timeUtilizedSeconds,
    durationSeconds: payload?.attempt?.duration_seconds ?? result.durationSeconds,
    progress: payload?.progress ?? result.progress,
  };

  window.localStorage.setItem(storageKey, JSON.stringify(enrichedResult));

  return enrichedResult;
}

export function hasCompletedMock(slug: string, sectionSlug?: string) {
  return Boolean(getMockResult(slug, sectionSlug));
}
