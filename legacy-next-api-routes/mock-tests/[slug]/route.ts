import { backendBaseUrl } from "@/lib/mock-tests";

export async function GET(_: Request, context: { params: Promise<{ slug: string }> }) {
  const { slug } = await context.params;
  const response = await fetch(`${backendBaseUrl}/api/mock-tests/${slug}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    return Response.json({ message: "Mock test not found" }, { status: response.status });
  }

  return Response.json(await response.json());
}
