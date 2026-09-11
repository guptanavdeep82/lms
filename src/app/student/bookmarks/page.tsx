import { StudentDashboardShell } from "@/components/student/StudentDashboardShell";
import { StudentBookmarksPanel } from "@/components/student/panels/StudentBookmarksPanel";
import { StudentPageHeader } from "@/components/student/StudentPageHeader";

export default function StudentBookmarksPage() {
  return (
    <StudentDashboardShell>
      <StudentPageHeader
        eyebrow="Saved"
        title="Bookmarks"
        description="Courses, mock tests, current affairs and questions you save appear here so you can revise them later."
      />
      <StudentBookmarksPanel />
    </StudentDashboardShell>
  );
}
