"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { staticPush, staticReplace } from "@/lib/static-nav";
import { useLiveParam } from "@/lib/use-live-param";
import { ArrowLeft, ArrowRight, Award, CheckCircle2, Clock3, FileText, Loader2, MonitorCheck, ShieldCheck, UserRound } from "lucide-react";
import { getStudentSession, isStudentLoggedIn } from "@/lib/student-auth";
import {
  examTotalsFromDetail,
  MOCK_EXAM_MESSAGE_SOURCE,
  mockTestProgressUrl,
  mockTestResetProgressUrl,
  mockTestsApiUrl,
  sectionTotalMarks,
  type MockTestDetailResponse,
  type MockTestProgressResponse,
  type MockTestSection,
} from "@/lib/mock-tests";

export default function DynamicMockSetupPage() {
  const slug = useLiveParam("slug", 2);
  const [data, setData] = useState<MockTestDetailResponse | null>(null);
  const [resetting, setResetting] = useState(false);
  const student = getStudentSession();

  const applyProgress = useCallback((progress: MockTestProgressResponse) => {
    setData((previous) => {
      if (!previous) return previous;
      return {
        ...previous,
        sequential_sections: progress.sequential_sections,
        allow_section_retry: progress.allow_section_retry,
        has_in_progress: progress.has_in_progress,
        sections: progress.sections,
      };
    });
  }, []);

  const loadSetup = useCallback(async () => {
    const target = `/student/mock-tests/${slug}/setup`;
    if (!isStudentLoggedIn()) {
      staticReplace(`/login?redirect=${encodeURIComponent(target)}`);
      return;
    }

    const response = await fetch(mockTestsApiUrl(slug, student?.email), { cache: "no-store" });
    if (!response.ok) return;
    const payload = (await response.json()) as MockTestDetailResponse;
    if (payload.test.is_locked) {
      staticReplace(`/mock-tests/${payload.test.category_slug ?? ""}`);
      return;
    }
    setData(payload);
  }, [slug, student?.email]);

  const refreshProgress = useCallback(async () => {
    if (!student?.email) return;
    try {
      const response = await fetch(mockTestProgressUrl(slug, student.email), { cache: "no-store" });
      if (!response.ok) return;
      applyProgress((await response.json()) as MockTestProgressResponse);
    } catch {
      // Keep the last known setup state if a background refresh fails.
    }
  }, [applyProgress, slug, student?.email]);

  useEffect(() => {
    void loadSetup();
  }, [loadSetup]);

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      const payload = event.data as { source?: string; type?: string; slug?: string; sections?: MockTestSection[] } | null;
      if (payload?.source !== MOCK_EXAM_MESSAGE_SOURCE || payload.type !== "section-progress") return;
      if (payload.slug !== slug || !payload.sections) return;
      applyProgress({ sequential_sections: true, sections: payload.sections });
    };

    const onFocus = () => {
      void refreshProgress();
    };

    const onVisibility = () => {
      if (!document.hidden) {
        void refreshProgress();
      }
    };

    window.addEventListener("message", onMessage);
    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      window.removeEventListener("message", onMessage);
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [applyProgress, refreshProgress, slug]);

  if (!data) {
    return <main className="grid min-h-screen place-items-center bg-[#eef3f8]"><Loader2 className="animate-spin text-[#3378b9]" size={34} /></main>;
  }

  const test = data.test;
  const sections = data.sections ?? [];
  const usesSections = Boolean(data.sequential_sections && sections.length > 0);
  const allowSectionRetry = data.allow_section_retry ?? data.test.allow_section_retry ?? data.test.test_type !== "full_length";
  const allSectionsSubmitted = usesSections && sections.filter((section) => section.questions_count > 0).every((section) => section.status === "passed" || section.status === "completed");
  const totals = examTotalsFromDetail(data);
  const previewSection = sections.find((section) => section.status !== "locked") ?? sections[0];
  const previewDuration = previewSection?.duration_minutes || totals.duration_minutes;
  const previewQuestionCount = previewSection?.questions_count || totals.questions_count;

  const openExamWindow = (section?: MockTestSection) => {
    const sectionQuery = section ? `&section=${encodeURIComponent(section.slug)}` : "";
    const examUrl = `/student/mock-tests/${slug}/exam?examWindow=1${sectionQuery}`;
    const width = window.screen.availWidth;
    const height = window.screen.availHeight;
    const popup = window.open(
      examUrl,
      "mockExamWindow",
      `popup=yes,fullscreen=yes,width=${width},height=${height},left=0,top=0,menubar=no,toolbar=no,location=no,status=no,scrollbars=yes,resizable=yes`
    );

    if (popup) {
      try {
        popup.moveTo(0, 0);
        popup.resizeTo(width, height);
      } catch {
        // Some browsers block move/resize.
      }
      const enterFs = () => {
        void popup.document.documentElement.requestFullscreen?.().catch(() => undefined);
      };
      enterFs();
      popup.addEventListener("load", enterFs);
      popup.focus();
      return;
    }

    void document.documentElement.requestFullscreen?.().catch(() => undefined);
    staticPush(examUrl);
  };

  const reattemptFullMock = async () => {
    if (!student?.email || resetting) return;
    setResetting(true);
    try {
      const response = await fetch(mockTestResetProgressUrl(slug), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: student.email }),
      });
      if (response.ok) {
        const progress = (await response.json()) as MockTestProgressResponse;
        applyProgress(progress);
        const first = [...progress.sections].sort((a, b) => a.sort_order - b.sort_order)[0];
        openExamWindow(first);
        return;
      }
    } finally {
      setResetting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#eef3f8] pb-28 text-[#111827] lg:pb-8" style={{ fontFamily: "'Plus Jakarta Sans', Inter, ui-sans-serif, system-ui, sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');`}</style>
      <header className="bg-[#3378b9] text-white shadow-sm">
        <div className="flex min-h-14 flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-5">
          <div className="flex items-center gap-3">
            <Image src="/kr-logics-logo.png" alt="KR Logics logo" width={36} height={36} className="h-9 w-9 rounded-full border border-[#0957D3] object-cover shadow-lg shadow-black/20" />
            <h1 className="text-[14px] font-semibold sm:text-[16px]">{test.title}</h1>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-xs font-bold sm:gap-3 sm:text-sm">
            <span className="rounded-lg bg-white/14 px-3 py-1.5">Language: English</span>
            <span className="rounded-lg bg-white/14 px-3 py-1.5">Time: {totals.duration_minutes} min</span>
          </div>
        </div>
      </header>

      <section className="mx-auto grid max-w-6xl gap-6 px-4 py-8 lg:grid-cols-[1fr_420px] lg:items-start">
        <div className="rounded-[24px] bg-white p-5 shadow-[0_20px_60px_rgba(15,23,42,0.09)] ring-1 ring-[#d9e2ee] sm:rounded-[28px] sm:p-7">
          <span className="inline-flex items-center gap-2 rounded-full bg-[#eaf3ff] px-3 py-1.5 text-xs font-extrabold uppercase tracking-[0.16em] text-[#2268aa]">
            <MonitorCheck size={15} /> Test Setup
          </span>
          <h2 className="mt-5 text-[24px] font-extrabold tracking-[-0.04em] text-[#172a69] sm:text-[28px]">Ready screen before exam starts</h2>

          <div className="mt-7 grid gap-4 sm:grid-cols-2">
            {[
              { label: "Total Questions", value: String(totals.questions_count), icon: FileText },
              { label: "Duration", value: `${totals.duration_minutes} min`, icon: Clock3 },
              { label: "Total Marks", value: String(totals.total_marks), icon: Award },
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
            {usesSections ? (
              <>
                <p className="text-sm font-semibold text-[#344054]">
                  {allowSectionRetry
                    ? "This test has sequential sections. Submit a section to unlock the next one — even if you leave questions unattempted."
                    : "This is a full-length mock. Complete each section in order. After finishing, reattempt the complete mock from the beginning."}
                </p>
                {allSectionsSubmitted && !allowSectionRetry ? (
                  <button
                    type="button"
                    disabled={resetting}
                    onClick={() => void reattemptFullMock()}
                    className="inline-flex h-11 items-center justify-center rounded-xl bg-[#172a69] px-5 text-sm font-extrabold text-white disabled:opacity-60"
                  >
                    {resetting ? "Preparing..." : "Reattempt Full Mock"}
                  </button>
                ) : null}
                <div className="grid gap-3">
                  {sections.map((section) => {
                    const locked = section.status === "locked";
                    const passed = section.status === "passed";
                    const completed = section.status === "completed";
                    const hasQuestions = section.questions_count > 0;
                    const canOpen = !locked && hasQuestions && (allowSectionRetry || section.status === "available" || Boolean(section.in_progress));
                    const label = section.in_progress
                      ? "Resume Exam"
                      : passed || completed
                        ? allowSectionRetry
                          ? "Retry Exam"
                          : "Completed"
                        : "Start Exam";
                    return (
                      <div key={section.id} className="rounded-2xl border border-[#dfe5ef] bg-white p-4 ring-1 ring-[#e5eaf2]">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <div>
                            <p className="text-base font-extrabold text-[#172a69]">{section.sort_order}. {section.name}</p>
                            <p className="mt-1 text-xs font-semibold text-[#667085]">
                              {section.questions_count} questions · {sectionTotalMarks(section)} marks · {section.duration_minutes} min · Pass {section.passing_percentage}%
                            </p>
                            {!hasQuestions ? (
                              <p className="mt-1 text-xs font-bold text-[#b42318]">No questions added yet — contact admin</p>
                            ) : null}
                            {passed ? (
                              <p className="mt-1 text-xs font-bold text-[#15803d]">Passed · Best {section.best_percentage}%</p>
                            ) : completed ? (
                              <p className="mt-1 text-xs font-bold text-[#175cd3]">Submitted · Best {section.best_percentage}%</p>
                            ) : section.in_progress ? (
                              <p className="mt-1 text-xs font-bold text-[#b54708]">Paused — resume exactly where you left off</p>
                            ) : null}
                          </div>
                          <button
                            type="button"
                            disabled={!canOpen}
                            onClick={() => openExamWindow(section)}
                            className="inline-flex h-10 items-center rounded-xl bg-[#3378b9] px-4 text-xs font-extrabold text-white disabled:cursor-not-allowed disabled:opacity-45"
                          >
                            {locked ? "Locked" : !hasQuestions ? "Unavailable" : label}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            ) : (
              ["Browser fullscreen recommended before starting test.", "Question palette, timer and section controls will be visible during test.", "You can mark questions for review and change answers before submission.", "Your score and analysis will be generated after final submission."].map((check) => (
                <div key={check} className="flex items-center gap-3 rounded-2xl bg-white p-4 ring-1 ring-[#e5eaf2]">
                  <CheckCircle2 size={18} className="text-[#21a366]" />
                  <p className="text-sm font-semibold text-[#344054]">{check}</p>
                </div>
              ))
            )}
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
              <span className="rounded-lg bg-white px-3 py-1 text-[#172a69]">{String(previewDuration).padStart(2, "0")}:00</span>
            </div>
            <div className="mt-4 grid grid-cols-5 gap-2">
              {Array.from({ length: Math.min(previewQuestionCount || 10, 10) }, (_, index) => (
                <span key={index} className="grid h-9 place-items-center rounded-lg bg-white/16 text-xs font-extrabold">{index + 1}</span>
              ))}
            </div>
          </div>
          <div className="mt-7 hidden flex-col gap-3 lg:flex lg:flex-row">
            <Link href={`/student/mock-tests/${slug}/instructions`} className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-white/10 text-sm font-bold ring-1 ring-white/16">
              <ArrowLeft size={16} /> Back
            </Link>
            <button type="button" onClick={() => openExamWindow()} disabled={usesSections} className="mock-exam-start-btn inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-xl text-sm font-extrabold shadow-lg shadow-black/15 disabled:cursor-not-allowed disabled:opacity-50">
              {usesSections ? "Choose a Section" : "Start Exam"} <ArrowRight size={16} />
            </button>
          </div>
        </aside>
      </section>

      <footer className="fixed inset-x-0 bottom-0 z-40 border-t border-[#d8dee8] bg-white/95 px-4 py-3 shadow-[0_-12px_30px_rgba(15,23,42,0.08)] backdrop-blur lg:hidden">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 sm:flex-row">
          <Link href={`/student/mock-tests/${slug}/instructions`} className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-xl border border-[#cdd6e2] bg-white text-sm font-bold text-[#172a69]">
            <ArrowLeft size={16} /> Back
          </Link>
          <button type="button" onClick={() => openExamWindow()} disabled={usesSections} className="mock-exam-start-btn inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-xl text-sm font-extrabold shadow-lg shadow-amber-200/60 disabled:cursor-not-allowed disabled:opacity-50">
            {usesSections ? "Choose a Section Above" : "Start Exam"} <ArrowRight size={16} />
          </button>
        </div>
      </footer>
    </main>
  );
}
