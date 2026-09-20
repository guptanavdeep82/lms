"use client";

import { useEffect, useRef, useState } from "react";
import { getGoogleClientId, loadGoogleSignInScript } from "@/lib/google-sign-in";

const CALLBACK_SCHEME = "krlogics";

export default function AppGoogleAuthPage() {
  const buttonRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const container = buttonRef.current;
    if (!container) return;

    let cancelled = false;

    void (async () => {
      try {
        const clientId = await getGoogleClientId();
        await loadGoogleSignInScript();
        if (cancelled || !window.google?.accounts?.id) {
          throw new Error("Google Sign-In is unavailable.");
        }

        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: (response) => {
            if (!response.credential) return;
            window.location.href = `${CALLBACK_SCHEME}://google-auth?credential=${encodeURIComponent(response.credential)}`;
          },
          use_fedcm_for_prompt: false,
          auto_select: false,
        });

        container.replaceChildren();
        window.google.accounts.id.renderButton(container, {
          type: "standard",
          theme: "outline",
          size: "large",
          width: container.offsetWidth || 320,
          text: "continue_with",
          shape: "rectangular",
        });
      } catch (mountError) {
        if (!cancelled) {
          setError(mountError instanceof Error ? mountError.message : "Google Sign-In failed.");
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f4f8ff] px-6">
      <section className="w-full max-w-md rounded-[28px] bg-white p-8 text-center shadow-[0_24px_70px_rgba(9,40,120,0.12)]">
        <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#0957D3]">KR Logics App</p>
        <h1 className="mt-3 text-2xl font-black text-[#0e318d]">Continue with Google</h1>
        <p className="mt-3 text-sm font-semibold leading-6 text-[#64748b]">
          Choose your Gmail account to login or create your student profile.
        </p>
        <div ref={buttonRef} className="mx-auto mt-6 min-h-[52px] w-full max-w-[320px]" />
        {error ? <p className="mt-4 text-sm font-bold text-[#0e318d]">{error}</p> : null}
      </section>
    </main>
  );
}
