export type MockQuestion = {
  id: number;
  section_name: string;
  question_type: string;
  question_text: string;
  options: Partial<Record<"A" | "B" | "C" | "D" | "E", string | null>>;
  correct_answer: string;
  marks: number;
  negative_marks: number;
  difficulty: string;
  explanation: string | null;
};

export type MockTestSectionSummary = {
  answered: number;
  answered_review: number;
  not_answered: number;
  marked_review: number;
  not_visited: number;
  time_taken_seconds: number;
};

export type MockTestSection = {
  id: number;
  name: string;
  slug: string;
  sort_order: number;
  duration_minutes: number;
  total_marks?: number;
  default_marks?: number;
  passing_percentage: number;
  instructions: string | null;
  questions_count: number;
  status: "locked" | "available" | "passed" | "completed";
  best_score: number;
  best_percentage: number;
  attempts_count: number;
  passed_at: string | null;
  summary?: MockTestSectionSummary | null;
  latest_attempt?: {
    id: number;
    score: number;
    percentage: number;
    passed: boolean;
    correct_count: number;
    total_questions: number;
    time_utilized_seconds: number;
    duration_seconds: number;
    submitted_at: string | null;
  } | null;
};

export type MockTest = {
  id: number;
  title: string;
  slug: string;
  category: string | null;
  category_slug: string | null;
  image_url: string | null;
  test_type: "full_length" | "starter" | "sectional" | string;
  is_locked: boolean;
  duration_minutes: number;
  total_marks: number;
  price: number | null;
  sale_price: number | null;
  instructions: string | null;
  status: string;
  questions_count: number;
  sequential_sections?: boolean;
  sections_count?: number;
};

export type MockCategory = {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  tests: MockTest[];
};

export type MockTestsResponse = {
  categories: MockCategory[];
};

export type MockTestDetailResponse = {
  test: MockTest;
  sections?: MockTestSection[];
  sequential_sections?: boolean;
  questions: MockQuestion[];
};

export type MockTestSectionExamResponse = {
  test: MockTest;
  section: {
    id: number;
    name: string;
    slug: string;
    duration_minutes: number;
    total_marks?: number;
    passing_percentage: number;
    instructions: string | null;
  };
  questions: MockQuestion[];
  progress: {
    sequential_sections: boolean;
    sections: MockTestSection[];
  };
};

const defaultBackendBaseUrl = "https://api.hostingwala.tech";

export const backendBaseUrl = process.env.LMS_BACKEND_URL ?? defaultBackendBaseUrl;
export const publicBackendBaseUrl = process.env.NEXT_PUBLIC_LMS_BACKEND_URL ?? defaultBackendBaseUrl;

export function lmsApiUrl(path: string) {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${publicBackendBaseUrl}${normalized}`;
}

export const lmsFetchCache: RequestCache = typeof window === "undefined" ? "force-cache" : "no-store";

export function mockTestsApiUrl(slug?: string, email?: string) {
  const base = `${publicBackendBaseUrl}/api/mock-tests${slug ? `/${encodeURIComponent(slug)}` : ""}`;
  if (!email) return base;
  return `${base}?email=${encodeURIComponent(email)}`;
}

export function mockTestSectionExamUrl(slug: string, sectionSlug: string, email: string) {
  return `${publicBackendBaseUrl}/api/mock-tests/${encodeURIComponent(slug)}/sections/${encodeURIComponent(sectionSlug)}/exam?email=${encodeURIComponent(email)}`;
}

export function nextUnlockedSection(sections: MockTestSection[], currentSlug: string): MockTestSection | null {
  const sorted = [...sections].sort((a, b) => a.sort_order - b.sort_order);
  const index = sorted.findIndex((section) => section.slug === currentSlug);
  if (index < 0) return null;

  const next = sorted[index + 1];
  if (!next || next.status === "locked") return null;

  return next;
}

export function mockTestProgressUrl(slug: string, email: string) {
  return `${publicBackendBaseUrl}/api/mock-tests/${encodeURIComponent(slug)}/progress?email=${encodeURIComponent(email)}`;
}

export const MOCK_EXAM_MESSAGE_SOURCE = "kr-mock-exam";

export function notifyMockExamOpener(payload: {
  slug: string;
  sections: MockTestSection[];
}) {
  if (typeof window === "undefined" || !window.opener) return;
  try {
    window.opener.postMessage(
      { source: MOCK_EXAM_MESSAGE_SOURCE, type: "section-progress", ...payload },
      window.location.origin,
    );
  } catch {
    // Popup opener may already be closed.
  }
}

export type MockTestProgressResponse = {
  sequential_sections: boolean;
  sections: MockTestSection[];
};

export function sectionTotalMarks(section: MockTestSection, questions: MockQuestion[] = []): number {
  if (typeof section.total_marks === "number" && Number.isFinite(section.total_marks)) {
    return section.total_marks;
  }

  const sectionQuestions = questions.filter((question) => question.section_name === section.name);
  if (sectionQuestions.length > 0) {
    return sectionQuestions.reduce((sum, question) => sum + (question.marks || 0), 0);
  }

  if (typeof section.default_marks === "number" && section.default_marks > 0) {
    return section.default_marks * (section.questions_count || 0);
  }

  return section.questions_count || 0;
}

export function examTotalsFromDetail(data: MockTestDetailResponse) {
  const sections = [...(data.sections ?? [])].sort((a, b) => a.sort_order - b.sort_order);
  if (data.sequential_sections && sections.length > 0) {
    const questionsCount = sections.reduce((sum, section) => sum + (section.questions_count || 0), 0);
    const durationMinutes = sections.reduce((sum, section) => sum + (section.duration_minutes || 0), 0);
    const totalMarks = sections.reduce((sum, section) => sum + sectionTotalMarks(section, data.questions), 0);

    return {
      questions_count: questionsCount || data.test.questions_count,
      duration_minutes: durationMinutes || data.test.duration_minutes,
      total_marks: totalMarks || data.test.total_marks,
    };
  }

  return {
    questions_count: data.test.questions_count,
    duration_minutes: data.test.duration_minutes,
    total_marks: data.test.total_marks,
  };
}
