import { backendBaseUrl } from "@/lib/mock-tests";
import { getStudentProfile, getStudentSession } from "@/lib/student-auth";

export type StateOption = {
  id: number;
  name: string;
  code: string;
};

export type RegisterStudentInput = {
  name: string;
  email: string;
  mobile?: string;
  state_id?: number;
  provider?: string;
  mobile_verified?: boolean;
  referral_code?: string;
  invite_code?: string;
};

export type StudentCheckoutProfile = {
  email: string;
  name?: string;
  mobile?: string;
  state_id?: number;
  provider?: string;
  mobile_verified?: boolean;
};

function statesUrl() {
  return typeof window !== "undefined" ? "/api/states" : `${backendBaseUrl}/api/states`;
}

function registerUrl() {
  return typeof window !== "undefined" ? "/api/student/register" : `${backendBaseUrl}/api/student/register`;
}

function syncUrl() {
  return typeof window !== "undefined" ? "/api/student/sync" : `${backendBaseUrl}/api/student/sync`;
}

function checkUrl(params: { email?: string; mobile?: string }) {
  const query = new URLSearchParams();
  if (params.email) query.set("email", params.email);
  if (params.mobile) query.set("mobile", params.mobile);

  const suffix = query.toString();
  return typeof window !== "undefined"
    ? `/api/student/check?${suffix}`
    : `${backendBaseUrl}/api/student/check?${suffix}`;
}

export type StudentRegistrationCheck = {
  email_exists: boolean;
  mobile_exists: boolean;
  student?: {
    name: string;
    email: string;
    mobile?: string | null;
  } | null;
};

export async function checkStudentRegistration(params: {
  email?: string;
  mobile?: string;
}): Promise<StudentRegistrationCheck> {
  const response = await fetch(checkUrl(params), { cache: "no-store" });
  const payload = (await response.json().catch(() => ({}))) as StudentRegistrationCheck & {
    message?: string;
  };

  if (!response.ok) {
    throw new Error(
      payload.message || `Unable to verify student account (server ${response.status}). Please check backend connection.`,
    );
  }

  return payload;
}

export async function fetchStates(): Promise<StateOption[]> {
  const response = await fetch(statesUrl(), { cache: "no-store" });
  if (!response.ok) return [];
  const data = (await response.json()) as { states?: StateOption[] };
  return data.states || [];
}

export function buildStudentCheckoutProfile(email: string): StudentCheckoutProfile {
  const profile = getStudentProfile(email);
  const session = getStudentSession();
  const normalizedEmail = email.trim().toLowerCase();

  return {
    email: normalizedEmail,
    name: profile?.name || session?.name,
    mobile: profile?.mobile || session?.mobile,
    state_id: profile?.stateId || session?.stateId,
    provider: profile?.provider || session?.provider || "google",
    mobile_verified: profile?.mobileVerified ?? true,
  };
}

export async function registerStudent(input: RegisterStudentInput) {
  const response = await fetch(registerUrl(), {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(input),
  });

  const payload = await response.json().catch(() => ({})) as {
    student?: Record<string, unknown>;
    message?: string;
    errors?: Record<string, string[]>;
  };

  if (!response.ok) {
    const fieldError = payload.errors ? Object.values(payload.errors)[0]?.[0] : null;
    throw new Error(fieldError || payload.message || "Registration failed. Please try again.");
  }

  return payload;
}

export async function syncStudentWithBackend(email: string) {
  const checkoutProfile = buildStudentCheckoutProfile(email);

  const response = await fetch(syncUrl(), {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      name: checkoutProfile.name || checkoutProfile.email.split("@")[0] || "Student",
      email: checkoutProfile.email,
      mobile: checkoutProfile.mobile,
      state_id: checkoutProfile.state_id,
      provider: checkoutProfile.provider,
      mobile_verified: checkoutProfile.mobile_verified,
    }),
  });

  const payload = await response.json().catch(() => ({})) as {
    student?: Record<string, unknown>;
    message?: string;
    errors?: Record<string, string[]>;
  };

  if (!response.ok) {
    const fieldError = payload.errors ? Object.values(payload.errors)[0]?.[0] : null;
    throw new Error(fieldError || payload.message || "Unable to sync student profile.");
  }

  return payload;
}
