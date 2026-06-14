import { publicBackendBaseUrl } from "@/lib/mock-tests";

export type ContactFormInput = {
  name: string;
  email: string;
  phone?: string;
  interested_in?: string;
  preferred_mode?: string;
  message?: string;
};

export async function submitContactForm(input: ContactFormInput): Promise<{ message: string }> {
  const response = await fetch(`${publicBackendBaseUrl}/api/contact`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  const data = await response.json().catch(() => ({})) as {
    message?: string;
    errors?: Record<string, string[]>;
  };

  if (!response.ok) {
    const message = Object.values(data.errors || {})[0]?.[0] || data.message || "Unable to submit the form.";
    throw new Error(message);
  }

  return { message: data.message || "Enquiry submitted successfully." };
}
