"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, ShoppingBag } from "lucide-react";
import { CheckoutItemType, startRazorpayCheckout } from "@/lib/checkout";
import { getStudentSession, isStudentLoggedIn } from "@/lib/student-auth";

type RazorpayCheckoutButtonProps = {
  itemType: CheckoutItemType;
  itemId: number;
  itemTitle: string;
  price: number;
  className?: string;
  successRedirect?: string;
  label?: string;
  purchasedLabel?: string;
  alreadyPurchased?: boolean;
  onPurchased?: () => void;
};

export function RazorpayCheckoutButton({
  itemType,
  itemId,
  itemTitle,
  price,
  className,
  successRedirect,
  label,
  purchasedLabel = "Already Purchased",
  alreadyPurchased = false,
  onPurchased,
}: RazorpayCheckoutButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [purchased, setPurchased] = useState(alreadyPurchased);
  const [loginHref, setLoginHref] = useState("/login");

  useEffect(() => {
    setLoginHref(`/login?redirect=${encodeURIComponent(window.location.pathname)}`);
  }, []);

  if (purchased) {
    return (
      <span className={className || "inline-flex h-12 items-center justify-center rounded-lg bg-[#ecfdf3] px-5 text-sm font-extrabold text-[#027a48]"}>
        {purchasedLabel}
      </span>
    );
  }

  if (!isStudentLoggedIn()) {
    return (
      <Link
        href={loginHref}
        className={className || "inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-[#ffd21f] text-sm font-extrabold text-[#050808] transition hover:bg-[#ffe164]"}
      >
        <ShoppingBag className="size-4" /> Login to Purchase
      </Link>
    );
  }

  const handlePurchase = async () => {
    const session = getStudentSession();
    if (!session?.email) {
      router.push("/login");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await startRazorpayCheckout({
        email: session.email,
        itemType,
        itemId,
        itemTitle,
        onSuccess: () => {
          setPurchased(true);
          onPurchased?.();
          if (successRedirect) {
            router.push(successRedirect);
          }
        },
      });
    } catch (purchaseError) {
      setError(purchaseError instanceof Error ? purchaseError.message : "Payment failed.");
    } finally {
      setLoading(false);
    }
  };

  const buttonLabel = label || (price <= 0 ? "Enroll Free" : "Purchase Now");

  return (
    <div className="grid gap-2">
      <button
        type="button"
        onClick={handlePurchase}
        disabled={loading}
        className={className || "inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-[#ffd21f] text-sm font-extrabold text-[#050808] transition hover:bg-[#ffe164] disabled:opacity-70"}
      >
        {loading ? <Loader2 className="size-4 animate-spin" /> : <ShoppingBag className="size-4" />}
        {loading ? "Processing..." : buttonLabel}
      </button>
      {error ? <p className="rounded-xl bg-[#fff8d6] px-3 py-2 text-xs font-bold text-[#7a5b00]">{error}</p> : null}
    </div>
  );
}
