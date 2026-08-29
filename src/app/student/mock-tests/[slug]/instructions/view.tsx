"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { staticPush, staticReplace } from "@/lib/static-nav";
import { useLiveParam } from "@/lib/use-live-param";
import { Globe2, Loader2 } from "lucide-react";
import { PALETTE_LEGEND, PaletteIcon } from "@/components/student/mock-exam-status";
import { isStudentLoggedIn, getStudentSession } from "@/lib/student-auth";
import { mockTestsApiUrl, type MockTestDetailResponse } from "@/lib/mock-tests";
import { decodeHtmlEntities } from "@/lib/html-entities";

type SectionRow = {
  sl: number;
  name: string;
  questions: number;
  marks: number;
  duration: number | null;
};

export default function DynamicMockInstructionsPage() {
  const slug = useLiveParam("slug", 2);
  const [data, setData] = useState<MockTestDetailResponse | null>(null);
  const [accepted, setAccepted] = useState(false);
  const [loading, setLoading] = useState(true);
  const student = getStudentSession();

  useEffect(() => {
    const target = `/student/mock-tests/${slug}/instructions`;
    if (!isStudentLoggedIn()) {
      staticReplace(`/login?redirect=${encodeURIComponent(target)}`);
      return;
    }

    fetch(mockTestsApiUrl(slug, student?.email))
      .then((response) => {
        if (!response.ok) throw new Error("Not found");
        return response.json();
      })
      .then((payload: MockTestDetailResponse) => {
        if (payload.test.is_locked) {
          staticReplace(`/mock-tests/${payload.test.category_slug ?? ""}`);
          return;
        }

        setData(payload);
      })
      .catch(() => staticReplace("/mock-tests"))
      .finally(() => setLoading(false));
  }, [slug, student?.email]);

  const sectionRows = useMemo(() => (data ? buildSectionRows(data) : []), [data]);

  if (loading || !data) {
    return <LoadingScreen />;
  }

  const test = data.test;
  const adminNotes = (test.instructions || "")
    .split(/\n+/)
    .map((line) => line.trim())
    .map((line) => decodeHtmlEntities(line))
    .filter(Boolean);

  return (
    <main className="min-h-screen bg-[#f2f2f2] text-[#222]" style={{ fontFamily: "Arial, Helvetica, sans-serif" }}>
      <header className="bg-[#3378b9] text-white">
        <div className="flex min-h-[52px] items-center gap-3 px-4 py-3 sm:px-6">
          <Image src="/kr-logics-logo.png" alt="KR Logics logo" width={34} height={34} className="h-8 w-8 rounded-full object-cover" />
          <h1 className="text-[15px] font-semibold leading-snug sm:text-[17px]">{test.title}</h1>
        </div>
      </header>

      <section className="mx-auto max-w-5xl px-3 py-4 sm:px-5">
        <div className="rounded-md border border-[#d0d0d0] bg-white p-4 shadow-sm sm:p-6">
          <h2 className="mb-4 text-[22px] font-bold text-[#111]">Instructions</h2>

          <ol className="space-y-4 text-[14px] leading-7 text-[#222] sm:text-[15px]">
            <li>
              <span className="mr-2 font-bold">1.</span>
              Total duration of this test is <b>{test.duration_minutes} minutes</b>. The countdown timer at the top of the screen will display the remaining time. When the timer reaches zero, the test will be submitted automatically.
            </li>
            <li>
              <span className="mr-2 font-bold">2.</span>
              This test has <b>{test.questions_count} questions</b> for a total of <b>{test.total_marks} marks</b>.
              {data.sequential_sections
                ? " Sections are sequential. You must pass each section to unlock the next one."
                : " You can move between questions using the question palette on the right."}
            </li>
            <li>
              <span className="mr-2 font-bold">3.</span>
              The test is divided into the following sections:
              <div className="mt-3 overflow-x-auto">
                <table className="min-w-full border-collapse border border-[#cfcfcf] text-center text-[13px]">
                  <thead>
                    <tr className="bg-[#e9eef5] text-[#111]">
                      <th className="border border-[#cfcfcf] px-3 py-2 font-bold">SL. No.</th>
                      <th className="border border-[#cfcfcf] px-3 py-2 text-left font-bold">Name of the Test</th>
                      <th className="border border-[#cfcfcf] px-3 py-2 font-bold">No. of Question</th>
                      <th className="border border-[#cfcfcf] px-3 py-2 font-bold">Marks</th>
                      <th className="border border-[#cfcfcf] px-3 py-2 font-bold">Duration (Min)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sectionRows.map((row, index) => (
                      <tr key={row.name} className={index % 2 === 0 ? "bg-white" : "bg-[#f7f7f7]"}>
                        <td className="border border-[#cfcfcf] px-3 py-2">{row.sl}</td>
                        <td className="border border-[#cfcfcf] px-3 py-2 text-left">{row.name}</td>
                        <td className="border border-[#cfcfcf] px-3 py-2">{row.questions}</td>
                        <td className="border border-[#cfcfcf] px-3 py-2">{row.marks}</td>
                        <td className="border border-[#cfcfcf] px-3 py-2">{row.duration ?? "-"}</td>
                      </tr>
                    ))}
                    <tr className="bg-[#eef3f8] font-bold">
                      <td className="border border-[#cfcfcf] px-3 py-2" colSpan={2}>Total</td>
                      <td className="border border-[#cfcfcf] px-3 py-2">{sectionRows.reduce((sum, row) => sum + row.questions, 0)}</td>
                      <td className="border border-[#cfcfcf] px-3 py-2">{sectionRows.reduce((sum, row) => sum + row.marks, 0)}</td>
                      <td className="border border-[#cfcfcf] px-3 py-2">{test.duration_minutes}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </li>
            <li>
              <span className="mr-2 font-bold">4.</span>
              Each question has multiple options. Select the most appropriate answer. Marks for a correct answer and negative marks for a wrong answer are shown on each question.
            </li>
            <li>
              <span className="mr-2 font-bold">5.</span>
              You can change your answer before final submission. Use <b>Mark for review &amp; next</b> if you want to revisit a question later.
            </li>
            <li>
              <span className="mr-2 font-bold">6.</span>
              Do not refresh, close, or switch tabs during the exam. The question palette on the right shows the status of each question using the symbols below.
            </li>
            <li>
              <span className="mr-2 font-bold">7.</span>
              Question Palette Symbols:
              <div className="mt-3 space-y-3">
                {PALETTE_LEGEND.map((item) => (
                  <div key={item.status} className="flex items-center gap-3">
                    <PaletteIcon status={item.status} number={1} />
                    <span>{item.label}</span>
                  </div>
                ))}
              </div>
            </li>
            {adminNotes.map((note, index) => (
              <li key={`${note}-${index}`}>
                <span className="mr-2 font-bold">{8 + index}.</span>
                {note}
              </li>
            ))}
          </ol>

          <div className="mt-8 border-t border-[#e0e0e0] pt-5">
            <label className="flex flex-wrap items-center gap-3 text-sm text-[#222]">
              Choose your default language:
              <span className="inline-flex h-9 items-center gap-2 rounded border border-[#b9b9b9] bg-white px-3">
                <Globe2 size={15} className="text-[#1e4b8c]" />
                <select className="bg-transparent text-sm outline-none">
                  <option>English</option>
                  <option>Hindi</option>
                </select>
              </span>
            </label>
            <label className="mt-5 flex items-start gap-3 text-sm leading-6 text-[#222]">
              <input
                checked={accepted}
                onChange={(event) => setAccepted(event.target.checked)}
                type="checkbox"
                className="mt-1 h-4 w-4"
              />
              <span>I have read and understood the instructions and I am ready to start this mock test.</span>
            </label>
          </div>

          <div className="mt-8 flex justify-center">
            <button
              disabled={!accepted}
              onClick={() => staticPush(`/student/mock-tests/${slug}/setup`)}
              className="h-9 min-w-[96px] rounded border border-[#9a9a9a] bg-[#e6e6e6] px-6 text-sm font-semibold text-[#222] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next &gt;
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}

function buildSectionRows(data: MockTestDetailResponse): SectionRow[] {
  if (data.sections && data.sections.length > 0) {
    return [...data.sections]
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((section, index) => {
        const sectionQuestions = data.questions.filter((question) => question.section_name === section.name);
        const marks = sectionQuestions.length
          ? sectionQuestions.reduce((sum, question) => sum + (question.marks || 0), 0)
          : section.questions_count;
        return {
          sl: index + 1,
          name: section.name,
          questions: section.questions_count || sectionQuestions.length,
          marks,
          duration: section.duration_minutes,
        };
      });
  }

  const grouped = new Map<string, { questions: number; marks: number }>();
  for (const question of data.questions) {
    const name = question.section_name || "General";
    const current = grouped.get(name) ?? { questions: 0, marks: 0 };
    current.questions += 1;
    current.marks += question.marks || 0;
    grouped.set(name, current);
  }

  if (grouped.size === 0) {
    return [
      {
        sl: 1,
        name: data.test.title,
        questions: data.test.questions_count,
        marks: data.test.total_marks,
        duration: data.test.duration_minutes,
      },
    ];
  }

  const entries = Array.from(grouped.entries());
  return entries.map(([name, stats], index) => ({
    sl: index + 1,
    name,
    questions: stats.questions,
    marks: stats.marks,
    duration: entries.length === 1 ? data.test.duration_minutes : null,
  }));
}

function LoadingScreen() {
  return (
    <main className="grid min-h-screen place-items-center bg-[#f2f2f2]">
      <Loader2 className="animate-spin text-[#3378b9]" size={34} />
    </main>
  );
}
