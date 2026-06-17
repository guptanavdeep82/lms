import { StudentDashboardShell } from "@/components/student/StudentDashboardShell";
import { StudentPageHeader } from "@/components/student/StudentPageHeader";
import { StudentProfilePanel } from "@/components/student/panels/StudentProfilePanel";

export default function StudentProfilePage() {
  return (
    <StudentDashboardShell>
      <StudentPageHeader
        eyebrow="Account"
        title="My Profile"
        description="Update your personal details, mobile number, and state for a verified student profile."
      />
      <StudentProfilePanel />
    </StudentDashboardShell>
  );
}
