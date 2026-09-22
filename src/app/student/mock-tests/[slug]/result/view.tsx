"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { staticReplace } from "@/lib/static-nav";
import { useLiveParam } from "@/lib/use-live-param";
import {
  ArrowLeft,
  Award,
  BarChart3,
  BookOpenCheck,
  CheckCircle2,
  Clock3,
  Loader2,
  Lock,
  RotateCcw,
  Trophy,
  XCircle,
} from "lucide-react";
import { fetchMockAttemptBySlug, fetchMockAttemptDetail, type MockAttemptDetail } from "@/lib/mock-attempt-analysis";
import { accuracyToneClass, scoreToneClass } from "@/components/student/mock-exam-status";
import { getMockResult, type MockResult } from "@/lib/mock-results";
import { isStudentLoggedIn, getStudentSession } from "@/lib/student-auth";
import {
  mockTestsApiUrl,
  mockTestProgressUrl,
  type MockTestDetailResponse,
  type MockTestProgressResponse,
  type MockTestSection,
} from "@/lib/mock-tests";

export default function MockResultPage() {
  const searchParams = useSearchParams();
  const slug = useLiveParam("slug", 2);
  const sectionSlug = searchParams.get("section") ?? undefined;
  const [result, setResult] = useState<MockResult | null>(null);
  const [categorySlug, setCategorySlug] = useState<string | null>(null);
  const [progress, setProgress] = useState<MockTestProgressResponse | null>(null);
  const [analysis, setAnalysis] = useState<MockAttemptDetail | null>(null);
  const [combined, setCombined] = useState<MockAttemptDetail | null>(null);
  const [allowSectionRetry, setAllowSectionRetry] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setResult(getMockResult(slug, sectionSlug));
  }, [slug, sectionSlug]);

  useEffect(() => {
    const target = `/student/mock-tests/${slug}/result${sectionSlug ? `?section=${sectionSlug}` : ""}`;
    if (!isStudentLoggedIn()) {
      staticReplace(`/login?redirect=${encodeURIComponent(target)}`);
      return;
    }

    const session = getStudentSession();
    const email = session?.email;
    const storedResult = getMockResult(slug, sectionSlug);
    const attemptId = searchParams.get("attempt") || storedResult?.attemptId;

    Promise.all([
      fetch(mockTestsApiUrl(slug)).then((response) => response.json()) as Promise<MockTestDetailResponse>,
      email ? fetch(mockTestProgressUrl(slug, email)).then((response) => (response.ok ? response.json() : null)) : Promise.resolve(null),
      email
        ? attemptId
          ? fetchMockAttemptDetail(email, Number(attemptId)).catch(() => null)
          : fetchMockAttemptBySlug(email, slug, !sectionSlug).catch(() => null)
        : Promise.resolve(null),
      email ? fetchMockAttemptBySlug(email, slug, true).catch(() => null) : Promise.resolve(null),
    ])
      .then(([testPayload, progressPayload, analysisPayload, combinedPayload]) => {
        setCategorySlug(testPayload.test.category_slug);
        setAllowSectionRetry(
          testPayload.allow_section_retry
            ?? testPayload.test.allow_section_retry
            ?? testPayload.test.test_type !== "full_length"
        );
        if (progressPayload) {
          setProgress(progressPayload as MockTestProgressResponse);
          if ((progressPayload as MockTestProgressResponse).allow_section_retry != null) {
            setAllowSectionRetry(Boolean((progressPayload as MockTestProgressResponse).allow_section_retry));
          }
        } else if (storedResult?.progress) {
          setProgress(storedResult.progress);
        }
        if (analysisPayload) {
          setAnalysis(analysisPayload);
        }
        if (combinedPayload) {
          setCombined(combinedPayload);
        }
      })
      .finally(() => setLoading(false));
  }, [slug, sectionSlug, searchParams]);

  const sections = progress?.sections ?? result?.progress?.sections ?? [];
  const isSectionResult = Boolean(sectionSlug || result?.sectionSlug);
  const allSectionsDone = sections.filter((section) => section.questions_count > 0).every((section) => section.status === "passed" || section.status === "completed");
  const overview = !isSectionResult || allSectionsDone ? (combined ?? analysis) : analysis;
  const currentSection = useMemo(
    () => sections.find((section) => section.slug === (sectionSlug || result?.sectionSlug)),
    [sections, sectionSlug, result?.sectionSlug]
  );
  const nextSection = useMemo(() => {
    if (!currentSection || !sections.length) return null;
    const sorted = [...sections].sort((a, b) => a.sort_order - b.sort_order);
    const index = sorted.findIndex((section) => section.id === currentSection.id);
    return index >= 0 ? sorted[index + 1] ?? null : null;
  }, [currentSection, sections]);

  if (loading) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#eef3f8]">
        <Loader2 className="animate-spin text-[#3378b9]" size={34} />
      </main>
    );
  }

  if (!result) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#eef3f8] px-4 text-center">
        <div className="max-w-md rounded-[24px] border border-[#dfe5ef] bg-white p-8 shadow-[0_18px_50px_rgba(15,23,42,0.08)]">
          <BarChart3 className="mx-auto text-[#3378b9]" size={42} />
          <h1 className="mt-4 text-xl font-extrabold text-[#172a69]">Result not available</h1>
          <p className="mt-2 text-sm font-semibold leading-6 text-[#667085]">
            Complete the mock test first to view your result here.
          </p>
          <Link
            href={`/student/mock-tests/${slug}/setup`}
            className="mock-exam-start-btn mt-5 inline-flex h-11 items-center rounded-xl px-5 text-sm font-extrabold"
          >
            Go to Sections
          </Link>
        </div>
      </main>
    );
  }

  const attemptQuery = searchParams.get("attempt") || result.attemptId?.toString() || "";
  const querySuffix = attemptQuery ? `?attempt=${attemptQuery}` : "";
  const accuracy = result.total ? Math.round((result.correct / result.total) * 100) : 0;
  const displayPercentage = result.percentage ?? accuracy;
  const passingPercentage = result.passingPercentage ?? currentSection?.passing_percentage ?? 0;
  const passed = result.passed ?? displayPercentage >= passingPercentage;
  const timeUsed = result.timeUtilizedSeconds ?? 0;
  const timeLimit = result.durationSeconds ?? 0;
  const maxMarks = result.maxMarks ?? result.total;

  return (
    <main
      className="min-h-screen bg-[#eef3f8] px-4 py-8"
      style={{ fontFamily: "'Plus Jakarta Sans', Inter, ui-sans-serif, system-ui, sans-serif" }}
    >
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');`}</style>

      <section className="mx-auto max-w-6xl space-y-6">
        {!isSectionResult && (
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#3378b9]">Test Result Analysis</p>
            <h1 className="mt-2 text-2xl font-extrabold tracking-[-0.04em] text-[#172a69]">{result.testTitle}</h1>
            <p className="mt-2 text-sm font-semibold text-[#667085]">
              {getStudentSession()?.name || "Student"} · {new Date(result.submittedAt).toLocaleString()}
            </p>
          </div>
        )}
        {isSectionResult && (
          <div
            className={`rounded-[28px] border p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] sm:p-8 ${
              passed
                ? "border-[#abefc6] bg-gradient-to-br from-[#ecfdf3] to-white"
                : "border-[#fecdca] bg-gradient-to-br from-[#fef3f2] to-white"
            }`}
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#667085]">Section Result</p>
                <h1 className="mt-2 text-2xl font-extrabold tracking-[-0.04em] text-[#172a69]">
                  {result.sectionName || currentSection?.name || result.testTitle}
                </h1>
                <p className="mt-2 text-sm font-semibold text-[#667085]">
                  {getStudentSession()?.name || "Student"} · {new Date(result.submittedAt).toLocaleString()}
                </p>
              </div>
              <div
                className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-extrabold ${
                  passed ? "bg-[#027a48] text-white" : "bg-[#b42318] text-white"
                }`}
              >
                {passed ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
                {passed ? "Section Passed" : "Section Failed"}
              </div>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              <MetricCard label="Score" value={`${result.score}/${maxMarks}`} tone={result.score < 0 ? "pink" : "green"} />
              <MetricCard label="Percentage" value={`${(analysis?.summary.percentage ?? displayPercentage).toFixed(1)}%`} tone="blue" />
              <MetricCard label="Percentile" value={analysis?.summary.percentile != null ? `${analysis.summary.percentile}%ile` : "—"} tone="purple" />
              <MetricCard label="Required" value={`${passingPercentage}%`} tone="purple" />
              <MetricCard
                label="Time Used"
                value={`${formatDuration(timeUsed)} / ${formatDuration(timeLimit)}`}
                tone="pink"
              />
            </div>

            <div className="mt-6 rounded-2xl border border-[#dfe5ef] bg-white/80 p-4">
              <div className="mb-2 flex items-center justify-between text-xs font-bold uppercase tracking-[0.14em] text-[#667085]">
                <span>Section time used</span>
                <span>{timeLimit ? Math.min(100, Math.round((timeUsed / timeLimit) * 100)) : 0}%</span>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-[#eef3f8]">
                <div
                  className={`h-full rounded-full ${passed ? "bg-[#12b76a]" : "bg-[#f04438]"}`}
                  style={{ width: `${timeLimit ? Math.min(100, Math.round((timeUsed / timeLimit) * 100)) : 0}%` }}
                />
              </div>
            </div>

            {nextSection && nextSection.status !== "locked" && (
              <p className="mt-4 rounded-xl border border-[#abefc6] bg-[#f6fef9] px-4 py-3 text-sm font-semibold text-[#027a48]">
                {nextSection.name} is now unlocked. Continue to the next section.
              </p>
            )}
          </div>
        )}

        {(!isSectionResult || allSectionsDone) && (
          <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <ResultHighlight
                icon={<Trophy size={22} />}
                label="Your Score"
                value={`${overview?.summary.score ?? result.score} / ${overview?.summary.total_marks ?? result.total}`}
                hint="Obtained score out of total marks"
                toneClass={scoreToneClass(overview?.summary.score ?? result.score, overview?.summary.total_marks ?? result.total)}
              />
              <ResultHighlight
                icon={<Award size={22} />}
                label="Your Percentage"
                value={`${(overview?.summary.percentage ?? displayPercentage).toFixed(1)}%`}
                hint="Score as a percent of total marks"
                toneClass={accuracyToneClass(overview?.summary.percentage ?? displayPercentage)}
              />
              <ResultHighlight
                icon={<Award size={22} />}
                label="Your Rank"
                value={overview?.summary.rank ? `${overview.summary.rank} / ${overview.summary.total_participants}` : '—'}
                hint="Out of all test takers (best attempt per student)"
                toneClass="text-[#7c3aed]"
              />
              <ResultHighlight
                icon={<BarChart3 size={22} />}
                label="Your Percentile"
                value={overview?.summary.percentile != null ? `${overview.summary.percentile}%ile` : '—'}
                hint="You scored better than this percent of test takers"
                toneClass={accuracyToneClass(overview?.summary.percentile ?? 0)}
              />
              <ResultHighlight
                icon={<BarChart3 size={22} />}
                label="Your Accuracy"
                value={`${accuracy}%`}
                hint="Correct answers vs total questions"
                toneClass={accuracyToneClass(accuracy)}
              />
              <div className="rounded-[24px] border border-[#dfe5ef] bg-white p-5 shadow-sm">
                <Award className="text-[#7c3aed]" size={22} />
                <p className="mt-3 text-xs font-extrabold uppercase tracking-[0.14em] text-[#667085]">Correct / Incorrect</p>
                <p className="mt-2 text-3xl font-black">
                  <span className="text-[#16a34a]">{result.correct}</span>
                  <span className="text-[#98a2b3]"> / </span>
                  <span className="text-[#dc2626]">{Math.max(0, result.total - result.correct)}</span>
                </p>
                <p className="mt-1 text-xs font-semibold text-[#667085]">Green = correct · Red = wrong or unattempted</p>
              </div>
              <ResultHighlight
                icon={<Clock3 size={22} />}
                label="Time Used"
                value={formatDuration(timeUsed)}
                hint={`Out of ${formatDuration(timeLimit)}`}
                toneClass="text-[#175cd3]"
              />
            </div>

            <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="rounded-[24px] border border-[#dfe5ef] bg-white p-5 shadow-sm sm:p-6">
                <h2 className="text-lg font-extrabold text-[#172a69]">Section Score Performance</h2>
                <p className="mt-1 text-sm font-semibold text-[#667085]">
                  Negative or zero section scores are shown in red. Positive scores are shown in green/purple.
                </p>
                <div className="mt-5 space-y-4">
                  {(overview?.sections ?? analysis?.sections ?? []).map((section) => {
                    const width = section.total_marks ? Math.min(100, Math.abs(section.score / section.total_marks) * 100) : 0;
                    return (
                      <div key={section.section_name}>
                        <div className="mb-1 flex items-center justify-between text-sm">
                          <span className="font-bold text-[#172a69]">{section.section_name}</span>
                          <span className={`font-extrabold ${scoreToneClass(section.score, section.total_marks)}`}>
                            {section.score} / {section.total_marks}
                          </span>
                        </div>
                        <div className="h-8 overflow-hidden rounded-md bg-[#eef2f7]">
                          <div
                            className={`h-full ${section.score <= 0 ? "bg-[#ef4444]" : "bg-[#7c3aed]"}`}
                            style={{ width: `${Math.max(width, 4)}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                      {!overview?.sections?.length && !analysis?.sections?.length && (
                    <p className="text-sm font-semibold text-[#667085]">Open Detailed Analysis for the full section breakdown.</p>
                  )}
                </div>
              </div>

              <div className="overflow-hidden rounded-[24px] border border-[#dfe5ef] bg-white shadow-sm">
                <div className="border-b border-[#e5eaf2] px-5 py-4">
                  <h2 className="text-lg font-extrabold text-[#172a69]">Section Wise Score</h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead className="bg-[#f8fafc] text-left text-xs font-extrabold uppercase tracking-[0.12em] text-[#667085]">
                      <tr>
                        <th className="px-4 py-3">Section</th>
                        <th className="px-4 py-3">Score / Max Marks</th>
                        <th className="px-4 py-3">Percentage</th>
                        <th className="px-4 py-3">Percentile</th>
                        <th className="px-4 py-3">Accuracy</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(overview?.sections ?? analysis?.sections ?? []).map((section) => (
                        <tr key={section.section_name} className="border-t border-[#eef2f7]">
                          <td className="px-4 py-3 font-bold text-[#172a69]">{section.section_name}</td>
                          <td className={`px-4 py-3 font-extrabold ${scoreToneClass(section.score, section.total_marks)}`}>
                            {section.score} / {section.total_marks}
                          </td>
                          <td className="px-4 py-3 font-bold text-[#175cd3]">{(section.percentage ?? 0).toFixed(1)}%</td>
                          <td className={`px-4 py-3 font-bold ${accuracyToneClass(section.percentile ?? 0)}`}>
                            {section.percentile != null ? `${section.percentile}%ile` : "—"}
                          </td>
                          <td className={`px-4 py-3 font-bold ${accuracyToneClass(section.accuracy)}`}>{section.accuracy}%</td>
                        </tr>
                      ))}
                      <tr className="border-t border-[#dfe5ef] bg-[#f8fafc] font-extrabold">
                        <td className="px-4 py-3 text-[#172a69]">TOTAL</td>
                        <td className={`px-4 py-3 ${scoreToneClass(overview?.summary.score ?? result.score, overview?.summary.total_marks ?? result.total)}`}>
                          {overview?.summary.score ?? result.score} / {overview?.summary.total_marks ?? result.total}
                        </td>
                        <td className="px-4 py-3 text-[#175cd3]">{(overview?.summary.percentage ?? displayPercentage).toFixed(1)}%</td>
                        <td className={`px-4 py-3 ${accuracyToneClass(overview?.summary.percentile ?? 0)}`}>
                          {overview?.summary.percentile != null ? `${overview.summary.percentile}%ile` : "—"}
                        </td>
                        <td className={`px-4 py-3 ${accuracyToneClass(accuracy)}`}>{accuracy}%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

          </div>
        )}

        <TopperComparisonChart
          overall={
            overview?.summary.comparison
            ?? overview?.comparison
            ?? analysis?.summary.comparison
            ?? analysis?.comparison
            ?? {
              your_score: overview?.summary.score ?? analysis?.summary.score ?? result.score,
              topper_score: overview?.summary.topper_score ?? analysis?.summary.topper_score ?? result.score,
              average_score: overview?.summary.average_score ?? analysis?.summary.average_score ?? result.score,
            }
          }
          sections={overview?.sections ?? analysis?.sections ?? []}
        />

        {isSectionResult && sections.length > 0 && (
          <div className="rounded-[28px] border border-[#dfe5ef] bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] sm:p-8">
            <h2 className="text-lg font-extrabold text-[#172a69]">All Sections Progress</h2>
            <p className="mt-1 text-sm font-semibold text-[#667085]">Submit a section to unlock the next one.</p>

            <div className="mt-6 space-y-3">
              {[...sections]
                .sort((a, b) => a.sort_order - b.sort_order)
                .map((section) => (
                  <SectionProgressRow
                    key={section.id}
                    section={section}
                    isCurrent={section.slug === (sectionSlug || result.sectionSlug)}
                  />
                ))}
            </div>
          </div>
        )}

        <div className="rounded-[28px] border border-[#dfe5ef] bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] sm:p-8">
          <div className="grid gap-4 sm:grid-cols-2">
            <Link
              href={`/student/mock-tests/${slug}/analysis${querySuffix}`}
              className="inline-flex h-14 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#d946ef] to-[#ec4899] text-base font-extrabold text-white shadow-lg shadow-fuchsia-200"
            >
              <BarChart3 size={20} /> Detailed Analysis
            </Link>
            <Link
              href={`/student/mock-tests/${slug}/solution${querySuffix}`}
              className="inline-flex h-14 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#6366f1] to-[#3378b9] text-base font-extrabold text-white shadow-lg shadow-blue-200"
            >
              <BookOpenCheck size={20} /> Solution
            </Link>
          </div>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            {isSectionResult && nextSection && nextSection.status !== "locked" && (
              <Link
                href={`/student/mock-tests/${slug}/exam?section=${encodeURIComponent(nextSection.slug)}&examWindow=1`}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#027a48] px-5 text-sm font-bold text-white"
              >
                Continue to {nextSection.name}
              </Link>
            )}

            {isSectionResult && (
              <>
                <Link
                  href={`/student/mock-tests/${slug}/setup`}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#3378b9] px-5 text-sm font-bold text-white"
                >
                  Back to Sections
                </Link>
                {!passed && allowSectionRetry && (
                  <Link
                    href={`/student/mock-tests/${slug}/exam?section=${encodeURIComponent(sectionSlug || result.sectionSlug || "")}&examWindow=1`}
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-[#cdd6e2] bg-white px-5 text-sm font-bold text-[#172a69]"
                  >
                    <RotateCcw size={16} /> Retry Section
                  </Link>
                )}
              </>
            )}

            {(!isSectionResult || allSectionsDone) && (
              <Link
                href={allowSectionRetry ? `/student/mock-tests/${slug}/instructions` : `/student/mock-tests/${slug}/setup`}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#3378b9] px-5 text-sm font-bold text-white"
              >
                <RotateCcw size={16} /> {allowSectionRetry ? "Retake Test" : "Reattempt Full Mock"}
              </Link>
            )}

            <Link
              href={categorySlug ? `/mock-tests/${categorySlug}` : "/mock-tests"}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-[#cdd6e2] bg-white px-5 text-sm font-bold text-[#172a69]"
            >
              <ArrowLeft size={16} /> Back to Series
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

function TopperComparisonChart({
  overall,
  sections,
}: {
  overall?: { your_score: number; topper_score: number; average_score: number } | null;
  sections: Array<{
    section_name: string;
    score: number;
    comparison?: { your_score: number; topper_score: number; average_score: number };
  }>;
}) {
  const rows = [
    ...(overall
      ? [{ name: "Overall", you: overall.your_score, topper: overall.topper_score, average: overall.average_score }]
      : []),
    ...sections.map((section) => ({
      name: section.section_name,
      you: section.comparison?.your_score ?? section.score,
      topper: section.comparison?.topper_score ?? section.score,
      average: section.comparison?.average_score ?? section.score,
    })),
  ];

  if (!rows.length) return null;

  const maxValue = Math.max(1, ...rows.flatMap((row) => [row.you, row.topper, row.average]));

  return (
    <div className="rounded-[24px] border border-[#dfe5ef] bg-white p-5 shadow-sm sm:p-6">
      <h2 className="text-lg font-extrabold text-[#172a69]">Toppers Comparison</h2>
      <p className="mt-1 text-sm font-semibold text-[#667085]">
        Compare your score with the topper and average after completing this test.
      </p>
      <div className="mt-4 flex flex-wrap gap-4 text-xs font-bold uppercase tracking-[0.12em] text-[#667085]">
        <span className="inline-flex items-center gap-2"><span className="h-3 w-3 rounded-sm bg-[#3378b9]" /> You</span>
        <span className="inline-flex items-center gap-2"><span className="h-3 w-3 rounded-sm bg-[#f5c518]" /> Topper</span>
        <span className="inline-flex items-center gap-2"><span className="h-3 w-3 rounded-sm bg-[#98a2b3]" /> Average</span>
      </div>
      <div className="mt-5 space-y-5">
        {rows.map((row) => (
          <div key={row.name}>
            <p className="mb-2 text-sm font-extrabold text-[#172a69]">{row.name}</p>
            <div className="grid gap-1.5">
              {[
                { label: "You", value: row.you, color: "bg-[#3378b9]" },
                { label: "Topper", value: row.topper, color: "bg-[#f5c518]" },
                { label: "Average", value: row.average, color: "bg-[#98a2b3]" },
              ].map((bar) => (
                <div key={bar.label} className="flex items-center gap-3">
                  <span className="w-16 text-[11px] font-bold uppercase tracking-wide text-[#667085]">{bar.label}</span>
                  <div className="h-4 flex-1 overflow-hidden rounded-full bg-[#eef2f7]">
                    <div className={`h-full rounded-full ${bar.color}`} style={{ width: `${Math.max(4, (bar.value / maxValue) * 100)}%` }} />
                  </div>
                  <span className="w-14 text-right text-sm font-extrabold text-[#172a69]">{bar.value}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SectionProgressRow({ section, isCurrent }: { section: MockTestSection; isCurrent: boolean }) {
  const statusStyles = {
    passed: "border-[#abefc6] bg-[#ecfdf3] text-[#027a48]",
    completed: "border-[#b2ddff] bg-[#eff8ff] text-[#175cd3]",
    available: "border-[#b2ddff] bg-[#eff8ff] text-[#175cd3]",
    locked: "border-[#eaecf0] bg-[#f9fafb] text-[#667085]",
  };

  const statusLabel = {
    passed: "Passed",
    completed: "Submitted",
    available: "Available",
    locked: "Locked",
  };

  const latest = section.latest_attempt;

  return (
    <div
      className={`flex flex-wrap items-center justify-between gap-3 rounded-2xl border px-4 py-3 ${
        isCurrent ? "ring-2 ring-[#3378b9]" : ""
      } ${statusStyles[section.status]}`}
    >
      <div className="flex items-center gap-3">
        {section.status === "locked" ? <Lock size={18} /> : section.status === "passed" ? <CheckCircle2 size={18} /> : section.status === "completed" ? <CheckCircle2 size={18} /> : <Clock3 size={18} />}
        <div>
          <p className="font-extrabold">{section.name}</p>
          <p className="text-xs font-semibold opacity-80">
            Pass: {section.passing_percentage}% · {section.duration_minutes} min
            {latest ? ` · Last: ${latest.percentage.toFixed(1)}%` : ""}
          </p>
        </div>
      </div>
      <span className="rounded-full bg-white/70 px-3 py-1 text-xs font-extrabold uppercase tracking-[0.12em]">
        {statusLabel[section.status]}
      </span>
    </div>
  );
}

function ResultHighlight({
  icon,
  label,
  value,
  hint,
  toneClass,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  hint: string;
  toneClass: string;
}) {
  return (
    <div className="rounded-[24px] border border-[#dfe5ef] bg-white p-5 shadow-sm">
      <div className={toneClass}>{icon}</div>
      <p className="mt-3 text-xs font-extrabold uppercase tracking-[0.14em] text-[#667085]">{label}</p>
      <p className={`mt-2 text-3xl font-black ${toneClass}`}>{value}</p>
      <p className="mt-1 text-xs font-semibold text-[#667085]">{hint}</p>
    </div>
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

function formatDuration(totalSeconds: number) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours}h ${String(minutes).padStart(2, "0")}m`;
  }

  return `${minutes}m ${String(seconds).padStart(2, "0")}s`;
}
