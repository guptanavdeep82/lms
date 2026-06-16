import { StudentDashboardContent } from "@/components/student/StudentDashboardContent";
import { StudentDashboardShell } from "@/components/student/StudentDashboardShell";

export default function StudentDashboardPage() {
  return (
    <StudentDashboardShell>
      <StudentDashboardContent />
    </StudentDashboardShell>
  );
}
