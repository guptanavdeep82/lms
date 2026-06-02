export type MockQuestion = {
  id: number;
  section_name: string;
  question_type: string;
  question_text: string;
  options: Record<"A" | "B" | "C" | "D", string | null>;
  correct_answer: string;
  marks: number;
  negative_marks: number;
  difficulty: string;
  explanation: string | null;
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
  questions: MockQuestion[];
};

export const backendBaseUrl = process.env.LMS_BACKEND_URL ?? "https://lms.eventsbyan.com";
