import { StudentDashboardShell } from "@/components/student/StudentDashboardShell";
import { StudentCurrentAffairsPanel } from "@/components/student/panels/StudentCurrentAffairsPanel";
import { StudentPageHeader } from "@/components/student/StudentPageHeader";

export default function StudentCurrentAffairsPage() {
  return (
    <StudentDashboardShell>
      <StudentPageHeader
        eyebrow="Daily Capsule"
        title="Current Affairs"
        description="Browse notes date-wise, search this month, and bookmark important updates for revision."
      />
      <StudentCurrentAffairsPanel />
    </StudentDashboardShell>
  );
}
