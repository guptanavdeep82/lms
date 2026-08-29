"use client";

import { useParams, usePathname } from "next/navigation";
import { STATIC_FALLBACK_SLUG } from "@/lib/static-fallback";

export function useLiveParam(name: string, pathIndex: number): string {
  const params = useParams();
  const pathname = usePathname();
  const baked = params?.[name];
  const bakedValue = Array.isArray(baked) ? baked[0] : baked;
  const fromPath = (pathname ?? "").split("/").filter(Boolean)[pathIndex] ?? "";

  if (fromPath && fromPath !== STATIC_FALLBACK_SLUG) return fromPath;
  if (bakedValue && bakedValue !== STATIC_FALLBACK_SLUG) return bakedValue;
  return fromPath || bakedValue || "";
}
