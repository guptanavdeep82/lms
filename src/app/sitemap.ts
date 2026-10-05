import type { MetadataRoute } from "next";
import { blogs } from "@/lib/data";
import { fetchCmsPages } from "@/lib/cms-pages";
import { publicBackendBaseUrl } from "@/lib/mock-tests";
import { siteUrl } from "@/lib/site-url";

type ListedItem = { slug?: string };

async function fetchListedSlugs(path: string, key: string): Promise<string[]> {
  try {
    const response = await fetch(`${publicBackendBaseUrl}${path}`, { next: { revalidate: 3600 } });
    if (!response.ok) return [];
    const payload = (await response.json()) as Record<string, ListedItem[] | undefined>;
    const rows = payload[key] ?? [];
    return rows.map((row) => String(row.slug || "")).filter(Boolean);
  } catch {
    return [];
  }
}

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const [courseSlugs, packageSlugs, mockCategories, cmsPages] = await Promise.all([
    fetchListedSlugs("/api/courses", "courses"),
    fetchListedSlugs("/api/packages", "packages"),
    fetchListedSlugs("/api/mock-tests", "categories"),
    fetchCmsPages(),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    "",
    "/courses",
    "/packages",
    "/mock-tests",
    "/live-classes",
    "/faculty",
    "/faq",
    "/blog",
    "/contact",
    "/current-affairs",
    "/notes",
  ].map((path) => ({
    url: siteUrl(path || "/"),
    lastModified: now,
    changeFrequency: path === "" ? "daily" : "weekly",
    priority: path === "" ? 1 : 0.8,
  }));

  const dynamicRoutes: MetadataRoute.Sitemap = [
    ...courseSlugs.map((slug) => ({ url: siteUrl(`/courses/${slug}`), lastModified: now, changeFrequency: "weekly" as const, priority: 0.7 })),
    ...packageSlugs.map((slug) => ({ url: siteUrl(`/packages/${slug}`), lastModified: now, changeFrequency: "weekly" as const, priority: 0.6 })),
    ...mockCategories.map((slug) => ({ url: siteUrl(`/mock-tests/${slug}`), lastModified: now, changeFrequency: "weekly" as const, priority: 0.6 })),
    ...cmsPages.map((page) => ({ url: siteUrl(`/pages/${page.slug}`), lastModified: now, changeFrequency: "monthly" as const, priority: 0.5 })),
    ...blogs.map((blog) => ({ url: siteUrl(`/blog/${blog.slug}`), lastModified: now, changeFrequency: "monthly" as const, priority: 0.5 })),
  ];

  return [...staticRoutes, ...dynamicRoutes];
}
