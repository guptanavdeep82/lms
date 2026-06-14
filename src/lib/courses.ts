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
  image_url: string | null;
  short_description: string | null;
  description?: string | null;
  level: string;
  price: number;
  sale_price: number | null;
  duration_hours: number;
  is_featured: boolean;
  category: string | null;
  category_slug: string | null;
  exam_type: string | null;
  exam_type_slug: string | null;
  subjects: CourseSubject[];
  lessons_count: number;
};

export type ApiCourseLesson = {
  id: number;
  title: string;
  slug: string;
  description: string | null;
  video_url: string | null;
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
  level: string;
  price: number;
  original: number;
  hours: number;
  tests: number;
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
  const base = typeof window !== "undefined" ? "/api/courses" : `${publicBackendBaseUrl}/api/courses`;
  if (!type) return base;
  return `${base}?type=${encodeURIComponent(type)}`;
}

export function courseDetailApiUrl(slug: string) {
  return typeof window !== "undefined"
    ? `/api/courses/${encodeURIComponent(slug)}`
    : `${publicBackendBaseUrl}/api/courses/${encodeURIComponent(slug)}`;
}

export async function fetchCourses(type?: string): Promise<ApiCourse[]> {
  try {
    const response = await fetch(coursesApiUrl(type), { cache: "no-store" });
    if (!response.ok) return [];
    const payload = (await response.json()) as CoursesResponse;
    return payload.courses ?? [];
  } catch {
    return [];
  }
}

export async function fetchCourseBySlug(slug: string): Promise<CourseDetailResponse | null> {
  try {
    const response = await fetch(courseDetailApiUrl(slug), { cache: "no-store" });
    if (!response.ok) return null;
    return (await response.json()) as CourseDetailResponse;
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

function normalizeExamSlug(slug: string | null, name: string | null): string {
  const source = `${slug ?? ""} ${name ?? ""}`.toLowerCase();
  if (source.includes("clerk")) return "clerk";
  if (source.includes("grade b") || source.includes("grade-b")) return "grade-b";
  if (source.includes("aao") || source.includes("so")) return "aao";
  if (source.includes("po") || source.includes("officer")) return "po";
  return "all";
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
    ibps: { icon: "fa-university", banner: "#E8EEFF", iconColor: "#1B2E6B" },
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
  if (course.price === 0) {
    return { badge: "FREE", badgeStyle: "background:#DCFCE7;color:#15803D" };
  }
  if (course.is_featured) {
    return { badge: "POPULAR", badgeStyle: "background:#EEF6FF;color:#1B2E6B" };
  }
  if (course.course_type === "live") {
    return { badge: "LIVE", badgeStyle: "background:#FAECE7;color:#993C1D" };
  }
  if (course.course_type === "pdf") {
    return { badge: "PDF", badgeStyle: "background:#FFF9E0;color:#854F0B" };
  }
  return { badge: "", badgeStyle: "" };
}

export function mapApiCourseToListingCourse(course: ApiCourse): ListingCourse {
  const visuals = courseVisuals(course);
  const badge = courseBadge(course);
  const effectivePrice = course.sale_price ?? course.price;
  const original = course.sale_price !== null && course.sale_price < course.price ? course.price : 0;

  return {
    id: course.id,
    slug: course.slug,
    title: course.title,
    desc: course.short_description || course.description || "Expert-designed course for banking exam preparation.",
    category: normalizeCategorySlug(course.category_slug),
    exam: normalizeExamSlug(course.exam_type_slug, course.exam_type),
    level: course.level || "beginner",
    price: effectivePrice,
    original,
    hours: course.duration_hours || 0,
    tests: course.lessons_count || 0,
    students: Math.max(course.lessons_count * 25, course.is_featured ? 500 : 120),
    rating: course.is_featured ? 4.8 : 4.5,
    reviews: Math.max(course.lessons_count * 8, 50),
    badge: badge.badge,
    badgeStyle: badge.badgeStyle,
    icon: visuals.icon,
    banner: visuals.banner,
    iconColor: visuals.iconColor,
    tags: course.subjects.length > 0 ? course.subjects.map((subject) => subject.name) : [course.category || "Banking"].filter(Boolean) as string[],
    isNew: false,
    type: (course.course_type === "pdf" || course.course_type === "live" ? course.course_type : "video") as ListingCourse["type"],
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

export function mapApiCourseToCatalogItem(course: ApiCourse, lessons: ApiCourseLesson[] = []) {
  const listing = mapApiCourseToListingCourse(course);
  const effectivePrice = course.sale_price ?? course.price;
  const original = course.sale_price !== null && course.sale_price < course.price ? course.price : 0;

  return {
    slug: course.slug,
    title: course.title,
    desc: course.short_description || course.description || listing.desc,
    courseType: (course.course_type === "pdf" || course.course_type === "live" ? course.course_type : "video") as "video" | "pdf" | "live",
    category: course.category || listing.category.toUpperCase(),
    exam: course.exam_type || "All Exams",
    level: course.level.charAt(0).toUpperCase() + course.level.slice(1),
    price: effectivePrice,
    original,
    hours: course.duration_hours || listing.hours,
    tests: course.lessons_count || listing.tests,
    students: listing.students,
    rating: listing.rating,
    reviews: listing.reviews,
    badge: listing.badge || undefined,
    tags: listing.tags,
    image: course.image_url || "/hero-students.png",
    outcomes: course.subjects.length > 0
      ? course.subjects.map((subject) => `${subject.name} preparation and practice`)
      : ["Structured syllabus coverage", "Exam-focused preparation", "Practice with expert guidance"],
    curriculum: lessons.length > 0
      ? lessons.map((lesson) => lesson.title)
      : course.subjects.map((subject) => subject.name),
  };
}
