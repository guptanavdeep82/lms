import { StudentDashboardShell } from "@/components/student/StudentDashboardShell";
import { StudentPageHeader } from "@/components/student/StudentPageHeader";
import { StudentReferEarnPanel } from "@/components/student/panels/StudentReferEarnPanel";

export default function StudentReferEarnPage() {
  return (
    <StudentDashboardShell>
      <StudentPageHeader
        eyebrow="Rewards"
        title="Refer & Earn"
        description="Share your invite code with friends and earn rewards on successful referrals."
      />
      <StudentReferEarnPanel />
    </StudentDashboardShell>
  );
}
