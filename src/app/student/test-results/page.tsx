import { StudentDashboardShell } from "@/components/student/StudentDashboardShell";
import { StudentPageHeader } from "@/components/student/StudentPageHeader";
import { StudentTestResultsPanel } from "@/components/student/panels/StudentTestResultsPanel";

export default function StudentTestResultsPage() {
  return (
    <StudentDashboardShell>
      <StudentPageHeader
        eyebrow="Performance"
        title="Test Results"
        description="Review your mock test and daily practice scores in one place."
      />
      <StudentTestResultsPanel />
    </StudentDashboardShell>
  );
}
