"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import { GOOGLE_CLIENT_ID, mountGoogleSignInButton, type GoogleStudent } from "@/lib/google-sign-in";

type GoogleSignInButtonProps = {
  onSuccess: (student: GoogleStudent) => void;
  label?: string;
  className?: string;
};

export function GoogleSignInButton({
  onSuccess,
  label = "Continue with Google",
  className = "",
}: GoogleSignInButtonProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const container = overlayRef.current;
    if (!container || !GOOGLE_CLIENT_ID) {
      if (!GOOGLE_CLIENT_ID) {
        setError("Google login is not configured.");
      }
      return;
    }

    let cancelled = false;

    void mountGoogleSignInButton(container, onSuccess)
      .then(() => {
        if (!cancelled) {
          setReady(true);
          setError("");
        }
      })
      .catch((mountError) => {
        if (!cancelled) {
          setReady(false);
          setError(mountError instanceof Error ? mountError.message : "Google Sign-In failed.");
        }
      });

    return () => {
      cancelled = true;
    };
  }, [onSuccess]);

  return (
    <div className={className}>
      <div className="relative mt-5 h-[52px] w-full">
        <div
          aria-hidden="true"
          className="pointer-events-none inline-flex h-[52px] w-full items-center justify-center gap-3 rounded-2xl bg-[#f5c518] px-5 text-sm font-black text-[#050808] shadow-[0_14px_32px_rgba(245,197,24,0.35)]"
        >
          {label} <ArrowRight size={17} />
        </div>
        <div
          ref={overlayRef}
          className={`absolute inset-0 overflow-hidden rounded-2xl ${ready ? "opacity-[0.01]" : "opacity-0"}`}
          style={{ zIndex: 2 }}
        />
      </div>
      {error && <p className="mt-3 text-xs font-bold leading-6 text-[#b42318]">{error}</p>}
    </div>
  );
}
