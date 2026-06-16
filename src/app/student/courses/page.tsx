import {
  Award,
  Bell,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock3,
  CreditCard,
  Download,
  FileText,
  Grid2X2,
  Medal,
  Menu,
  MessageSquare,
  PlayCircle,
  Search,
  Settings,
  Target,
  User,
  Video,
  WalletCards,
} from "lucide-react";
import { PurchasedCoursesList, PurchasedCoursesStats } from "@/components/student/PurchasedCoursesList";
import { StudentPurchasesPanel } from "@/components/student/StudentPurchasesPanel";
import { StudentMobileNav } from "@/components/student/StudentMobileNav";
import { StudentSidebar } from "@/components/student/StudentSidebar";

function CoursesSummaryCard() {
  return <PurchasedCoursesStats />;
}

const summary = [
  { label: "Purchased Courses", value: <CoursesSummaryCard />, icon: BookOpen, tone: "bg-[#eef2ff] text-[#172a69]" },
  { label: "Avg Progress", value: "58%", icon: Target, tone: "bg-[#e9f9f3] text-[#0f9f78]" },
  { label: "Certificates Ready", value: "2", icon: Award, tone: "bg-[#fff8dc] text-[#b77900]" },
  { label: "Pending Lessons", value: "125", icon: Clock3, tone: "bg-[#f4edff] text-[#6d5dfc]" },
];

const resources = [
  { title: "Current Affairs May 2026", type: "PDF", icon: FileText },
  { title: "SBI PO Formula Sheet", type: "Notes", icon: Download },
  { title: "Reasoning Live Recording", type: "Video", icon: Video },
];

export default function StudentCoursesPage() {
  return (
    <main className="min-h-screen bg-[#f6f8fc] text-[#111827]" style={{ fontFamily: "'Plus Jakarta Sans', Inter, ui-sans-serif, system-ui, sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');`}</style>

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
              <span className="text-sm font-medium text-[#7d8799]">Search purchased courses, lessons, notes...</span>
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
          <section className="mb-6 grid gap-5 xl:grid-cols-[1fr_340px]">
            <div className="relative overflow-hidden rounded-[28px] bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.06)] ring-1 ring-[#dfe5ef] sm:p-8">
              <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-br from-[#eef2ff] via-[#fff8dc] to-transparent" />
              <div className="relative z-10">
                <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#f0a500]">Purchased Learning</p>
                <h1 className="mt-2 text-[28px] font-extrabold tracking-[-0.04em] text-[#172a69] sm:text-[36px]">My Courses</h1>
                <p className="mt-3 max-w-2xl text-[15px] leading-7 text-[#667085]">
                  Yahan student ke purchased courses, progress, next lessons, notes aur validity ek clean dashboard me show honge.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  {["All Courses", "In Progress", "Live Batch", "Completed"].map((tab, index) => (
                    <button
                      key={tab}
                      className={`h-11 rounded-2xl px-4 text-sm font-extrabold transition ${
                        index === 0 ? "bg-[#172a69] text-white shadow-lg shadow-blue-100" : "bg-[#f3f6fb] text-[#4b5563] hover:bg-white"
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="rounded-[28px] bg-[#172a69] p-6 text-white shadow-[0_22px_60px_rgba(23,42,105,0.22)]">
              <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#f5c518]">Next Class</p>
              <h2 className="mt-3 text-xl font-extrabold tracking-[-0.03em]">Reasoning Puzzle Live</h2>
              <p className="mt-2 text-sm font-medium text-white/68">Today at 7:00 PM with Karan Sir</p>
              <button className="mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[#f5c518] text-sm font-extrabold text-[#172a69]">
                Join Class <Video size={17} />
              </button>
            </div>
          </section>

          <section className="mb-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {summary.map((item) => (
              <article key={item.label} className="rounded-[22px] border border-[#dfe5ef] bg-white p-5 shadow-[0_14px_34px_rgba(15,23,42,0.05)]">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-[13px] font-bold text-[#7d8799]">{item.label}</p>
                    <p className="mt-2 text-[30px] font-extrabold tracking-[-0.04em] text-[#111827]">{item.value}</p>
                  </div>
                  <div className={`grid h-12 w-12 place-items-center rounded-2xl ${item.tone}`}>
                    <item.icon size={22} />
                  </div>
                </div>
              </article>
            ))}
          </section>

          <section className="grid gap-6 xl:grid-cols-[1fr_340px]">
            <div className="grid gap-4">
              <PurchasedCoursesList />
            </div>

            <aside className="space-y-6">
              <StudentPurchasesPanel />
              <div className="rounded-[26px] border border-[#dfe5ef] bg-white p-5 shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-extrabold tracking-[-0.02em] text-[#172a69]">Course Health</h2>
                  <Target size={22} className="text-[#172a69]" />
                </div>
                <div className="mt-5 space-y-4">
                  {[
                    ["Attendance", "92%"],
                    ["Assignment", "86%"],
                    ["Mock Accuracy", "74%"],
                  ].map(([label, value]) => (
                    <div key={label}>
                      <div className="flex justify-between text-sm font-bold">
                        <span className="text-[#667085]">{label}</span>
                        <span className="text-[#172a69]">{value}</span>
                      </div>
                      <div className="mt-2 h-2 rounded-full bg-[#edf1f7]">
                        <div className="h-full rounded-full bg-[#172a69]" style={{ width: value }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[26px] border border-[#dfe5ef] bg-white p-5 shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-extrabold tracking-[-0.02em] text-[#172a69]">Latest Resources</h2>
                  <FileText size={21} className="text-[#f0a500]" />
                </div>
                <div className="mt-5 space-y-3">
                  {resources.map((resource) => (
                    <button key={resource.title} className="flex w-full items-center gap-3 rounded-2xl bg-[#f7f9fd] p-4 text-left transition hover:bg-[#eef2ff]">
                      <div className="grid h-10 w-10 place-items-center rounded-2xl bg-white text-[#172a69] shadow-sm">
                        <resource.icon size={18} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-extrabold text-[#111827]">{resource.title}</p>
                        <p className="mt-0.5 text-xs font-bold text-[#7d8799]">{resource.type}</p>
                      </div>
                      <ChevronRight size={17} className="text-[#9aa4b5]" />
                    </button>
                  ))}
                </div>
              </div>

              <div id="certificates" className="rounded-[26px] bg-[#172a69] p-5 text-white shadow-[0_22px_60px_rgba(23,42,105,0.22)]">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white/12 text-[#f5c518]">
                  <Award size={23} />
                </div>
                <h2 className="mt-4 text-xl font-extrabold">2 Certificates Ready</h2>
                <p className="mt-2 text-sm leading-6 text-white/68">Complete remaining lessons to unlock more course certificates.</p>
                <button className="mt-5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-2xl bg-[#f5c518] text-sm font-extrabold text-[#172a69]">
                  View Certificates <CheckCircle2 size={17} />
                </button>
              </div>
            </aside>
          </section>
        </div>
      </section>
    </main>
  );
}
