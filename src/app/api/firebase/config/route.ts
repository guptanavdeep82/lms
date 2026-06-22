import { backendBaseUrl } from "@/lib/mock-tests";

export async function GET() {
  const response = await fetch(`${backendBaseUrl}/api/firebase/config`, {
    cache: "no-store",
  });

  const data = await response.json().catch(() => ({}));
  return Response.json(data, { status: response.status });
}
