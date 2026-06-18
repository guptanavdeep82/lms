"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Loader2, PlayCircle } from "lucide-react";
import { RazorpayCheckoutButton } from "@/components/payments/RazorpayCheckoutButton";
import { fetchStudentAccess } from "@/lib/checkout";
import { getStudentSession } from "@/lib/student-auth";

type CoursePurchaseActionsProps = {
  courseId: number;
  courseTitle: string;
  price: number;
  isPdfCourse: boolean;
  isLiveCourse?: boolean;
};

export function CoursePurchaseActions({
  courseId,
  courseTitle,
  price,
  isPdfCourse,
  isLiveCourse = false,
}: CoursePurchaseActionsProps) {
  const [checkingAccess, setCheckingAccess] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);

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
          href="/student/courses"
          className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-[#172a69] text-sm font-extrabold text-white transition hover:bg-[#10215a]"
        >
          <PlayCircle className="size-4" /> Continue Learning
        </Link>
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
