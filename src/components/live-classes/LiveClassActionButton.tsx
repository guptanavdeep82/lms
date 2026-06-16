"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Loader2, PlayCircle, ShoppingBag } from "lucide-react";
import { startRazorpayCheckout } from "@/lib/checkout";
import { fetchLiveSessionRecording, joinLiveSession, type LiveClassSessionItem } from "@/lib/live-classes";
import { getStudentSession, isStudentLoggedIn } from "@/lib/student-auth";

type LiveClassActionButtonProps = {
  session: LiveClassSessionItem;
  className?: string;
  style?: React.CSSProperties;
  onAccessChange?: () => void;
};

const defaultBtnClass =
  "inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#1b2e6b] text-sm font-bold text-[#f5c518] shadow-sm transition hover:bg-[#0f1e4a] disabled:opacity-70";

export function LiveClassActionButton({ session, className, style, onAccessChange }: LiveClassActionButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [loginHref, setLoginHref] = useState("/login");

  useEffect(() => {
    setLoginHref(`/login?redirect=${encodeURIComponent(window.location.pathname)}`);
  }, []);

  const isReplay = session.display_status === "replay" || session.has_recording;
  const label = isReplay ? "Watch Replay" : "Join Class";

  if (session.source === "course") {
    return (
      <Link href={`/live-classes/course/${session.course.slug}`} className={className || defaultBtnClass} style={style}>
        View Live Plan
      </Link>
    );
  }

  if (!isStudentLoggedIn()) {
    return (
      <Link href={loginHref} className={className || defaultBtnClass} style={style}>
        Login to {label}
      </Link>
    );
  }

  if (session.access.requires_purchase && !session.access.allowed) {
    return (
      <div className="grid gap-2">
        <button
          type="button"
          className={className || defaultBtnClass}
          style={style}
          disabled={loading}
          onClick={async () => {
            const student = getStudentSession();
            if (!student?.email) return;

            setLoading(true);
            setError("");
            try {
              await startRazorpayCheckout({
                email: student.email,
                itemType: "course",
                itemId: session.course.id,
                itemTitle: session.course.title,
                onSuccess: () => onAccessChange?.(),
              });
            } catch (purchaseError) {
              setError(purchaseError instanceof Error ? purchaseError.message : "Purchase failed.");
            } finally {
              setLoading(false);
            }
          }}
        >
          {loading ? <Loader2 className="inline size-4 animate-spin" /> : <ShoppingBag className="inline size-4" />}
          {loading ? "Processing..." : `Purchase · ₹${session.course.effective_price}`}
        </button>
        {error ? <p className="text-xs font-bold text-red-600">{error}</p> : null}
      </div>
    );
  }

  const handleAction = async () => {
    const student = getStudentSession();
    if (!student?.email) return;

    setLoading(true);
    setError("");

    try {
      if (isReplay) {
        const recording = await fetchLiveSessionRecording(session.id, student.email);
        if (recording.recording_url) {
          window.open(recording.recording_url, "_blank", "noopener,noreferrer");
        }
        return;
      }

      const join = await joinLiveSession(session.id, student.email);
      if (join.join_url) {
        window.open(join.join_url, "_blank", "noopener,noreferrer");
      }
    } catch (actionError) {
      setError(actionError instanceof Error ? actionError.message : "Action failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid gap-2">
      <button type="button" className={className || defaultBtnClass} style={style} disabled={loading} onClick={handleAction}>
        {loading ? <Loader2 className="inline size-4 animate-spin" /> : <PlayCircle className="inline size-4" />}
        {loading ? "Please wait..." : label}
      </button>
      {error ? <p className="text-xs font-bold text-red-600">{error}</p> : null}
    </div>
  );
}
