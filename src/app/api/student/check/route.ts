import { backendBaseUrl } from "@/lib/mock-tests";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = new URLSearchParams();

  const email = searchParams.get("email");
  const mobile = searchParams.get("mobile");

  if (email) query.set("email", email);
  if (mobile) query.set("mobile", mobile);

  const response = await fetch(`${backendBaseUrl}/api/student/check?${query.toString()}`, {
    cache: "no-store",
    headers: { Accept: "application/json" },
  });

  const data = await response.json().catch(() => ({}));

  return Response.json(data, { status: response.status });
}
