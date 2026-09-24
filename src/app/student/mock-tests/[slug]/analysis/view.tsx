"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { staticReplace } from "@/lib/static-nav";
import { useLiveParam } from "@/lib/use-live-param";
import { ArrowLeft, BookOpenCheck, Loader2 } from "lucide-react";
import {
  fetchMockAttemptBySlug,
  fetchMockAttemptDetail,
  formatMockDuration,
  type MockAttemptDetail,
  type MockAttemptQuestion,
  type MockAttemptTopicSummary,
} from "@/lib/mock-attempt-analysis";
import { accuracyToneClass, scoreToneClass } from "@/components/student/mock-exam-status";
import { MarksCalculationCard, SubjectMarksTable } from "@/components/student/MarksCalculation";
import { getMockResult } from "@/lib/mock-results";
import { getStudentSession, isStudentLoggedIn } from "@/lib/student-auth";

export default function MockAnalysisPage() {
  const searchParams = useSearchParams();
  const slug = useLiveParam("slug", 2);
  const [detail, setDetail] = useState<MockAttemptDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [topicTab, setTopicTab] = useState<"weakness" | "strength">("weakness");
  const [timeSection, setTimeSection] = useState("");
  const [zoneSection, setZoneSection] = useState("");

  useEffect(() => {
    const target = `/student/mock-tests/${slug}/analysis`;
    if (!isStudentLoggedIn()) {
      staticReplace(`/login?redirect=${encodeURIComponent(target)}`);
      return;
    }

    const session = getStudentSession();
    if (!session?.email) return;

    const attemptId = searchParams.get("attempt") || getMockResult(slug)?.attemptId;
    const loader = fetchMockAttemptBySlug(session.email, slug, true).catch(() => (
      attemptId ? fetchMockAttemptDetail(session.email, Number(attemptId)) : Promise.reject(new Error("missing"))
    ));

    loader
      .then((payload) => {
        setDetail(payload);
        setTimeSection(payload.sections[0]?.section_name || "");
        setZoneSection(payload.sections[0]?.section_name || "");
      })
      .catch(() => setError("Unable to load result analysis. Please complete the test again."))
      .finally(() => setLoading(false));
  }, [searchParams, slug]);

  const weaknessTopics = useMemo(
    () => detail?.topics.filter((topic) => topic.attempted > 0 && (topic.accuracy < 60 || topic.incorrect > 0)) ?? [],
    [detail]
  );
  const strengthTopics = useMemo(
    () => detail?.topics.filter((topic) => topic.attempted > 0 && topic.accuracy >= 70 && topic.incorrect === 0) ?? [],
    [detail]
  );
  const questionStatusByNumber = useMemo(() => {
    const map = new Map<number, MockAttemptQuestion["status"]>();
    for (const question of detail?.questions ?? []) {
      map.set(question.question_number, question.status);
    }
    return map;
  }, [detail]);
  const activeTopics = topicTab === "weakness" ? weaknessTopics : strengthTopics;

  if (loading) {
    return <main className="grid min-h-screen place-items-center bg-[#eef3f8]"><Loader2 className="animate-spin text-[#3378b9]" size={34} /></main>;
  }

  if (error || !detail) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#eef3f8] px-4 text-center">
        <div className="max-w-md rounded-[24px] bg-white p-8 shadow-lg">
          <p className="text-sm font-bold text-[#667085]">{error || "Result not found."}</p>
          <Link href={`/student/mock-tests/${slug}/result`} className="mt-4 inline-flex h-11 items-center rounded-xl bg-[#3378b9] px-5 text-sm font-bold text-white">
            Back
          </Link>
        </div>
      </main>
    );
  }

  const { summary, sections } = detail;
  const sectionTimeRows = detail.time_split.topics.filter((row) => row.section_name === timeSection);
  const zoneRows = (topicTab === "weakness" ? detail.weak_zones : detail.strong_zones).find((row) => row.section_name === zoneSection)?.topics ?? [];

  return (
    <main className="min-h-screen bg-[#eef3f8] px-4 py-6 pb-10" style={{ fontFamily: "'Plus Jakarta Sans', Inter, ui-sans-serif, system-ui, sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');`}</style>

      <div className="mx-auto max-w-6xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#3378b9]">Result Analysis</p>
            <h1 className="text-2xl font-extrabold tracking-[-0.04em] text-[#172a69]">{detail.attempt.test_title}</h1>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href={`/student/mock-tests/${slug}/result`} className="inline-flex h-10 items-center gap-2 rounded-xl border border-[#cdd6e2] bg-white px-4 text-sm font-bold text-[#172a69]">
              <ArrowLeft size={16} /> View Result
            </Link>
            <Link href={`/student/mock-tests/${slug}/solution`} className="inline-flex h-10 items-center gap-2 rounded-xl bg-[#3378b9] px-4 text-sm font-bold text-white">
              <BookOpenCheck size={16} /> View Answers
            </Link>
          </div>
        </div>

        <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-[#dfe5ef] bg-white p-5 shadow-sm">
            <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-[#667085]">Your Score</p>
            <p className={`mt-2 text-3xl font-black ${scoreToneClass(summary.score, summary.total_marks)}`}>
              {summary.score} <span className="text-lg font-bold text-[#667085]">/ {summary.total_marks}</span>
            </p>
            <p className="mt-1 text-xs font-semibold text-[#667085]">Negative scores appear in red</p>
          </div>
          <div className="rounded-2xl border border-[#dfe5ef] bg-white p-5 shadow-sm">
            <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-[#667085]">Your Rank</p>
            <p className="mt-2 text-3xl font-black text-[#7c3aed]">
              {summary.rank ?? '—'}
              {summary.total_participants ? <span className="text-lg font-bold text-[#667085]"> / {summary.total_participants}</span> : null}
            </p>
            <p className="mt-1 text-xs font-semibold text-[#667085]">Out of all test takers</p>
          </div>
          <div className="rounded-2xl border border-[#dfe5ef] bg-white p-5 shadow-sm">
            <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-[#667085]">Your Percentile</p>
            <p className={`mt-2 text-3xl font-black ${accuracyToneClass(summary.percentile ?? 0)}`}>{summary.percentile ?? 0}%ile</p>
            <p className="mt-1 text-xs font-semibold text-[#667085]">Better than this % of test takers</p>
          </div>
          <div className="rounded-2xl border border-[#dfe5ef] bg-white p-5 shadow-sm">
            <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-[#667085]">Accuracy</p>
            <p className={`mt-2 text-3xl font-black ${accuracyToneClass(summary.accuracy)}`}>{summary.accuracy}%</p>
            <p className="mt-1 text-xs font-semibold text-[#667085]">Correct answers vs attempted</p>
          </div>
        </section>

        <MarksCalculationCard scoring={summary.scoring} />
        <SubjectMarksTable sections={sections} overall={summary.scoring} />

        <section className="grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
          <StatCard label="Attempted" value={`${summary.attempted}/${summary.total_questions}`} className="bg-[#fff1f3] text-[#c01048]" />
          <StatCard label="Correct" value={`${summary.correct}/${summary.total_questions}`} className="bg-[#ecfdf3] text-[#027a48]" />
          <StatCard label="Incorrect" value={`${summary.incorrect}/${summary.total_questions}`} className="bg-[#fef2f2] text-[#dc2626]" />
          <StatCard label="Unattempted" value={`${summary.skipped + summary.unseen}/${summary.total_questions}`} className="bg-[#f2f4f7] text-[#344054]" />
          <StatCard label="Total Time" value={formatMockDuration(summary.duration_seconds)} className="bg-[#fdf2fa] text-[#c11574]" />
          <StatCard label="Utilized Time" value={formatMockDuration(summary.time_utilized_seconds)} className="bg-[#ecfdf3] text-[#027a48]" />
        </section>

        <section className="rounded-[24px] border border-[#dfe5ef] bg-white p-5 shadow-sm sm:p-6">
          <h2 className="text-lg font-extrabold text-[#172a69]">Toppers Comparison</h2>
          <p className="mt-1 text-sm font-semibold text-[#667085]">Compare your score with the topper and average after completing this test.</p>
          <div className="mt-5 space-y-5">
            {([
              {
                name: "Overall",
                you: detail.comparison?.your_score ?? summary.comparison?.your_score ?? summary.score,
                topper: detail.comparison?.topper_score ?? summary.comparison?.topper_score ?? summary.topper_score ?? summary.score,
                average: detail.comparison?.average_score ?? summary.comparison?.average_score ?? summary.average_score ?? summary.score,
              },
              ...sections.map((section) => ({
                name: section.section_name,
                you: section.comparison?.your_score ?? section.score,
                topper: section.comparison?.topper_score ?? section.score,
                average: section.comparison?.average_score ?? section.score,
              })),
            ] as Array<{ name: string; you: number; topper: number; average: number }>).map((row) => {
              const maxValue = Math.max(1, row.you, row.topper, row.average);
              return (
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
              );
            })}
          </div>
        </section>

        <section className="overflow-hidden rounded-[24px] border border-[#dfe5ef] bg-white shadow-sm">
          <div className="border-b border-[#e5eaf2] px-5 py-4">
            <h2 className="text-lg font-extrabold text-[#172a69]">Sectional Summary</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-[#f8fafc] text-left text-xs font-extrabold uppercase tracking-[0.12em] text-[#667085]">
                <tr>
                  {["Section", "Attempted", "Correct", "Incorrect", "Unattempted", "Unseen", "Accuracy", "+ Marks", "− Marks", "Score", "%", "Percentile", "Time"].map((head) => (
                    <th key={head} className="px-4 py-3">{head}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sections.map((section) => (
                  <tr key={section.section_name} className="border-t border-[#eef2f7]">
                    <td className="px-4 py-3 font-bold text-[#172a69]">{section.section_name}</td>
                    <td className="px-4 py-3">{section.attempted}/{section.total_questions}</td>
                    <td className="px-4 py-3 font-extrabold text-[#16a34a]">{section.correct}</td>
                    <td className="px-4 py-3 font-extrabold text-[#dc2626]">{section.incorrect}</td>
                    <td className="px-4 py-3">{section.skipped}</td>
                    <td className="px-4 py-3">{section.unseen}</td>
                    <td className={`px-4 py-3 font-bold ${accuracyToneClass(section.accuracy)}`}>{section.accuracy}%</td>
                    <td className="px-4 py-3 font-extrabold text-[#16a34a]">+{section.scoring?.positive_marks ?? section.positive_marks ?? 0}</td>
                    <td className="px-4 py-3 font-extrabold text-[#dc2626]">−{section.scoring?.negative_marks ?? section.negative_marks ?? 0}</td>
                    <td className={`px-4 py-3 font-extrabold ${scoreToneClass(section.score, section.total_marks)}`}>{section.score}/{section.total_marks}</td>
                    <td className="px-4 py-3 font-bold text-[#175cd3]">{(section.percentage ?? 0).toFixed(1)}%</td>
                    <td className={`px-4 py-3 font-bold ${accuracyToneClass(section.percentile ?? 0)}`}>{section.percentile != null ? `${section.percentile}%ile` : "—"}</td>
                    <td className="px-4 py-3">{formatMockDuration(section.time_spent_seconds)}</td>
                  </tr>
                ))}
                <tr className="border-t border-[#dfe5ef] bg-[#f8fafc] font-extrabold text-[#172a69]">
                  <td className="px-4 py-3">Overall</td>
                  <td className="px-4 py-3">{summary.attempted}/{summary.total_questions}</td>
                  <td className="px-4 py-3 text-[#16a34a]">{summary.correct}</td>
                  <td className="px-4 py-3 text-[#dc2626]">{summary.incorrect}</td>
                  <td className="px-4 py-3">{summary.skipped}</td>
                  <td className="px-4 py-3">{summary.unseen}</td>
                  <td className={accuracyToneClass(summary.accuracy)}>{summary.accuracy}%</td>
                  <td className="text-[#16a34a]">+{summary.scoring?.positive_marks ?? 0}</td>
                  <td className="text-[#dc2626]">−{summary.scoring?.negative_marks ?? 0}</td>
                  <td className={scoreToneClass(summary.score, summary.total_marks)}>{summary.score}/{summary.total_marks}</td>
                  <td className="px-4 py-3 text-[#175cd3]">{(summary.percentage ?? 0).toFixed(1)}%</td>
                  <td className={accuracyToneClass(summary.percentile ?? 0)}>{summary.percentile != null ? `${summary.percentile}%ile` : "—"}</td>
                  <td className="px-4 py-3">{formatMockDuration(summary.time_utilized_seconds)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[24px] border border-[#dfe5ef] bg-white p-5 shadow-sm">
            <h2 className="text-lg font-extrabold text-[#172a69]">Section Score Performance</h2>
            <p className="mt-1 text-sm font-semibold text-[#667085]">Purple bars show positive scores. Red bars show negative or zero scores.</p>
            <div className="mt-5 space-y-4">
              {sections.map((section) => {
                const width = section.total_marks
                  ? Math.min(100, Math.abs(section.score / section.total_marks) * 100)
                  : 0;
                const negative = section.score <= 0;
                return (
                  <div key={`chart-${section.section_name}`}>
                    <div className="mb-1 flex items-center justify-between text-sm">
                      <span className="font-bold text-[#172a69]">{section.section_name}</span>
                      <span className={`font-extrabold ${scoreToneClass(section.score, section.total_marks)}`}>
                        {section.score} / {section.total_marks}
                      </span>
                    </div>
                    <div className="h-8 overflow-hidden rounded-md bg-[#eef2f7]">
                      <div
                        className={`h-full ${negative ? "bg-[#ef4444]" : "bg-[#7c3aed]"}`}
                        style={{ width: `${Math.max(width, 4)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
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
                    <th className="px-4 py-3">Accuracy</th>
                  </tr>
                </thead>
                <tbody>
                  {sections.map((section) => (
                    <tr key={`wise-${section.section_name}`} className="border-t border-[#eef2f7]">
                      <td className="px-4 py-3 font-bold text-[#172a69]">{section.section_name}</td>
                      <td className={`px-4 py-3 font-extrabold ${scoreToneClass(section.score, section.total_marks)}`}>
                        {section.score} / {section.total_marks}
                      </td>
                      <td className={`px-4 py-3 font-bold ${accuracyToneClass(section.accuracy)}`}>{section.accuracy}%</td>
                    </tr>
                  ))}
                  <tr className="border-t border-[#dfe5ef] bg-[#f8fafc] font-extrabold">
                    <td className="px-4 py-3 text-[#172a69]">TOTAL</td>
                    <td className={`px-4 py-3 ${scoreToneClass(summary.score, summary.total_marks)}`}>
                      {summary.score} / {summary.total_marks}
                    </td>
                    <td className={`px-4 py-3 ${accuracyToneClass(summary.accuracy)}`}>{summary.accuracy}%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section className="rounded-[24px] border border-[#dfe5ef] bg-white p-5 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-extrabold text-[#172a69]">Know Your Weakness</h2>
            <div className="flex rounded-xl bg-[#f2f4f7] p-1">
              {(["weakness", "strength"] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setTopicTab(tab)}
                  className={`rounded-lg px-4 py-2 text-sm font-bold capitalize ${topicTab === tab ? "bg-white text-[#172a69] shadow-sm" : "text-[#667085]"}`}
                >
                  {tab === "weakness" ? "Weakness" : "Strengths"}
                </button>
              ))}
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-3 text-xs font-bold">
            <span className="inline-flex items-center gap-2"><span className="grid h-6 w-6 place-items-center rounded bg-[#22c55e] text-white">1</span> Correct</span>
            <span className="inline-flex items-center gap-2"><span className="grid h-6 w-6 place-items-center rounded bg-[#ef4444] text-white">2</span> Incorrect</span>
            <span className="inline-flex items-center gap-2"><span className="grid h-6 w-6 place-items-center rounded bg-[#e4e7ec] text-[#475467]">3</span> Unattempted</span>
            <span className="inline-flex items-center gap-2"><span className="grid h-6 w-6 place-items-center rounded bg-[#ffedd5] text-[#9a3412]">4</span> Unseen</span>
          </div>
          <div className="mt-5 overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="text-left text-xs font-extrabold uppercase tracking-[0.12em] text-[#667085]">
                <tr>
                  <th className="px-3 py-2">Topic Name</th>
                  <th className="px-3 py-2">Questions</th>
                  <th className="px-3 py-2">Correct</th>
                </tr>
              </thead>
              <tbody>
                {activeTopics.map((topic) => (
                  <TopicRow key={`${topic.section_name}-${topic.topic}`} topic={topic} statusByNumber={questionStatusByNumber} />
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="rounded-[24px] border border-[#dfe5ef] bg-white p-5 shadow-sm">
          <h2 className="text-lg font-extrabold text-[#172a69]">Your Question Selection Order</h2>
          <p className="mt-2 text-sm font-semibold text-[#667085]">Order in which you attempted questions during the test.</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {detail.selection_order.map((number) => {
              const status = questionStatusByNumber.get(number) ?? "unseen";
              const boxClass =
                status === "correct"
                  ? "bg-[#22c55e] text-white"
                  : status === "incorrect"
                    ? "bg-[#ef4444] text-white"
                    : status === "skipped"
                      ? "bg-[#e4e7ec] text-[#475467]"
                      : "bg-[#ffedd5] text-[#9a3412]";
              return (
                <span key={number} className={`grid h-10 min-w-10 place-items-center rounded-lg px-2 text-sm font-extrabold ${boxClass}`}>
                  {number}
                </span>
              );
            })}
          </div>
        </section>

        <section className="rounded-[24px] border border-[#dfe5ef] bg-white p-5 shadow-sm">
          <h2 className="text-lg font-extrabold text-[#172a69]">Time Split Insights (Section Wise)</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-[#f8fafc] text-left text-xs font-extrabold uppercase tracking-[0.12em] text-[#667085]">
                <tr>
                  {["Section Name", "Correct Answer Time", "Wrong Answer Time", "Unattempted Question Time"].map((head) => (
                    <th key={head} className="px-4 py-3">{head}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {detail.time_split.sections.map((row) => (
                  <tr key={row.section_name} className="border-t border-[#eef2f7]">
                    <td className="px-4 py-3 font-bold text-[#172a69]">{row.section_name}</td>
                    <td className="px-4 py-3 font-bold text-[#16a34a]">{formatMockDuration(row.correct_time_seconds)}</td>
                    <td className="px-4 py-3 font-bold text-[#dc2626]">{formatMockDuration(row.wrong_time_seconds)}</td>
                    <td className="px-4 py-3">{formatMockDuration(row.skipped_time_seconds)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="rounded-[24px] border border-[#dfe5ef] bg-white p-5 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-extrabold text-[#172a69]">Time Split Insights (Topic-wise)</h2>
            <select value={timeSection} onChange={(event) => setTimeSection(event.target.value)} className="rounded-xl border border-[#cdd6e2] px-3 py-2 text-sm font-bold text-[#172a69]">
              {sections.map((section) => (
                <option key={section.section_name} value={section.section_name}>{section.section_name}</option>
              ))}
            </select>
          </div>
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="text-left text-xs font-extrabold uppercase tracking-[0.12em] text-[#667085]">
                <tr>
                  {["Topic Name", "Correct Answer Time", "Wrong Answer Time", "Unattempted Question Time"].map((head) => (
                    <th key={head} className="px-4 py-3">{head}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sectionTimeRows.map((row) => (
                  <tr key={`${row.section_name}-${row.topic}`} className="border-t border-[#eef2f7]">
                    <td className="px-4 py-3 font-bold text-[#172a69]">{row.topic}</td>
                    <td className="px-4 py-3 font-bold text-[#16a34a]">{formatMockDuration(row.correct_time_seconds)}</td>
                    <td className="px-4 py-3 font-bold text-[#dc2626]">{formatMockDuration(row.wrong_time_seconds)}</td>
                    <td className="px-4 py-3">{formatMockDuration(row.skipped_time_seconds)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="rounded-[24px] border border-[#dfe5ef] bg-white p-5 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-extrabold text-[#172a69]">{topicTab === "weakness" ? "Weak Zones" : "Strong Zones"}</h2>
            <select value={zoneSection} onChange={(event) => setZoneSection(event.target.value)} className="rounded-xl border border-[#cdd6e2] px-3 py-2 text-sm font-bold text-[#172a69]">
              {sections.map((section) => (
                <option key={section.section_name} value={section.section_name}>{section.section_name}</option>
              ))}
            </select>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {zoneRows.map((topic, index) => (
              <span key={topic.topic} className="rounded-lg bg-[#fff1f3] px-3 py-2 text-xs font-extrabold uppercase tracking-[0.08em] text-[#9f1239]">
                {index + 1}. {topic.topic}
              </span>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

function StatCard({ label, value, className }: { label: string; value: string; className: string }) {
  return (
    <div className={`rounded-2xl p-4 text-center ${className}`}>
      <strong className="block text-xl font-extrabold">{value}</strong>
      <span className="mt-1 block text-[11px] font-extrabold uppercase tracking-[0.14em] opacity-80">{label}</span>
    </div>
  );
}

function TopicRow({
  topic,
  statusByNumber,
}: {
  topic: MockAttemptTopicSummary;
  statusByNumber: Map<number, MockAttemptQuestion["status"]>;
}) {
  return (
    <tr className="border-t border-[#eef2f7]">
      <td className="px-3 py-3 font-bold text-[#172a69]">{topic.topic}</td>
      <td className="px-3 py-3">
        <div className="flex flex-wrap gap-2">
          {topic.question_numbers.map((number) => {
            const status = statusByNumber.get(number) ?? "unseen";
            const boxClass =
              status === "correct"
                ? "bg-[#22c55e] text-white"
                : status === "incorrect"
                  ? "bg-[#ef4444] text-white"
                  : status === "skipped"
                    ? "bg-[#e4e7ec] text-[#475467]"
                    : "bg-[#ffedd5] text-[#9a3412]";
            return (
              <span key={number} className={`grid h-8 min-w-8 place-items-center rounded-md px-2 text-xs font-extrabold ${boxClass}`}>
                {number}
              </span>
            );
          })}
        </div>
      </td>
      <td className={`px-3 py-3 font-bold ${accuracyToneClass(topic.accuracy)}`}>{topic.accuracy}%</td>
    </tr>
  );
}
