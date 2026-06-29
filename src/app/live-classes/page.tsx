"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Bell,
  CalendarDays,
  CheckCircle2,
  Filter,
  MonitorPlay,
  Radio,
  Search,
  Video,
} from "lucide-react";
import { PublicPageShell } from "@/components/PublicPageShell";
import { CoursePromoCard } from "@/components/courses/CoursePromoCard";
import { LiveSessionPromoCard } from "@/components/courses/LiveSessionPromoCard";
import {
  groupLiveSessionsByDate,
  liveSessionsUrl,
  type LiveClassSessionItem,
} from "@/lib/live-classes";
import { fetchCourses, mapApiCourseToListingCourse } from "@/lib/courses";
import { getStudentSession } from "@/lib/student-auth";
import "@/styles/courses-catalog.css";

const filters = {
  status: [
    ["all", "All Classes"],
    ["live", "Live Now"],
    ["scheduled", "Upcoming"],
    ["replay", "Replay"],
  ],
  subject: [
    ["all", "All Subjects"],
    ["reasoning", "Reasoning"],
    ["quant", "Quant"],
    ["english", "English"],
    ["gk", "Banking GK"],
  ],
  type: [
    ["all", "All Types"],
    ["live", "Live Streaming"],
    ["recorded", "Replay Class"],
  ],
};

export default function LiveClassesPage() {
  const [liveSessions, setLiveSessions] = useState<LiveClassSessionItem[]>([]);
  const [liveCourses, setLiveCourses] = useState<ReturnType<typeof mapApiCourseToListingCourse>[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [status, setStatus] = useState("all");
  const [subject, setSubject] = useState("all");
  const [type, setType] = useState("all");
  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const loadSessions = useCallback(() => {
    const email = getStudentSession()?.email;
    setLoading(true);
    setLoadError("");
    fetch(liveSessionsUrl(email), { cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error("Unable to load live classes.");
        }
        const data = (await response.json()) as { sessions?: LiveClassSessionItem[] };
        setLiveSessions(data.sessions || []);
      })
      .catch(() => {
        setLiveSessions([]);
        setLoadError("Unable to load live classes. Please try again later.");
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    loadSessions();
    fetchCourses("live").then((items) => setLiveCourses(items.map(mapApiCourseToListingCourse)));
  }, [loadSessions]);

  const recordedSessions = useMemo(
    () => liveSessions.filter((s) => s.source === "session" && (s.has_recording || s.display_status === "replay")),
    [liveSessions],
  );

  const stats = useMemo(() => ({
    total: liveSessions.length,
    live: liveSessions.filter((s) => s.display_status === "live").length,
    upcoming: liveSessions.filter((s) => s.display_status === "scheduled").length,
    replay: liveSessions.filter((s) => s.display_status === "replay" || s.has_recording).length,
  }), [liveSessions]);

  const filteredSessions = useMemo(() => {
    const query = search.trim().toLowerCase();
    return liveSessions.filter((session) => {
      const sessionSubject = session.course.subject || "general";
      const sessionType = session.display_status === "replay" ? "recorded" : "live";

      if (status !== "all" && session.display_status !== status) return false;
      if (subject !== "all" && sessionSubject !== subject) return false;
      if (type !== "all" && sessionType !== type) return false;
      if (query && !`${session.title} ${session.faculty_name} ${session.course.title}`.toLowerCase().includes(query)) return false;
      return true;
    });
  }, [liveSessions, search, status, subject, type]);

  const groupedSessions = useMemo(
    () => groupLiveSessionsByDate(filteredSessions),
    [filteredSessions],
  );

  const clearFilters = () => {
    setStatus("all");
    setSubject("all");
    setType("all");
    setSearch("");
  };

  return (
    <PublicPageShell active="live-classes">

      {/* Hero — compact, matches PDF/courses page */}
      <section className="border-b border-[#0957D3]/15 px-6 py-11 text-white sm:px-8" style={{ background: "linear-gradient(130deg, #0E318D 0%, #0538A1 52%, #0957D3 100%)" }}>
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-5">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#0957D3]">
              <Radio size={12} /> Live Classes on Zoom
            </span>
            <h1 className="mt-4 font-['Sora'] text-[28px] font-extrabold leading-tight text-white">
              Live Banking Classes &amp; Recorded Replays
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-7 text-white/60">
              Join expert-led Zoom sessions. Recordings from completed live classes appear here automatically for replay.
            </p>
          </div>
          <div className="flex gap-9">
            {[
              ["Live Now", stats.live],
              ["Upcoming", stats.upcoming],
              ["Recorded", stats.replay],
            ].map(([label, count]) => (
              <div key={label as string} className="text-center">
                <strong className="block font-['Sora'] text-[28px] font-extrabold text-white">{count as number}</strong>
                <small className="text-[11px] font-semibold uppercase tracking-wide text-white/50">{label as string}</small>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main content — full width container */}
      <section className="w-full px-4 py-10 sm:px-6 sm:py-12 lg:px-10 lg:py-14">
        <div className="mx-auto w-full max-w-7xl">
          {/* Search + filter toggle */}
          <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative w-full lg:max-w-xl">
              <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-[#0957D3]/60" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search class, faculty, course..."
                className="h-12 w-full rounded-xl border border-[#0957D3]/20 bg-white pl-12 pr-4 text-sm font-semibold text-[#0957D3] shadow-sm outline-none transition focus:border-[#0957D3] focus:ring-2 focus:ring-[#0957D3]/10"
              />
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-xl border border-[#0957D3]/20 bg-[#0957D3]/6 px-4 py-2.5 text-sm font-bold text-[#0957D3]">
                {filteredSessions.length} classes found
              </span>
              <button
                type="button"
                onClick={() => setShowFilters((v) => !v)}
                className="inline-flex h-12 items-center gap-2 rounded-xl border border-[#0957D3]/20 bg-white px-4 text-sm font-bold text-[#0957D3] shadow-sm lg:hidden"
              >
                <Filter size={18} /> Filters
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[280px_minmax(0,1fr)] xl:grid-cols-[300px_minmax(0,1fr)]">
            {/* Sidebar filters */}
            <aside
              className={`rounded-2xl border border-[#0957D3]/15 bg-white p-5 shadow-sm lg:sticky lg:top-24 lg:block lg:h-max ${showFilters ? "block" : "hidden"}`}
            >
              <div className="mb-5 flex items-center gap-2 font-rajdhani text-xl font-bold text-[#0957D3]">
                <Filter size={20} className="text-[#0957D3]" /> Filters
              </div>
              <FilterGroup title="Status" options={filters.status} value={status} onChange={setStatus} />
              <FilterGroup title="Subject" options={filters.subject} value={subject} onChange={setSubject} />
              <FilterGroup title="Class Type" options={filters.type} value={type} onChange={setType} />
              <button
                type="button"
                onClick={clearFilters}
                className="kr-outline-button mt-5 h-11 w-full rounded-xl text-sm font-bold"
              >
                Clear Filters
              </button>
            </aside>

            {/* Cards grid */}
            <div>
              {liveCourses.length ? (
                <div className="mb-10">
                  <div className="mb-4 flex items-center gap-2">
                    <Video size={18} className="text-[#0957D3]" />
                    <h2 className="text-sm font-extrabold uppercase tracking-[0.14em] text-[#0957D3]">Live Course Plans</h2>
                  </div>
                  <div className="courses-promo-grid">
                    {liveCourses.map((course) => (
                      <CoursePromoCard key={course.id} course={course} href={`/live-classes/course/${course.slug}`} />
                    ))}
                  </div>
                </div>
              ) : null}

              {loadError ? (
                <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                  {loadError}
                </div>
              ) : null}

              {!loading && recordedSessions.length > 0 ? (
                <div className="mb-10">
                  <div className="mb-4 flex items-center gap-2">
                    <MonitorPlay size={18} className="text-[#0957D3]" />
                    <h2 className="text-sm font-extrabold uppercase tracking-[0.14em] text-[#0957D3]">Recorded Classes</h2>
                    <span className="rounded-full bg-[#0957D3]/10 px-2 py-0.5 text-[10px] font-bold text-[#0957D3]">{recordedSessions.length}</span>
                  </div>
                  <div className="courses-promo-grid">
                    {recordedSessions.map((session) => (
                      <LiveSessionPromoCard key={`rec-${session.id}`} session={session} onAccessChange={loadSessions} />
                    ))}
                  </div>
                </div>
              ) : null}

              {loading ? (
                <div className="courses-promo-grid">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-[420px] animate-pulse rounded-[18px] bg-[#0957D3]/10" />
                  ))}
                </div>
              ) : filteredSessions.length ? (
                <div className="grid gap-8">
                  {groupedSessions.map(([dateLabel, sessions]) => (
                    <div key={dateLabel}>
                      <div className="mb-4 flex items-center gap-2">
                        <CalendarDays size={18} className="text-[#0957D3]" />
                        <h2 className="text-sm font-extrabold uppercase tracking-[0.14em] text-[#0957D3]">{dateLabel}</h2>
                      </div>
                      <div className="courses-promo-grid">
                        {sessions.map((session) => (
                          <LiveSessionPromoCard
                            key={`${session.source}-${session.course.id}-${session.id}`}
                            session={session}
                            onAccessChange={loadSessions}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-[#c7b26b] bg-[#fffdf3] px-6 py-16 text-center">
                  <p className="font-rajdhani text-2xl font-bold text-[#0957D3]">No live classes found</p>
                  <p className="mt-2 text-sm font-medium text-[#0957D3]/70">Try changing filters or check back later.</p>
                </div>
              )}

              {/* Info strip */}
              <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {[
                  { icon: Bell, title: "Zoom Live Join", text: "One-click join after login and access verification." },
                  { icon: MonitorPlay, title: "Auto Recording", text: "Cloud recordings sync when the Zoom session ends." },
                  { icon: CheckCircle2, title: "Free & Paid Access", text: "Free courses after login. Paid courses after purchase." },
                ].map(({ icon: Icon, title, text }) => (
                  <div key={title} className="rounded-2xl border border-[#0957D3]/15 bg-white p-6 shadow-sm">
                    <Icon className="size-6 text-[#0957D3]" />
                    <h3 className="mt-3 font-rajdhani text-lg font-bold text-[#0957D3]">{title}</h3>
                    <p className="mt-2 text-sm leading-7 text-[#0957D3]/70">{text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </PublicPageShell>
  );
}

function FilterGroup({
  title,
  options,
  value,
  onChange,
}: {
  title: string;
  options: string[][];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="border-t border-[#0957D3]/10 py-4 first:border-t-0 first:pt-0">
      <h3 className="mb-3 text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#0957D3]/70">{title}</h3>
      <div className="grid gap-2">
        {options.map(([optionValue, label]) => (
          <button
            key={optionValue}
            type="button"
            onClick={() => onChange(optionValue)}
            className={`h-10 rounded-lg px-3 text-left text-sm font-bold transition ${
              value === optionValue
                ? "bg-[#0957D3] text-white"
                : "bg-[#0957D3]/6 text-[#0957D3] hover:bg-[#0957D3]/12"
            }`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
