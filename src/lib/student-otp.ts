import { backendBaseUrl } from "@/lib/mock-tests";

export const OTP_LENGTH = 4;

function sendOtpUrl() {
  return typeof window !== "undefined" ? "/api/student/otp/send" : `${backendBaseUrl}/api/student/otp/send`;
}

function verifyOtpUrl() {
  return typeof window !== "undefined" ? "/api/student/otp/verify" : `${backendBaseUrl}/api/student/otp/verify`;
}

export async function sendStudentWhatsappOtp(mobile: string) {
  const response = await fetch(sendOtpUrl(), {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ mobile }),
  });

  const payload = (await response.json().catch(() => ({}))) as {
    message?: string;
    mobile?: string;
    expires_in?: number;
  };

  if (!response.ok) {
    throw new Error(payload.message || "Unable to send OTP on WhatsApp.");
  }

  return payload;
}

export async function verifyStudentWhatsappOtp(mobile: string, otp: string) {
  const response = await fetch(verifyOtpUrl(), {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ mobile, otp }),
  });

  const payload = (await response.json().catch(() => ({}))) as {
    message?: string;
    verified?: boolean;
  };

  if (!response.ok || !payload.verified) {
    throw new Error(payload.message || "Invalid or expired OTP.");
  }

  return payload;
}

export function isValidOtp(value: string): boolean {
  return new RegExp(`^\\d{${OTP_LENGTH}}$`).test(value);
}
