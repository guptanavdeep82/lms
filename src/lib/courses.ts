import { publicBackendBaseUrl } from "@/lib/mock-tests";

export type CourseSubject = {
  id: number;
  name: string;
  slug: string;
};

export type ApiCourse = {
  id: number;
  title: string;
  slug: string;
  course_type: "video" | "pdf" | "live" | string;
  content_types?: string[];
  sale_ends_at?: string | null;
  is_sale_closed?: boolean;
  image_url: string | null;
  banner_url?: string | null;
  pdf_url?: string | null;
  short_description: string | null;
  description?: string | null;
  course_includes?: string[];
  level: string;
  price: number;
  sale_price: number | null;
  duration_hours: number;
  validity_months?: number;
  rating?: number | null;
  reviews_count?: number;
  students_count?: number;
  folder_video_count?: number;
  folder_pdf_count?: number;
  mock_test_count?: number;
  is_featured: boolean;
  category: string | null;
  category_slug: string | null;
  exam_type: string | null;
  exam_type_slug: string | null;
  exam_types?: { id: number; name: string; slug: string }[];
  subjects: CourseSubject[];
  lessons_count: number;
  has_live_classes?: boolean;
  live_sessions_count?: number;
};

export type ApiCourseLesson = {
  id: number;
  title: string;
  slug: string;
  description: string | null;
  video_url: string | null;
  has_video?: boolean;
  video_delivery?: "signed" | "external" | null;
  resource_url: string | null;
  duration_minutes: number;
  is_preview: boolean;
};

export type CoursesResponse = {
  courses: ApiCourse[];
  meta: {
    total: number;
  };
};

export type CourseDetailResponse = {
  course: ApiCourse;
  lessons: ApiCourseLesson[];
};

export type ListingCourse = {
  id: number;
  slug: string;
  title: string;
  desc: string;
  category: string;
  exam: string;
  examSlugs: string[];
  level: string;
  price: number;
  original: number;
  hours: number;
  lessons: number;
  videos: number;
  pdfs: number;
  mockTests: number;
  liveSessions: number;
  validityMonths: number;
  students: number;
  rating: number;
  reviews: number;
  badge: string;
  badgeStyle: string;
  icon: string;
  banner: string;
  iconColor: string;
  tags: string[];
  isNew: boolean;
  type: "video" | "pdf" | "live";
  offersLive: boolean;
  image_url: string | null;
};

export type LiveClassSession = {
  slug: string;
  title: string;
  faculty: string;
  time: string;
  duration: string;
  status: "live" | "scheduled" | "replay";
  subject: string;
  type: "live" | "recorded";
  students: number;
  imageUrl: string | null;
};

export function coursesApiUrl(type?: string) {
  const base = `${publicBackendBaseUrl}/api/courses`;
  if (!type) return base;
  return `${base}?type=${encodeURIComponent(type)}`;
}

export function courseDetailApiUrl(slug: string) {
  return `${publicBackendBaseUrl}/api/courses/${encodeURIComponent(slug)}`;
}

export async function fetchCourses(type?: string): Promise<ApiCourse[]> {
  try {
    const response = await fetch(coursesApiUrl(type), { cache: typeof window === "undefined" ? "force-cache" : "no-store" });
    if (!response.ok) return [];
    const payload = (await response.json()) as CoursesResponse;
    return payload.courses ?? [];
  } catch {
    return [];
  }
}

export async function fetchCourseBySlug(slug: string): Promise<CourseDetailResponse | null> {
  try {
    const response = await fetch(courseDetailApiUrl(slug), { cache: typeof window === "undefined" ? "force-cache" : "no-store" });
    if (!response.ok) return null;
    return (await response.json()) as CourseDetailResponse;
  } catch {
    return null;
  }
}

export function lessonVideoApiUrl(lessonId: number, email: string) {
  const query = `email=${encodeURIComponent(email)}`;
  return `${publicBackendBaseUrl}/api/lesson/${lessonId}/video?${query}`;
}

export function mediaVideoApiUrl(mediaId: number, email: string) {
  const query = `email=${encodeURIComponent(email)}`;
  return `${publicBackendBaseUrl}/api/media/${mediaId}/video?${query}`;
}

export type LessonVideoQuality = {
  id: string;
  label: string;
  url: string;
  height?: number | null;
};

export type LessonVideoPlayback = {
  video_url: string | null;
  qualities: LessonVideoQuality[];
};

export async function fetchLessonVideoPlayback(lessonId: number, email: string): Promise<LessonVideoPlayback | null> {
  try {
    const response = await fetch(lessonVideoApiUrl(lessonId, email), { cache: "no-store" });
    if (!response.ok) return null;
    const payload = (await response.json()) as { video_url?: string | null; qualities?: LessonVideoQuality[] };
    return {
      video_url: payload.video_url ?? null,
      qualities: payload.qualities ?? [],
    };
  } catch {
    return null;
  }
}

export async function fetchLessonVideoUrl(lessonId: number, email: string): Promise<string | null> {
  const playback = await fetchLessonVideoPlayback(lessonId, email);
  return playback?.video_url ?? null;
}

export async function fetchMediaVideoPlayback(mediaId: number, email: string): Promise<LessonVideoPlayback | null> {
  try {
    const response = await fetch(mediaVideoApiUrl(mediaId, email), { cache: "no-store" });
    if (!response.ok) return null;
    const payload = (await response.json()) as { video_url?: string | null; qualities?: LessonVideoQuality[] };
    return {
      video_url: payload.video_url ?? null,
      qualities: payload.qualities ?? [],
    };
  } catch {
    return null;
  }
}

function normalizeCategorySlug(slug: string | null): string {
  if (!slug) return "ibps";
  const value = slug.toLowerCase();
  if (["ibps", "sbi", "rbi", "insurance", "aptitude", "english", "gk", "ssc"].includes(value)) {
    return value;
  }
  if (value.includes("bank")) return "ibps";
  if (value.includes("insur")) return "insurance";
  if (value.includes("english")) return "english";
  if (value.includes("quant") || value.includes("aptitude")) return "aptitude";
  if (value.includes("affair") || value.includes("gk")) return "gk";
  return value.replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "ibps";
}

function courseExamSlugs(course: ApiCourse): string[] {
  return Array.from(
    new Set(
      [
        course.exam_type_slug,
        ...(course.exam_types ?? []).map((examType) => examType.slug),
      ]
        .filter((slug): slug is string => Boolean(slug && slug.trim()))
        .map((slug) => slug.toLowerCase()),
    ),
  );
}

function courseVisuals(course: ApiCourse) {
  if (course.course_type === "pdf") {
    return { icon: "fa-file-pdf", banner: "#FFFBEB", iconColor: "#BA7517" };
  }
  if (course.course_type === "live") {
    return { icon: "fa-video", banner: "#FFF0EB", iconColor: "#D85A30" };
  }

  const category = normalizeCategorySlug(course.category_slug);
  const map: Record<string, { icon: string; banner: string; iconColor: string }> = {
    ibps: { icon: "fa-university", banner: "#E8EEFF", iconColor: "#0957D3" },
    sbi: { icon: "fa-piggy-bank", banner: "#E6FFF2", iconColor: "#1D9E75" },
    rbi: { icon: "fa-landmark", banner: "#FFF0EB", iconColor: "#D85A30" },
    insurance: { icon: "fa-shield-alt", banner: "#F3F0FF", iconColor: "#7F77DD" },
    aptitude: { icon: "fa-calculator", banner: "#FFFBEB", iconColor: "#BA7517" },
    english: { icon: "fa-spell-check", banner: "#F3F4FF", iconColor: "#4C6EF5" },
    gk: { icon: "fa-chart-line", banner: "#F0FDF4", iconColor: "#15803D" },
    ssc: { icon: "fa-file-signature", banner: "#FFF7ED", iconColor: "#EA580C" },
  };

  return map[category] ?? map.ibps;
}

function courseBadge(course: ApiCourse): { badge: string; badgeStyle: string } {
  const offersLive = Boolean(course.has_live_classes) || course.course_type === "live";

  if (course.price === 0) {
    return { badge: offersLive ? "LIVE · FREE" : "FREE", badgeStyle: "background:#DCFCE7;color:#15803D" };
  }
  if (offersLive) {
    return { badge: "LIVE", badgeStyle: "background:#FAECE7;color:#993C1D" };
  }
  if (course.is_featured) {
    return { badge: "POPULAR", badgeStyle: "background:#EEF6FF;color:#0957D3" };
  }
  if (course.course_type === "pdf") {
    return { badge: "PDF", badgeStyle: "background:#FFF9E0;color:#854F0B" };
  }
  return { badge: "", badgeStyle: "" };
}

export function mapApiCourseToListingCourse(course: ApiCourse): ListingCourse {
  const visuals = courseVisuals(course);
  const badge = courseBadge(course);
  const offersLive = Boolean(course.has_live_classes) || course.course_type === "live";
  const effectivePrice = course.sale_price ?? course.price;
  const original = course.sale_price !== null && course.sale_price < course.price ? course.price : 0;

  const examSlugs = courseExamSlugs(course);

  return {
    id: course.id,
    slug: course.slug,
    title: course.title,
    desc: course.short_description || course.description || "Expert-designed course for banking exam preparation.",
    category: (course.category_slug || course.category || "").toLowerCase() || "all",
    exam: examSlugs[0] || "all",
    examSlugs,
    level: course.level || "beginner",
    price: effectivePrice,
    original,
    hours: course.duration_hours || 0,
    lessons: course.lessons_count || 0,
    videos: course.folder_video_count || 0,
    pdfs: course.folder_pdf_count || 0,
    mockTests: course.mock_test_count || 0,
    liveSessions: course.live_sessions_count || 0,
    validityMonths: course.validity_months ?? 12,
    students: course.students_count || 0,
    rating: course.rating || 0,
    reviews: course.reviews_count || 0,
    badge: badge.badge,
    badgeStyle: badge.badgeStyle,
    icon: visuals.icon,
    banner: visuals.banner,
    iconColor: visuals.iconColor,
    tags: course.subjects.length > 0 ? course.subjects.map((subject) => subject.name) : [course.category || "Banking"].filter(Boolean) as string[],
    isNew: false,
    type: (course.course_type === "pdf" || course.course_type === "live" ? course.course_type : "video") as ListingCourse["type"],
    offersLive,
    image_url: course.image_url,
  };
}

export function mapApiCourseToLiveSession(course: ApiCourse): LiveClassSession {
  const primarySubject = course.subjects[0]?.slug ?? normalizeCategorySlug(course.category_slug);
  const durationMinutes = course.duration_hours > 0 ? course.duration_hours * 60 : 60;

  return {
    slug: course.slug,
    title: course.title,
    faculty: course.exam_type || course.category || "KR Logics Faculty",
    time: course.short_description || "Schedule available after enrollment",
    duration: `${durationMinutes} min`,
    status: course.is_featured ? "live" : "scheduled",
    subject: primarySubject,
    type: "live",
    students: Math.max(course.lessons_count * 20, 100),
    imageUrl: course.image_url,
  };
}

export function countLabel(count: number, singular: string, plural = `${singular}s`) {
  return `${count.toLocaleString("en-IN")} ${count === 1 ? singular : plural}`;
}

export function courseAccessLabel(months: number) {
  if (months <= 0) return "Lifetime access";
  if (months % 12 === 0) return `${countLabel(months / 12, "year")} access`;
  return `${countLabel(months, "month")} access`;
}

/** Content lines built from what is actually attached to the course; zero counts are left out. */
export function courseContentHighlights(course: ListingCourse): string[] {
  const items: string[] = [];
  if (course.videos > 0) {
    items.push(`${countLabel(course.videos, "recorded video")}${course.hours > 0 ? ` (${course.hours}+ hours)` : ""}`);
  } else if (course.hours > 0 && course.type !== "pdf") {
    items.push(`${course.hours}+ hours of ${course.type === "live" ? "live classes" : "video content"}`);
  }
  if (course.liveSessions > 0) items.push(countLabel(course.liveSessions, "live session"));
  if (course.lessons > 0) items.push(countLabel(course.lessons, "lesson"));
  if (course.pdfs > 0) items.push(countLabel(course.pdfs, "downloadable PDF"));
  if (course.mockTests > 0) items.push(countLabel(course.mockTests, "mock test"));
  return items;
}

export type CourseStat = {
  key: "videos" | "hours" | "live" | "lessons" | "pdfs" | "mock_tests" | "students" | "rating" | "validity";
  value: string;
  label: string;
};

function courseStats(course: ListingCourse): CourseStat[] {
  const content: CourseStat[] = [];
  if (course.videos > 0) content.push({ key: "videos", value: course.videos.toLocaleString("en-IN"), label: course.videos === 1 ? "Video" : "Videos" });
  if (course.hours > 0 && course.type !== "pdf") content.push({ key: "hours", value: `${course.hours}+ hrs`, label: course.type === "live" ? "Live classes" : "Video content" });
  if (course.mockTests > 0) content.push({ key: "mock_tests", value: course.mockTests.toLocaleString("en-IN"), label: course.mockTests === 1 ? "Mock Test" : "Mock Tests" });
  if (course.pdfs > 0) content.push({ key: "pdfs", value: course.pdfs.toLocaleString("en-IN"), label: course.pdfs === 1 ? "PDF" : "PDFs" });
  if (course.liveSessions > 0) content.push({ key: "live", value: course.liveSessions.toLocaleString("en-IN"), label: "Live Sessions" });
  if (course.lessons > 0) content.push({ key: "lessons", value: course.lessons.toLocaleString("en-IN"), label: course.lessons === 1 ? "Lesson" : "Lessons" });

  const social: CourseStat[] = [];
  if (course.students > 0) social.push({ key: "students", value: course.students.toLocaleString("en-IN"), label: course.students === 1 ? "Student" : "Students" });
  if (course.rating > 0) social.push({ key: "rating", value: course.rating.toFixed(1), label: course.reviews > 0 ? countLabel(course.reviews, "review") : "Rating" });

  const validity: CourseStat = {
    key: "validity",
    value: course.validityMonths <= 0 ? "Lifetime" : course.validityMonths % 12 === 0 ? `${course.validityMonths / 12} yr` : `${course.validityMonths} mo`,
    label: "Access",
  };

  return [...content.slice(0, 2), ...social, ...content.slice(2), validity].slice(0, 4);
}

export function mapApiCourseToCatalogItem(course: ApiCourse, lessons: ApiCourseLesson[] = []) {
  const listing = mapApiCourseToListingCourse(course);
  const effectivePrice = course.sale_price ?? course.price;
  const original = course.sale_price !== null && course.sale_price < course.price ? course.price : 0;
  const courseType = (course.course_type === "pdf" || course.course_type === "live" ? course.course_type : "video") as "video" | "pdf" | "live";
  const autoIncludes = [
    ...courseContentHighlights(listing),
    course.subjects.length > 0 ? `Covers ${course.subjects.map((subject) => subject.name).join(", ")}` : "",
    courseAccessLabel(listing.validityMonths),
  ].filter(Boolean);

  return {
    slug: course.slug,
    title: course.title,
    desc: course.short_description || course.description || listing.desc,
    courseType,
    category: course.category || listing.category.toUpperCase(),
    exam: course.exam_type || "All Exams",
    level: course.level.charAt(0).toUpperCase() + course.level.slice(1),
    price: effectivePrice,
    original,
    stats: courseStats(listing),
    badge: listing.badge || undefined,
    tags: listing.tags,
    image: course.banner_url || course.image_url || "/hero-students.png",
    thumbnail: course.image_url || "/hero-students.png",
    pdfUrl: course.pdf_url || null,
    contentTypes: course.content_types ?? [],
    saleClosed: Boolean(course.is_sale_closed),
    includes: Array.from(new Set([...autoIncludes, ...(course.course_includes ?? [])])),
    outcomes: course.subjects.length > 0
      ? course.subjects.map((subject) => `${subject.name} preparation and practice`)
      : ["Structured syllabus coverage", "Exam-focused preparation", "Practice with expert guidance"],
    curriculum: lessons.length > 0
      ? lessons.map((lesson) => lesson.title)
      : course.subjects.map((subject) => subject.name),
  };
}
