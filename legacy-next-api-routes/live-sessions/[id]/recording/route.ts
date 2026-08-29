import { backendBaseUrl } from "@/lib/mock-tests";

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const body = await request.text();

  const response = await fetch(`${backendBaseUrl}/api/live-sessions/${encodeURIComponent(id)}/recording`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    cache: "no-store",
  });

  const data = await response.json().catch(() => ({}));
  return Response.json(data, { status: response.status });
}
