import { backendBaseUrl } from "@/lib/mock-tests";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");
  const category = searchParams.get("category");
  const query = new URLSearchParams();

  if (type) query.set("type", type);
  if (category) query.set("category", category);

  const suffix = query.toString() ? `?${query.toString()}` : "";
  const response = await fetch(`${backendBaseUrl}/api/courses${suffix}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    return Response.json({ courses: [], meta: { total: 0 } }, { status: response.status });
  }

  return Response.json(await response.json());
}
