"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { staticPush, staticReplace } from "@/lib/static-nav";
import { useLiveParam } from "@/lib/use-live-param";
import { ChevronRight, Clock3, Expand, HelpCircle, Loader2, Pause, Play, UserRound, X } from "lucide-react";
import { PaletteIcon, formatExamClock, formatMmSs } from "@/components/student/mock-exam-status";
import type { MockAttemptAnswerInput } from "@/lib/mock-attempt-analysis";
import { saveMockResult } from "@/lib/mock-results";
import { getStudentSession, isStudentLoggedIn } from "@/lib/student-auth";
import { mockTestsApiUrl, mockTestSectionExamUrl, mockExamSessionUrl, nextUnlockedSection, notifyMockExamOpener, toIdFlagMap, toIdNumberMap, toIdStringMap, type MockExamSession, type MockQuestion, type MockTestDetailResponse, type MockTestSection, type MockTestSectionExamResponse } from "@/lib/mock-tests";
import { decodeHtmlEntities } from "@/lib/html-entities";

export default function DynamicMockExamPage() {
  const slug = useLiveParam("slug", 2);
  const [data, setData] = useState<MockTestDetailResponse | null>(null);
  const [sectionMeta, setSectionMeta] = useState<MockTestSectionExamResponse["section"] | null>(null);
  const [activeSectionId, setActiveSectionId] = useState<number | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [questionTimes, setQuestionTimes] = useState<Record<number, number>>({});
  const [visited, setVisited] = useState<Record<number, boolean>>({});
  const [visitOrder, setVisitOrder] = useState<Record<number, number>>({});
  const [reviewMarked, setReviewMarked] = useState<Record<number, boolean>>({});
  const [validationMessage, setValidationMessage] = useState("");
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const [sectionDurationSeconds, setSectionDurationSeconds] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showSubmitSummary, setShowSubmitSummary] = useState(false);
  const [pendingNextSection, setPendingNextSection] = useState<MockTestSection | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [optionResetKey, setOptionResetKey] = useState(0);
  const [saveNotice, setSaveNotice] = useState("");
  const visitCounterRef = useRef(0);
  const questionStartedAtRef = useRef(Date.now());
  const persistTimerRef = useRef<number | null>(null);
  const examReadyRef = useRef(false);
  const student = getStudentSession();

  useEffect(() => {
    const target = `/student/mock-tests/${slug}/exam`;
    if (!isStudentLoggedIn()) {
      staticReplace(`/login?redirect=${encodeURIComponent(target)}`);
      return;
    }

    const params = new URLSearchParams(window.location.search);
    if (params.get("examWindow") !== "1" && window.name !== "mockExamWindow") {
      window.location.replace(`${window.location.pathname}?examWindow=1${params.get("section") ? `&section=${encodeURIComponent(params.get("section")!)}` : ""}`);
      return;
    }

    const sectionSlug = params.get("section");
    const email = student?.email;

    const restoreExamSession = (
      session: MockExamSession | null | undefined,
      fallbackSeconds: number,
      questionCount: number
    ) => {
      if (!session) {
        setRemainingSeconds(fallbackSeconds);
        setIsPaused(false);
        examReadyRef.current = true;
        return;
      }

      setCurrentIndex(Math.max(0, Math.min(session.current_index ?? 0, Math.max(questionCount - 1, 0))));
      setRemainingSeconds(session.remaining_seconds ?? fallbackSeconds);
      setIsPaused(Boolean(session.is_paused));
      setAnswers(toIdStringMap(session.answers));
      setVisited(toIdFlagMap(session.visited));
      setReviewMarked(toIdFlagMap(session.review_marked));
      setQuestionTimes(toIdNumberMap(session.question_times));
      const order = toIdNumberMap(session.visit_order);
      setVisitOrder(order);
      visitCounterRef.current = Object.values(order).reduce((max, value) => Math.max(max, value), 0);
      examReadyRef.current = true;
    };

    const loadExam = async () => {
      setLoading(true);
      setLoadError(null);

      try {
        if (sectionSlug && !email) {
          setLoadError("Session expired. Please log in again from the main window.");
          return;
        }

        if (sectionSlug && email) {
          const response = await fetch(mockTestSectionExamUrl(slug, sectionSlug, email));
          if (!response.ok) {
            setLoadError("This section is locked or unavailable. Go back and try again.");
            return;
          }

          const payload = (await response.json()) as MockTestSectionExamResponse;
          if (payload.test.is_locked) {
            staticReplace(`/mock-tests/${payload.test.category_slug ?? ""}`);
            return;
          }

          if (!payload.questions.length) {
            setLoadError(
              `"${payload.section.name}" has no questions yet. Please ask admin to add questions to this section.`
            );
            return;
          }

          setData({ test: payload.test, questions: payload.questions, sections: payload.progress.sections, sequential_sections: true });
          setSectionMeta(payload.section);
          setActiveSectionId(payload.section.id);
          const sectionSeconds = payload.section.duration_minutes * 60;
          setSectionDurationSeconds(payload.exam_session?.duration_seconds || sectionSeconds);
          restoreExamSession(payload.exam_session, sectionSeconds, payload.questions.length);
          return;
        }

        const response = await fetch(mockTestsApiUrl(slug, email));
        if (!response.ok) {
          setLoadError("Unable to load this mock test. Please try again.");
          return;
        }

        const payload = (await response.json()) as MockTestDetailResponse;
        if (payload.test.is_locked) {
          staticReplace(`/mock-tests/${payload.test.category_slug ?? ""}`);
          return;
        }

        if (payload.sequential_sections && (payload.sections?.length ?? 0) > 0) {
          staticReplace(`/student/mock-tests/${slug}/setup`);
          return;
        }

        if (!payload.questions.length) {
          setLoadError("This mock test has no questions yet. Please contact support or try again later.");
          return;
        }

        setData(payload);
        const fullSeconds = payload.test.duration_minutes * 60;
        setSectionDurationSeconds(payload.exam_session?.duration_seconds || 0);
        restoreExamSession(payload.exam_session, fullSeconds, payload.questions.length);
      } catch {
        setLoadError("Network error while loading the exam. Check your connection and try again.");
      } finally {
        setLoading(false);
      }
    };

    void loadExam();
  }, [slug, student?.email]);

  const questions = data?.questions ?? [];
  const question = questions[currentIndex];
  const answeredCount = useMemo(() => Object.keys(answers).length, [answers]);
  const test = data?.test;
  const activeDurationSeconds = sectionMeta ? sectionDurationSeconds : (test?.duration_minutes ?? 0) * 60;
  const timeUtilizedSeconds = Math.max(
    activeDurationSeconds - remainingSeconds,
    Object.values(questionTimes).reduce((sum, value) => sum + value, 0)
  );
  const timerProgressPercent = activeDurationSeconds
    ? Math.min(100, Math.round((timeUtilizedSeconds / activeDurationSeconds) * 100))
    : 0;
  const timerWarning = sectionMeta && remainingSeconds <= 300;

  const persistExamSession = useCallback(async (paused = isPaused) => {
    if (!examReadyRef.current || !student?.email || !data) return;

    try {
      await fetch(mockExamSessionUrl(slug, student.email, activeSectionId), {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: student.email,
          section_id: activeSectionId,
          current_index: currentIndex,
          remaining_seconds: remainingSeconds,
          duration_seconds: activeDurationSeconds,
          is_paused: paused,
          answers,
          visited,
          review_marked: reviewMarked,
          question_times: questionTimes,
          visit_order: visitOrder,
        }),
      });
    } catch {
      // Keep the local exam running even if autosave fails.
    }
  }, [
    activeDurationSeconds,
    activeSectionId,
    answers,
    currentIndex,
    data,
    isPaused,
    questionTimes,
    remainingSeconds,
    reviewMarked,
    slug,
    student?.email,
    visitOrder,
    visited,
  ]);

  useEffect(() => {
    if (!examReadyRef.current || !data || submitting || pendingNextSection) return;

    persistTimerRef.current = window.setInterval(() => {
      void persistExamSession(isPaused);
    }, 15000);

    return () => {
      if (persistTimerRef.current) window.clearInterval(persistTimerRef.current);
    };
  }, [data, isPaused, pendingNextSection, persistExamSession, submitting]);

  const submitSummary = useMemo(() => {
    type SummaryRow = {
      name: string;
      total: number;
      answered: number;
      answeredReview: number;
      notAnswered: number;
      markedReview: number;
      notVisited: number;
      timeTaken: number;
    };

    const currentSort = data?.sections?.find((item) => item.id === sectionMeta?.id)?.sort_order;
    const previousRows: SummaryRow[] = [...(data?.sections ?? [])]
      .filter((section) => {
        if (!section.summary) return false;
        if (sectionMeta && section.id === sectionMeta.id) return false;
        if (currentSort != null && section.sort_order > currentSort) return false;
        return true;
      })
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((section) => ({
        name: section.name,
        total: section.questions_count,
        answered: section.summary?.answered ?? 0,
        answeredReview: section.summary?.answered_review ?? 0,
        notAnswered: section.summary?.not_answered ?? 0,
        markedReview: section.summary?.marked_review ?? 0,
        notVisited: section.summary?.not_visited ?? 0,
        timeTaken: section.summary?.time_taken_seconds ?? section.latest_attempt?.time_utilized_seconds ?? 0,
      }));

    const currentRows = new Map<string, SummaryRow>();
    for (const item of questions) {
      const name = item.section_name || sectionMeta?.name || "General";
      const row = currentRows.get(name) ?? {
        name,
        total: 0,
        answered: 0,
        answeredReview: 0,
        notAnswered: 0,
        markedReview: 0,
        notVisited: 0,
        timeTaken: 0,
      };
      const hasAnswer = Boolean(answers[item.id]);
      const isReview = Boolean(reviewMarked[item.id]);
      const isVisited = Boolean(visited[item.id]);
      row.total += 1;
      row.timeTaken += questionTimes[item.id] || 0;
      if (hasAnswer && isReview) row.answeredReview += 1;
      else if (hasAnswer) row.answered += 1;
      else if (isReview) row.markedReview += 1;
      else if (isVisited) row.notAnswered += 1;
      else row.notVisited += 1;
      currentRows.set(name, row);
    }

    const sections = [...previousRows, ...Array.from(currentRows.values())];
    const totals = sections.reduce(
      (sum, row) => ({
        total: sum.total + row.total,
        answered: sum.answered + row.answered,
        answeredReview: sum.answeredReview + row.answeredReview,
        notAnswered: sum.notAnswered + row.notAnswered,
        markedReview: sum.markedReview + row.markedReview,
        notVisited: sum.notVisited + row.notVisited,
        timeTaken: sum.timeTaken + row.timeTaken,
      }),
      { total: 0, answered: 0, answeredReview: 0, notAnswered: 0, markedReview: 0, notVisited: 0, timeTaken: 0 }
    );

    return { sections, totals };
  }, [answers, data?.sections, questionTimes, questions, reviewMarked, sectionMeta, visited]);

  const accumulateQuestionTime = useCallback((questionId: number) => {
    const elapsed = Math.max(1, Math.floor((Date.now() - questionStartedAtRef.current) / 1000));
    setQuestionTimes((previous) => ({
      ...previous,
      [questionId]: (previous[questionId] || 0) + elapsed,
    }));
    questionStartedAtRef.current = Date.now();
  }, []);

  useEffect(() => {
    if (!question) return;

    questionStartedAtRef.current = Date.now();
    setVisited((previous) => ({ ...previous, [question.id]: true }));
    setVisitOrder((previous) => {
      if (previous[question.id]) return previous;
      visitCounterRef.current += 1;
      return { ...previous, [question.id]: visitCounterRef.current };
    });
  }, [question]);

  const submitTest = useCallback(async () => {
    if (!data || submitting) return;

    setSubmitting(true);

    const finalTimes = { ...questionTimes };
    if (question) {
      const elapsed = Math.max(1, Math.floor((Date.now() - questionStartedAtRef.current) / 1000));
      finalTimes[question.id] = (finalTimes[question.id] || 0) + elapsed;
    }

    const correct = questions.reduce((sum, item) => sum + (answers[item.id] === item.correct_answer ? 1 : 0), 0);
    const score = questions.reduce((sum, item) => {
      const answer = answers[item.id];
      if (!answer) return sum;
      if (answer === item.correct_answer) return sum + item.marks;
      return sum - item.negative_marks;
    }, 0);

    const timeUsed = Math.max(
      activeDurationSeconds - remainingSeconds,
      Object.values(finalTimes).reduce((sum, value) => sum + value, 0)
    );

    const answerPayload: MockAttemptAnswerInput[] = questions.map((item, index) => ({
      question_id: item.id,
      question_number: index + 1,
      selected_answer: answers[item.id] ?? null,
      time_spent_seconds: finalTimes[item.id] ?? 0,
      marked_for_review: reviewMarked[item.id] ?? false,
      visited: visited[item.id] ?? false,
      visit_order: visitOrder[item.id] ?? null,
    }));

    const saved = await saveMockResult(
      {
        slug,
        testTitle: sectionMeta ? `${data.test.title} - ${sectionMeta.name}` : data.test.title,
        testType: data.test.test_type,
        sectionId: activeSectionId ?? undefined,
        sectionSlug: sectionMeta?.slug,
        sectionName: sectionMeta?.name,
        total: questions.length,
        answered: answeredCount,
        correct,
        score,
        submittedAt: new Date().toISOString(),
        timeUtilizedSeconds: timeUsed,
        durationSeconds: activeDurationSeconds,
      },
      answerPayload
    );

    if (sectionMeta) {
      const progressSections = saved?.progress?.sections ?? data.sections ?? [];
      notifyMockExamOpener({ slug, sections: progressSections });
      setData((previous) => previous ? { ...previous, sections: progressSections } : previous);
      const next = nextUnlockedSection(progressSections, sectionMeta.slug);
      if (next) {
        setIsPaused(true);
        setPendingNextSection(next);
        setSubmitting(false);
        return;
      }

      staticReplace(`/student/mock-tests/${slug}/result?section=${encodeURIComponent(sectionMeta.slug)}`);
      return;
    }

    staticPush(`/student/mock-tests/${slug}/result`);
  }, [
    accumulateQuestionTime,
    activeDurationSeconds,
    answeredCount,
    answers,
    data,
    question,
    questionTimes,
    questions,
    remainingSeconds,
    reviewMarked,
    slug,
    submitting,
    visitOrder,
    visited,
    activeSectionId,
    sectionMeta,
  ]);

  useEffect(() => {
    if (!data || !questions.length || isPaused || remainingSeconds <= 0 || pendingNextSection) return;

    const timer = window.setInterval(() => {
      setRemainingSeconds((seconds) => Math.max(seconds - 1, 0));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [data, isPaused, pendingNextSection, remainingSeconds]);

  useEffect(() => {
    if (data && questions.length > 0 && remainingSeconds === 0 && !submitting && !pendingNextSection) {
      void submitTest();
    }
  }, [data, pendingNextSection, questions.length, remainingSeconds, submitTest, submitting]);

  const enterFullscreen = () => {
    document.documentElement.requestFullscreen?.().catch(() => undefined);
  };

  if (loadError) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#eef3f8] px-4">
        <div className="max-w-md rounded-[24px] border border-[#fecdca] bg-white p-8 text-center shadow-lg">
          <h1 className="text-xl font-extrabold text-[#172a69]">Exam cannot start</h1>
          <p className="mt-3 text-sm font-semibold leading-6 text-[#667085]">{loadError}</p>
          <button
            type="button"
            onClick={() => {
              if (window.opener) {
                window.close();
                return;
              }
              staticPush(`/student/mock-tests/${slug}/setup`);
            }}
            className="mt-6 inline-flex h-11 items-center rounded-xl bg-[#3378b9] px-5 text-sm font-extrabold text-white"
          >
            Back to Setup
          </button>
        </div>
      </main>
    );
  }

  if (loading || !data || !question || !test) {
    return <main className="grid min-h-screen place-items-center bg-white"><Loader2 className="animate-spin text-[#3378b9]" size={34} /></main>;
  }

  const saveCurrent = () => {
    accumulateQuestionTime(question.id);
    setValidationMessage("");
    setSaveNotice("Saved");
    window.setTimeout(() => setSaveNotice(""), 1400);
    void persistExamSession(isPaused);
  };

  const goToNext = () => {
    accumulateQuestionTime(question.id);
    setValidationMessage("");
    setCurrentIndex((index) => Math.min(index + 1, questions.length - 1));
    void persistExamSession(isPaused);
  };

  const markForReview = () => {
    setReviewMarked((previous) => ({ ...previous, [question.id]: !previous[question.id] }));
    void persistExamSession(isPaused);
  };

  const jumpToQuestion = (index: number) => {
    if (index === currentIndex) return;
    accumulateQuestionTime(question.id);
    setValidationMessage("");
    setCurrentIndex(index);
    void persistExamSession(isPaused);
  };

  const clearResponse = () => {
    setValidationMessage("");
    setAnswers((previous) => {
      const next = { ...previous };
      delete next[question.id];
      return next;
    });
    setReviewMarked((previous) => {
      const next = { ...previous };
      delete next[question.id];
      return next;
    });
    setOptionResetKey((value) => value + 1);
  };

  const togglePause = () => {
    const next = !isPaused;
    setIsPaused(next);
    void persistExamSession(next);
  };

  return (
    <main className="h-screen overflow-hidden bg-white text-[#111827]" style={{ fontFamily: "Arial, Helvetica, sans-serif" }}>
      <header className="flex min-h-[50px] flex-col gap-2 bg-[#3378b9] px-3 py-2 text-white sm:px-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <Image src="/kr-logics-logo.png" alt="KR Logics logo" width={36} height={36} className="h-9 w-9 rounded-full border border-[#0957D3] object-cover shadow-lg shadow-black/20" />
            <div>
              <h1 className="text-[13px] font-medium sm:text-[14px]">{sectionMeta ? `${test.title} · ${sectionMeta.name}` : test.title}</h1>
              {sectionMeta && (
                <p className="text-[11px] font-semibold text-[#d8ebff]">
                  Section time: {sectionMeta.duration_minutes} min · Marks: {sectionMeta.total_marks ?? questions.reduce((sum, item) => sum + (item.marks || 0), 0)} · Pass {sectionMeta.passing_percentage}%
                </p>
              )}
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className={`flex h-9 items-center rounded bg-white px-2 text-xs text-[#1f4f86] sm:text-sm ${timerWarning ? "ring-2 ring-[#ff3950]" : ""}`}>
              {sectionMeta ? "Section Time:" : "Time Left:"}{" "}
              <span className={`ml-2 rounded px-2 py-1 font-mono font-bold ${timerWarning ? "bg-[#ffe4e6] text-[#be123c]" : "bg-[#d8ebff] text-[#174b82]"}`}>
                {formatExamClock(remainingSeconds)}
              </span>
            </div>
            <button onClick={togglePause} className="flex h-9 min-w-[76px] items-center justify-center gap-1 rounded bg-white px-2 text-sm text-[#2768a5]">
              {isPaused ? <Play size={15} /> : <Pause size={15} />}{isPaused ? "Resume" : "Pause"}
            </button>
            <button onClick={enterFullscreen} className="grid h-9 w-9 place-items-center rounded bg-white text-[#2768a5]"><Expand size={17} /></button>
          </div>
        </div>
        {sectionMeta && activeDurationSeconds > 0 && (
          <div className="flex items-center gap-3 pb-1">
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-[#1f4f86]/40">
              <div
                className={`h-full rounded-full transition-all ${timerWarning ? "bg-[#ff3950]" : "bg-[#6bbd21]"}`}
                style={{ width: `${timerProgressPercent}%` }}
              />
            </div>
            <span className="min-w-[72px] text-right text-[11px] font-bold text-[#d8ebff]">
              {formatExamClock(timeUtilizedSeconds)} used
            </span>
          </div>
        )}
      </header>

      <div className="h-[calc(100vh-50px)] overflow-y-auto lg:grid lg:grid-cols-[1fr_260px] lg:overflow-hidden">
        <section className="grid h-[calc(100vh-50px)] grid-rows-[auto_1fr_auto] overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#cfd7df] bg-[#f6f6f6] px-2 py-2 text-sm">
            <span className="font-bold text-[#0f60b5] underline">{decodeHtmlEntities(question.section_name)}</span>
            <span className="inline-flex items-center rounded border border-[#111827] bg-white px-3 py-1 text-base">
              English
            </span>
          </div>

          <div className="grid grid-rows-[auto_1fr] overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#cfd7df] px-2 py-2 text-sm">
              <span className="min-w-0 truncate font-bold text-[#111827]">{test.title}</span>
              <div className="flex flex-wrap items-center gap-2 sm:gap-5">
                <span className="rounded border border-[#cfd7df] bg-white px-3 py-1 font-bold text-[#175cd3]">
                  Attempted {answeredCount}/{questions.length}
                </span>
                <span className="text-[#667085]">Q {currentIndex + 1} / {questions.length}</span>
                <span className="rounded border border-[#cfd7df] px-3 py-1">Qn. Time : <Clock3 size={12} className="inline" /></span>
                <span><b>Marks :</b> <span className="text-[#00a651]">+{question.marks}</span> | <span className="text-[#ff3950]">-{question.negative_marks}</span></span>
              </div>
            </div>

            <div className="grid min-h-0 overflow-hidden lg:grid-cols-2">
              <div className="min-h-0 overflow-y-auto border-b border-[#cfd7df] p-3 text-[15px] leading-7 lg:border-b-0 lg:border-r lg:text-[18px] lg:leading-8">
                <p className="mb-4 font-bold">{decodeHtmlEntities(question.question_text)}</p>
              </div>

              <div className="min-h-0 overflow-y-auto p-4 text-[15px] leading-7 lg:text-[18px] lg:leading-8">
                <h2 className="mb-3 font-bold">Choose the correct answer.</h2>
                <div className="mt-4 space-y-4" key={`${question.id}-${optionResetKey}-${answers[question.id] ?? "none"}`}>
                  {(Object.entries(question.options) as Array<[keyof MockQuestion["options"], string | null]>).map(([key, option]) => (
                    option ? (
                      <label key={key} className="flex cursor-pointer items-center gap-3">
                        <input
                          type="radio"
                          name={`question-${question.id}-${optionResetKey}`}
                          checked={answers[question.id] === key}
                          onChange={() => {
                            setValidationMessage("");
                            setAnswers((previous) => ({ ...previous, [question.id]: key }));
                          }}
                          className="h-5 w-5"
                        />
                        <span><b>{key}.</b> {decodeHtmlEntities(option)}</span>
                      </label>
                    ) : null
                  ))}
                </div>
              </div>
            </div>
          </div>

          <footer className="flex flex-col items-stretch justify-between gap-3 border-t border-[#cfd7df] bg-[#efefef] px-4 py-3">
            <div className="grid gap-3">
              {validationMessage && (
                <div className="rounded-lg border border-[#ffd4a3] bg-[#fff7ed] px-3 py-2 text-xs font-bold text-[#9a3412]">
                  {validationMessage}
                </div>
              )}
              <div className="flex flex-wrap items-center gap-2">
                <button type="button" onClick={saveCurrent} className="rounded-lg border border-[#8dc8ff] bg-[#cae7ff] px-4 py-2 text-sm font-bold text-[#174b82]">Save</button>
                <button type="button" onClick={goToNext} disabled={currentIndex >= questions.length - 1} className="rounded-lg bg-[#2f78bf] px-4 py-2 text-sm font-bold text-white shadow disabled:opacity-50">Next</button>
                <button type="button" onClick={markForReview} className={`rounded-lg border px-4 py-2 text-sm font-bold ${reviewMarked[question.id] ? "border-[#6b21a8] bg-[#7e22ce] text-white" : "border-[#8dc8ff] bg-[#cae7ff] text-[#174b82]"}`}>
                  {reviewMarked[question.id] ? "Marked for Review" : "Mark for Review"}
                </button>
                <button type="button" onClick={clearResponse} className="rounded-lg border border-[#b9bec8] bg-white px-4 py-2 text-sm font-bold text-[#344054]">Clear Response</button>
                <button type="button" onClick={() => setShowSubmitSummary(true)} disabled={submitting} className="rounded-lg bg-[#be123c] px-4 py-2 text-sm font-bold text-white shadow disabled:opacity-60">
                  {submitting ? "Submitting..." : sectionMeta ? "Submit Section" : "Submit Test"}
                </button>
                {saveNotice ? <span className="text-sm font-bold text-[#027a48]">{saveNotice}</span> : null}
              </div>
            </div>
          </footer>
        </section>

        <aside className="grid border-t border-[#cfd7df] bg-[#eef9ff] lg:grid-rows-[50px_88px_1fr_58px] lg:border-l lg:border-t-0">
          <div className="flex items-center gap-3 bg-[#dff5ff] px-4">
            <div className="grid h-10 w-10 place-items-center rounded-full bg-white text-[#607d8b]"><UserRound size={24} /></div>
            <span className="text-sm">{student?.name || "Student"}</span>
          </div>

          <div className="bg-[#f2f2f2] px-4 py-2 text-sm">
            <p className="mb-2 flex items-center justify-between gap-2">
              <span className="font-bold text-[#175cd3]">Attempted {answeredCount}/{questions.length}</span>
              <span>
                {sectionMeta ? "Section Time:" : "Time Left:"}{" "}
                <b className={`ml-2 rounded px-2 py-1 font-mono ${timerWarning ? "bg-[#ffe4e6] text-[#be123c]" : "bg-white"}`}>
                  {formatExamClock(remainingSeconds)}
                </b>
              </span>
            </p>
            <div className="grid grid-cols-1 gap-x-5 gap-y-2 text-xs sm:grid-cols-2">
              <span className="flex items-center gap-2"><PaletteIcon status="answered" number={submitSummary.totals.answered} size="sm" /> Answered</span>
              <span className="flex items-center gap-2"><PaletteIcon status="not-answered" number={submitSummary.totals.notAnswered} size="sm" /> Not Answered</span>
              <span className="flex items-center gap-2"><PaletteIcon status="not-visited" number={submitSummary.totals.notVisited} size="sm" /> Not Visited</span>
              <span className="flex items-center gap-2"><PaletteIcon status="review" number={submitSummary.totals.markedReview + submitSummary.totals.answeredReview} size="sm" /> Review</span>
            </div>
          </div>

          <div className="overflow-y-auto p-4">
            <h3 className="mb-4 bg-[#e8e8e8] py-2 text-center text-sm font-bold">{test.title}</h3>
            <div className="grid grid-cols-5 gap-2 sm:grid-cols-7 lg:grid-cols-4 lg:gap-3">
              {questions.map((item, index) => {
                const hasAnswer = Boolean(answers[item.id]);
                const isReview = Boolean(reviewMarked[item.id]);
                const isVisited = Boolean(visited[item.id]);
                const paletteClass = (() => {
                  if (index === currentIndex) return "border-[#174b82] bg-[#3378b9] font-bold text-white";
                  if (hasAnswer && isReview) return "rounded-full border-[#6b21a8] bg-[#7e22ce] font-bold text-white";
                  if (isReview) return "rounded-full border-[#6b21a8] bg-[#7e22ce] font-bold text-white";
                  if (hasAnswer) return "border-[#15803d] bg-[#22c55e] font-bold text-white";
                  if (isVisited) return "border-[#b91c1c] bg-[#ef4444] font-bold text-white";
                  return "border-[#9d9d9d] bg-gradient-to-b from-white to-[#d9d9d9] text-[#333]";
                })();

                return (
                  <button
                    key={item.id}
                    onClick={() => jumpToQuestion(index)}
                    className={`relative h-11 rounded border text-sm ${paletteClass}`}
                  >
                    {index + 1}
                    {hasAnswer && isReview ? <span className="absolute bottom-0.5 right-0.5 h-2 w-2 rounded-sm bg-[#22c55e]" /> : null}
                  </button>
                );
              })}
            </div>
            <button className="absolute right-[252px] top-[386px] hidden h-14 w-7 place-items-center rounded-l bg-[#444] text-white xl:grid">
              <ChevronRight size={22} />
            </button>
          </div>

          <div className="flex items-center justify-center border-t border-[#cfd7df] bg-[#efefef] px-4">
            <button onClick={() => setShowSubmitSummary(true)} disabled={submitting} className="h-10 w-full rounded bg-[#2f78bf] text-sm font-bold text-white shadow disabled:opacity-60">
              {submitting ? "Submitting..." : sectionMeta ? "Submit Section" : "Submit Test"}
            </button>
          </div>
        </aside>
      </div>

      {showSubmitSummary ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(15,23,42,0.55)] p-3">
          <div className="relative max-h-[92vh] w-full max-w-6xl overflow-auto rounded-md border border-[#cfcfcf] bg-white shadow-2xl">
            <button
              type="button"
              onClick={() => setShowSubmitSummary(false)}
              className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full text-[#667085] hover:bg-[#f2f4f7]"
              aria-label="Close summary"
            >
              <X size={18} />
            </button>

            <div className="grid gap-3 p-4 pt-5 sm:grid-cols-2 lg:grid-cols-6">
              <SummaryStatusCard status="answered" label="Answered" count={submitSummary.totals.answered} />
              <SummaryStatusCard status="answered-review" label="Answered & Marked For Review" count={submitSummary.totals.answeredReview} />
              <SummaryStatusCard status="not-answered" label="Not Answered" count={submitSummary.totals.notAnswered} />
              <SummaryStatusCard status="review" label="Marked For Review (Only Marked)" count={submitSummary.totals.markedReview} />
              <SummaryStatusCard status="not-visited" label="Not Visited" count={submitSummary.totals.notVisited} />
              <div className="rounded border border-[#ead7b7] bg-[#fff7ed] px-3 py-3 text-center">
                <span className="inline-grid h-8 w-8 place-items-center rounded-full bg-[#f97316] text-xs font-bold text-white">T</span>
                <p className="mt-2 text-lg font-extrabold text-[#c2410c]">{formatExamClock(remainingSeconds)}</p>
                <p className="text-[11px] font-bold uppercase tracking-wide text-[#9a3412]">Time Left</p>
              </div>
            </div>

            <div className="overflow-x-auto px-4 pb-2">
              <table className="min-w-full border-collapse border border-[#c5c5c5] text-center text-[12px] sm:text-[13px]">
                <thead>
                  <tr className="bg-[#3378b9] text-white">
                    <th colSpan={10} className="border border-[#3378b9] px-3 py-2 text-left text-sm font-bold">Test Summary</th>
                  </tr>
                  <tr className="bg-[#e9eef5] text-[#111]">
                    {["SL.No", "Name of the Section", "Total Questions", "Answered", "Answered & Review", "Not Answered", "Marked for Review", "Not Visited", "Effective Attempts", "Time Taken"].map((head) => (
                      <th key={head} className="border border-[#c5c5c5] px-2 py-2 font-bold">{head}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {submitSummary.sections.map((row, index) => (
                    <tr key={row.name} className={index % 2 === 0 ? "bg-white" : "bg-[#f7f7f7]"}>
                      <td className="border border-[#c5c5c5] px-2 py-2">{index + 1}</td>
                      <td className="border border-[#c5c5c5] px-2 py-2 text-left">{row.name}</td>
                      <td className="border border-[#c5c5c5] px-2 py-2">{row.total}</td>
                      <td className="border border-[#c5c5c5] px-2 py-2">{row.answered}</td>
                      <td className="border border-[#c5c5c5] px-2 py-2">{row.answeredReview}</td>
                      <td className="border border-[#c5c5c5] px-2 py-2">{row.notAnswered}</td>
                      <td className="border border-[#c5c5c5] px-2 py-2">{row.markedReview}</td>
                      <td className="border border-[#c5c5c5] px-2 py-2">{row.notVisited}</td>
                      <td className="border border-[#c5c5c5] px-2 py-2">{row.answered + row.answeredReview}</td>
                      <td className="border border-[#c5c5c5] px-2 py-2">{formatMmSs(row.timeTaken)}</td>
                    </tr>
                  ))}
                  <tr className="bg-[#eef3f8] font-bold">
                    <td className="border border-[#c5c5c5] px-2 py-2" colSpan={2}>Total</td>
                    <td className="border border-[#c5c5c5] px-2 py-2">{submitSummary.totals.total}</td>
                    <td className="border border-[#c5c5c5] px-2 py-2">{submitSummary.totals.answered}</td>
                    <td className="border border-[#c5c5c5] px-2 py-2">{submitSummary.totals.answeredReview}</td>
                    <td className="border border-[#c5c5c5] px-2 py-2">{submitSummary.totals.notAnswered}</td>
                    <td className="border border-[#c5c5c5] px-2 py-2">{submitSummary.totals.markedReview}</td>
                    <td className="border border-[#c5c5c5] px-2 py-2">{submitSummary.totals.notVisited}</td>
                    <td className="border border-[#c5c5c5] px-2 py-2">{submitSummary.totals.answered + submitSummary.totals.answeredReview}</td>
                    <td className="border border-[#c5c5c5] px-2 py-2">{formatExamClock(timeUtilizedSeconds)}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="flex flex-wrap items-center justify-end gap-4 px-4 py-4">
              <p className="text-sm font-semibold text-[#344054]">Do you want to submit?</p>
              <button
                type="button"
                disabled={submitting}
                onClick={() => {
                  setShowSubmitSummary(false);
                  void submitTest();
                }}
                className="h-9 min-w-[110px] rounded bg-[#3378b9] px-6 text-sm font-bold text-white disabled:opacity-60"
              >
                {submitting ? "Submitting..." : "Submit"}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {pendingNextSection ? (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-[rgba(15,23,42,0.62)] p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 text-center shadow-2xl">
            <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-[#3378b9]">Section submitted</p>
            <h2 className="mt-2 text-2xl font-extrabold text-[#172a69]">Next section is ready</h2>
            <p className="mt-3 text-sm font-semibold leading-6 text-[#667085]">
              <b className="text-[#172a69]">{pendingNextSection.name}</b> is about to start. Click Start when you are ready.
            </p>
            <p className="mt-4 text-sm font-bold text-[#344054]">
              {pendingNextSection.questions_count} questions · {pendingNextSection.duration_minutes} min
              {pendingNextSection.total_marks ? ` · ${pendingNextSection.total_marks} marks` : ""} · Pass {pendingNextSection.passing_percentage}%
            </p>
            <button
              type="button"
              onClick={() => {
                staticReplace(`/student/mock-tests/${slug}/exam?examWindow=1&section=${encodeURIComponent(pendingNextSection.slug)}`);
              }}
              className="mt-6 inline-flex h-11 min-w-[160px] items-center justify-center rounded-xl bg-[#3378b9] px-6 text-sm font-extrabold text-white"
            >
              Start
            </button>
          </div>
        </div>
      ) : null}

      <div className="pointer-events-none absolute left-1/2 top-[45px] grid h-12 w-12 -translate-x-1/2 place-items-center rounded-full bg-[#3f3f3f] text-white">
        <X size={24} />
      </div>
      <div className="fixed bottom-4 right-4 hidden rounded-full bg-[#3378b9] p-3 text-white shadow-lg md:block">
        <HelpCircle size={20} />
      </div>
    </main>
  );
}

function SummaryStatusCard({
  status,
  label,
  count,
}: {
  status: "answered" | "answered-review" | "not-answered" | "review" | "not-visited";
  label: string;
  count: number;
}) {
  return (
    <div className="rounded border border-[#d9d9d9] bg-[#fafafa] px-3 py-3 text-center">
      <PaletteIcon status={status} number={count} />
      <p className="mt-2 text-sm font-extrabold text-[#111]">{count}</p>
      <p className="text-[11px] font-semibold leading-4 text-[#667085]">{label}</p>
    </div>
  );
}
