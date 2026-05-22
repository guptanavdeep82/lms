import {
  BookOpen,
  BrainCircuit,
  CalendarDays,
  ClipboardCheck,
  FileText,
  PlayCircle,
  ShieldCheck,
  UsersRound,
  Video,
} from "lucide-react";

export const navItems = [
  { label: "Courses", href: "/courses" },
  { label: "Mock Tests", href: "/mock-tests" },
  { label: "Notes", href: "/notes" },
  { label: "Live Classes", href: "/live-classes" },
  { label: "Forum", href: "/forum" },
  { label: "Blog", href: "/blog" },
  { label: "Pricing", href: "/pricing" },
];

export const courses = [
  {
    slug: "banking-foundation",
    title: "Banking Foundation Programme",
    category: "SBI | RBI | IBPS",
    price: "₹4,999",
    duration: "6 Months",
    students: "8.2k",
    progress: 68,
    image:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
    highlights: ["160+ recorded lessons", "Mock test analytics", "Paid notes included"],
  },
  {
    slug: "insurance-exam-masterclass",
    title: "Insurance Exam Masterclass",
    category: "Insurance",
    price: "₹3,499",
    duration: "3 Months",
    students: "5.6k",
    progress: 52,
    image:
      "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1200&q=80",
    highlights: ["Live doubt sessions", "Topic-wise PDFs", "Speed control videos"],
  },
  {
    slug: "competitive-test-series",
    title: "Competitive Test Series",
    category: "All Exams",
    price: "₹1,499",
    duration: "12 Months",
    students: "11k",
    progress: 84,
    image:
      "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1200&q=80",
    highlights: ["Guidely inspired UI", "Ranks and analytics", "Attempt history"],
  },
];

export const features = [
  { title: "Encrypted Video Courses", icon: Video, text: "Course and subject-wise libraries with protected streaming, speed control, resolution options, and continue watching." },
  { title: "Mock Test Platform", icon: ClipboardCheck, text: "Timer-based MCQ exams, auto submission, scorecards, ranks, analytics, and previous attempt history." },
  { title: "Paid & Free Notes", icon: FileText, text: "PDF study material with subscription access, free signup notes, and subject-wise categorization." },
  { title: "Live Class Access", icon: CalendarDays, text: "Zoom and Google Meet schedules, join access, notifications, attendance, and session management." },
  { title: "Forum Discussions", icon: UsersRound, text: "Question-answer forum where students can ask doubts and faculty/admins can respond by subject." },
  { title: "AI + WhatsApp Support", icon: BrainCircuit, text: "AI website assistant and Gallabox-ready WhatsApp chatbot for faster student guidance." },
];

export const stats = [
  ["12+", "Exam categories"],
  ["300+", "Video lessons"],
  ["80+", "Mock tests"],
  ["24/7", "AI support"],
];

export const plans = [
  { name: "Starter", price: "₹999", term: "1 Month", items: ["Free notes", "Basic mock tests", "Forum access"] },
  { name: "Pro Learner", price: "₹3,499", term: "3 Months", items: ["Recorded courses", "Paid notes", "Live classes", "Analytics dashboard"], featured: true },
  { name: "Rank Builder", price: "₹6,999", term: "12 Months", items: ["All courses", "Full test series", "1 year notes", "Priority support"] },
];

export const blogs = [
  {
    slug: "how-to-plan-bank-exam-preparation",
    title: "How to plan bank exam preparation with courses, notes, and mocks",
    category: "Preparation",
    date: "20 May 2026",
    read: "5 min read",
  },
  {
    slug: "mock-test-analysis-rank-improvement",
    title: "Using mock test analytics to improve rank every week",
    category: "Mock Tests",
    date: "18 May 2026",
    read: "4 min read",
  },
  {
    slug: "live-classes-vs-recorded-videos",
    title: "Live classes vs recorded videos: when students should use each",
    category: "Learning",
    date: "15 May 2026",
    read: "6 min read",
  },
];

export const dashboardTiles = [
  { title: "Continue Watching", value: "Quant Basics", icon: PlayCircle },
  { title: "Next Live Class", value: "Reasoning at 7 PM", icon: CalendarDays },
  { title: "Mock Accuracy", value: "78%", icon: ClipboardCheck },
  { title: "Notes Unlocked", value: "42 PDFs", icon: BookOpen },
];

export const trustItems = [
  { title: "OTP and Google login", icon: ShieldCheck },
  { title: "Subscription access control", icon: ShieldCheck },
  { title: "Download-safe video system", icon: ShieldCheck },
  { title: "SEO-ready public website", icon: ShieldCheck },
];
