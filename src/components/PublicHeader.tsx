import Link from "next/link";
import Image from "next/image";
import {
  Award,
  Building2,
  ChevronDown,
  ChevronRight,
  Landmark,
  MapPin,
  ShieldCheck,
  Star,
} from "lucide-react";

const exams = [
  { label: "SBI PO", icon: MapPin, tone: "bg-[#050808] text-[#ffd21f]" },
  { label: "IBPS PO", icon: Award, tone: "bg-[#050808] text-[#ffd21f]" },
  { label: "IBPS Clerk", icon: Award, tone: "bg-[#050808] text-[#ffd21f]" },
  { label: "SBI Clerk", icon: MapPin, tone: "bg-[#050808] text-[#ffd21f]" },
  { label: "IBPS RRB PO", icon: Award, tone: "bg-[#050808] text-[#ffd21f]" },
  { label: "IBPS RRB Clerk", icon: Award, tone: "bg-[#050808] text-[#ffd21f]" },
  { label: "Punjab and Sind Bank", icon: Landmark, tone: "bg-[#ffd21f] text-[#050808]" },
  { label: "IBPS SO", icon: Award, tone: "bg-[#050808] text-[#ffd21f]" },
  { label: "LIC HFL Junior Assistant", icon: ShieldCheck, tone: "bg-[#151a18] text-[#ffd21f]" },
  { label: "SBI Apprentice", icon: MapPin, tone: "bg-[#050808] text-[#ffd21f]" },
  { label: "Bank of Baroda LBO", icon: Building2, tone: "bg-[#151a18] text-[#ffd21f]" },
  { label: "Karnataka Bank", icon: Star, tone: "bg-[#151a18] text-[#ffd21f]" },
  { label: "Central Bank of India", icon: Building2, tone: "bg-[#fff8dc] text-[#050808]" },
  { label: "UBI Apprentice", icon: Landmark, tone: "bg-[#151a18] text-[#ffd21f]" },
  { label: "Indian Overseas Bank", icon: Building2, tone: "bg-[#fff8dc] text-[#050808]" },
  { label: "OICL AO", icon: ShieldCheck, tone: "bg-[#fff8dc] text-[#050808]" },
  { label: "South Indian Bank Clerk", icon: Building2, tone: "bg-[#151a18] text-[#ffd21f]" },
  { label: "J & K Bank Apprentice", icon: Landmark, tone: "bg-[#fff8dc] text-[#050808]" },
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
          ? "border-[#ffd21f] text-[#ffd21f]"
          : "border-transparent text-white/72 hover:border-[#ffd21f] hover:text-[#ffd21f]"
      }`}
    >
      {label}
    </Link>
  );

  return (
    <header className="sticky top-0 z-50 border-b border-[#ffd21f]/25 bg-[#050808]/95 px-4 backdrop-blur sm:px-6 lg:px-8">
      <div className="flex min-h-[72px] flex-wrap items-center justify-between gap-x-6 gap-y-2 py-3 lg:flex-nowrap lg:py-0">
        <Link href="/" className="flex shrink-0 items-center gap-3">
          <Image
            src="/logics-logo.jpeg"
            alt="KR Logics logo"
            width={48}
            height={48}
            className="size-12 rounded-full border-2 border-[#ffd21f] object-cover shadow-lg shadow-black/10"
          />
          <div className="leading-tight">
            <div className="font-rajdhani text-xl font-bold text-white">
              KR <span className="text-[#ffc400]">Logics</span>
            </div>
            <div className="text-[9px] font-semibold uppercase tracking-[0.2em] text-white/58">
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
              className="flex h-full items-center gap-1 border-b-2 border-transparent text-[13px] font-semibold text-white/72 transition hover:border-[#ffd21f] hover:text-[#ffd21f]"
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
                        ? "border-[#ffd21f]/40 bg-[#fff8dc] text-[#050808] shadow-lg shadow-[#ffd21f]/15"
                        : "border-slate-200 bg-white text-slate-700 hover:border-[#050808]"
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
                      className="flex h-11 items-center gap-3 overflow-hidden rounded-md border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-900 transition hover:-translate-y-0.5 hover:border-[#050808] hover:text-[#050808] hover:shadow-lg"
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
            className="rounded-md border border-[#ffd21f] px-4 py-2 text-xs font-bold text-[#ffd21f] transition hover:bg-[#ffd21f] hover:text-[#050808]"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="rounded-md bg-[#ffd21f] px-4 py-2 text-xs font-bold text-[#050808] transition hover:bg-[#ffe164]"
          >
            Enroll Free
          </Link>
        </div>
      </div>
    </header>
  );
}
