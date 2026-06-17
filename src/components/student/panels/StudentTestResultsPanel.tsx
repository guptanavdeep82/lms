"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { fetchTestAttempts, type MockTestAttemptRecord } from "@/lib/student-dashboard";
import { StudentSectionCard } from "@/components/student/StudentSectionCard";
import { useStudentEmail } from "@/components/student/useStudentEmail";

export function StudentTestResultsPanel() {
  const email = useStudentEmail();
  const [dailyAttempts, setDailyAttempts] = useState<MockTestAttemptRecord[]>([]);
  const [mockAttempts, setMockAttempts] = useState<MockTestAttemptRecord[]>([]);
  const [resultTab, setResultTab] = useState<"daily_practice" | "mock_test">("mock_test");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!email) {
      setLoading(false);
      return;
    }

    Promise.all([
      fetchTestAttempts(email, "daily_practice"),
      fetchTestAttempts(email, "mock_test"),
    ])
      .then(([daily, mock]) => {
        setDailyAttempts(daily);
        setMockAttempts(mock);
      })
      .finally(() => setLoading(false));
  }, [email]);

  const activeAttempts = resultTab === "daily_practice" ? dailyAttempts : mockAttempts;

  if (loading) {
    return (
      <div className="grid min-h-[40vh] place-items-center">
        <Loader2 className="animate-spin text-[#172a69]" size={32} />
      </div>
    );
  }

  return (
    <StudentSectionCard eyebrow="Performance" title="Recent Test Results">
      <div className="mb-4 flex flex-wrap gap-2">
        {[
          ["mock_test", "Mock Test"],
          ["daily_practice", "Daily Practice Test"],
        ].map(([value, label]) => (
          <button
            key={value}
            type="button"
            onClick={() => setResultTab(value as "daily_practice" | "mock_test")}
            className={`rounded-full px-4 py-2 text-sm font-bold ${resultTab === value ? "bg-[#172a69] text-white" : "bg-[#f3f6fb] text-[#334155]"}`}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr className="border-b border-[#edf1f7] text-[#7d8799]">
              <th className="px-3 py-3">Test</th>
              <th className="px-3 py-3">Score</th>
              <th className="px-3 py-3">Correct</th>
              <th className="px-3 py-3">Submitted</th>
            </tr>
          </thead>
          <tbody>
            {activeAttempts.length ? activeAttempts.map((attempt) => (
              <tr key={attempt.id} className="border-b border-[#f3f6fb]">
                <td className="px-3 py-3 font-semibold text-[#111827]">{attempt.test_title}</td>
                <td className="px-3 py-3">{attempt.score}</td>
                <td className="px-3 py-3">{attempt.correct_count}/{attempt.total_questions}</td>
                <td className="px-3 py-3 text-[#7d8799]">{attempt.submitted_at ? new Date(attempt.submitted_at).toLocaleString() : "-"}</td>
              </tr>
            )) : (
              <tr><td colSpan={4} className="px-3 py-8 text-center text-[#667085]">No test results yet. Attempt a mock test to see your scores here.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </StudentSectionCard>
  );
}
