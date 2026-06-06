"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, BarChart3, CheckCircle2, Loader2, RotateCcw, Trophy } from "lucide-react";
import { getMockResult, type MockResult } from "@/lib/mock-results";
import { isStudentLoggedIn } from "@/lib/student-auth";
import { mockTestsApiUrl, type MockTestDetailResponse } from "@/lib/mock-tests";

export default function MockResultPage() {
  const router = useRouter();
  const params = useParams<{ slug: string }>();
  const slug = params.slug;
  const [result, setResult] = useState<MockResult | null>(null);
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
      .then((payload: MockTestDetailResponse) => {
        setCategorySlug(payload.test.category_slug);
        setResult(getMockResult(slug));
      })
      .finally(() => setLoading(false));
  }, [router, slug]);

  if (loading) {
    return <main className="grid min-h-screen place-items-center bg-[#f7f7f7]"><Loader2 className="animate-spin text-black" size={34} /></main>;
  }

  if (!result) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#f7f7f7] px-4 text-center text-black">
        <div className="max-w-md rounded-lg border border-[#e5e5e5] bg-white p-8 shadow-[0_12px_34px_rgba(0,0,0,0.08)]">
          <BarChart3 className="mx-auto text-[#d6a900]" size={42} />
          <h1 className="mt-4 text-2xl font-extrabold">Result not available</h1>
          <p className="mt-2 text-sm font-semibold leading-6 text-[#69707d]">Pehle mock test complete karein, phir result yahan show hoga.</p>
          <Link href={`/student/mock-tests/${slug}/instructions`} className="mt-5 inline-flex h-11 items-center rounded-full bg-black px-5 text-sm font-extrabold text-white">
            Start Mock Test
          </Link>
        </div>
      </main>
    );
  }

  const percentage = result.total ? Math.round((result.correct / result.total) * 100) : 0;

  return (
    <main className="min-h-screen bg-[#f7f7f7] px-4 py-8 text-black sm:px-6 lg:px-8" style={{ fontFamily: "'Plus Jakarta Sans', Inter, ui-sans-serif, system-ui, sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');`}</style>
      <section className="mx-auto max-w-4xl rounded-lg border border-[#e5e5e5] bg-white p-6 shadow-[0_16px_46px_rgba(0,0,0,0.08)] sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#8a6500]">Mock Test Result</p>
            <h1 className="mt-2 text-3xl font-extrabold tracking-[-0.04em]">{result.testTitle}</h1>
            <p className="mt-2 text-sm font-semibold text-[#69707d]">Submitted on {new Date(result.submittedAt).toLocaleString()}</p>
          </div>
          <div className="grid h-20 w-20 place-items-center rounded-full bg-[#d6a900] text-black">
            <Trophy size={34} />
          </div>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-4">
          <ResultCard label="Score" value={String(result.score)} />
          <ResultCard label="Correct" value={`${result.correct}/${result.total}`} />
          <ResultCard label="Answered" value={`${result.answered}/${result.total}`} />
          <ResultCard label="Accuracy" value={`${percentage}%`} />
        </div>

        <div className="mt-8 rounded-lg bg-[#fafafa] p-5">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="mt-1 text-[#16a34a]" size={20} />
            <p className="text-sm font-semibold leading-7 text-[#454b55]">
              Result local student session me save ho gaya hai. Series page par ye mock test ab “View Results” button ke saath show hoga.
            </p>
          </div>
        </div>

        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <Link href={categorySlug ? `/mock-tests/${categorySlug}` : "/mock-tests"} className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-[#d6d6d6] bg-white px-5 text-sm font-extrabold text-black">
            <ArrowLeft size={16} /> Back to Series
          </Link>
          <Link href={`/student/mock-tests/${slug}/instructions`} className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-black px-5 text-sm font-extrabold text-white">
            <RotateCcw size={16} /> Retake Test
          </Link>
        </div>
      </section>
    </main>
  );
}

function ResultCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-[#e7e7e7] bg-white p-5 text-center shadow-sm">
      <strong className="block text-2xl font-extrabold text-black">{value}</strong>
      <span className="mt-1 block text-xs font-extrabold uppercase tracking-[0.14em] text-[#7a7f89]">{label}</span>
    </div>
  );
}
