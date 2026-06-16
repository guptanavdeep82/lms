import { NextRequest, NextResponse } from "next/server";

const backendBase = process.env.NEXT_PUBLIC_LMS_BACKEND_URL || "https://lms.eventsbyan.com";

async function proxy(request: NextRequest, path: string) {
  const url = new URL(`${backendBase}${path}`);
  request.nextUrl.searchParams.forEach((value, key) => url.searchParams.set(key, value));

  const init: RequestInit = {
    method: request.method,
    headers: { Accept: "application/json" },
    cache: "no-store",
  };

  if (request.method !== "GET" && request.method !== "HEAD") {
    init.headers = {
      ...init.headers,
      "Content-Type": "application/json",
    };
    init.body = await request.text();
  }

  const response = await fetch(url, init);
  const data = await response.json().catch(() => ({}));
  return NextResponse.json(data, { status: response.status });
}

export async function GET(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  const { path } = await context.params;
  return proxy(request, `/api/student/${path.join("/")}`);
}

export async function POST(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  const { path } = await context.params;
  return proxy(request, `/api/student/${path.join("/")}`);
}
