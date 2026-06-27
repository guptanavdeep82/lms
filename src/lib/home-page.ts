import { publicBackendBaseUrl } from "@/lib/mock-tests";

export type HomeTrendingLink = {
  label: string;
  url: string;
};

export type HomeAchievementStat = {
  value: string;
  label: string;
  icon: string;
};

export type HomeOfferBar = {
  enabled: boolean;
  title: string;
  highlight: string;
  suffix: string;
  description: string;
  code: string;
  btn_text: string;
  btn_url: string;
};

export type HomeFeaturePoint = {
  icon: string;
  title: string;
  description: string;
};

export type HomeAboutSection = {
  eyebrow: string;
  title: string;
  description: string;
  card_description: string;
  badge_title: string;
  badge_subtitle: string;
  points: HomeFeaturePoint[];
};

export type HomeWhyKrLogics = {
  title: string;
  description: string;
  cards: HomeFeaturePoint[];
};

export type HomeMockSection = {
  eyebrow: string;
  title: string;
  description: string;
  features: HomeFeaturePoint[];
  cta_text: string;
  cta_url: string;
  demo_exam_name: string;
  demo_section: string;
  demo_question: string;
  demo_options: string[];
  demo_correct_index: number;
};

export type HomeContactSection = {
  intro: string;
  address: string;
  email: string;
  hours: string;
  form_title: string;
};

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
  hero_badge: string;
  hero_title: string;
  hero_description: string;
  hero_primary_btn_text: string;
  hero_primary_btn_url: string;
  hero_secondary_btn_text: string;
  hero_secondary_btn_url: string;
  hero_secondary_btn_note: string;
  trending_links: HomeTrendingLink[];
  achievement_stats: HomeAchievementStat[];
  offer_bar: HomeOfferBar;
  about_section: HomeAboutSection;
  why_kr_logics: HomeWhyKrLogics;
  mock_section: HomeMockSection;
  contact_section: HomeContactSection;
  footer_about: string;
};

export type HomePageCategory = {
  id: number;
  name: string;
  slug: string;
  image_url: string | null;
  courses_count: number;
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
  categories: HomePageCategory[];
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

export const defaultHomePageSettings: HomePageSettings = {
  active_students: 12501,
  selections: 850,
  mock_tests: 200,
  experience: "7+ Years",
  banner_images: [],
  about_us_video: null,
  videos: [],
  video_reviews: [],
  facebook_link: null,
  instagram_link: null,
  youtube_link: null,
  linkedin_link: null,
  whatsapp_number: null,
  hero_badge: "#1 Platform for Government Exam Preparation",
  hero_title: "Prepare Smarter.<br>Score Higher. <em>Succeed.</em>",
  hero_description:
    "Access top-quality courses, mock tests, live classes and study material for Banking, SSC, Railway & more — all in one place.",
  hero_primary_btn_text: "Explore Courses",
  hero_primary_btn_url: "/courses",
  hero_secondary_btn_text: "Mock Test",
  hero_secondary_btn_url: "/mock-tests",
  hero_secondary_btn_note: "See how it works",
  trending_links: [
    { label: "RBI Assistant Notification", url: "/mock-tests" },
    { label: "SBI CBO Notification", url: "/mock-tests" },
    { label: "OICL AO Mock Tests", url: "/mock-tests" },
    { label: "IBPS PO Complete Course", url: "/courses" },
    { label: "Daily Banking Current Affairs", url: "/courses" },
    { label: "KR Logics Free Mock Tests", url: "/mock-tests" },
    { label: "Bank Foundation Batch 2026", url: "/courses" },
  ],
  achievement_stats: [
    { value: "12L+", label: "Happy Students", icon: "fa-user-graduate" },
    { value: "5000+", label: "Top Educators", icon: "fa-chalkboard-user" },
    { value: "30000+", label: "Mock Tests", icon: "fa-file-pen" },
    { value: "95%", label: "Success Rate", icon: "fa-trophy" },
    { value: "24/7", label: "AI Support", icon: "fa-headset" },
  ],
  offer_bar: {
    enabled: true,
    title: "Get",
    highlight: "50% OFF",
    suffix: "on All Courses",
    description: "Offer valid till 31st December 2026",
    code: "LEARN50",
    btn_text: "Grab The Offer",
    btn_url: "/courses",
  },
  about_section: {
    eyebrow: "About Us",
    title: "Building India's<br>Banking Professionals",
    description:
      "KR Logics is dedicated to transforming banking aspirants into successful professionals through expert guidance, updated content and cutting-edge technology.",
    card_description:
      "India's most trusted banking exam coaching platform with proven results across IBPS, SBI, RBI and Insurance exams.",
    badge_title: "Best Coaching 2024",
    badge_subtitle: "Rajasthan Banking Category",
    points: [
      {
        icon: "fa-graduation-cap",
        title: "Expert-Led Curriculum",
        description:
          "Specially designed material covering Quant, Reasoning, English, GK & Banking Awareness — updated with every exam pattern change.",
      },
      {
        icon: "fa-laptop",
        title: "Flexible Learning — Online & Offline",
        description: "Recorded lectures, live classes and 200+ mock tests accessible on any device, anytime, anywhere.",
      },
      {
        icon: "fa-users",
        title: "Personal Mentorship",
        description:
          "1-on-1 doubt sessions, performance tracking and personalized study plans for each student's strengths and weaknesses.",
      },
      {
        icon: "fa-chart-line",
        title: "AI-Powered Analytics",
        description: "Topic-wise accuracy, speed tracking, percentile ranking and smart recommendations on what to study next.",
      },
    ],
  },
  why_kr_logics: {
    title: "Why KR Logics?",
    description:
      "At KR Logics, our mission is to guide banking aspirants with expert content, smart practice tools, and mentorship that keeps every student moving toward selection.",
    cards: [
      {
        icon: "fa-book-open-reader",
        title: "High Quality Study Material Curated by Experts",
        description:
          "Mock tests, PDFs, eBooks, notes and video lessons are prepared around the latest banking exam pattern by experienced faculty.",
      },
      {
        icon: "fa-display",
        title: "Defined All-in-One Course Package with Video Series",
        description:
          "Get structured courses for SBI, IBPS, RBI and insurance exams with recorded classes, live tests and revision material in one place.",
      },
      {
        icon: "fa-user-tie",
        title: "Career Guidance & Personal Mentorship",
        description:
          "Our mentors help students build a practical study plan, analyze weak areas and stay consistent throughout the preparation journey.",
      },
      {
        icon: "fa-chalkboard-user",
        title: "Highly Experienced Faculty",
        description:
          "Learn from subject experts who have helped banking aspirants improve accuracy, speed and confidence for competitive exams.",
      },
    ],
  },
  mock_section: {
    eyebrow: "Test Series",
    title: "Mock Test<br>Platform",
    description:
      "Practice with India's most updated mock tests designed by banking experts. Real exam feel with instant in-depth analysis.",
    features: [
      {
        icon: "fa-desktop",
        title: "Real Exam Interface",
        description: "Exactly like the actual exam — timer, section switching & question navigation",
      },
      {
        icon: "fa-chart-bar",
        title: "Deep Performance Analysis",
        description: "Accuracy, speed, topic-wise score & All India percentile ranking",
      },
      {
        icon: "fa-video",
        title: "Video Solutions",
        description: "Detailed video explanations for every question from expert faculty",
      },
      {
        icon: "fa-users",
        title: "All India Rankings",
        description: "Compete with 12,000+ students & know exactly where you stand",
      },
    ],
    cta_text: "Start Free Mock Test",
    cta_url: "/mock-tests",
    demo_exam_name: "IBPS PO Prelims 2025 — Mock #7",
    demo_section: "Question 4 of 35 · Reasoning Ability",
    demo_question:
      "In a row of 40 students, Rahul is 15th from the left. Priya is 10 positions to the right of Rahul. What is Priya's position from the right end?",
    demo_options: ["14th from the right", "16th from the right", "18th from the right", "12th from the right"],
    demo_correct_index: 1,
  },
  contact_section: {
    intro:
      "Have questions about admissions or courses? Our counselling team is ready to help you choose the right path for your banking career.",
    address: "KR Logics Institute, Near City Mall,<br>Jodhpur, Rajasthan — 342001",
    email: "info@krlogics.com<br>admissions@krlogics.com",
    hours: "Mon–Sat: 9:00 AM – 8:00 PM<br>Sunday: 10:00 AM – 4:00 PM",
    form_title: "Send Us a Message",
  },
  footer_about:
    "Empowering banking aspirants across India with quality education, expert mentorship and advanced test technology.",
};

export function normalizeHomePageSettings(settings?: Partial<HomePageSettings> | null): HomePageSettings {
  const source = settings ?? {};

  return {
    ...defaultHomePageSettings,
    ...source,
    offer_bar: { ...defaultHomePageSettings.offer_bar, ...(source.offer_bar ?? {}) },
    about_section: {
      ...defaultHomePageSettings.about_section,
      ...(source.about_section ?? {}),
      points: source.about_section?.points?.length
        ? source.about_section.points
        : defaultHomePageSettings.about_section.points,
    },
    why_kr_logics: {
      ...defaultHomePageSettings.why_kr_logics,
      ...(source.why_kr_logics ?? {}),
      cards: source.why_kr_logics?.cards?.length
        ? source.why_kr_logics.cards
        : defaultHomePageSettings.why_kr_logics.cards,
    },
    mock_section: {
      ...defaultHomePageSettings.mock_section,
      ...(source.mock_section ?? {}),
      features: source.mock_section?.features?.length
        ? source.mock_section.features
        : defaultHomePageSettings.mock_section.features,
      demo_options: source.mock_section?.demo_options?.length
        ? source.mock_section.demo_options
        : defaultHomePageSettings.mock_section.demo_options,
    },
    contact_section: { ...defaultHomePageSettings.contact_section, ...(source.contact_section ?? {}) },
    trending_links: source.trending_links?.length ? source.trending_links : defaultHomePageSettings.trending_links,
    achievement_stats: source.achievement_stats?.length
      ? source.achievement_stats
      : defaultHomePageSettings.achievement_stats,
    banner_images: source.banner_images ?? defaultHomePageSettings.banner_images,
    videos: source.videos ?? defaultHomePageSettings.videos,
    video_reviews: source.video_reviews ?? defaultHomePageSettings.video_reviews,
  };
}

export async function fetchHomePageData(): Promise<HomePageResponse | null> {
  try {
    const response = await fetch(homePageApiUrl(), { cache: "no-store" });
    if (!response.ok) return null;

    const payload = (await response.json()) as Partial<HomePageResponse>;
    if (!payload.settings) return null;

    return {
      settings: normalizeHomePageSettings(payload.settings),
      categories: payload.categories ?? [],
      reviews: payload.reviews ?? [],
      faculties: payload.faculties ?? [],
      faqs: payload.faqs ?? [],
      top_courses: payload.top_courses ?? [],
    };
  } catch {
    return null;
  }
}
