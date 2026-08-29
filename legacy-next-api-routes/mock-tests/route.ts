import { backendBaseUrl } from "@/lib/mock-tests";

export async function GET() {
  const response = await fetch(`${backendBaseUrl}/api/mock-tests`, {
    cache: "no-store",
  });

  if (!response.ok) {
    return Response.json({ categories: [] }, { status: response.status });
  }

  return Response.json(await response.json());
}
