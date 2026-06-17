import { StudentDashboardShell } from "@/components/student/StudentDashboardShell";
import { StudentPageHeader } from "@/components/student/StudentPageHeader";
import { StudentOrderHistoryPanel } from "@/components/student/panels/StudentOrderHistoryPanel";

export default function StudentOrdersPage() {
  return (
    <StudentDashboardShell>
      <StudentPageHeader
        eyebrow="Billing"
        title="Order History"
        description="Track payment status and order details for all your transactions."
      />
      <StudentOrderHistoryPanel />
    </StudentDashboardShell>
  );
}
