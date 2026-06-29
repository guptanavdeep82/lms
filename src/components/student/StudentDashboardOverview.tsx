"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, CheckCircle2, Loader2, Megaphone, PlayCircle, Radio } from "lucide-react";
import { getStudentSession } from "@/lib/student-auth";
import { StudentPurchasedLiveClasses } from "@/components/student/StudentPurchasedLiveClasses";
import { fetchStudentLibraryData, fetchStudentProfile, fetchTestAttempts } from "@/lib/student-dashboard";

const tickerMessages = [
  "New SBI PO full mock test is live now",
  "Reasoning live class starts today at 7:00 PM",
  "Your Quant assignment deadline is tomorrow",
  "RBI Grade B current affairs PDF has been added",
];

export function StudentDashboardOverview() {
  const [loading, setLoading] = useState(true);
  const [displayName, setDisplayName] = useState("Student");
  const [metrics, setMetrics] = useState({ courses: 0, tests: 0, orders: 0 });

  useEffect(() => {
    const session = getStudentSession();
    if (!session?.email) {
      setLoading(false);
      return;
    }

    setDisplayName(session.name || "Student");

    Promise.all([
      fetchStudentProfile(session.email),
      fetchStudentLibraryData(session.email),
      fetchTestAttempts(session.email, "daily_practice"),
      fetchTestAttempts(session.email, "mock_test"),
    ])
      .then(([profile, library, daily, mock]) => {
        if (profile?.name) setDisplayName(profile.name);
        setMetrics({
          courses: library?.stats.courses_count ?? 0,
          tests: daily.length + mock.length,
          orders: library?.stats.orders_count ?? 0,
        });
      })
      .finally(() => setLoading(false));
  }, []);

  const firstName = useMemo(() => displayName.split(" ")[0], [displayName]);

  if (loading) {
    return (
      <div className="grid min-h-[50vh] place-items-center">
        <Loader2 className="animate-spin text-[#172a69]" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-[22px] border border-[#dfe5ef] bg-white shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
        <div className="flex items-center gap-3 border-b border-[#edf1f7] bg-[#172a69] px-5 py-3 text-white">
          <Megaphone size={18} className="text-[#f5c518]" />
          <div className="relative flex-1 overflow-hidden whitespace-nowrap">
            <div className="inline-flex min-w-max gap-10 text-xs font-semibold sm:text-sm" style={{ animation: "krTicker 26s linear infinite" }}>
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

      <style>{`@keyframes krTicker { from { transform: translateX(0); } to { transform: translateX(-50%); } }`}</style>

      <section className="grid gap-5 xl:grid-cols-[1fr_320px]">
        <div className="relative overflow-hidden rounded-[28px] bg-[#172a69] p-6 text-white shadow-[0_22px_60px_rgba(23,42,105,0.22)] sm:p-8">
          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#f5c518]/18" />
          <div className="relative z-10 max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-[#f7d85a] ring-1 ring-white/15">
              <CheckCircle2 size={14} /> Active Student
            </span>
            <h1 className="mt-5 text-[22px] font-extrabold leading-tight tracking-[-0.04em] sm:text-[26px]">
              Welcome back, {firstName}
            </h1>
            <p className="mt-3 max-w-xl text-[13px] leading-6 text-white/72 sm:text-sm">
              Today&apos;s goal: complete 2 classes, attempt one mini mock, and finish your current affairs revision.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/student/courses" className="inline-flex h-10 items-center gap-2 rounded-2xl bg-[#f5c518] px-4 text-xs font-extrabold text-[#172a69] shadow-lg shadow-black/10 transition hover:bg-[#ffd844] sm:text-sm">
                Continue Learning <ArrowRight size={16} />
              </Link>
              <Link href="/student/live-classes" className="inline-flex h-10 items-center gap-2 rounded-2xl bg-[#0957D3] px-4 text-xs font-bold text-white ring-1 ring-white/20 transition hover:brightness-110 sm:text-sm">
                Join Live Class <Radio size={16} />
              </Link>
              <Link href="/student/mock-tests" className="inline-flex h-10 items-center gap-2 rounded-2xl bg-white/10 px-4 text-xs font-bold text-white ring-1 ring-white/20 transition hover:bg-white/15 sm:text-sm">
                Start Mock Test <PlayCircle size={16} />
              </Link>
            </div>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
          {[
            ["Courses", metrics.courses, "/student/courses"],
            ["Tests Taken", metrics.tests, "/student/test-results"],
            ["Orders", metrics.orders, "/student/orders"],
          ].map(([label, value, href]) => (
            <Link key={label as string} href={href as string} className="rounded-[22px] border border-[#dfe5ef] bg-white p-4 shadow-sm transition hover:border-[#c7d2fe]">
              <p className="text-xs font-bold text-[#7d8799] sm:text-sm">{label}</p>
              <p className="mt-2 text-2xl font-extrabold text-[#172a69]">{value}</p>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#7d8799]">Live Classes</p>
            <h2 className="text-lg font-extrabold text-[#172a69]">Join your scheduled sessions</h2>
          </div>
          <Link href="/student/live-classes" className="text-sm font-bold text-[#0957D3] hover:underline">
            View all
          </Link>
        </div>
        <StudentPurchasedLiveClasses compact />
      </section>
    </div>
  );
}
