import { backendBaseUrl } from "@/lib/mock-tests";

export async function GET() {
  const response = await fetch(`${backendBaseUrl}/api/states`, { cache: "no-store" });

  if (!response.ok) {
    return Response.json({ states: [] }, { status: response.status });
  }

  return Response.json(await response.json());
}
