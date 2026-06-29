"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, BookOpenCheck, Loader2 } from "lucide-react";
import {
  fetchMockAttemptBySlug,
  fetchMockAttemptDetail,
  formatMockDuration,
  type MockAttemptDetail,
  type MockAttemptTopicSummary,
} from "@/lib/mock-attempt-analysis";
import { getMockResult } from "@/lib/mock-results";
import { getStudentSession, isStudentLoggedIn } from "@/lib/student-auth";

export default function MockAnalysisPage() {
  const router = useRouter();
  const params = useParams<{ slug: string }>();
  const searchParams = useSearchParams();
  const slug = params.slug;
  const [detail, setDetail] = useState<MockAttemptDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [topicTab, setTopicTab] = useState<"weakness" | "strength">("weakness");
  const [timeSection, setTimeSection] = useState("");
  const [zoneSection, setZoneSection] = useState("");

  useEffect(() => {
    const target = `/student/mock-tests/${slug}/analysis`;
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
        setTimeSection(payload.sections[0]?.section_name || "");
        setZoneSection(payload.sections[0]?.section_name || "");
      })
      .catch(() => setError("Unable to load result analysis. Please complete the test again."))
      .finally(() => setLoading(false));
  }, [router, searchParams, slug]);

  const weaknessTopics = useMemo(
    () => detail?.topics.filter((topic) => topic.attempted > 0 && (topic.accuracy < 60 || topic.incorrect > 0)) ?? [],
    [detail]
  );
  const strengthTopics = useMemo(
    () => detail?.topics.filter((topic) => topic.attempted > 0 && topic.accuracy >= 70 && topic.incorrect === 0) ?? [],
    [detail]
  );
  const activeTopics = topicTab === "weakness" ? weaknessTopics : strengthTopics;
  const attemptQuery = detail?.attempt.id ? `?attempt=${detail.attempt.id}` : "";

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
            <Link href={`/student/mock-tests/${slug}/result${attemptQuery}`} className="inline-flex h-10 items-center gap-2 rounded-xl border border-[#cdd6e2] bg-white px-4 text-sm font-bold text-[#172a69]">
              <ArrowLeft size={16} /> Back
            </Link>
            <Link href={`/student/mock-tests/${slug}/solution${attemptQuery}`} className="inline-flex h-10 items-center gap-2 rounded-xl bg-[#3378b9] px-4 text-sm font-bold text-white">
              <BookOpenCheck size={16} /> View Solutions
            </Link>
          </div>
        </div>

        <section className="grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
          <StatCard label="Score" value={`${summary.score}/${summary.total_marks}`} className="bg-[#ecfdf3] text-[#027a48]" />
          <StatCard label="Attempted" value={`${summary.attempted}/${summary.total_questions}`} className="bg-[#fff1f3] text-[#c01048]" />
          <StatCard label="Correct" value={`${summary.correct}/${summary.total_questions}`} className="bg-[#eff8ff] text-[#175cd3]" />
          <StatCard label="Incorrect" value={`${summary.incorrect}/${summary.total_questions}`} className="bg-[#fdf2fa] text-[#c11574]" />
          <StatCard label="Skipped" value={`${summary.skipped}/${summary.total_questions}`} className="bg-[#f2f4f7] text-[#344054]" />
          <StatCard label="Unseen" value={`${summary.unseen}/${summary.total_questions}`} className="bg-[#fffaeb] text-[#b54708]" />
        </section>

        <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Accuracy" value={`${summary.accuracy}%`} className="bg-[#f4f3ff] text-[#5925dc]" />
          <StatCard label="Total Time" value={formatMockDuration(summary.duration_seconds)} className="bg-[#fdf2fa] text-[#c11574]" />
          <StatCard label="Utilized Time" value={formatMockDuration(summary.time_utilized_seconds)} className="bg-[#ecfdf3] text-[#027a48]" />
          <StatCard label="Wasted Time" value={formatMockDuration(summary.wasted_time_seconds)} className="bg-[#eff8ff] text-[#175cd3]" />
        </section>

        <section className="overflow-hidden rounded-[24px] border border-[#dfe5ef] bg-white shadow-sm">
          <div className="border-b border-[#e5eaf2] px-5 py-4">
            <h2 className="text-lg font-extrabold text-[#172a69]">Sectional Summary</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-[#f8fafc] text-left text-xs font-extrabold uppercase tracking-[0.12em] text-[#667085]">
                <tr>
                  {["Section", "Attempted", "Correct", "Incorrect", "Skipped", "Unseen", "Accuracy", "Score", "Time"].map((head) => (
                    <th key={head} className="px-4 py-3">{head}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sections.map((section) => (
                  <tr key={section.section_name} className="border-t border-[#eef2f7]">
                    <td className="px-4 py-3 font-bold text-[#172a69]">{section.section_name}</td>
                    <td className="px-4 py-3">{section.attempted}/{section.total_questions}</td>
                    <td className="px-4 py-3">{section.correct}</td>
                    <td className="px-4 py-3">{section.incorrect}</td>
                    <td className="px-4 py-3">{section.skipped}</td>
                    <td className="px-4 py-3">{section.unseen}</td>
                    <td className="px-4 py-3">{section.accuracy}%</td>
                    <td className="px-4 py-3 font-bold">{section.score}/{section.total_marks}</td>
                    <td className="px-4 py-3">{formatMockDuration(section.time_spent_seconds)}</td>
                  </tr>
                ))}
                <tr className="border-t border-[#dfe5ef] bg-[#f8fafc] font-extrabold text-[#172a69]">
                  <td className="px-4 py-3">Overall</td>
                  <td className="px-4 py-3">{summary.attempted}/{summary.total_questions}</td>
                  <td className="px-4 py-3">{summary.correct}</td>
                  <td className="px-4 py-3">{summary.incorrect}</td>
                  <td className="px-4 py-3">{summary.skipped}</td>
                  <td className="px-4 py-3">{summary.unseen}</td>
                  <td className="px-4 py-3">{summary.accuracy}%</td>
                  <td className="px-4 py-3">{summary.score}/{summary.total_marks}</td>
                  <td className="px-4 py-3">{formatMockDuration(summary.time_utilized_seconds)}</td>
                </tr>
              </tbody>
            </table>
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
                  <TopicRow key={`${topic.section_name}-${topic.topic}`} topic={topic} />
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="rounded-[24px] border border-[#dfe5ef] bg-white p-5 shadow-sm">
          <h2 className="text-lg font-extrabold text-[#172a69]">Your Question Selection Order</h2>
          <p className="mt-2 text-sm font-semibold text-[#667085]">Order in which you attempted questions during the test.</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {detail.selection_order.map((number) => (
              <span key={number} className="grid h-10 min-w-10 place-items-center rounded-lg bg-[#fce7f3] px-2 text-sm font-extrabold text-[#9d174d]">
                {number}
              </span>
            ))}
          </div>
        </section>

        <section className="rounded-[24px] border border-[#dfe5ef] bg-white p-5 shadow-sm">
          <h2 className="text-lg font-extrabold text-[#172a69]">Time Split Insights (Section Wise)</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-[#f8fafc] text-left text-xs font-extrabold uppercase tracking-[0.12em] text-[#667085]">
                <tr>
                  {["Section Name", "Correct Answer Time", "Wrong Answer Time", "Skipped Question Time"].map((head) => (
                    <th key={head} className="px-4 py-3">{head}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {detail.time_split.sections.map((row) => (
                  <tr key={row.section_name} className="border-t border-[#eef2f7]">
                    <td className="px-4 py-3 font-bold text-[#172a69]">{row.section_name}</td>
                    <td className="px-4 py-3">{formatMockDuration(row.correct_time_seconds)}</td>
                    <td className="px-4 py-3">{formatMockDuration(row.wrong_time_seconds)}</td>
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
                  {["Topic Name", "Correct Answer Time", "Wrong Answer Time", "Skipped Question Time"].map((head) => (
                    <th key={head} className="px-4 py-3">{head}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sectionTimeRows.map((row) => (
                  <tr key={`${row.section_name}-${row.topic}`} className="border-t border-[#eef2f7]">
                    <td className="px-4 py-3 font-bold text-[#172a69]">{row.topic}</td>
                    <td className="px-4 py-3">{formatMockDuration(row.correct_time_seconds)}</td>
                    <td className="px-4 py-3">{formatMockDuration(row.wrong_time_seconds)}</td>
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

function TopicRow({ topic }: { topic: MockAttemptTopicSummary }) {
  return (
    <tr className="border-t border-[#eef2f7]">
      <td className="px-3 py-3 font-bold text-[#172a69]">{topic.topic}</td>
      <td className="px-3 py-3">
        <div className="flex flex-wrap gap-2">
          {topic.question_numbers.map((number) => (
            <span
              key={number}
              className={`grid h-8 min-w-8 place-items-center rounded-md px-2 text-xs font-extrabold ${
                topic.incorrect > 0 ? "bg-[#ffedd5] text-[#c2410c]" : "bg-[#f2f4f7] text-[#475467]"
              }`}
            >
              {number}
            </span>
          ))}
        </div>
      </td>
      <td className="px-3 py-3 font-bold">{topic.accuracy}%</td>
    </tr>
  );
}
