import { publicBackendBaseUrl } from "@/lib/mock-tests";

export type HomeTrendingLink = {
  label: string;
  url: string;
};

export type HomeBanner = {
  image_url: string;
  url: string | null;
};

export type HomeCategoryChip = {
  title: string;
  subtitle: string;
  url: string;
  icon: string;
};

export type HomeCourseTileItem = {
  label: string;
  url: string;
  icon: string;
};

export type HomeCourseTile = {
  title: string;
  tone: string;
  items: HomeCourseTileItem[];
};

export type HomePlayStore = {
  enabled: boolean;
  url: string;
  package_id: string | null;
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
  ends_at: string | null;
};

export type HomeWelcomePopup = {
  enabled: boolean;
  eyebrow: string;
  title: string;
  description: string;
  btn_text: string;
  btn_url: string;
  image_url: string | null;
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
  banners: HomeBanner[];
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
  category_chips: HomeCategoryChip[];
  top_course_tiles: HomeCourseTile[];
  play_store: HomePlayStore;
  trending_links: HomeTrendingLink[];
  achievement_stats: HomeAchievementStat[];
  offer_bar: HomeOfferBar;
  welcome_popup: HomeWelcomePopup;
  about_section: HomeAboutSection;
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

export type HomePageExamType = {
  id: number;
  name: string;
  slug: string;
};

export type HomePageReview = {
  id: number | string;
  name: string;
  exam_name: string | null;
  description: string;
  rating: number;
  image_url: string | null;
  source?: "cms" | "play_store";
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
  exam_types: HomePageExamType[];
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
  banners: [],
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
  category_chips: [
    { title: "Banking Exams", subtitle: "220+ Courses", url: "/courses", icon: "fa-building-columns" },
    { title: "SSC Exams", subtitle: "180+ Courses", url: "/courses", icon: "fa-pen-fancy" },
    { title: "Railway Exams", subtitle: "150+ Courses", url: "/courses", icon: "fa-train" },
    { title: "Teaching Exams", subtitle: "120+ Courses", url: "/courses", icon: "fa-chalkboard-user" },
    { title: "UPSC Exams", subtitle: "100+ Courses", url: "/courses", icon: "fa-landmark" },
    { title: "State Exams", subtitle: "90+ Courses", url: "/courses", icon: "fa-map-location-dot" },
  ],
  top_course_tiles: [
    {
      title: "Popular",
      tone: "lavender",
      items: [
        { label: "PDF Courses", url: "/courses?type=pdf", icon: "fa-file-pdf" },
        { label: "Mock Tests", url: "/mock-tests", icon: "fa-clipboard-list" },
        { label: "Live Classes", url: "/live-classes", icon: "fa-video" },
        { label: "Current Affairs", url: "/current-affairs", icon: "fa-newspaper" },
      ],
    },
    {
      title: "Video Classes",
      tone: "mint",
      items: [
        { label: "Video Courses", url: "/courses?type=video", icon: "fa-circle-play" },
        { label: "Live Classes", url: "/live-classes", icon: "fa-video" },
        { label: "Quant Practice", url: "/courses", icon: "fa-calculator" },
        { label: "Reasoning", url: "/courses", icon: "fa-brain" },
      ],
    },
    {
      title: "PDF Courses",
      tone: "sky",
      items: [
        { label: "PDF Courses", url: "/courses?type=pdf", icon: "fa-file-pdf" },
        { label: "Study Notes", url: "/notes", icon: "fa-book-open" },
        { label: "Free PDFs", url: "/courses?type=pdf", icon: "fa-file-arrow-down" },
        { label: "Descriptive", url: "/courses", icon: "fa-pen-nib" },
      ],
    },
    {
      title: "Free Materials",
      tone: "peach",
      items: [
        { label: "Free PDFs", url: "/courses?type=pdf", icon: "fa-file-lines" },
        { label: "Practice Quiz", url: "/mock-tests", icon: "fa-list-check" },
        { label: "Daily CA", url: "/current-affairs", icon: "fa-calendar-day" },
        { label: "Mock Tests", url: "/mock-tests", icon: "fa-bolt" },
      ],
    },
    {
      title: "Follow Us",
      tone: "rose",
      items: [
        { label: "WhatsApp", url: "whatsapp", icon: "fa-whatsapp" },
        { label: "YouTube", url: "youtube", icon: "fa-youtube" },
        { label: "Instagram", url: "instagram", icon: "fa-instagram" },
        { label: "Facebook", url: "facebook", icon: "fa-facebook-f" },
      ],
    },
  ],
  play_store: {
    enabled: true,
    url: "https://play.google.com/store/apps/details?id=co.lily.bqhlu",
    package_id: "co.lily.bqhlu",
  },
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
    enabled: false,
    title: "Get",
    highlight: "50% OFF",
    suffix: "on All Courses",
    description: "Offer valid till 31st December 2026",
    code: "LEARN50",
    btn_text: "Grab The Offer",
    btn_url: "/courses",
    ends_at: null,
  },
  welcome_popup: {
    enabled: false,
    eyebrow: "New Batch",
    title: "Start your exam preparation today",
    description:
      "Access courses, mock tests and live classes for Banking, SSC, Railway and more — all in one place.",
    btn_text: "Explore Now",
    btn_url: "/courses",
    image_url: null,
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
    offer_bar: {
      ...defaultHomePageSettings.offer_bar,
      ...(source.offer_bar ?? {}),
      enabled: Boolean((source.offer_bar ?? defaultHomePageSettings.offer_bar).enabled),
      ends_at: source.offer_bar?.ends_at ?? defaultHomePageSettings.offer_bar.ends_at,
    },
    welcome_popup: {
      ...defaultHomePageSettings.welcome_popup,
      ...(source.welcome_popup ?? {}),
      enabled: Boolean((source.welcome_popup ?? defaultHomePageSettings.welcome_popup).enabled),
    },
    about_section: {
      ...defaultHomePageSettings.about_section,
      ...(source.about_section ?? {}),
      points: source.about_section?.points?.length
        ? source.about_section.points
        : defaultHomePageSettings.about_section.points,
    },
    contact_section: { ...defaultHomePageSettings.contact_section, ...(source.contact_section ?? {}) },
    category_chips: source.category_chips?.length ? source.category_chips : defaultHomePageSettings.category_chips,
    top_course_tiles: source.top_course_tiles?.length
      ? source.top_course_tiles
      : defaultHomePageSettings.top_course_tiles,
    play_store: {
      ...defaultHomePageSettings.play_store,
      ...(source.play_store ?? {}),
    },
    trending_links: source.trending_links?.length ? source.trending_links : defaultHomePageSettings.trending_links,
    achievement_stats: source.achievement_stats?.length
      ? source.achievement_stats
      : defaultHomePageSettings.achievement_stats,
    banner_images: source.banner_images ?? defaultHomePageSettings.banner_images,
    banners: source.banners?.length
      ? source.banners
      : (source.banner_images ?? []).map((image_url) => ({ image_url, url: null })),
    videos: source.videos ?? defaultHomePageSettings.videos,
    video_reviews: source.video_reviews ?? defaultHomePageSettings.video_reviews,
  };
}

export async function fetchHomePageData(): Promise<HomePageResponse | null> {
  try {
    const response = await fetch(homePageApiUrl(), {
      cache: typeof window === "undefined" ? "force-cache" : "no-store",
      next: typeof window === "undefined" ? { revalidate: 120 } : undefined,
    });
    if (!response.ok) return null;

    const payload = (await response.json()) as Partial<HomePageResponse>;
    if (!payload.settings) return null;

    return {
      settings: normalizeHomePageSettings(payload.settings),
      categories: payload.categories ?? [],
      exam_types: payload.exam_types ?? [],
      reviews: payload.reviews ?? [],
      faculties: payload.faculties ?? [],
      faqs: payload.faqs ?? [],
      top_courses: payload.top_courses ?? [],
    };
  } catch {
    return null;
  }
}
