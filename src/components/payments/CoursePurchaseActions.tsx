"use client";

import Link from "next/link";
import { PlayCircle } from "lucide-react";
import { RazorpayCheckoutButton } from "@/components/payments/RazorpayCheckoutButton";

type CoursePurchaseActionsProps = {
  courseId: number;
  courseTitle: string;
  price: number;
  isPdfCourse: boolean;
  isLiveCourse: boolean;
};

export function CoursePurchaseActions({
  courseId,
  courseTitle,
  price,
  isPdfCourse,
  isLiveCourse,
}: CoursePurchaseActionsProps) {
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
