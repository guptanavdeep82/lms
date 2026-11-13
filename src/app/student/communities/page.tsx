import { Suspense } from "react";
import { CommunityBoard } from "@/components/student/CommunityBoard";
import { StudentDashboardShell } from "@/components/student/StudentDashboardShell";

export default function StudentCommunitiesPage() {
  return (
    <StudentDashboardShell>
      <Suspense fallback={<div className="py-16 text-center text-sm font-semibold text-[#667085]">Loading community...</div>}>
        <CommunityBoard />
      </Suspense>
    </StudentDashboardShell>
  );
}
