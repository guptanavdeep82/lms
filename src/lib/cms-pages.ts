import { publicBackendBaseUrl } from "@/lib/mock-tests";

export type CmsPageSummary = {
  id: number;
  title: string;
  slug: string;
};

export type CmsPageDetail = CmsPageSummary & {
  h1_title: string;
  description: string | null;
  meta_title: string | null;
  meta_description: string | null;
  meta_keywords: string | null;
  image_url: string | null;
};

export async function fetchCmsPages(): Promise<CmsPageSummary[]> {
  const response = await fetch(`${publicBackendBaseUrl}/api/pages`, { cache: "no-store" });
  if (!response.ok) return [];
  const data = await response.json() as { pages?: CmsPageSummary[] };
  return data.pages || [];
}

export async function fetchCmsPageBySlug(slug: string): Promise<CmsPageDetail | null> {
  const response = await fetch(`${publicBackendBaseUrl}/api/pages/${encodeURIComponent(slug)}`, { cache: "no-store" });
  if (!response.ok) return null;
  const data = await response.json() as { page?: CmsPageDetail };
  return data.page || null;
}

export function cmsPageHref(slug: string) {
  return `/pages/${slug}`;
}
