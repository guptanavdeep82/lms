"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Loader2, PlayCircle, X } from "lucide-react";
import { RazorpayCheckoutButton } from "@/components/payments/RazorpayCheckoutButton";
import { fetchStudentAccess, startRazorpayCheckout } from "@/lib/checkout";
import { type CoursePricingPlan } from "@/lib/courses";
import { formatInr } from "@/lib/packages";
import { getStudentSession, isStudentLoggedIn } from "@/lib/student-auth";

type CoursePurchaseActionsProps = {
  courseId: number;
  courseSlug: string;
  courseTitle: string;
  price: number;
  pricingPlans?: CoursePricingPlan[];
  isPdfCourse: boolean;
  isLiveCourse?: boolean;
  saleClosed?: boolean;
};

export function CoursePurchaseActions({
  courseId,
  courseSlug,
  courseTitle,
  price,
  pricingPlans = [],
  isPdfCourse,
  isLiveCourse = false,
  saleClosed = false,
}: CoursePurchaseActionsProps) {
  const [checkingAccess, setCheckingAccess] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  const [planOpen, setPlanOpen] = useState(false);

  useEffect(() => {
    const session = getStudentSession();
    if (!session?.email) {
      setCheckingAccess(false);
      return;
    }

    fetchStudentAccess(session.email, "course", courseId)
      .then(setHasAccess)
      .finally(() => setCheckingAccess(false));
  }, [courseId]);

  if (checkingAccess) {
    return (
      <div className="mt-5 grid place-items-center py-4">
        <Loader2 className="size-5 animate-spin text-[#172a69]" />
      </div>
    );
  }

  if (hasAccess) {
    return (
      <div className="mt-5 grid gap-3">
        <span className="inline-flex h-12 w-full items-center justify-center rounded-lg bg-[#ecfdf3] text-sm font-extrabold text-[#027a48]">
          Course Unlocked
        </span>
        <Link
          href={isPdfCourse ? `/courses/${courseSlug}` : isLiveCourse ? `/live-classes/course/${courseSlug}` : `/student/courses/${courseSlug}/learn`}
          className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-[#172a69] text-sm font-extrabold text-white transition hover:bg-[#10215a]"
        >
          <PlayCircle className="size-4" /> Continue Learning
        </Link>
      </div>
    );
  }

  if (saleClosed) {
    return (
      <div className="mt-5 grid gap-3">
        <span className="inline-flex h-12 w-full items-center justify-center rounded-lg bg-[#fee4e2] text-sm font-extrabold text-[#b42318]">
          Enrollment Closed
        </span>
        <p className="text-center text-xs font-semibold text-slate-500">
          This course is no longer available for purchase.
        </p>
        <Link href="/courses" className="inline-flex h-12 items-center justify-center rounded-lg border border-[#050808] text-sm font-extrabold text-[#050808] transition hover:bg-[#050808] hover:text-white">
          Browse Other Courses
        </Link>
      </div>
    );
  }

  if (pricingPlans.length > 0) {
    return (
      <div className="mt-5 grid gap-3">
        {isStudentLoggedIn() ? (
          <button
            type="button"
            onClick={() => setPlanOpen(true)}
            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#ffd21f] text-sm font-extrabold text-[#050808] transition hover:bg-[#ffe164]"
          >
            Purchase Course
          </button>
        ) : (
          <Link
            href={`/login?redirect=${encodeURIComponent(`/courses/${courseSlug}`)}`}
            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#ffd21f] text-sm font-extrabold text-[#050808] transition hover:bg-[#ffe164]"
          >
            Login to Purchase
          </Link>
        )}
        <Link href="/register" className="inline-flex h-12 items-center justify-center gap-2 rounded-lg border border-[#050808] text-sm font-extrabold text-[#050808] transition hover:bg-[#050808] hover:text-white">
          <PlayCircle className="size-4" /> {isPdfCourse ? "Register and Download Sample" : isLiveCourse ? "Register and Join Live Class" : "Register and Preview"}
        </Link>
        {planOpen ? (
          <PricingPlanModal
            plans={pricingPlans}
            courseTitle={courseTitle}
            courseId={courseId}
            onClose={() => setPlanOpen(false)}
            onPurchased={() => {
              setPlanOpen(false);
              setHasAccess(true);
            }}
          />
        ) : null}
      </div>
    );
  }

  return (
    <div className="mt-5 grid gap-3">
      <RazorpayCheckoutButton
        itemType="course"
        itemId={courseId}
        itemTitle={courseTitle}
        price={price}
        successRedirect="/student/courses"
        label={price <= 0 ? "Enroll Free" : "Purchase Course"}
        purchasedLabel="Course Purchased"
        className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#ffd21f] text-sm font-extrabold text-[#050808] transition hover:bg-[#ffe164]"
      />
      <Link href="/register" className="inline-flex h-12 items-center justify-center gap-2 rounded-lg border border-[#050808] text-sm font-extrabold text-[#050808] transition hover:bg-[#050808] hover:text-white">
        <PlayCircle className="size-4" /> {isPdfCourse ? "Register and Download Sample" : isLiveCourse ? "Register and Join Live Class" : "Register and Preview"}
      </Link>
    </div>
  );
}

function PricingPlanModal({
  plans,
  courseId,
  courseTitle,
  onClose,
  onPurchased,
}: {
  plans: CoursePricingPlan[];
  courseId: number;
  courseTitle: string;
  onClose: () => void;
  onPurchased: () => void;
}) {
  const [selectedId, setSelectedId] = useState(plans[0]?.id ?? 0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const buy = async () => {
    const session = getStudentSession();
    if (!session?.email) return;
    setLoading(true);
    setError("");
    try {
      await startRazorpayCheckout({
        email: session.email,
        itemType: "course",
        itemId: courseId,
        itemTitle: courseTitle,
        pricingPlanId: selectedId,
        onSuccess: () => onPurchased(),
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to start payment.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/45 p-4" role="dialog" aria-modal="true" aria-labelledby="pricing-plan-title">
      <div className="w-full max-w-xl overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between px-5 py-4">
          <h2 id="pricing-plan-title" className="text-lg font-extrabold text-[#111827]">Select a Pricing Plan</h2>
          <button type="button" onClick={onClose} className="grid size-8 place-items-center rounded-full text-slate-500 hover:bg-slate-100" aria-label="Close">
            <X className="size-4" />
          </button>
        </div>
        <div className="grid gap-3 px-5 pb-4">
          {plans.map((plan) => {
            const selected = plan.id === selectedId;
            const offer = plan.sale_price !== null && plan.sale_price < plan.price ? plan.sale_price : plan.price;
            const original = plan.sale_price !== null && plan.sale_price < plan.price ? plan.price : null;
            return (
              <button
                key={plan.id}
                type="button"
                onClick={() => setSelectedId(plan.id)}
                className={`flex items-center justify-between gap-3 rounded-xl border px-4 py-4 text-left ${selected ? "border-slate-200 bg-[#f3f4f6]" : "border-slate-200 bg-white"}`}
              >
                <span className="text-sm font-semibold text-[#111827]">{plan.label}</span>
                <span className="flex items-center gap-2">
                  <span className="text-sm font-extrabold text-[#111827]">{formatInr(offer)}</span>
                  {original !== null ? <span className="text-sm font-semibold text-slate-400 line-through">{formatInr(original)}</span> : null}
                  {plan.discount_percent ? (
                    <span className="rounded-full bg-[#12b76a] px-2 py-1 text-[11px] font-extrabold text-white">{plan.discount_percent}% off</span>
                  ) : null}
                </span>
              </button>
            );
          })}
          {error ? <p className="text-sm font-semibold text-[#b42318]">{error}</p> : null}
        </div>
        <div className="px-5 pb-5">
          <button
            type="button"
            onClick={buy}
            disabled={loading || !selectedId}
            className="inline-flex h-12 w-full items-center justify-center rounded-xl bg-[#2f6bff] text-sm font-extrabold text-white disabled:opacity-60"
          >
            {loading ? <Loader2 className="size-4 animate-spin" /> : "Buy now"}
          </button>
        </div>
      </div>
    </div>
  );
}
