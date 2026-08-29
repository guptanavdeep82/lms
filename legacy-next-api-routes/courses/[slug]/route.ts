import { backendBaseUrl } from "@/lib/mock-tests";

export async function GET(_request: Request, context: { params: Promise<{ slug: string }> }) {
  const { slug } = await context.params;
  const response = await fetch(`${backendBaseUrl}/api/courses/${encodeURIComponent(slug)}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    return Response.json({ course: null, lessons: [] }, { status: response.status });
  }

  return Response.json(await response.json());
}
