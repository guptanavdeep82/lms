import { publicBackendBaseUrl } from "@/lib/mock-tests";

export type CurrentAffairItem = {
  id: number;
  date: string | null;
  title: string;
  content: string;
  pdf_url: string | null;
};

export type CurrentAffairsResponse = {
  year: number;
  month: number;
  items: CurrentAffairItem[];
};

export function currentAffairsApiUrl(year: number, month: number, extras?: { day?: number; q?: string; from?: string; to?: string }) {
  const params = new URLSearchParams({
    year: String(year),
    month: String(month),
  });
  if (extras?.day) params.set("day", String(extras.day));
  if (extras?.q) params.set("q", extras.q);
  if (extras?.from) params.set("from", extras.from);
  if (extras?.to) params.set("to", extras.to);
  return `${publicBackendBaseUrl}/api/current-affairs?${params.toString()}`;
}

export async function fetchCurrentAffairs(
  year: number,
  month: number,
  extras?: { day?: number; q?: string; from?: string; to?: string },
): Promise<CurrentAffairItem[]> {
  const response = await fetch(currentAffairsApiUrl(year, month, extras), { cache: "no-store" });
  if (!response.ok) return [];
  const data = (await response.json()) as CurrentAffairsResponse;
  return data.items ?? [];
}
