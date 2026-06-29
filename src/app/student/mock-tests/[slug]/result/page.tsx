"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, BarChart3, BookOpenCheck, Loader2, RotateCcw } from "lucide-react";
import { getMockResult } from "@/lib/mock-results";
import { isStudentLoggedIn, getStudentSession } from "@/lib/student-auth";
import { mockTestsApiUrl, type MockTestDetailResponse } from "@/lib/mock-tests";

export default function MockResultPage() {
  const router = useRouter();
  const params = useParams<{ slug: string }>();
  const searchParams = useSearchParams();
  const slug = params.slug;
  const result = getMockResult(slug);
  const [categorySlug, setCategorySlug] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const target = `/student/mock-tests/${slug}/result`;
    if (!isStudentLoggedIn()) {
      router.replace(`/login?redirect=${encodeURIComponent(target)}`);
      return;
    }

    fetch(mockTestsApiUrl(slug))
      .then((response) => response.json())
      .then((payload: MockTestDetailResponse) => setCategorySlug(payload.test.category_slug))
      .finally(() => setLoading(false));
  }, [router, slug]);

  if (loading) {
    return <main className="grid min-h-screen place-items-center bg-[#eef3f8]"><Loader2 className="animate-spin text-[#3378b9]" size={34} /></main>;
  }

  if (!result) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#eef3f8] px-4 text-center">
        <div className="max-w-md rounded-[24px] border border-[#dfe5ef] bg-white p-8 shadow-[0_18px_50px_rgba(15,23,42,0.08)]">
          <BarChart3 className="mx-auto text-[#3378b9]" size={42} />
          <h1 className="mt-4 text-xl font-extrabold text-[#172a69]">Result not available</h1>
          <p className="mt-2 text-sm font-semibold leading-6 text-[#667085]">Complete the mock test first to view your result here.</p>
          <Link href={`/student/mock-tests/${slug}/instructions`} className="mock-exam-start-btn mt-5 inline-flex h-11 items-center rounded-xl px-5 text-sm font-extrabold">
            Start Mock Test
          </Link>
        </div>
      </main>
    );
  }

  const attemptQuery = searchParams.get("attempt") || result.attemptId?.toString() || "";
  const querySuffix = attemptQuery ? `?attempt=${attemptQuery}` : "";
  const accuracy = result.total ? Math.round((result.correct / result.total) * 100) : 0;

  return (
    <main className="min-h-screen bg-[#eef3f8] px-4 py-8" style={{ fontFamily: "'Plus Jakarta Sans', Inter, ui-sans-serif, system-ui, sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');`}</style>
      <section className="mx-auto max-w-4xl rounded-[28px] border border-[#dfe5ef] bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] sm:p-8">
        <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#3378b9]">Test Submitted</p>
        <h1 className="mt-2 text-2xl font-extrabold tracking-[-0.04em] text-[#172a69]">{result.testTitle}</h1>
        <p className="mt-2 text-sm font-semibold text-[#667085]">
          {getStudentSession()?.name || "Student"} · {new Date(result.submittedAt).toLocaleString()}
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-4">
          <MetricCard label="Score" value={`${result.score}/${result.total}`} tone="green" />
          <MetricCard label="Correct" value={`${result.correct}/${result.total}`} tone="blue" />
          <MetricCard label="Answered" value={`${result.answered}/${result.total}`} tone="pink" />
          <MetricCard label="Accuracy" value={`${accuracy}%`} tone="purple" />
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <Link
            href={`/student/mock-tests/${slug}/analysis${querySuffix}`}
            className="inline-flex h-14 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#d946ef] to-[#ec4899] text-base font-extrabold text-white shadow-lg shadow-fuchsia-200"
          >
            <BarChart3 size={20} /> Result
          </Link>
          <Link
            href={`/student/mock-tests/${slug}/solution${querySuffix}`}
            className="inline-flex h-14 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#6366f1] to-[#3378b9] text-base font-extrabold text-white shadow-lg shadow-blue-200"
          >
            <BookOpenCheck size={20} /> Solution
          </Link>
        </div>

        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <Link href={categorySlug ? `/mock-tests/${categorySlug}` : "/mock-tests"} className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-[#cdd6e2] bg-white px-5 text-sm font-bold text-[#172a69]">
            <ArrowLeft size={16} /> Back to Series
          </Link>
          <Link href={`/student/mock-tests/${slug}/instructions`} className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#3378b9] px-5 text-sm font-bold text-white">
            <RotateCcw size={16} /> Retake Test
          </Link>
        </div>
      </section>
    </main>
  );
}

function MetricCard({ label, value, tone }: { label: string; value: string; tone: "green" | "blue" | "pink" | "purple" }) {
  const tones = {
    green: "bg-[#ecfdf3] text-[#027a48]",
    blue: "bg-[#eff8ff] text-[#175cd3]",
    pink: "bg-[#fff1f3] text-[#c01048]",
    purple: "bg-[#f4f3ff] text-[#5925dc]",
  };

  return (
    <div className={`rounded-2xl p-5 text-center ${tones[tone]}`}>
      <strong className="block text-2xl font-extrabold">{value}</strong>
      <span className="mt-1 block text-xs font-extrabold uppercase tracking-[0.14em] opacity-80">{label}</span>
    </div>
  );
}
