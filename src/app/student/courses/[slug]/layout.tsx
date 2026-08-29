import type { ReactNode } from "react";
import { courseSlugs } from "@/lib/static-export-params";

export async function generateStaticParams() {
  const slugs = await courseSlugs();
  return slugs.map((slug) => ({ slug }));
}


export default function StudentCourseSlugLayout({ children }: { children: ReactNode }) {
  return children;
}
