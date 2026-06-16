import { publicBackendBaseUrl } from "@/lib/mock-tests";

export type HomePageSettings = {
  active_students: number;
  selections: number;
  mock_tests: number;
  experience: string | null;
  banner_images: string[];
  about_us_video: string | null;
  videos: string[];
  video_reviews: string[];
  facebook_link: string | null;
  instagram_link: string | null;
  youtube_link: string | null;
  linkedin_link: string | null;
  whatsapp_number: string | null;
};

export type HomePageReview = {
  id: number;
  name: string;
  exam_name: string | null;
  description: string;
  rating: number;
  image_url: string | null;
};

export type HomePageFaculty = {
  id: number;
  title: string;
  designation: string;
  experience: string | null;
  course_keywords: string[];
  image_url: string | null;
};

export type HomePageFaq = {
  id: number;
  question: string;
  answer: string;
  sort_order: number;
};

export type HomeTopCourse = {
  id: number;
  title: string;
  slug: string;
  short_description: string | null;
  course_type: string;
  price: number;
  sale_price: number | null;
  effective_price: number;
  duration_hours: number;
  lessons_count: number;
  is_featured: boolean;
  image_url: string | null;
};

export type HomePageResponse = {
  settings: HomePageSettings;
  reviews: HomePageReview[];
  faculties: HomePageFaculty[];
  faqs: HomePageFaq[];
  top_courses: HomeTopCourse[];
};

export type HomeVideoItem = {
  id: string;
  title: string;
  date?: string;
  label?: string;
};

export function homePageApiUrl() {
  if (typeof window !== "undefined") {
    return "/api/home-page";
  }

  return `${publicBackendBaseUrl}/api/home-page`;
}

export function extractYouTubeId(url: string): string | null {
  if (!url) return null;

  try {
    const parsed = new URL(url);

    if (parsed.hostname.includes("youtu.be")) {
      return parsed.pathname.slice(1).split("?")[0] || null;
    }

    const queryId = parsed.searchParams.get("v");
    if (queryId) return queryId;

    const embedMatch = parsed.pathname.match(/\/embed\/([^/?]+)/);
    if (embedMatch) return embedMatch[1];

    const shortsMatch = parsed.pathname.match(/\/shorts\/([^/?]+)/);
    if (shortsMatch) return shortsMatch[1];
  } catch {
    return null;
  }

  return null;
}

export function youtubeUrlsToVideos(urls: string[], fallbackTitle = "KR Logics Video"): HomeVideoItem[] {
  const videos: HomeVideoItem[] = [];

  urls.forEach((url, index) => {
    const id = extractYouTubeId(url);
    if (!id) return;

    videos.push({
      id,
      title: `${fallbackTitle} ${index + 1}`,
      date: "Latest",
      label: "Verified Success Story",
    });
  });

  return videos;
}

export function formatStatNumber(value: number): string {
  return `${value.toLocaleString("en-IN")}+`;
}

export function formatCompactStat(value: number): string {
  if (value >= 1000) {
    const compact = value / 1000;
    const formatted = Number.isInteger(compact) ? `${compact}K` : `${compact.toFixed(1).replace(/\.0$/, "")}K`;
    return `${formatted}+`;
  }

  return `${value}+`;
}

export async function fetchHomePageData(): Promise<HomePageResponse | null> {
  try {
    const response = await fetch(homePageApiUrl(), { cache: "no-store" });
    if (!response.ok) return null;
    return (await response.json()) as HomePageResponse;
  } catch {
    return null;
  }
}
