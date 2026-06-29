import { StudentPurchasedLiveClasses } from "@/components/student/StudentPurchasedLiveClasses";
import { StudentDashboardShell } from "@/components/student/StudentDashboardShell";
import { StudentPageHeader } from "@/components/student/StudentPageHeader";
import { StudentSectionCard } from "@/components/student/StudentSectionCard";

export default function StudentLiveClassesPage() {
  return (
    <StudentDashboardShell>
      <StudentPageHeader
        eyebrow="Learning"
        title="My Live Classes"
        description="Join scheduled live sessions and watch recordings for your purchased courses."
      />
      <div className="space-y-6">
        <StudentSectionCard eyebrow="Live" title="Upcoming & Live Sessions">
          <StudentPurchasedLiveClasses />
        </StudentSectionCard>
      </div>
    </StudentDashboardShell>
  );
}
