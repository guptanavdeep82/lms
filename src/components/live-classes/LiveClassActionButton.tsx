"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Loader2, PlayCircle, ShoppingBag } from "lucide-react";
import { startRazorpayCheckout } from "@/lib/checkout";
import {
  fetchLiveSessionRecording,
  joinLiveSession,
  openMeetingUrl,
  type LiveClassSessionItem,
} from "@/lib/live-classes";
import { getStudentSession, isStudentLoggedIn } from "@/lib/student-auth";

type LiveClassActionButtonProps = {
  session: LiveClassSessionItem;
  className?: string;
  style?: React.CSSProperties;
  onAccessChange?: () => void;
};

const defaultBtnClass =
  "inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#0957D3] text-sm font-bold text-white shadow-sm transition hover:bg-[#0538A1] disabled:opacity-70";

export function LiveClassActionButton({ session, className, style, onAccessChange }: LiveClassActionButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [replayPasscode, setReplayPasscode] = useState<string | null>(null);
  const [loginHref, setLoginHref] = useState("/login");

  useEffect(() => {
    setLoginHref(`/login?redirect=${encodeURIComponent(window.location.pathname)}`);
  }, []);

  const canJoin = Boolean(session.can_join);
  const isReplay = !canJoin && (
    Boolean(session.recording_ready)
    || Boolean(session.has_recording)
    || session.display_status === "replay"
    || session.status === "ended"
  );
  const label = canJoin
    ? "Join Class"
    : isReplay
      ? (session.recording_ready ? "Watch Replay" : "Load Recording")
      : "Class Not Available";

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
        Login to {isReplay ? "Watch Replay" : "Join Class"}
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
    if (!student?.email) {
      setError("Please login again to continue.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      if (isReplay) {
        const recording = await fetchLiveSessionRecording(session.id, student.email);
        if (!recording.recording_url) {
          throw new Error("Recording is still processing on Zoom. Please try again in 10–15 minutes.");
        }

        const passcode = recording.passcode || recording.password || null;
        setReplayPasscode(passcode);

        if (!openMeetingUrl(recording.recording_url)) {
          throw new Error("Unable to open recording link.");
        }

        onAccessChange?.();
        return;
      }

      if (!canJoin) {
        throw new Error("This class is not open for joining right now.");
      }

      const join = await joinLiveSession(session.id, student.email);
      if (!join.join_url) {
        throw new Error(join.message || "Zoom join link is not available yet.");
      }

      if (!openMeetingUrl(join.join_url)) {
        throw new Error("Unable to open Zoom link. Please allow popups or try again.");
      }
    } catch (actionError) {
      setError(actionError instanceof Error ? actionError.message : "Unable to open live class.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid gap-2">
      <button
        type="button"
        className={className || defaultBtnClass}
        style={style}
        disabled={loading || (!isReplay && !canJoin)}
        onClick={handleAction}
      >
        {loading ? <Loader2 className="inline size-4 animate-spin" /> : <PlayCircle className="inline size-4" />}
        {loading ? (isReplay ? "Loading recording..." : "Opening Zoom...") : label}
      </button>
      {error ? <p className="rounded-lg bg-red-50 px-3 py-2 text-xs font-bold text-red-700">{error}</p> : null}
      {replayPasscode ? (
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-950">
          <p className="font-bold">Recording passcode</p>
          <p className="mt-1 font-mono text-sm font-extrabold tracking-wider">{replayPasscode}</p>
          <p className="mt-1 text-amber-900">Zoom recording page par passcode maange to ye code enter karein.</p>
          <button
            type="button"
            className="mt-2 rounded-md bg-amber-200 px-2.5 py-1 text-[11px] font-bold text-amber-950"
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(replayPasscode);
              } catch {
                // ignore clipboard errors
              }
            }}
          >
            Copy Passcode
          </button>
        </div>
      ) : null}
    </div>
  );
}
