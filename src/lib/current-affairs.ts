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

export function currentAffairsApiUrl(year: number, month: number) {
  return `${publicBackendBaseUrl}/api/current-affairs?year=${year}&month=${month}`;
}

export async function fetchCurrentAffairs(year: number, month: number): Promise<CurrentAffairItem[]> {
  const response = await fetch(currentAffairsApiUrl(year, month), { cache: "no-store" });
  if (!response.ok) return [];
  const data = (await response.json()) as CurrentAffairsResponse;
  return data.items ?? [];
}
