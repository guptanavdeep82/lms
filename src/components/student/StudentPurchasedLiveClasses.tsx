"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Loader2, Radio, Video } from "lucide-react";
import { LiveSessionPromoCard } from "@/components/courses/LiveSessionPromoCard";
import { fetchStudentLibrary } from "@/lib/packages";
import { fetchLiveSessions, type LiveClassSessionItem } from "@/lib/live-classes";
import { getStudentSession } from "@/lib/student-auth";

type StudentPurchasedLiveClassesProps = {
  compact?: boolean;
};

function isPurchasedSession(session: LiveClassSessionItem, purchasedCourseIds: Set<number>) {
  return purchasedCourseIds.has(session.course.id);
}

export function StudentPurchasedLiveClasses({ compact = false }: StudentPurchasedLiveClassesProps) {
  const [sessions, setSessions] = useState<LiveClassSessionItem[]>([]);
  const [loading, setLoading] = useState(true);

  const loadSessions = useCallback(() => {
    const student = getStudentSession();
    if (!student?.email) {
      setSessions([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    Promise.all([fetchLiveSessions(student.email), fetchStudentLibrary(student.email)])
      .then(([allSessions, library]) => {
        const purchasedIds = new Set((library?.courses || []).map((course) => course.id));
        const liveCourses = (library?.courses || []).filter(
          (course) => course.course_type === "live" || course.has_live_classes,
        );

        const ownedSessions = allSessions.filter(
          (session) => session.source === "session" && isPurchasedSession(session, purchasedIds),
        );

        const courseFallbacks = allSessions.filter(
          (session) =>
            session.source === "course"
            && purchasedIds.has(session.course.id)
            && liveCourses.some((course) => course.id === session.course.id),
        );

        setSessions([...ownedSessions, ...courseFallbacks]);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    loadSessions();
  }, [loadSessions]);

  const { liveNow, upcoming, replays } = useMemo(() => {
    const liveNow = sessions.filter((session) => session.display_status === "live");
    const upcoming = sessions.filter((session) => session.display_status === "scheduled");
    const replays = sessions.filter(
      (session) => session.display_status === "replay" || session.has_recording,
    );
    return { liveNow, upcoming, replays };
  }, [sessions]);

  const visibleSessions = compact
    ? [...liveNow, ...upcoming].slice(0, 3)
    : [...liveNow, ...upcoming, ...replays];

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-sm font-semibold text-[#667085]">
        <Loader2 className="size-4 animate-spin" /> Loading live classes...
      </div>
    );
  }

  if (!visibleSessions.length) {
    return (
      <div className="rounded-[20px] border border-dashed border-[#dfe5ef] bg-[#f8fafc] p-6 text-center">
        <Video className="mx-auto size-8 text-[#0957D3]/50" />
        <p className="mt-3 text-sm font-bold text-[#667085]">No live classes scheduled for your purchased courses yet.</p>
        <Link
          href="/live-classes"
          className="mt-4 inline-flex h-10 items-center rounded-xl bg-[#172a69] px-4 text-xs font-extrabold text-white"
        >
          Browse Live Classes
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {!compact && liveNow.length ? (
        <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-bold text-red-700">
          <Radio className="size-4 animate-pulse" />
          {liveNow.length} class{liveNow.length === 1 ? "" : "es"} live now — join from below
        </div>
      ) : null}

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {visibleSessions.map((session) => (
          <LiveSessionPromoCard
            key={`${session.source}-${session.id}-${session.course.id}`}
            session={session}
            onAccessChange={loadSessions}
          />
        ))}
      </div>

      {compact && sessions.length > visibleSessions.length ? (
        <Link href="/student/live-classes" className="inline-flex text-sm font-bold text-[#172a69] hover:underline">
          View all live classes →
        </Link>
      ) : null}
    </div>
  );
}
