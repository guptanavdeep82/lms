import { NextResponse } from "next/server";

type FirebaseSwConfig = {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  vapidKey: string;
};

async function loadConfig(): Promise<FirebaseSwConfig> {
  const fromEnv: FirebaseSwConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "",
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "",
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "",
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "",
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "",
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "",
    vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY || "",
  };

  if (fromEnv.projectId && fromEnv.apiKey && fromEnv.vapidKey) {
    if (!fromEnv.authDomain && fromEnv.projectId) {
      fromEnv.authDomain = `${fromEnv.projectId}.firebaseapp.com`;
    }
    if (!fromEnv.storageBucket && fromEnv.projectId) {
      fromEnv.storageBucket = `${fromEnv.projectId}.appspot.com`;
    }
    return fromEnv;
  }

  const backendBaseUrl =
    process.env.LMS_BACKEND_URL ||
    process.env.NEXT_PUBLIC_LMS_BACKEND_URL ||
    "https://lms.eventsbyan.com";

  try {
    const response = await fetch(`${backendBaseUrl}/api/firebase/config`, { cache: "no-store" });
    if (!response.ok) return fromEnv;

    const data = (await response.json()) as Partial<FirebaseSwConfig>;
    return {
      apiKey: data.apiKey || fromEnv.apiKey,
      authDomain: data.authDomain || fromEnv.authDomain || (data.projectId ? `${data.projectId}.firebaseapp.com` : ""),
      projectId: data.projectId || fromEnv.projectId,
      storageBucket: data.storageBucket || fromEnv.storageBucket || (data.projectId ? `${data.projectId}.appspot.com` : ""),
      messagingSenderId: data.messagingSenderId || fromEnv.messagingSenderId,
      appId: data.appId || fromEnv.appId,
      vapidKey: data.vapidKey || fromEnv.vapidKey,
    };
  } catch {
    return fromEnv;
  }
}

export async function GET() {
  const config = await loadConfig();
  const body = `self.firebaseConfig = ${JSON.stringify(config)};`;

  return new NextResponse(body, {
    headers: {
      "Content-Type": "application/javascript; charset=utf-8",
      "Cache-Control": "public, max-age=300",
    },
  });
}
