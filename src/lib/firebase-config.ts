"use client";

export type FirebaseWebConfig = {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  vapidKey: string;
};

export function getFirebaseConfigFromEnv(): FirebaseWebConfig | null {
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const messagingSenderId = process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID;
  const appId = process.env.NEXT_PUBLIC_FIREBASE_APP_ID;
  const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;

  if (!apiKey || !projectId || !messagingSenderId || !appId || !vapidKey) {
    return null;
  }

  return {
    apiKey,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || `${projectId}.firebaseapp.com`,
    projectId,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || `${projectId}.appspot.com`,
    messagingSenderId,
    appId,
    vapidKey,
  };
}

export async function fetchFirebaseConfig(): Promise<FirebaseWebConfig | null> {
  const fromEnv = getFirebaseConfigFromEnv();
  if (fromEnv) return fromEnv;

  try {
    const response = await fetch("/api/firebase/config", { cache: "no-store" });
    if (!response.ok) return null;
    const data = await response.json() as FirebaseWebConfig;
    if (!data.apiKey || !data.projectId || !data.vapidKey) return null;
    return data;
  } catch {
    return null;
  }
}
