import { backendBaseUrl } from "@/lib/mock-tests";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email");
  const suffix = email ? `?email=${encodeURIComponent(email)}` : "";

  const response = await fetch(`${backendBaseUrl}/api/live-sessions${suffix}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    return Response.json({ sessions: [] }, { status: response.status });
  }

  return Response.json(await response.json());
}
