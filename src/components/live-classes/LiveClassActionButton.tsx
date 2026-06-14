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
  onAccessChange?: () => void;
};

export function LiveClassActionButton({ session, className, onAccessChange }: LiveClassActionButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [loginHref, setLoginHref] = useState("/login");

  useEffect(() => {
    setLoginHref(`/login?redirect=${encodeURIComponent(window.location.pathname)}`);
  }, []);

  const isReplay = session.display_status === "replay" || session.has_recording;
  const label = isReplay ? "Watch Replay" : "Join Class";

  if (!isStudentLoggedIn()) {
    return (
      <Link href={loginHref} className={className || "live-action-btn"}>
        Login to {label}
      </Link>
    );
  }

  if (session.access.requires_purchase && !session.access.allowed) {
    return (
      <div className="grid gap-2">
        <button
          type="button"
          className={className || "live-action-btn"}
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
        {error ? <p className="live-action-error">{error}</p> : null}
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
      <button type="button" className={className || "live-action-btn"} disabled={loading} onClick={handleAction}>
        {loading ? <Loader2 className="inline size-4 animate-spin" /> : <PlayCircle className="inline size-4" />}
        {loading ? "Please wait..." : label}
      </button>
      {error ? <p className="live-action-error">{error}</p> : null}
    </div>
  );
}
