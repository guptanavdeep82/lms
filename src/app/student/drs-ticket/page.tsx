import { StudentDashboardShell } from "@/components/student/StudentDashboardShell";
import { StudentPageHeader } from "@/components/student/StudentPageHeader";
import { StudentDrsTicketPanel } from "@/components/student/panels/StudentDrsTicketPanel";

export default function StudentDrsTicketPage() {
  return (
    <StudentDashboardShell>
      <StudentPageHeader
        eyebrow="Support"
        title="DRS Ticket"
        description="Raise a support ticket for doubts, technical issues, or billing queries."
      />
      <StudentDrsTicketPanel />
    </StudentDashboardShell>
  );
}
