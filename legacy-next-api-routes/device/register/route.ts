import { backendBaseUrl } from "@/lib/mock-tests";

export async function POST(request: Request) {
  const body = await request.text();

  const response = await fetch(`${backendBaseUrl}/api/device/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body,
    cache: "no-store",
  });

  const data = await response.json().catch(() => ({}));
  return Response.json(data, { status: response.status });
}
