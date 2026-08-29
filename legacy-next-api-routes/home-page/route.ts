import { backendBaseUrl } from "@/lib/mock-tests";

export async function GET() {
  const response = await fetch(`${backendBaseUrl}/api/home-page`, {
    cache: "no-store",
  });

  if (!response.ok) {
    return Response.json(
      {
        settings: null,
        reviews: [],
        faculties: [],
        faqs: [],
      },
      { status: response.status },
    );
  }

  return Response.json(await response.json());
}
