import { publicBackendBaseUrl } from "@/lib/mock-tests";

export type ReferralInfo = {
  code: string;
  discount_type: "percentage" | "fixed";
  discount_value: number;
  discount_label: string;
  affiliate_name?: string;
};

export type StudentReferralPayload = {
  referral_code?: string | null;
  referral_discount_type?: "percentage" | "fixed" | null;
  referral_discount_value?: number | null;
  referral_discount_label?: string | null;
};

export async function validateReferralCode(code: string): Promise<{ valid: true; referral: ReferralInfo } | { valid: false; message: string }> {
  const response = await fetch(`${publicBackendBaseUrl}/api/referral/validate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code: code.trim() }),
  });

  const data = await response.json().catch(() => ({})) as {
    valid?: boolean;
    referral?: ReferralInfo;
    message?: string;
  };

  if (!response.ok || !data.valid || !data.referral) {
    return { valid: false, message: data.message || "Invalid or inactive referral code." };
  }

  return { valid: true, referral: data.referral };
}

export async function applyStudentReferral(email: string, referralCode: string): Promise<StudentReferralPayload> {
  const response = await fetch(`${publicBackendBaseUrl}/api/student/referral`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, referral_code: referralCode.trim() }),
  });

  const data = await response.json().catch(() => ({})) as {
    student?: StudentReferralPayload;
    message?: string;
    errors?: Record<string, string[]>;
  };

  if (!response.ok) {
    const message = data.errors?.referral_code?.[0] || data.message || "Referral code apply nahi ho paya.";
    throw new Error(message);
  }

  return data.student || {};
}

export function referralFromStudentPayload(student: StudentReferralPayload): Pick<StudentReferralPayload, "referral_code" | "referral_discount_type" | "referral_discount_value" | "referral_discount_label"> {
  return {
    referral_code: student.referral_code ?? null,
    referral_discount_type: student.referral_discount_type ?? null,
    referral_discount_value: student.referral_discount_value ?? null,
    referral_discount_label: student.referral_discount_label ?? null,
  };
}
