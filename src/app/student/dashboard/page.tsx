import { PurchasedCoursesList } from "@/components/student/PurchasedCoursesList";
import { StudentDashboardOverview } from "@/components/student/StudentDashboardOverview";
import { StudentDashboardShell } from "@/components/student/StudentDashboardShell";

export default function StudentDashboardPage() {
  return (
    <StudentDashboardShell>
      <StudentDashboardOverview />
    </StudentDashboardShell>
  );
}
