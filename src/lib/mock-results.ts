"use client";

const resultKey = (slug: string) => `kr_mock_result_${slug}`;

export type MockResult = {
  slug: string;
  testTitle: string;
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
}

export function hasCompletedMock(slug: string) {
  return Boolean(getMockResult(slug));
}
