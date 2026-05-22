import Link from "next/link";
import {
  Award,
  Building2,
  ChevronDown,
  ChevronRight,
  GraduationCap,
  Landmark,
  MapPin,
  ShieldCheck,
  Star,
} from "lucide-react";

const exams = [
  { label: "SBI PO", icon: MapPin, tone: "bg-sky-500 text-white" },
  { label: "IBPS PO", icon: Award, tone: "bg-blue-600 text-white" },
  { label: "IBPS Clerk", icon: Award, tone: "bg-blue-600 text-white" },
  { label: "SBI Clerk", icon: MapPin, tone: "bg-sky-500 text-white" },
  { label: "IBPS RRB PO", icon: Award, tone: "bg-blue-600 text-white" },
  { label: "IBPS RRB Clerk", icon: Award, tone: "bg-blue-600 text-white" },
  { label: "Punjab and Sind Bank", icon: Landmark, tone: "bg-yellow-400 text-slate-900" },
  { label: "IBPS SO", icon: Award, tone: "bg-blue-600 text-white" },
  { label: "LIC HFL Junior Assistant", icon: ShieldCheck, tone: "bg-slate-500 text-white" },
  { label: "SBI Apprentice", icon: MapPin, tone: "bg-sky-500 text-white" },
  { label: "Bank of Baroda LBO", icon: Building2, tone: "bg-rose-500 text-white" },
  { label: "Karnataka Bank", icon: Star, tone: "bg-fuchsia-700 text-white" },
  { label: "Central Bank of India", icon: Building2, tone: "bg-blue-100 text-blue-700" },
  { label: "UBI Apprentice", icon: Landmark, tone: "bg-red-500 text-white" },
  { label: "Indian Overseas Bank", icon: Building2, tone: "bg-sky-100 text-sky-700" },
  { label: "OICL AO", icon: ShieldCheck, tone: "bg-cyan-100 text-cyan-700" },
  { label: "South Indian Bank Clerk", icon: Building2, tone: "bg-red-600 text-white" },
  { label: "J & K Bank Apprentice", icon: Landmark, tone: "bg-blue-100 text-blue-700" },
];

const categories = [
  "Banking & Insurance",
  "SSC & Railway",
  "Regulatory bodies",
  "JAIIB/CAIIB",
  "JK State Exams",
  "CAIIB",
];

type PublicHeaderProps = {
  active?: "home" | "courses" | "mock-tests" | "faculty" | "contact";
};

export function PublicHeader({ active }: PublicHeaderProps) {
  const navLink = (href: string, label: string, key: PublicHeaderProps["active"]) => (
    <Link
      href={href}
      className={`flex h-full items-center border-b-2 px-0 text-[13px] font-semibold transition ${
        active === key
          ? "border-[#e8a800] text-[#1b2e6b]"
          : "border-transparent text-slate-500 hover:border-[#e8a800] hover:text-[#1b2e6b]"
      }`}
    >
      {label}
    </Link>
  );

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 px-4 backdrop-blur sm:px-6 lg:px-8">
      <div className="flex min-h-[72px] flex-wrap items-center justify-between gap-x-6 gap-y-2 py-3 lg:flex-nowrap lg:py-0">
        <Link href="/" className="flex shrink-0 items-center gap-3">
          <div className="grid size-11 place-items-center rounded-full border-2 border-[#f5c518] bg-white">
            <GraduationCap className="size-6 text-[#1b2e6b]" />
          </div>
          <div className="leading-tight">
            <div className="font-rajdhani text-xl font-bold text-[#1b2e6b]">
              KR <span className="text-[#e8a800]">Logics</span>
            </div>
            <div className="text-[9px] font-semibold uppercase tracking-[0.2em] text-slate-500">
              Banking Exam Prep
            </div>
          </div>
        </Link>

        <nav className="order-3 flex h-full w-full items-center gap-5 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:order-none lg:w-auto lg:overflow-visible lg:pb-0">
          {navLink("/", "Home", "home")}
          {navLink("/courses", "Courses", "courses")}

          <div className="group flex h-full items-center">
            <Link
              href="/mock-tests"
              className="flex h-full items-center gap-1 border-b-2 border-transparent text-[13px] font-semibold text-slate-500 transition hover:border-[#e8a800] hover:text-[#1b2e6b]"
            >
              Exams <ChevronDown className="size-3 transition group-hover:rotate-180" />
            </Link>
            <div className="invisible fixed left-0 right-0 top-[72px] hidden translate-y-2 grid-cols-[230px_1fr] gap-8 border-y border-slate-200 bg-white px-8 py-6 opacity-0 shadow-2xl shadow-slate-900/10 transition group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 lg:grid">
              <div className="flex flex-col gap-3">
                {categories.map((category, index) => (
                  <Link
                    key={category}
                    href="/mock-tests"
                    className={`flex h-11 items-center justify-between rounded-md border px-3 text-sm font-semibold ${
                      index === 0
                        ? "border-pink-100 bg-pink-50 text-slate-900 shadow-lg shadow-pink-100"
                        : "border-slate-200 bg-white text-slate-700 hover:border-[#1b2e6b]"
                    }`}
                  >
                    {category}
                    <ChevronRight className="size-3" />
                  </Link>
                ))}
              </div>
              <div className="grid grid-cols-3 gap-x-7 gap-y-3">
                {exams.map((exam) => {
                  const Icon = exam.icon;
                  return (
                    <Link
                      href="/mock-tests"
                      key={exam.label}
                      className="flex h-11 items-center gap-3 overflow-hidden rounded-md border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-900 transition hover:-translate-y-0.5 hover:border-[#1b2e6b] hover:text-[#1b2e6b] hover:shadow-lg"
                    >
                      <span className={`grid size-6 shrink-0 place-items-center rounded-full ${exam.tone}`}>
                        <Icon className="size-3.5" />
                      </span>
                      <span className="truncate">{exam.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>

          {navLink("/mock-tests", "Mock Tests", "mock-tests")}
          {navLink("/faculty", "Faculty", "faculty")}
          {navLink("/contact", "Contact", "contact")}
        </nav>

        <div className="ml-auto flex shrink-0 items-center gap-2">
          <Link
            href="/login"
            className="rounded-md border border-[#1b2e6b] px-4 py-2 text-xs font-bold text-[#1b2e6b] transition hover:bg-[#1b2e6b] hover:text-white"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="rounded-md bg-[#1b2e6b] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#0f1e4a]"
          >
            Enroll Free
          </Link>
        </div>
      </div>
    </header>
  );
}
