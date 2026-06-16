"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Bell,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Filter,
  MonitorPlay,
  PlayCircle,
  Radio,
  Search,
  Sparkles,
  Video,
} from "lucide-react";
import { PublicPageShell } from "@/components/PublicPageShell";
import { LiveClassActionButton } from "@/components/live-classes/LiveClassActionButton";
import {
  formatLiveSessionSchedule,
  groupLiveSessionsByDate,
  liveSessionsUrl,
  liveSessionStatusLabel,
  type LiveClassSessionItem,
} from "@/lib/live-classes";
import { getStudentSession } from "@/lib/student-auth";

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

function statusBadgeClass(status: LiveClassSessionItem["display_status"]) {
  if (status === "live") return "bg-red-600 text-white";
  if (status === "replay") return "bg-white text-[#1b2e6b]";
  return "bg-[#f5c518] text-[#1b2e6b]";
}

function SessionThumb({ session }: { session: LiveClassSessionItem }) {
  const src = session.course.image_url;

  return (
    <div className="relative h-28 w-full overflow-hidden bg-gradient-to-br from-[#0f1e4a] via-[#1b2e6b] to-[#243580] sm:h-32">
      {src ? (
        <>
          <img src={src} alt={session.title} className="h-full w-full object-cover opacity-90" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f1e4a]/90 via-[#1b2e6b]/40 to-transparent" />
        </>
      ) : (
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(245,197,24,0.25),transparent_40%)]" />
      )}
      <span
        className={`absolute left-4 top-4 rounded-full px-3 py-1 text-[10px] font-extrabold uppercase tracking-wide ${statusBadgeClass(session.display_status)}`}
      >
        {liveSessionStatusLabel(session.display_status)}
      </span>
      <div className="absolute inset-0 grid place-items-center">
        <div className="grid size-10 place-items-center rounded-full bg-[#f5c518] text-[#1b2e6b] shadow-lg shadow-black/20">
          <PlayCircle size={22} fill="currentColor" />
        </div>
      </div>
    </div>
  );
}

export default function LiveClassesPage() {
  const [liveSessions, setLiveSessions] = useState<LiveClassSessionItem[]>([]);
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
  }, [loadSessions]);

  const featuredSession = liveSessions.find((s) => s.display_status === "live") ?? liveSessions[0];

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

      {/* Hero — full width */}
      <section className="relative w-full overflow-hidden border-b border-[#1b2e6b]/20 bg-[#1b2e6b] text-white">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_85%_15%,rgba(245,197,24,0.22),transparent_32%)]" />
        <div className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full border border-[#f5c518]/20" />
        <div className="relative mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-10 lg:py-20">
          <div className="grid grid-cols-1 items-end gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-14">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-[#f5c518] px-4 py-2 text-xs font-extrabold uppercase tracking-[0.18em] text-[#1b2e6b] shadow-md shadow-black/10">
                <Radio size={14} className="text-[#1b2e6b]" /> Live Classes on Zoom
              </span>
              <h1 className="mt-5 font-rajdhani text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl lg:leading-[1.05]">
                Join Live Banking Classes & Watch Replays Anytime
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-8 text-white/75 sm:text-lg">
                Attend expert-led live sessions on Zoom. Free classes open after login. Paid batches unlock after purchase. Recordings save automatically when class ends.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                {[
                  ["Live Now", stats.live],
                  ["Upcoming", stats.upcoming],
                  ["Replays", stats.replay],
                ].map(([label, count]) => (
                  <div
                    key={label as string}
                    className="min-w-[120px] rounded-2xl border border-white/15 bg-white/10 px-5 py-4 backdrop-blur-sm"
                  >
                    <div className="font-rajdhani text-2xl font-bold text-[#f5c518]">{count as number}</div>
                    <div className="mt-1 text-xs font-semibold uppercase tracking-wide text-white/65">{label as string}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-[#f5c518]/30 bg-white/10 p-6 backdrop-blur-md sm:p-7">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-[#f5c518] px-3 py-1 text-[10px] font-extrabold uppercase tracking-wide text-[#1b2e6b]">
                <Sparkles size={12} /> Next Session
              </div>
              <p className="font-rajdhani text-xl font-bold leading-snug sm:text-2xl">
                {featuredSession ? featuredSession.title : "Sessions coming soon"}
              </p>
              <p className="mt-3 text-sm leading-7 text-white/70">
                {featuredSession
                  ? `${formatLiveSessionSchedule(featuredSession.scheduled_at)} · ${featuredSession.faculty_name || featuredSession.course.title}`
                  : "Admin can schedule live sessions from the panel."}
              </p>
              {featuredSession ? (
                <div className="mt-5 flex flex-wrap gap-2">
                  <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-bold text-white">
                    {featuredSession.duration_minutes} min
                  </span>
                  <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-bold text-white">
                    {featuredSession.course.is_free ? "Free" : `₹${featuredSession.course.effective_price}`}
                  </span>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      {/* Main content — full width container */}
      <section className="w-full px-4 py-10 sm:px-6 sm:py-12 lg:px-10 lg:py-14">
        <div className="mx-auto w-full max-w-7xl">
          {/* Search + filter toggle */}
          <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative w-full lg:max-w-xl">
              <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-[#b78600]" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search class, faculty, course..."
                className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-12 pr-4 text-sm font-semibold text-slate-800 shadow-sm outline-none transition focus:border-[#1b2e6b] focus:ring-2 focus:ring-[#1b2e6b]/10"
              />
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-xl border border-[#ead694] bg-[#fff9e0] px-4 py-2.5 text-sm font-bold text-[#6b4d00]">
                {filteredSessions.length} classes found
              </span>
              <button
                type="button"
                onClick={() => setShowFilters((v) => !v)}
                className="inline-flex h-12 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold text-[#1b2e6b] shadow-sm lg:hidden"
              >
                <Filter size={18} /> Filters
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[280px_minmax(0,1fr)] xl:grid-cols-[300px_minmax(0,1fr)]">
            {/* Sidebar filters */}
            <aside
              className={`rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:sticky lg:top-24 lg:block lg:h-max ${showFilters ? "block" : "hidden"}`}
            >
              <div className="mb-5 flex items-center gap-2 font-rajdhani text-xl font-bold text-[#1b2e6b]">
                <Filter size={20} className="text-[#e8a800]" /> Filters
              </div>
              <FilterGroup title="Status" options={filters.status} value={status} onChange={setStatus} />
              <FilterGroup title="Subject" options={filters.subject} value={subject} onChange={setSubject} />
              <FilterGroup title="Class Type" options={filters.type} value={type} onChange={setType} />
              <button
                type="button"
                onClick={clearFilters}
                className="mt-5 h-11 w-full rounded-xl border-2 border-[#1b2e6b] bg-white text-sm font-bold text-[#1b2e6b] transition hover:bg-[#1b2e6b] hover:text-white"
              >
                Clear Filters
              </button>
            </aside>

            {/* Cards grid */}
            <div>
              {loadError ? (
                <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                  {loadError}
                </div>
              ) : null}
              {loading ? (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-[300px] animate-pulse rounded-xl bg-slate-200" />
                  ))}
                </div>
              ) : filteredSessions.length ? (
                <div className="grid gap-8">
                  {groupedSessions.map(([dateLabel, sessions]) => (
                    <div key={dateLabel}>
                      <div className="mb-4 flex items-center gap-2">
                        <CalendarDays size={18} className="text-[#e8a800]" />
                        <h2 className="text-sm font-extrabold uppercase tracking-[0.14em] text-[#8a6500]">{dateLabel}</h2>
                      </div>
                      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {sessions.map((session) => (
                          <article
                            key={`${session.source}-${session.course.id}-${session.id}`}
                            className="group flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-[#1b2e6b]/25 hover:shadow-md"
                          >
                            <Link href={`/live-classes/course/${session.course.slug}`} className="block">
                              <SessionThumb session={session} />
                            </Link>
                            <div className="flex flex-1 flex-col p-4">
                              <div className="flex flex-wrap items-start justify-between gap-2">
                                <Link href={`/live-classes/course/${session.course.slug}`}>
                                  <h2 className="font-rajdhani text-base font-bold leading-snug text-[#1b2e6b] transition group-hover:text-[#0f1e4a]">
                                    {session.title}
                                  </h2>
                                </Link>
                                <span
                                  className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-extrabold uppercase ${
                                    session.course.is_free
                                      ? "bg-emerald-100 text-emerald-800"
                                      : "bg-[#1b2e6b] text-[#f5c518]"
                                  }`}
                                >
                                  {session.course.is_free ? "Free" : `₹${session.course.effective_price}`}
                                </span>
                              </div>
                              <p className="mt-1.5 text-xs font-medium leading-5 text-slate-600">
                                {session.faculty_name || session.course.exam_type || "KR Logics Faculty"}
                              </p>
                              <p className="mt-1 text-xs font-semibold text-[#b78600]">
                                {formatLiveSessionSchedule(session.scheduled_at)}
                              </p>

                              <div className="mt-3 flex flex-wrap gap-1.5">
                                <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-1 text-[10px] font-bold text-slate-700">
                                  <Clock3 size={11} /> {session.duration_minutes} min
                                </span>
                                <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-1 text-[10px] font-bold text-slate-700">
                                  <Video size={11} /> {(session.course.subject || "General").toUpperCase()}
                                </span>
                              </div>

                              <div className="mt-auto border-t border-slate-100 pt-3">
                                <LiveClassActionButton session={session} onAccessChange={loadSessions} className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-[#1b2e6b] text-xs font-bold text-[#f5c518] shadow-sm transition hover:bg-[#0f1e4a] disabled:opacity-70" />
                              </div>
                            </div>
                          </article>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-[#c7b26b] bg-[#fffdf3] px-6 py-16 text-center">
                  <p className="font-rajdhani text-2xl font-bold text-[#6b4d00]">No live classes found</p>
                  <p className="mt-2 text-sm font-medium text-slate-600">Try changing filters or check back later.</p>
                </div>
              )}

              {/* Info strip */}
              <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {[
                  { icon: Bell, title: "Zoom Live Join", text: "One-click join after login and access verification." },
                  { icon: MonitorPlay, title: "Auto Recording", text: "Cloud recordings sync when the Zoom session ends." },
                  { icon: CheckCircle2, title: "Free & Paid Access", text: "Free courses after login. Paid courses after purchase." },
                ].map(({ icon: Icon, title, text }) => (
                  <div key={title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <Icon className="size-6 text-[#e8a800]" />
                    <h3 className="mt-3 font-rajdhani text-lg font-bold text-[#1b2e6b]">{title}</h3>
                    <p className="mt-2 text-sm leading-7 text-slate-600">{text}</p>
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
    <div className="border-t border-slate-100 py-4 first:border-t-0 first:pt-0">
      <h3 className="mb-3 text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#b78600]">{title}</h3>
      <div className="grid gap-2">
        {options.map(([optionValue, label]) => (
          <button
            key={optionValue}
            type="button"
            onClick={() => onChange(optionValue)}
            className={`h-10 rounded-lg px-3 text-left text-sm font-bold transition ${
              value === optionValue
                ? "bg-[#1b2e6b] text-[#f5c518]"
                : "bg-slate-50 text-slate-700 hover:bg-slate-100"
            }`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
