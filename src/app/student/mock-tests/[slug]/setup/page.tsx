"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, CheckCircle2, Clock3, FileText, Globe2, Loader2, MonitorCheck, ShieldCheck, UserRound } from "lucide-react";
import { getStudentSession, isStudentLoggedIn } from "@/lib/student-auth";
import { mockTestsApiUrl, type MockTestDetailResponse } from "@/lib/mock-tests";

export default function DynamicMockSetupPage() {
  const router = useRouter();
  const params = useParams<{ slug: string }>();
  const slug = params.slug;
  const [data, setData] = useState<MockTestDetailResponse | null>(null);
  const student = getStudentSession();

  useEffect(() => {
    const target = `/student/mock-tests/${slug}/setup`;
    if (!isStudentLoggedIn()) {
      router.replace(`/login?redirect=${encodeURIComponent(target)}`);
      return;
    }

    fetch(mockTestsApiUrl(slug))
      .then((response) => response.json())
      .then((payload: MockTestDetailResponse) => {
        if (payload.test.is_locked) {
          router.replace(`/mock-tests/${payload.test.category_slug ?? ""}`);
          return;
        }

        setData(payload);
      });
  }, [router, slug]);

  if (!data) {
    return <main className="grid min-h-screen place-items-center bg-[#eef3f8]"><Loader2 className="animate-spin text-[#3378b9]" size={34} /></main>;
  }

  const test = data.test;

  const openExamWindow = () => {
    const examUrl = `/student/mock-tests/${slug}/exam?examWindow=1`;
    const popup = window.open(
      examUrl,
      "mockExamWindow",
      `popup=yes,fullscreen=yes,width=${window.screen.availWidth},height=${window.screen.availHeight},left=0,top=0,menubar=no,toolbar=no,location=no,status=no,scrollbars=yes,resizable=yes`
    );

    if (popup) {
      popup.focus();
      return;
    }

    router.push(examUrl);
  };

  return (
    <main className="min-h-screen bg-[#eef3f8] text-[#111827]" style={{ fontFamily: "'Plus Jakarta Sans', Inter, ui-sans-serif, system-ui, sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');`}</style>
      <header className="bg-[#3378b9] text-white shadow-sm">
        <div className="flex min-h-14 flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-5">
          <div className="flex items-center gap-3">
            <Image src="/kr-logics-logo.png" alt="KR Logics logo" width={36} height={36} className="h-9 w-9 rounded-full border border-[#0957D3] object-cover shadow-lg shadow-black/20" />
            <h1 className="text-[14px] font-semibold sm:text-[16px]">{test.title}</h1>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-xs font-bold sm:gap-3 sm:text-sm">
            <span className="rounded-lg bg-white/14 px-3 py-1.5">Language: English</span>
            <span className="rounded-lg bg-white/14 px-3 py-1.5">Time: {test.duration_minutes} min</span>
          </div>
        </div>
      </header>

      <section className="mx-auto grid min-h-[calc(100vh-56px)] max-w-6xl items-center gap-6 px-4 py-8 lg:grid-cols-[1fr_420px]">
        <div className="rounded-[24px] bg-white p-5 shadow-[0_20px_60px_rgba(15,23,42,0.09)] ring-1 ring-[#d9e2ee] sm:rounded-[28px] sm:p-7">
          <span className="inline-flex items-center gap-2 rounded-full bg-[#eaf3ff] px-3 py-1.5 text-xs font-extrabold uppercase tracking-[0.16em] text-[#2268aa]">
            <MonitorCheck size={15} /> Test Setup
          </span>
          <h2 className="mt-5 text-[24px] font-extrabold tracking-[-0.04em] text-[#172a69] sm:text-[28px]">Ready screen before exam starts</h2>

          <div className="mt-7 grid gap-4 sm:grid-cols-2">
            {[
              { label: "Total Questions", value: String(test.questions_count), icon: FileText },
              { label: "Duration", value: `${test.duration_minutes} min`, icon: Clock3 },
              { label: "Default Language", value: "English", icon: Globe2 },
              { label: "Candidate", value: student?.name || "Student", icon: UserRound },
            ].map((item) => (
              <div key={item.label} className="rounded-2xl bg-[#f7f9fd] p-5 ring-1 ring-[#e5eaf2]">
                <item.icon size={21} className="text-[#3378b9]" />
                <p className="mt-3 text-xs font-bold uppercase tracking-[0.12em] text-[#7d8799]">{item.label}</p>
                <p className="mt-1 text-xl font-extrabold text-[#172a69]">{item.value}</p>
              </div>
            ))}
          </div>

          <div className="mt-7 space-y-3">
            {["Browser fullscreen recommended before starting test.", "Question palette, timer and section controls will be visible during test.", "You can mark questions for review and change answers before submission.", "Your score and analysis will be generated after final submission."].map((check) => (
              <div key={check} className="flex items-center gap-3 rounded-2xl bg-white p-4 ring-1 ring-[#e5eaf2]">
                <CheckCircle2 size={18} className="text-[#21a366]" />
                <p className="text-sm font-semibold text-[#344054]">{check}</p>
              </div>
            ))}
          </div>
        </div>

        <aside className="rounded-[24px] bg-[#172a69] p-5 text-white shadow-[0_24px_70px_rgba(23,42,105,0.24)] sm:rounded-[28px] sm:p-7">
          <div className="grid h-14 w-14 place-items-center rounded-2xl bg-white/12 text-[#f5c518]">
            <ShieldCheck size={28} />
          </div>
          <h3 className="mt-5 text-xl font-extrabold tracking-[-0.03em]">Exam interface preview</h3>
          <div className="mt-6 rounded-2xl bg-white/8 p-4 ring-1 ring-white/10">
            <div className="flex items-center justify-between text-sm font-bold">
              <span>Timer</span>
              <span className="rounded-lg bg-white px-3 py-1 text-[#172a69]">{String(test.duration_minutes).padStart(2, "0")}:00</span>
            </div>
            <div className="mt-4 grid grid-cols-5 gap-2">
              {Array.from({ length: Math.min(test.questions_count || 10, 10) }, (_, index) => (
                <span key={index} className="grid h-9 place-items-center rounded-lg bg-white/16 text-xs font-extrabold">{index + 1}</span>
              ))}
            </div>
          </div>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Link href={`/student/mock-tests/${slug}/instructions`} className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-white/10 text-sm font-bold ring-1 ring-white/16">
              <ArrowLeft size={16} /> Back
            </Link>
            <button type="button" onClick={openExamWindow} className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-[#f5c518] text-sm font-extrabold text-[#172a69]">
              Next <ArrowRight size={16} />
            </button>
          </div>
        </aside>
      </section>
    </main>
  );
}
