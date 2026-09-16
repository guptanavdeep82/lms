import { publicBackendBaseUrl } from "@/lib/mock-tests";

export type CmsPageSummary = {
  id: number;
  title: string;
  slug: string;
  show_in_header?: boolean;
};

export type CmsPageDetail = CmsPageSummary & {
  h1_title: string;
  description: string | null;
  meta_title: string | null;
  meta_description: string | null;
  meta_keywords: string | null;
  image_url: string | null;
};

async function fetchPages(path: string): Promise<CmsPageSummary[]> {
  try {
    const response = await fetch(`${publicBackendBaseUrl}${path}`, {
      cache: typeof window === "undefined" ? "force-cache" : "no-store",
      next: typeof window === "undefined" ? { revalidate: 120 } : undefined,
    });
    if (!response.ok) return [];
    const data = (await response.json()) as { pages?: CmsPageSummary[] };
    return data.pages || [];
  } catch {
    return [];
  }
}

export async function fetchCmsPages(): Promise<CmsPageSummary[]> {
  return fetchPages("/api/pages");
}

export async function fetchHeaderCmsPages(): Promise<CmsPageSummary[]> {
  return fetchPages("/api/pages?header=1");
}

export async function fetchCmsPageBySlug(slug: string): Promise<CmsPageDetail | null> {
  try {
    const response = await fetch(`${publicBackendBaseUrl}/api/pages/${encodeURIComponent(slug)}`, {
      cache: typeof window === "undefined" ? "force-cache" : "no-store",
      next: typeof window === "undefined" ? { revalidate: 120 } : undefined,
    });
    if (!response.ok) return null;
    const data = (await response.json()) as { page?: CmsPageDetail };
    return data.page || null;
  } catch {
    return null;
  }
}

export function cmsPageHref(slug: string) {
  return `/pages/${slug}`;
}
