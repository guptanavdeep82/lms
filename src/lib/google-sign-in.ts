import { publicBackendBaseUrl } from "@/lib/mock-tests";

const DEFAULT_GOOGLE_CLIENT_ID =
  "472268623113-6omv4ev9vlsauco4pg6qgumfsfviiecg.apps.googleusercontent.com";

export const GOOGLE_CLIENT_ID = (process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "").trim();

let googleClientIdPromise: Promise<string> | null = null;

function googleConfigUrl() {
  return `${publicBackendBaseUrl}/api/google/config`;
}

export async function getGoogleClientId(): Promise<string> {
  if (GOOGLE_CLIENT_ID) {
    return GOOGLE_CLIENT_ID;
  }

  if (!googleClientIdPromise) {
    googleClientIdPromise = (async () => {
      const configUrl = googleConfigUrl();

      try {
        const response = await fetch(configUrl, { cache: "no-store" });
        const text = await response.text();
        if (!response.ok) {
          console.error(`[Google login] ${configUrl} returned ${response.status}`, text.slice(0, 300));
          return DEFAULT_GOOGLE_CLIENT_ID;
        }

        const data = JSON.parse(text) as { client_id?: string };
        const fromApi = (data.client_id || "").trim();
        if (fromApi) {
          return fromApi;
        }

        console.warn(`[Google login] ${configUrl} returned an empty client_id; using default.`);
        return DEFAULT_GOOGLE_CLIENT_ID;
      } catch (error) {
        console.error(`[Google login] Could not load client ID from ${configUrl}`, error);
        return DEFAULT_GOOGLE_CLIENT_ID;
      }
    })();
  }

  return googleClientIdPromise;
}

export type GoogleStudent = {
  name: string;
  email: string;
};

type GoogleCredentialResponse = {
  credential?: string;
};

type GoogleIdApi = {
  initialize: (config: {
    client_id: string;
    callback: (response: GoogleCredentialResponse) => void;
    use_fedcm_for_prompt?: boolean;
    auto_select?: boolean;
  }) => void;
  renderButton: (
    parent: HTMLElement,
    options: {
      type?: string;
      theme?: string;
      size?: string;
      width?: number | string;
      text?: string;
      shape?: string;
    },
  ) => void;
  prompt: () => void;
};

declare global {
  interface Window {
    google?: {
      accounts?: {
        id?: GoogleIdApi;
      };
    };
  }
}

let googleScriptPromise: Promise<void> | null = null;

export function decodeGoogleCredential(credential: string): GoogleStudent | null {
  try {
    const payload = credential.split(".")[1];
    const json = JSON.parse(window.atob(payload.replace(/-/g, "+").replace(/_/g, "/"))) as {
      name?: string;
      email?: string;
    };
    return json.email ? { name: json.name || json.email.split("@")[0], email: json.email } : null;
  } catch {
    return null;
  }
}

export function loadGoogleSignInScript(): Promise<void> {
  if (typeof window === "undefined") {
    return Promise.resolve();
  }

  if (window.google?.accounts?.id) {
    return Promise.resolve();
  }

  if (!googleScriptPromise) {
    googleScriptPromise = new Promise((resolve, reject) => {
      const existing = document.querySelector<HTMLScriptElement>('script[data-google-gsi="true"]');
      if (existing) {
        existing.addEventListener("load", () => resolve(), { once: true });
        existing.addEventListener("error", () => reject(new Error("Failed to load Google Sign-In.")), { once: true });
        return;
      }

      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.dataset.googleGsi = "true";
      script.onload = () => resolve();
      script.onerror = () => reject(new Error("Failed to load Google Sign-In."));
      document.head.appendChild(script);
    });
  }

  return googleScriptPromise;
}

export async function mountGoogleSignInButton(
  container: HTMLElement,
  onSuccess: (student: GoogleStudent) => void,
): Promise<void> {
  const clientId = await getGoogleClientId();
  if (!clientId) {
    throw new Error(
      `Google login is not configured. Website build is missing NEXT_PUBLIC_GOOGLE_CLIENT_ID, and ${googleConfigUrl()} did not return a client ID.`,
    );
  }

  await loadGoogleSignInScript();

  if (!window.google?.accounts?.id) {
    throw new Error("Google Sign-In is unavailable.");
  }

  window.google.accounts.id.initialize({
    client_id: clientId,
    callback: (response) => {
      if (!response.credential) return;
      const student = decodeGoogleCredential(response.credential);
      if (student) onSuccess(student);
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
}
