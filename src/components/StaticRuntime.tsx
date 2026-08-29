"use client";

import { useEffect, type ReactNode } from "react";

declare global {
  interface Window {
    __lmsFetchPatched?: boolean;
  }
}

export function StaticRuntime({ children }: { children: ReactNode }) {
  useEffect(() => {
    if (window.__lmsFetchPatched) return;
    window.__lmsFetchPatched = true;

    const originalFetch = window.fetch.bind(window);
    window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = typeof input === "string" ? input : input instanceof URL ? input.href : input.url;
      const isBackend = /lms\.eventsbyan\.com|api\.hostingwala\.tech/i.test(url);
      if (!isBackend) return originalFetch(input, init);

      try {
        const controller = new AbortController();
        const timeout = window.setTimeout(() => controller.abort(), 12000);
        const parentSignal = init?.signal;
        if (parentSignal) {
          if (parentSignal.aborted) controller.abort();
          else parentSignal.addEventListener("abort", () => controller.abort(), { once: true });
        }
        const response = await originalFetch(input, { ...init, signal: controller.signal });
        window.clearTimeout(timeout);
        return response;
      } catch {
        return new Response(JSON.stringify({ message: "Backend unreachable" }), {
          status: 503,
          headers: { "Content-Type": "application/json" },
        });
      }
    };
  }, []);

  return children;
}
