import { publicBackendBaseUrl } from "@/lib/mock-tests";
import { buildStudentCheckoutProfile } from "@/lib/student-registration";
import { getStudentSession, isStudentLoggedIn } from "@/lib/student-auth";

export type CheckoutItemType = "course" | "mock_test" | "mock_category" | "package";

export type StudentPurchase = {
  id: number;
  purchasable_type: CheckoutItemType;
  purchasable_id: number;
  expires_at: string | null;
  created_at: string | null;
};

export type CreateOrderResponse = {
  free?: boolean;
  order: {
    id: number;
    item_title: string;
    final_amount: number;
    status: string;
  };
  razorpay?: {
    key_id: string;
    order_id: string;
    amount: number;
    currency: string;
  };
  prefill?: {
    name: string;
    email: string;
    contact?: string;
  };
  purchases?: StudentPurchase[];
};

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => {
      open: () => void;
      on: (event: string, handler: (response: { error?: { description?: string } }) => void) => void;
    };
  }
}

function loadRazorpayScript(): Promise<void> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Razorpay can only run in the browser."));
  }

  if (window.Razorpay) {
    return Promise.resolve();
  }

  return new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
    if (existing) {
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () => reject(new Error("Failed to load Razorpay checkout.")));
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Razorpay checkout."));
    document.body.appendChild(script);
  });
}

function checkoutUrl(path: "create-order" | "verify") {
  return typeof window !== "undefined"
    ? `/api/checkout/${path}`
    : `${publicBackendBaseUrl}/api/checkout/${path}`;
}

export async function createCheckoutOrder(input: {
  email: string;
  itemType: CheckoutItemType;
  itemId: number;
  couponCode?: string;
  name?: string;
  mobile?: string;
  state_id?: number;
  provider?: string;
  mobile_verified?: boolean;
}): Promise<CreateOrderResponse> {
  const profile = buildStudentCheckoutProfile(input.email);

  const response = await fetch(checkoutUrl("create-order"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: input.email,
      name: input.name ?? profile.name,
      mobile: input.mobile ?? profile.mobile,
      state_id: input.state_id ?? profile.state_id,
      provider: input.provider ?? profile.provider,
      mobile_verified: input.mobile_verified ?? profile.mobile_verified,
      item_type: input.itemType,
      item_id: input.itemId,
      coupon_code: input.couponCode || undefined,
    }),
  });

  const data = await response.json().catch(() => ({})) as CreateOrderResponse & {
    message?: string;
    errors?: Record<string, string[]>;
  };

  if (!response.ok) {
    const message = Object.values(data.errors || {})[0]?.[0] || data.message || "Unable to create checkout order.";
    throw new Error(message);
  }

  return data;
}

export async function verifyCheckoutPayment(input: {
  email: string;
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  name?: string;
  mobile?: string;
  state_id?: number;
  provider?: string;
  mobile_verified?: boolean;
}) {
  const profile = buildStudentCheckoutProfile(input.email);

  const response = await fetch(checkoutUrl("verify"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: input.email,
      name: input.name ?? profile.name,
      mobile: input.mobile ?? profile.mobile,
      state_id: input.state_id ?? profile.state_id,
      provider: input.provider ?? profile.provider,
      mobile_verified: input.mobile_verified ?? profile.mobile_verified,
      razorpay_order_id: input.razorpay_order_id,
      razorpay_payment_id: input.razorpay_payment_id,
      razorpay_signature: input.razorpay_signature,
    }),
  });

  const data = await response.json().catch(() => ({})) as {
    purchases?: StudentPurchase[];
    message?: string;
    errors?: Record<string, string[]>;
  };

  if (!response.ok) {
    const message = Object.values(data.errors || {})[0]?.[0] || data.message || "Payment verification failed.";
    throw new Error(message);
  }

  return data;
}

export async function fetchStudentPurchases(email: string): Promise<StudentPurchase[]> {
  const response = await fetch(`${publicBackendBaseUrl}/api/student/purchases?email=${encodeURIComponent(email)}`);
  if (!response.ok) return [];
  const data = await response.json() as { purchases?: StudentPurchase[] };
  return data.purchases || [];
}

export async function startRazorpayCheckout(input: {
  email: string;
  itemType: CheckoutItemType;
  itemId: number;
  itemTitle: string;
  couponCode?: string;
  onSuccess?: (purchases: StudentPurchase[]) => void;
}): Promise<void> {
  if (!isStudentLoggedIn()) {
    throw new Error("Please login to purchase.");
  }

  const session = getStudentSession();
  if (!session?.email) {
    throw new Error("Please login to purchase.");
  }

  const checkout = await createCheckoutOrder({
    email: session.email,
    itemType: input.itemType,
    itemId: input.itemId,
    couponCode: input.couponCode,
  });

  if (checkout.free) {
    input.onSuccess?.(checkout.purchases || []);
    return;
  }

  if (!checkout.razorpay) {
    throw new Error("Razorpay checkout details missing.");
  }

  await loadRazorpayScript();

  await new Promise<void>((resolve, reject) => {
    const razorpay = new window.Razorpay!({
      key: checkout.razorpay!.key_id,
      amount: checkout.razorpay!.amount,
      currency: checkout.razorpay!.currency,
      name: "KR Logics LMS",
      description: input.itemTitle,
      order_id: checkout.razorpay!.order_id,
      prefill: checkout.prefill,
      theme: { color: "#172a69" },
      handler: async (paymentResponse: {
        razorpay_order_id: string;
        razorpay_payment_id: string;
        razorpay_signature: string;
      }) => {
        try {
          const verified = await verifyCheckoutPayment({
            email: session.email,
            razorpay_order_id: paymentResponse.razorpay_order_id,
            razorpay_payment_id: paymentResponse.razorpay_payment_id,
            razorpay_signature: paymentResponse.razorpay_signature,
          });
          input.onSuccess?.(verified.purchases || []);
          resolve();
        } catch (error) {
          reject(error);
        }
      },
      modal: {
        ondismiss: () => reject(new Error("Payment cancelled.")),
      },
    });

    razorpay.on("payment.failed", (response) => {
      reject(new Error(response.error?.description || "Payment failed."));
    });

    razorpay.open();
  });
}

export function hasPurchase(
  purchases: StudentPurchase[],
  itemType: CheckoutItemType,
  itemId: number,
): boolean {
  return purchases.some(
    (purchase) => purchase.purchasable_type === itemType && purchase.purchasable_id === itemId,
  );
}
