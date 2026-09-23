import { publicBackendBaseUrl } from "@/lib/mock-tests";

export type MockAttemptAnswerInput = {
  question_id: number;
  question_number: number;
  selected_answer?: string | null;
  time_spent_seconds?: number;
  marked_for_review?: boolean;
  visited?: boolean;
  visit_order?: number | null;
};

export type MockAttemptQuestion = {
  id: number;
  question_number: number;
  section_name: string;
  topic: string;
  question_type: string;
  question_text: string;
  options: { A?: string | null; B?: string | null; C?: string | null; D?: string | null; E?: string | null };
  selected_answer: string | null;
  correct_answer: string;
  explanation: string | null;
  marks: number;
  negative_marks: number;
  difficulty: string;
  status: "correct" | "incorrect" | "skipped" | "unseen";
  is_correct: boolean;
  time_spent_seconds: number;
  marked_for_review: boolean;
  visited: boolean;
  visit_order: number | null;
  score_delta: number;
};

export type MockAttemptComparison = {
  your_score: number;
  topper_score: number;
  average_score: number;
};

export type MockScoringBreakdown = {
  marks_per_correct: number | null;
  negative_per_wrong: number | null;
  correct: number;
  incorrect: number;
  skipped: number;
  positive_marks: number;
  negative_marks: number;
  net_score: number;
  total_marks: number;
  formula: string;
  correct_line: string;
  wrong_line: string;
  skipped_line: string;
};

export type MockAttemptSectionSummary = {
  section_name: string;
  total_questions: number;
  attempted: number;
  correct: number;
  incorrect: number;
  skipped: number;
  unseen: number;
  accuracy: number;
  score: number;
  total_marks: number;
  positive_marks?: number;
  negative_marks?: number;
  time_spent_seconds: number;
  percentage?: number;
  percentile?: number;
  rank?: number;
  total_participants?: number;
  comparison?: MockAttemptComparison;
  scoring?: MockScoringBreakdown;
};

export type MockAttemptTopicSummary = {
  section_name: string;
  topic: string;
  question_numbers: number[];
  question_ids: number[];
  attempted: number;
  correct: number;
  incorrect: number;
  accuracy: number;
};

export type MockAttemptDetail = {
  attempt: {
    id: number;
    slug: string;
    test_title: string;
    attempt_type: string;
    submitted_at: string;
    duration_seconds: number;
    time_utilized_seconds: number;
  };
  summary: {
    score: number;
    total_marks: number;
    total_questions: number;
    attempted: number;
    correct: number;
    incorrect: number;
    skipped: number;
    unseen: number;
    accuracy: number;
    time_utilized_seconds: number;
    duration_seconds: number;
    wasted_time_seconds: number;
    scoring?: MockScoringBreakdown;
    rank?: number;
    total_participants?: number;
    percentile?: number;
    percentage?: number;
    your_score?: number;
    topper_score?: number;
    average_score?: number;
    comparison?: MockAttemptComparison;
  };
  comparison?: MockAttemptComparison;
  sections: MockAttemptSectionSummary[];
  topics: MockAttemptTopicSummary[];
  time_split: {
    sections: Array<{
      section_name: string;
      correct_time_seconds: number;
      wrong_time_seconds: number;
      skipped_time_seconds: number;
    }>;
    topics: Array<{
      section_name: string;
      topic: string;
      correct_time_seconds: number;
      wrong_time_seconds: number;
      skipped_time_seconds: number;
    }>;
  };
  weak_zones: Array<{
    section_name: string;
    topics: Array<{ topic: string; accuracy: number; question_numbers: number[] }>;
  }>;
  strong_zones: Array<{
    section_name: string;
    topics: Array<{ topic: string; accuracy: number; question_numbers: number[] }>;
  }>;
  selection_order: number[];
  questions: MockAttemptQuestion[];
};

function apiUrl(path: string) {
  return `${publicBackendBaseUrl}/api/student${path}`;
}

export async function fetchMockAttemptDetail(email: string, attemptId: number) {
  const response = await fetch(
    apiUrl(`/test-results/${attemptId}?email=${encodeURIComponent(email)}`),
    { cache: "no-store" }
  );
  if (!response.ok) throw new Error("Unable to load attempt details.");
  return response.json() as Promise<MockAttemptDetail>;
}

export async function fetchMockAttemptBySlug(email: string, slug: string, combined = false) {
  const params = new URLSearchParams({ email });
  if (combined) params.set("combined", "1");
  const response = await fetch(
    apiUrl(`/test-results/by-slug/${slug}?${params.toString()}`),
    { cache: "no-store" }
  );
  if (!response.ok) throw new Error("Unable to load attempt details.");
  return response.json() as Promise<MockAttemptDetail>;
}

export function formatMockDuration(totalSeconds: number) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }

  if (minutes > 0) {
    return `${minutes}m ${seconds}s`;
  }

  return `${seconds}s`;
}

export function formatMockClock(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export function optionLabel(key: string, options: MockAttemptQuestion["options"]) {
  const text = options[key as keyof typeof options];
  if (!text) return key;

  const decoded = String(text)
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&#(\d+);/g, (_m, num) => {
      const n = parseInt(String(num), 10);
      return Number.isNaN(n) ? String(_m) : String.fromCharCode(n);
    })
    .replace(/&#x([0-9a-fA-F]+);/g, (_m, hex) => {
      const n = parseInt(String(hex), 16);
      return Number.isNaN(n) ? String(_m) : String.fromCharCode(n);
    });

  return decoded ? `${key}. ${decoded}` : key;
}
