import Image from "next/image";
import {
  Award,
  BarChart3,
  Bell,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock3,
  CreditCard,
  FileText,
  Grid2X2,
  LogOut,
  Medal,
  Menu,
  MessageSquare,
  Play,
  Search,
  Settings,
  ShieldCheck,
  Target,
  TrendingUp,
  Trophy,
  User,
  WalletCards,
  Zap,
} from "lucide-react";

const navGroups = [
  {
    title: "Learn",
    items: [
      { label: "Dashboard", icon: Grid2X2, href: "/student/dashboard" },
      { label: "My Courses", icon: BookOpen, href: "/student/courses" },
      { label: "Mock Tests", icon: WalletCards, href: "/student/mock-tests", active: true },
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

const stats = [
  { label: "Tests Taken", value: "18", helper: "+4 this week", icon: FileText, tone: "bg-[#eef2ff] text-[#172a69]" },
  { label: "Avg Score", value: "82%", helper: "8% improvement", icon: TrendingUp, tone: "bg-[#e9f9f3] text-[#0f9f78]" },
  { label: "Best Rank", value: "#5", helper: "Top 2% nationally", icon: Trophy, tone: "bg-[#fff8dc] text-[#b77900]" },
  { label: "Accuracy", value: "76%", helper: "Reasoning strongest", icon: Target, tone: "bg-[#f4edff] text-[#6d5dfc]" },
];

const upcomingTests = [
  {
    title: "SBI PO Advanced Mock 4",
    category: "Banking",
    date: "Tomorrow, 10:00 AM",
    duration: "90 min",
    questions: "50 questions",
    level: "Hard",
    levelTone: "bg-[#ffe7ea] text-[#d92347]",
    gradient: "from-[#172a69] via-[#274dbc] to-[#13a38b]",
    syllabus: "Reasoning, Quant, English",
  },
  {
    title: "IBPS Clerk Speed Test",
    category: "Prelims",
    date: "Fri, May 22",
    duration: "60 min",
    questions: "35 questions",
    level: "Medium",
    levelTone: "bg-[#fff8dc] text-[#946300]",
    gradient: "from-[#0f9f78] via-[#23b889] to-[#f5c518]",
    syllabus: "Sectional speed practice",
  },
  {
    title: "RBI Grade B Phase 1",
    category: "RBI",
    date: "Sun, May 24",
    duration: "120 min",
    questions: "100 questions",
    level: "Hard",
    levelTone: "bg-[#ffe7ea] text-[#d92347]",
    gradient: "from-[#243580] via-[#6d5dfc] to-[#e8a800]",
    syllabus: "GA, Quant, English, Reasoning",
  },
  {
    title: "Quant Mini Practice Set",
    category: "Quant",
    date: "Mon, May 25",
    duration: "25 min",
    questions: "20 questions",
    level: "Easy",
    levelTone: "bg-[#e9f9f3] text-[#0f9f78]",
    gradient: "from-[#ba7517] via-[#f0a500] to-[#ffcf33]",
    syllabus: "Arithmetic and DI",
  },
];

const completedTests = [
  { title: "IBPS PO Mock 3", score: "84%", rank: "#12", accuracy: "78%", status: "Excellent" },
  { title: "Reasoning Sectional 9", score: "91%", rank: "#5", accuracy: "86%", status: "Topper" },
  { title: "Quant Practice Set 14", score: "72%", rank: "#48", accuracy: "69%", status: "Review" },
];

const leaderboard = [
  ["Rahul K.", "94%", "#1"],
  ["Ananya S.", "91%", "#2"],
  ["Arjun R.", "89%", "#5"],
];

export default function StudentMockTestsPage() {
  return (
    <main className="min-h-screen bg-[#f6f8fc] text-[#111827]" style={{ fontFamily: "'Plus Jakarta Sans', Inter, ui-sans-serif, system-ui, sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');`}</style>

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
              <span className="text-sm font-medium text-[#7d8799]">Search mock tests, results, topics...</span>
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
          <section className="mb-6 grid gap-5 xl:grid-cols-[1fr_360px]">
            <div className="relative overflow-hidden rounded-[28px] bg-[#172a69] p-6 text-white shadow-[0_22px_60px_rgba(23,42,105,0.22)] sm:p-8">
              <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-[#f5c518]/18" />
              <div className="absolute bottom-0 right-10 hidden h-36 w-36 rounded-t-full border-[18px] border-[#f5c518]/20 lg:block" />
              <div className="relative z-10 max-w-2xl">
                <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-[#f7d85a] ring-1 ring-white/15">
                  <ShieldCheck size={14} /> Mock Test Zone
                </span>
                <h1 className="mt-5 text-[34px] font-extrabold leading-tight tracking-[-0.04em] sm:text-[46px]">Practice. Analyze. Improve.</h1>
                <p className="mt-3 max-w-xl text-[15px] leading-7 text-white/72">
                  Real exam pattern ke mock tests, instant score analysis, rank tracking aur topic-wise improvement report.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <a href="/student/mock-tests/sbi-po-2026/instructions" className="inline-flex h-12 items-center gap-2 rounded-2xl bg-[#f5c518] px-5 text-sm font-extrabold text-[#172a69] shadow-lg shadow-black/10 transition hover:bg-[#ffd844]">
                    Start Latest Mock <Play size={17} />
                  </a>
                  <button className="inline-flex h-12 items-center gap-2 rounded-2xl bg-white/10 px-5 text-sm font-bold text-white ring-1 ring-white/20 transition hover:bg-white/15">
                    View Analysis <BarChart3 size={17} />
                  </button>
                </div>
              </div>
            </div>

            <div className="rounded-[28px] border border-[#dfe5ef] bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-[#7d8799]">Readiness Score</p>
                  <h2 className="mt-1 text-3xl font-extrabold tracking-[-0.04em] text-[#172a69]">82%</h2>
                </div>
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#fff8dc] text-[#c58a00]">
                  <Zap size={22} />
                </div>
              </div>
              <div className="mt-6 h-3 overflow-hidden rounded-full bg-[#edf1f7]">
                <div className="h-full w-[82%] rounded-full bg-gradient-to-r from-[#172a69] to-[#f5c518]" />
              </div>
              <div className="mt-5 grid grid-cols-3 gap-3 text-center">
                {[
                  ["91%", "Reasoning"],
                  ["78%", "Quant"],
                  ["74%", "English"],
                ].map(([value, label]) => (
                  <div key={label} className="rounded-2xl bg-[#f7f9fd] p-3">
                    <p className="text-lg font-extrabold text-[#172a69]">{value}</p>
                    <p className="mt-0.5 text-[10px] font-bold uppercase tracking-[0.1em] text-[#8a94a6]">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="mb-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {stats.map((item) => (
              <article key={item.label} className="rounded-[22px] border border-[#dfe5ef] bg-white p-5 shadow-[0_14px_34px_rgba(15,23,42,0.05)]">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-[13px] font-bold text-[#7d8799]">{item.label}</p>
                    <p className="mt-2 text-[30px] font-extrabold tracking-[-0.04em] text-[#111827]">{item.value}</p>
                    <p className="mt-1 text-xs font-bold text-[#0f9f78]">{item.helper}</p>
                  </div>
                  <div className={`grid h-12 w-12 place-items-center rounded-2xl ${item.tone}`}>
                    <item.icon size={22} />
                  </div>
                </div>
              </article>
            ))}
          </section>

          <section className="grid gap-6 xl:grid-cols-[1fr_340px]">
            <div className="space-y-6">
              <div className="rounded-[26px] border border-[#dfe5ef] bg-white p-5 shadow-[0_18px_50px_rgba(15,23,42,0.06)] sm:p-6">
                <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
                  <div>
                    <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#f0a500]">Upcoming Tests</p>
                    <h2 className="mt-1 text-2xl font-extrabold tracking-[-0.03em] text-[#172a69]">Available Mock Tests</h2>
                  </div>
                  <div className="flex rounded-2xl bg-[#f3f6fb] p-1">
                    {["Upcoming", "Completed", "Missed"].map((tab, index) => (
                      <button key={tab} className={`h-9 rounded-xl px-4 text-xs font-extrabold ${index === 0 ? "bg-white text-[#172a69] shadow-sm" : "text-[#667085]"}`}>
                        {tab}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid gap-5 lg:grid-cols-2">
                  {upcomingTests.map((test) => (
                    <article key={test.title} className="overflow-hidden rounded-[22px] border border-[#e5eaf2] bg-white shadow-[0_14px_34px_rgba(15,23,42,0.05)] transition hover:-translate-y-1 hover:shadow-[0_22px_50px_rgba(15,23,42,0.08)]">
                      <div className={`relative h-24 bg-gradient-to-br ${test.gradient} p-4 text-white`}>
                        <span className="rounded-full bg-white/16 px-3 py-1 text-xs font-extrabold backdrop-blur">{test.category}</span>
                        <WalletCards className="absolute bottom-4 right-4 text-white/75" size={38} />
                      </div>
                      <div className="p-5">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h3 className="text-[17px] font-extrabold leading-snug tracking-[-0.02em] text-[#111827]">{test.title}</h3>
                            <p className="mt-1 text-xs font-semibold text-[#7d8799]">{test.syllabus}</p>
                          </div>
                          <span className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-extrabold ${test.levelTone}`}>{test.level}</span>
                        </div>
                        <div className="mt-5 grid grid-cols-3 gap-2">
                          <div className="rounded-2xl bg-[#f7f9fd] p-3">
                            <Clock3 size={15} className="text-[#172a69]" />
                            <p className="mt-2 text-xs font-extrabold text-[#111827]">{test.duration}</p>
                          </div>
                          <div className="rounded-2xl bg-[#f7f9fd] p-3">
                            <FileText size={15} className="text-[#172a69]" />
                            <p className="mt-2 text-xs font-extrabold text-[#111827]">{test.questions}</p>
                          </div>
                          <div className="rounded-2xl bg-[#f7f9fd] p-3">
                            <CalendarDays size={15} className="text-[#172a69]" />
                            <p className="mt-2 text-xs font-extrabold text-[#111827]">{test.date}</p>
                          </div>
                        </div>
                        <a href="/student/mock-tests/sbi-po-2026/instructions" className="mt-5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-2xl bg-[#172a69] text-sm font-extrabold text-white shadow-lg shadow-blue-100 transition hover:bg-[#10215a]">
                          <Play size={16} /> Start Test
                        </a>
                      </div>
                    </article>
                  ))}
                </div>
              </div>

              <div className="rounded-[26px] border border-[#dfe5ef] bg-white p-5 shadow-[0_18px_50px_rgba(15,23,42,0.06)] sm:p-6">
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#f0a500]">Analysis</p>
                    <h2 className="mt-1 text-2xl font-extrabold tracking-[-0.03em] text-[#172a69]">Completed Tests</h2>
                  </div>
                  <BarChart3 size={23} className="text-[#172a69]" />
                </div>
                <div className="overflow-hidden rounded-2xl border border-[#e5eaf2]">
                  {completedTests.map((test, index) => (
                    <div key={test.title} className={`grid gap-3 p-4 sm:grid-cols-[1fr_80px_80px_90px_90px] ${index !== completedTests.length - 1 ? "border-b border-[#e5eaf2]" : ""}`}>
                      <p className="text-sm font-extrabold text-[#111827]">{test.title}</p>
                      <p className="text-sm font-bold text-[#172a69]">{test.score}</p>
                      <p className="text-sm font-bold text-[#0f9f78]">{test.rank}</p>
                      <p className="text-sm font-bold text-[#667085]">{test.accuracy}</p>
                      <span className="w-fit rounded-full bg-[#eef2ff] px-2.5 py-1 text-xs font-extrabold text-[#172a69]">{test.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <aside className="space-y-6">
              <div className="rounded-[26px] border border-[#dfe5ef] bg-white p-5 shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-extrabold tracking-[-0.02em] text-[#172a69]">Leaderboard</h2>
                  <Trophy size={22} className="text-[#f0a500]" />
                </div>
                <div className="mt-5 space-y-3">
                  {leaderboard.map(([name, score, rank]) => (
                    <div key={name} className="flex items-center gap-3 rounded-2xl bg-[#f7f9fd] p-4">
                      <div className="grid h-10 w-10 place-items-center rounded-2xl bg-white text-sm font-extrabold text-[#172a69] shadow-sm">{rank}</div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-extrabold text-[#111827]">{name}</p>
                        <p className="mt-0.5 text-xs font-bold text-[#7d8799]">Score {score}</p>
                      </div>
                      {name === "Arjun R." ? <CheckCircle2 size={18} className="text-[#0f9f78]" /> : null}
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[26px] border border-[#dfe5ef] bg-white p-5 shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
                <h2 className="text-xl font-extrabold tracking-[-0.02em] text-[#172a69]">Weak Areas</h2>
                <div className="mt-5 space-y-4">
                  {[
                    ["Data Interpretation", "54%"],
                    ["Cloze Test", "61%"],
                    ["Puzzle Set", "68%"],
                  ].map(([label, value]) => (
                    <div key={label}>
                      <div className="flex justify-between text-sm font-bold">
                        <span className="text-[#667085]">{label}</span>
                        <span className="text-[#172a69]">{value}</span>
                      </div>
                      <div className="mt-2 h-2 rounded-full bg-[#edf1f7]">
                        <div className="h-full rounded-full bg-[#f5c518]" style={{ width: value }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[26px] bg-[#172a69] p-5 text-white shadow-[0_22px_60px_rgba(23,42,105,0.22)]">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white/12 text-[#f5c518]">
                  <Award size={23} />
                </div>
                <h2 className="mt-4 text-xl font-extrabold">Mock Test Pass</h2>
                <p className="mt-2 text-sm leading-6 text-white/68">Unlimited sectional tests, full mocks and detailed video solutions included.</p>
                <button className="mt-5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-2xl bg-[#f5c518] text-sm font-extrabold text-[#172a69]">
                  Upgrade Plan <ChevronRight size={17} />
                </button>
              </div>
            </aside>
          </section>
        </div>
      </section>
    </main>
  );
}
