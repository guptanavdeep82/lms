import { backendBaseUrl } from "@/lib/mock-tests";

export async function GET(
  request: Request,
  context: { params: Promise<{ slug: string }> },
) {
  const { slug } = await context.params;
  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email");
  const query = email ? `?email=${encodeURIComponent(email)}` : "";

  const response = await fetch(`${backendBaseUrl}/api/live-courses/${encodeURIComponent(slug)}${query}`, {
    cache: "no-store",
    headers: { Accept: "application/json" },
  });

  const data = await response.json().catch(() => ({}));

  return Response.json(data, { status: response.status });
}
