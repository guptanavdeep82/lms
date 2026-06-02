"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { ChevronRight, Clock3, Expand, HelpCircle, Loader2, Pause, Play, UserRound, X } from "lucide-react";
import { saveMockResult } from "@/lib/mock-results";
import { getStudentSession, isStudentLoggedIn } from "@/lib/student-auth";
import { mockTestsApiUrl, type MockQuestion, type MockTestDetailResponse } from "@/lib/mock-tests";

export default function DynamicMockExamPage() {
  const router = useRouter();
  const params = useParams<{ slug: string }>();
  const slug = params.slug;
  const [data, setData] = useState<MockTestDetailResponse | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [validationMessage, setValidationMessage] = useState("");
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const student = getStudentSession();

  useEffect(() => {
    const target = `/student/mock-tests/${slug}/exam`;
    if (!isStudentLoggedIn()) {
      router.replace(`/login?redirect=${encodeURIComponent(target)}`);
      return;
    }

    const params = new URLSearchParams(window.location.search);
    if (params.get("examWindow") !== "1" && window.name !== "mockExamWindow") {
      window.location.replace(`${window.location.pathname}?examWindow=1`);
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
        setRemainingSeconds(payload.test.duration_minutes * 60);
      });
  }, [router, slug]);

  const questions = data?.questions ?? [];
  const question = questions[currentIndex];
  const answeredCount = useMemo(() => Object.keys(answers).length, [answers]);
  const test = data?.test;

  const submitTest = useCallback(() => {
    if (!data) return;

    const correct = questions.reduce((sum, item) => sum + (answers[item.id] === item.correct_answer ? 1 : 0), 0);
    const score = questions.reduce((sum, item) => {
      const answer = answers[item.id];
      if (!answer) return sum;
      if (answer === item.correct_answer) return sum + item.marks;
      return sum - item.negative_marks;
    }, 0);

    saveMockResult({
      slug,
      testTitle: data.test.title,
      total: questions.length,
      answered: answeredCount,
      correct,
      score,
      submittedAt: new Date().toISOString(),
    });

    router.push(`/student/mock-tests/${slug}/result`);
  }, [answeredCount, answers, data, questions, router, slug]);

  useEffect(() => {
    if (!data || isPaused || remainingSeconds <= 0) return;

    const timer = window.setInterval(() => {
      setRemainingSeconds((seconds) => Math.max(seconds - 1, 0));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [data, isPaused, remainingSeconds]);

  useEffect(() => {
    if (data && remainingSeconds === 0) {
      submitTest();
    }
  }, [data, remainingSeconds, submitTest]);

  const enterFullscreen = () => {
    document.documentElement.requestFullscreen?.().catch(() => undefined);
  };

  if (!data || !question || !test) {
    return <main className="grid min-h-screen place-items-center bg-white"><Loader2 className="animate-spin text-[#3378b9]" size={34} /></main>;
  }

  const goToNext = (allowSkip = false) => {
    if (!allowSkip && !answers[question.id]) {
      setValidationMessage("Please select an answer before moving next. Use Skip if you want to leave this question.");
      return;
    }

    setValidationMessage("");
    setCurrentIndex((index) => Math.min(index + 1, questions.length - 1));
  };

  const saveAndNext = () => goToNext(false);
  const skipAndNext = () => goToNext(true);

  const jumpToQuestion = (index: number) => {
    if (index > currentIndex && !answers[question.id]) {
      setValidationMessage("Please select an answer before moving next. Use Skip if you want to leave this question.");
      return;
    }

    setValidationMessage("");
    setCurrentIndex(index);
  };

  const clearResponse = () => {
    setValidationMessage("");
    setAnswers((previous) => {
      const next = { ...previous };
      delete next[question.id];
      return next;
    });
  };

  return (
    <main className="min-h-screen bg-white text-[#111827]" style={{ fontFamily: "Arial, Helvetica, sans-serif" }}>
      <header className="flex min-h-[50px] flex-wrap items-center justify-between gap-2 bg-[#3378b9] px-3 py-2 text-white sm:px-5">
        <div className="flex items-center gap-3">
          <Image src="/logics-logo.jpeg" alt="KR Logics logo" width={36} height={36} className="h-9 w-9 rounded-full border border-[#ffd21f] object-cover shadow-lg shadow-black/20" />
          <h1 className="text-[13px] font-medium sm:text-[14px]">{test.title}</h1>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex h-9 items-center rounded bg-white px-2 text-xs text-[#1f4f86] sm:text-sm">
            Time Left: <span className="ml-2 rounded bg-[#d8ebff] px-2 py-1 font-mono font-bold text-[#174b82]">{formatDuration(remainingSeconds)}</span>
          </div>
          <button onClick={() => setIsPaused((value) => !value)} className="flex h-9 min-w-[76px] items-center justify-center gap-1 rounded bg-white px-2 text-sm text-[#2768a5]">
            {isPaused ? <Play size={15} /> : <Pause size={15} />}{isPaused ? "Resume" : "Pause"}
          </button>
          <button onClick={enterFullscreen} className="grid h-9 w-9 place-items-center rounded bg-white text-[#2768a5]"><Expand size={17} /></button>
        </div>
      </header>

      <div className="grid min-h-[calc(100vh-50px)] lg:h-[calc(100vh-50px)] lg:grid-cols-[1fr_260px]">
        <section className="grid min-h-[calc(100vh-50px)] grid-rows-[auto_1fr_auto] overflow-hidden lg:min-h-0">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#cfd7df] bg-[#f6f6f6] px-2 py-2 text-sm">
            <span className="font-bold text-[#0f60b5] underline">{question.section_name}</span>
            <select className="rounded border border-[#111827] bg-white px-2 py-1 text-base">
              <option>English</option>
              <option>Hindi</option>
            </select>
          </div>

          <div className="grid grid-rows-[auto_1fr] overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#cfd7df] px-2 py-2 text-sm">
              <span>Q: {currentIndex + 1} / {questions.length}</span>
              <div className="flex flex-wrap items-center gap-2 sm:gap-5">
                <span className="rounded border border-[#cfd7df] px-3 py-1">Qn. Time : <Clock3 size={12} className="inline" /></span>
                <span><b>Marks :</b> <span className="text-[#00a651]">+{question.marks}</span> | <span className="text-[#ff3950]">-{question.negative_marks}</span></span>
              </div>
            </div>

            <div className="grid overflow-auto lg:grid-cols-2 lg:overflow-hidden">
              <div className="border-b border-[#cfd7df] p-3 text-[15px] leading-7 lg:overflow-y-auto lg:border-b-0 lg:border-r lg:text-[18px] lg:leading-8">
                <p className="mb-4 font-bold">{question.question_text}</p>
                {question.explanation && <p className="rounded-xl bg-[#f8fbff] p-4 text-sm text-[#667085]">Hint after submission: {question.explanation}</p>}
              </div>

              <div className="p-4 text-[15px] leading-7 lg:overflow-y-auto lg:text-[18px] lg:leading-8">
                <h2 className="mb-3 font-bold">Choose the correct answer.</h2>
                <div className="mt-4 space-y-4">
                  {(Object.entries(question.options) as Array<[keyof MockQuestion["options"], string | null]>).map(([key, option]) => (
                    option ? (
                      <label key={key} className="flex cursor-pointer items-center gap-3">
                        <input
                          type="radio"
                          name={`question-${question.id}`}
                          checked={answers[question.id] === key}
                          onChange={() => {
                            setValidationMessage("");
                            setAnswers((previous) => ({ ...previous, [question.id]: key }));
                          }}
                          className="h-5 w-5"
                        />
                        <span><b>{key}.</b> {option}</span>
                      </label>
                    ) : null
                  ))}
                </div>
              </div>
            </div>
          </div>

          <footer className="flex flex-col items-stretch justify-between gap-3 border-t border-[#cfd7df] bg-[#efefef] px-4 py-3 sm:flex-row sm:items-center">
            <div className="grid gap-3">
              {validationMessage && (
                <div className="rounded-lg border border-[#ffd4a3] bg-[#fff7ed] px-3 py-2 text-xs font-bold text-[#9a3412]">
                  {validationMessage}
                </div>
              )}
              <div className="flex flex-col gap-3 sm:flex-row sm:gap-5">
                <button onClick={saveAndNext} className="rounded-lg border border-[#8dc8ff] bg-[#cae7ff] px-4 py-2 text-sm">Mark for review &amp; next</button>
                <button onClick={clearResponse} className="rounded-lg border border-[#8dc8ff] bg-[#cae7ff] px-4 py-2 text-sm">Clear Response</button>
                <button onClick={skipAndNext} className="rounded-lg border border-[#b9bec8] bg-white px-4 py-2 text-sm font-bold text-[#344054]">Skip</button>
              </div>
            </div>
            <button onClick={saveAndNext} className="rounded-lg bg-[#2f78bf] px-5 py-2 text-center text-sm font-bold text-white shadow">
              Save &amp; Next
            </button>
          </footer>
        </section>

        <aside className="grid border-t border-[#cfd7df] bg-[#eef9ff] lg:grid-rows-[50px_88px_1fr_58px] lg:border-l lg:border-t-0">
          <div className="flex items-center gap-3 bg-[#dff5ff] px-4">
            <div className="grid h-10 w-10 place-items-center rounded-full bg-white text-[#607d8b]"><UserRound size={24} /></div>
            <span className="text-sm">{student?.name || "Student"}</span>
          </div>

          <div className="bg-[#f2f2f2] px-4 py-2 text-sm">
            <p className="mb-2 text-right">Time Left: <b className="ml-2 rounded bg-white px-2 py-1 font-mono">{formatDuration(remainingSeconds)}</b></p>
            <div className="grid grid-cols-1 gap-x-5 gap-y-2 text-xs sm:grid-cols-2">
              <span className="flex items-center gap-2"><b className="grid h-6 w-7 place-items-center rounded bg-[#6bbd21] text-white">{answeredCount}</b> Answered</span>
              <span className="flex items-center gap-2"><b className="grid h-6 w-7 place-items-center rounded bg-[#d83a0c] text-white">{questions.length - answeredCount}</b> Not Answered</span>
              <span className="flex items-center gap-2"><b className="grid h-6 w-7 place-items-center rounded bg-[#e8e8e8] text-[#111]">0</b> Not Visited</span>
              <span className="flex items-center gap-2"><b className="grid h-6 w-7 place-items-center rounded-full bg-[#7b4ea3] text-white">0</b> Review</span>
            </div>
          </div>

          <div className="overflow-y-auto p-4">
            <h3 className="mb-4 bg-[#e8e8e8] py-2 text-center text-sm font-bold">{question.section_name}</h3>
            <div className="grid grid-cols-5 gap-2 sm:grid-cols-7 lg:grid-cols-4 lg:gap-3">
              {questions.map((item, index) => (
                <button
                  key={item.id}
                  onClick={() => jumpToQuestion(index)}
                  className={`h-11 rounded border text-sm ${
                    index === currentIndex
                      ? "border-[#174b82] bg-[#3378b9] font-bold text-white"
                      : answers[item.id]
                        ? "border-[#1b7d31] bg-[#6bbd21] font-bold text-white"
                        : "border-[#9d9d9d] bg-gradient-to-b from-white to-[#d9d9d9] text-[#333]"
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
            <button className="absolute right-[252px] top-[386px] hidden h-14 w-7 place-items-center rounded-l bg-[#444] text-white xl:grid">
              <ChevronRight size={22} />
            </button>
          </div>

          <div className="flex items-center justify-center border-t border-[#cfd7df] bg-[#efefef] px-4">
            <button onClick={submitTest} className="h-10 w-full rounded bg-[#2f78bf] text-sm font-bold text-white shadow">Submit section</button>
          </div>
        </aside>
      </div>

      <div className="pointer-events-none absolute left-1/2 top-[45px] grid h-12 w-12 -translate-x-1/2 place-items-center rounded-full bg-[#3f3f3f] text-white">
        <X size={24} />
      </div>
      <div className="fixed bottom-4 right-4 hidden rounded-full bg-[#3378b9] p-3 text-white shadow-lg md:block">
        <HelpCircle size={20} />
      </div>
    </main>
  );
}

function formatDuration(totalSeconds: number) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return `${String(hours).padStart(2, "0")} : ${String(minutes).padStart(2, "0")} : ${String(seconds).padStart(2, "0")}`;
}
