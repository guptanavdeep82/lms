import {
  ArrowRight,
  Award,
  Bell,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock3,
  CreditCard,
  FileText,
  Flame,
  Grid2X2,
  Medal,
  Megaphone,
  Menu,
  MessageSquare,
  PlayCircle,
  Search,
  Settings,
  Star,
  Target,
  TrendingUp,
  Trophy,
  User,
  Video,
  WalletCards,
  Zap,
} from "lucide-react";
import { PurchasedCoursesList } from "@/components/student/PurchasedCoursesList";
import { StudentMobileNav } from "@/components/student/StudentMobileNav";
import { StudentSidebar } from "@/components/student/StudentSidebar";

const tickerMessages = [
  "New SBI PO full mock test is live now",
  "Reasoning live class starts today at 7:00 PM",
  "Your Quant assignment deadline is tomorrow",
  "RBI Grade B current affairs PDF has been added",
];

const metricTiles = [
  { label: "Course Progress", value: "72%", helper: "+12% this week", icon: TrendingUp, tone: "from-[#20327c] to-[#3354c8]", glow: "shadow-blue-100" },
  { label: "Tests Taken", value: "18", helper: "4 pending mocks", icon: Target, tone: "from-[#0f9f78] to-[#16c79a]", glow: "shadow-emerald-100" },
  { label: "Study Streak", value: "14d", helper: "Keep it going", icon: Flame, tone: "from-[#f0a500] to-[#ffcf33]", glow: "shadow-amber-100" },
  { label: "Best Rank", value: "#5", helper: "Top 2% nationally", icon: Trophy, tone: "from-[#6d5dfc] to-[#9b7bff]", glow: "shadow-indigo-100" },
];

const schedule = [
  { title: "Reasoning Puzzle Live Class", time: "Today, 7:00 PM", icon: Video, status: "Join soon", tone: "bg-[#e9f9f3] text-[#0f9f78]" },
  { title: "SBI PO Advanced Mock 4", time: "Tomorrow, 10:00 AM", icon: WalletCards, status: "Mock", tone: "bg-[#fff8dc] text-[#a66b00]" },
  { title: "Quant Doubt Clearing", time: "Fri, 6:30 PM", icon: MessageSquare, status: "Doubt", tone: "bg-[#eef2ff] text-[#3354c8]" },
];

const quickActions = [
  { label: "Resume Class", icon: PlayCircle },
  { label: "Take Mock", icon: Zap },
  { label: "Download Notes", icon: FileText },
  { label: "Ask Doubt", icon: MessageSquare },
];

const activities = [
  "Completed 3 chapters in Reasoning",
  "Scored 82% in IBPS Mini Mock",
  "Downloaded May Current Affairs PDF",
  "Unlocked Quant Practice Set 12",
];

export default function StudentDashboardPage() {
  return (
    <main className="min-h-screen bg-[#f6f8fc] text-[#111827]" style={{ fontFamily: "'Plus Jakarta Sans', Inter, ui-sans-serif, system-ui, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        @keyframes krTicker { from { transform: translateX(0); } to { transform: translateX(-50%); } }
      `}</style>

      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[282px] border-r border-[#e4e8f1] bg-white lg:block relative">
        <StudentSidebar />
      </aside>

      <section className="lg:pl-[282px]">
        <header className="sticky top-0 z-30 flex h-[70px] items-center justify-between border-b border-[#e4e8f1] bg-white/88 px-4 backdrop-blur-xl sm:px-8">
          <div className="flex items-center gap-4">
            <button className="grid h-11 w-11 place-items-center rounded-2xl border border-[#e4e8f1] bg-white text-[#334155] shadow-sm lg:hidden">
              <Menu size={20} />
            </button>
            <div className="hidden h-11 w-[480px] items-center gap-3 rounded-2xl border border-[#e4e8f1] bg-[#f8fafc] px-4 shadow-[0_10px_30px_rgba(15,23,42,0.04)] md:flex">
              <Search size={18} className="text-[#7d8799]" />
              <span className="text-sm font-medium text-[#7d8799]">Search courses, mock tests, notes...</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="relative grid h-11 w-11 place-items-center rounded-2xl border border-[#e4e8f1] bg-white text-[#172a69] shadow-sm">
              <Bell size={19} />
              <span className="absolute right-2.5 top-2.5 h-2.5 w-2.5 rounded-full bg-[#f5c518] ring-2 ring-white" />
            </button>
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-[#172a69] text-sm font-extrabold text-white">AR</div>
          </div>
        </header>

        <StudentMobileNav />

        <div className="mx-auto max-w-[1320px] px-4 py-7 sm:px-8">
          <section className="mb-6 overflow-hidden rounded-[22px] border border-[#dfe5ef] bg-white shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
            <div className="flex items-center gap-3 border-b border-[#edf1f7] bg-[#172a69] px-5 py-3 text-white">
              <Megaphone size={18} className="text-[#f5c518]" />
              <div className="relative flex-1 overflow-hidden whitespace-nowrap">
                <div className="inline-flex min-w-max gap-10 text-sm font-semibold" style={{ animation: "krTicker 26s linear infinite" }}>
                  {[...tickerMessages, ...tickerMessages].map((message, index) => (
                    <span key={`${message}-${index}`} className="inline-flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#f5c518]" />
                      {message}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="mb-6 grid gap-5 xl:grid-cols-[1fr_360px]">
            <div className="relative overflow-hidden rounded-[28px] bg-[#172a69] p-6 text-white shadow-[0_22px_60px_rgba(23,42,105,0.22)] sm:p-8">
              <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#f5c518]/18" />
              <div className="absolute bottom-0 right-8 hidden h-40 w-40 rounded-t-full border-[22px] border-[#f5c518]/20 lg:block" />
              <div className="relative z-10 max-w-2xl">
                <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-[#f7d85a] ring-1 ring-white/15">
                  <CheckCircle2 size={14} /> Active Student
                </span>
                <h1 className="mt-5 text-[28px] font-extrabold leading-tight tracking-[-0.04em] sm:text-[36px]">
                  Welcome back, Arjun
                </h1>
                <p className="mt-3 max-w-xl text-[15px] leading-7 text-white/72">
                  Aaj ka target: 2 classes complete karo, ek mini mock attempt karo, aur current affairs revision finish karo.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <a href="#courses" className="inline-flex h-12 items-center gap-2 rounded-2xl bg-[#f5c518] px-5 text-sm font-extrabold text-[#172a69] shadow-lg shadow-black/10 transition hover:bg-[#ffd844]">
                    Continue Learning <ArrowRight size={17} />
                  </a>
                  <a href="/student/mock-tests/sbi-po-2026/instructions" className="inline-flex h-12 items-center gap-2 rounded-2xl bg-white/10 px-5 text-sm font-bold text-white ring-1 ring-white/20 transition hover:bg-white/15">
                    Start Mock Test <PlayCircle size={17} />
                  </a>
                </div>
              </div>
            </div>

            <div className="rounded-[28px] border border-[#dfe5ef] bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-[#7d8799]">Weekly Goal</p>
                  <h2 className="mt-1 text-xl font-extrabold tracking-[-0.03em] text-[#172a69]">9h 45m / 12h</h2>
                </div>
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#fff8dc] text-[#c58a00]">
                  <Award size={22} />
                </div>
              </div>
              <div className="mt-6 h-3 overflow-hidden rounded-full bg-[#edf1f7]">
                <div className="h-full w-[81%] rounded-full bg-gradient-to-r from-[#172a69] to-[#f5c518]" />
              </div>
              <div className="mt-5 grid grid-cols-3 gap-3 text-center">
                {[
                  ["81%", "Done"],
                  ["3", "Classes"],
                  ["2", "Mocks"],
                ].map(([value, label]) => (
                  <div key={label} className="rounded-2xl bg-[#f7f9fd] p-3">
                    <p className="text-lg font-extrabold text-[#172a69]">{value}</p>
                    <p className="mt-0.5 text-[11px] font-bold uppercase tracking-[0.12em] text-[#8a94a6]">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="mb-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {metricTiles.map((tile) => (
              <article key={tile.label} className={`rounded-[22px] border border-[#dfe5ef] bg-white p-5 shadow-xl ${tile.glow}`}>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[13px] font-bold text-[#7d8799]">{tile.label}</p>
                    <p className="mt-2 text-[30px] font-extrabold tracking-[-0.04em] text-[#111827]">{tile.value}</p>
                    <p className="mt-1 text-xs font-bold text-[#10a96b]">{tile.helper}</p>
                  </div>
                  <div className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br ${tile.tone} text-white shadow-lg`}>
                    <tile.icon size={22} />
                  </div>
                </div>
              </article>
            ))}
          </section>

          <section className="grid gap-6 xl:grid-cols-[1fr_360px]">
            <div className="space-y-6">
              <div id="courses" className="rounded-[26px] border border-[#dfe5ef] bg-white p-5 shadow-[0_18px_50px_rgba(15,23,42,0.06)] sm:p-6">
                <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
                  <div>
                    <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#f0a500]">My Learning</p>
                    <h2 className="mt-1 text-xl font-extrabold tracking-[-0.03em] text-[#172a69]">Continue Courses</h2>
                  </div>
                  <a href="/student/courses" className="inline-flex items-center gap-1 text-sm font-extrabold text-[#172a69]">
                    View all <ChevronRight size={16} />
                  </a>
                </div>
                <div className="grid gap-5 lg:grid-cols-3">
                  <PurchasedCoursesList compact />
                </div>
              </div>

              <div className="grid gap-5 lg:grid-cols-4">
                {quickActions.map((action) => (
                  <button key={action.label} className="flex h-24 flex-col items-start justify-between rounded-[22px] border border-[#dfe5ef] bg-white p-4 text-left shadow-[0_14px_34px_rgba(15,23,42,0.05)] transition hover:-translate-y-1 hover:border-[#172a69]">
                    <action.icon size={22} className="text-[#172a69]" />
                    <span className="text-sm font-extrabold text-[#111827]">{action.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <aside className="space-y-6">
              <div id="schedule" className="rounded-[26px] border border-[#dfe5ef] bg-white p-5 shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#f0a500]">Today</p>
                    <h2 className="mt-1 text-xl font-extrabold tracking-[-0.02em] text-[#172a69]">Schedule</h2>
                  </div>
                  <CalendarDays size={22} className="text-[#172a69]" />
                </div>
                <div className="mt-5 space-y-3">
                  {schedule.map((item) => (
                    <div key={item.title} className="rounded-2xl bg-[#f7f9fd] p-4">
                      <div className="flex gap-3">
                        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-white text-[#172a69] shadow-sm">
                          <item.icon size={18} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-extrabold leading-snug text-[#111827]">{item.title}</p>
                          <p className="mt-1 text-xs font-semibold text-[#7d8799]">{item.time}</p>
                        </div>
                        <span className={`h-fit rounded-full px-2.5 py-1 text-[11px] font-extrabold ${item.tone}`}>{item.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[26px] border border-[#dfe5ef] bg-white p-5 shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-extrabold tracking-[-0.02em] text-[#172a69]">Recent Activity</h2>
                  <Star size={20} className="text-[#f5c518]" fill="currentColor" />
                </div>
                <div className="mt-5 space-y-4">
                  {activities.map((activity) => (
                    <div key={activity} className="flex gap-3">
                      <div className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[#eef2ff] text-[#172a69]">
                        <CheckCircle2 size={15} />
                      </div>
                      <p className="text-sm font-semibold leading-6 text-[#4b5563]">{activity}</p>
                    </div>
                  ))}
                </div>
              </div>
            </aside>
          </section>
        </div>
      </section>
    </main>
  );
}
