import { PurchasedCoursesList } from "@/components/student/PurchasedCoursesList";
import { StudentDashboardShell } from "@/components/student/StudentDashboardShell";
import { StudentPageHeader } from "@/components/student/StudentPageHeader";
import { StudentSectionCard } from "@/components/student/StudentSectionCard";

export default function StudentCoursesPage() {
  return (
    <StudentDashboardShell>
      <StudentPageHeader
        eyebrow="Learning"
        title="My Courses"
        description="Access your purchased courses, track progress, and continue learning from where you left off."
      />
      <StudentSectionCard eyebrow="Courses" title="Purchased Courses">
        <PurchasedCoursesList />
      </StudentSectionCard>
    </StudentDashboardShell>
  );
}
