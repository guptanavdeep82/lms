"use client";

import { useEffect, useState } from "react";
import { Bell, X } from "lucide-react";
import { fetchFirebaseConfig } from "@/lib/firebase-config";
import { initializeFcm, listenForTokenRefresh, registerDeviceToken, showForegroundNotification } from "@/lib/fcm";

const DISMISS_KEY = "kr_fcm_prompt_dismissed";

function handleIncomingNotification(payload: unknown) {
  showForegroundNotification(payload);

  const message = payload as {
    notification?: { title?: string; body?: string };
    data?: { title?: string; message?: string };
  };

  const title = message.notification?.title || message.data?.title;
  const body = message.notification?.body || message.data?.message;
  if (!title) return;

  window.dispatchEvent(
    new CustomEvent("kr-push-received", {
      detail: { title, body: body || "" },
    }),
  );
}

export function NotificationPermissionPrompt() {
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [liveAlert, setLiveAlert] = useState<{ title: string; body: string } | null>(null);

  useEffect(() => {
    fetchFirebaseConfig().then((config) => {
      if (!config) return;
      if (typeof window === "undefined") return;
      if (!("Notification" in window)) return;

      if (Notification.permission === "granted") {
        void initializeFcm(handleIncomingNotification);
        return;
      }

      if (window.localStorage.getItem(DISMISS_KEY) === "1") return;
      if (Notification.permission !== "denied") {
        setVisible(true);
      }
    });
  }, []);

  useEffect(() => {
    const onPush = (event: Event) => {
      const detail = (event as CustomEvent<{ title: string; body: string }>).detail;
      if (!detail?.title) return;
      setLiveAlert(detail);
      window.setTimeout(() => setLiveAlert(null), 8000);
    };

    window.addEventListener("kr-push-received", onPush);
    return () => window.removeEventListener("kr-push-received", onPush);
  }, []);

  useEffect(() => {
    listenForTokenRefresh(async (token) => {
      try {
        await registerDeviceToken(token);
      } catch {
        // Ignore refresh registration errors silently.
      }
    });
  }, []);

  return (
    <>
      {liveAlert ? (
        <div className="fixed top-5 right-5 z-[130] max-w-sm rounded-2xl border border-[#0957D3]/20 bg-white p-4 shadow-[0_20px_50px_rgba(9,87,211,0.18)]">
          <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-[#0957D3]">New Notification</p>
          <p className="mt-1 text-sm font-extrabold text-[#172a69]">{liveAlert.title}</p>
          {liveAlert.body ? <p className="mt-1 text-xs font-semibold text-[#667085]">{liveAlert.body}</p> : null}
        </div>
      ) : null}

      {!visible ? null : (
    <div className="fixed bottom-5 right-5 z-[120] max-w-sm overflow-hidden rounded-2xl border border-[#dfe5ef] bg-white shadow-[0_20px_50px_rgba(15,23,42,0.18)]">
      <div className="flex items-start gap-3 p-4">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#eef2ff] text-[#172a69]">
          <Bell size={18} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-extrabold text-[#172a69]">Enable Notifications</p>
          <p className="mt-1 text-xs font-semibold leading-5 text-[#667085]">
            Get course updates, mock test alerts, and important announcements instantly.
          </p>
          {error ? <p className="mt-2 text-xs font-bold text-[#b42318]">{error}</p> : null}
          <div className="mt-3 flex gap-2">
            <button
              type="button"
              disabled={loading}
              onClick={async () => {
                setLoading(true);
                setError("");
                try {
                  const token = await initializeFcm(handleIncomingNotification);
                  if (!token) {
                    setError("Permission denied or browser does not support notifications.");
                    return;
                  }
                  setVisible(false);
                } catch {
                  setError("Unable to enable notifications.");
                } finally {
                  setLoading(false);
                }
              }}
              className="inline-flex h-9 items-center rounded-xl bg-[#172a69] px-3 text-xs font-extrabold text-white"
            >
              {loading ? "Enabling..." : "Allow Notifications"}
            </button>
            <button
              type="button"
              onClick={() => {
                window.localStorage.setItem(DISMISS_KEY, "1");
                setVisible(false);
              }}
              className="inline-flex h-9 items-center rounded-xl border border-[#dfe5ef] px-3 text-xs font-extrabold text-[#667085]"
            >
              Not Now
            </button>
          </div>
        </div>
        <button
          type="button"
          aria-label="Close"
          onClick={() => {
            window.localStorage.setItem(DISMISS_KEY, "1");
            setVisible(false);
          }}
          className="text-[#98a2b3]"
        >
          <X size={16} />
        </button>
      </div>
    </div>
      )}
    </>
  );
}

export function FcmProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <NotificationPermissionPrompt />
    </>
  );
}
