import { publicBackendBaseUrl } from "@/lib/mock-tests";
import { STATIC_FALLBACK_SLUG } from "@/lib/static-fallback";

async function fetchJson<T>(path: string): Promise<T | null> {
  try {
    const response = await fetch(`${publicBackendBaseUrl}${path}`, { cache: "force-cache" });
    if (!response.ok) return null;
    return (await response.json()) as T;
  } catch {
    return null;
  }
}

function withFallback(slugs: string[]) {
  const unique = Array.from(new Set(slugs.filter((slug): slug is string => Boolean(slug))));
  if (!unique.includes(STATIC_FALLBACK_SLUG)) unique.push(STATIC_FALLBACK_SLUG);
  return unique;
}

export async function courseSlugs() {
  const data = await fetchJson<{ courses?: Array<{ slug?: string }> }>("/api/courses");
  return withFallback((data?.courses ?? []).map((item) => item.slug).filter((slug): slug is string => Boolean(slug)));
}

export async function mockCategorySlugs() {
  const data = await fetchJson<{ categories?: Array<{ slug?: string; tests?: Array<{ slug?: string }> }> }>("/api/mock-tests");
  return withFallback([
    "banking-exams",
    "banking-exam",
    ...((data?.categories ?? []).map((item) => item.slug).filter((slug): slug is string => Boolean(slug))),
  ]);
}

export async function mockTestSlugs() {
  const data = await fetchJson<{ categories?: Array<{ tests?: Array<{ slug?: string }> }> }>("/api/mock-tests");
  return withFallback(
    (data?.categories ?? [])
      .flatMap((category) => category.tests ?? [])
      .map((item) => item.slug)
      .filter((slug): slug is string => Boolean(slug)),
  );
}

export async function cmsPageSlugs() {
  const data = await fetchJson<{ pages?: Array<{ slug?: string }> }>("/api/pages");
  return withFallback((data?.pages ?? []).map((item) => item.slug).filter((slug): slug is string => Boolean(slug)));
}

export async function liveCourseSlugs() {
  const data = await fetchJson<{ courses?: Array<{ slug?: string }> }>("/api/courses?type=live");
  const fromCourses = (data?.courses ?? []).map((item) => item.slug).filter((slug): slug is string => Boolean(slug));
  const sessions = await fetchJson<{ sessions?: Array<{ course?: { slug?: string } }> }>("/api/live-sessions");
  const fromSessions = (sessions?.sessions ?? [])
    .map((item) => item.course?.slug)
    .filter((slug): slug is string => Boolean(slug));
  return withFallback(Array.from(new Set([...fromCourses, ...fromSessions])));
}
