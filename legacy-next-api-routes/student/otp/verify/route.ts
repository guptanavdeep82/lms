import { backendBaseUrl } from "@/lib/mock-tests";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));

  const response = await fetch(`${backendBaseUrl}/api/student/otp/verify`, {
    method: "POST",
    cache: "no-store",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const data = await response.json().catch(() => ({}));

  return Response.json(data, { status: response.status });
}
