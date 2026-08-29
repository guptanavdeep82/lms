import type { ReactNode } from "react";
import { liveCourseSlugs } from "@/lib/static-export-params";

export async function generateStaticParams() {
  const slugs = await liveCourseSlugs();
  return slugs.map((slug) => ({ slug }));
}


export default function LiveCourseSlugLayout({ children }: { children: ReactNode }) {
  return children;
}
