import { backendBaseUrl } from "@/lib/mock-tests";

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const email = new URL(request.url).searchParams.get("email") ?? "";

  const response = await fetch(
    `${backendBaseUrl}/api/lesson/${encodeURIComponent(id)}/video?email=${encodeURIComponent(email)}`,
    { cache: "no-store" },
  );

  const payload = await response.json().catch(() => ({ message: "Unable to load lesson video." }));

  return Response.json(payload, { status: response.status });
}
