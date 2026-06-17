"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  Clock3,
  IndianRupee,
  PlayCircle,
  Video,
} from "lucide-react";
import { PublicPageShell } from "@/components/PublicPageShell";
import { LiveClassActionButton } from "@/components/live-classes/LiveClassActionButton";
import {
  fetchLiveCourseDetail,
  formatLiveSessionDateKey,
  formatLiveSessionSchedule,
  type LiveClassSessionItem,
  type LiveCourseDetail,
} from "@/lib/live-classes";
import { getStudentSession } from "@/lib/student-auth";

function groupSessionsByDate(sessions: LiveClassSessionItem[]) {
  const groups = new Map<string, LiveClassSessionItem[]>();
  for (const session of sessions) {
    const key = formatLiveSessionDateKey(session.scheduled_at);
    const bucket = groups.get(key) || [];
    bucket.push(session);
    groups.set(key, bucket);
  }
  return Array.from(groups.entries());
}

export default function LiveCourseDetailPage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;
  const [detail, setDetail] = useState<LiveCourseDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDetail = useCallback(() => {
    if (!slug) return;
    setLoading(true);
    setError("");
    const email = getStudentSession()?.email;
    fetchLiveCourseDetail(slug, email)
      .then((payload) => {
        if (!payload) throw new Error("Live class plan not found.");
        setDetail(payload);
      })
      .catch(() => {
        setDetail(null);
        setError("Unable to load live class details.");
      })
      .finally(() => setLoading(false));
  }, [slug]);

  useEffect(() => {
    loadDetail();
  }, [loadDetail]);

  const course = detail?.course;
  const priceLabel = course?.is_free ? "Free" : `₹${course?.effective_price.toLocaleString("en-IN")}`;

  return (
    <PublicPageShell active="live-classes">
      <section className="border-b border-[#ded9c8] bg-[#f7f6ef] px-4 py-8 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-6xl">
          <Link href="/courses?type=video" className="inline-flex items-center gap-2 text-sm font-bold text-[#1b2e6b]">
            <ArrowLeft size={16} /> Back to video courses
          </Link>

          {loading ? (
            <div className="mt-8 h-56 animate-pulse rounded-2xl bg-slate-200" />
          ) : error || !course ? (
            <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-semibold text-red-700">
              {error || "Live class plan not found."}
            </div>
          ) : (
            <div className="mt-8 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
              <div>
                {course.image_url ? (
                  <div className="mb-6 overflow-hidden rounded-2xl border border-[#ded9c8] bg-white shadow-sm">
                    <img src={course.image_url} alt={course.title} className="h-56 w-full object-cover sm:h-64" />
                  </div>
                ) : null}
                <span className="inline-flex rounded-full bg-[#fff8dc] px-3 py-1 text-xs font-extrabold uppercase tracking-wide text-[#8a6500]">
                  Live Class Plan
                </span>
                <h1 className="mt-4 font-rajdhani text-3xl font-bold text-[#1b2e6b] sm:text-4xl">{course.title}</h1>
                <p className="mt-4 text-base leading-8 text-slate-600">
                  {course.description || course.short_description || "Expert-led live banking classes with recordings after each session."}
                </p>
                <div className="mt-6 flex flex-wrap gap-3 text-sm font-semibold text-slate-700">
                  {course.category ? <span className="rounded-full bg-white px-3 py-1.5 ring-1 ring-slate-200">{course.category}</span> : null}
                  {course.exam_type ? <span className="rounded-full bg-white px-3 py-1.5 ring-1 ring-slate-200">{course.exam_type}</span> : null}
                  <span className="rounded-full bg-white px-3 py-1.5 ring-1 ring-slate-200">{course.duration_hours || 0}+ hours</span>
                </div>
              </div>

              <aside className="rounded-2xl border border-[#ead694] bg-white p-6 shadow-[0_18px_50px_rgba(95,71,0,0.08)]">
                <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#b78600]">Plan Price</p>
                <div className="mt-2 flex items-end gap-2">
                  <IndianRupee className="mb-1 size-5 text-[#1b2e6b]" />
                  <span className="font-rajdhani text-4xl font-bold text-[#1b2e6b]">{priceLabel}</span>
                </div>
                {course.sale_price !== null && course.sale_price < course.price ? (
                  <p className="mt-2 text-sm font-semibold text-slate-500 line-through">₹{course.price.toLocaleString("en-IN")}</p>
                ) : null}

                <div className="mt-6 rounded-xl bg-[#f8fafc] p-4 text-sm font-semibold leading-7 text-slate-600">
                  {detail.access.allowed
                    ? "Your plan includes this live class. All available recordings are listed below."
                    : detail.access.requires_login
                      ? "Login to check if this live class is included in your plan."
                      : "Purchase this plan to unlock live sessions and recordings."}
                </div>

                {!detail.access.allowed ? (
                  <Link
                    href={`/courses/${course.slug}`}
                    className="mt-5 inline-flex h-12 w-full items-center justify-center rounded-xl bg-[#1b2e6b] text-sm font-bold text-[#f5c518]"
                  >
                    View Purchase Options
                  </Link>
                ) : null}
              </aside>
            </div>
          )}
        </div>
      </section>

      {!loading && detail ? (
        <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-10">
          {detail.access.allowed && detail.recordings.length > 0 ? (
            <div className="mb-10">
              <h2 className="font-rajdhani text-2xl font-bold text-[#1b2e6b]">Your Recordings</h2>
              <p className="mt-2 text-sm font-medium text-slate-600">All recordings available under your current plan.</p>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                {detail.recordings.map((session) => (
                  <article key={session.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                    <p className="font-bold text-[#1b2e6b]">{session.title}</p>
                    <p className="mt-1 text-xs font-semibold text-[#b78600]">{formatLiveSessionSchedule(session.scheduled_at)}</p>
                    <div className="mt-4">
                      <LiveClassActionButton session={session} onAccessChange={loadDetail} />
                    </div>
                  </article>
                ))}
              </div>
            </div>
          ) : null}

          <div>
            <h2 className="font-rajdhani text-2xl font-bold text-[#1b2e6b]">Class Schedule</h2>
            <p className="mt-2 text-sm font-medium text-slate-600">Sessions grouped date-wise for this live class plan.</p>

            <div className="mt-6 grid gap-6">
              {groupSessionsByDate(detail.sessions).map(([dateLabel, sessions]) => (
                <div key={dateLabel}>
                  <div className="mb-3 flex items-center gap-2">
                    <CalendarDays size={18} className="text-[#e8a800]" />
                    <h3 className="text-sm font-extrabold uppercase tracking-[0.14em] text-[#8a6500]">{dateLabel}</h3>
                  </div>
                  <div className="grid gap-3">
                    {sessions.map((session) => (
                      <article key={`${session.id}-${session.title}`} className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="font-bold text-[#1b2e6b]">{session.title}</p>
                          <p className="mt-1 text-sm text-slate-600">{session.faculty_name || course?.title}</p>
                          <div className="mt-2 flex flex-wrap gap-2 text-xs font-bold text-slate-600">
                            <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1">
                              <Clock3 size={12} /> {session.duration_minutes} min
                            </span>
                            <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1">
                              <Video size={12} /> {session.display_status}
                            </span>
                          </div>
                        </div>
                        <div className="w-full sm:w-44">
                          <LiveClassActionButton session={session} onAccessChange={loadDetail} />
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </PublicPageShell>
  );
}
