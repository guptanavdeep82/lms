import { PurchasedMockTestsList } from "@/components/student/PurchasedMockTestsList";
import { StudentDashboardShell } from "@/components/student/StudentDashboardShell";
import { StudentPageHeader } from "@/components/student/StudentPageHeader";
import { StudentSectionCard } from "@/components/student/StudentSectionCard";

export default function StudentMockTestsPage() {
  return (
    <StudentDashboardShell>
      <StudentPageHeader
        eyebrow="Practice"
        title="My Mock Tests"
        description="Start mock tests from the series you have purchased. Only your purchased tests are shown here."
      />
      <StudentSectionCard eyebrow="Mock Tests" title="Purchased Mock Tests">
        <PurchasedMockTestsList />
      </StudentSectionCard>
    </StudentDashboardShell>
  );
}
