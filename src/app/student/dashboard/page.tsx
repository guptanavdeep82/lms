import Image from "next/image";
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
  LogOut,
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

const navGroups = [
  {
    title: "Learn",
    items: [
      { label: "Dashboard", icon: Grid2X2, href: "/student/dashboard", active: true },
      { label: "My Courses", icon: BookOpen, href: "/student/courses" },
      { label: "Mock Tests", icon: WalletCards, href: "/student/mock-tests" },
      { label: "Schedule", icon: CalendarDays, href: "#schedule" },
      { label: "Certificates", icon: Medal, href: "#certificates" },
    ],
  },
  {
    title: "Account",
    items: [
      { label: "Profile", icon: User, href: "#profile" },
      { label: "Purchases", icon: CreditCard, href: "#purchases" },
      { label: "Messages", icon: MessageSquare, href: "#messages" },
      { label: "Settings", icon: Settings, href: "#settings" },
    ],
  },
];

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

const courses = [
  {
    title: "Banking Foundation Programme",
    teacher: "KR Faculty Team",
    tag: "Continue",
    lessons: "122 / 156 lessons",
    time: "42h watched",
    progress: 78,
    gradient: "from-[#20327c] via-[#2549b8] to-[#1aa7a1]",
  },
  {
    title: "SBI PO Prelims Crash Course",
    teacher: "Karan Rajput",
    tag: "Live Batch",
    lessons: "38 / 64 lessons",
    time: "18h watched",
    progress: 59,
    gradient: "from-[#0f9f78] via-[#23b889] to-[#f5c518]",
  },
  {
    title: "RBI Grade B Current Affairs",
    teacher: "Priya Kumari",
    tag: "New PDF",
    lessons: "21 / 40 modules",
    time: "9h read",
    progress: 52,
    gradient: "from-[#243580] via-[#6d5dfc] to-[#e8a800]",
  },
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

      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[282px] border-r border-[#e4e8f1] bg-white lg:block">
        <div className="flex h-[78px] items-center gap-3 border-b border-[#e4e8f1] px-6">
          <Image src="/logics-logo.jpeg" alt="KR Logics logo" width={48} height={48} className="h-12 w-12 rounded-2xl border-2 border-[#ffd21f] object-cover shadow-xl shadow-black/10" />
          <div className="min-w-0">
            <p className="text-[16px] font-extrabold leading-tight text-[#172a69]">KR Logics</p>
            <p className="mt-0.5 text-xs font-semibold uppercase tracking-[0.16em] text-[#8791a5]">Student LMS</p>
          </div>
        </div>

        <div className="h-[calc(100vh-78px)] overflow-y-auto px-4 py-5">
          {navGroups.map((group) => (
            <div key={group.title} className="mb-8">
              <p className="mb-3 px-3 text-[11px] font-bold uppercase tracking-[0.18em] text-[#9aa4b5]">{group.title}</p>
              <div className="space-y-1.5">
                {group.items.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    className={`flex h-11 items-center gap-3 rounded-2xl px-3.5 text-[14px] font-semibold transition ${
                      item.active
                        ? "bg-[#eef2ff] text-[#172a69] shadow-sm ring-1 ring-[#dfe5ff]"
                        : "text-[#334155] hover:bg-[#f3f6fb] hover:text-[#172a69]"
                    }`}
                  >
                    <item.icon size={18} strokeWidth={2.2} />
                    {item.label}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="absolute bottom-0 left-0 right-0 border-t border-[#e4e8f1] bg-white p-4">
          <a href="#" className="flex h-11 items-center gap-3 rounded-2xl px-3.5 text-[14px] font-semibold text-[#334155] hover:bg-[#f3f6fb]">
            <LogOut size={18} />
            Sign out
          </a>
        </div>
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

        <nav className="sticky top-[70px] z-20 flex gap-2 overflow-x-auto border-b border-[#e4e8f1] bg-white px-4 py-3 [scrollbar-width:none] sm:px-8 lg:hidden [&::-webkit-scrollbar]:hidden">
          {navGroups.flatMap((group) => group.items).slice(0, 6).map((item) => (
            <a
              key={item.label}
              href={item.href}
              className={`inline-flex h-10 shrink-0 items-center gap-2 rounded-2xl px-3 text-xs font-extrabold ${
                item.active ? "bg-[#172a69] text-white" : "bg-[#f3f6fb] text-[#334155]"
              }`}
            >
              <item.icon size={15} />
              {item.label}
            </a>
          ))}
        </nav>

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
                <h1 className="mt-5 text-[32px] font-extrabold leading-tight tracking-[-0.04em] sm:text-[44px]">
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
                  <h2 className="mt-1 text-2xl font-extrabold tracking-[-0.03em] text-[#172a69]">9h 45m / 12h</h2>
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
                    <h2 className="mt-1 text-2xl font-extrabold tracking-[-0.03em] text-[#172a69]">Continue Courses</h2>
                  </div>
                  <a href="#" className="inline-flex items-center gap-1 text-sm font-extrabold text-[#172a69]">
                    View all <ChevronRight size={16} />
                  </a>
                </div>
                <div className="grid gap-5 lg:grid-cols-3">
                  {courses.map((course) => (
                    <article key={course.title} className="overflow-hidden rounded-[22px] border border-[#e5eaf2] bg-white shadow-[0_14px_34px_rgba(15,23,42,0.05)] transition hover:-translate-y-1 hover:shadow-[0_22px_50px_rgba(15,23,42,0.08)]">
                      <div className={`relative h-32 bg-gradient-to-br ${course.gradient} p-4 text-white`}>
                        <span className="rounded-full bg-white/16 px-3 py-1 text-xs font-extrabold backdrop-blur">{course.tag}</span>
                        <BookOpen className="absolute bottom-4 right-4 text-white/80" size={42} />
                      </div>
                      <div className="p-5">
                        <h3 className="min-h-[44px] text-[15px] font-extrabold leading-snug text-[#111827]">{course.title}</h3>
                        <p className="mt-1 text-xs font-semibold text-[#7d8799]">by {course.teacher}</p>
                        <div className="mt-4 flex flex-wrap gap-3 text-xs font-semibold text-[#7d8799]">
                          <span className="inline-flex items-center gap-1"><BookOpen size={13} /> {course.lessons}</span>
                          <span className="inline-flex items-center gap-1"><Clock3 size={13} /> {course.time}</span>
                        </div>
                        <div className="mt-4 flex items-center justify-between text-xs font-bold">
                          <span className="text-[#7d8799]">Progress</span>
                          <span className="text-[#172a69]">{course.progress}%</span>
                        </div>
                        <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#edf1f7]">
                          <div className="h-full rounded-full bg-[#172a69]" style={{ width: `${course.progress}%` }} />
                        </div>
                      </div>
                    </article>
                  ))}
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
