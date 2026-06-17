import { StudentDashboardShell } from "@/components/student/StudentDashboardShell";
import { StudentNotesPanel } from "@/components/student/panels/StudentNotesPanel";
import { StudentPageHeader } from "@/components/student/StudentPageHeader";

export default function StudentNotesPage() {
  return (
    <StudentDashboardShell>
      <StudentPageHeader
        eyebrow="Study"
        title="My Notes"
        description="Create and manage your personal study notes. Only you can see your notes."
      />
      <StudentNotesPanel />
    </StudentDashboardShell>
  );
}
