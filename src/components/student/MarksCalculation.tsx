import { scoreToneClass } from "@/components/student/mock-exam-status";
import type { MockAttemptSectionSummary, MockScoringBreakdown } from "@/lib/mock-attempt-analysis";

function formatMarks(value: number) {
  const rounded = Math.round(value * 100) / 100;
  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(2).replace(/0+$/, "").replace(/\.$/, "");
}

export function MarksCalculationCard({
  scoring,
  title = "Marks Calculation",
}: {
  scoring?: MockScoringBreakdown | null;
  title?: string;
}) {
  if (!scoring) return null;

  return (
    <div className="rounded-[24px] border border-[#dfe5ef] bg-white p-5 shadow-sm sm:p-6">
      <h2 className="text-lg font-extrabold text-[#172a69]">{title}</h2>
      <p className="mt-1 text-sm font-semibold text-[#667085]">
        Correct answers add marks. Wrong answers deduct negative marks. Unattempted questions get 0.
      </p>
      <div className="mt-4 overflow-hidden rounded-2xl border border-[#e5eaf2]">
        <table className="min-w-full text-sm">
          <tbody>
            <tr className="border-b border-[#eef2f7]">
              <td className="px-4 py-3 font-bold text-[#027a48]">Correct</td>
              <td className="px-4 py-3 font-semibold text-[#667085]">{scoring.correct_line}</td>
              <td className="px-4 py-3 text-right font-extrabold text-[#16a34a]">+{formatMarks(scoring.positive_marks)}</td>
            </tr>
            <tr className="border-b border-[#eef2f7]">
              <td className="px-4 py-3 font-bold text-[#b42318]">Wrong</td>
              <td className="px-4 py-3 font-semibold text-[#667085]">{scoring.wrong_line}</td>
              <td className="px-4 py-3 text-right font-extrabold text-[#dc2626]">−{formatMarks(scoring.negative_marks)}</td>
            </tr>
            <tr className="border-b border-[#eef2f7]">
              <td className="px-4 py-3 font-bold text-[#667085]">Unattempted</td>
              <td className="px-4 py-3 font-semibold text-[#667085]">{scoring.skipped_line}</td>
              <td className="px-4 py-3 text-right font-extrabold text-[#667085]">0</td>
            </tr>
            <tr className="bg-[#f8fafc]">
              <td className="px-4 py-3 font-extrabold text-[#172a69]">Net Score</td>
              <td className="px-4 py-3 font-bold text-[#344054]">{scoring.formula}</td>
              <td className={`px-4 py-3 text-right font-black ${scoreToneClass(scoring.net_score, scoring.total_marks)}`}>
                {formatMarks(scoring.net_score)} / {formatMarks(scoring.total_marks)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function SubjectMarksTable({
  sections,
  overall,
}: {
  sections: MockAttemptSectionSummary[];
  overall?: MockScoringBreakdown | null;
}) {
  if (!sections.length) return null;

  return (
    <div className="overflow-hidden rounded-[24px] border border-[#dfe5ef] bg-white shadow-sm">
      <div className="border-b border-[#e5eaf2] px-5 py-4">
        <h2 className="text-lg font-extrabold text-[#172a69]">Subject Wise Marks</h2>
        <p className="mt-1 text-sm font-semibold text-[#667085]">
          Marks for each subject after adding correct scores and deducting negative marks.
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-[#f8fafc] text-left text-xs font-extrabold uppercase tracking-[0.12em] text-[#667085]">
            <tr>
              <th className="px-4 py-3">Subject</th>
              <th className="px-4 py-3">Attempted</th>
              <th className="px-4 py-3">Correct</th>
              <th className="px-4 py-3">Wrong</th>
              <th className="px-4 py-3">Unattempted</th>
              <th className="px-4 py-3">+ Marks</th>
              <th className="px-4 py-3">− Marks</th>
              <th className="px-4 py-3">Score / Max</th>
              <th className="px-4 py-3">Calculation</th>
            </tr>
          </thead>
          <tbody>
            {sections.map((section) => {
              const scoring = section.scoring;
              const positive = scoring?.positive_marks ?? section.positive_marks ?? 0;
              const negative = scoring?.negative_marks ?? section.negative_marks ?? 0;
              return (
                <tr key={section.section_name} className="border-t border-[#eef2f7] align-top">
                  <td className="px-4 py-3 font-bold text-[#172a69]">{section.section_name}</td>
                  <td className="px-4 py-3 font-extrabold text-[#175cd3]">{section.attempted}</td>
                  <td className="px-4 py-3 font-extrabold text-[#16a34a]">{section.correct}</td>
                  <td className="px-4 py-3 font-extrabold text-[#dc2626]">{section.incorrect}</td>
                  <td className="px-4 py-3 font-bold text-[#667085]">{section.skipped + section.unseen}</td>
                  <td className="px-4 py-3 font-extrabold text-[#16a34a]">+{formatMarks(positive)}</td>
                  <td className="px-4 py-3 font-extrabold text-[#dc2626]">−{formatMarks(negative)}</td>
                  <td className={`px-4 py-3 font-extrabold ${scoreToneClass(section.score, section.total_marks)}`}>
                    {formatMarks(section.score)} / {formatMarks(section.total_marks)}
                  </td>
                  <td className="px-4 py-3 text-xs font-semibold text-[#667085]">{scoring?.formula ?? "—"}</td>
                </tr>
              );
            })}
            {overall && (
              <tr className="border-t border-[#dfe5ef] bg-[#f8fafc] font-extrabold">
                <td className="px-4 py-3 text-[#172a69]">TOTAL</td>
                <td className="px-4 py-3 text-[#175cd3]">{sections.reduce((sum, section) => sum + section.attempted, 0)}</td>
                <td className="px-4 py-3 text-[#16a34a]">{overall.correct}</td>
                <td className="px-4 py-3 text-[#dc2626]">{overall.incorrect}</td>
                <td className="px-4 py-3 text-[#667085]">{overall.skipped}</td>
                <td className="px-4 py-3 text-[#16a34a]">+{formatMarks(overall.positive_marks)}</td>
                <td className="px-4 py-3 text-[#dc2626]">−{formatMarks(overall.negative_marks)}</td>
                <td className={scoreToneClass(overall.net_score, overall.total_marks)}>
                  {formatMarks(overall.net_score)} / {formatMarks(overall.total_marks)}
                </td>
                <td className="px-4 py-3 text-xs text-[#344054]">{overall.formula}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
