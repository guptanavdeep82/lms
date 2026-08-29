import { CourseLearnViewer } from "@/components/student/CourseLearnViewer";
import { courseSlugs } from "@/lib/static-export-params";

export async function generateStaticParams() {
  const slugs = await courseSlugs();
  return slugs.map((slug) => ({ slug }));
}

export default function StudentCourseLearnPage() {
  return <CourseLearnViewer />;
}
