"use client";

import { useEffect, useState } from "react";
import { Bell, X } from "lucide-react";
import { fetchFirebaseConfig } from "@/lib/firebase-config";
import { initializeFcm, listenForTokenRefresh, registerDeviceToken, showForegroundNotification } from "@/lib/fcm";
import "./notification-prompt.css";

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

  const dismissPrompt = () => {
    window.localStorage.setItem(DISMISS_KEY, "1");
    setVisible(false);
  };

  return (
    <>
      {liveAlert ? (
        <div className="fcm-live-alert" role="status">
          <div className="fcm-live-alert-bar" />
          <div className="fcm-live-alert-body">
            <p className="fcm-live-alert-kicker">New Notification</p>
            <p className="fcm-live-alert-title">{liveAlert.title}</p>
            {liveAlert.body ? <p className="fcm-live-alert-text">{liveAlert.body}</p> : null}
          </div>
        </div>
      ) : null}

      {!visible ? null : (
        <div className="fcm-prompt" role="dialog" aria-labelledby="fcm-prompt-title" aria-describedby="fcm-prompt-text">
          <div className="fcm-prompt-accent" />
          <div className="fcm-prompt-head">
            <span className="fcm-prompt-bell" aria-hidden="true">
              <Bell size={20} />
            </span>
            <div className="fcm-prompt-copy">
              <p className="fcm-prompt-kicker">KR Logics alerts</p>
              <p className="fcm-prompt-title" id="fcm-prompt-title">Enable Notifications</p>
            </div>
            <button type="button" className="fcm-prompt-close" aria-label="Close" onClick={dismissPrompt}>
              <X size={14} />
            </button>
          </div>
          <div className="fcm-prompt-body">
            <p className="fcm-prompt-text" id="fcm-prompt-text">
              Get course updates, mock test alerts, and important announcements instantly.
            </p>
            {error ? <p className="fcm-prompt-error">{error}</p> : null}
            <div className="fcm-prompt-actions">
              <button
                type="button"
                disabled={loading}
                className="fcm-prompt-allow"
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
              >
                {loading ? "Enabling..." : "Allow Notifications"}
              </button>
              <button type="button" className="fcm-prompt-later" onClick={dismissPrompt}>
                Not Now
              </button>
            </div>
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
