"use client";

import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getMessaging, getToken, isSupported, onMessage, type Messaging } from "firebase/messaging";
import { fetchFirebaseConfig, type FirebaseWebConfig } from "@/lib/firebase-config";
import { getStudentSession } from "@/lib/student-auth";

let firebaseApp: FirebaseApp | null = null;
let messagingInstance: Messaging | null = null;

function detectBrowserName() {
  if (typeof navigator === "undefined") return "Unknown";
  const ua = navigator.userAgent;
  if (ua.includes("Edg/")) return "Edge";
  if (ua.includes("Chrome/")) return "Chrome";
  if (ua.includes("Firefox/")) return "Firefox";
  if (ua.includes("Safari/") && !ua.includes("Chrome/")) return "Safari";
  return "Browser";
}

async function getFirebaseApp(config: FirebaseWebConfig) {
  if (firebaseApp) return firebaseApp;
  firebaseApp = getApps()[0] ?? initializeApp(config);
  return firebaseApp;
}

async function getMessagingInstance(config: FirebaseWebConfig) {
  if (!(await isSupported())) return null;
  if (messagingInstance) return messagingInstance;
  const app = await getFirebaseApp(config);
  messagingInstance = getMessaging(app);
  return messagingInstance;
}

export async function registerServiceWorker() {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) return null;
  return navigator.serviceWorker.register("/firebase-messaging-sw.js");
}

export async function requestNotificationPermission() {
  if (typeof window === "undefined" || !("Notification" in window)) {
    return "unsupported" as const;
  }

  if (Notification.permission === "granted") return "granted" as const;
  if (Notification.permission === "denied") return "denied" as const;

  return Notification.requestPermission();
}

export async function obtainFcmToken(): Promise<string | null> {
  const config = await fetchFirebaseConfig();
  if (!config) return null;

  const permission = await requestNotificationPermission();
  if (permission !== "granted") return null;

  await registerServiceWorker();
  const messaging = await getMessagingInstance(config);
  if (!messaging) return null;

  return getToken(messaging, {
    vapidKey: config.vapidKey,
    serviceWorkerRegistration: await navigator.serviceWorker.ready,
  });
}

export async function registerDeviceToken(token: string) {
  const session = getStudentSession();

  const response = await fetch("/api/device/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: session?.email,
      fcm_token: token,
      platform: "web",
      browser_name: detectBrowserName(),
      device_name: typeof navigator !== "undefined" ? navigator.platform : null,
    }),
  });

  if (!response.ok) {
    throw new Error("Unable to register device token.");
  }
}

export async function removeDeviceToken(token: string) {
  await fetch("/api/device/remove", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ fcm_token: token }),
  });
}

export async function initializeFcm(onForegroundMessage?: (payload: unknown) => void) {
  const config = await fetchFirebaseConfig();
  if (!config) return null;

  const token = await obtainFcmToken();
  if (!token) return null;

  await registerDeviceToken(token);

  const messaging = await getMessagingInstance(config);
  if (messaging && onForegroundMessage) {
    onMessage(messaging, (payload) => onForegroundMessage(payload));
  }

  return token;
}

export function listenForTokenRefresh(onRefresh: (token: string) => void) {
  if (typeof window === "undefined") return;

  navigator.serviceWorker?.addEventListener("message", (event) => {
    if (event.data?.type === "FCM_TOKEN_REFRESH" && typeof event.data.token === "string") {
      onRefresh(event.data.token);
    }
  });
}

export function handleNotificationClick(url?: string) {
  const target = url || "/";
  if (typeof window !== "undefined") {
    window.location.href = target;
  }
}
