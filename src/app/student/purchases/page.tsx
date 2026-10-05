import { StudentDashboardShell } from "@/components/student/StudentDashboardShell";
import { StudentPageHeader } from "@/components/student/StudentPageHeader";
import { StudentPurchaseHistoryPanel } from "@/components/student/panels/StudentPurchaseHistoryPanel";

export default function StudentPurchasesPage() {
  return (
    <StudentDashboardShell>
      <StudentPageHeader
        eyebrow="Billing"
        title="Purchase History"
        description="View all courses, mock tests, and packages you have purchased."
      />
      <StudentPurchaseHistoryPanel />
    </StudentDashboardShell>
  );
}
