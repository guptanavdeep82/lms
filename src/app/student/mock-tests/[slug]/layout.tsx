import { Suspense, type ReactNode } from "react";
import { mockTestSlugs } from "@/lib/static-export-params";

export async function generateStaticParams() {
  const slugs = await mockTestSlugs();
  return slugs.map((slug) => ({ slug }));
}


export default function StudentMockSlugLayout({ children }: { children: ReactNode }) {
  return <Suspense fallback={null}>{children}</Suspense>;
}
