import type { ReactNode } from "react";
import { cmsPageSlugs } from "@/lib/static-export-params";

export async function generateStaticParams() {
  const slugs = await cmsPageSlugs();
  return slugs.map((slug) => ({ slug }));
}


export default function CmsPageSlugLayout({ children }: { children: ReactNode }) {
  return children;
}
