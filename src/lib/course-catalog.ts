export type CourseCatalogItem = {
  slug: string;
  title: string;
  desc: string;
  courseType?: "video" | "pdf";
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
  badge?: string;
  tags: string[];
  image: string;
  outcomes: string[];
  curriculum: string[];
};

export const courseCatalog: CourseCatalogItem[] = [
  {
    slug: "ibps-po-complete-course",
    title: "IBPS PO Complete Course",
    desc: "Full preparation for IBPS PO with Prelims, Mains, Interview strategy, latest pattern questions and live doubt support.",
    courseType: "video",
    category: "IBPS",
    exam: "PO / Officer",
    level: "Intermediate",
    price: 4999,
    original: 7999,
    hours: 120,
    tests: 200,
    students: 3200,
    rating: 4.8,
    reviews: 842,
    badge: "Popular",
    tags: ["Prelims", "Mains", "Interview", "GA"],
    image: "/hero-students.png",
    outcomes: ["Complete prelims and mains roadmap", "Daily practice plan with sectional targets", "Interview preparation and banking awareness"],
    curriculum: ["Quantitative Aptitude", "Reasoning Ability", "English Language", "Banking and Current Affairs", "Full Mock Test Analysis"],
  },
  {
    slug: "ibps-clerk-full-course",
    title: "IBPS Clerk Full Course",
    desc: "Complete IBPS Clerk preparation with speed-focused lessons, sectional tests, mains practice and doubt sessions.",
    courseType: "video",
    category: "IBPS",
    exam: "Clerk",
    level: "Beginner",
    price: 2999,
    original: 4999,
    hours: 90,
    tests: 150,
    students: 2800,
    rating: 4.7,
    reviews: 631,
    tags: ["Prelims", "Mains", "Quant", "English"],
    image: "/building-professionals.png",
    outcomes: ["Build speed for prelims", "Improve accuracy through topic tests", "Practice mains-level questions"],
    curriculum: ["Numerical Ability", "Reasoning", "English", "General Awareness", "Clerk Mains Mock Tests"],
  },
  {
    slug: "sbi-po-full-course",
    title: "SBI PO Full Course",
    desc: "Comprehensive SBI PO prep with sectional tests, previous year analysis, strategy sessions and mains descriptive practice.",
    courseType: "video",
    category: "SBI",
    exam: "PO / Officer",
    level: "Intermediate",
    price: 3999,
    original: 5999,
    hours: 100,
    tests: 160,
    students: 2600,
    rating: 4.9,
    reviews: 712,
    badge: "Hot",
    tags: ["SBI PO", "Mains", "DI", "Reasoning"],
    image: "/hero-students.png",
    outcomes: ["Master SBI PO prelims strategy", "Practice mains DI and reasoning", "Prepare descriptive writing"],
    curriculum: ["Prelims Foundation", "Mains Data Interpretation", "Reasoning Puzzles", "Descriptive English", "Interview Strategy"],
  },
  {
    slug: "sbi-clerk-course",
    title: "SBI Clerk Course",
    desc: "Focused SBI Clerk preparation with speed, accuracy, latest pattern mock tests and mains revision.",
    courseType: "video",
    category: "SBI",
    exam: "Clerk",
    level: "Beginner",
    price: 2499,
    original: 3999,
    hours: 75,
    tests: 120,
    students: 3100,
    rating: 4.6,
    reviews: 580,
    tags: ["SBI Clerk", "Prelims", "English", "Quant"],
    image: "/building-professionals.png",
    outcomes: ["Improve calculation speed", "Build exam discipline", "Revise high-frequency clerk topics"],
    curriculum: ["English Basics", "Numerical Ability", "Reasoning Practice", "Mains Mock Tests"],
  },
  {
    slug: "rbi-grade-b-preparation",
    title: "RBI Grade B Preparation",
    desc: "Phase I and Phase II preparation with Economics, Finance, Management and high-quality RBI mock tests.",
    courseType: "video",
    category: "RBI",
    exam: "Grade B",
    level: "Advanced",
    price: 7999,
    original: 12999,
    hours: 180,
    tests: 100,
    students: 980,
    rating: 4.9,
    reviews: 312,
    badge: "Premium",
    tags: ["Phase I", "Phase II", "ESI", "F&M"],
    image: "/hero-students.png",
    outcomes: ["Cover RBI Phase I and Phase II", "Understand ESI and finance concepts", "Practice answer writing and analysis"],
    curriculum: ["Phase I Quant", "Phase I Reasoning", "ESI", "Finance and Management", "Descriptive Practice"],
  },
  {
    slug: "rbi-assistant-course",
    title: "RBI Assistant Course",
    desc: "Complete RBI Assistant preparation with Prelims, Mains and Language Proficiency Test guidance.",
    courseType: "video",
    category: "RBI",
    exam: "Clerk",
    level: "Intermediate",
    price: 3499,
    original: 5499,
    hours: 85,
    tests: 100,
    students: 760,
    rating: 4.5,
    reviews: 198,
    tags: ["RBI", "Prelims", "Mains", "LPT"],
    image: "/building-professionals.png",
    outcomes: ["Prepare both prelims and mains", "Learn RBI-specific question trends", "Get LPT guidance"],
    curriculum: ["Prelims Speed", "Mains Reasoning", "Computer Awareness", "Language Test Guidance"],
  },
  {
    slug: "lic-aao-ado-course",
    title: "LIC AAO / ADO Course",
    desc: "Complete LIC AAO and ADO exam preparation with insurance awareness, GA, quant and full mock tests.",
    courseType: "video",
    category: "Insurance",
    exam: "AAO / SO",
    level: "Intermediate",
    price: 2999,
    original: 4499,
    hours: 80,
    tests: 80,
    students: 1200,
    rating: 4.6,
    reviews: 289,
    tags: ["LIC AAO", "Insurance", "GA", "Quant"],
    image: "/hero-students.png",
    outcomes: ["Understand insurance awareness", "Practice LIC-level aptitude", "Attempt full mock tests"],
    curriculum: ["Insurance Awareness", "Quant", "Reasoning", "English", "GA Practice"],
  },
  {
    slug: "quantitative-aptitude-mastery",
    title: "Quantitative Aptitude Mastery",
    desc: "DI, Arithmetic, Algebra, Number Systems and Simplification from basics to advanced level for all banking exams.",
    courseType: "pdf",
    category: "Aptitude",
    exam: "All Exams",
    level: "Beginner",
    price: 1999,
    original: 2999,
    hours: 60,
    tests: 120,
    students: 4200,
    rating: 4.8,
    reviews: 1020,
    badge: "Bestseller",
    tags: ["DI", "Arithmetic", "Algebra", "Simplification"],
    image: "/building-professionals.png",
    outcomes: ["Strengthen calculation basics", "Master DI sets", "Build topic-wise accuracy"],
    curriculum: ["Percentage", "Profit and Loss", "SI/CI", "DI Sets", "Number Series"],
  },
];

export function getCourseBySlug(slug: string): CourseCatalogItem | undefined {
  const course = courseCatalog.find((item) => item.slug === slug);
  if (course) return course;

  const title = slug
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

  return {
    slug,
    title,
    desc: "Complete preparation course with recorded lessons, notes, mock tests, practice questions and student support.",
    courseType: slug.includes("pdf") || slug.includes("notes") ? "pdf" : "video",
    category: "Banking Exams",
    exam: "All Exams",
    level: "Beginner to Advanced",
    price: 2499,
    original: 4999,
    hours: 70,
    tests: 80,
    students: 1500,
    rating: 4.6,
    reviews: 420,
    badge: undefined,
    tags: ["Videos", "Notes", "Mock Tests", "Doubt Support"],
    image: "/hero-students.png",
    outcomes: ["Learn the complete exam syllabus", "Practice topic-wise and full-length tests", "Track preparation with structured study flow"],
    curriculum: ["Foundation Concepts", "Topic-wise Practice", "Previous Year Questions", "Mock Test Analysis", "Revision Strategy"],
  };
}
