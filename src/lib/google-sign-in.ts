export const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

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
  if (!GOOGLE_CLIENT_ID) {
    throw new Error("Google login is not configured.");
  }

  await loadGoogleSignInScript();

  if (!window.google?.accounts?.id) {
    throw new Error("Google Sign-In is unavailable.");
  }

  window.google.accounts.id.initialize({
    client_id: GOOGLE_CLIENT_ID,
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
