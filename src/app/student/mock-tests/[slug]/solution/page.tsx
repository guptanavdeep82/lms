"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, ArrowRight, BarChart3, Bookmark, Clock3, Flag, Loader2 } from "lucide-react";
import {
  fetchMockAttemptBySlug,
  fetchMockAttemptDetail,
  formatMockClock,
  optionLabel,
  type MockAttemptDetail,
  type MockAttemptQuestion,
} from "@/lib/mock-attempt-analysis";
import { getMockResult } from "@/lib/mock-results";
import { getStudentSession, isStudentLoggedIn } from "@/lib/student-auth";

export default function MockSolutionPage() {
  const router = useRouter();
  const params = useParams<{ slug: string }>();
  const searchParams = useSearchParams();
  const slug = params.slug;
  const [detail, setDetail] = useState<MockAttemptDetail | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeSection, setActiveSection] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const student = getStudentSession();

  useEffect(() => {
    const target = `/student/mock-tests/${slug}/solution`;
    if (!isStudentLoggedIn()) {
      router.replace(`/login?redirect=${encodeURIComponent(target)}`);
      return;
    }

    const session = getStudentSession();
    if (!session?.email) return;

    const attemptId = searchParams.get("attempt") || getMockResult(slug)?.attemptId;
    const loader = attemptId
      ? fetchMockAttemptDetail(session.email, Number(attemptId))
      : fetchMockAttemptBySlug(session.email, slug);

    loader
      .then((payload) => {
        setDetail(payload);
        setActiveSection(payload.sections[0]?.section_name || payload.questions[0]?.section_name || "");
      })
      .catch(() => setError("Unable to load solutions. Please complete the test first."))
      .finally(() => setLoading(false));
  }, [router, searchParams, slug]);

  const sectionNames = useMemo(
    () => Array.from(new Set(detail?.questions.map((question) => question.section_name) ?? [])),
    [detail]
  );

  const sectionQuestions = useMemo(
    () => detail?.questions.filter((question) => question.section_name === activeSection) ?? [],
    [activeSection, detail]
  );

  const question = sectionQuestions[currentIndex] ?? detail?.questions[0];
  const attemptQuery = detail?.attempt.id ? `?attempt=${detail.attempt.id}` : "";
  const activeSectionSummary = detail?.sections.find((section) => section.section_name === activeSection);

  if (loading) {
    return <main className="grid min-h-screen place-items-center bg-white"><Loader2 className="animate-spin text-[#3378b9]" size={34} /></main>;
  }

  if (error || !detail || !question) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#eef3f8] px-4 text-center">
        <div className="max-w-md rounded-[24px] bg-white p-8 shadow-lg">
          <p className="text-sm font-bold text-[#667085]">{error || "Solutions not found."}</p>
          <Link href={`/student/mock-tests/${slug}/result`} className="mt-4 inline-flex h-11 items-center rounded-xl bg-[#3378b9] px-5 text-sm font-bold text-white">
            Back
          </Link>
        </div>
      </main>
    );
  }

  const paletteQuestions = detail.questions.filter((item) => item.section_name === activeSection);

  const goPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      return;
    }

    const sectionIndex = sectionNames.indexOf(activeSection);
    if (sectionIndex > 0) {
      const previousSection = sectionNames[sectionIndex - 1];
      const previousQuestions = detail.questions.filter((item) => item.section_name === previousSection);
      setActiveSection(previousSection);
      setCurrentIndex(Math.max(previousQuestions.length - 1, 0));
    }
  };

  const goNext = () => {
    if (currentIndex < sectionQuestions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      return;
    }

    const sectionIndex = sectionNames.indexOf(activeSection);
    if (sectionIndex < sectionNames.length - 1) {
      setActiveSection(sectionNames[sectionIndex + 1]);
      setCurrentIndex(0);
    }
  };

  const switchSection = (sectionName: string) => {
    setActiveSection(sectionName);
    setCurrentIndex(0);
  };

  return (
    <main className="min-h-screen bg-white text-[#111827]" style={{ fontFamily: "Arial, Helvetica, sans-serif" }}>
      <header className="bg-[#3378b9] text-white">
        <div className="flex min-h-[50px] flex-wrap items-center justify-between gap-2 px-3 py-2 sm:px-5">
          <div className="flex items-center gap-3">
            <Image src="/kr-logics-logo.png" alt="KR Logics logo" width={36} height={36} className="h-9 w-9 rounded-full border border-white/30 object-cover" />
            <h1 className="text-[13px] font-semibold sm:text-[14px]">SOLUTIONS: {detail.attempt.test_title}</h1>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Link href={`/student/mock-tests/${slug}/analysis${attemptQuery}`} className="rounded bg-white/15 px-3 py-1.5 text-xs font-bold">Analytics</Link>
            <Link href={`/student/mock-tests/${slug}/result${attemptQuery}`} className="rounded bg-white/15 px-3 py-1.5 text-xs font-bold">Results</Link>
            <span className="rounded bg-white/15 px-3 py-1.5 text-xs font-bold">{student?.name || "Student"}</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 border-t border-white/15 px-3 py-2 sm:px-5">
          {sectionNames.map((sectionName) => (
            <button
              key={sectionName}
              type="button"
              onClick={() => switchSection(sectionName)}
              className={`rounded px-3 py-1.5 text-xs font-bold ${activeSection === sectionName ? "bg-white text-[#3378b9]" : "bg-white/10 text-white"}`}
            >
              {sectionName}
            </button>
          ))}
        </div>
      </header>

      <div className="border-b border-[#cfd7df] bg-[#f6f6f6] px-3 py-2 text-sm">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="font-bold text-[#0f60b5]">Q: {question.question_number} / {detail.summary.total_questions}</span>
          <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm">
            <span>Level: {question.difficulty}</span>
            <span className="text-[#00a651]">+{question.marks}</span>
            <span className="text-[#ff3950]">-{question.negative_marks}</span>
            <span className="inline-flex items-center gap-1"><Clock3 size={14} /> {formatMockClock(question.time_spent_seconds)}</span>
            <Bookmark size={16} className="text-[#667085]" />
            <Flag size={16} className="text-[#ef4444]" />
          </div>
        </div>
      </div>

      <div className="grid min-h-[calc(100vh-140px)] lg:grid-cols-[1fr_280px]">
        <section className="grid grid-rows-[1fr_auto]">
          <div className="grid overflow-hidden lg:grid-cols-2">
            <div className="border-b border-[#cfd7df] p-4 text-[15px] leading-7 lg:border-b-0 lg:border-r lg:overflow-y-auto lg:text-[17px]">
              <p className="font-bold">{question.question_text}</p>
            </div>

            <div className="p-4 lg:overflow-y-auto">
              <div className="space-y-3">
                {(Object.keys(question.options) as Array<keyof MockAttemptQuestion["options"]>).map((key) => {
                  const option = question.options[key];
                  if (!option) return null;
                  const isCorrect = key === question.correct_answer;
                  const isSelected = key === question.selected_answer;

                  return (
                    <div
                      key={key}
                      className={`flex items-start gap-3 rounded-lg border px-3 py-2 ${
                        isCorrect
                          ? "border-[#16a34a] bg-[#ecfdf3]"
                          : isSelected
                            ? "border-[#ef4444] bg-[#fef2f2]"
                            : "border-[#d0d5dd] bg-white"
                      }`}
                    >
                      <span className={`mt-0.5 grid h-5 w-5 place-items-center rounded-full text-xs font-bold ${isCorrect ? "bg-[#16a34a] text-white" : isSelected ? "bg-[#ef4444] text-white" : "bg-[#eef2f7] text-[#475467]"}`}>
                        {isCorrect ? "✓" : isSelected ? "✕" : key}
                      </span>
                      <span className="text-sm leading-6">{optionLabel(key, question.options)}</span>
                    </div>
                  );
                })}
              </div>

              <div className="mt-5 rounded-xl border border-[#dbeafe] bg-[#eff6ff] p-4">
                <p className="text-sm font-extrabold text-[#1d4ed8]">Answer: {question.correct_answer}</p>
                {question.explanation ? (
                  <p className="mt-2 text-sm leading-6 text-[#344054]">{question.explanation}</p>
                ) : (
                  <p className="mt-2 text-sm leading-6 text-[#667085]">Explanation will be updated by admin soon.</p>
                )}
                {question.selected_answer ? (
                  <p className="mt-3 text-xs font-bold text-[#475467]">
                    Your answer: {question.selected_answer} · {question.is_correct ? "Correct" : "Incorrect"}
                  </p>
                ) : (
                  <p className="mt-3 text-xs font-bold text-[#475467]">Your answer: Not attempted</p>
                )}
              </div>
            </div>
          </div>

          <footer className="flex items-center justify-center gap-3 border-t border-[#cfd7df] bg-[#efefef] px-4 py-3">
            <button type="button" onClick={goPrevious} className="inline-flex h-10 items-center gap-2 rounded-lg border border-[#111827] bg-white px-5 text-sm font-bold">
              <ArrowLeft size={16} /> Previous
            </button>
            <button type="button" onClick={goNext} className="inline-flex h-10 items-center gap-2 rounded-lg border border-[#111827] bg-white px-5 text-sm font-bold">
              Next <ArrowRight size={16} />
            </button>
          </footer>
        </section>

        <aside className="border-t border-[#cfd7df] bg-[#eef9ff] lg:border-l lg:border-t-0">
          <div className="border-b border-[#cfd7df] px-4 py-3">
            <h3 className="text-sm font-extrabold text-[#172a69]">{activeSection}</h3>
            {activeSectionSummary ? (
              <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                <SummaryPill label="Mark" value={`${activeSectionSummary.score}/${activeSectionSummary.total_marks}`} />
                <SummaryPill label="Attempted" value={String(activeSectionSummary.attempted)} />
                <SummaryPill label="Correct" value={String(activeSectionSummary.correct)} />
                <SummaryPill label="Incorrect" value={String(activeSectionSummary.incorrect)} />
              </div>
            ) : null}
          </div>

          <div className="p-4">
            <div className="grid grid-cols-5 gap-2">
              {paletteQuestions.map((item) => {
                const paletteIndex = sectionQuestions.findIndex((row) => row.id === item.id);
                const statusClass =
                  item.status === "correct"
                    ? "border-[#16a34a] bg-[#6bbd21] text-white"
                    : item.status === "incorrect"
                      ? "border-[#ef4444] bg-[#f97316] text-white"
                      : item.status === "skipped"
                        ? "border-[#98a2b3] bg-[#e4e7ec] text-[#475467]"
                        : "border-[#9d9d9d] bg-white text-[#333]";

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setCurrentIndex(paletteIndex)}
                    className={`rounded border py-2 text-xs font-bold ${paletteIndex === currentIndex ? "ring-2 ring-[#3378b9]" : ""} ${statusClass}`}
                  >
                    <div>{item.question_number}</div>
                    <div className="text-[10px] font-normal opacity-90">{formatMockClock(item.time_spent_seconds)}</div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="border-t border-[#cfd7df] px-4 py-3">
            <Link href={`/student/mock-tests/${slug}/analysis${attemptQuery}`} className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-[#3378b9] text-sm font-bold text-white">
              <BarChart3 size={16} /> View Result Analysis
            </Link>
          </div>
        </aside>
      </div>
    </main>
  );
}

function SummaryPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-white px-2 py-2 ring-1 ring-[#dbe4f5]">
      <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#667085]">{label}</p>
      <p className="text-sm font-extrabold text-[#172a69]">{value}</p>
    </div>
  );
}
