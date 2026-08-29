import type { ReactNode } from "react";
import { mockCategorySlugs } from "@/lib/static-export-params";

export async function generateStaticParams() {
  const slugs = await mockCategorySlugs();
  return slugs.map((category) => ({ category }));
}


export default function MockCategoryLayout({ children }: { children: ReactNode }) {
  return children;
}
